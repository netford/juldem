import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Импорт изображений отзывов
import review001 from '../assets/images/reviews/reviews_001.png';
import review002 from '../assets/images/reviews/reviews_002.png';
import review003 from '../assets/images/reviews/reviews_003.png';
import review004 from '../assets/images/reviews/reviews_004.png';
import review005 from '../assets/images/reviews/reviews_005.png';
import review006 from '../assets/images/reviews/reviews_006.png';
import review007 from '../assets/images/reviews/reviews_007.png';
import review008 from '../assets/images/reviews/reviews_008.png';
import review009 from '../assets/images/reviews/reviews_009.png';

import styles from './ReviewsCarousel.module.css';

const ReviewsSection = () => {
  // Массив всех отзывов
  const reviews = [
    { id: 1, image: review001, alt: "Отзыв 1" },
    { id: 2, image: review002, alt: "Отзыв 2" },
    { id: 3, image: review003, alt: "Отзыв 3" },
    { id: 4, image: review004, alt: "Отзыв 4" },
    { id: 5, image: review005, alt: "Отзыв 5" },
    { id: 6, image: review006, alt: "Отзыв 6" },
    { id: 7, image: review007, alt: "Отзыв 7" },
    { id: 8, image: review008, alt: "Отзыв 8" },
    { id: 9, image: review009, alt: "Отзыв 9" }
  ];

  // Текущий индекс активного отзыва
  const [activeIndex, setActiveIndex] = useState(0);
  // Направление анимации (-1: влево, 1: вправо)
  const [direction, setDirection] = useState(0);
  // Состояние анимации
  const [isAnimating, setIsAnimating] = useState(false);
  // Количество видимых отзывов
  const [visibleCount, setVisibleCount] = useState(3);
  // Ссылка на контейнер карусели
  const carouselRef = useRef(null);
  // Позиция мыши для параллакс-эффекта
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Флаг мобильного устройства
  const [isMobile, setIsMobile] = useState(false);

  // Обнаружение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setVisibleCount(mobile ? 1 : 3);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Обработчик движения мыши для параллакс-эффекта
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (carouselRef.current && !isMobile) {
        const rect = carouselRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Относительная позиция мыши от -1 до 1
        const relativeX = (e.clientX - centerX) / (rect.width / 2);
        const relativeY = (e.clientY - centerY) / (rect.height / 2);
        
        setMousePosition({
          x: relativeX,
          y: relativeY
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Функция для прокрутки влево
  const scrollLeft = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(-1);
    
    setTimeout(() => {
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
      );
      
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(0);
      }, 50);
    }, 500);
  };
  
  // Функция для прокрутки вправо
  const scrollRight = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(1);
    
    setTimeout(() => {
      setActiveIndex((prevIndex) => 
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
      
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(0);
      }, 50);
    }, 500);
  };
  
  // Получение видимых отзывов с учетом цикличности
  const getVisibleReviews = () => {
    const halfCount = Math.floor(visibleCount / 2);
    const result = [];
    
    for (let i = -halfCount; i <= halfCount; i++) {
      let index = activeIndex + i;
      
      // Обработка циклического перехода
      if (index < 0) index = reviews.length + index;
      if (index >= reviews.length) index = index - reviews.length;
      
      result.push({
        review: reviews[index],
        position: i,
        index: index
      });
    }
    
    return result;
  };

  // Расчет параллакс-эффекта для каждого слайда
  const getParallaxStyle = (position) => {
    if (isMobile) return {};
    
    // Базовое смещение в зависимости от позиции слайда
    const baseOffsetX = position * 350; // Расстояние между слайдами
    
    // Смещение из-за направления анимации
    const directionOffsetX = direction * 150; // Смещение при анимации
    
    // Параллакс-эффект от движения мыши (слабее для центрального элемента)
    const mouseParallaxX = mousePosition.x * 30 * Math.abs(position);
    const mouseParallaxY = mousePosition.y * 15 * Math.abs(position);
    
    // Расчет z-индекса (центральный элемент впереди)
    const zIndex = 10 - Math.abs(position);
    
    // Угол наклона (для эффекта перспективы)
    const rotateY = -mousePosition.x * 10 * Math.abs(position);
    
    return {
      transform: `
        translateX(${baseOffsetX + directionOffsetX + mouseParallaxX}px)
        translateY(${mouseParallaxY}px)
        rotateY(${rotateY}deg)
        scale(${1 - Math.abs(position) * 0.15})
      `,
      zIndex: zIndex,
      opacity: 1 - Math.abs(position) * 0.25
    };
  };

  // Расчет параллакс-эффекта для изображения внутри слайда
  const getImageParallaxStyle = (position) => {
    if (isMobile) return {};
    
    // Противоположный микро-сдвиг для создания эффекта глубины
    const imageParallaxX = -mousePosition.x * 15 * Math.abs(position);
    const imageParallaxY = -mousePosition.y * 10 * Math.abs(position);
    
    return {
      transform: `
        translateX(${imageParallaxX}px)
        translateY(${imageParallaxY}px)
        scale(${position === 0 ? 1.05 : 1})
      `
    };
  };

  // Формируем видимые отзывы
  const visibleReviews = getVisibleReviews();

  // Мобильная версия карусели (без параллакса)
  const renderMobileCarousel = () => (
    <div className={styles.mobileCarousel}>
      <div 
        className={`${styles.mobileTrack} ${direction !== 0 ? (direction > 0 ? styles.slideLeft : styles.slideRight) : ''}`}
      >
        {reviews.map((review, index) => (
          <div 
            key={review.id} 
            className={`${styles.reviewContainer} ${index === activeIndex ? styles.activeSlide : ''}`}
          >
            <img src={review.image} alt={review.alt} className={styles.reviewImage} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Отзывы</h2>
        
        <div 
          ref={carouselRef}
          className={styles.carouselContainer}
        >
          <button 
            className={`${styles.carouselButton} ${styles.prevButton}`}
            onClick={scrollLeft}
            aria-label="Предыдущий отзыв"
            disabled={isAnimating}
          >
            <ChevronLeft size={24} />
          </button>
          
          {isMobile ? renderMobileCarousel() : (
            <div className={styles.parallaxStage}>
              {visibleReviews.map(({ review, position, index }) => (
                <div 
                  key={review.id} 
                  className={`${styles.reviewContainer} ${position === 0 ? styles.activeSlide : ''}`}
                  style={getParallaxStyle(position)}
                  onClick={() => {
                    if (!isAnimating && position !== 0) {
                      setIsAnimating(true);
                      setDirection(position > 0 ? -1 : 1);
                      
                      setTimeout(() => {
                        setActiveIndex(index);
                        
                        setTimeout(() => {
                          setIsAnimating(false);
                          setDirection(0);
                        }, 50);
                      }, 500);
                    }
                  }}
                >
                  <div className={styles.reviewInner}>
                    <img 
                      src={review.image} 
                      alt={review.alt} 
                      className={styles.reviewImage} 
                      style={getImageParallaxStyle(position)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button 
            className={`${styles.carouselButton} ${styles.nextButton}`}
            onClick={scrollRight}
            aria-label="Следующий отзыв"
            disabled={isAnimating}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className={styles.pagination}>
          {reviews.map((_, index) => (
            <button 
              key={index} 
              className={`${styles.paginationDot} ${index === activeIndex ? styles.activeDot : ''}`}
              aria-label={`Отзыв ${index + 1}`}
              onClick={() => {
                if (!isAnimating && index !== activeIndex) {
                  setIsAnimating(true);
                  setDirection(index > activeIndex ? 1 : -1);
                  
                  setTimeout(() => {
                    setActiveIndex(index);
                    
                    setTimeout(() => {
                      setIsAnimating(false);
                      setDirection(0);
                    }, 50);
                  }, 500);
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
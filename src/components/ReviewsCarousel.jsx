// ReviewsCarousel.jsx
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
  // Состояние анимации
  const [isAnimating, setIsAnimating] = useState(false);
  // Флаг мобильного устройства
  const [isMobile, setIsMobile] = useState(false);
  // Ссылка на контейнер карусели
  const carouselRef = useRef(null);
  // Ссылки для свайпа
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  
  // Состояние масштаба изображения на мобильных
  const [scale, setScale] = useState(1);
  // Отслеживаем направление свайпа (горизонтальное или вертикальное)
  const [swipeDirection, setSwipeDirection] = useState(null);
  // Текущий сдвиг при анимации свайпа
  const [translateX, setTranslateX] = useState(0);

  // Обнаружение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Функция для прокрутки влево
  const scrollLeft = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Анимация свайпа вправо (предыдущий слайд появляется слева)
    setTranslateX(100); // Начинаем с положительного значения (слайд справа)
    
    // Плавно возвращаем к 0 для создания анимации
    setTimeout(() => {
      setTranslateX(50);
      setTimeout(() => {
        setTranslateX(0);
        
        // После завершения анимации меняем активный индекс
        setActiveIndex((prevIndex) => 
          prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
        );
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 100);
      }, 150);
    }, 10);
  };
  
  // Функция для прокрутки вправо
  const scrollRight = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Анимация свайпа влево (следующий слайд появляется справа)
    setTranslateX(-100); // Начинаем с отрицательного значения (слайд слева)
    
    // Плавно возвращаем к 0 для создания анимации
    setTimeout(() => {
      setTranslateX(-50);
      setTimeout(() => {
        setTranslateX(0);
        
        // После завершения анимации меняем активный индекс
        setActiveIndex((prevIndex) => 
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 100);
      }, 150);
    }, 10);
  };
  
  // Обработчики для свайпа
  const handleTouchStart = (e) => {
    // Сохраняем начальные координаты касания
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setSwipeDirection(null); // Сбрасываем направление свайпа
  };
  
  const handleTouchMove = (e) => {
    if (!isMobile) return;
    
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    // Определяем, является ли свайп горизонтальным или вертикальным
    if (swipeDirection === null) {
      const diffX = Math.abs(touchEndX.current - touchStartX.current);
      const diffY = Math.abs(touchEndY.current - touchStartY.current);
      
      // Если разница по X больше разницы по Y, считаем свайп горизонтальным
      if (diffX > diffY) {
        setSwipeDirection('horizontal');
      } else if (diffY > diffX * 1.5) { // Вертикальный свайп должен быть явно выраженным
        setSwipeDirection('vertical');
      }
    }
    
    // Обрабатываем горизонтальный свайп для переключения слайдов
    if (swipeDirection === 'horizontal' && !isAnimating) {
      const difference = touchStartX.current - touchEndX.current;
      const percentDiff = (difference / window.innerWidth) * 100;
      
      // Ограничиваем сдвиг до определенных пределов
      if (Math.abs(percentDiff) < 50) {
        setTranslateX(-percentDiff);
      }
      
      // Предотвращаем прокрутку страницы при горизонтальном свайпе
      e.preventDefault();
    }
    
    // Обрабатываем вертикальный свайп для масштабирования
    if (swipeDirection === 'vertical' && !isAnimating) {
      const difference = touchStartY.current - touchEndY.current;
      const newScale = Math.max(0.8, Math.min(1.5, 1 + difference / 500));
      setScale(newScale);
    }
  };
  
  const handleTouchEnd = () => {
    if (!isMobile || isAnimating) return;
    
    // Обрабатываем горизонтальный свайп
    if (swipeDirection === 'horizontal') {
      const difference = touchStartX.current - touchEndX.current;
      
      // Если свайп достаточно сильный (более 50px), переключаем слайд
      if (Math.abs(difference) > 50) {
        if (difference > 0) {
          // Свайп влево - следующий слайд
          scrollRight();
        } else {
          // Свайп вправо - предыдущий слайд
          scrollLeft();
        }
      } else {
        // Если свайп был недостаточно сильным, возвращаем слайд на место
        setTranslateX(0);
      }
    }
    
    // Сбрасываем масштаб при вертикальном свайпе
    if (swipeDirection === 'vertical') {
      // Плавно возвращаем к нормальному масштабу
      setTimeout(() => {
        setScale(1);
      }, 300);
    }
    
    // Сбрасываем направление свайпа
    setSwipeDirection(null);
  };
  
  // Получение видимых отзывов с учетом цикличности
  const getVisibleSlides = () => {
    if (isMobile) {
      // Для мобильных устройств показываем только текущий слайд
      return [{ review: reviews[activeIndex], position: 0, index: activeIndex }];
    }
    
    const result = [];
    
    // Индекс предыдущего слайда с циклическим переходом
    const prevIndex = activeIndex === 0 ? reviews.length - 1 : activeIndex - 1;
    
    // Индекс следующего слайда с циклическим переходом
    const nextIndex = activeIndex === reviews.length - 1 ? 0 : activeIndex + 1;
    
    // Добавляем предыдущий, текущий и следующий слайды
    result.push({ review: reviews[prevIndex], position: -1, index: prevIndex });
    result.push({ review: reviews[activeIndex], position: 0, index: activeIndex });
    result.push({ review: reviews[nextIndex], position: 1, index: nextIndex });
    
    return result;
  };

  // Рендер карусели
  const renderCarousel = () => {
    const visibleSlides = getVisibleSlides();
    
    return (
      <div 
        className={styles.carouselWrapper}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <div 
          className={`${styles.carouselTrack} ${isMobile ? styles.mobileTrack : ''}`}
          style={isMobile ? { 
            transform: `translateX(${translateX}px)`,
            transition: isAnimating ? 'transform 0.3s ease-out' : 'transform 0.1s ease-out'
          } : undefined}
        >
          {visibleSlides.map(({ review, position, index }) => (
            <div 
              key={review.id} 
              className={`${styles.reviewContainer} ${position === 0 ? styles.activeSlide : ''} ${isMobile ? styles.mobileReviewContainer : ''}`}
              style={isMobile ? {
                transform: `scale(${position === 0 ? scale : 1})`,
                transition: 'transform 0.3s ease-out'
              } : undefined}
              onClick={() => {
                if (!isAnimating && position !== 0 && !isMobile) {
                  setActiveIndex(index);
                }
              }}
            >
              <div className={styles.reviewInner}>
                <img 
                  src={review.image} 
                  alt={review.alt} 
                  className={styles.reviewImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Отзывы</h2>
        
        <div 
          ref={carouselRef}
          className={styles.carouselContainer}
        >
          {/* Кнопки навигации только для десктопа */}
          {!isMobile && (
            <>
              <button 
                className={`${styles.carouselButton} ${styles.prevButton} ${isAnimating ? styles.animating : ''}`}
                onClick={scrollLeft}
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              
              <button 
                className={`${styles.carouselButton} ${styles.nextButton} ${isAnimating ? styles.animating : ''}`}
                onClick={scrollRight}
                aria-label="Следующий отзыв"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </>
          )}
          
          {renderCarousel()}
        </div>
        
        <div className={styles.pagination}>
          {reviews.map((_, index) => (
            <button 
              key={index} 
              className={`${styles.paginationDot} ${index === activeIndex ? styles.activeDot : ''}`}
              aria-label={`Отзыв ${index + 1}`}
              onClick={() => {
                if (!isAnimating && index !== activeIndex) {
                  setActiveIndex(index);
                }
              }}
            />
          ))}
        </div>
        
        {/* Подсказка о свайпе только для мобильных */}
        {isMobile && (
          <div className={styles.swipeHint}>
            Листайте влево или вправо для просмотра других отзывов
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
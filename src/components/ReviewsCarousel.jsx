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
    
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  // Функция для прокрутки вправо
  const scrollRight = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setActiveIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  // Получение видимых отзывов с учетом цикличности
  const getVisibleSlides = () => {
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

  // Рендер основной карусели (для всех типов устройств)
  const renderCarousel = () => {
    const visibleSlides = getVisibleSlides();
    
    return (
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselTrack}>
          {visibleSlides.map(({ review, position, index }) => (
            <div 
              key={review.id} 
              className={`${styles.reviewContainer} ${position === 0 ? styles.activeSlide : ''}`}
              onClick={() => {
                if (!isAnimating && position !== 0) {
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
          <button 
            className={`${styles.carouselButton} ${styles.prevButton} ${isAnimating ? styles.animating : ''}`}
            onClick={scrollLeft}
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft size={24} />
          </button>
          
          {renderCarousel()}
          
          <button 
            className={`${styles.carouselButton} ${styles.nextButton} ${isAnimating ? styles.animating : ''}`}
            onClick={scrollRight}
            aria-label="Следующий отзыв"
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
                  setActiveIndex(index);
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
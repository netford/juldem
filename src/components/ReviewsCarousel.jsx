import React, { useState } from 'react';
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

  // Начальный индекс (показываем первые три отзыва)
  const [startIndex, setStartIndex] = useState(0);
  // Направление анимации (prev или next)
  const [animationDirection, setAnimationDirection] = useState(null);
  // Состояние анимации для блокировки множественных кликов
  const [isAnimating, setIsAnimating] = useState(false);

  // Количество отзывов, отображаемых одновременно
  const visibleCount = 3;
  
  // Функция для прокрутки влево
  const scrollLeft = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationDirection('prev');
    
    setTimeout(() => {
      setStartIndex((prevIndex) => 
        prevIndex === 0 ? reviews.length - visibleCount : prevIndex - 1
      );
      
      // Сбрасываем анимацию после завершения
      setTimeout(() => {
        setAnimationDirection(null);
        setIsAnimating(false);
      }, 50);
    }, 400);
  };
  
  // Функция для прокрутки вправо
  const scrollRight = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationDirection('next');
    
    setTimeout(() => {
      setStartIndex((prevIndex) => 
        prevIndex === reviews.length - visibleCount ? 0 : prevIndex + 1
      );
      
      // Сбрасываем анимацию после завершения
      setTimeout(() => {
        setAnimationDirection(null);
        setIsAnimating(false);
      }, 50);
    }, 400);
  };
  
  // Получаем текущие видимые отзывы с учетом кругового отображения
  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % reviews.length;
      result.push(reviews[index]);
    }
    return result;
  };
  
  // Видимые отзывы
  const visibleReviews = getVisibleReviews();

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Отзывы</h2>
        
        <div className={styles.carouselContainer}>
          <button 
            className={`${styles.carouselButton} ${styles.prevButton}`}
            onClick={scrollLeft}
            aria-label="Предыдущий отзыв"
            disabled={isAnimating}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className={styles.carouselTrackContainer}>
            <div className={`${styles.carouselTrack} ${animationDirection ? styles[`scale${animationDirection}`] : ''}`}>
              {visibleReviews.map((review, idx) => (
                <div 
                  key={review.id} 
                  className={`${styles.reviewContainer} ${
                    animationDirection === 'prev' && idx === 0 ? styles.scaleIn :
                    animationDirection === 'next' && idx === visibleCount - 1 ? styles.scaleIn :
                    animationDirection === 'prev' && idx === visibleCount - 1 ? styles.scaleOut :
                    animationDirection === 'next' && idx === 0 ? styles.scaleOut : ''
                  }`}
                >
                  <img src={review.image} alt={review.alt} className={styles.reviewImage} />
                </div>
              ))}
            </div>
          </div>
          
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
              className={`${styles.paginationDot} ${
                (index >= startIndex && index < startIndex + visibleCount) ||
                (startIndex + visibleCount > reviews.length && 
                 index < (startIndex + visibleCount) % reviews.length)
                  ? styles.activeDot : ''
              }`}
              aria-label={`Отзыв ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
import React, { useState, useEffect } from 'react';
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
  const allReviews = [
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

  // Количество отзывов, видимых одновременно (в зависимости от размера экрана)
  const [visibleReviews, setVisibleReviews] = useState(3);
  // Текущий индекс начального отзыва
  const [currentIndex, setCurrentIndex] = useState(0);
  // Состояние анимации
  const [isAnimating, setIsAnimating] = useState(false);
  // Направление анимации (next или prev)
  const [direction, setDirection] = useState('next');
  
  // Функция для определения количества видимых отзывов в зависимости от размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleReviews(1);
      } else if (window.innerWidth <= 1100) {
        setVisibleReviews(2);
      } else {
        setVisibleReviews(3);
      }
    };
    
    handleResize(); // Вызываем сразу для инициализации
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функция для перехода к предыдущему слайду
  const prevSlide = () => {
    if (isAnimating) return; // Предотвращаем множественные клики во время анимации
    
    setIsAnimating(true);
    setDirection('prev');
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? allReviews.length - 1 : prevIndex - 1
    );
    
    // Сбрасываем флаг анимации через 1.5 секунды (длительность анимации)
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  // Функция для перехода к следующему слайду
  const nextSlide = () => {
    if (isAnimating) return; // Предотвращаем множественные клики во время анимации
    
    setIsAnimating(true);
    setDirection('next');
    setCurrentIndex((prevIndex) => 
      prevIndex >= allReviews.length - 1 ? 0 : prevIndex + 1
    );
    
    // Сбрасываем флаг анимации через 1.5 секунды (длительность анимации)
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  // Получаем текущие видимые отзывы
  const getCurrentReviews = () => {
    // Создаем массив отзывов, который начинается с текущего индекса
    const reviews = [];
    for (let i = 0; i < visibleReviews; i++) {
      const index = (currentIndex + i) % allReviews.length;
      reviews.push(allReviews[index]);
    }
    return reviews;
  };

  // Рендерим текущие видимые отзывы
  const visibleReviewsToShow = getCurrentReviews();

  // Функция для обработки клика на точке пагинации
  const handleDotClick = (index) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  // Функция для создания индикаторов страниц
  const renderPagination = () => {
    const dots = [];
    
    for (let i = 0; i < allReviews.length; i++) {
      // Активной должна быть только точка, соответствующая текущему индексу
      const isActive = i === currentIndex;
      dots.push(
        <button 
          key={i} 
          className={`${styles.paginationDot} ${isActive ? styles.activeDot : ''}`}
          onClick={() => handleDotClick(i)}
          aria-label={`Перейти к отзыву ${i + 1}`}
          disabled={isAnimating}
        />
      );
    }
    
    return dots;
  };

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Отзывы</h2>
        
        <div className={styles.carouselContainer}>
          <button 
            className={`${styles.carouselButton} ${styles.prevButton}`}
            onClick={prevSlide}
            aria-label="Предыдущий отзыв"
            disabled={isAnimating}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div 
            className={styles.reviewsGrid} 
            data-animating={isAnimating ? "true" : "false"}
            data-direction={direction}
          >
            {visibleReviewsToShow.map((review) => (
              <div 
                key={review.id} 
                className={`${styles.reviewContainer}`}
              >
                <img src={review.image} alt={review.alt} className={styles.reviewImage} />
              </div>
            ))}
          </div>
          
          <button 
            className={`${styles.carouselButton} ${styles.nextButton}`}
            onClick={nextSlide}
            aria-label="Следующий отзыв"
            disabled={isAnimating}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className={styles.pagination}>
          {renderPagination()}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
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

  // Начальный индекс
  const [currentIndex, setCurrentIndex] = useState(0);
  // Направление вращения (1 для вправо, -1 для влево)
  const [direction, setDirection] = useState(0);
  // Состояние анимации для блокировки множественных кликов
  const [isAnimating, setIsAnimating] = useState(false);
  // Угол вращения куба
  const [rotationAngle, setRotationAngle] = useState(0);
  // Адаптация для мобильных устройств
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства при загрузке
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Количество отзывов, отображаемых одновременно для мобильных и десктопа
  const visibleCount = isMobile ? 1 : 3;
  
  // Расчет угла поворота для кубического эффекта
  const calculateRotationAngle = (index) => {
    // Угол грани куба для трех или одного элемента
    const anglePerFace = visibleCount === 3 ? 120 : 360;
    return index * -anglePerFace;
  };

  // Обновляем угол вращения при изменении индекса
  useEffect(() => {
    setRotationAngle(calculateRotationAngle(currentIndex));
  }, [currentIndex, visibleCount]);

  // Функция для прокрутки влево
  const scrollLeft = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(-1);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? Math.ceil(reviews.length / visibleCount) - 1 : prevIndex - 1
      );
      
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(0);
      }, 50);
    }, 500); // Подождать пока анимация почти завершится
  };
  
  // Функция для прокрутки вправо
  const scrollRight = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(1);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === Math.ceil(reviews.length / visibleCount) - 1 ? 0 : prevIndex + 1
      );
      
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(0);
      }, 50);
    }, 500); // Подождать пока анимация почти завершится
  };
  
  // Получаем отзывы для текущего индекса
  const getVisibleReviews = () => {
    const totalGroups = Math.ceil(reviews.length / visibleCount);
    const allGroupedReviews = [];
    
    // Создаем группы отзывов по 1 или 3 элемента
    for (let i = 0; i < totalGroups; i++) {
      const start = i * visibleCount;
      allGroupedReviews.push(reviews.slice(start, start + visibleCount));
    }
    
    // Добавляем пустые места для неполных групп
    const lastGroup = allGroupedReviews[allGroupedReviews.length - 1];
    while (lastGroup.length < visibleCount) {
      lastGroup.push(null);
    }
    
    return allGroupedReviews;
  };
  
  const groupedReviews = getVisibleReviews();
  
  // Стили для 3D-куба
  const cubeStyle = {
    transform: `rotateY(${rotationAngle + (direction * 30)}deg)`, // Добавляем направление для анимации
    transition: 'transform 0.6s cubic-bezier(0, 0.55, 0.45, 1)'
  };
  
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
          
          <div className={styles.scene}>
            <div 
              className={styles.cube} 
              style={cubeStyle}
            >
              {groupedReviews.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className={`${styles.cubeFace} ${groupIndex === currentIndex ? styles.currentFace : ''}`}
                  style={{ 
                    transform: `rotateY(${groupIndex * (visibleCount === 3 ? 120 : 360)}deg) translateZ(${visibleCount === 3 ? 250 : 200}px)`
                  }}
                >
                  <div className={styles.cubeFaceContent}>
                    {group.map((review, index) => review && (
                      <div 
                        key={review.id} 
                        className={styles.reviewContainer}
                        style={{
                          transform: visibleCount === 3 
                            ? `translateX(${(index - 1) * 110}%)`
                            : 'translateX(0)'
                        }}
                      >
                        <img src={review.image} alt={review.alt} className={styles.reviewImage} />
                      </div>
                    ))}
                  </div>
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
          {groupedReviews.map((_, index) => (
            <button 
              key={index} 
              className={`${styles.paginationDot} ${index === currentIndex ? styles.activeDot : ''}`}
              aria-label={`Группа отзывов ${index + 1}`}
              onClick={() => {
                if (isAnimating) return;
                setIsAnimating(true);
                setDirection(index > currentIndex ? 1 : -1);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setTimeout(() => {
                    setIsAnimating(false);
                    setDirection(0);
                  }, 50);
                }, 500);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
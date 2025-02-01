// ProductImageSlider.js
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import nonePhoto from '../assets/images/suits/none_photo.jpg';
import styles from './ProductImageSlider.module.css';

const ProductImageSlider = ({ images, onError }) => {
  // Состояния для слайдера
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [canSwipeLeft, setCanSwipeLeft] = useState(false);
  const [canSwipeRight, setCanSwipeRight] = useState(true);
  // Состояние для ленивой загрузки (показываем слайдер, когда он виден)
  const [isLoaded, setIsLoaded] = useState(false);

  const trackRef = useRef(null);
  // Ref для ленивой загрузки всего контейнера слайдера
  const lazyContainerRef = useRef(null);

  // Определяем мобильное устройство при монтировании и при ресайзе
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ленивое отображение слайдера: ждем, пока контейнер не попадет в область видимости
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect(); // Отключаем наблюдение, когда элемент стал видимым
          }
        });
      },
      { threshold: 0.1 }
    );
    if (lazyContainerRef.current) {
      observer.observe(lazyContainerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Для мобильной версии: отслеживаем текущий слайд и возможность свайпа
  useEffect(() => {
    if (!isMobile || !trackRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(trackRef.current.children).indexOf(entry.target);
            setCurrentIndex(index);
            setCanSwipeLeft(index > 0);
            setCanSwipeRight(index < images.length - 1);
          }
        });
      },
      {
        root: trackRef.current,
        threshold: 0.5
      }
    );

    Array.from(trackRef.current.children).forEach(child => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [isMobile, images.length]);

  // Функции для десктопного переключения слайдов
  const handlePrevSlide = () => {
    if (isMobile) return;
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextSlide = () => {
    if (isMobile) return;
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index) => {
    if (isMobile) {
      // Для мобильной версии: прокрутка к нужному изображению
      const imageElement = trackRef.current.children[index];
      imageElement.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    } else {
      setCurrentIndex(index);
    }
  };

  // Обработка клика по изображению для десктопа
  const handleImageClick = (e) => {
    if (isMobile) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;

    if (clickX < width / 2) {
      handlePrevSlide();
    } else {
      handleNextSlide();
    }
  };

  // Если слайдер еще не загрузился (не виден на экране), показываем placeholder
  if (!isLoaded) {
    return (
      <div ref={lazyContainerRef} className={styles.sliderContainer}>
        <img
          src={nonePhoto}
          alt="placeholder"
          className={styles.sliderImage}
        />
      </div>
    );
  }

  // Основной рендер слайдера, когда он уже виден
  return (
    <div ref={lazyContainerRef} className={styles.sliderContainer}>
      <div 
        className={styles.sliderTrack} 
        ref={trackRef}
        style={!isMobile ? { transform: `translateX(-${currentIndex * 100}%)` } : undefined}
        onClick={handleImageClick}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product view ${index + 1}`}
            className={styles.sliderImage}
            onError={(e) => {
              if (onError) {
                e.target.src = onError();
              }
            }}
            loading="lazy"
          />
        ))}
      </div>

      {/* Мобильные подсказки для свайпа */}
      {isMobile && images.length > 1 && (
        <div className={styles.swipeHints}>
          {canSwipeLeft && (
            <div className={`${styles.swipeHint} ${styles.left}`}>
              <div className={styles.swipeArrow}>
                <ArrowLeft />
              </div>
              <div className={styles.swipeArrow}>
                <ArrowLeft />
              </div>
              <div className={styles.swipeArrow}>
                <ArrowLeft />
              </div>
            </div>
          )}
          {canSwipeRight && (
            <div className={`${styles.swipeHint} ${styles.right}`}>
              <div className={styles.swipeArrow}>
                <ArrowRight />
              </div>
              <div className={styles.swipeArrow}>
                <ArrowRight />
              </div>
              <div className={styles.swipeArrow}>
                <ArrowRight />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Навигационные точки */}
      {images.length > 1 && (
        <div className={styles.navigation}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Перейти к изображению ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Стрелки только для десктопной версии */}
      {!isMobile && images.length > 1 && (
        <>
          <button 
            className={`${styles.arrowButton} ${styles.prevButton}`}
            onClick={handlePrevSlide}
            aria-label="Предыдущее изображение"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className={`${styles.arrowButton} ${styles.nextButton}`}
            onClick={handleNextSlide}
            aria-label="Следующее изображение"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductImageSlider;

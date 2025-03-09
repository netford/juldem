// src/components/ReadySuits.jsx
import React, { useState, useRef, useEffect } from 'react';
import useSuitFilter from '../hooks/useSuitFilter';
import SuitFilter from './SuitFilter';
import SuitGrid from './SuitGrid';
import styles from './ReadySuits.module.css';

function ReadySuits() {
  // Состояния для UI и анимаций
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerHeight, setContainerHeight] = useState('auto');
  const [prevVisibleSuits, setPrevVisibleSuits] = useState([]);
  
  // Ссылки для измерения и интерактивности
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  
  // Получаем функции из хука фильтрации
  const { activeFilter, setActiveFilter, filteredSuits, getCountForFilter } = useSuitFilter();

  // Отслеживаем видимость секции
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Показываем намёк на скролл для мобильных устройств
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowScrollHint(true);
      const timer = setTimeout(() => {
        setShowScrollHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Оптимизированный обработчик изменения фильтра с плавной анимацией
  const handleFilterChange = (e) => {
    if (isTransitioning) return; // Предотвращаем повторные клики во время анимации

    const newFilter = e.target.value;
    if (newFilter === activeFilter) return;

    // Запоминаем текущую высоту и видимые элементы
    if (contentRef.current) {
      setContainerHeight(`${contentRef.current.offsetHeight}px`);
    }

    // Сохраняем текущие элементы как предыдущие
    setPrevVisibleSuits(filteredSuits);

    // Начинаем анимацию
    setIsTransitioning(true);

    // Настраиваем длительность анимации
    const animationDuration = Math.min(400, Math.max(200, 100 + filteredSuits.length * 10));

    // Анимация исчезновения текущих элементов
    setTimeout(() => {
      // Устанавливаем новый фильтр
      setActiveFilter(newFilter);
      
      // Адаптируем высоту контейнера к новому контенту
      setTimeout(() => {
        if (contentRef.current) {
          setContainerHeight(`${contentRef.current.offsetHeight}px`);
        }
        
        // Завершаем анимацию
        setTimeout(() => {
          setIsTransitioning(false);
          setContainerHeight('auto');
        }, animationDuration);
      }, 50);
    }, animationDuration - 50);
  };

  return (
    <section ref={sectionRef} id="our-works" className={styles.readySuitsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Наши работы</h2>
      </div>

      {/* Фильтрация товаров */}
      <SuitFilter 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        getCountForFilter={getCountForFilter}
        isTransitioning={isTransitioning}
      />

      {/* Контейнер для анимации перехода */}
      <div 
        className={styles.transitionContainer}
        style={{
          height: containerHeight
        }}
        ref={contentRef}
      >
        {/* Отображение сетки товаров */}
        <SuitGrid 
          suits={isTransitioning ? prevVisibleSuits : filteredSuits}
          isTransitioning={isTransitioning}
        />
      </div>
    </section>
  );
}

export default ReadySuits;
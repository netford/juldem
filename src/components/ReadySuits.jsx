// src/components/ReadySuits.jsx
import React, { useState, useRef, useEffect } from 'react';
import useSuitFilter from '../hooks/useSuitFilter';
import SuitFilter from './SuitFilter';
import SuitGrid from './SuitGrid';
import SuitCard from './SuitCard';
import styles from './ReadySuits.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // импортируем иконки стрелок

function ReadySuits() {
 // Состояния для UI и анимаций
 const [showScrollHint, setShowScrollHint] = useState(false);
 const [isTransitioning, setIsTransitioning] = useState(false);
 const [containerHeight, setContainerHeight] = useState('auto');
 const [prevVisibleSuits, setPrevVisibleSuits] = useState([]);
 
 // Новые состояния и рефы для навигации
 const [scrollPosition, setScrollPosition] = useState(0);
 const [showNavigation, setShowNavigation] = useState(false);
 const [navButtonStates, setNavButtonStates] = useState({ left: false, right: true });
 const gridRef = useRef(null);
 
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

 // Проверяем наличие прокрутки и отображаем навигацию только на десктопе
 useEffect(() => {
   const checkScrollability = () => {
     if (gridRef.current && window.innerWidth > 768) {
       const { scrollWidth, clientWidth } = gridRef.current;
       const canScroll = scrollWidth > clientWidth;
       setShowNavigation(canScroll);
       
       // Получение текущей позиции скролла
       const currentScrollLeft = gridRef.current.scrollLeft;
       
       // Обновляем состояние кнопок с учетом текущей позиции
       const isAtEnd = Math.ceil(currentScrollLeft + clientWidth) >= scrollWidth - 2;
       const isAtStart = currentScrollLeft <= 2;
       
       setNavButtonStates({
         left: !isAtStart && canScroll,
         right: !isAtEnd && canScroll
       });
     } else {
       setShowNavigation(false);
       setNavButtonStates({ left: false, right: false });
     }
   };

   checkScrollability();
   window.addEventListener('resize', checkScrollability);
   return () => window.removeEventListener('resize', checkScrollability);
 }, [filteredSuits]);

 // Отслеживаем скролл для обновления состояния кнопок
 useEffect(() => {
   const grid = gridRef.current;
   if (!grid) return;

   const handleGridScroll = () => {
     setScrollPosition(grid.scrollLeft);

     // Более точное определение конца прокрутки
     const isAtEnd = Math.ceil(grid.scrollLeft + grid.clientWidth) >= grid.scrollWidth - 2;
     const isAtStart = grid.scrollLeft <= 2;

     // Обновляем состояние кнопок
     setNavButtonStates({
       left: !isAtStart,
       right: !isAtEnd
     });
   };

   grid.addEventListener('scroll', handleGridScroll);
   
   // Инициализация состояния кнопок
   handleGridScroll();

   return () => {
     grid.removeEventListener('scroll', handleGridScroll);
   };
 }, [filteredSuits]);

 // Обновление состояния кнопок при завершении анимации перехода
 useEffect(() => {
   if (!isTransitioning && gridRef.current) {
     const { scrollWidth, clientWidth } = gridRef.current;
     const canScroll = scrollWidth > clientWidth;
     
     // Явно проверяем и обновляем видимость навигации
     setShowNavigation(canScroll && window.innerWidth > 768);
     
     setNavButtonStates({
       left: false, // В начальной позиции левая кнопка неактивна
       right: canScroll // Правая активна, если есть что скроллить
     });
   }
 }, [isTransitioning]);

 // Отслеживаем изменение количества отфильтрованных элементов
 useEffect(() => {
   // Добавляем небольшую задержку, чтобы DOM успел обновиться
   const timer = setTimeout(() => {
     if (gridRef.current && !isTransitioning) {
       const { scrollWidth, clientWidth } = gridRef.current;
       const canScroll = scrollWidth > clientWidth;
       
       setShowNavigation(canScroll && window.innerWidth > 768);
       
       setNavButtonStates({
         left: gridRef.current.scrollLeft > 2,
         right: canScroll && Math.ceil(gridRef.current.scrollLeft + clientWidth) < scrollWidth - 2
       });
     }
   }, 150);
   
   return () => clearTimeout(timer);
 }, [filteredSuits.length, isTransitioning]); // Реагируем на изменение количества элементов

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
         setScrollPosition(0); // Сбрасываем позицию скролла при смене фильтра
         
         if (gridRef.current) {
           gridRef.current.scrollLeft = 0;
           
           // Добавляем проверку на возможность прокрутки и видимость кнопок после полного обновления DOM
           setTimeout(() => {
             if (gridRef.current) {
               // Явно перепроверяем возможность скролла
               const { scrollWidth, clientWidth } = gridRef.current;
               const canScroll = scrollWidth > clientWidth;
               
               // Обновляем видимость навигации и состояние кнопок
               setShowNavigation(canScroll && window.innerWidth > 768);
               
               setNavButtonStates({
                 left: false, // После сброса скролла левая кнопка всегда неактивна
                 right: canScroll // Правая активна только если есть что скроллить
               });
             }
           }, 100); // Увеличиваем задержку для надежности обновления DOM
         }
       }, animationDuration);
     }, 50);
   }, animationDuration - 50);
 };

 // Обработчики для навигационных кнопок
 const handleScrollLeft = () => {
   if (!gridRef.current) return;
   
   const scrollAmount = gridRef.current.clientWidth * 0.8; // Прокручиваем на 80% ширины
   const newPosition = Math.max(0, gridRef.current.scrollLeft - scrollAmount);
   
   gridRef.current.scrollTo({
     left: newPosition,
     behavior: 'smooth'
   });
   
   // Обновляем кнопки после завершения анимации
   setTimeout(() => {
     if (gridRef.current) {
       const isAtStart = gridRef.current.scrollLeft <= 2;
       setNavButtonStates(prev => ({
         ...prev,
         left: !isAtStart
       }));
     }
   }, 500);
 };

 const handleScrollRight = () => {
   if (!gridRef.current) return;
   
   const scrollAmount = gridRef.current.clientWidth * 0.8; // Прокручиваем на 80% ширины
   const newPosition = Math.min(
     gridRef.current.scrollWidth - gridRef.current.clientWidth,
     gridRef.current.scrollLeft + scrollAmount
   );
   
   gridRef.current.scrollTo({
     left: newPosition,
     behavior: 'smooth'
   });
   
   // Обновляем кнопки после завершения анимации
   setTimeout(() => {
     if (gridRef.current) {
       const isAtEnd = Math.ceil(gridRef.current.scrollLeft + gridRef.current.clientWidth) >= gridRef.current.scrollWidth - 2;
       setNavButtonStates(prev => ({
         ...prev,
         right: !isAtEnd
       }));
     }
   }, 500);
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
         height: containerHeight,
         position: 'relative'
       }}
       ref={contentRef}
     >
       {/* Навигационные стрелки для десктопа */}
       {showNavigation && window.innerWidth > 768 && (
         <>
           <button 
             className={`${styles.navButton} ${styles.navButtonLeft} ${!navButtonStates.left ? styles.navButtonDisabled : ''}`}
             onClick={handleScrollLeft}
             disabled={!navButtonStates.left}
             aria-label="Предыдущие товары"
           >
             <ChevronLeft size={32} />
           </button>
           <button 
             className={`${styles.navButton} ${styles.navButtonRight} ${!navButtonStates.right ? styles.navButtonDisabled : ''}`}
             onClick={handleScrollRight}
             disabled={!navButtonStates.right}
             aria-label="Следующие товары"
           >
             <ChevronRight size={32} />
           </button>
         </>
       )}
       
       {/* Для мобильных - стандартная прокрутка */}
       {window.innerWidth <= 768 ? (
         <div className={styles.scrollContainer}>
           <div 
             className={`${styles.deliveryRow} ${showScrollHint ? styles.scrollHint : ''}`}
             style={{
               display: 'flex',
               width: `${(isTransitioning ? prevVisibleSuits : filteredSuits).length * (280 + 16)}px`,
               gap: '16px',
             }}
           >
             {/* Напрямую отображаем карточки вместо использования SuitGrid */}
             {(isTransitioning ? prevVisibleSuits : filteredSuits).map((suit) => (
               <div
                 key={suit.id}
                 style={{ width: '280px' }}
               >
                 <SuitCard suit={suit} />
               </div>
             ))}
           </div>
         </div>
       ) : (
         /* Для десктопа - прокрутка с кнопками */
         <div 
           className={styles.gridScrollContainer}
           ref={gridRef}
         >
           <div className={styles.gridInnerContainer}>
             <SuitGrid 
               suits={isTransitioning ? prevVisibleSuits : filteredSuits}
               isTransitioning={isTransitioning}
             />
           </div>
         </div>
       )}
     </div>
   </section>
 );
}

export default ReadySuits;
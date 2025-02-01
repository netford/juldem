// ReadySuits.js
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShoppingBag, MessageCircle, Phone } from 'lucide-react';
import ProductImageSlider from './ProductImageSlider';
import SuitCard from './SuitCard';
import styles from './ReadySuits.module.css';
import { FixedSizeList as List } from 'react-window';

import nonePhoto from '../assets/images/suits/none_photo.jpg';
import snegurochka from '../assets/images/suits/snegurochka.jpg';
import snegurochka01 from '../assets/images/suits/snegurochka_01.png';
import snegurochka02 from '../assets/images/suits/snegurochka_02.png';
import snegurochka03 from '../assets/images/suits/snegurochka_03.png';

// Вынесение данных товаров за пределы компонента
const suits = [
  {
    id: 1,
    name: "Купальник 'Аврора'",
    category: "gymnastics",
    price: 15000,
    height: "130-139 см.",
    description: "Гимнастический купальник с кристаллами Swarovski",
    images: [nonePhoto],
    available: true,
    tags: ['Новинка']
  },
  {
    id: 2,
    name: "Купальник 'Снегурочка'",
    category: "figure-skating",
    price: 17000,
    height: "125-129 см.",
    description: "Купальник для фигурного катания с градиентом",
    images: [snegurochka, snegurochka01, snegurochka02, snegurochka03],
    available: true
  },
  {
    id: 3,
    name: "Купальник 'Лилия'",
    category: "gymnastics",
    price: 16000,
    height: "до 124 см.",
    description: "Купальник с цветочным орнаментом",
    images: [nonePhoto],
    available: false
  },
  {
    id: 4,
    name: "Купальник 'Снежинка'",
    category: "figure-skating",
    price: 18500,
    height: "140-154 см.",
    description: "Купальник для фигурного катания с узором из страз",
    images: [nonePhoto],
    available: false
  },
  {
    id: 5,
    name: "Купальник 'Феникс'",
    category: "acrobatics",
    price: 16500,
    height: "от 155 см.",
    description: "Купальник для спортивной акробатики с эффектом омбре",
    images: [nonePhoto],
    available: true
  }
];

function ReadySuits() {
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef(null);

  // Наблюдатель для отложенного рендеринга (если требуется)
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

  const filteredSuits = useMemo(() => {
    return suits.filter(suit => {
      if (activeFilter === 'all') return true;
      if (activeFilter === suit.category) return true;
      if (activeFilter === 'sold') return !suit.available;
      if (activeFilter.startsWith('available')) {
        if (!suit.available) return false;
        if (activeFilter === 'available') return true;
        const heightRange = activeFilter.split('-')[1];
        switch (heightRange) {
          case '124':
            return suit.height === 'до 124 см.';
          case '129':
            return suit.height === '125-129 см.';
          case '139':
            return suit.height === '130-139 см.';
          case '154':
            return suit.height === '140-154 см.';
          case '155':
            return suit.height === 'от 155 см.';
          default:
            return false;
        }
      }
      return false;
    });
  }, [activeFilter]);

  const EmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <p className={styles.emptyStateText}>
          К сожалению, по вашим критериям не найдено ни одного подходящего купальника. 
          Но не стоит расстраиваться! Мы с радостью изготовим для вас идеальный купальник 
          по индивидуальному заказу в кратчайшие сроки. Свяжитесь с нами для консультации 
          и обсуждения деталей.
        </p>
        <div className={styles.emptyStateButtons}>
          <button className={styles.heroPrimary}>
            <MessageCircle size={20} />
            Получить консультацию
          </button>
          <button className={styles.heroSecondary}>
            <Phone size={20} />
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );

  // Если исходная вёрстка карточек задаётся через CSS-сетку с minmax(300px, 1fr) и gap 2rem,
  // то для виртуализации в горизонтальном списке зададим фиксированную ширину карточки.
  const cardWidth = 300;  // базовая ширина карточки
  const cardHeight = 650; // приблизительная высота карточки (подберите по необходимости)
  const gap = 32;         // отступ между карточками (примерно 2rem)

  // Ширина списка – либо суммарная ширина всех карточек с отступами, либо ограниченная ширина окна.
  const listWidth = Math.min(filteredSuits.length * (cardWidth + gap), window.innerWidth - 40);

  // Компонент для отрисовки одной карточки в горизонтальном списке.
  const Row = ({ index, style, data }) => {
    // Корректируем стиль: фиксированная ширина и отступ справа
    const newStyle = {
      ...style,
      width: cardWidth,
      marginRight: gap,
    };
    return (
      <div style={newStyle}>
        <SuitCard suit={data[index]} />
      </div>
    );
  };

  return (
    <section ref={sectionRef} id="our-works" className={styles.readySuitsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Наши работы</h2>
      </div>

      <div className={styles.filtersContainer}>
        <select
          className={styles.filterSelect}
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
        >
          <option value="all" className={styles.mainOption}>Все купальники</option>
          <optgroup label="Категории">
            <option value="gymnastics">Художественная гимнастика</option>
            <option value="figure-skating">Фигурное катание</option>
            <option value="acrobatics">Спортивная акробатика</option>
          </optgroup>
          <optgroup label="В наличии">
            <option value="available">Все размеры</option>
            <option value="available-124">до 124 см.</option>
            <option value="available-129">125-129 см.</option>
            <option value="available-139">130-139 см.</option>
            <option value="available-154">140-154 см.</option>
            <option value="available-155">от 155 см.</option>
          </optgroup>
          <option value="sold">Продано</option>
        </select>
      </div>

      {filteredSuits.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <List
            height={cardHeight}
            itemCount={filteredSuits.length}
            itemSize={cardWidth + gap}
            layout="horizontal"
            width={listWidth}
            itemData={filteredSuits}
          >
            {Row}
          </List>
        </div>
      ) : (
        <EmptyState />
      )}

    </section>
  );
}

export default ReadySuits;

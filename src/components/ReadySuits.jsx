import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, MessageCircle, Phone } from 'lucide-react';
import styles from './ReadySuits.module.css';
import nonePhoto from '../assets/images/suits/none_photo.jpg';
import snegurochka from '../assets/images/suits/snegurochka.jpg';

function ReadySuits() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
      images: [snegurochka],
      available: true
    },
    {
      id: 3,
      name: "Купальник 'Лилия'",
      category: "gymnastics",
      price: 16000,
      height: "до 124 см.",
      description: "Купальник с цветочным орнаментом",
      images: ["/api/placeholder/400/500"],
      available: false
    },
    {
      id: 4,
      name: "Купальник 'Снежинка'",
      category: "figure-skating",
      price: 18500,
      height: "140-154 см.",
      description: "Купальник для фигурного катания с узором из страз",
      images: ["/api/placeholder/400/500"],
      available: false
    },
    {
      id: 5,
      name: "Купальник 'Феникс'",
      category: "acrobatics",
      price: 16500,
      height: "от 155 см.",
      description: "Купальник для спортивной акробатики с эффектом омбре",
      images: ["/api/placeholder/400/500"],
      available: true
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredSuits = suits.filter(suit => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'available') return suit.available;
    if (activeFilter === 'sold') return !suit.available;
    if (activeFilter === suit.category) return true;
    
    if (activeFilter.startsWith('height-')) {
      if (!suit.available) return false;
      
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
          <button className={`${styles.heroPrimary}`}>
            <MessageCircle size={20} />
            Получить консультацию
          </button>
          <button className={`${styles.heroSecondary}`}>
            <Phone size={20} />
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );

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
          <option value="all">Все купальники</option>
          <option value="available">В наличии</option>
          <option value="sold">Продано</option>
          <optgroup label="Рост">
            <option value="height-124">до 124 см.</option>
            <option value="height-129">125-129 см.</option>
            <option value="height-139">130-139 см.</option>
            <option value="height-154">140-154 см.</option>
            <option value="height-155">от 155 см.</option>
          </optgroup>
          <optgroup label="Категории">
            <option value="gymnastics">Художественная гимнастика</option>
            <option value="figure-skating">Фигурное катание</option>
            <option value="acrobatics">Спортивная акробатика</option>
          </optgroup>
        </select>
      </div>

      {filteredSuits.length > 0 ? (
        <div className={styles.suitsGrid}>
          {filteredSuits.map(suit => (
            <article key={suit.id} className={styles.suitCard}>
              <div className={styles.suitImageContainer}>
                <div className={styles.tagsContainer}>
                  {suit.tags && suit.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                  {!suit.available && (
                    <span className={styles.tagSold}>Продано</span>
                  )}
                </div>
                <img 
                  src={suit.images[0]} 
                  alt={suit.name}
                  className={styles.suitImage}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = nonePhoto;
                  }}
                />
              </div>

              <div className={styles.suitContent}>
                <div className={styles.suitInfo}>
                  <h3 className={styles.suitTitle}>{suit.name}</h3>
                  <p className={styles.suitDescription}>{suit.description}</p>
                  <div className={`${styles.suitDetails} ${!suit.available ? styles.suitDetailsSold : ''}`}>
                    <span className={styles.suitSize}>Рост: {suit.height}</span>
                    {suit.available && (
                      <span className={styles.suitPrice}>
                        {suit.price.toLocaleString('ru-RU')} ₽
                      </span>
                    )}
                  </div>
                </div>

                {suit.available ? (
                  <button className={styles.buyBtn}>
                    <ShoppingBag size={18} />
                    Купить
                  </button>
                ) : (
                  <button className={styles.orderBtn}>
                    <ShoppingBag size={18} />
                    Заказать
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

export default ReadySuits;
import React, { useState, useRef, useEffect } from 'react';
import { Ruler, Crown } from 'lucide-react';
import styles from './PricesSection.module.css';

const PricesSection = () => {
  const [showScrollHint, setShowScrollHint] = useState(false);
  const sectionRef = useRef(null);

  const cards = [
    {
      icon: Ruler,
      height: "до 124",
      price: "20 000",
      isHighlighted: false
    },
    {
      icon: Ruler, 
      height: "125-129",
      price: "25 000",
      isHighlighted: false
    },
    {
      icon: Crown,
      height: "130-139",
      price: "30 000", 
      isHighlighted: true
    },
    {
      icon: Ruler,
      height: "140-154",
      price: "35 000",
      isHighlighted: false
    },
    {
      icon: Ruler,
      height: "от 155",
      price: "40 000",
      isHighlighted: false
    }
  ];

  // Если мобильное устройство, показываем намёк на скролл на 3 секунды
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowScrollHint(true);
      const timer = setTimeout(() => {
        setShowScrollHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section ref={sectionRef} id="prices" className={styles.pricesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Цены</h2>
          <p className={styles.sectionSubtitle}>
            Стоимость изготовления купальника на заказ
          </p>
        </div>

        {window.innerWidth <= 768 ? (
          <div className={styles.scrollContainer}>
            <div
              className={showScrollHint ? styles.scrollHint : ''}
              style={{
                display: 'flex',
                width: `${cards.length * (280 + 16)}px`,
                gap: '16px',
              }}
            >
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className={`${styles.priceCard} ${card.isHighlighted ? styles.highlighted : ''}`}
                    style={{ width: '280px' }}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon />
                    </div>
                    
                    <div className={styles.heightRange}>
                      Рост {card.height} см
                    </div>
                    
                    <div className={styles.priceValue}>
                      от {card.price}₽
                    </div>

                    <div className={styles.additionalInfo}>
                      <div className={styles.additionalTitle}>Дополнительно</div>
                      <ul className={styles.additionalList}>
                        <li><strong>Рукав</strong> — 2 500 ₽ (1 шт)</li>
                        <li><strong>Юбка</strong> — 4 000 ₽</li>
                      </ul>
                    </div>

                    <button className={styles.priceButton}>
                      Заказать
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.pricesGrid}>
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className={`${styles.priceCard} ${card.isHighlighted ? styles.highlighted : ''}`}
                >
                  <div className={styles.iconWrapper}>
                    <Icon />
                  </div>
                  
                  <div className={styles.heightRange}>
                    Рост {card.height} см
                  </div>
                  
                  <div className={styles.priceValue}>
                    от {card.price}₽
                  </div>

                  <div className={styles.additionalInfo}>
                    <div className={styles.additionalTitle}>Дополнительно</div>
                    <ul className={styles.additionalList}>
                      <li><strong>Рукав</strong> — 2 500 ₽ (1 шт)</li>
                      <li><strong>Юбка</strong> — 4 000 ₽</li>
                    </ul>
                  </div>

                  <button className={styles.priceButton}>
                    Заказать
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricesSection;
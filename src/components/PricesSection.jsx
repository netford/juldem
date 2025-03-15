import React, { useState, useRef, useEffect } from 'react';
import { Ruler, Crown } from 'lucide-react';
import styles from './PricesSection.module.css';
import CustomOrderModal from './CustomOrderModal';
import PricingFAQ from './PricingFAQ';
import Button from './ui/Button'; // Добавляем импорт компонента Button

const PricesSection = () => {
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [selectedPriceCard, setSelectedPriceCard] = useState(null);
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

  const handleOrderClick = (card) => {
    setSelectedPriceCard(card);
    setIsCustomOrderModalOpen(true);
  };

  const getProductInfo = () => {
    if (!selectedPriceCard) return {};
    return {
      name: `Купальник (${selectedPriceCard.height})`,
      height: selectedPriceCard.height,
      price: parseInt(selectedPriceCard.price.replace(/\s/g, '')),
      image: '/favicon/favicon-96x96.png'
    };
  };

  return (
    <section ref={sectionRef} id="prices" className={styles.pricesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Цены</h2>
          <p className={styles.sectionSubtitle}>
            Стоимость изготовления купальника
          </p>
        </div>

        {/* Вместо условного рендеринга, всегда используем одну и ту же структуру,
            которая будет адаптироваться через CSS */}
        <div className={styles.pricesGrid}>
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`${styles.priceCard} ${card.isHighlighted ? styles.highlighted : ''}`}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={18} />
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

                {/* Заменяем на наш новый стиль кнопки, используя класс cardButton */}
                <button 
                  className={styles.cardButton}
                  onClick={() => handleOrderClick(card)}
                >
                  Заказать
                </button>
              </div>
            );
          })}
        </div>
        
        <PricingFAQ />
      </div>

      <CustomOrderModal
        isOpen={isCustomOrderModalOpen}
        onClose={() => setIsCustomOrderModalOpen(false)}
        product={getProductInfo()}
      />
    </section>
  );
};

export default PricesSection;
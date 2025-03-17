import React, { useRef, useEffect, useState } from 'react';
import { Truck, Clock, CreditCard, MapPin } from 'lucide-react';
import styles from './DeliverySection.module.css';

const DeliverySection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const toggleCalculator = () => {
    setIsCalculatorVisible(!isCalculatorVisible);
  };

  useEffect(() => {
    if (isCalculatorVisible) {
      const script = document.createElement('script');
      script.src = 'https://widget.pochta.ru/map/widget/widget.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        ecomStartWidget({
          id: 54847,
          callbackFunction: null,
          containerId: 'ecom-widget',
        });
      };

      return () => {
        document.body.removeChild(script); // Удалить скрипт при размонтировании компонента
      };
    }
  }, [isCalculatorVisible]);

  return (
    <section ref={sectionRef} id="delivery" className={styles.deliverySection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Доставка</h2>
        </div>

        <div className={styles.deliveryGrid}>
          {[ 
            {
              id: 1,
              title: 'СДЭК',
              icon: Truck,
              description: 'Доставка до пункта выдачи'
            },
            {
              id: 2,
              title: 'Почта России',
              icon: MapPin, 
              description: 'Доставка до пункта выдачи'
            },
            {
              id: 3,
              title: 'DPD',
              icon: Clock,
              description: 'Доставка до пункта выдачи'
            },
            {
              id: 4,
              title: 'Самовывоз',
              icon: CreditCard,
              description: 'Бесплатно из нашей мастерской',
              workingHours: 'с 10:00 до 19:00'
            }
          ].map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                ref={el => cardsRef.current[index] = el}
                className={styles.deliveryCard}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={32} color="#fff" />
                </div>
                
                <h3 className={styles.deliveryTitle}>{method.title}</h3>
                <p className={styles.deliveryDescription}>{method.description}</p>
                
                {method.title !== 'Самовывоз' ? (
                  <button 
                    className="btn btn-secondary delivery-secondary-btn"
                    onClick={toggleCalculator}
                  >
                    Калькулятор доставки
                  </button>
                ) : (
                  <div className={styles.deliveryInfo}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Часы работы</div>
                      <div className={styles.infoValue}>{method.workingHours}</div>
                    </div>
                  </div>
                )}

                {isCalculatorVisible && method.title === 'Почта России' && (
                  <div id="ecom-widget" style={{ height: '500px' }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;

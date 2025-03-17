import React, { useRef, useEffect, useState } from 'react';
import { Truck, Clock, CreditCard, MapPin } from 'lucide-react';
import styles from './DeliverySection.module.css';
import PostShipmentModal from './PostShipmentModal';
import SdekCalcModal from './SdekCalcModal';

const DeliverySection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [isPostShipmentModalOpen, setIsPostShipmentModalOpen] = useState(false);
  const [isSdekCalcModalOpen, setIsSdekCalcModalOpen] = useState(false);

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
                  method.title === 'Почта России' ? (
                    <button 
                      className="btn btn-secondary delivery-secondary-btn"
                      onClick={() => setIsPostShipmentModalOpen(true)}
                    >
                      Виджет доставки
                    </button>
                  ) : method.title === 'СДЭК' ? (
                    <button 
                      className="btn btn-secondary delivery-secondary-btn"
                      onClick={() => setIsSdekCalcModalOpen(true)}
                    >
                      Калькулятор доставки
                    </button>
                  ) : (
                    <button 
                      className="btn btn-secondary delivery-secondary-btn"
                    >
                      Калькулятор доставки
                    </button>
                  )
                ) : (
                  <div className={styles.deliveryInfo}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Часы работы</div>
                      <div className={styles.infoValue}>{method.workingHours}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PostShipmentModal
        isOpen={isPostShipmentModalOpen}
        onClose={() => setIsPostShipmentModalOpen(false)}
      />
      
      <SdekCalcModal
        isOpen={isSdekCalcModalOpen}
        onClose={() => setIsSdekCalcModalOpen(false)}
      />
    </section>
  );
};

export default DeliverySection;
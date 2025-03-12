// src/components/HowToOrder.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Palette, Scissors, Package, ArrowRight, Info } from 'lucide-react';
import VideoModal from './VideoModal';
import RentalModal from './RentalModal';
import styles from './HowToOrder.module.css';

const steps = [
  {
    id: 1,
    title: 'Заявка',
    icon: MessageSquare,
    items: [
      'Обсуждаем ваши требования и пожелания',
      'Согласовываем основные параметры заказа'
    ]
  },
  {
    id: 2,
    title: 'Дизайн',
    icon: Palette,
    items: [
      'Создаём эскиз с учетом требований соревнований',
      'Подбираем материалы и декоративные элементы'
    ]
  },
  {
    id: 3,
    title: 'Производство',
    icon: Scissors,
    items: [
      'Изготавливаем купальник по вашим меркам',
      'Выполняем декорирование и отделку'
    ]
  },
  {
    id: 4,
    title: 'Доставка',
    icon: Package,
    items: [
      'Отправляем заказ удобным для вас способом',
      'Предоставляем трек-номер для отслеживания'
    ]
  }
];

const HowToOrder = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

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
    <section ref={sectionRef} id="how-to-order" className={styles.howToOrderSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Как мы работаем</h2>
          <p className={styles.sectionSubtitle}>Полный цикл от вашей идеи до готового изделия</p>
        </div>

        {window.innerWidth <= 768 ? (
          <div className={styles.scrollContainer}>
            <div 
              className={`${styles.stepsRow} ${showScrollHint ? styles.scrollHint : ''}`}
              style={{
                display: 'flex',
                width: `${steps.length * (280 + 16)}px`,
                gap: '16px',
              }}
            >
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    ref={el => itemsRef.current[index] = el}
                    className={styles.stepItem}
                    style={{ width: '280px' }}
                  >
                    <div className={styles.stepBackground}>{step.id}</div>
                    <div className={styles.stepIconContainer}>
                      <div className={styles.stepIcon}>
                        <Icon size={24} />
                      </div>
                    </div>
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>{step.id}</div>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                    </div>
                    <ul className={styles.stepList}>
                      {step.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {index < steps.length - 1 && (
                      <div className={styles.stepArrow}>
                        <ArrowRight size={24} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.stepsContainer}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  ref={el => itemsRef.current[index] = el}
                  className={styles.stepItem}
                >
                  <div className={styles.stepBackground}>{step.id}</div>
                  <div className={styles.stepIconContainer}>
                    <div className={styles.stepIcon}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className={styles.stepHeader}>
                    <div className={styles.stepNumber}>{step.id}</div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                  </div>
                  <ul className={styles.stepList}>
                    {step.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {index < steps.length - 1 && (
                    <div className={styles.stepArrow}>
                      <ArrowRight size={24} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.infoContainer}>
          <div className={styles.infoBanner}>
            <Info size={20} className={styles.infoIcon} />
            <span>Полезная информация для заказа</span>
          </div>
          <div className={styles.infoLinks}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsVideoModalOpen(true);
              }}
              className={styles.infoLink}
            >
              Как снять мерки
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsRentalModalOpen(true);
              }}
              className={styles.infoLink}
            >
              Прокат купальников
            </a>
            <a href="#" className={styles.infoLink}>Договор</a>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSource="/videos/merki_min.webm"
      />

      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
      />
    </section>
  );
};

export default HowToOrder;
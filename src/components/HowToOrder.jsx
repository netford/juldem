import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Palette, Scissors, Package, ArrowRight, Video } from 'lucide-react';
import VideoModal from './VideoModal';
import RentalModal from './RentalModal';
import styles from './HowToOrder.module.css';

const steps = [
  {
    id: 1,
    title: 'Заявка',
    timeframe: '1-2 дня',
    icon: MessageSquare,
    items: [
      'Обсуждаем ваши требования к функциональности и дизайну',
      'Согласовываем предварительный эскиз, сроки и бюджет',
      'Подтверждаем заказ и, после получения предоплаты, приступаем к работе',
    ]
  },
  {
    id: 2,
    title: 'Дизайн',
    timeframe: '3-5 дней',
    icon: Palette,
    items: [
      'Создаём детальный эскиз с учетом требований соревнований и ваших пожеланий',
      'Подбираем материалы, цветовую гамму и обсуждаем дополнительные элементы (рукава, юбка и т.д.)',
      'Предоставляем возможность внесения правок в дизайн до начала производства'
    ]
  },
  {
    id: 3,
    title: 'Пошив',
    timeframe: '7-14 дней',
    icon: Scissors,
    items: [
      'Изготавливаем купальник, идеально сидящий по вашим индивидуальным меркам',
      'Выполняем декорирование и отделку с вниманием к каждой детали',
      'Проводим примерку и, при необходимости, делаем финальные корректировки'
    ]
  },
  {
    id: 4,
    title: 'Доставка',
    timeframe: '1-7 дней',
    icon: Package,
    items: [
      'Отправляем заказ удобным для вас способом (СДЭК, Boxberry, DPD)',
      'Предоставляем трек-номер для отслеживания статуса доставки',
      'Поддерживаем связь до получения вами заказа'
    ]
  }
];

const HowToOrder = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
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
      { threshold: 0.1 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  // Выделение ключевых слов в тексте
  const highlightKeywords = (text) => {
    const keywords = [
      'уточнения деталей',
      'внесения правок',
      'идеально сидящий',
      'финальные корректировки',
      'Согласовываем предварительный эскиз',
      'после получения предоплаты',
      'детальный эскиз',
      'до начала производства',
      'трек-номер',
      'Поддерживаем связь'
    ];
    
    let highlightedText = text;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        highlightedText = highlightedText.replace(
          keyword, 
          `<span class="${styles.highlight}">${keyword}</span>`
        );
      }
    });
    
    return highlightedText;
  };

  return (
    <section ref={sectionRef} id="how-to-order" className={styles.howToOrderSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Этапы работ</h2>
          <p className={styles.sectionSubtitle}>Полный цикл от идеи до&nbsp;готового&nbsp;изделия</p>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                ref={el => itemsRef.current[index] = el}
                className={styles.stepItem}
              >
                <div className={styles.stepBackground}>
                  <Icon size={24} className={styles.stepBackgroundIcon} />
                </div>
                <div className={styles.stepIconContainer}>
                  <div className={styles.stepIcon}>
                   {step.id}
                  </div>
                </div>
                <div className={styles.stepHeader}>
                  <h3 className={styles.stepTitle}>
                    {step.title} <span className={styles.timeframe}>({step.timeframe})</span>
                  </h3>
                </div>
                <ul className={styles.stepList}>
                  {step.items.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: highlightKeywords(item) }}></li>
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

        <div className={styles.infoContainer}>
          <div 
            className={styles.infoBanner}
            onClick={() => setIsVideoModalOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <Video
              size={20}
              className={styles.infoIcon}
            />
            <span>Как снять мерки самостоятельно (Видеоинструкция)</span>
          </div>
          <div className={styles.infoLinks}>
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
        
        <div className={styles.callToAction}>
          <a href="#prices" className={styles.orderButton}>
            Оформить заказ
          </a>
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
import React, { useRef, useEffect, useState } from 'react';
import { Award, Brush, Users, Play } from 'lucide-react';
import styles from './About.module.css';
import CustomOrderModal from './CustomOrderModal';
import OrderModal from './OrderModal';
import RentalModal from './RentalModal';
import { scrollToReadySuits } from './Hero'; // Импортируем функцию

const About = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const videoRef = useRef(null);

  // Состояния для модальных окон
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);

  // Эффект для анимации появления элементов при прокрутке
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

  // Данные для временной шкалы
  const timelineEvents = [
    { year: 2015, event: 'Первые эксперименты с пошивом купальников для выступлений' },
    { year: 2017, event: 'Основание мастерской Юлией Дёминой, чемпионкой Европы по спортивной акробатике' },
    { year: 2018, event: 'Начало работы с местными спортивными школами, первые групповые заказы' },
    { year: 2019, event: 'Расширение ассортимента: добавление купальников для художественной гимнастики и фигурного катания' },
    { year: 2020, event: 'Внедрение новых технологий декорирования и отделки купальников' },
    { year: 2023, event: 'Внедрение сервиса проката спортивных купальников' },
    { year: 2024, event: 'Официальный запуск бренда "JULDEM", создание фирменного стиля' },
    { year: 2025, event: 'Запуск обновленного сайта и расширение зоны обслуживания - теперь мы работаем (удалённо) по всей России' }
  ];

  // Заглушка для продукта в модальном окне
  const dummyProduct = {
    name: "Индивидуальный пошив",
    height: "По вашим меркам",
    price: 25000,
    image: "/favicon/favicon-96x96.png"
  };

  // Создаем информацию о карточках с новыми текстами и кнопками
  const featureCards = [
    {
      icon: Award,
      title: 'Профессиональный подход к каждому купальнику',
      description: 'За 7 лет мы создали более 500 уникальных костюмов для художественной гимнастики, спортивной акробатики и фигурного катания. Каждый купальник — это результат глубокого понимания спортивной эстетики и индивидуальных потребностей спортсмена.',
      buttonText: 'Заказать индивидуальный пошив',
      onClick: () => setIsCustomOrderModalOpen(true)
    },
    {
      icon: Brush,
      title: 'Технологии, превращающие образ',
      description: 'Мы используем передовые технологии аэрографии, инкрустации стразами и 3D-дизайна. Наши купальники не просто костюмы — это произведения искусства, которые подчеркивают харизму и талант спортсмена, полностью соответствуя строгим соревновательным стандартам.',
      buttonText: 'Выбрать готовый купальник', // Изменил текст кнопки
      onClick: scrollToReadySuits // Использую существующую функцию
    },
    {
      icon: Users,
      title: 'Комфорт и качество для каждого',
      description: 'От начинающих спортсменов до профессионалов мирового уровня — мы обеспечиваем высококачественные решения для всех. В нашей коллекции есть как индивидуальные модели, так и готовые костюмы, которые можно получить здесь и сейчас.',
      buttonText: 'Взять купальник напрокат',
      onClick: () => setIsRentalModalOpen(true)
    }
  ];

  return (
    <section ref={sectionRef} id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>О нас</h2>
        
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent} ref={el => itemsRef.current[0] = el}>
            <h3 className={styles.contentTitle}>Наша история</h3>
            
            <div className={styles.timeline}>
              {timelineEvents.map((item, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.year}>{item.year}</div>
                  <div className={styles.event}>{item.event}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.aboutMedia}>
            <div className={styles.mediaGallery}>
              <div className={styles.mainImage} ref={el => itemsRef.current[1] = el}>
                <img src="/images/about/studio.jpg" alt="Мастерская JULDEM" />
              </div>
              
              <div className={styles.videoContainer} ref={el => itemsRef.current[2] = el}>
                <video 
                  ref={videoRef}
                  src="/videos/process.mp4" 
                  poster="/images/about/video-poster.jpg"
                  className={styles.processVideo}
                  playsInline
                  autoPlay
                  muted
                  loop
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.featuresContainer}>
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                ref={el => itemsRef.current[index + 4] = el}
                className={styles.featureCard}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={24} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <button 
                  className={styles.featureButton}
                  onClick={feature.onClick}
                >
                  {feature.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Модальные окна */}
      <CustomOrderModal
        isOpen={isCustomOrderModalOpen}
        onClose={() => setIsCustomOrderModalOpen(false)}
        product={dummyProduct}
      />
      
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={dummyProduct}
      />
      
      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
      />
    </section>
  );
};

export default About;
import React, { useRef, useEffect, useState } from 'react';
import { Award, Brush, Users, Play } from 'lucide-react';
import styles from './About.module.css';
import CustomOrderModal from './CustomOrderModal';
import OrderModal from './OrderModal';
import RentalModal from './RentalModal';
import { scrollToReadySuits } from './Hero';

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

  // Стили для подсветки ключевых слов
  const highlightTextStyles = {
    color: '#00e2fc', 
    fontWeight: '500'
  };

  // Создаем информацию о карточках с новыми текстами и кнопками
  const featureCards = [
    {
      icon: Award,
      title: 'Профессиональный подход к каждому купальнику',
      description: (
        <>
          <div className="feature-item" style={{textIndent: '1.5rem'}}>
            За <span style={highlightTextStyles}>7 лет</span> мы создали более <span style={highlightTextStyles}>300 уникальных костюмов</span> для художественной гимнастики, спортивной акробатики и фигурного катания. 
          </div>
          <div className="feature-item" style={{textIndent: '1.5rem'}}>
            Каждый купальник — это результат глубокого понимания спортивной эстетики и <span style={highlightTextStyles}>индивидуальных потребностей спортсмена</span>.
          </div>
        </>
      ),
      buttonText: 'Заказать индивидуальный пошив',
      onClick: () => setIsCustomOrderModalOpen(true)
    },
    {
      icon: Brush,
      title: 'Технологии, превращающие образ',
      description: (
        <>
          <div className="feature-item" style={{textIndent: '1.5rem'}}>
            Мы используем <span style={highlightTextStyles}>передовые технологии</span> аэрографии, инкрустации стразами и 3D-дизайна. 
          </div>
          <div className="feature-item" style={{textIndent: '1.5rem'}}>
            Наши купальники — это не просто костюмы, а <span style={highlightTextStyles}>произведения искусства</span>, которые подчеркивают харизму спортсмена и при этом полностью соответствуют строгим соревновательным стандартам.
          </div>
        </>
      ),
      buttonText: 'Выбрать готовый купальник',
      onClick: scrollToReadySuits
    },
    {
      icon: Users,
      title: 'Комфорт и качество для каждого',
      description: (
        <>
          <div className="feature-item" style={{textIndent: '1.5rem'}}>
            От профессиональных спортсменов до самых начинающих — мы обеспечиваем <span style={highlightTextStyles}>качественные решения для всех</span>.
          </div>
          <div className="feature-item" style={{textIndent: '1.5rem'}}>
            В нашей коллекции есть как <span style={highlightTextStyles}>готовые модели на продажу</span>, так и <span style={highlightTextStyles}>готовые купальники</span>, которые можно взять <span style={highlightTextStyles}>напрокат</span>.
          </div>
        </>
      ),
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
              
              <div>
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
                <div className={styles.featureDescription}>{feature.description}</div>
                <button 
                  className="btn btn-secondary delivery-secondary-btn"
                  onClick={feature.onClick}
                >
                  {feature.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

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
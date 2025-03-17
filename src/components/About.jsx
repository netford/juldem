import React, { useRef, useEffect, useState } from 'react';
import { Award, Brush, Users, Play } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const videoRef = useRef(null);
  
  // Добавим состояние для отслеживания, воспроизводится ли видео
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Функция для воспроизведения/паузы видео
  const toggleVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Данные для временной шкалы
  const timelineEvents = [
    { year: 2015, event: 'Первые эксперименты с пошивом купальников для выступлений' },
    { year: 2017, event: 'Основание мастерской Юлией Дёминой, чемпионкой Европы по спортивной акробатике' },
    { year: 2018, event: 'Открытие первой мастерской в Набережных Челнах, начало работы с местными спортивными школами' },
    { year: 2019, event: 'Расширение ассортимента: добавление купальников для художественной гимнастики и фигурного катания' },
    { year: 2020, event: 'Внедрение новых технологий декорирования и отделки купальников' },
    { year: 2023, event: 'Внедрение сервиса проката спортивных купальников' },
    { year: 2024, event: 'Официальный запуск бренда "JULDEM", создание фирменного стиля' },
    { year: 2025, event: 'Запуск обновленного сайта и расширение зоны обслуживания - теперь мы работаем по всей России' }
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
              
              {/* Вертикальное видео вместо маленьких изображений */}
              {/* <div className={styles.videoContainer} ref={el => itemsRef.current[2] = el}> */}
              <div>

                <video 
                  ref={videoRef}
                  src="/videos/process.mp4" 
                  poster="/images/about/video-poster.jpg"
                  className={styles.processVideo}
                  playsInline
                  muted
                  loop
                  onClick={toggleVideo}
                />
                
                {/* Кнопка воспроизведения */}
                {!isPlaying && (
                  <button className={styles.playButton} onClick={toggleVideo}>
                    <Play size={32} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.featuresContainer}>
          {[
            {
              icon: Award,
              title: 'Опыт и профессионализм',
              description: 'Наши мастера имеют многолетний опыт в пошиве спортивных купальников для соревнований любого уровня.'
            },
            {
              icon: Brush,
              title: 'Передовые технологии',
              description: 'Мы применяем передовые технологии: аэрографию, инкрустацию стразами и 3D-дизайн. Это позволяет создавать уникальные модели, впечатляющие визуально и соответствующие всем требованиям к соревновательным костюмам.'
            },
            {
              icon: Users,
              title: 'Клиенты и достижения',
              description: 'В нашем портфолио — сотни довольных клиентов, от начинающих до профессиональных спортсменов. Помимо индивидуальных заказов всегда в наличии имеется коллекция готовых моделей.'
            }
          ].map((feature, index) => {
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
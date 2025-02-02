import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Ruler, Palette, Scissors, Package, Info } from 'lucide-react';
import VideoModal from './VideoModal';
import RentalModal from './RentalModal';
import styles from './HowToOrder.module.css';

const steps = [
 {
   id: 1,
   title: 'Консультация',
   icon: MessageSquare,
   items: [
     'Обсуждаем ваши пожелания и требования',
     'Помогаем с выбором модели, материалов и декора', 
     'Учитываем регламент соревнований',
     'Проводим консультацию онлайн или в нашей мастерской'
   ]
 },
 {
   id: 2,
   title: 'Замеры',
   icon: Ruler,
   items: [
     'Предоставляем подробную инструкцию по снятию мерок',
     'Принимаем готовые мерки или помогаем их правильно снять',
     'Учитываем особенности телосложения и пожелания по посадке',
     'Создаём индивидуальную выкройку'
   ]
 },
 {
   id: 3,
   title: 'Дизайн',
   icon: Palette,
   items: [
     'Разрабатываем эскиз с учётом ваших пожеланий',
     'Подбираем оптимальное сочетание цветов и материалов',
     'Рассчитываем расположение декоративных элементов',
     'Утверждаем финальный дизайн с учётом правил федерации'
   ]
 },
 {
   id: 4,
   title: 'Пошив',
   icon: Scissors,
   items: [
     'Изготавливаем купальник по индивидуальным меркам',
     'Используем профессиональное оборудование',
     'Выполняем ручную отделку и декорирование',
     'Проводим примерку и корректировки при необходимости'
   ]
 },
 {
   id: 5,
   title: 'Отправка',
   icon: Package,
   items: [
     'Бережно упаковываем изделие',
     'Предоставляем трек-номер для отслеживания',
     'Отправляем любой удобной для вас транспортной компанией',
     'Принимаем оплату после примерки'
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
            entry.target.classList.add('visible');
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
   <section id="how-to-order" className={styles.howToOrderSection}>
     <div className={styles.container}>
       <div className={styles.sectionHeader}>
         <h2 className={styles.sectionTitle}>Как заказать</h2>
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
                   <div className={styles.stepIcon}>
                     <Icon />
                   </div>
                   <h3 className={styles.stepTitle}>{step.id}. {step.title}</h3>
                   <ul className={styles.stepList}>
                     {step.items.map((item, i) => (
                       <li key={i}>{item}</li>
                     ))}
                   </ul>
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
                 <div className={styles.stepIcon}>
                   <Icon />
                 </div>
                 <h3 className={styles.stepTitle}>{step.id}. {step.title}</h3>
                 <ul className={styles.stepList}>
                   {step.items.map((item, i) => (
                     <li key={i}>{item}</li>
                   ))}
                 </ul>
               </div>
             );
           })}
         </div>
       )}

       <div className={styles.infoContainer}>
         <div className={styles.infoHeader}>
           <Info size={24} color="var(--color-primary)" />
           <h3 className={styles.infoTitle}>Дополнительная информация</h3>
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
             Как снять мерки самостоятельно
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
           <a href="#" className={styles.infoLink}>Договора</a>
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
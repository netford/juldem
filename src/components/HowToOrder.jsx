import React from 'react';
import { MessageSquare, Ruler, Palette, Scissors, Package, Info } from 'lucide-react';

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
 return (
   <section id="how-to-order" className="how-to-order-section">
     <style>{`
       .how-to-order-section {
         padding: 6rem 0;
         background: #1a1a1a;
         color: #fff;
       }

       .container {
         max-width: 1200px;
         width: 100%;
         margin: 0 auto;
         padding: 0;
         display: flex;
         flex-direction: column;
         align-items: center;
       }

       .section-header {
         text-align: center;
         margin-bottom: 4rem;
       }

       .section-title {
         font-size: clamp(2rem, 4vw, 2.5rem);
         color: #fff;
         margin-bottom: 1rem;
       }

       .steps-container {
         width: 100%;
         display: grid;
         grid-template-columns: repeat(5, 240px);
         gap: 2rem;
         margin-bottom: 3rem;
         transform: translateX(-96px);
       }

       .step-item {
         background: #262626;
         border: 1px solid #333;
         border-radius: 16px;
         padding: 2rem;
         width: 100%;
       }

       .step-icon {
         width: 64px;
         height: 64px;
         background: var(--color-primary);
         border-radius: 16px;
         display: flex;
         align-items: center;
         justify-content: center;
         margin: 0 auto 1.5rem;
       }

       .step-icon svg {
         width: 32px;
         height: 32px;
         color: #fff;
       }

       .step-title {
         font-size: 1.25rem;
         font-weight: 600;
         color: #fff;
         margin-bottom: 1.5rem;
         text-align: center;
       }

       .step-list {
         list-style: none;
         padding: 0;
         margin: 0;
       }

       .step-list li {
         position: relative;
         padding-left: 1.5rem;
         margin-bottom: 1rem;
         color: #ccc;
         line-height: 1.5;
       }

       .step-list li:last-child {
         margin-bottom: 0;
       }

       .step-list li::before {
         content: "";
         position: absolute;
         left: 0;
         top: 0.65rem;
         width: 6px;
         height: 6px;
         border-radius: 50%;
         background: var(--color-primary);
       }

       .info-container {
         width: 100%;
         max-width: 1200px;
         margin: 0 auto;
         padding: 2rem;
         background: #262626;
         border: 1px solid #333;
         border-radius: 16px;
         display: flex;
         flex-direction: column;
         align-items: center;
         gap: 1.5rem;
       }

       .info-header {
         display: flex;
         align-items: center;
         gap: 0.75rem;
       }

       .info-title {
         font-size: 1.25rem;
         color: #fff;
         font-weight: 600;
       }

       .info-links {
         display: flex;
         gap: 2rem;
         flex-wrap: wrap;
         justify-content: center;
       }

       .info-link {
         color: var(--color-primary);
         text-decoration: none;
         padding: 0.5rem 1rem;
         border: 1px solid var(--color-primary);
         border-radius: 8px;
         transition: all 0.3s ease;
       }

       .info-link:hover {
         background: var(--color-primary);
         color: #fff;
       }

       @media (max-width: 1200px) {
         .steps-container {
           grid-template-columns: repeat(3, 1fr);
           transform: translateX(0);
         }
       }

       @media (max-width: 768px) {
         .how-to-order-section {
           padding: 4rem 0;
         }
         
         .steps-container {
           grid-template-columns: 1fr;
           gap: 1.5rem;
           transform: translateX(0);
         }

         .info-container {
           padding: 1.5rem;
         }

         .info-links {
           flex-direction: column;
           gap: 1rem;
           width: 100%;
         }

         .info-link {
           text-align: center;
         }
       }
     `}</style>

     <div className="container">
       <div className="section-header">
         <h2 className="section-title">Как заказать</h2>
       </div>

       <div className="steps-container">
         {steps.map((step) => {
           const Icon = step.icon;
           return (
             <div key={step.id} className="step-item">
               <div className="step-icon">
                 <Icon />
               </div>
               <h3 className="step-title">{step.id}. {step.title}</h3>
               <ul className="step-list">
                 {step.items.map((item, i) => (
                   <li key={i}>{item}</li>
                 ))}
               </ul>
             </div>
           );
         })}
       </div>

       <div className="info-container">
         <div className="info-header">
           <Info size={24} color="var(--color-primary)" />
           <h3 className="info-title">Дополнительная информация</h3>
         </div>
         <div className="info-links">
           <a href="#" className="info-link">Как снять мерки самостоятельно</a>
           <a href="#" className="info-link">Прокат купальников</a>
           <a href="#" className="info-link">Договора</a>
         </div>
       </div>
     </div>
   </section>
 );
};

export default HowToOrder;
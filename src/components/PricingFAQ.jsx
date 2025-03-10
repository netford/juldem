// components/PricingFAQ.jsx
import React, { useState, useRef } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  CreditCard, 
  Clock, 
  Truck, 
  Users, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import styles from './PricesSection.module.css';
import CustomOrderModal from './CustomOrderModal';

const PricingFAQ = () => {
  // Состояние для модального окна с формой вопроса
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  
  // Состояние для отслеживания открытых вопросов
  const [openItems, setOpenItems] = useState({});
  
  // Состояние для эффекта пульсации
  const [pulsingItem, setPulsingItem] = useState(null);
  
  // Ref для контейнера с эффектом волны
  const rippleRefs = useRef([]);

  // Массив с вопросами и ответами, включая иконки
  const faqItems = [
    {
      id: 1,
      question: "Из чего складывается стоимость купальника?",
      answer: "Стоимость зависит от нескольких факторов: размер купальника (рост спортсмена), сложность дизайна, количество страз и декоративных элементов, наличие дополнительных элементов (рукава, юбка).",
      icon: DollarSign
    },
    {
      id: 2,
      question: "Нужно ли вносить предоплату?",
      answer: "Да, для начала работы над индивидуальным заказом требуется предоплата в размере 50% от общей стоимости. Оставшуюся сумму необходимо оплатить перед отправкой готового изделия.",
      icon: CreditCard
    },
    {
      id: 3,
      question: "Влияет ли срочность изготовления на стоимость?",
      answer: "Да, срочное изготовление купальника (менее чем за 14 дней) увеличивает стоимость на 15-20% в зависимости от сложности модели.",
      icon: Clock
    },
    {
      id: 4,
      question: "Сколько стоит изменить готовый дизайн?",
      answer: "Небольшие изменения в цветовой гамме бесплатны. Изменения в конструкции и значительные изменения в дизайне рассчитываются индивидуально, обычно от 1000 до 5000 рублей.",
      icon: HelpCircle
    },
    {
      id: 5,
      question: "Возможна ли скидка при заказе нескольких купальников?",
      answer: "Да, при заказе от 2-х купальников предоставляется скидка 5%, от 5 купальников - скидка 10%.",
      icon: Users
    },
    {
      id: 6,
      question: "Включена ли доставка в стоимость?",
      answer: "Нет, стоимость доставки рассчитывается отдельно в зависимости от города и выбранного способа доставки.",
      icon: Truck
    }
  ];

  // Функция для переключения состояния вопроса с эффектом пульсации
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    // Добавляем эффект пульсации
    setPulsingItem(id);
    setTimeout(() => setPulsingItem(null), 500);
  };
  
  // Функция для создания эффекта волны при клике
  const createRippleEffect = (e, index) => {
    const button = rippleRefs.current[index];
    
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add(styles.rippleEffect);
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div className={styles.faqContainer}>
      <h3 className={styles.faqTitle}>Часто задаваемые вопросы о ценах</h3>
      
      <div className={styles.faqList}>
        {faqItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div 
              key={item.id} 
              className={`
                ${styles.faqItem} 
                ${openItems[item.id] ? styles.faqItemOpen : ''} 
                ${pulsingItem === item.id ? styles.faqItemPulse : ''}
              `}
              ref={el => {
                rippleRefs.current[index] = el;
              }}
            >
              <div 
                className={styles.faqQuestion}
                onClick={(e) => {
                  toggleItem(item.id);
                  createRippleEffect(e, index);
                }}
              >
                <div className={styles.faqQuestionContent}>
                  <span className={styles.faqIcon}>
                    <Icon size={18} />
                  </span>
                  <span>{item.question}</span>
                </div>
                <button
                  className={`${styles.faqToggle} ${openItems[item.id] ? styles.faqToggleOpen : ''}`}
                  aria-label={openItems[item.id] ? "Свернуть" : "Развернуть"}
                >
                  {openItems[item.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div 
                className={styles.faqAnswer} 
                style={{
                  maxHeight: openItems[item.id] ? '500px' : '0',
                  opacity: openItems[item.id] ? 1 : 0,
                  padding: openItems[item.id] ? '0 1.25rem 1.25rem 3.75rem' : '0 1.25rem 0 3.75rem'
                }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.faqAskQuestionContainer}>
        <button 
          className={styles.faqAskQuestionButton}
          onClick={() => setIsQuestionModalOpen(true)}
        >
          <MessageSquare size={20} />
          <span>Задать свой вопрос о стоимости</span>
        </button>
      </div>
      
      {/* Модальное окно для вопроса (используем существующий компонент CustomOrderModal) */}
      <CustomOrderModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        product={{
          name: "Вопрос о ценах",
          height: "",
          price: 0,
          image: "/favicon/favicon-96x96.png"
        }}
      />
    </div>
  );
};

export default PricingFAQ;
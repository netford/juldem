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
import QuestionModal from './QuestionModal';

const PricingFAQ = () => {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});
  const [pulsingItem, setPulsingItem] = useState(null);
  const rippleRefs = useRef([]);

  const formatAnswer = (text) => {
    const highlights = [
      { phrase: 'от 2 000 до 5 000 руб', replacement: '<span class="highlight">от 2 000 до 5 000 руб</span>' },
      { phrase: 'требуется предоплата', replacement: '<span class="highlight">требуется предоплата</span>' },
      { phrase: 'срочное изготовление', replacement: '<span class="highlight">срочное изготовление</span>' },
      { phrase: 'предоплата не возвращается', replacement: '<span class="highlight">предоплата не возвращается</span>' },
      { phrase: 'за день до соревнований', replacement: '<span class="highlight">за день до соревнований</span>' },
      { phrase: 'на следующий день после выступления', replacement: '<span class="highlight">на следующий день после выступления</span>' },
      { phrase: 'накидку или олимпийку', replacement: '<span class="highlight">накидку или олимпийку</span>' },
      { phrase: 'скидка 5%', replacement: '<span class="highlight">скидка 5%</span>' },
      { phrase: 'скидка 10%', replacement: '<span class="highlight">скидка 10%</span>' },
      { phrase: 'увеличивает стоимость на 15-20%', replacement: '<span class="highlight">увеличивает стоимость на 15-20%</span>' },
      { phrase: 'бесплатны', replacement: '<span class="highlight">бесплатны</span>' },
      { phrase: 'стоимость доставки рассчитывается отдельно', replacement: '<span class="highlight">стоимость доставки рассчитывается отдельно</span>' },
      { phrase: 'от 1 000 до 5 000 рублей', replacement: '<span class="highlight">от 1 000 до 5 000 рублей</span>' },
      { phrase: 'скидки при групповых заказах не предоставляются', replacement: '<span class="highlight">скидки при групповых заказах не предоставляются</span>' }
    ];

    let formattedText = text;
    highlights.forEach(({ phrase, replacement }) => {
      formattedText = formattedText.replace(new RegExp(phrase, 'g'), replacement);
    });

    return formattedText;
  };

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
      answer: "Да, для начала работы над индивидуальным заказом требуется предоплата в размере от 2 000 до 5 000 руб.",
      icon: CreditCard
    },
    {
      id: 3,
      question: "Возвращается ли предоплата при отказе от заказа?",
      answer: "Нет, предоплата не возвращается, т.к. после раскроя материалов по вашим меркам они уже не могут использоваться для других заказов.",
      icon: CreditCard
    },
    {
      id: 4,
      question: "Влияет ли срочность изготовления на стоимость?",
      answer: "Да, срочное изготовление купальника (менее чем за 7 дней) увеличивает стоимость на 15-20% в зависимости от сложности модели.",
      icon: Clock
    },
    {
      id: 5,
      question: "Сколько стоит изменить готовый дизайн?",
      answer: "Небольшие изменения в цветовой гамме бесплатны. Изменения в конструкции и значительные изменения в дизайне рассчитываются индивидуально, обычно от 1 000 до 5 000 рублей.",
      icon: HelpCircle
    },
    {
      id: 6,
      question: "Возможна ли скидка при групповых заказах?",
      answer: "Нет, скидки при групповых заказах не предоставляются. Изготовление нескольких идентичных купальников технологически более сложно, чем пошив индивидуальных. Мы сохраняем стандартную цену для каждого изделия, не повышая её за дополнительную сложность работы.",
      icon: Users
    },
    {
      id: 7,
      question: "Включена ли доставка в стоимость купальника?",
      answer: "Нет, стоимость доставки рассчитывается отдельно в зависимости от города и выбранного способа доставки.",
      icon: Truck
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setPulsingItem(id);
    setTimeout(() => setPulsingItem(null), 500);
  };

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
      <style>
        {`
          .highlight {
            color: #FFD700;
            font-weight: 500;
          }
        `}
      </style>
      <h3 className={styles.faqTitle}>Часто задаваемые вопросы</h3>
      
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
              ref={el => { rippleRefs.current[index] = el; }}
            >
              <div 
                className={styles.faqQuestion}
                onClick={(e) => {
                  toggleItem(item.id);
                  createRippleEffect(e, index);
                }}
              >
                <div className={styles.faqQuestionContent}>
                  <span className={`${styles.commonFaqIcon} ${openItems[item.id] ? styles.commonFaqIconActive : ''}`}>
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
                {item.answer.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: formatAnswer(paragraph) }}></p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.faqAskQuestionContainer}>
        <button 
          onClick={() => setIsQuestionModalOpen(true)}
          className={styles.faqAskQuestionButton}
        >
          <MessageSquare size={20} />
          <span>Задать свой вопрос</span>
        </button>
      </div>
      
      <QuestionModal 
        isOpen={isQuestionModalOpen} 
        onClose={() => setIsQuestionModalOpen(false)} 
      />
    </div>
  );
};

export default PricingFAQ;

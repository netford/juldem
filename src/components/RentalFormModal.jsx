import React, { useEffect, useState } from 'react';
import { X, Calendar, Phone, User, Clock, Shield, CreditCard } from 'lucide-react';
import ReactDOM from 'react-dom';

const RentalFormModal = ({ isOpen, onClose, product }) => {
  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    callTime: '',
    performanceDate: ''
  });
  
  // Состояние для кастомного календаря
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  
  // Состояние для обработки UI
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
  });
  // Добавляем состояние для отслеживания ошибок валидации
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    phone: false,
    callTime: false,
    performanceDate: false,
    agree: false
  });

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Закрытие календаря при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      const calendar = document.getElementById('custom-calendar');
      const dateInput = document.getElementById('performanceDateDisplay');
      
      if (calendar && !calendar.contains(event.target) && event.target !== dateInput) {
        setShowCustomCalendar(false);
      }
    };

    if (showCustomCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomCalendar]);

  // Генерация временных слотов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setTimeSlots(generateTimeSlots());
      // Сбрасываем форму при каждом открытии
      setFormData({
        name: '',
        phone: '',
        callTime: '',
        performanceDate: ''
      });
      setSuccess(false);
      // Сбрасываем ошибки валидации
      setValidationErrors({
        name: false,
        phone: false,
        callTime: false,
        performanceDate: false,
        agree: false
      });
      
      // Блокируем прокрутку страницы при открытии модального окна
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Разрешаем прокрутку страницы при закрытии модального окна
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Добавляем индикатор скролла
  useEffect(() => {
    if (isOpen && isMobile) {
      // Добавляем стиль для анимации
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.8; transform: translateX(-50%) translateY(5px); }
        }
      `;
      document.head.appendChild(style);
      
      // Добавляем индикатор скролла после короткой задержки
      const timer = setTimeout(() => {
        const modalElement = document.querySelector('.rental-modal-content');
        if (modalElement && modalElement.scrollHeight > modalElement.clientHeight) {
          // Показываем индикатор прокрутки
          const scrollIndicator = document.createElement('div');
          scrollIndicator.className = 'scroll-indicator';
          scrollIndicator.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 20px;
            opacity: 0.7;
            text-align: center;
            animation: fadeInOut 1.5s infinite;
          `;
          
          const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          arrowSvg.setAttribute('width', '20');
          arrowSvg.setAttribute('height', '12');
          arrowSvg.setAttribute('viewBox', '0 0 24 24');
          arrowSvg.setAttribute('fill', 'none');
          arrowSvg.setAttribute('stroke', 'white');
          arrowSvg.setAttribute('stroke-width', '2');
          arrowSvg.setAttribute('stroke-linecap', 'round');
          arrowSvg.setAttribute('stroke-linejoin', 'round');
          
          const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
          polyline.setAttribute('points', '6 9 12 15 18 9');
          arrowSvg.appendChild(polyline);
          
          scrollIndicator.appendChild(arrowSvg);
          modalElement.appendChild(scrollIndicator);
          
          // Скрываем индикатор при скролле
          const handleScroll = () => {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
              scrollIndicator.remove();
            }, 300);
            modalElement.removeEventListener('scroll', handleScroll);
          };
          
          modalElement.addEventListener('scroll', handleScroll);
        }
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        document.head.removeChild(style);
      };
    }
  }, [isOpen, isMobile]);

  // Обработка нажатия клавиши ESC для закрытия модального окна
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
// Функция для генерации временных слотов
const generateTimeSlots = () => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Генерация слотов на сегодня
  for (let hour = 10; hour < 19; hour++) {
    // Пропускаем прошедшие часы
    if (hour < currentHour) continue;
    
    // Пропускаем текущий час, если до его окончания осталось менее 15 минут
    if (hour === currentHour && currentMinutes > 45) continue;

    slots.push({
      value: `today-${hour}`,
      label: `Сегодня с ${hour}:00 до ${hour + 1}:00`
    });
  }

  // Генерация слотов на завтра
  for (let hour = 10; hour < 19; hour++) {
    slots.push({
      value: `tomorrow-${hour}`,
      label: `Завтра с ${hour}:00 до ${hour + 1}:00`
    });
  }

  return slots;
};

// Функция для получения названия дня недели
const getDayOfWeekName = (dayIndex) => {
  const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  return dayNames[dayIndex];
};

// Функция для генерации дат на 30 дней вперед, правильно группированных по неделям
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  const currentHour = today.getHours();
  
  // Определяем первый день (сегодня) и последний день (сегодня + 29 дней)
  const firstDate = new Date(today);
  const lastDate = new Date(today);
  lastDate.setDate(today.getDate() + 29);
  
  // Получаем полные недели (начиная с понедельника)
  // Находим предыдущий понедельник или текущий день, если сегодня понедельник
  const firstMonday = new Date(firstDate);
  const dayOfWeek = firstMonday.getDay(); // 0 - воскресенье, 1 - понедельник, ...
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  firstMonday.setDate(firstMonday.getDate() - daysToSubtract);
  
  // Находим следующее воскресенье после последнего дня
  const lastSunday = new Date(lastDate);
  const lastDayOfWeek = lastSunday.getDay();
  const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  lastSunday.setDate(lastSunday.getDate() + daysToAdd);
  
  // Создаем массив всех дат от первого понедельника до последнего воскресенья
  const allDates = [];
  const currentDate = new Date(firstMonday);
  
  while (currentDate <= lastSunday) {
    // Проверяем, находится ли дата в диапазоне разрешенных дат (сегодня + 30 дней)
    const isInRange = currentDate >= firstDate && currentDate <= lastDate;
    
    // Проверяем, является ли дата текущей
    const isToday = currentDate.getDate() === today.getDate() && 
                   currentDate.getMonth() === today.getMonth() && 
                   currentDate.getFullYear() === today.getFullYear();
                   
    // Проверяем, является ли дата прошедшей
    // Если сегодняшний день и уже поздно вечером
    const isPast = isToday && currentHour >= 19;
    
    allDates.push({
      date: new Date(currentDate),
      dayOfWeek: currentDate.getDay(),
      formatted: `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`,
      value: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
      isPast: isPast,
      isInRange: isInRange,
      isToday: isToday
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return allDates;
};

const allDates = generateAvailableDates();

// Группируем даты по неделям
const groupDatesByWeeks = (dates) => {
  const weeks = [];
  let currentWeek = [];
  
  dates.forEach((dateObj, index) => {
    // Добавляем дату в текущую неделю
    currentWeek.push(dateObj);
    
    // Если это воскресенье или последняя дата, начинаем новую неделю
    if (dateObj.dayOfWeek === 0 || index === dates.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  return weeks;
};

const calendarWeeks = groupDatesByWeeks(allDates);

// Обработчик изменения для полей формы
const handleChange = (e) => {
  const { name, value } = e.target;
  
  // Сбрасываем ошибку валидации для текущего поля
  setValidationErrors(prev => ({ ...prev, [name]: false }));
  
  // Особая обработка для телефона
  if (name === 'phone') {
    // Получаем только цифры из ввода
    const digits = value.replace(/\D/g, '');
    
    // Ограничиваем до 10 цифр (без учета кода +7)
    const limitedDigits = digits.slice(0, 10);
    
    // Форматируем телефон с скобками и дефисами
    let formattedPhone = '';
    
    if (limitedDigits.length > 0) {
      formattedPhone += '(' + limitedDigits.slice(0, 3);
      
      if (limitedDigits.length > 3) {
        formattedPhone += ') ' + limitedDigits.slice(3, 6);
        
        if (limitedDigits.length > 6) {
          formattedPhone += '-' + limitedDigits.slice(6, 8);
          
          if (limitedDigits.length > 8) {
            formattedPhone += '-' + limitedDigits.slice(8, 10);
          }
        }
      } else {
        formattedPhone += ')';
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: formattedPhone 
    }));
  } else {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  }
};

// Форматирование даты из yyyy-mm-dd в dd.mm.yyyy для отображения в поле
const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};

// Обработка отправки формы
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Сбрасываем все ошибки валидации
  setValidationErrors({
    name: false,
    phone: false,
    callTime: false,
    performanceDate: false,
    agree: false
  });
  
  // Проверяем заполнение всех полей
  let hasErrors = false;
  const newValidationErrors = {
    name: !formData.name,
    phone: !formData.phone,
    callTime: !formData.callTime,
    performanceDate: !formData.performanceDate,
    agree: !e.target.agree.checked
  };
  
  if (Object.values(newValidationErrors).some(error => error)) {
    setValidationErrors(newValidationErrors);
    hasErrors = true;
  }
  
  // Получаем только цифры из телефона
  const cleanPhone = formData.phone.replace(/\D/g, '');
  
  // Проверка телефона на корректность
  if (cleanPhone.length < 10) {
    setValidationErrors(prev => ({ ...prev, phone: true }));
    setError({
      isOpen: true,
      message: 'Пожалуйста, введите корректный номер телефона (не менее 10 цифр)'
    });
    hasErrors = true;
  }
  
  if (hasErrors) {
    // Если есть ошибки, показываем сообщение и останавливаем отправку
    if (!error.isOpen) { // Если еще нет сообщения об ошибке телефона
      setError({
        isOpen: true,
        message: 'Пожалуйста, заполните все обязательные поля'
      });
    }
    return;
  }
  
  setIsSubmitting(true);
  
  // Форматируем телефон для отправки
  const formattedPhone = '+7 ' + formData.phone;
  
  // Получаем читаемый формат времени с конкретной датой
  const getReadableTime = (callTimeValue) => {
    if (!callTimeValue) return 'Не указано';
    
    const [day, hour] = callTimeValue.split('-');
    const hourNum = parseInt(hour, 10);
    
    const today = new Date();
    const targetDate = new Date();
    
    if (day === 'tomorrow') {
      targetDate.setDate(today.getDate() + 1);
    }
    
    // Форматируем дату в формате ММ.ДД.ГГГГ
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const date = String(targetDate.getDate()).padStart(2, '0');
    const year = targetDate.getFullYear();
    
    const formattedDate = `${month}.${date}.${year}`;
    
    return `${formattedDate} с ${hourNum}:00 до ${hourNum + 1}:00`;
  };

  // Получаем простое отображение дня (сегодня/завтра) для уведомления пользователю
  const getSimpleDay = (callTimeValue) => {
    if (!callTimeValue) return '';
    
    const [day, hour] = callTimeValue.split('-');
    const hourNum = parseInt(hour, 10);
    
    const dayText = day === 'today' ? 'сегодня' : 'завтра';
    return `${dayText} с ${hourNum}:00 до ${hourNum + 1}:00`;
  };
  
  // Форматирование даты выступления для отправки сообщения
  const formatPerformanceDate = (date) => {
    if (!date) return 'Не указана';
    
    if (date.includes('.')) {
      return date; // Дата уже в формате DD.MM.YYYY
    } else {
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    }
  };
  
  // Форматируем сообщение для Telegram
  const message = `
📝 *НОВЫЙ ЗАКАЗ (АРЕНДА)* 📝

🛍️ *Купальник ${product.name}* (${product.height})
💰 *Аренда:* ${product.price.toLocaleString('ru-RU')} ₽
💳 *Залог:* ${product.deposit.toLocaleString('ru-RU')} ₽
📅 *Дата выступления:* ${formatPerformanceDate(formData.performanceDate)}

👤 *Клиент:* ${formData.name}
📞 *Телефон:* ${formattedPhone}
🕒 *Созвон:* ${getReadableTime(formData.callTime).replace(' с ', ' (с ').replace(' до ', ' до ') + ')'}
  `.trim();
  
  const botToken = '7964652895:AAF2XFFz8stkwABk7Hdo2tOOVj0QhPglMYU';
  const chatId = '6249732484';
  
  try {
    // Имитация отправки на сервер
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Автоматическое закрытие через 3 секунды
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  } catch (error) {
    console.error('Ошибка отправки:', error);
    
    // Показываем сообщение об ошибке
    setError({
      isOpen: true,
      message: 'Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.'
    });
    setIsSubmitting(false);
  }
};

// Закрытие окна с ошибкой
const closeErrorAlert = () => {
  setError({
    isOpen: false,
    message: ''
  });
};

// Если модальное окно не открыто или нет данных о продукте - не рендерим
if (!isOpen || !product) return null;

// Стили для модального окна в виде объектов
const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'flex-start', // Выравниваем по верхнему краю
  justifyContent: 'center',
  zIndex: 9999,
  padding: isMobile ? '0.5rem' : '2rem',
  overflow: 'auto' // Прокрутка для всего оверлея
};

const modalStyles = {
  backgroundColor: '#262626',
  borderRadius: isMobile ? '12px' : '16px',
  maxWidth: '500px',
  width: isMobile ? 'calc(100% - 20px)' : '100%', // Почти полная ширина на мобильных
  position: 'relative',
  padding: isMobile ? '1rem 1rem 1.2rem' : '2rem', // Уменьшаем padding
  color: '#fff',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  border: '1px solid #333',
  margin: isMobile ? '0.5rem auto' : '0 auto',
  maxHeight: isMobile ? 'calc(100vh - 2rem)' : 'auto', // Максимальная высота для мобильных
  overflow: isMobile ? 'auto' : 'visible' // Добавляем прокрутку внутри модального окна
};

const headerStyles = {
  marginBottom: isMobile ? '0.8rem' : '1.5rem',
  paddingBottom: isMobile ? '0.7rem' : '1rem',
  borderBottom: '1px solid #333',
  textAlign: 'center'
};

const titleStyles = {
  fontSize: isMobile ? '1.4rem' : '2rem',
  fontWeight: 'bold',
  color: '#fff',
  margin: 0
};

const productCardStyles = {
  display: 'flex',
  gap: isMobile ? '0.5rem' : '1rem',
  marginBottom: isMobile ? '0.7rem' : '1.5rem',
  padding: isMobile ? '0.7rem' : '1rem',
  backgroundColor: '#1a1a1a',
  borderRadius: isMobile ? '8px' : '12px',
  border: '1px solid #333'
};

const imageContainerStyles = {
  width: isMobile ? '60px' : '100px',
  height: isMobile ? '60px' : '100px',
  borderRadius: isMobile ? '6px' : '8px',
  overflow: 'hidden',
  flexShrink: 0
};

const imageStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const productInfoStyles = {
  flex: 1,
  paddingTop: isMobile ? '2px' : '4px'
};

const productNameStyles = {
  fontSize: isMobile ? '1rem' : '1.1rem',
  fontWeight: 'bold',
  marginBottom: isMobile ? '0.4rem' : '0.8rem',
  color: '#fff'
};

const tagContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem'
};

const sizeInfoStyles = {
  display: 'flex',
  alignItems: 'center',
  color: '#0088ff',
  fontSize: isMobile ? '0.85rem' : '0.95rem'
};

const priceInfoStyles = {
  display: 'flex',
  alignItems: 'center',
  color: '#ffc107',
  fontSize: isMobile ? '0.85rem' : '0.95rem'
};

// Стили кнопки закрытия, аналогичные OrderModal
const closeButtonStyles = {
  position: 'absolute',
  top: isMobile ? '0.5rem' : '1rem',
  right: isMobile ? '0.5rem' : '1rem',
  background: 'rgba(0, 0, 0, 0.7)',
  border: '2px solid rgba(255, 255, 255, 0.5)',
  width: isMobile ? '36px' : '44px',
  height: isMobile ? '36px' : '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  zIndex: 2,
  transition: 'all 0.3s ease',
  padding: isMobile ? '6px' : '8px'
};

const noteStyles = {
  color: '#ddd',
  fontSize: isMobile ? '0.85rem' : '1rem',
  marginBottom: isMobile ? '0.7rem' : '1.5rem',
  lineHeight: '1.3' // Сжимаем высоту текста
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: isMobile ? '0.6rem' : '1rem'
};

const formGroupStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: isMobile ? '0.3rem' : '0.5rem' // Меньше отступ между меткой и полем
};

const labelStyles = {
  fontSize: isMobile ? '0.8rem' : '0.9rem',
  color: '#ccc',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem'
};

const inputStyles = {
  width: '100%',
  padding: isMobile ? '0.6rem 0.8rem' : '0.75rem 1rem', // Меньше высота поля
  backgroundColor: '#1a1a1a',
  border: '1px solid #444',
  borderRadius: '8px',
  color: '#fff',
  fontSize: isMobile ? '0.9rem' : '1rem',
  transition: 'all 0.2s ease'
};

// Стили для ошибок валидации
const errorInputStyles = {
  border: '1px solid #ff4d4f',
  boxShadow: '0 0 0 2px rgba(255, 77, 79, 0.2)'
};

const errorMessageStyles = {
  color: '#ff4d4f',
  fontSize: '0.8rem',
  marginTop: '0.25rem'
};

const twoColumnContainerStyles = {
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  gap: '1rem'
};

const phoneInputContainerStyles = {
  position: 'relative'
};

const phoneCodeStyles = {
  position: 'absolute',
  left: '0.8rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#fff',
  fontSize: isMobile ? '0.9rem' : '1rem',
  opacity: '0.9'
};

const submitButtonStyles = {
  width: '100%',
  padding: isMobile ? '0.7rem' : '0.85rem',
  backgroundColor: '#0066cc',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: isMobile ? '0.95rem' : '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginTop: isMobile ? '0.7rem' : '1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem'
};

// Стили для календаря
const calendarStyles = {
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 10,
  width: '100%',
  maxWidth: '260px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '12px 12px 12px 6px', // Убираем левый отступ
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  marginTop: '5px',
  maxHeight: '350px',
  overflowY: 'auto'
};

const calendarHeaderStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '0',
  marginBottom: '6px',
  borderBottom: '1px solid #333',
  paddingBottom: '6px'
};

const dayHeaderStyles = {
  padding: '4px',
  textAlign: 'center',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  color: '#999',
  width: '28px', // Добавлена фиксированная ширина
  margin: '0 auto' // Добавлено центрирование
};

const calendarGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '0',
  marginBottom: '2px'
};

const dateItemStyles = (isSelected, isDisabled, isToday) => ({
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '2px auto',
  textAlign: 'center',
  backgroundColor: isSelected ? '#0066cc' : 'transparent',
  borderRadius: '50%',
  cursor: isDisabled ? 'default' : 'pointer',
  transition: 'all 0.2s ease',
  opacity: isDisabled ? 0.6 : 1,
  fontSize: '0.85rem'
});

const emptyCellStyles = {
  width: '36px',
  height: '36px',
  margin: '2px auto',
  backgroundColor: 'transparent'
};

// Создаем элемент для модального окна и устанавливаем его инлайн-стили
const modalContent = (
  <div style={overlayStyles} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="rental-modal-content" style={modalStyles}>
      {/* Кнопка закрытия с тем же подходом, как в OrderModal */}
      <button
        onClick={onClose}
        style={closeButtonStyles}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
          e.currentTarget.style.borderColor = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        }}
      >
        <X size={isMobile ? 22 : 28} strokeWidth={2.5} />
      </button>

      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1rem',
            backgroundColor: '#00b894',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>
            Спасибо за заявку!
          </h2>
          <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
            Мы свяжемся с вами в ближайшее время для уточнения деталей аренды.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>
            Автоматическое закрытие через 3 секунды...
          </p>
        </div>
      ) : (
        <>
          <div style={headerStyles}>
            <h2 style={titleStyles}>Забронировать</h2>
          </div>

          {/* Информация о товаре */}
          <div style={productCardStyles}>
            <div style={imageContainerStyles}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={imageStyles} 
              />
            </div>
            <div style={productInfoStyles}>
              <h3 style={productNameStyles}>Купальник "{product.name}"</h3>
              <div style={tagContainerStyles}>
                <div style={sizeInfoStyles}>
                  <Shield size={isMobile ? 14 : 16} color="#0088ff" style={{ marginRight: '8px' }} />
                  Рост: {product.height}
                </div>
                <div style={priceInfoStyles}>
                  <CreditCard size={isMobile ? 14 : 16} color="#ffc107" style={{ marginRight: '8px' }} />
                  Аренда / Залог: {product.price} / {product.deposit} ₽
                </div>
              </div>
            </div>
          </div>

          <div style={noteStyles}>
            Мы свяжемся с вами в указанное время по указанному номеру телефона для уточнения деталей аренды.
          </div>
          
          {/* Отображение общей ошибки валидации */}
          {error.isOpen && (
            <div style={{
              color: '#ff4d4f',
              marginBottom: '1rem',
              textAlign: 'center',
              padding: '0.5rem',
              background: 'rgba(255, 77, 79, 0.1)',
              borderRadius: '4px'
            }}>
              {error.message}
            </div>
          )}
          
          <form style={formStyles} onSubmit={handleSubmit}>
            {/* Имя */}
            <div style={formGroupStyles}>
              <label htmlFor="name" style={labelStyles}>
                <User size={isMobile ? 14 : 16} color="#3498db" /> Ваше имя:
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Введите ваше имя"
                style={{
                  ...inputStyles,
                  ...(validationErrors.name ? errorInputStyles : {})
                }}
              />
              {validationErrors.name && (
                <div style={errorMessageStyles}>Пожалуйста, введите ваше имя</div>
              )}
            </div>
            
            {/* Два поля в одном ряду */}
            <div style={twoColumnContainerStyles}>
              {/* Дата выступления */}
              <div style={{ ...formGroupStyles, flex: 1 }}>
                <label htmlFor="performanceDateDisplay" style={labelStyles}>
                  <Calendar size={isMobile ? 14 : 16} color="#3498db" /> Дата выступления:
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    id="performanceDateDisplay" 
                    value={formData.performanceDate ? formatDate(formData.performanceDate) : ''} 
                    placeholder="ДД.ММ.ГГГГ"
                    readOnly
                    onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                    style={{
                      ...inputStyles,
                      cursor: 'pointer',
                      ...(validationErrors.performanceDate ? errorInputStyles : {})
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      right: '5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      zIndex: 1
                    }}
                    onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  
                  {validationErrors.performanceDate && (
                    <div style={errorMessageStyles}>Пожалуйста, выберите дату выступления</div>
                  )}
                  
                  {showCustomCalendar && (
                    <div id="custom-calendar" style={calendarStyles}>
                      {/* Заголовок календаря с днями недели */}
                      <div style={calendarHeaderStyles}>
                        <div style={dayHeaderStyles}>ПН</div>
                        <div style={dayHeaderStyles}>ВТ</div>
                        <div style={dayHeaderStyles}>СР</div>
                        <div style={dayHeaderStyles}>ЧТ</div>
                        <div style={dayHeaderStyles}>ПТ</div>
                        <div style={dayHeaderStyles}>СБ</div>
                        <div style={dayHeaderStyles}>ВС</div>
                      </div>
                      
                      {/* Отображение дат по неделям */}
                      {calendarWeeks.map((week, weekIndex) => (
                        <div key={`week-${weekIndex}`} style={calendarGridStyles}>
                          {week.map((dateObj, dayIndex) => (
                            dateObj ? (
                              <div
                                key={dateObj.date.getTime()}
                                onClick={() => {
                                  if (dateObj.isInRange && !dateObj.isPast) {
                                    setFormData({...formData, performanceDate: dateObj.value});
                                    setValidationErrors(prev => ({ ...prev, performanceDate: false }));
                                    setShowCustomCalendar(false);
                                  }
                                }}
                                style={{
                                  ...dateItemStyles(
                                    formData.performanceDate === dateObj.value,
                                    !dateObj.isInRange || dateObj.isPast,
                                    dateObj.isToday
                                  ),
                                  fontWeight: dateObj.isToday ? 'bold' : 'normal',
                                  color: dateObj.isToday ? '#0066cc' : 
                                         (!dateObj.isInRange ? 'rgba(255, 255, 255, 0.1)' : 
                                         dateObj.isPast ? 'rgba(255, 255, 255, 0.3)' : '#fff')
                                }}
                                onMouseOver={(e) => {
                                  if (dateObj.isInRange && !dateObj.isPast) {
                                    e.currentTarget.style.backgroundColor = formData.performanceDate === dateObj.value ? '#0077ee' : '#333';
                                    if (!dateObj.isToday) {
                                      e.currentTarget.style.color = '#fff';
                                    }
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if (dateObj.isInRange && !dateObj.isPast) {
                                    e.currentTarget.style.backgroundColor = formData.performanceDate === dateObj.value ? '#0066cc' : 'transparent';
                                    if (!dateObj.isToday && formData.performanceDate !== dateObj.value) {
                                      e.currentTarget.style.color = '#fff';
                                    }
                                  }
                                }}
                              >
                                {dateObj.date.getDate()}
                              </div>
                            ) : (
                              <div key={`empty-${dayIndex}`} style={emptyCellStyles}></div>
                            )
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Телефон */}
              <div style={{ ...formGroupStyles, flex: 1 }}>
                <label htmlFor="phone" style={labelStyles}>
                  <Phone size={isMobile ? 14 : 16} color="#3498db" /> Телефон:
                </label>
                <div style={phoneInputContainerStyles}>
                  <span style={phoneCodeStyles}>+7</span>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="(___) ___-__-__"
                    required 
                    style={{
                      ...inputStyles,
                      paddingLeft: '2.2rem',
                      ...(validationErrors.phone ? errorInputStyles : {})
                    }}
                  />
                </div>
                {validationErrors.phone && (
                  <div style={errorMessageStyles}>Пожалуйста, введите корректный номер телефона</div>
                )}
              </div>
            </div>
              
            {/* Время для звонка */}
            <div style={formGroupStyles}>
              <label htmlFor="callTime" style={labelStyles}>
                <Clock size={isMobile ? 14 : 16} color="#3498db" /> Удобное время для звонка:
              </label>
              <div style={{ position: 'relative' }}>
                <select 
                  id="callTime" 
                  name="callTime" 
                  value={formData.callTime} 
                  onChange={handleChange} 
                  required
                  style={{
                    ...inputStyles,
                    appearance: 'none',
                    ...(validationErrors.callTime ? errorInputStyles : {})
                  }}
                >
                  <option value="">Выберите время</option>
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '1rem',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              {validationErrors.callTime && (
                <div style={errorMessageStyles}>Пожалуйста, выберите удобное время для звонка</div>
              )}
            </div>

            {/* Чекбокс согласия с условиями */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '0.5rem', 
              marginTop: isMobile ? '0.3rem' : '0.5rem'
            }}>
              <input
                type="checkbox"
                id="agree"
                name="agree"
                required
                style={{ 
                  marginTop: '0.25rem',
                  width: isMobile ? '16px' : '18px',
                  height: isMobile ? '16px' : '18px',
                  ...(validationErrors.agree ? { outline: '1px solid #ff4d4f' } : {})
                }}
                onChange={() => setValidationErrors(prev => ({ ...prev, agree: false }))}
              />
              <label htmlFor="agree" style={{ 
                fontSize: isMobile ? '0.8rem' : '0.9rem', 
                color: validationErrors.agree ? '#ff4d4f' : '#bbb', 
                lineHeight: '1.3'
              }}>
                Я ознакомлен/а с <a href="#" style={{ color: '#3498db', textDecoration: 'none' }}>условиями проката</a> и согласен/на с ними
              </label>
            </div>
            
            {/* Общее сообщение об ошибке валидации */}
            {Object.values(validationErrors).some(error => error) && !error.isOpen && (
              <div style={{
                color: '#ff4d4f',
                marginTop: '0.5rem',
                textAlign: 'center',
                padding: '0.5rem',
                background: 'rgba(255, 77, 79, 0.1)',
                borderRadius: '4px'
              }}>
                Пожалуйста, заполните все обязательные поля
              </div>
            )}
              
            {/* Кнопка отправки */}
            <button 
              type="submit" 
              style={{
                ...submitButtonStyles,
                backgroundColor: isSubmitting ? '#555' : '#0066cc',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="60 28" />
                </svg>
              )}
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        </>
      )}
    </div>
  </div>
);

// Используем ReactDOM.createPortal для рендеринга вне основного дерева компонентов
return ReactDOM.createPortal(
  modalContent, 
  document.body
);
};

export default RentalFormModal;




import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ErrorAlert from './ErrorAlert';
import ReactDOM from 'react-dom';

const RentalFormModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    callTime: '',
    performanceDate: ''
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);

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
      
      // Блокируем прокрутку страницы при открытии модального окна
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Разрешаем прокрутку страницы при закрытии модального окна
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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
    
    // Получаем только цифры из телефона
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    // Простая валидация телефона
    if (cleanPhone.length < 10) {
      // Показываем кастомное сообщение об ошибке
      setError({
        isOpen: true,
        message: 'Пожалуйста, введите корректный номер телефона (не менее 10 цифр)'
      });
      return;
    }
    
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
    💰 *Аренда / Залог:* ${product.price.toLocaleString('ru-RU')} / ${product.deposit.toLocaleString('ru-RU')} ₽
    📅 *Дата выступления:* ${formatPerformanceDate(formData.performanceDate)}
    
    👤 *Клиент:* ${formData.name}
    📞 *Телефон:* ${formattedPhone}
    🕒 *Созвон:* ${getReadableTime(formData.callTime).replace(' с ', ' (с ').replace(' до ', ' до ') + ')'}
    `.trim();
    
    const botToken = '7964652895:AAF2XFFz8stkwABk7Hdo2tOOVj0QhPglMYU';
    const chatId = '6249732484';
    
    try {
      // Отправляем сообщение через Telegram API
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        // Формируем персонализированное сообщение успеха
        const successMessage = `Спасибо за заказ аренды, ${formData.name}! Мы свяжемся с вами ${getSimpleDay(formData.callTime)}.`;
        
        // Успешная отправка
        setError({
          isOpen: true,
          message: successMessage
        });
        
        // После закрытия оповещения закрываем модальное окно
        setTimeout(() => {
          onClose();
        }, 10000);
      } else {
        // Ошибка на стороне API Telegram
        throw new Error(data.description || 'Telegram API error');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      
      // Показываем сообщение об ошибке
      setError({
        isOpen: true,
        message: 'Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.'
      });
    }
  };

  // Закрытие окна с ошибкой
  const closeErrorAlert = () => {
    setError({
      isOpen: false,
      message: ''
    });
  };

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

  if (!isOpen || !product) return null;

  // Стили для внешнего контейнера модального окна (оверлей)
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'flex-start', // Изменено с center на flex-start
    justifyContent: 'center',
    zIndex: 9999,
    padding: isMobile ? '1rem' : '2rem',
    overflow: 'auto' // Обеспечиваем прокрутку
  };

  // Стили для модального окна
  const modalStyles = {
    background: '#262626',
    borderRadius: isMobile ? '12px' : '16px',
    maxWidth: '600px',
    width: isMobile ? 'calc(100% - 20px)' : '100%', // Почти полная ширина на мобильных
    position: 'relative',
    padding: isMobile ? '1.5rem' : '2.5rem',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    margin: isMobile ? '30px 10px' : '50px auto'
  };

  const headingStyles = {
    fontSize: isMobile ? '1.6rem' : '2rem',
    marginBottom: isMobile ? '1rem' : '1.5rem',
    color: '#fff',
    textAlign: 'center'
  };

  const productInfoStyles = {
    display: 'flex',
    gap: isMobile ? '10px' : '15px',
    marginBottom: isMobile ? '1rem' : '1.5rem',
    background: 'rgba(0,0,0,0.2)',
    padding: isMobile ? '10px' : '15px',
    borderRadius: '8px'
  };

  const productImageStyles = {
    width: isMobile ? '70px' : '90px',
    height: isMobile ? '70px' : '90px',
    minWidth: isMobile ? '70px' : '90px',
    borderRadius: '6px',
    overflow: 'hidden',
    background: '#1a1a1a',
    border: '1px solid #333'
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const productDetailsStyles = {
    flex: 1
  };

  const productNameStyles = {
    fontSize: isMobile ? '1rem' : '1.1rem',
    fontWeight: 600,
    marginBottom: '5px',
    color: '#fff'
  };

  const productParamsStyles = {
    color: '#ccc',
    fontSize: isMobile ? '0.9rem' : '0.95rem',
    lineHeight: 1.5
  };

  const noteStyles = {
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    color: '#ccc',
    marginBottom: isMobile ? '1rem' : '1.5rem'
  };

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '12px' : '15px'
  };

  const formGroupStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  const labelStyles = {
    color: '#ccc',
    fontSize: isMobile ? '0.85rem' : '0.9rem'
  };

  const inputStyles = {
    padding: isMobile ? '8px 12px' : '10px 15px',
    borderRadius: '8px',
    border: '1px solid #444',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: isMobile ? '0.95rem' : '1rem'
  };

  const buttonStyles = {
    display: 'block',
    width: '100%',
    padding: isMobile ? '0.8rem' : '1rem',
    backgroundColor: 'var(--color-primary, #0066cc)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: isMobile ? '0.95rem' : '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px'
  };

  // Стили для кнопки закрытия
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

  // Стили для адаптивной компоновки полей "Дата выступления" и "Телефон" в линию
  const twoColumnsContainerStyles = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '12px' : '15px',
  };
  
  const columnStyles = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  };

  // Календарь
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
    padding: '12px',
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
    color: '#999'
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

  // Создаем портал для рендеринга модального окна в конце body
  // Это помогает избежать проблем с z-index и позиционированием
  const modalContent = (
    <>
      <div 
        style={overlayStyles} 
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div style={modalStyles}>
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

          <h2 style={headingStyles}>Забронировать</h2>

          {/* Информация о товаре */}
          <div style={productInfoStyles}>
            {product.image && (
              <div style={productImageStyles}>
                <img src={product.image} alt={product.name} style={imageStyles} />
              </div>
            )}
            <div style={productDetailsStyles}>
              <p style={productNameStyles}>Купальник {product.name}</p>
              <p style={productParamsStyles}>
                Рост: {product.height}
                <br />
                Аренда: {product.price.toLocaleString('ru-RU')} ₽
                <br />
                Залог: {product.deposit.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>

          <p style={noteStyles}>
            Мы свяжемся с вами в указанное вами время по указанному вами номеру телефона для уточнения деталей аренды.
          </p>
              
          <form style={formStyles} onSubmit={handleSubmit}>
            <div style={formGroupStyles}>
              <label htmlFor="name" style={labelStyles}>Ваше имя:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={inputStyles}
              />
            </div>
            
            {/* Две колонки для даты и телефона */}
            <div style={twoColumnsContainerStyles}>
              {/* Колонка для даты выступления */}
              <div style={columnStyles}>
                <label htmlFor="performanceDateDisplay" style={labelStyles}>Дата выступления:</label>
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
                      width: '100%',
                      boxSizing: 'border-box'
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
              
              {/* Колонка для телефона */}
              <div style={columnStyles}>
                <label htmlFor="phone" style={labelStyles}>Телефон:</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '15px',
                    color: '#fff'
                  }}>+7 </span>
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
                      paddingLeft: '40px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>
              
            <div style={formGroupStyles}>
              <label htmlFor="callTime" style={labelStyles}>Удобное время для звонка:</label>
              <select 
                id="callTime" 
                name="callTime" 
                value={formData.callTime} 
                onChange={handleChange} 
                required
                style={{
                  ...inputStyles, 
                  appearance: 'none',
                  height: isMobile ? '40px' : 'auto'
                }}
              >
                <option value="">Выберите время</option>
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
              
            <button 
              type="submit" 
              style={buttonStyles}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent, #0056b3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary, #0066cc)';
              }}
            >
              Отправить
            </button>
          </form>
        </div>
      </div>

      {/* Кастомное модальное окно для ошибок */}
      <ErrorAlert 
        isOpen={error.isOpen}
        onClose={closeErrorAlert}
        message={error.message}
      />
    </>
  );

  // Используем ReactDOM.createPortal для рендеринга модального окна в конце body
  return ReactDOM.createPortal(
    modalContent, 
    document.body
  );
};

export default RentalFormModal;

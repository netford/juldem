// hooks/useCustomOrderForm.js
import { useState, useEffect, useRef } from 'react';

const useCustomOrderForm = (onClose, product, isOpen = true) => {
  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: '',
    callTime: '',
    sportType: '',
    height: '',
    dueDate: ''
  });
  
  // Состояние для кастомного календаря
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const calendarRef = useRef(null);
  
  // Состояние для определения Firefox Mobile
  const [isFirefoxMobile, setIsFirefoxMobile] = useState(false);
  
  // Состояние для обработки UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
  });
  
  // Состояние для отслеживания ошибок валидации
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    city: false,
    phone: false,
    callTime: false,
    sportType: false,
    height: false,
    dueDate: false
  });

  // Предотвращаем многократную отправку формы
  const isSubmittingRef = useRef(false);

  // Определение мобильного устройства и Firefox
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Определяем Firefox Mobile
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      setIsFirefoxMobile(isFirefox && mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Закрытие календаря при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          event.target.id !== 'dueDateDisplay') {
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

  // Сброс формы при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      // Сбрасываем форму
      setFormData({
        name: '',
        city: '',
        phone: '',
        callTime: '',
        sportType: '',
        height: '',
        dueDate: ''
      });
      setSuccess(false);
      // Сбрасываем ошибки валидации
      setValidationErrors({
        name: false,
        city: false,
        phone: false,
        callTime: false,
        sportType: false,
        height: false,
        dueDate: false
      });
      // Сбрасываем состояние блокировки отправки
      isSubmittingRef.current = false;
    }
  }, [isOpen]);

  // Функция для скрытия сообщения об ошибке при фокусе любого поля
  const clearErrorOnFocus = () => {
    if (error.isOpen) {
      setError({
        isOpen: false,
        message: ''
      });
    }
  };

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

  // Форматирование телефона на основе цифр
  const formatPhoneNumber = (digits) => {
    let formattedPhone = '';
    
    if (digits.length > 0) {
      formattedPhone += '(' + digits.slice(0, 3);
      
      if (digits.length > 3) {
        formattedPhone += ') ' + digits.slice(3, 6);
        
        if (digits.length > 6) {
          formattedPhone += '-' + digits.slice(6, 8);
          
          if (digits.length > 8) {
            formattedPhone += '-' + digits.slice(8, 10);
          }
        }
      } else {
        formattedPhone += ')';
      }
    }
    
    return formattedPhone;
  };

  // Обработчик для поля телефона с полным контролем ввода
  const handlePhoneInput = (e) => {
    // Получаем текущее значение поля и убираем все нецифровые символы
    let digits = formData.phone.replace(/\D/g, '');
    
    // Если это удаление символа (Backspace или Delete)
    if (e.nativeEvent.inputType === 'deleteContentBackward' || 
        e.nativeEvent.inputType === 'deleteContentForward') {
      // Удаляем последнюю цифру
      digits = digits.slice(0, digits.length - 1);
    } 
    // Если это добавление символа
    else if (e.nativeEvent.data && /\d/.test(e.nativeEvent.data)) {
      // Добавляем новую цифру (не более 10)
      digits = (digits + e.nativeEvent.data).slice(0, 10);
    }
    
    // Форматируем телефон
    const formattedPhone = formatPhoneNumber(digits);
    
    // Обновляем телефон в состоянии
    setFormData(prev => ({ 
      ...prev, 
      phone: formattedPhone 
    }));
    
    // Сбрасываем ошибку валидации
    setValidationErrors(prev => ({ ...prev, phone: false }));
  };

  // Обработчик нажатия клавиш для поля телефона
  const handlePhoneKeyDown = (e) => {
    // Обрабатываем только нажатие Backspace
    if (e.key === 'Backspace') {
      // Получаем текущее значение поля и убираем все нецифровые символы
      const digits = formData.phone.replace(/\D/g, '');
      
      if (digits.length > 0) {
        // Удаляем последнюю цифру
        const newDigits = digits.slice(0, digits.length - 1);
        
        // Форматируем телефон заново
        const formattedPhone = formatPhoneNumber(newDigits);
        
        // Обновляем телефон в состоянии
        setFormData(prev => ({ 
          ...prev, 
          phone: formattedPhone 
        }));
        
        // Предотвращаем стандартную обработку
        e.preventDefault();
      }
    }
  };

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
      const formattedPhone = formatPhoneNumber(limitedDigits);
      
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

  // Генерация календарных недель с учетом ограничения в 7 дней
  const generateCalendarWeeks = () => {
    const today = new Date();
    
    // Минимальная дата - сегодня + 7 дней
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7);
    
    // Функция для получения названия дня недели
    const getDayOfWeekName = (dayIndex) => {
      const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      return dayNames[dayIndex];
    };
    
    // Генерация дат на 30 дней вперед, начиная с минимальной даты
    const generateAvailableDates = () => {
      const dates = [];
      const lastDate = new Date(minDate);
      lastDate.setDate(minDate.getDate() + 30); // 30 дней вперед
      
      // Определяем первый день недели (понедельник)
      const firstMonday = new Date(minDate);
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
        // Проверяем, находится ли дата в диапазоне разрешенных дат
        const isInRange = currentDate >= minDate && currentDate <= lastDate;
        
        // Проверяем, является ли дата текущей
        const isToday = currentDate.getDate() === today.getDate() && 
                      currentDate.getMonth() === today.getMonth() && 
                      currentDate.getFullYear() === today.getFullYear();
        
        allDates.push({
          date: new Date(currentDate),
          dayOfWeek: currentDate.getDay(),
          formatted: `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`,
          value: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
          isPast: false, // Не может быть в прошлом, т.к. минимальная дата в будущем
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
    
    return groupDatesByWeeks(allDates);
  };

  // Проверка формы на валидность
  const validateForm = () => {
    // Определяем, какие поля являются обязательными
    const requiredFields = {
      name: true,
      city: false, // необязательное поле
      phone: true,
      callTime: true,
      sportType: true,
      height: true,
      dueDate: false // необязательное поле
    };
    
    // Сбрасываем все ошибки валидации
    const newValidationErrors = {};
    let hasErrors = false;
    
    // Проверяем заполнение всех обязательных полей
    for (const field in requiredFields) {
      if (requiredFields[field]) {
        const isEmpty = !formData[field];
        newValidationErrors[field] = isEmpty;
        if (isEmpty) hasErrors = true;
      }
    }
    
    // Дополнительная проверка телефона
    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const isPhoneValid = cleanPhone.length >= 10;
      newValidationErrors.phone = !isPhoneValid;
      if (!isPhoneValid) hasErrors = true;
    }
    
    // Устанавливаем новые ошибки валидации
    setValidationErrors(newValidationErrors);
    
    return !hasErrors;
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Предотвращаем многократную отправку
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    
    // Проверяем валидность формы
    const isFormValid = validateForm();
    
    if (!isFormValid) {
      // Показываем сообщение об ошибке
      setError({
        isOpen: true,
        message: 'Пожалуйста, заполните все обязательные поля'
      });
      
      // Сбрасываем блокировку отправки
      isSubmittingRef.current = false;
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
      
      // Форматируем дату в формате ДД.ММ.ГГГГ
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const date = String(targetDate.getDate()).padStart(2, '0');
      const year = targetDate.getFullYear();
      
      const formattedDate = `${date}.${month}.${year}`;
      
      return `${formattedDate} с ${hourNum}:00 до ${hourNum + 1}:00`;
    };
    
    // Формируем спортивное направление
    const getSportTypeText = (sportTypeValue) => {
      if (!sportTypeValue) return 'Не указано';
      
      switch (sportTypeValue) {
        case 'gymnastics':
          return 'Художественная гимнастика';
        case 'figure-skating':
          return 'Фигурное катание';
        case 'acrobatics':
          return 'Акробатика';
        case 'other':
          return 'Другое';
        default:
          return sportTypeValue;
      }
    };
    
    // Отправка на сервер
    try {
      // Формируем сообщение для Telegram
      const message = `
📝 *НОВЫЙ ЗАКАЗ (ИНДИВИДУАЛЬНЫЙ ПОШИВ)* 📝

👤 *Клиент:* ${formData.name}
🏙️ *Город:* ${formData.city || 'Не указан'}
📞 *Телефон:* ${formattedPhone}
🕒 *Созвон:* ${getReadableTime(formData.callTime)}

🏆 *Вид спорта:* ${getSportTypeText(formData.sportType)}
📏 *Рост:* ${formData.height} см
📅 *Нужен к дате:* ${formData.dueDate ? formatDate(formData.dueDate) : 'Не указано'}
      `.trim();
      
      const botToken = '7964652895:AAF2XFFz8stkwABk7Hdo2tOOVj0QhPglMYU';
      const chatId = '6249732484';
      
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
        setIsSubmitting(false);
        setSuccess(true);
        
        // Автоматическое закрытие через 15 секунд
        setTimeout(() => {
          onClose();
        }, 15000);
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
      setIsSubmitting(false);
    } finally {
      // Сбрасываем блокировку отправки
      isSubmittingRef.current = false;
    }
  };

  // Закрытие окна с ошибкой
  const closeErrorAlert = () => {
    setError({
      isOpen: false,
      message: ''
    });
  };

  // Валидация отдельного поля для немедленной обратной связи
  const validateField = (name, value) => {
    // Проверяем обязательность поля
    const requiredFields = {
      name: true,
      city: false, // необязательное поле
      phone: true,
      callTime: true,
      sportType: true,
      height: true,
      dueDate: false // необязательное поле
    };

    if (!requiredFields[name]) return true; // Необязательное поле всегда валидно
    if (!value) return false; // Обязательное поле не должно быть пустым

    // Специфическая валидация для телефона
    if (name === 'phone') {
      return value.replace(/\D/g, '').length >= 10;
    }

    return true;
  };

  return {
    formData,
    validationErrors,
    error,
    success,
    isSubmitting,
    showCustomCalendar,
    isMobile,
    isFirefoxMobile,
    calendarRef,
    handleChange,
    handleSubmit,
    handlePhoneKeyDown,
    handlePhoneInput,
    setShowCustomCalendar,
    clearErrorOnFocus,
    closeErrorAlert,
    formatDate,
    generateCalendarWeeks,
    validateField,
    validateForm
  };
};

export default useCustomOrderForm;
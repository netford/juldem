// hooks/useRentalForm.js - обновленный код
import { useState, useEffect, useRef } from 'react';

const useRentalForm = (onClose, product) => {
  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    callTime: '',
    performanceDate: ''
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
    phone: false,
    callTime: false,
    performanceDate: false,
    agree: false
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

  // Генерация временных слотов при открытии модального окна
  useEffect(() => {
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
    // Сбрасываем состояние блокировки отправки
    isSubmittingRef.current = false;
  }, []);

  // Функция для скрытия сообщения об ошибке при фокусе любого поля
  const clearErrorOnFocus = () => {
    if (error.isOpen) {
      setError({
        isOpen: false,
        message: ''
      });
    }
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

  // Функция для проверки валидности формы
  const validateForm = () => {
    // Определяем обязательные поля
    const requiredFields = {
      name: true,
      phone: true,
      callTime: true,
      performanceDate: true
    };
    
    // Сбрасываем все ошибки валидации
    const newValidationErrors = {
      name: false,
      phone: false,
      callTime: false,
      performanceDate: false,
      agree: false
    };
    
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
    
    // Проверка согласия с условиями
    const agreeCheckbox = document.getElementById('agree');
    if (agreeCheckbox && !agreeCheckbox.checked) {
      newValidationErrors.agree = true;
      hasErrors = true;
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
    
    const isFormValid = validateForm();
    
    if (!isFormValid) {
      setError({
        isOpen: true,
        message: 'Пожалуйста, заполните все обязательные поля'
      });
      isSubmittingRef.current = false;
      return;
    }
    
    setIsSubmitting(true);
    
    // Форматируем телефон для отправки
    const formattedPhone = '+7 ' + formData.phone;
    
    // Получаем простое отображение дня (сегодня/завтра) для уведомления пользователю
    const getSimpleDay = (callTimeValue) => {
      if (!callTimeValue) return '';
      
      const [day, hour] = callTimeValue.split('-');
      const hourNum = parseInt(hour, 10);
      
      const dayText = day === 'today' ? 'сегодня' : 'завтра';
      return `${dayText} с ${hourNum}:00 до ${hourNum + 1}:00`;
    };
    
    // Подготовка сообщения о выступлении
    const getPerformanceDate = () => {
      if (!formData.performanceDate) return 'Не указано';
      
      // Форматируем дату из формата YYYY-MM-DD в DD.MM.YYYY
      const [year, month, day] = formData.performanceDate.split('-');
      return `${day}.${month}.${year}`;
    };
    
    // Отправка на сервер
    try {
      // Формируем сообщение для Telegram
      const message = `
📝 *НОВЫЙ ЗАКАЗ (ПРОКАТ)* 📝

🛍️ *${product.name}* (${product.height})
💰 *Стоимость проката:* ${product.price.toLocaleString('ru-RU')} ₽
💰 *Залог:* ${product.deposit.toLocaleString('ru-RU')} ₽

👤 *Клиент:* ${formData.name}
📞 *Телефон:* ${formattedPhone}
🕒 *Созвон:* ${getSimpleDay(formData.callTime)}
📅 *Дата выступления:* ${getPerformanceDate()}
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
    if (name === 'phone') {
      return value.replace(/\D/g, '').length >= 10;
    }
    return !!value;
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
    validateField
  };
};

export default useRentalForm;
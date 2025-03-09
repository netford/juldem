// hooks/useOrderForm.js
import { useState, useEffect, useRef } from 'react';

const useOrderForm = (onClose, product) => {
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
  
  // Состояние для обработки UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFirefoxMobile, setIsFirefoxMobile] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
  });
  
  // Состояние для отслеживания ошибок валидации
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    phone: false,
    callTime: false
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

  // Сброс формы при открытии модального окна
  useEffect(() => {
    // Сбрасываем форму
    setFormData({
      name: '',
      phone: '',
      callTime: ''
    });
    setSuccess(false);
    // Сбрасываем ошибки валидации
    setValidationErrors({
      name: false,
      phone: false,
      callTime: false
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

  // Функция для проверки валидности формы
  const validateForm = () => {
    // Определяем обязательные поля
    const requiredFields = {
      name: true,
      phone: true,
      callTime: true
    };
    
    // Сбрасываем все ошибки валидации
    const newValidationErrors = {
      name: false,
      phone: false,
      callTime: false
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
    
    // Отправка на сервер
    try {
      // Формируем сообщение для Telegram
      const message = `
📝 *НОВЫЙ ЗАКАЗ* 📝

🛍️ *Товар:* ${product.name}
📏 *Рост:* ${product.height}
💰 *Цена:* ${product.price.toLocaleString('ru-RU')} руб.

👤 *Клиент:* ${formData.name}
📞 *Телефон:* ${formattedPhone}
🕒 *Удобное время для звонка:* ${getReadableTime(formData.callTime)}
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
    isMobile,
    isFirefoxMobile,
    handleChange,
    handleSubmit,
    handlePhoneKeyDown,
    handlePhoneInput,
    clearErrorOnFocus,
    closeErrorAlert,
    validateField
  };
};

export default useOrderForm;
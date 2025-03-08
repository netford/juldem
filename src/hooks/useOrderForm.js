// hooks/useOrderForm.js
import { useState, useEffect } from 'react';

const useOrderForm = (onClose, product) => {
  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    callTime: ''
  });
  
  // Состояния для обработки UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFirefoxMobile, setIsFirefoxMobile] = useState(false); // Добавлено
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
  });
  
  // Состояние для отслеживания ошибок валидации
  const [validationErrors, setValidationErrors] = useState({ // Добавлено
    name: false,
    phone: false,
    callTime: false
  });

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

  // Сброс формы при открытии
  useEffect(() => {
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
    setError({
      isOpen: false,
      message: ''
    });
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

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка для всех браузеров
    const isFormValid = () => {
      return formData.name && 
             formData.phone && 
             formData.phone.replace(/\D/g, '').length >= 10 &&
             formData.callTime;
    };
    
    // Для Firefox Mobile используем упрощенную валидацию
    if (isFirefoxMobile) {
      if (!isFormValid()) {
        setError({
          isOpen: true,
          message: 'Пожалуйста, заполните все обязательные поля'
        });
        return;
      }
    } else {
      // Для других браузеров используем подробную валидацию
      // Сбрасываем все ошибки валидации
      const newValidationErrors = {
        name: !formData.name,
        phone: !formData.phone,
        callTime: !formData.callTime
      };
      
      setValidationErrors(newValidationErrors);
      
      if (Object.values(newValidationErrors).some(error => error)) {
        setError({
          isOpen: true,
          message: 'Пожалуйста, заполните все обязательные поля'
        });
        return;
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
        return;
      }
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
    
    // Отправка на сервер
    try {
      // Формируем сообщение для Telegram
      const message = `
📝 *НОВЫЙ ЗАКАЗ (ПРОДАЖА)* 📝

🛍️ *${product.name}* (${product.height})
💰 *Цена:* ${product.price.toLocaleString('ru-RU')} ₽

👤 *Клиент:* ${formData.name}
📞 *Телефон:* ${formattedPhone}
🕒 *Созвон:* ${getReadableTime(formData.callTime)}
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
    }
  };

  // Закрытие окна с ошибкой
  const closeErrorAlert = () => {
    setError({
      isOpen: false,
      message: ''
    });
  };

  // Обработчики для телефона
  const handlePhoneKeyDown = (e) => {
    // Обрабатываем только нажатие Backspace
    if (e.key === 'Backspace') {
      // Получаем текущее значение поля и убираем все нецифровые символы
      const digits = formData.phone.replace(/\D/g, '');
      
      if (digits.length > 0) {
        // Удаляем последнюю цифру
        const newDigits = digits.slice(0, digits.length - 1);
        
        // Форматируем телефон заново
        let formattedPhone = '';
        if (newDigits.length > 0) {
          formattedPhone += '(' + newDigits.slice(0, 3);
          
          if (newDigits.length > 3) {
            formattedPhone += ') ' + newDigits.slice(3, 6);
            
            if (newDigits.length > 6) {
              formattedPhone += '-' + newDigits.slice(6, 8);
              
              if (newDigits.length > 8) {
                formattedPhone += '-' + newDigits.slice(8, 10);
              }
            }
          } else {
            formattedPhone += ')';
          }
        }
        
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
    
    // Обновляем телефон в состоянии
    setFormData(prev => ({ 
      ...prev, 
      phone: formattedPhone 
    }));
    
    // Сбрасываем ошибку валидации
    setValidationErrors(prev => ({ ...prev, phone: false }));
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
    closeErrorAlert
  };
};

export default useOrderForm;
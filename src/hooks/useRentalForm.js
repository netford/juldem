// hooks/useRentalForm.js
import { useState, useEffect } from 'react';

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

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка для всех браузеров
    const isFormValid = () => {
      return formData.name && 
             formData.phone && 
             formData.phone.replace(/\D/g, '').length >= 10 &&
             formData.callTime && 
             formData.performanceDate && 
             e.target.agree.checked;
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
      setValidationErrors({
        name: !formData.name,
        phone: !formData.phone,
        callTime: !formData.callTime,
        performanceDate: !formData.performanceDate,
        agree: !e.target.agree.checked
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
    }
  };

  // Закрытие окна с ошибкой
  const closeErrorAlert = () => {
    setError({
      isOpen: false,
      message: ''
    });
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
    handleChange,
    handleSubmit,
    handlePhoneKeyDown,
    handlePhoneInput,
    setShowCustomCalendar,
    clearErrorOnFocus,
    closeErrorAlert,
    formatDate
  };
};

export default useRentalForm;
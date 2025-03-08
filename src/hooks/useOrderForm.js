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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
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

  // Сброс формы при открытии
  useEffect(() => {
    setFormData({
      name: '',
      phone: '',
      callTime: ''
    });
    setSuccess(false);
    setError({
      isOpen: false,
      message: ''
    });
  }, []);

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

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Получаем только цифры из телефона
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    // Простая валидация телефона
    if (cleanPhone.length < 10) {
      // Показываем сообщение об ошибке
      setError({
        isOpen: true,
        message: 'Пожалуйста, введите корректный номер телефона (не менее 10 цифр)'
      });
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
    
    // Имитация отправки на сервер
    try {
      // Форматируем сообщение для Telegram
      const message = `
📝 *НОВЫЙ ЗАКАЗ (ПРОДАЖА)* 📝

🛍️ *${product.name}* (${product.height})
💰 *Цена:* ${product.price.toLocaleString('ru-RU')} ₽

👤 *Клиент:* ${formData.name}
📞 *Телефон:* ${formattedPhone}
🕒 *Созвон:* ${getReadableTime(formData.callTime)}
      `.trim();
      
      // Имитация успешной отправки
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        
        // Формируем персонализированное сообщение успеха
        const successMessage = `Спасибо за заказ, ${formData.name}! Мы свяжемся с вами ${getSimpleDay(formData.callTime)}.`;
        
        // Показываем сообщение успеха
        setError({
          isOpen: true,
          message: successMessage
        });
        
        // Автоматическое закрытие через 15 секунд
        setTimeout(() => {
          onClose();
        }, 15000);
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

  return {
    formData,
    error,
    success,
    isSubmitting,
    isMobile,
    handleChange,
    handleSubmit,
    closeErrorAlert,
  };
};

export default useOrderForm;
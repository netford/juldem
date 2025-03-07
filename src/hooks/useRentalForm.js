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

  // Обработчик изменения для полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Сбрасываем ошибку валидации для текущего поля
    setValidationErrors(prev => ({ ...prev, [name]: false }));
    
    // Особая обработка для телефона
    if (name === 'phone') {
      // Получаем только цифры из ввода
      const digits = value.replace(/\\D/g, '');
      
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
    
    // Проверка для всех браузеров
    const isFormValid = () => {
      return formData.name && 
             formData.phone && 
             formData.phone.replace(/\\D/g, '').length >= 10 &&
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
      const cleanPhone = formData.phone.replace(/\\D/g, '');
      
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
    
    // Имитация отправки на сервер
    try {
      // Формируем сообщение для Telegram (код отправки можно добавить здесь)
      // ...
        
      // Имитация успешной отправки
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
    setShowCustomCalendar,
    clearErrorOnFocus,
    closeErrorAlert,
    formatDate
  };
};

export default useRentalForm;

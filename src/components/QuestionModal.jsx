// QuestionModal.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, MessageSquare } from 'lucide-react';
import styles from './QuestionModal.module.css';

const QuestionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    contact: false,
    message: false
  });
  const [isMobile, setIsMobile] = useState(false);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Сброс формы при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        contact: '',
        message: ''
      });
      setSuccess(false);
      setValidationErrors({
        name: false,
        contact: false,
        message: false
      });
      
      // Блокируем прокрутку страницы при открытии модального окна
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Разрешаем прокрутку страницы при закрытии модального окна
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Обработчик изменения для полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Сбрасываем ошибку валидации для текущего поля
    setValidationErrors(prev => ({
      ...prev,
      [name]: false
    }));
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  // Функция валидации формы
  const validateForm = () => {
    const newValidationErrors = {
      name: !formData.name.trim(),
      contact: !formData.contact.trim(),
      message: !formData.message.trim()
    };
    
    setValidationErrors(newValidationErrors);
    
    return !Object.values(newValidationErrors).some(error => error);
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем валидность формы
    if (!validateForm()) {
      setError({
        isOpen: true,
        message: 'Пожалуйста, заполните все поля формы'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Формируем сообщение для Telegram
      const message = `
📨 *НОВЫЙ ВОПРОС* 📨

👤 *Имя:* ${formData.name}
📞 *Контакт:* ${formData.contact}
❓ *Вопрос:* ${formData.message}
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
        
        // Автоматическое закрытие через 10 секунд
        setTimeout(() => {
          onClose();
        }, 10000);
      } else {
        throw new Error(data.description || 'Telegram API error');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      
      setError({
        isOpen: true,
        message: 'Произошла ошибка при отправке вопроса. Пожалуйста, попробуйте позже.'
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

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalContent}>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <X size={isMobile ? 22 : 28} strokeWidth={2.5} />
        </button>

        {success ? (
          <div className={styles.successContainer}>
            <div className={styles.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className={styles.title}>
              Спасибо за ваш вопрос, {formData.name}!
            </h2>
            <p className={styles.message}>
              Мы свяжемся с вами в ближайшее время.
            </p>
            <button onClick={onClose} className={styles.okButton}>
              ОК
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Задать вопрос</h2>
              <p className={styles.subtitle}>
                Заполните форму, и мы свяжемся с вами для ответа на ваш вопрос
              </p>
            </div>
            
            {error.isOpen && (
              <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className={styles.errorMessage}>
                  {error.message}
                </div>
              </div>
            )}
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Ваше имя <span className={styles.requiredMark}>*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
                  placeholder="Введите ваше имя"
                />
                {validationErrors.name && (
                  <div className={styles.errorMessage}>Пожалуйста, введите ваше имя</div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="contact" className={styles.label}>
                  Телефон или Email <span className={styles.requiredMark}>*</span>
                </label>
                <input 
                  type="text"
                  id="contact" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleChange} 
                  required 
                  className={`${styles.input} ${validationErrors.contact ? styles.inputError : ''}`}
                  placeholder="Введите контактные данные"
                />
                {validationErrors.contact && (
                  <div className={styles.errorMessage}>Пожалуйста, введите контактные данные</div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Ваш вопрос <span className={styles.requiredMark}>*</span>
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  className={`${styles.input} ${styles.textarea} ${validationErrors.message ? styles.inputError : ''}`}
                  placeholder="Введите ваш вопрос"
                  rows={5}
                />
                {validationErrors.message && (
                  <div className={styles.errorMessage}>Пожалуйста, введите ваш вопрос</div>
                )}
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.spinner}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="60 28" />
                    </svg>
                    Отправка...
                  </>
                ) : (
                  <>
                    <MessageSquare size={20} />
                    Отправить вопрос
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  // Используем ReactDOM.createPortal для рендеринга модального окна в конце body
  return ReactDOM.createPortal(
    modalContent, 
    document.body
  );
};

export default QuestionModal;
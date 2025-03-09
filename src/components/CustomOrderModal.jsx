// CustomOrderModal.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, User, MapPin, Phone, Calendar, Clock, ChevronDown } from 'lucide-react';
import styles from './CustomOrderModal.module.css';
import CalendarComponent from './RentalForm/Calendar';
import SuccessMessage from './RentalForm/SuccessMessage';
import ErrorDisplay from './RentalForm/ErrorDisplay';
import useCustomOrderForm from '../hooks/useCustomOrderForm';

const CustomOrderModal = ({ isOpen, onClose, product }) => {
  const {
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
    formatDate,
  } = useCustomOrderForm(onClose, product);

  // Получаем простое отображение дня для уведомления пользователю
  const getSimpleDay = (date) => {
    if (!date) return 'в ближайшее время';
    
    const formattedDate = formatDate(date);
    return `к ${formattedDate}`;
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

  // Блокируем/разблокируем прокрутку страницы
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Если модальное окно не открыто или нет данных о продукте - не рендерим
  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modalContent} custom-modal-content`}>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <X size={isMobile ? 22 : 28} strokeWidth={2.5} />
        </button>

        {success ? (
          <SuccessMessage 
            name={formData.name} 
            callTimeText={getSimpleDay(formData.dueDate)}
            onClose={onClose}
          />
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Индивидуальный пошив</h2>
              <p className={styles.subtitle}>Заполните форму, и мы свяжемся с вами для обсуждения деталей</p>
            </div>

            {/* Отображение общей ошибки валидации */}
            {error.isOpen && (
              <ErrorDisplay message={error.message} />
            )}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Контактная информация */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Контактная информация</h3>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <User size={14} className={styles.icon} />
                    Ваше имя
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={clearErrorOnFocus}
                    required={!isFirefoxMobile}
                    className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
                    placeholder="Введите ваше имя"
                  />
                  {validationErrors.name && !isFirefoxMobile && (
                    <div className={styles.errorMessage}>Пожалуйста, укажите ваше имя</div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MapPin size={14} className={styles.icon} />
                    Город
                  </label>
                  <input 
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onFocus={clearErrorOnFocus}
                    className={`${styles.input} ${validationErrors.city ? styles.inputError : ''}`}
                    placeholder="Введите ваш город"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone size={14} className={styles.icon} />
                    Телефон
                  </label>
                  <div className={styles.phoneInputContainer}>
                    <span className={styles.phoneCode}>+7</span>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onInput={handlePhoneInput}
                      onKeyDown={handlePhoneKeyDown}
                      onFocus={clearErrorOnFocus}
                      required={!isFirefoxMobile}
                      className={`${styles.input} ${styles.phoneInput} ${validationErrors.phone ? styles.inputError : ''}`}
                      placeholder="(___) ___-__-__"
                    />
                  </div>
                  {validationErrors.phone && !isFirefoxMobile && (
                    <div className={styles.errorMessage}>Пожалуйста, введите корректный номер телефона</div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Clock size={14} className={styles.icon} />
                    Удобное время для звонка
                  </label>
                  <div className={styles.selectContainer}>
                    <select
                      name="callTime"
                      value={formData.callTime}
                      onChange={handleChange}
                      onFocus={clearErrorOnFocus}
                      required={!isFirefoxMobile}
                      className={`${styles.input} ${validationErrors.callTime ? styles.inputError : ''}`}
                    >
                      <option value="">Выберите время</option>
                      <option value="morning">С 9:00 до 12:00</option>
                      <option value="afternoon">С 12:00 до 16:00</option>
                      <option value="evening">С 16:00 до 20:00</option>
                    </select>
                    <ChevronDown size={18} className={styles.selectArrow} />
                  </div>
                  {validationErrors.callTime && !isFirefoxMobile && (
                    <div className={styles.errorMessage}>Пожалуйста, выберите удобное время для звонка</div>
                  )}
                </div>
              </div>
              
              {/* Разделитель */}
              <div className={styles.divider}></div>
              
              {/* Информация о купальнике */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Информация о купальнике</h3>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    Вид спорта
                  </label>
                  <div className={styles.selectContainer}>
                    <select
                      name="sportType"
                      value={formData.sportType}
                      onChange={handleChange}
                      onFocus={clearErrorOnFocus}
                      required={!isFirefoxMobile}
                      className={`${styles.input} ${validationErrors.sportType ? styles.inputError : ''}`}
                    >
                      <option value="">Выберите вид спорта</option>
                      <option value="gymnastics">Художественная гимнастика</option>
                      <option value="figure-skating">Фигурное катание</option>
                      <option value="acrobatics">Акробатика</option>
                      <option value="other">Другое</option>
                    </select>
                    <ChevronDown size={18} className={styles.selectArrow} />
                  </div>
                  {validationErrors.sportType && !isFirefoxMobile && (
                    <div className={styles.errorMessage}>Пожалуйста, выберите вид спорта</div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                      <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"/>
                    </svg>
                    Рост
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    onFocus={clearErrorOnFocus}
                    required={!isFirefoxMobile}
                    className={`${styles.input} ${validationErrors.height ? styles.inputError : ''}`}
                    placeholder="Укажите рост в см"
                  />
                  {validationErrors.height && !isFirefoxMobile && (
                    <div className={styles.errorMessage}>Пожалуйста, укажите рост</div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Calendar size={14} className={styles.icon} />
                    К какой дате нужен купальник
                  </label>
                  <div className={styles.datePickerContainer}>
                    <input 
                      type="text" 
                      id="dueDateDisplay" 
                      value={formData.dueDate ? formatDate(formData.dueDate) : ''} 
                      placeholder="ДД.ММ.ГГГГ"
                      readOnly
                      onFocus={clearErrorOnFocus}
                      required={!isFirefoxMobile}
                      onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                      className={`${styles.input} ${validationErrors.dueDate ? styles.inputError : ''}`}
                    />
                    <div 
                      className={styles.calendarIcon}
                      onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                    >
                      <Calendar size={18} />
                    </div>
                    
                    <CalendarComponent 
                      visible={showCustomCalendar}
                      calendarWeeks={[]}  // Will be calculated in the hook
                      selectedDate={formData.dueDate}
                      onDateSelect={(date) => {
                        const event = { 
                          target: { name: 'dueDate', value: date }
                        };
                        handleChange(event);
                        setShowCustomCalendar(false);
                      }}
                      minimumDays={7} // Add minimum days constraint
                    />
                  </div>
                  {validationErrors.dueDate && !isFirefoxMobile && (
                    <div className={styles.errorMessage}>Пожалуйста, выберите дату</div>
                  )}
                </div>
              </div>
              
              {/* Общее сообщение об ошибке валидации */}
              {Object.values(validationErrors).some(error => error) && !isFirefoxMobile && (
                <div className={styles.validationError}>
                  Пожалуйста, заполните все обязательные поля
                </div>
              )}
              
              <button 
                type="submit" 
                className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.spinner}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="60 28" />
                  </svg>
                )}
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>
              
              <div className={styles.termsText}>
                Нажимая кнопку, вы соглашаетесь с <a href="#" className={styles.termsLink}>условиями обработки персональных данных</a>
              </div>
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

export default CustomOrderModal;
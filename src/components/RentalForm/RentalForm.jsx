// RentalForm/RentalForm.jsx
import React, { useEffect, useRef } from 'react';
import { User, Phone, Calendar, Clock } from 'lucide-react';
import FormField from './FormField';
import CalendarComponent from './Calendar';
import useCalendar from '../../hooks/useCalendar';
import styles from './RentalForm.module.css';

const RentalForm = ({ 
  formData, 
  validationErrors, 
  isSubmitting, 
  isMobile,
  showCustomCalendar,
  setShowCustomCalendar,
  handleChange, 
  handleSubmit,
  clearErrorOnFocus,
  formatDate,
}) => {
  const calendarRef = useRef(null);
  const dateFieldRef = useRef(null);
  
  const {
    calendarWeeks,
    timeSlots,
    handleDateSelect,
    isFirefoxMobile,
  } = useCalendar(formData, setShowCustomCalendar, clearErrorOnFocus);

  // Закрытие календаря при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          event.target.id !== 'performanceDateDisplay') {
        setShowCustomCalendar(false);
      }
    };

    if (showCustomCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomCalendar, setShowCustomCalendar]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Имя */}
      <FormField
        label="Ваше имя"
        icon={User}
        name="name"
        value={formData.name}
        onChange={handleChange}
        onFocus={clearErrorOnFocus}
        required={true}
        placeholder="Введите ваше имя"
        error={validationErrors.name ? "Пожалуйста, введите ваше имя" : null}
        isFirefoxMobile={isFirefoxMobile}
      />
      
      <div className={styles.twoColumnContainer}>
        {/* Дата выступления */}
        <div className={styles.columnItem}>
          <FormField
            label="Дата выступления"
            icon={Calendar}
            name="performanceDate"
            error={validationErrors.performanceDate ? "Пожалуйста, выберите дату выступления" : null}
            isFirefoxMobile={isFirefoxMobile}
          >
            <div className={styles.datePickerContainer} ref={calendarRef}>
              <input 
                type="text" 
                id="performanceDateDisplay" 
                ref={dateFieldRef}
                value={formData.performanceDate ? formatDate(formData.performanceDate) : ''} 
                placeholder="ДД.ММ.ГГГГ"
                readOnly
                onFocus={clearErrorOnFocus}
                required={!isFirefoxMobile}
                onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                className={`${styles.input} ${validationErrors.performanceDate ? styles.inputError : ''}`}
              />
              <div 
                className={styles.calendarIcon}
                onClick={() => setShowCustomCalendar(!showCustomCalendar)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              
              <CalendarComponent 
                visible={showCustomCalendar}
                calendarWeeks={calendarWeeks}
                selectedDate={formData.performanceDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </FormField>
        </div>

        {/* Телефон */}
        <div className={styles.columnItem}>
          <FormField
            label="Телефон"
            icon={Phone}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onFocus={clearErrorOnFocus}
            required={true}
            placeholder="(___) ___-__-__"
            error={validationErrors.phone ? "Пожалуйста, введите корректный номер телефона" : null}
            isFirefoxMobile={isFirefoxMobile}
          />
        </div>
      </div>
        
      {/* Время для звонка */}
      <FormField
        label="Удобное время для звонка"
        icon={Clock}
        name="callTime"
        error={validationErrors.callTime ? "Пожалуйста, выберите удобное время для звонка" : null}
        isFirefoxMobile={isFirefoxMobile}
      >
        <div className={styles.selectContainer}>
          <select 
            id="callTime" 
            name="callTime" 
            value={formData.callTime} 
            onChange={handleChange}
            onFocus={clearErrorOnFocus}
            required={!isFirefoxMobile}
            className={`${styles.input} ${validationErrors.callTime ? styles.inputError : ''}`}
          >
            <option value="">Выберите время</option>
            {timeSlots.map(slot => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
          <div className={styles.selectArrow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </FormField>

      {/* Чекбокс согласия с условиями */}
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="agree"
          name="agree"
          required={!isFirefoxMobile}
          onFocus={clearErrorOnFocus}
          className={`${styles.checkbox} ${validationErrors.agree ? styles.checkboxError : ''}`}
          onChange={() => {
            // Сбрасываем ошибку валидации для чекбокса
            if (validationErrors.agree) {
              const event = { target: { name: 'agree', value: true } };
              handleChange(event);
            }
          }}
        />
        <label htmlFor="agree" className={validationErrors.agree ? styles.labelError : styles.checkboxLabel}>
          Я ознакомлен/а с <a href="#" className={styles.link}>условиями проката</a> и согласен/на с ними
        </label>
      </div>
      
      {/* Общее сообщение об ошибке валидации */}
      {Object.values(validationErrors).some(error => error) && (
        <div className={styles.validationError}>
          Пожалуйста, заполните все обязательные поля
        </div>
      )}
        
      {/* Кнопка отправки */}
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
    </form>
  );
};

export default RentalForm;

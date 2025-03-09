// RentalForm/RentalForm.jsx
import React, { useEffect, useRef } from 'react';
import { User, Phone, Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import FormField from './FormField';
import CalendarComponent from './Calendar';
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
  handlePhoneKeyDown,
  handlePhoneInput,
  clearErrorOnFocus,
  formatDate,
  isFirefoxMobile
}) => {
  const calendarRef = useRef(null);
  const dateFieldRef = useRef(null);
  
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

  // Функция для проверки заполненности поля
  const isFieldValid = (fieldName) => {
    if (!formData[fieldName]) return null; // поле не заполнено
    
    // Для телефона делаем дополнительную проверку
    if (fieldName === 'phone') {
      return formData.phone.replace(/\D/g, '').length >= 10 ? true : false;
    }
    
    return true; // поле заполнено
  };
  
  // Функция генерации календарных недель
  const generateCalendarWeeks = () => {
    const today = new Date();
    
    // Минимальная дата - сегодня + 7 дней
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7);
    
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

  const calendarWeeks = generateCalendarWeeks();
  const timeSlots = generateTimeSlots();

  // Обработчик выбора даты
  const handleDateSelect = (dateValue) => {
    setShowCustomCalendar(false);
    clearErrorOnFocus();
    
    // Создаем событие изменения для поля даты выступления
    const event = {
      target: {
        name: 'performanceDate',
        value: dateValue
      }
    };
    
    handleChange(event);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Имя */}
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          <User size={14} color="#3498db" /> Ваше имя <span className={styles.requiredMark}>*</span>
        </label>
        <div className={styles.inputWithValidation}>
          <input 
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={clearErrorOnFocus}
            required={!isFirefoxMobile}
            placeholder="Введите ваше имя"
            className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
          />
          {isFieldValid('name') !== null && (
            <span className={styles.validationIndicator}>
              {isFieldValid('name') 
                ? <Check size={16} className={styles.validIcon} /> 
                : <AlertCircle size={16} className={styles.invalidIcon} />}
            </span>
          )}
        </div>
        {validationErrors.name && !isFirefoxMobile && (
          <div className={styles.errorMessage}>Пожалуйста, введите ваше имя</div>
        )}
      </div>
      
      <div className={styles.twoColumnContainer}>
        {/* Дата выступления */}
        <div className={styles.columnItem}>
          <div className={styles.formGroup}>
            <label htmlFor="performanceDate" className={styles.label}>
              <Calendar size={14} color="#3498db" /> Дата выступления <span className={styles.requiredMark}>*</span>
            </label>
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
                <Calendar size={18} />
              </div>
              {isFieldValid('performanceDate') !== null && (
                <span className={styles.validationIndicator}>
                  {isFieldValid('performanceDate') 
                    ? <Check size={16} className={styles.validIcon} /> 
                    : <AlertCircle size={16} className={styles.invalidIcon} />}
                </span>
              )}
              
              <CalendarComponent 
                visible={showCustomCalendar}
                calendarWeeks={calendarWeeks}
                selectedDate={formData.performanceDate}
                onDateSelect={handleDateSelect}
              />
            </div>
            {validationErrors.performanceDate && !isFirefoxMobile && (
              <div className={styles.errorMessage}>Пожалуйста, выберите дату выступления</div>
            )}
          </div>
        </div>

        {/* Телефон */}
        <div className={styles.columnItem}>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
             <Phone size={14} color="#3498db" /> Телефон<span className={styles.requiredMark}>*</span>
            </label>
            <div className={styles.phoneInputContainer}>
              <span className={styles.phoneCode}>+7</span>
              <input 
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onInput={handlePhoneInput}
                onKeyDown={handlePhoneKeyDown}
                onFocus={clearErrorOnFocus}
                required={!isFirefoxMobile}
                placeholder="(___) ___-__-__"
                className={`${styles.input} ${styles.phoneInput} ${validationErrors.phone ? styles.inputError : ''}`}
              />
              {isFieldValid('phone') !== null && (
                <span className={styles.validationIndicator}>
                  {isFieldValid('phone') 
                    ? <Check size={16} className={styles.validIcon} /> 
                    : <AlertCircle size={16} className={styles.invalidIcon} />}
                </span>
              )}
            </div>
            {validationErrors.phone && !isFirefoxMobile && (
              <div className={styles.errorMessage}>Пожалуйста, введите корректный номер телефона</div>
            )}
          </div>
        </div>
      </div>
        
      {/* Время для звонка */}
      <div className={styles.formGroup}>
        <label htmlFor="callTime" className={styles.label}>
          <Clock size={14} color="#3498db" /> Удобное время для звонка <span className={styles.requiredMark}>*</span>
        </label>
        <div className={styles.selectContainer}>
          <select 
            id="callTime" 
            name="callTime" 
            value={formData.callTime} 
            onChange={handleChange}
            onFocus={clearErrorOnFocus}
            required={!isFirefoxMobile}
            className={`${styles.input} ${styles.selectInput} ${validationErrors.callTime ? styles.inputError : ''}`}
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
          {isFieldValid('callTime') !== null && (
            <span className={styles.validationIndicator}>
              {isFieldValid('callTime') 
                ? <Check size={16} className={styles.validIcon} /> 
                : <AlertCircle size={16} className={styles.invalidIcon} />}
            </span>
          )}
        </div>
        {validationErrors.callTime && !isFirefoxMobile && (
          <div className={styles.errorMessage}>Пожалуйста, выберите удобное время для звонка</div>
        )}
      </div>

      {/* Чекбокс согласия с условиями */}
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="agree"
          name="agree"
          required={!isFirefoxMobile}
          onFocus={clearErrorOnFocus}
          className={`${styles.checkbox} ${validationErrors.agree ? styles.checkboxError : ''}`}
        />
        <label htmlFor="agree" className={validationErrors.agree ? styles.labelError : styles.checkboxLabel}>
          Я ознакомлен/а с <a href="#" className={styles.link}>условиями проката</a> и согласен/на с ними
        </label>
      </div>
      
      {/* Общее сообщение об ошибке валидации */}
      {Object.values(validationErrors).some(error => error) && !isFirefoxMobile && (
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
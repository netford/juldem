// CustomOrderModal.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, User, MapPin, Phone, Calendar, Clock, ChevronDown } from 'lucide-react';
import styles from './CustomOrderModal.module.css';
import CalendarComponent from './OrderForm/Calendar';
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
    calendarRef,
    handleChange,
    handleSubmit,
    handlePhoneKeyDown,
    handlePhoneInput,
    setShowCustomCalendar,
    clearErrorOnFocus,
    closeErrorAlert,
    formatDate,
    generateCalendarWeeks
  } = useCustomOrderForm(onClose, product);
  
  const [activeTab, setActiveTab] = useState('contact'); // Новое состояние для вкладок
  const [timeSlots, setTimeSlots] = useState([]);
  const [heightOptions, setHeightOptions] = useState([]);

  // Получаем простое отображение дня (сегодня/завтра) для уведомления пользователю
  const getSimpleDay = (callTimeValue) => {
    if (!callTimeValue) return 'в ближайшее время';
    
    const [day, hour] = callTimeValue.split('-');
    const hourNum = parseInt(hour, 10);
    
    const dayText = day === 'today' ? 'сегодня' : 'завтра';
    return `${dayText} с ${hourNum}:00 до ${hourNum + 1}:00`;
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

  // Генерация временных слотов и опций для роста при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setTimeSlots(generateTimeSlots());
      
      // Генерация опций роста от 90 до 190 см с шагом 1 см
      const heightOpts = [];
      for (let height = 90; height <= 190; height++) {
        heightOpts.push({
          value: height.toString(),
          label: `${height} см`
        });
      }
      setHeightOptions(heightOpts);
    }
  }, [isOpen]);

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

  // Блокируем/разблокируем прокрутку страницы
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Если модальное окно не открыто - не рендерим
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
            callTimeText={getSimpleDay(formData.callTime)}
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
            
            {/* Вкладки */}
            <div className={styles.tabs}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'contact' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                Контактная информация
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'product' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('product')}
              >
                Информация о купальнике
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Контактная информация - первая вкладка */}
              <div className={`${styles.tabContent} ${activeTab === 'contact' ? styles.activeTabContent : ''}`}>
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
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
                  </div>
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <MapPin size={14} className={styles.icon} />
                        Город <span className={styles.optional}>(необязательно)</span>
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
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
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
                  </div>
                  <div className={styles.formColumn}>
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
                          <ChevronDown size={18} />
                        </div>
                      </div>
                      {validationErrors.callTime && !isFirefoxMobile && (
                        <div className={styles.errorMessage}>Пожалуйста, выберите удобное время для звонка</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.formNavigation}>
                  <button 
                    type="button" 
                    className={styles.nextButton}
                    onClick={() => setActiveTab('product')}
                  >
                    Далее
                  </button>
                </div>
              </div>
              
              {/* Информация о купальнике - вторая вкладка */}
              <div className={`${styles.tabContent} ${activeTab === 'product' ? styles.activeTabContent : ''}`}>
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
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
                          className={`${styles.input} ${styles.selectInput} ${validationErrors.sportType ? styles.inputError : ''}`}
                        >
                          <option value="">Выберите вид спорта</option>
                          <option value="gymnastics">Художественная гимнастика</option>
                          <option value="figure-skating">Фигурное катание</option>
                          <option value="acrobatics">Акробатика</option>
                          <option value="other">Другое</option>
                        </select>
                        <div className={styles.selectArrow}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                      {validationErrors.sportType && !isFirefoxMobile && (
                        <div className={styles.errorMessage}>Пожалуйста, выберите вид спорта</div>
                      )}
                    </div>
                  </div>
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                          <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"/>
                        </svg>
                        Рост
                      </label>
                      <div className={styles.selectContainer}>
                        <select
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          onFocus={clearErrorOnFocus}
                          required={!isFirefoxMobile}
                          className={`${styles.input} ${styles.selectInput} ${validationErrors.height ? styles.inputError : ''}`}
                        >
                          <option value="">Выберите рост</option>
                          {heightOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className={styles.selectArrow}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                      {validationErrors.height && !isFirefoxMobile && (
                        <div className={styles.errorMessage}>Пожалуйста, укажите рост</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Calendar size={14} className={styles.icon} />
                        К какой дате нужен купальник <span className={styles.optional}>(необязательно)</span>
                      </label>
                      <div className={styles.datePickerContainer}>
                        <input 
                          type="text" 
                          id="dueDateDisplay" 
                          value={formData.dueDate ? formatDate(formData.dueDate) : ''} 
                          placeholder="ДД.ММ.ГГГГ"
                          readOnly
                          onFocus={clearErrorOnFocus}
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
                          selectedDate={formData.dueDate}
                          onDateSelect={(date) => {
                            const event = { 
                              target: { name: 'dueDate', value: date }
                            };
                            handleChange(event);
                            setShowCustomCalendar(false);
                          }}
                          minimumDays={7} // Добавляем минимальное количество дней
                        />
                      </div>
                      {validationErrors.dueDate && !isFirefoxMobile && (
                        <div className={styles.errorMessage}>Пожалуйста, выберите дату</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.formNavigation}>
                  <button 
                    type="button" 
                    className={styles.backButton}
                    onClick={() => setActiveTab('contact')}
                  >
                    Назад
                  </button>
                  
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
                </div>
              </div>
              
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
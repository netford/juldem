// CustomOrderModal.jsx
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, User, MapPin, Phone, Calendar, Clock, ChevronDown, Check, AlertCircle } from 'lucide-react';
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
  
  const [activeTab, setActiveTab] = useState('contact');
  const [timeSlots, setTimeSlots] = useState([]);
  const [heightOptions, setHeightOptions] = useState([]);
  const [formProgress, setFormProgress] = useState({
    contact: 0,
    product: 0
  });
  const [tabValidationErrors, setTabValidationErrors] = useState({
    contact: false,
    product: false
  });
  
  // Refs для прокрутки к первому полю с ошибкой
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const callTimeRef = useRef(null);
  const sportTypeRef = useRef(null);
  const heightRef = useRef(null);

  // Получаем отображение времени звонка
  const getSimpleDay = (callTimeValue) => {
    if (!callTimeValue) return 'в ближайшее время';
    
    const [day, hour] = callTimeValue.split('-');
    const hourNum = parseInt(hour, 10);
    
    const dayText = day === 'today' ? 'сегодня' : 'завтра';
    return `${dayText} с ${hourNum}:00 до ${hourNum + 1}:00`;
  };

  // Обработка ESC для закрытия модального окна
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

  // Закрытие календаря при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && 
          !calendarRef.current.contains(event.target) && 
          event.target.id !== 'dueDateDisplay' &&
          !event.target.closest('.calendar-container')) {
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

  // Обновление индикатора прогресса заполнения формы
  useEffect(() => {
    // Расчет прогресса заполнения для первой вкладки (контактные данные)
    const contactFields = ['name', 'phone', 'callTime'];
    const requiredContactFields = contactFields.filter(field => field !== 'city');
    const contactComplete = requiredContactFields.reduce((count, field) => 
      formData[field] ? count + 1 : count, 0);
    const contactProgress = Math.round((contactComplete / requiredContactFields.length) * 100);
    
    // Расчет прогресса заполнения для второй вкладки (данные о купальнике)
    const productFields = ['sportType', 'height', 'dueDate'];
    const requiredProductFields = productFields.filter(field => field !== 'dueDate');
    const productComplete = requiredProductFields.reduce((count, field) => 
      formData[field] ? count + 1 : count, 0);
    const productProgress = Math.round((productComplete / requiredProductFields.length) * 100);
    
    setFormProgress({
      contact: contactProgress,
      product: productProgress
    });
  }, [formData]);

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

  // Валидация полей при переключении вкладок
  const validateTabBeforeSwitch = (nextTab) => {
    if (nextTab === 'product' && activeTab === 'contact') {
      // Проверяем обязательные поля на первой вкладке перед переходом ко второй
      const hasNameError = !formData.name;
      const hasPhoneError = !formData.phone || formData.phone.replace(/\D/g, '').length < 10;
      const hasCallTimeError = !formData.callTime;
      
      const hasErrors = hasNameError || hasPhoneError || hasCallTimeError;
      
      if (hasErrors) {
        // Устанавливаем ошибки валидации для полей
        const newValidationErrors = {
          ...validationErrors,
          name: hasNameError,
          phone: hasPhoneError,
          callTime: hasCallTimeError
        };
        
        // Показываем ошибку на уровне вкладки
        setTabValidationErrors(prev => ({
          ...prev,
          contact: true
        }));
        
        // Скроллим к первому полю с ошибкой
        if (hasNameError && nameRef.current) {
          nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          nameRef.current.focus();
        } else if (hasPhoneError && phoneRef.current) {
          phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          phoneRef.current.focus();
        } else if (hasCallTimeError && callTimeRef.current) {
          callTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          callTimeRef.current.focus();
        }
        
        // Показываем сообщение об ошибке
        closeErrorAlert();
        setTimeout(() => {
          setError({
            isOpen: true,
            message: 'Пожалуйста, заполните все обязательные поля на этой вкладке перед переходом к следующей'
          });
        }, 100);
        
        return false;
      }
      
      // Если ошибок нет, сбрасываем состояние ошибки для вкладки
      setTabValidationErrors(prev => ({
        ...prev,
        contact: false
      }));
      return true;
    }
    
    return true;
  };

  // Обработчик переключения вкладок с валидацией
  const handleTabSwitch = (nextTab) => {
    if (validateTabBeforeSwitch(nextTab)) {
      setActiveTab(nextTab);
      // Сбрасываем состояние ошибки
      closeErrorAlert();
    }
  };

  // Функция для проверки заполненности поля (для визуальной индикации)
  const isFieldValid = (fieldName) => {
    if (!formData[fieldName]) return null; // поле не заполнено
    
    // Для телефона делаем дополнительную проверку
    if (fieldName === 'phone') {
      return formData.phone.replace(/\D/g, '').length >= 10 ? true : false;
    }
    
    return true; // поле заполнено
  };

  // Обработка нажатия Tab для перехода между полями
  const handleTabKey = (e, fieldName, nextFieldRef) => {
    if (e.key === 'Tab' && !e.shiftKey && nextFieldRef && nextFieldRef.current) {
      e.preventDefault();
      nextFieldRef.current.focus();
    }
  };

  // Обработка потери фокуса для проверки валидности поля
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Проверяем только обязательные поля
    if (['name', 'phone', 'callTime', 'sportType', 'height'].includes(name)) {
      let isValid = !!value;
      
      // Дополнительная проверка для телефона
      if (name === 'phone' && value) {
        isValid = value.replace(/\D/g, '').length >= 10;
      }
      
      if (!isValid) {
        // Устанавливаем ошибку валидации для поля
        setValidationErrors(prev => ({
          ...prev,
          [name]: true
        }));
      }
    }
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
              <p className={styles.subtitle}>
                {isMobile 
                  ? "Мы свяжемся с вами для уточнения деталей заказа" 
                  : "Заполните форму, и мы свяжемся с вами в указанное время по указанному номеру телефона для уточнения деталей заказа."}
              </p>
            </div>

            {/* Отображение общей ошибки валидации */}
            {error.isOpen && (
              <ErrorDisplay message={error.message} />
            )}
            
            {/* Вкладки с индикаторами прогресса */}
            <div className={styles.tabs}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'contact' ? styles.activeTab : ''} ${tabValidationErrors.contact ? styles.tabWithErrors : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                Контактная информация
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{width: `${formProgress.contact}%`}}
                  ></div>
                </div>
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'product' ? styles.activeTab : ''} ${tabValidationErrors.product ? styles.tabWithErrors : ''}`}
                onClick={() => handleTabSwitch('product')}
              >
                Информация о купальнике
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{width: `${formProgress.product}%`}}
                  ></div>
                </div>
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
                        <span className={styles.requiredMark}>*</span>
                      </label>
                      <div className={styles.inputWithValidation}>
                        <input 
                          ref={nameRef}
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={clearErrorOnFocus}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleTabKey(e, 'name', phoneRef)}
                          required={!isFirefoxMobile}
                          className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
                          placeholder="Введите ваше имя"
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
                        <div className={styles.errorMessage}>Пожалуйста, укажите ваше имя</div>
                      )}
                    </div>
                  </div>
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <MapPin size={14} className={styles.icon} />
                        <span>Город <span className={styles.optional}>(необязательно)</span></span>
                      </label>
                      <div className={styles.inputWithValidation}>
                        <input 
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          onFocus={clearErrorOnFocus}
                          className={styles.input}
                          placeholder="Введите ваш город"
                        />
                        {isFieldValid('city') && (
                          <span className={styles.validationIndicator}>
                            <Check size={16} className={styles.validIcon} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Phone size={14} className={styles.icon} />
                        Телефон
                        <span className={styles.requiredMark}>*</span>
                      </label>
                      <div className={styles.phoneInputContainer}>
                        <span className={styles.phoneCode}>+7</span>
                        <input 
                          ref={phoneRef}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onInput={handlePhoneInput}
                          onKeyDown={(e) => {
                            handlePhoneKeyDown(e);
                            handleTabKey(e, 'phone', callTimeRef);
                          }}
                          onFocus={clearErrorOnFocus}
                          onBlur={handleBlur}
                          required={!isFirefoxMobile}
                          className={`${styles.input} ${styles.phoneInput} ${validationErrors.phone ? styles.inputError : ''}`}
                          placeholder="(___) ___-__-__"
                          style={isMobile ? {paddingLeft: "2.4rem"} : {}}
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
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Clock size={14} className={styles.icon} />
                        Удобное время для звонка
                        <span className={styles.requiredMark}>*</span>
                      </label>
                      <div className={styles.selectContainer}>
                        <select
                          ref={callTimeRef}
                          name="callTime"
                          value={formData.callTime}
                          onChange={handleChange}
                          onFocus={clearErrorOnFocus}
                          onBlur={handleBlur}
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
                  </div>
                </div>
                
                <div className={styles.formNavigation}>
                  <button 
                    type="button" 
                    className={styles.nextButton}
                    onClick={() => handleTabSwitch('product')}
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
                        <span className={styles.requiredMark}>*</span>
                      </label>
                      <div className={styles.selectContainer}>
                        <select
                          ref={sportTypeRef}
                          name="sportType"
                          value={formData.sportType}
                          onChange={handleChange}
                          onFocus={clearErrorOnFocus}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleTabKey(e, 'sportType', heightRef)}
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
                        {isFieldValid('sportType') !== null && (
                          <span className={styles.validationIndicator}>
                            {isFieldValid('sportType') 
                              ? <Check size={16} className={styles.validIcon} /> 
                              : <AlertCircle size={16} className={styles.invalidIcon} />}
                          </span>
                        )}
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
                        <span className={styles.requiredMark}>*</span>
                      </label>
                      <div className={styles.selectContainer}>
                        <select
                          ref={heightRef}
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          onFocus={clearErrorOnFocus}
                          onBlur={handleBlur}
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
                        {isFieldValid('height') !== null && (
                          <span className={styles.validationIndicator}>
                            {isFieldValid('height') 
                              ? <Check size={16} className={styles.validIcon} /> 
                              : <AlertCircle size={16} className={styles.invalidIcon} />}
                          </span>
                        )}
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
                        <span>К какой дате нужен купальник <span className={styles.optional}>(необязательно)</span></span>
                      </label>
                      <div className={styles.datePickerContainer} ref={calendarRef}>
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
                        {isFieldValid('dueDate') && (
                          <span className={styles.validationIndicator}>
                            <Check size={16} className={styles.validIcon} />
                          </span>
                        )}
                        
                        <div className="calendar-container">
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
                            minimumDays={7}
                          />
                        </div>
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
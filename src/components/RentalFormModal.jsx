// RentalFormModal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import FormHeader from './RentalForm/FormHeader';
import SuccessMessage from './RentalForm/SuccessMessage';
import RentalForm from './RentalForm/RentalForm';
import ErrorDisplay from './RentalForm/ErrorDisplay';
import useRentalForm from '../hooks/useRentalForm';
import styles from './RentalFormModal.module.css';

const RentalFormModal = ({ isOpen, onClose, product }) => {
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
    validateField
  } = useRentalForm(onClose, product);

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
  if (!isOpen || !product) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modalContent} rental-modal-content`}>
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
              <h2 className={styles.title}>Забронировать</h2>
            </div>

            {/* Информация о товаре */}
            <FormHeader product={product} isMobile={isMobile} />

            <div className={styles.note}>
              Мы свяжемся с вами в указанное время по указанному номеру телефона для уточнения деталей аренды.
            </div>
            
            {/* Отображение общей ошибки валидации */}
            {error.isOpen && (
              <ErrorDisplay message={error.message} />
            )}
            
            <RentalForm
              formData={formData}
              validationErrors={validationErrors}
              isSubmitting={isSubmitting}
              showCustomCalendar={showCustomCalendar}
              setShowCustomCalendar={setShowCustomCalendar}
              isMobile={isMobile}
              isFirefoxMobile={isFirefoxMobile}
              calendarRef={calendarRef}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handlePhoneKeyDown={handlePhoneKeyDown}
              handlePhoneInput={handlePhoneInput}
              clearErrorOnFocus={clearErrorOnFocus}
              formatDate={formatDate}
            />
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

export default RentalFormModal;
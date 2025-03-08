// OrderForm/OrderForm.jsx
import React from 'react';
import { User, Phone, Clock } from 'lucide-react';
import styles from './OrderForm.module.css';

const OrderForm = ({ 
  formData, 
  isSubmitting, 
  isMobile,
  handleChange, 
  handleSubmit 
}) => {
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          <User size={14} color="#3498db" /> Ваше имя:
        </label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className={styles.input}
          placeholder="Введите ваше имя"
        />
      </div>
        
      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.label}>
          <Phone size={14} color="#3498db" /> Телефон:
        </label>
        <div className={styles.phoneInputContainer}>
          <span className={styles.phoneCode}>+7</span>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            placeholder="(___) ___-__-__"
            required 
            className={`${styles.input} ${styles.phoneInput}`}
          />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="callTime" className={styles.label}>
          <Clock size={14} color="#3498db" /> Удобное время для звонка:
        </label>
        <div className={styles.selectContainer}>
          <select 
            id="callTime" 
            name="callTime" 
            value={formData.callTime} 
            onChange={handleChange} 
            required
            className={styles.input}
          >
            <option value="">Выберите время</option>
            {generateTimeSlots().map(slot => (
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
      </div>
      
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
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
};

// Вспомогательная функция для генерации временных слотов
function generateTimeSlots() {
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
}

export default OrderForm;
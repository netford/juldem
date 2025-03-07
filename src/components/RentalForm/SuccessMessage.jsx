// RentalForm/SuccessMessage.jsx
import React from 'react';
import styles from './SuccessMessage.module.css';

const SuccessMessage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 className={styles.title}>
        Спасибо за заявку!
      </h2>
      <p className={styles.message}>
        Мы свяжемся с вами в ближайшее время для уточнения деталей аренды.
      </p>
      <p className={styles.autoClose}>
        Автоматическое закрытие через 3 секунды...
      </p>
    </div>
  );
};

export default SuccessMessage;

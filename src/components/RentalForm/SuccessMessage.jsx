// RentalForm/SuccessMessage.jsx
import React from 'react';
import styles from './SuccessMessage.module.css';

const SuccessMessage = ({ name, callTimeText, onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 className={styles.title}>
        Спасибо за заявку, {name}!
      </h2>
      <p className={styles.message}>
        Мы свяжемся с вами {callTimeText}.
      </p>
      <button onClick={onClose} className={styles.okButton}>
        ОК
      </button>
    </div>
  );
};

export default SuccessMessage;
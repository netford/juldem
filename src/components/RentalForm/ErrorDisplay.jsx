// RentalForm/ErrorDisplay.jsx
import React from 'react';
import styles from './ErrorDisplay.module.css';

const ErrorDisplay = ({ message }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div className={styles.errorMessage}>
        {message}
      </div>
    </div>
  );
};

export default ErrorDisplay;
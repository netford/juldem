// RentalForm/ErrorDisplay.jsx
import React from 'react';
import styles from './ErrorDisplay.module.css';

const ErrorDisplay = ({ message }) => {
  return (
    <div className={styles.errorContainer}>
      {message}
    </div>
  );
};

export default ErrorDisplay;

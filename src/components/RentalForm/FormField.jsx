// RentalForm/FormField.jsx
import React from 'react';
import styles from './FormField.module.css';

const FormField = ({ 
  label, 
  icon: Icon, 
  name, 
  type = 'text', 
  value, 
  onChange,
  onFocus,
  required = false,
  placeholder,
  error,
  isFirefoxMobile = false,
  children,
  showError = true,
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>
        {Icon && <Icon size={14} color="#3498db" />} {label}:
      </label>
      
      {children ? (
        children
      ) : (
        <div className={type === 'tel' ? styles.phoneInputContainer : undefined}>
          {type === 'tel' && <span className={styles.phoneCode}>+7</span>}
          <input 
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            required={!isFirefoxMobile && required}
            placeholder={placeholder}
            className={`${styles.input} ${error ? styles.inputError : ''} ${type === 'tel' ? styles.phoneInput : ''}`}
            {...props}
          />
        </div>
      )}
      
      {error && showError && !isFirefoxMobile && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default FormField;

import React from 'react';
import '../../styles/buttons.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  // Формируем классы на основе пропсов
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'default' && `btn-${size}`,
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? null : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="btn-icon-left">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="btn-icon-right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
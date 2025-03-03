import React from 'react';
import { X } from 'lucide-react';

// Компонент для отображения сообщений об ошибках в стиле сайта
const ErrorAlert = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  
  // Стили согласно дизайну сайта
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '2rem'
  };

  const alertStyles = {
    backgroundColor: '#262626',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '100%',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    position: 'relative',
    color: '#fff'
  };

  const headerContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  };
  
  const logoStyles = {
    marginRight: '10px'
  };

  const websiteUrlStyles = {
    color: '#ccc',
    fontSize: '0.9rem'
  };
  
  const messageStyles = {
    color: '#fff',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  };
  
  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'flex-end'
  };
  
  const buttonStyles = {
    backgroundColor: '#00e6ff',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={overlayStyles}>
      <div style={alertStyles}>
        <div style={headerContainerStyles}>
          <div style={logoStyles}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.1" />
              <text x="50%" y="50%" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle" dominantBaseline="middle">!</text>
            </svg>
          </div>
          <div style={websiteUrlStyles}>www.juldem.ru</div>
        </div>
        
        <div style={messageStyles}>
          {message}
        </div>
        
        <div style={buttonContainerStyles}>
          <button 
            style={buttonStyles} 
            onClick={onClose}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#00ccff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#00e6ff';
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
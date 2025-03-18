import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const DontReadyModal = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильное устройство для адаптивного отображения кнопки
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem'
  };

  const modalStyles = {
    background: '#262626',
    borderRadius: '20px',
    maxWidth: '500px',
    width: '100%',
    padding: '2.5rem',
    color: '#fff',
    textAlign: 'center',
    position: 'relative'
  };

  const messageStyles = {
    fontSize: '2rem',
    marginBottom: '2rem'
  };

  const buttonStyles = {
    padding: '0.8rem 1.2rem',
    backgroundColor: '#0088cc',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer'
  };

  const closeButtonStyles = {
    position: 'absolute',
    top: isMobile ? '1rem' : '1.2rem',
    right: isMobile ? '1rem' : '1.2rem',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    width: isMobile ? '36px' : '40px',
    height: isMobile ? '36px' : '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    zIndex: 2,
    transition: 'all 0.2s ease',
    padding: '0'
  };

  return (
    <div 
      style={overlayStyles}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={modalStyles}>
        <button
          onClick={onClose}
          style={closeButtonStyles}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={isMobile ? 20 : 22} strokeWidth={2.5} />
        </button>
        <h2 style={messageStyles}>Данный функционал пока в разработке</h2>
        <button style={buttonStyles} onClick={onClose}>Ок</button>
      </div>
    </div>
  );
};

export default DontReadyModal;

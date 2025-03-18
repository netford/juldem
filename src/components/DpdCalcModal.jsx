import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const DpdCalcModal = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Обработка нажатия клавиши ESC для закрытия модального окна
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
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Стили модального окна
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
    animation: 'fadeIn 0.3s ease-out',
    overflow: 'auto',
    padding: isMobile ? '1rem' : '1.5rem'
  };

  const modalStyles = {
    position: 'relative',
    backgroundColor: '#262626',
    borderRadius: isMobile ? '12px' : '16px',
    overflow: 'hidden',
    animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    padding: isMobile ? '1.5rem 0.8rem 1rem' : '2rem 1rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: isMobile ? '100%' : '350px', // 350px для десктопа, 100% для мобильных
    maxWidth: isMobile ? '100%' : '700px',
    maxHeight: isMobile ? '95vh' : '95vh'
  };

  const closeButtonStyles = {
    position: 'absolute',
    top: isMobile ? '0.3rem' : '0.5rem',
    right: isMobile ? '0.3rem' : '0.5rem',
    background: 'rgba(0, 0, 0, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    width: isMobile ? '32px' : '36px',
    height: isMobile ? '32px' : '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    zIndex: 2,
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    padding: isMobile ? '5px' : '6px'
  };

  const titleStyles = {
    fontSize: isMobile ? '1.3rem' : '1.6rem',
    fontWeight: 'bold',
    marginBottom: isMobile ? '0.8rem' : '1rem',
    color: '#00e2fc',
    textAlign: 'center',
    padding: '0 1rem'
  };

  const iframeContainerStyles = {
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center'
  };

  const iframeStyles = {
    border: 'none',
    borderRadius: isMobile ? '6px' : '8px',
    backgroundColor: '#fff',
    width: '100%',
    height: isMobile ? '500px' : '750px', // 750px для десктопа, 500px для мобильных
    overflowY: 'scroll'
  };

  // Определения для анимаций
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <div style={overlayStyles} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{animations}</style>
      <div style={modalStyles}>
        <button
          onClick={onClose}
          style={closeButtonStyles}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.borderColor = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          <X size={isMobile ? 20 : 24} strokeWidth={2.5} />
        </button>

        <h2 style={titleStyles}>Калькулятор стоимости доставки Boxberry & DPD</h2>
        
        <div style={iframeContainerStyles}>
          <iframe 
            src="https://maintransport.ru/transportnye-kompanii/calc/external?preset=1&go=Набережные Челны&weight=0.5&length=17&width=9&height=5&agents=17-23&type=1" 
            style={iframeStyles}
            title="Калькулятор DPD"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default DpdCalcModal;
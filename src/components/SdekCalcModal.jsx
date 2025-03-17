import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SdekCalcModal = ({ isOpen, onClose }) => {
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
    overflow: 'auto'
  };

  const modalStyles = {
    position: 'relative',
    width: '90%',
    maxWidth: '900px',
    backgroundColor: '#262626',
    borderRadius: '16px',
    overflow: 'hidden',
    animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const closeButtonStyles = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0, 0, 0, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    zIndex: 2,
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    padding: '8px'
  };

  const titleStyles = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#fff',
    textAlign: 'center'
  };

  const iframeContainerStyles = {
    width: '100%',
    maxWidth: '850px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    transform: 'scale(1.1)',
    transformOrigin: 'center top'
  };

  const iframeStyles = {
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#fff',
    width: '100%',
    height: '550px',
    maxWidth: '850px'
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
          <X size={28} strokeWidth={2.5} />
        </button>

        <h2 style={titleStyles}>Калькулятор стоимости доставки СДЭК</h2>
        
        <div style={iframeContainerStyles}>
          <iframe 
            id="sdek_calc_iframe" 
            src="https://kit.cdek-calc.ru/calc.php?oplata=1&city_from=433&weight=0.5&length=17&width=9&height=5&tarifs=483" 
            width="100%" 
            height="550" 
            scrolling="no" 
            frameBorder="0"
            style={iframeStyles}
            title="Калькулятор СДЭК"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default SdekCalcModal;
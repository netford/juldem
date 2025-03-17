import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const PostShipmentModal = ({ isOpen, onClose }) => {
  const widgetContainerRef = useRef(null);

  // Обработка загрузки виджета Почты России
  useEffect(() => {
    if (isOpen && widgetContainerRef.current) {
      // Удаляем старые скрипты, если они есть
      const oldScripts = document.querySelectorAll('script[src*="pochta.ru/map/widget/widget.js"]');
      oldScripts.forEach(script => script.remove());

      // Создаем новый скрипт
      const script = document.createElement('script');
      script.src = 'https://widget.pochta.ru/map/widget/widget.js';
      script.async = true;
      
      // Добавляем скрипт в документ
      document.body.appendChild(script);

      // Инициализируем виджет после загрузки скрипта
      script.onload = () => {
        if (typeof ecomStartWidget === 'function' && widgetContainerRef.current) {
          ecomStartWidget({
            id: 54847,
            callbackFunction: null,
            containerId: 'ecom-widget',
          });
        }
      };

      // Очистка при закрытии модального окна
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [isOpen]);

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

  // Стили модального окна (скопированные из VideoModal)
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
    maxWidth: '1000px',
    backgroundColor: '#262626',
    borderRadius: '16px',
    overflow: 'hidden',
    animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    height: '80vh',
    maxHeight: '700px',
    display: 'flex',
    flexDirection: 'column'
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

  const containerStyles = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  };

  const widgetStyles = {
    width: '100%',
    height: '100%',
    border: 'none'
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

        <div style={containerStyles} ref={widgetContainerRef}>
          <div id="ecom-widget" style={widgetStyles}></div>
        </div>
      </div>
    </div>
  );
};

export default PostShipmentModal;
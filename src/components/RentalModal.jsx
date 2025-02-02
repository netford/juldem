import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const RentalModal = ({ isOpen, onClose }) => {
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
    padding: '2rem'
  };

  const modalStyles = {
    background: '#262626',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    padding: '2.5rem',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  };

  const headingStyles = {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#fff',
    textAlign: 'center'
  };

  const sectionStyles = {
    marginBottom: '1.5rem'
  };

  const listStyles = {
    listStyleType: 'none',
    padding: 0
  };

  const listItemStyles = {
    marginBottom: '0.75rem',
    paddingLeft: '1.5rem',
    position: 'relative'
  };

  const listItemDotStyles = {
    content: '•',
    position: 'absolute',
    left: 0,
    top: '0.2em',
    color: 'var(--color-primary)'
  };

  const buttonStyles = {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div 
      style={overlayStyles} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={modalStyles}>
        <button
          onClick={onClose}
          style={{
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
            padding: '8px'
          }}
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

        <h2 style={headingStyles}>Прокат спортивных купальников</h2>

        <section style={sectionStyles}>
          <h3>Для кого:</h3>
          <ul style={listStyles}>
            {[
              'Начинающие гимнастки и фигуристки',
              'Спортсменки, которым нужен костюм на короткий период',
              'Те, кто хочет попробовать перед покупкой'
            ].map((item, index) => (
              <li key={index} style={listItemStyles}>
                <span style={listItemDotStyles}>•</span> {item}
              </li>
            ))}
          </ul>
        </section>

        <section style={sectionStyles}>
          <h3>Особые условия проката:</h3>
          <ul style={listStyles}>
            {[
              'Купальник выдается за день до соревнований',
              'Возврат можно осуществить на следующий день после выступления'
            ].map((item, index) => (
              <li key={index} style={listItemStyles}>
                <span style={listItemDotStyles}>•</span> {item}
              </li>
            ))}
          </ul>
        </section>

        <section style={sectionStyles}>
          <h3>Почему именно так?</h3>
          <p>
            Мы позаботились о том, чтобы в день соревнований спортсменка была 
            максимально сконцентрирована только на своем выступлении. 
            Никаких дополнительных волнений о времени сдачи костюма, 
            никаких логистических хлопот перед ответственным моментом.
          </p>
        </section>

        <section style={sectionStyles}>
          <h3>Стоимость:</h3>
          <ul style={listStyles}>
            {[
              'От 1500 ₽ в неделю',
              'Залоговая стоимость: 50% от цены купальника'
            ].map((item, index) => (
              <li key={index} style={listItemStyles}>
                <span style={listItemDotStyles}>•</span> {item}
              </li>
            ))}
          </ul>
        </section>

        <button 
          style={buttonStyles}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          Взять купальник напрокат
        </button>
      </div>
    </div>
  );
};

export default RentalModal;
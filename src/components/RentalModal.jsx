import React, { useEffect, useState } from 'react';
import { X, DollarSign, Shield, Star, ShoppingBag, ChevronDown, ChevronUp, Users, Calendar, HelpCircle } from 'lucide-react';

const RentalModal = ({ isOpen, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  
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
    borderRadius: '20px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    padding: '2.5rem',
    color: '#fff',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2), 0 15px 35px rgba(0,0,0,0.4)'
  };

  const headingStyles = {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  };

  const listItemContainerStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.2rem',
    gap: '12px'
  };
  
  const itemTextStyles = {
    fontSize: '1.1rem',
    lineHeight: '1.4',
    flex: 1
  };
  
  const iconContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    marginTop: '2px',
    flexShrink: 0
  };
  
  const priceHighlightStyles = {
    color: '#00e2fc', 
    fontWeight: 'bold',
    fontSize: '1.25rem'
  };
  
  const detailsButtonStyles = {
    display: 'flex',
    width: '100%',
    padding: '0.8rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#aaa',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };
  
  const mainButtonStyles = {
    display: 'flex',
    width: '100%',
    padding: '1.1rem',
    backgroundColor: '#0088cc',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };
  
  const detailsContainerStyles = {
    marginBottom: '1.5rem',
    padding: '0',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    color: '#bbb',
    display: showDetails ? 'block' : 'none',
    borderLeft: '3px solid #00e2fc',
    overflow: 'hidden'
  };
  
  const detailsSectionStyles = {
    padding: '1.2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start'
  };
  
  const detailsIconStyles = {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px'
  };
  
  const detailsTitleStyles = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '0.5rem'
  };
  
  const detailsTextStyles = {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: '#ccc'
  };
  
  const highlightTextStyles = {
    color: '#FFD700', 
    fontWeight: '500'
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
            top: '1.2rem',
            right: '1.2rem',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            zIndex: 2,
            transition: 'all 0.2s ease',
            padding: '0'
          }}
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
          <X size={22} strokeWidth={2.5} />
        </button>

        <h2 style={headingStyles}>Прокат спортивных купальников</h2>

        <div style={{marginTop: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={listItemContainerStyles}>
            <div style={iconContainerStyles}>
              <DollarSign size={18} color="#00e2fc" />
            </div>
            <div style={itemTextStyles}>
              Стоимость проката: <span style={priceHighlightStyles}>2 000 руб.</span>
            </div>
          </div>
          
          <div style={listItemContainerStyles}>
            <div style={iconContainerStyles}>
              <Shield size={18} color="#FFD700" />
            </div>
            <div style={itemTextStyles}>
              Залог: <strong>50% - 100%</strong> от стоимости купальника
            </div>
          </div>
          
          <div style={listItemContainerStyles}>
            <div style={iconContainerStyles}>
              <Star size={18} color="#FF6B6B" />
            </div>
            <div style={itemTextStyles}>
              Идеально для новичков и коротких проектов
            </div>
          </div>
        </div>
        
        <button 
          style={detailsButtonStyles}
          onClick={() => setShowDetails(!showDetails)}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#ddd';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#aaa';
          }}
        >
          {showDetails ? 'Скрыть подробности' : 'Подробнее об условиях'}
          {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {showDetails && (
          <div style={detailsContainerStyles}>
            <div style={detailsSectionStyles}>
              <div style={detailsIconStyles}>
                <Users size={18} color="#FF6B6B" />
              </div>
              <div>
                <div style={detailsTitleStyles}>Для кого:</div>
                <div style={detailsTextStyles}>
                  <span style={highlightTextStyles}>Начинающие гимнастки и фигуристки</span>, 
                  спортсменки, которым нужен костюм на короткий период.
                </div>
              </div>
            </div>
            
            <div style={detailsSectionStyles}>
              <div style={detailsIconStyles}>
                <Calendar size={18} color="#00e2fc" />
              </div>
              <div>
                <div style={detailsTitleStyles}>Особые условия:</div>
                <div style={detailsTextStyles}>
                  Купальник выдается <span style={highlightTextStyles}>за день до соревнований</span>, 
                  возврат на следующий день после выступления.
                </div>
              </div>
            </div>
            
            <div style={{...detailsSectionStyles, borderBottom: 'none'}}>
              <div style={detailsIconStyles}>
                <HelpCircle size={18} color="#8AE65C" />
              </div>
              <div>
                <div style={detailsTitleStyles}>Почему именно так:</div>
                <div style={detailsTextStyles}>
                  Мы позаботились о том, чтобы в день соревнований 
                  спортсменка была <span style={highlightTextStyles}>максимально сконцентрирована</span> только 
                  на своем выступлении.
                </div>
              </div>
            </div>
          </div>
        )}

        <button 
          style={mainButtonStyles}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0099dd';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0088cc';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ShoppingBag size={20} />
          Выбрать купальник для проката
        </button>
      </div>
    </div>
  );
};

export default RentalModal;
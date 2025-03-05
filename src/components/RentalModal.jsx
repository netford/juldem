import React, { useEffect, useState } from 'react';
import { X, DollarSign, Shield, Star, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

const RentalModal = ({ isOpen, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);
  
  // Определение мобильного устройства и очень маленьких экранов
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsVerySmallScreen(window.innerWidth <= 360);
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
    padding: isMobile ? '1rem' : '2rem'
  };

  const modalStyles = {
    background: '#262626',
    borderRadius: '20px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    padding: isMobile ? '1.8rem 1.5rem' : '2.5rem',
    color: '#fff',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2), 0 15px 35px rgba(0,0,0,0.4)'
  };

  const headingStyles = {
    fontSize: isMobile ? '1.8rem' : '2rem',
    marginBottom: isMobile ? '1.5rem' : '2rem',
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  };

  const listItemContainerStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.2rem',
    gap: isMobile ? '10px' : '12px'
  };
  
  const itemTextStyles = {
    fontSize: isMobile ? '1rem' : '1.1rem',
    lineHeight: '1.4',
    flex: 1
  };
  
  const iconContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '32px' : '36px',
    height: isMobile ? '32px' : '36px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    marginTop: '2px',
    flexShrink: 0
  };
  
  const priceHighlightStyles = {
    color: '#00e2fc', 
    fontWeight: 'bold',
    fontSize: isMobile ? '1.15rem' : '1.25rem'
  };
  
  const detailsButtonStyles = {
    display: 'flex',
    width: '100%',
    padding: isMobile ? '0.7rem' : '0.8rem',
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
    padding: isMobile ? '1.1rem 0.8rem' : '1.1rem',
    backgroundColor: '#0088cc',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: isMobile ? '1rem' : '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '8px' : '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  };
  
  const detailsContainerStyles = {
    marginBottom: '1.5rem',
    padding: '0.5rem 0',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    fontSize: isMobile ? '0.9rem' : '0.95rem',
    color: '#bbb',
    display: showDetails ? 'block' : 'none',
    borderLeft: '3px solid #00e2fc',
    overflow: 'hidden'
  };
  
  const detailsItemStyles = {
    padding: isMobile ? '0.8rem 1rem' : '1rem 1.2rem',
    display: 'flex',
    gap: isMobile ? '12px' : '15px',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
  };
  
  const numberStyles = {
    fontSize: isMobile ? '1.6rem' : '1.8rem',
    fontWeight: 'bold',
    lineHeight: '1',
    marginTop: '-2px',
    marginRight: '4px',
    width: '26px',
    textAlign: 'center',
    fontFamily: "'Arial', sans-serif",
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };
  
  const detailsTextStyles = {
    fontSize: isMobile ? '0.9rem' : '0.95rem',
    lineHeight: '1.5',
    color: '#ccc',
    flex: 1,
    paddingTop: '3px'
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
          <X size={isMobile ? 20 : 22} strokeWidth={2.5} />
        </button>

        <h2 style={headingStyles}>Прокат спортивных купальников</h2>

        <div style={{marginTop: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={listItemContainerStyles}>
            <div style={iconContainerStyles}>
              <DollarSign size={isMobile ? 16 : 18} color="#00e2fc" />
            </div>
            <div style={itemTextStyles}>
              Стоимость проката: <span style={priceHighlightStyles}>2 000 ₽</span>
            </div>
          </div>
          
          <div style={listItemContainerStyles}>
            <div style={iconContainerStyles}>
              <Shield size={isMobile ? 16 : 18} color="#FFD700" />
            </div>
            <div style={itemTextStyles}>
              Залог: <strong>50% - 100%</strong> от стоимости купальника
            </div>
          </div>
          
          <div style={listItemContainerStyles}>
            <div style={iconContainerStyles}>
              <Star size={isMobile ? 16 : 18} color="#FF6B6B" />
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
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showDetails && (
          <div style={detailsContainerStyles}>          
            <div style={detailsItemStyles}>
              <div style={{...numberStyles, color: '#00e2fc'}}>
                1
              </div>
              <div style={detailsTextStyles}>
                Купальник выдается <span style={highlightTextStyles}>за день до соревнований</span>, 
                возврат возможен на следующий день после выступления.
              </div>
            </div>
            
            <div style={detailsItemStyles}>
              <div style={{...numberStyles, color: '#FF6B6B'}}>
                2
              </div>
              <div style={detailsTextStyles}>
                В перерывах используйте <span style={highlightTextStyles}>накидку или олимпийку</span> поверх 
                купальника, чтобы избежать загрязнений и повреждений.
              </div>
            </div>
            
            <div style={{...detailsItemStyles, borderBottom: 'none'}}>
              <div style={{...numberStyles, color: '#8AE65C'}}>
                3
              </div>
              <div style={detailsTextStyles}>
                Купальник должен быть возвращен в исходном состоянии.
              </div>
            </div>
          </div>
        )}

        <button 
          style={mainButtonStyles}
          onClick={() => {}}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0099dd';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0088cc';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.backgroundColor = '#0099dd';
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.backgroundColor = '#0088cc';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ShoppingBag size={isMobile ? 20 : 20} />
          {isVerySmallScreen ? 'Выбрать купальник' : 'Выбрать купальник для проката'}
        </button>
      </div>
    </div>
  );
};

export default RentalModal;
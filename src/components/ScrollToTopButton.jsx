// components/ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Отслеживание скролла для показа/скрытия кнопки
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Очистка обработчика событий при размонтировании
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Функция прокрутки наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`scroll-to-top-button ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Прокрутить наверх"
    >
      <ChevronUp size={24} strokeWidth={2.5} />
      <style jsx>{`
        .scroll-to-top-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 50px;
          height: 50px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
          z-index: 999;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .scroll-to-top-button.visible {
          opacity: 0.8;
          visibility: visible;
          transform: translateY(0);
        }

        .scroll-to-top-button:hover {
          background-color: var(--color-primary, #0066cc);
          opacity: 1;
        }
        
        /* Для обеспечения доступности при использовании клавиатуры */
        .scroll-to-top-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.3);
        }
        
        /* Медиа-запрос для адаптации на мобильных устройствах */
        @media (max-width: 768px) {
          .scroll-to-top-button {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 45px;
            height: 45px;
          }
        }
      `}</style>
    </button>
  );
};

export default ScrollToTopButton;
import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { heroBg } from '../assets/images';
import RentalModal from './RentalModal';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const heroRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      if (!heroRef.current || !backgroundRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      const parallaxValue = Math.min(Math.max(scrollProgress * 50, 0), 50);
      
      backgroundRef.current.style.transform = `scale(1.1) translateY(${parallaxValue}px)`;
      backgroundRef.current.style.filter = `brightness(${1 - scrollProgress * 0.3})`;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openRentalModal = () => {
    setIsRentalModalOpen(true);
  };

  return (
    <section ref={heroRef} id="main" className="hero">
      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-white);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url(${heroBg});
          background-position: center;
          background-size: cover;
          transform: scale(1.1);
          transition: transform 0.6s ease-out, filter 0.6s ease-out;
          will-change: transform;
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.6)
          );
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          max-width: 800px;
          padding: 0 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .hero-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: var(--font-weight-bold);
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 3vw, 2rem);
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .hero-button {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: var(--font-weight-medium);
          transition: var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .hero-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120%;
          height: 120%;
          background: rgba(255, 255, 255, 0.1);
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          transition: transform 0.6s ease-out;
        }

        .hero-button:hover::before {
          transform: translate(-50%, -50%) scale(1);
        }

        .hero-button.primary {
          background: var(--color-primary);
          color: var(--color-white);
          border: none;
        }

        .hero-button.secondary {
          background: transparent;
          color: var(--color-white);
          border: 2px solid var(--color-white);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.6s ease-out;
          pointer-events: none; /* Добавлено это свойство */
          user-select: none; /* И это свойство */
        }

        .scroll-indicator.visible {
          opacity: 1;
          animation: bounce 2s infinite;
        }

        .scroll-indicator:hover {
          animation-play-state: paused;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-20px);
          }
          60% {
            transform: translateX(-50%) translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            padding: 0 2rem;
          }

          .hero-button {
            width: 100%;
          }
        }
      `}</style>

      <div 
        ref={backgroundRef}
        className="hero-background"
      />
      <div className="hero-overlay" />
      
      <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
        <h1 className="hero-title">СПОРТИВНЫЕ КУПАЛЬНИКИ НА ЗАКАЗ</h1>
        <h2 className="hero-subtitle">ПОШИВ | ПРОДАЖА | ПРОКАТ</h2>
        
        <div className="hero-buttons">
          <button className="hero-button primary">
            Готовые модели
          </button>
          <button className="hero-button secondary" onClick={openRentalModal}>
            Прокат купальников
          </button>
        </div>
      </div>

      <div 
        className={`scroll-indicator ${isVisible ? 'visible' : ''}`}
        onClick={scrollToNext}
        role="button"
        aria-label="Прокрутить вниз"
      >
        <ArrowDown 
          size={32}
          color="white"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
      </div>

      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
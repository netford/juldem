import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { heroBg } from '../assets/images';
import RentalModal from './RentalModal';
import CustomOrderModal from './CustomOrderModal';
import styles from './Hero.module.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
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

  const scrollToReadySuits = () => {
    const readySuitsSection = document.getElementById('our-works');
    if (readySuitsSection) {
      readySuitsSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const filterSelect = readySuitsSection.querySelector('select');
        if (filterSelect) {
          filterSelect.value = 'available';
          const changeEvent = new Event('change', { bubbles: true });
          filterSelect.dispatchEvent(changeEvent);
        }
      }, 800);
    }
  };

  const scrollToRentalSuits = () => {
    const readySuitsSection = document.getElementById('our-works');
    if (readySuitsSection) {
      readySuitsSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const filterSelect = readySuitsSection.querySelector('select');
        if (filterSelect) {
          filterSelect.value = 'renta';
          const changeEvent = new Event('change', { bubbles: true });
          filterSelect.dispatchEvent(changeEvent);
        }
      }, 800);
    }
  };

  const scrollToPrices = () => {
    const pricesSection = document.getElementById('prices');
    if (pricesSection) {
      pricesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} id="main" className={styles.hero}>
      <div 
        ref={backgroundRef}
        className={styles.heroBackground}
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className={styles.heroOverlay} />
      
      <div className={`${styles.heroContent} ${isVisible ? styles.visible : ''}`}>
        <h1 className={styles.heroTitle}>СПОРТИВНЫЕ КУПАЛЬНИКИ НА ЗАКАЗ</h1>
        <h2 className={styles.heroSubtitle}>Для художественной гимнастики, фигурного катания и спортивной акробатики</h2>
        
        <div className={styles.heroButtons}>
          <button 
            className={`${styles.heroButton} ${styles.primary}`} 
            onClick={() => setIsCustomOrderModalOpen(true)}
          >
            Индивидуальный пошив
          </button>
          <button 
            className={`${styles.heroButton} ${styles.secondary}`} 
            onClick={scrollToReadySuits}
          >
            Готовые модели
          </button>
          <button 
            className={`${styles.heroButton} ${styles.secondary}`} 
            onClick={scrollToRentalSuits}
          >
            Прокат купальников
          </button>
        </div>
      </div>

      <div 
        className={`${styles.scrollIndicator} ${isVisible ? styles.visible : ''}`}
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
      
      <CustomOrderModal
        isOpen={isCustomOrderModalOpen}
        onClose={() => setIsCustomOrderModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
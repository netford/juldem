import React from 'react';
import { logo } from '../assets/images';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <a href="#main" className={styles.footerLogoLink}>
            <img 
              src={logo} 
              alt="JULDEM" 
              className={styles.footerLogo} 
            />
          </a>
         
          <nav className={styles.footerLinks}>
            <a href="#main" className={styles.footerLink}>Главная</a>
            <a href="#our-works" className={styles.footerLink}>Наши работы</a>
            <a href="#prices" className={styles.footerLink}>Цены</a>
            <a href="#how-to-order" className={styles.footerLink}>Этапы работ</a>
            <a href="#delivery" className={styles.footerLink}>Доставка</a>
            <a href="#about" className={styles.footerLink}>О нас</a>
            <a href="#reviews" className={styles.footerLink}>Отзывы</a>
            <a href="#contacts" className={styles.footerLink}>Контакты</a>
          </nav>

          <div className={styles.footerInfo}>
            <p>Индивидуальный пошив спортивных купальников</p>
            <p>г. Набережные Челны, б-р Кереселидзе, д. 2/99</p>
            <p>Тел.: +7 (919) 685-33-12</p>
            <p>Email: info@juldem.ru</p>
          </div>

          <div className={styles.copyright}>
            <span className={styles.copyrightIcon}>©</span>
            <span>2017-{currentYear} JULDEM. Все права защищены.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
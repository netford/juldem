import React, { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { logo } from '../assets/images'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const renderDesktopNav = () => (
    <div className={styles.navContainer}>
      <div className={styles.navLeft}>
        <a href="#main" className={styles.logoLink}>
          <img 
            src={logo} 
            alt="JULDEM" 
            className={`${styles.logo} ${isScrolled ? styles.logoSmall : ''}`} 
          />
        </a>
      </div>

      <div className={styles.navCenter}>
        <div className={styles.navLinks}>
          <a href="#main" className={`${styles.navLink} nav-link`}>Главная</a>
          <a href="#our-works" className={`${styles.navLink} nav-link`}>Наши работы</a>
          <a href="#prices" className={`${styles.navLink} nav-link`}>Цены</a>
          <a href="#how-to-order" className={`${styles.navLink} nav-link`}>Как мы работаем</a>
          <a href="#delivery" className={`${styles.navLink} nav-link`}>Доставка</a>
          <a href="#about" className={`${styles.navLink} nav-link`}>О нас</a>
          <a href="#reviews" className={`${styles.navLink} nav-link`}>Отзывы</a>
          <a href="#contacts" className={`${styles.navLink} nav-link`}>Контакты</a>
        </div>
      </div>

      <div className={styles.navRight}>
        <a href="tel:+79196853312" className={styles.phoneLink}>
          <Phone size={isScrolled ? 16 : 18} />
          +7 (919) 685-33-12
        </a>
      </div>
    </div>
  )

  const renderMobileNav = () => (
    <>
      <div className={`${styles.navContainer} ${styles.mobile}`}>
        <div className={styles.navLeft}>
          <a href="#main" className={styles.logoLink}>
            <img 
              src={logo} 
              alt="JULDEM" 
              className={`${styles.logo} ${isScrolled ? styles.logoSmall : ''}`} 
            />
          </a>
        </div>

        <div className={styles.navCenter}>
          <a href="tel:+79196853312" className={`${styles.phoneLink} ${styles.mobile}`}>
            +7 (919) 685-33-12
          </a>
        </div>

        <div className={styles.navRight}>
          <button 
            className={styles.burger} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Открыть меню"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`${styles.navLinks} ${styles.mobile} ${isOpen ? styles.active : ''}`}>
        <a href="#main" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>Главная</a>
        <a href="#our-works" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>Наши работы</a>
        <a href="#prices" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>Цены</a>
        <a href="#how-to-order" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>Как мы работаем</a>
        <a href="#delivery" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>Доставка</a>
        <a href="#about" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>О нас</a>
        <a href="#reviews" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>Отзывы</a>
        <a href="#contacts" className={`${styles.navLink} nav-link`} onClick={() => setIsOpen(false)}>Контакты</a>
      </div>
    </>
  )

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        {renderDesktopNav()}
        {renderMobileNav()}
      </div>
    </nav>
  )
}

export default Navbar
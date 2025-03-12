import React, { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { logo } from '../assets/images'
import styles from './Navbar.module.css'
import smoothscroll from 'smoothscroll-polyfill'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Инициализация полифила для плавного скроллинга
    smoothscroll.polyfill()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Функция для плавного скроллинга и закрытия мобильного меню
  const handleNavClick = (e) => {
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const targetElement = document.querySelector(href)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
      if (isOpen) {
        setIsOpen(false)
      }
    }
  }

  // IntersectionObserver для выделения активного пункта меню
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observerOptions = {
      threshold: 0.5
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id')
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`)
        if (navLink) {
          if (entry.isIntersecting) {
            navLink.classList.add('active')
          } else {
            navLink.classList.remove('active')
          }
        }
      })
    }, observerOptions)

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const renderDesktopNav = () => (
    <div className={styles.navContainer}>
      <div className={styles.navLeft}>
        <a href="#main" className={styles.logoLink} onClick={handleNavClick}>
          <img 
            src={logo} 
            alt="JULDEM" 
            className={`${styles.logo} ${isScrolled ? styles.logoSmall : ''}`} 
          />
        </a>
      </div>

      <div className={styles.navCenter}>
        <div className={styles.navLinks}>
          <a href="#main" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Главная</a>
          <a href="#our-works" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Наши работы</a>
          <a href="#prices" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Цены</a>
          <a href="#how-to-order" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Этапы работ</a>
          <a href="#delivery" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Доставка</a>
          <a href="#about" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>О нас</a>
          <a href="#reviews" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Отзывы</a>
          <a href="#contacts" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Контакты</a>
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
          <a href="#main" className={styles.logoLink} onClick={handleNavClick}>
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
        <a href="#main" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Главная</a>
        <a href="#our-works" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Наши работы</a>
        <a href="#prices" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Цены</a>
        <a href="#how-to-order" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Этапы работ</a>
        <a href="#delivery" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Доставка</a>
        <a href="#about" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>О нас</a>
        <a href="#reviews" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Отзывы</a>
        <a href="#contacts" className={`${styles.navLink} nav-link`} onClick={handleNavClick}>Контакты</a>
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

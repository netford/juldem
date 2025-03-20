import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { logo } from '../assets/images'
import styles from './Navbar.module.css'
import smoothscroll from 'smoothscroll-polyfill'

const Navbar = () => {
  // Состояния для управления навигацией и UI
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('main')
  
  // Реф для наблюдателя
  const observerRef = useRef(null)

  // Инициализация smooth scroll полифилла при монтировании компонента
  useEffect(() => {
    smoothscroll.polyfill()

    // Обработчик скролла для определения прокрутки
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    // Добавление и очистка обработчика скролла
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Оптимизированный обработчик навигационных наблюдателей
  const handleNavObservers = useCallback(() => {
    const sections = document.querySelectorAll('section[id]')

    // Очистка предыдущего наблюдателя
    if (observerRef.current) {
      sections.forEach(section => {
        observerRef.current.unobserve(section)
      })
    }

    // Настройки наблюдателя
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0.2, 0.5, 0.8]
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id')
        const navLinks = document.querySelectorAll(`.nav-link[href="#${id}"]`)
        
        if (entry.isIntersecting) {
          // Обновляем активную секцию и ссылки
          requestAnimationFrame(() => {
            setActiveSection(id)
            navLinks.forEach(link => link.classList.add('active'))
          })
        } else {
          navLinks.forEach(link => link.classList.remove('active'))
        }
      })
    }, observerOptions)

    sections.forEach(section => {
      observerRef.current.observe(section)
    })
  }, [])

  // Установка навигационных наблюдателей
  useEffect(() => {
    handleNavObservers()

    // Обработчик изменения размера окна
    window.addEventListener('resize', handleNavObservers)

    return () => {
      window.removeEventListener('resize', handleNavObservers)
      
      // Очистка наблюдателей при размонтировании
      if (observerRef.current) {
        const sections = document.querySelectorAll('section[id]')
        sections.forEach(section => {
          observerRef.current.unobserve(section)
        })
      }
    }
  }, [handleNavObservers])

  // Обработчик клика по навигационной ссылке
  const handleNavClick = (e) => {
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const targetElement = document.querySelector(href)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
      
      // Закрытие мобильного меню после клика
      if (isOpen) {
        setIsOpen(false)
      }
    }
  }

  // Рендер десктопной навигации
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

  // Рендер мобильной навигации
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
        {[
          { href: '#main', label: 'Главная' },
          { href: '#our-works', label: 'Наши работы' },
          { href: '#prices', label: 'Цены' },
          { href: '#how-to-order', label: 'Этапы работ' },
          { href: '#delivery', label: 'Доставка' },
          { href: '#about', label: 'О нас' },
          { href: '#reviews', label: 'Отзывы' },
          { href: '#contacts', label: 'Контакты' }
        ].map((link) => (
          <a 
            key={link.href}
            href={link.href} 
            className={`
              ${styles.navLink} 
              nav-link 
              ${activeSection === link.href.replace('#', '') ? styles.active : ''}
            `}
            onClick={handleNavClick}
          >
            {link.label}
          </a>
        ))}
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
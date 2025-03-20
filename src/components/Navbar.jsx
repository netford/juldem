import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { logo } from '../assets/images'
import styles from './Navbar.module.css'
import smoothscroll from 'smoothscroll-polyfill'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('main')
  const mobileObserverRef = useRef(null)
  const desktopObserverRef = useRef(null)

  useEffect(() => {
    smoothscroll.polyfill()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleNavObservers = () => {
      const isMobile = window.innerWidth <= 768
      const sections = document.querySelectorAll('section[id]')

      // Очистка предыдущих обсерверов
      if (mobileObserverRef.current) {
        sections.forEach(section => {
          mobileObserverRef.current.unobserve(section)
        })
      }

      if (desktopObserverRef.current) {
        sections.forEach(section => {
          desktopObserverRef.current.unobserve(section)
        })
      }

      if (isMobile) {
        const mobileObserverOptions = {
          root: null,
          rootMargin: '-20% 0px -50% 0px',
          threshold: [0, 0.1, 1]
        }

        mobileObserverRef.current = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id')
              setActiveSection(id)
            }
          })
        }, mobileObserverOptions)

        sections.forEach(section => {
          mobileObserverRef.current.observe(section)
        })
      } else {
        const desktopObserverOptions = {
          threshold: 0.5
        }

        desktopObserverRef.current = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const id = entry.target.getAttribute('id')
            const navLinks = document.querySelectorAll(`.nav-link[href="#${id}"]`)
            
            navLinks.forEach(navLink => {
              if (entry.isIntersecting) {
                navLink.classList.add('active')
              } else {
                navLink.classList.remove('active')
              }
            })
          })
        }, desktopObserverOptions)

        sections.forEach(section => {
          desktopObserverRef.current.observe(section)
        })
      }
    }

    // Первичный запуск
    handleNavObservers()

    // Повесим обработчик resize для динамической смены механизма
    window.addEventListener('resize', handleNavObservers)

    return () => {
      window.removeEventListener('resize', handleNavObservers)
      
      if (mobileObserverRef.current) {
        const sections = document.querySelectorAll('section[id]')
        sections.forEach(section => {
          mobileObserverRef.current.unobserve(section)
        })
      }

      if (desktopObserverRef.current) {
        const sections = document.querySelectorAll('section[id]')
        sections.forEach(section => {
          desktopObserverRef.current.unobserve(section)
        })
      }
    }
  }, [])

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
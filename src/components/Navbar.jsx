import React, { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { logo } from '../assets/images'

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
    <div className="nav-container">
      <div className="nav-left">
        <a href="#main" className="logo-link">
          <img src={logo} alt="JULDEM" className={`logo ${isScrolled ? 'logo-small' : ''}`} />
        </a>
      </div>

      <div className="nav-center">
        <div className="nav-links">
          <a href="#main" className="nav-link">Главная</a>
          <a href="#our-works" className="nav-link">Наши работы</a>
          <a href="#prices" className="nav-link">Цены</a>
          <a href="#how-to-order" className="nav-link">Как мы работаем</a>
          <a href="#delivery" className="nav-link">Доставка</a>
          <a href="#about" className="nav-link">О нас</a>
          <a href="#reviews" className="nav-link">Отзывы</a>
          <a href="#contacts" className="nav-link">Контакты</a>
        </div>
      </div>

      <div className="nav-right">
        <a href="tel:+79196853312" className="phone-link">
          <Phone size={isScrolled ? 16 : 18} />
          +7 (919) 685-33-12
        </a>
      </div>
    </div>
  )

  const renderMobileNav = () => (
    <>
      <div className="nav-container mobile">
        <div className="nav-left">
          <a href="#main" className="logo-link">
            <img src={logo} alt="JULDEM" className={`logo ${isScrolled ? 'logo-small' : ''}`} />
          </a>
        </div>

        <div className="nav-center">
          <a href="tel:+79196853312" className="phone-link mobile">
            +7 (919) 685-33-12
          </a>
        </div>

        <div className="nav-right">
          <button 
            className="burger" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Открыть меню"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`nav-links mobile ${isOpen ? 'active' : ''}`}>
        <a href="#main" className="nav-link" onClick={() => setIsOpen(false)}>Главная</a>
        <a href="#our-works" className="nav-link" onClick={() => setIsOpen(false)}>Наши работы</a>
        <a href="#prices" className="nav-link" onClick={() => setIsOpen(false)}>Цены</a>
        <a href="#how-to-order" className="nav-link" onClick={() => setIsOpen(false)}>Как мы работаем</a>
        <a href="#delivery" className="nav-link" onClick={() => setIsOpen(false)}>Доставка</a>
        <a href="#about" className="nav-link" onClick={() => setIsOpen(false)}>О нас</a>
        <a href="#reviews" className="nav-link" onClick={() => setIsOpen(false)}>Отзывы</a>
        <a href="#contacts" className="nav-link" onClick={() => setIsOpen(false)}>Контакты</a>
      </div>
    </>
  )

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <style>{`
          .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(38, 38, 38, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            transition: all 0.3s ease;
            height: 80px;
          }

          .navbar.scrolled {
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            height: 60px;
          }

          .navbar-container {
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            padding: 0 1rem;
            height: 100%;
          }

          .nav-container {
            height: 100%;
            display: grid;
            grid-template-columns: 200px 1fr auto;
            align-items: center;
            gap: 2rem;
          }

          .nav-left, .nav-right {
            display: flex;
            align-items: center;
          }

          .nav-right {
            gap: 2rem;
          }

          .nav-center {
            justify-self: center;
            width: 100%;
          }

          .logo-link {
            display: flex;
            align-items: center;
            outline: none;
          }

          .logo-link:hover {
            opacity: 0.9;
          }

          .logo-link:focus {
            outline: none;
          }

          .logo-link:focus-visible {
            outline: 2px solid rgba(0, 102, 204, 0.3);
            outline-offset: 3px;
            border-radius: 4px;
          }

          .logo {
            height: 50px;
            width: auto;
            transition: all 0.3s ease;
          }
          
          .logo.logo-small {
            height: 40px;
          }

          .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
            background: transparent;
            color: white;
            justify-content: center;
          }

          .nav-link {
            color: white !important;
            text-decoration: none;
            font-size: 1rem;
            transition: all 0.3s ease;
            position: relative;
          }
          
          /* Убираем outline при клике мышью */
          .nav-link:focus {
            outline: none;
          }
          
          /* Сохраняем outline при навигации с клавиатуры */
          .nav-link:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
          }
          
          /* Убираем outline и для phone-link */
          .phone-link:focus {
            outline: none;
          }
          
          .phone-link:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
          }
          
          /* Убираем outline для мобильного меню */
          .nav-links.mobile a:focus {
            outline: none;
          }
          
          .scrolled .nav-link {
            font-size: 0.95rem;
          }

          .nav-link:after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: -4px;
            left: 0;
            background: var(--color-primary);
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }

          .nav-link:hover:after {
            transform: scaleX(1);
            transform-origin: left;
          }

          .nav-link:hover {
            color: var(--color-primary) !important;
          }

          .phone-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #00e2fc !important;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .phone-link.mobile {
            text-align: left;
            padding-left: 0;
            font-size: 1.3rem;
          }
          
          .scrolled .phone-link {
            font-size: 0.95rem;
          }
          
          .scrolled .phone-link.mobile {
            font-size: 1.1rem;
          }

          .phone-link:hover {
            color: white !important;
          }

          .burger {
            display: none;
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
            padding: 0.5rem;
            transition: all 0.3s ease;
          }
          
          /* Убираем outline для кнопки бургер-меню */
          .burger:focus {
            outline: none;
          }
          
          .burger:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
          }

          .burger:hover {
            color: var(--color-primary);
            transform: scale(1.1);
          }

          @media (max-width: 1024px) {
            .burger {
              display: block;
            }

            .nav-container:not(.mobile) {
              display: none;
            }

            .nav-container.mobile {
              display: grid;
              grid-template-columns: auto 1fr auto;
              gap: 0;
            }

            .mobile .nav-left {
              justify-content: flex-start;
              padding-left: 0;
            }

            .mobile .logo-link {
              padding: 5px;
            }

            .mobile .logo {
              height: 40px;
              margin-left: 0;
            }
            
            .mobile .logo.logo-small {
              height: 35px;
            }

            .mobile .nav-right {
              justify-content: flex-end;
            }

            .mobile .nav-center {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              text-align: left;
              margin-left: 15px;
            }

            .mobile .phone-link {
              white-space: nowrap;
              text-align: left;
            }

            @media (max-width: 360px) {
              .mobile .phone-link {
                font-size: 1.1rem;
              }
              
              .scrolled .mobile .phone-link {
                font-size: 1rem;
              }
            }

            .navbar-container {
              padding-left: 0;
            }
            
            .navbar.scrolled {
              height: 55px;
            }

            .nav-links.mobile {
              position: fixed;
              top: 80px;
              left: 0;
              right: 0;
              background: #262626;
              flex-direction: column;
              padding: 2rem;
              gap: 1.5rem;
              transform: translateY(-100%);
              transition: transform 0.3s ease;
              opacity: 0;
              visibility: hidden;
              width: 100%;
            }
            
            .navbar.scrolled .nav-links.mobile {
              top: 55px;
            }

            .nav-links.mobile.active {
              transform: translateY(0);
              opacity: 1;
              visibility: visible;
            }
          }

          @media (min-width: 1025px) {
            .nav-container.mobile,
            .nav-links.mobile {
              display: none;
            }
          }
        `}</style>

        {renderDesktopNav()}
        {renderMobileNav()}
      </div>
    </nav>
  )
}

export default Navbar
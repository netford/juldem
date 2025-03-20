document.addEventListener('DOMContentLoaded', () => {
  // Получаем все разделы и пункты меню
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
  
  // Функция определения активного раздела
  function highlightActiveSection() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    let mostVisibleSection = null;
    let maxVisibleArea = 0;

    // Анализ видимости разделов
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollPosition;
      const sectionBottom = sectionTop + rect.height;
      
      // Расчет видимой области раздела
      const visibleTop = Math.max(sectionTop, scrollPosition);
      const visibleBottom = Math.min(sectionBottom, scrollPosition + windowHeight);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);
      
      // Определение наиболее видимого раздела
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        mostVisibleSection = section;
      }
    });

    // Обновление активных ссылок
    if (mostVisibleSection) {
      const sectionId = mostVisibleSection.getAttribute('id');
      updateActiveNavLinks(sectionId);
    }
  }

  // Функция обновления активных навигационных ссылок
  function updateActiveNavLinks(sectionId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${sectionId}`;
      
      // Обновление активного класса
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Функция плавного скролла
  function smoothScroll(targetElement) {
    // Нативный smooth scroll, если поддерживается
    if ('scrollBehavior' in document.documentElement.style) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      return;
    }
    
    // Полифилл для браузеров без нативной поддержки
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    
    const duration = 500; // Длительность анимации
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentPosition = startPosition + distance * easeProgress;
      
      // Кроссбраузерная прокрутка
      if ('scrollTo' in window) {
        window.scrollTo(0, currentPosition);
      } else {
        document.documentElement.scrollTop = currentPosition;
        document.body.scrollTop = currentPosition;
      }
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // Обновление активного раздела после завершения анимации
        setTimeout(highlightActiveSection, 50);
      }
    }
    
    requestAnimationFrame(animation);
  }

  // Вызываем функцию подсветки при загрузке страницы
  highlightActiveSection();
  
  // Резервные механизмы обновления активного раздела
  let scrollEndTimer;
  let throttleTimer;
  
  // Основной обработчик скролла с торможением
  window.addEventListener('scroll', () => {
    // Торможение излишних вызовов
    clearTimeout(throttleTimer);
    throttleTimer = setTimeout(() => {
      // Очистка таймера окончания скролла
      clearTimeout(scrollEndTimer);
      
      // Отложенное обновление после окончания скролла
      scrollEndTimer = setTimeout(() => {
        highlightActiveSection();
      }, 100);
    }, 50);
  });
  
  // Обработчик кликов по якорным ссылкам
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Пропускаем пустые якоря
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          // Закрытие мобильного меню
          const mobileNavLinks = document.querySelector('.navLinks.mobile.active');
          
          if (mobileNavLinks) {
            mobileNavLinks.classList.remove('active');
            
            // Закрытие бургер-меню
            const burgerButton = document.querySelector('.burger');
            if (burgerButton) {
              burgerButton.click();
            }
          }
          
          // Выполнение плавного скролла
          smoothScroll(targetElement);
          
          // Обновление активных ссылок
          updateActiveNavLinks(targetElement.getAttribute('id'));
        }
      }
    });
  });
});
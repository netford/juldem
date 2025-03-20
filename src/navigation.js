document.addEventListener('DOMContentLoaded', () => {
  // Получаем все разделы и пункты меню
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
  
  // Расширенная функция диагностики и определения активного раздела
  function highlightActiveSection() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Диагностическая информация
    console.group('Section Highlight Diagnosis');
    console.log('Current scroll position:', scrollPosition);
    console.log('Window height:', windowHeight);
    
    let mostVisibleSection = null;
    let maxVisibleArea = 0;

    // Расширенный анализ видимости разделов
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollPosition;
      const sectionBottom = sectionTop + rect.height;
      
      // Расчет видимой области раздела
      const visibleTop = Math.max(sectionTop, scrollPosition);
      const visibleBottom = Math.min(sectionBottom, scrollPosition + windowHeight);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);
      
      // Подробная диагностическая информация о каждом разделе
      console.log(`Section #${section.id}`, {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        visibleArea: visibleArea,
        isInViewport: 
          scrollPosition >= sectionTop && 
          scrollPosition < sectionBottom
      });
      
      // Определение наиболее видимого раздела
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        mostVisibleSection = section;
      }
    });

    // Обновление активных ссылок
    if (mostVisibleSection) {
      const sectionId = mostVisibleSection.getAttribute('id');
      console.log('Most visible section:', sectionId);
      
      updateActiveNavLinks(sectionId);
    }
    
    console.groupEnd();
  }

  // Функция обновления активных навигационных ссылок
  function updateActiveNavLinks(sectionId) {
    // Диагностическая информация
    console.group('Navigation Links Update');
    console.log('Updating links for section:', sectionId);
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${sectionId}`;
      
      // Подробная информация о каждой ссылке
      console.log(`Link ${href}`, {
        willBeActive: isActive,
        currentlyActive: link.classList.contains('active')
      });
      
      // Обновление активного класса
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    console.groupEnd();
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
  
  // Основной обработчик скролла с торможением и диагностикой
  window.addEventListener('scroll', () => {
    // Торможение излишних вызовов
    clearTimeout(throttleTimer);
    throttleTimer = setTimeout(() => {
      // Очистка таймера окончания скролла
      clearTimeout(scrollEndTimer);
      
      // Отложенное обновление после окончания скролла
      scrollEndTimer = setTimeout(() => {
        console.log('Scroll ended, updating navigation');
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

  // Глобальный диагностический инструмент
  window.triggerNavDiagnostic = function() {
    console.group('Navigation Diagnostic Report');
    
    // Информация о разделах
    console.log('Sections:', sections.length);
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      console.log(`Section #${section.id}`, {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        isVisible: rect.top >= 0 && rect.bottom <= window.innerHeight
      });
    });

    // Информация о навигационных ссылках
    console.log('Navigation Links:', navLinks.length);
    navLinks.forEach(link => {
      console.log(`Link ${link.href}`, {
        isActive: link.classList.contains('active')
      });
    });

    console.groupEnd();
  };
});
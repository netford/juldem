document.addEventListener('DOMContentLoaded', () => {
  // Получаем все разделы и пункты меню
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
  
  // Функция для определения активного раздела при скролле
  function highlightActiveSection() {
    // Получаем текущую позицию скролла
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Добавляем небольшой отступ, чтобы активация происходила немного раньше
    const scrollOffset = 200;
    
    // Проверяем каждый раздел
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      // Если текущая позиция скролла находится в пределах данного раздела
      if (scrollPosition + scrollOffset >= sectionTop && 
          scrollPosition + scrollOffset < sectionTop + sectionHeight) {
        // Удаляем класс 'active' у всех пунктов меню
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Добавляем класс 'active' к соответствующему пункту меню
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }
  
  // Функция плавного скролла с максимальной кроссбраузерностью
  function smoothScroll(targetElement) {
    // Если поддерживается native smooth scroll
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
    
    // Параметры анимации
    const duration = 500; // 500мс
    let startTime = null;
    
    // Функция анимации скролла с использованием requestAnimationFrame
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      
      // Функция ease-out с квадратичным замедлением
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentPosition = startPosition + distance * easeProgress;
      
      // Совместимость с разными браузерами
      if ('scrollTo' in window) {
        window.scrollTo(0, currentPosition);
      } else {
        document.documentElement.scrollTop = currentPosition;
        document.body.scrollTop = currentPosition;
      }
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // После завершения анимации вызываем функцию подсветки активного элемента
        setTimeout(highlightActiveSection, 50);
      }
    }
    
    // Запуск анимации
    requestAnimationFrame(animation);
  }
  
  // Вызываем функцию при загрузке страницы
  highlightActiveSection();
  
  // Добавляем обработчик события скролла
  window.addEventListener('scroll', highlightActiveSection);
  
  // Добавляем обработчик клика по якорным ссылкам
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Обрабатываем только якорные ссылки
      const href = this.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Обработка пустого якоря
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          // Закрываем мобильное меню, если оно открыто
          const mobileNavLinks = document.querySelector('.nav-links.mobile');
          if (mobileNavLinks) {
            mobileNavLinks.classList.remove('active');
          }
          
          // Выполняем плавный скролл
          smoothScroll(targetElement);
        }
      }
    });
  });
});
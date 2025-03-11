// src/navigation.js
document.addEventListener('DOMContentLoaded', () => {
  // Получаем все разделы и пункты меню
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
  
  // Функция для определения активного раздела при скролле
  function highlightActiveSection() {
    // Получаем текущую позицию скролла
    let scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    // Добавляем небольшой отступ, чтобы активация происходила немного раньше
    scrollPosition += 200;
    
    // Проверяем каждый раздел
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      // Если текущая позиция скролла находится в пределах данного раздела
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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
  
  // Вызываем функцию при загрузке страницы
  highlightActiveSection();
  
  // Добавляем обработчик события скролла
  window.addEventListener('scroll', highlightActiveSection);
  
  // Добавляем обработчик клика по якорным ссылкам для плавного скролла
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Обрабатываем только якорные ссылки
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Обработка пустого якоря
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Получаем позицию элемента
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          
          // Параметры анимации
          const duration = 500; // 500мс
          let startTime = null;
          
          // Функция анимации скролла
          function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            
            // ease-in-out формула
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            } else {
              // После завершения анимации явно вызываем функцию подсветки активного элемента
              setTimeout(highlightActiveSection, 50);
            }
          }
          
          // Функция ease-in-out
          function easeInOutCubic(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t + b;
            t -= 2;
            return c/2*(t*t*t + 2) + b;
          }
          
          // Запускаем анимацию
          requestAnimationFrame(animation);
        }
      }
    });
  });
});
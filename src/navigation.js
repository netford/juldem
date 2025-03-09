// Функция для установки активного пункта меню
document.addEventListener('DOMContentLoaded', () => {
    // Получаем все разделы и пункты меню
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
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
    
    // Добавляем обработчик клика по пунктам меню
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Удаляем класс 'active' у всех пунктов меню
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Добавляем класс 'active' к текущему пункту
        this.classList.add('active');
      });
    });
  });
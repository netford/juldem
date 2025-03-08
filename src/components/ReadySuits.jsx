// ReadySuits.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShoppingBag, MessageCircle, Phone } from 'lucide-react';
import ProductImageSlider from './ProductImageSlider';
import SuitCard from './SuitCard';
import styles from './ReadySuits.module.css';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import nonePhoto from '../assets/images/suits/none_photo.jpg';


// Массив товаров
const suits = [
  /* КУПАЛЬНИКИ В НАЛИЧИИ (available: true) */
  {
    id: 1,
    name: "'Бабочка'",
    category: "acrobatics_gymnastics",
    price: 30000,
    height: [144],
    images: ['images/products/categories/acrobatics_gymnastics/babochka_000.png',
    'images/products/categories/acrobatics_gymnastics/babochka_001.png'
            ],
    available: true
  },
  {
    id: 2,
    name: "'Гранат'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: [164],
    images: ['images/products/categories/acrobatics_gymnastics/photo_010.png'],
    available: true
  },
  {
    id: 3,
    name: "'Полярная звезда'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: [110, 128],
    images: ['images/products/categories/acrobatics_gymnastics/star-000.png',
             'images/products/categories/acrobatics_gymnastics/star-001.png',
             'images/products/categories/acrobatics_gymnastics/star-002.png',
             'images/products/categories/acrobatics_gymnastics/star-003.png'
            ],
    available: true
  },
  {
    id: 4,
    name: "'Морской бриз'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: [130, 144],
    images: ['images/products/categories/acrobatics_gymnastics/briz-000.png',
             'images/products/categories/acrobatics_gymnastics/briz-001.png',
             'images/products/categories/acrobatics_gymnastics/briz-002.png',
             'images/products/categories/acrobatics_gymnastics/briz-003.png',
             'images/products/categories/acrobatics_gymnastics/briz-004.png',
             'images/products/categories/acrobatics_gymnastics/briz-005.png',
             'images/products/categories/acrobatics_gymnastics/briz-006.png'
            ],
    available: true
  },
  {
    id: 5,
    name: "'Лаванда'",
    category: "acrobatics_gymnastics",
    price: 25000,
    height: [110, 128],
    images: ['images/products/categories/acrobatics_gymnastics/lavanda-000.png',
             'images/products/categories/acrobatics_gymnastics/lavanda-001.png',
             'images/products/categories/acrobatics_gymnastics/lavanda-002.png',
             'images/products/categories/acrobatics_gymnastics/lavanda-003.png'
            ],
    available: true
  },
  {
    id: 6,
    name: "'Радужный'",
    category: "acrobatics_gymnastics",
    price: 15000,
    height: [120,124],
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000.webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (2).webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (3).webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (4).webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (5).webp'
            ],
    available: true
  },
  {
    id: 7,
    name: "'Амазонка'",
    category: "acrobatics_gymnastics",
    price: 12000,
    height: [110, 128],
    images: ['images/products/categories/acrobatics_gymnastics/amazonka-000.png',
             'images/products/categories/acrobatics_gymnastics/amazonka-001.png',
             'images/products/categories/acrobatics_gymnastics/amazonka-002.png'
            ],
    available: true
  },
  {
    id: 8,
    name: "'Нежный пион'",
    category: "acrobatics_gymnastics",
    price: 10000,
    height: [89, 110],
    images: ['images/products/categories/acrobatics_gymnastics/pion-000.png',
             'images/products/categories/acrobatics_gymnastics/pion-001.png',
             'images/products/categories/acrobatics_gymnastics/pion-002.png',
             'images/products/categories/acrobatics_gymnastics/pion-003.png',
             'images/products/categories/acrobatics_gymnastics/pion-004.png'
            ],
    available: true
  },
  
  /* КУПАЛЬНИКИ ДЛЯ ПРОКАТА (category: "renta") */
  {
    id: 17,
    name: "'Закат'",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 7000, // Залог
    height: [94, 110],
    images: ['images/products/categories/renta/sunset_000.png',
             'images/products/categories/renta/sunset_001.png'
            ],
    available: true
  },
  {
    id: 9,
    name: "'Малинка'",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 7000, // Залог
    height: [94, 110],
    images: ['images/products/categories/renta/malinka_000.png',
             'images/products/categories/renta/malinka_001.png'
            ],
    available: true
  },
  {
    id: 10,
    name: "'Туника' (голубой)",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 7000, // Залог
    height: [94, 110],
    images: ['images/products/categories/renta/pale_blue_000.png',
             'images/products/categories/renta/pale_blue_001.png'
            ],
    available: true
  },
  {
    id: 11,
    name: "'Туника' (сиреневый)",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 7000, // Залог
    height: [94, 110],
    images: ['images/products/categories/renta/siren_000.png',
             'images/products/categories/renta/siren_001.png'
            ],
    available: true
  },
  {
    id: 12,
    name: "'Январь'",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 7000, // Залог
    height: [94, 110],
    images: ['images/products/categories/renta/pale_blue_0000.png',
             'images/products/categories/renta/pale_blue_0001.png',
             'images/products/categories/renta/pale_blue_0002.png'
            ],
    available: true
  },
  {
    id: 15,
    name: "'Океан'",
    category: "renta",
    price: 5000, // Цена за неделю проката
    deposit: 7000, // Залог
    height: [94, 110],
    images: ['images/products/categories/renta/ocean_000.png',
             'images/products/categories/renta/ocean_001.png'
            ],
    available: true
  },
  {
    id: 16,
    name: "'Эльза'",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 7000, // Залог
    height: [94, 110],
    images: ['images/products/categories/renta/elza_000.png',
             'images/products/categories/renta/elza_001.png'
            ],
    available: true
  },
  {
    id: 14,
    name: "'Всплеск'",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 5000, // Залог
    height: [100, 116],
    images: ['images/products/categories/renta/splash_000.png',
             'images/products/categories/renta/splash_001.png',
             'images/products/categories/renta/splash_002.png'
            ],
    available: true
  },
  {
    id: 114,
    name: "'Всплеск'",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 5000, // Залог
    height: [124, 132],
    images: ['images/products/categories/renta/splash_000.png',
             'images/products/categories/renta/splash_001.png',
             'images/products/categories/renta/splash_002.png'
            ],
    available: true
  },
  {
    id: 13,
    name: "'Бразильянка'",
    category: "renta",
    price: 2000, // Цена за неделю проката
    deposit: 5000, // Залог
    height: [100, 116],
    images: ['images/products/categories/renta/brazil_000.png',
             'images/products/categories/renta/brazil_001.png'
            ],
    available: true
  },
  
  /* ПРОДАННЫЕ КУПАЛЬНИКИ (available: false) */
  {
    id: 18,
    name: "'Рубин'",
    category: "figure-skating",
    price: 17000,
    height: [125, 129],
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000 (2).png'],
    available: false
  },
  {
    id: 19,
    name: "'Сияние'",
    category: "acrobatics_gymnastics",
    price: 16000,
    height: [122],
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000.png'],
    available: false
  },
  {
    id: 20,
    name: "'Сказка'",
    category: "figure-skating",
    price: 18500,
    height: [140, 154],
    images: ['images/products/categories/figure-skating/photo_001.png'],
    available: false
  },
  {
    id: 21,
    name: "'Лазурит'",
    category: "figure-skating",
    price: 16500,
    height: [160],
    images: ['images/products/categories/figure-skating/photo_002.png',
             'images/products/categories/figure-skating/photo_003.png'
            ],
    available: false
  },
  {
    id: 22,
    name: "'Фуксия'",
    category: "figure-skating",
    price: 15500,
    height: [130, 139],
    images: ['images/products/categories/figure-skating/photo_004.png'],
    available: false
  },
  {
    id: 23,
    name: "'Персея'",
    category: "figure-skating",
    price: 17500,
    height: [125, 129],
    images: ['images/products/categories/figure-skating/photo_005.png'],
    available: false
  },
  {
    id: 24,
    name: "'Каскад'",
    category: "figure-skating",
    price: 16500,
    height: [120],
    images: ['images/products/categories/figure-skating/photo_006.png'],
    available: false
  },
  {
    id: 25,
    name: "'Лаванда'",
    category: "acrobatics_gymnastics",
    price: 19000,
    height: [140, 154],
    images: ['images/products/categories/acrobatics_gymnastics/photo_001.png',
             'images/products/categories/acrobatics_gymnastics/photo_002.png'
            ],
    available: false
  },
  {
    id: 26,
    name: "'Феникс'",
    category: "acrobatics_gymnastics",
    price: 17000,
    height: [158],
    images: ['images/products/categories/acrobatics_gymnastics/photo_003.png'],
    available: false
  },
  {
    id: 27,
    name: "'Тропикана'",
    category: "acrobatics_gymnastics",
    price: 16000,
    height: [130, 139],
    images: ['images/products/categories/acrobatics_gymnastics/photo_004.png',
             'images/products/categories/acrobatics_gymnastics/photo_005.png',
             'images/products/categories/acrobatics_gymnastics/photo_006.png'
            ],
    available: false
  },
  {
    id: 28,
    name: "'Волна'",
    category: "acrobatics_gymnastics",
    price: 18000,
    height: [125, 129],
    images: ['images/products/categories/acrobatics_gymnastics/photo_007.png'],
    available: false
  },
  {
    id: 29,
    name: "'Вулкан'",
    category: "acrobatics_gymnastics",
    price: 18000,
    height: [125, 129],
    images: ['images/products/categories/acrobatics_gymnastics/photo_008.png'],
    available: false
  },
  {
    id: 30,
    name: "'Византия'",
    category: "acrobatics_gymnastics",
    price: 18000,
    height: [125, 129],
    images: ['images/products/categories/acrobatics_gymnastics/photo_009.png',
             'images/products/categories/acrobatics_gymnastics/photo_009(2).png'
            ],
    available: false
  },
  {
    id: 31,
    name: "'Аметист'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: [155, 165],
    images: ['images/products/categories/acrobatics_gymnastics/photo_018.png',
             'images/products/categories/acrobatics_gymnastics/photo_019.webp',
             'images/products/categories/acrobatics_gymnastics/photo_020.png',
             'images/products/categories/acrobatics_gymnastics/photo_021.webp'
            ],
    available: false
  },
  {
    id: 32,
    name: "'Бабочка'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: [140, 154],
    images: ['images/products/categories/acrobatics_gymnastics/photo_017.png',
             'images/products/categories/acrobatics_gymnastics/photo_022.png'
            ],
    available: false
  }
];

function ReadySuits() {
  // Существующие состояния
  const [activeFilter, setActiveFilter] = useState('all');
  const [showScrollHint, setShowScrollHint] = useState(false);
  
  // Улучшенные состояния для анимации
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleSuits, setVisibleSuits] = useState([]);
  const [prevVisibleSuits, setPrevVisibleSuits] = useState([]);
  const [containerHeight, setContainerHeight] = useState('auto');
  
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  // Фиксированные размеры для виртуализированного списка
  const cardWidth = 300;  // ширина карточки (px)
  const cardHeight = 650; // высота карточки (примерное значение, px)
  const gap = 32;         // отступ между карточками (px)

  // При монтировании компонента инициализируем видимые товары
  useEffect(() => {
    setVisibleSuits(getFilteredSuits('all'));
  }, []);

  // Отслеживаем видимость секции (если потребуется)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Если мобильное устройство, показываем намёк на скролл на 3 секунды
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowScrollHint(true);
      const timer = setTimeout(() => {
        setShowScrollHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Функция фильтрации товаров (выделена отдельно)
  const getFilteredSuits = (filter) => {
    return suits.filter(suit => {
      // Если выбран фильтр по категории или все купальники
      if (filter === 'all') return true;
      if (filter === suit.category) return true;
      
      // Для фильтра "Продано" - исключаем категорию "renta"
      if (filter === 'sold') 
        return !suit.available && suit.category !== 'renta';
      
// Для группы фильтров "В наличии" - исключаем категорию "renta"
if (filter.startsWith('available')) {
  if (!suit.available || suit.category === 'renta') return false;
  if (filter === 'available') return true;
  
  const heightRange = filter.split('-')[1];
  switch (heightRange) {
    case '124':
      // Для проверки "до 124 см."
      return (suit.height.length === 1 && suit.height[0] <= 124) || 
             (suit.height.length === 2 && 
             ((suit.height[0] <= 124) || 
              (suit.height[1] <= 124)));
    case '129':
      // Для проверки "125-129 см."
      return (suit.height.length === 1 && suit.height[0] >= 125 && suit.height[0] <= 129) || 
             (suit.height.length === 2 && 
             ((suit.height[0] >= 125 && suit.height[0] <= 129) || 
              (suit.height[1] >= 125 && suit.height[1] <= 129) ||
              (suit.height[0] < 125 && suit.height[1] > 129)));
    case '139':
      // Для проверки "130-139 см."
      return (suit.height.length === 1 && suit.height[0] >= 130 && suit.height[0] <= 139) || 
             (suit.height.length === 2 && 
             ((suit.height[0] >= 130 && suit.height[0] <= 139) || 
              (suit.height[1] >= 130 && suit.height[1] <= 139) ||
              (suit.height[0] < 130 && suit.height[1] > 139)));
    case '154':
      // Для проверки "140-154 см."
      return (suit.height.length === 1 && suit.height[0] >= 140 && suit.height[0] <= 154) || 
             (suit.height.length === 2 && 
             ((suit.height[0] >= 140 && suit.height[0] <= 154) || 
              (suit.height[1] >= 140 && suit.height[1] <= 154) ||
              (suit.height[0] < 140 && suit.height[1] > 154)));
    case '155':
      // Для проверки "от 155 см."
      return (suit.height.length === 1 && suit.height[0] >= 155) || 
             (suit.height.length === 2 && 
             ((suit.height[0] >= 155) || 
              (suit.height[1] >= 155)));
    default:
      return false;
  }
}
return false;
});
};

// Функция для подсчёта количества товаров для каждого фильтра
const getCountForFilter = (filter) => {
return getFilteredSuits(filter).length;
};

// Оптимизированный обработчик изменения фильтра с плавной анимацией
const handleFilterChange = (e) => {
if (isTransitioning) return; // Предотвращаем повторные клики во время анимации

const newFilter = e.target.value;
if (newFilter === activeFilter) return;

// Запоминаем текущую высоту и видимые элементы
if (contentRef.current) {
setContainerHeight(`${contentRef.current.offsetHeight}px`);
}

// Сохраняем текущие элементы как предыдущие
setPrevVisibleSuits(visibleSuits);

// Начинаем анимацию
setIsTransitioning(true);

// Получаем новые элементы для выбранного фильтра
const newFilteredSuits = getFilteredSuits(newFilter);

// Настраиваем длительность анимации в зависимости от количества товаров
const animationDuration = Math.min(400, Math.max(200, 100 + newFilteredSuits.length * 10));

// Анимация исчезновения текущих элементов
setTimeout(() => {
// Устанавливаем новый фильтр
setActiveFilter(newFilter);
// Обновляем видимые товары
setVisibleSuits(newFilteredSuits);

// Адаптируем высоту контейнера к новому контенту
setTimeout(() => {
  if (contentRef.current) {
    setContainerHeight(`${contentRef.current.offsetHeight}px`);
  }
  
  // Завершаем анимацию
  setTimeout(() => {
    setIsTransitioning(false);
    setContainerHeight('auto');
  }, animationDuration);
}, 50);
}, animationDuration - 50);
};

const EmptyState = () => (
<div className={styles.emptyState}>
<div className={styles.emptyStateContent}>
  <p className={styles.emptyStateText}>
    К сожалению, по вашим критериям не найдено ни одного подходящего купальника.
    Но не стоит расстраиваться! Мы с радостью изготовим для вас идеальный купальник
    по индивидуальному заказу в кратчайшие сроки. Свяжитесь с нами для консультации
    и обсуждения деталей.
  </p>
  <div className={styles.emptyStateButtons}>
    <button className={styles.heroPrimary}>
      <MessageCircle size={20} />
      Получить консультацию
    </button>
    <button className={styles.heroSecondary}>
      <Phone size={20} />
      Оформить заказ
    </button>
  </div>
</div>
</div>
);

// Функция для рендера товаров с учетом анимации
const renderFilteredItems = () => {
const currentSuits = isTransitioning ? prevVisibleSuits : visibleSuits;

if (currentSuits.length === 0) {
return <EmptyState />;
}

// Для небольшого количества элементов (5 или меньше) используем групповую анимацию
if (currentSuits.length <= 5) {
return (
  <div 
    ref={contentRef} 
    className={`${styles.smallGrid} ${!isTransitioning ? styles.smallBatchContainer : ''}`}
    style={{
      opacity: isTransitioning ? 0 : 1,
      transition: `opacity ${isTransitioning ? '0.2s' : '0.5s'} ease-out`
    }}
  >
    {currentSuits.map((suit) => (
      <SuitCard 
        key={suit.id} 
        suit={suit}
        // Не используем каскадную анимацию для малого количества карточек
      />
    ))}
  </div>
);
}

// Для среднего количества элементов (от 6 до 10) используем каскадную анимацию с более короткими задержками
if (currentSuits.length <= 10) {
return (
  <div 
    ref={contentRef} 
    className={styles.smallGrid}
    style={{
      opacity: isTransitioning ? 0 : 1,
      transition: `opacity ${isTransitioning ? '0.2s' : '0.4s'} ease-out`
    }}
  >
    {currentSuits.map((suit, index) => (
      <div 
        key={suit.id}
        className={styles.smallGridCardWrapper}
        style={{
          opacity: 0,
          animation: !isTransitioning ? `fadeIn 0.4s ease-out forwards` : 'none',
          animationDelay: !isTransitioning ? `${Math.min(index * 20, 150)}ms` : '0ms'
        }}
      >
        <SuitCard suit={suit} />
      </div>
    ))}
  </div>
);
}

// Для большого количества элементов используем виртуализацию с обычной каскадной анимацией
return (
<div
  ref={contentRef}
  style={{
    height: cardHeight,
    opacity: isTransitioning ? 0 : 1,
    transition: `opacity ${isTransitioning ? '0.2s' : '0.4s'} ease-out`
  }}
  className={showScrollHint ? styles.scrollHintAnimation : ''}
>
  <AutoSizer>
    {({ width }) => (
      <List
        height={cardHeight}
        itemCount={currentSuits.length}
        itemSize={cardWidth + gap}
        layout="horizontal"
        width={width}
        itemData={currentSuits}
      >
        {({ index, style, data }) => {
          const suit = data[index];
          return (
            <div
              style={{
                ...style,
                width: cardWidth,
                marginRight: gap,
                opacity: 0,
                animation: !isTransitioning ? `fadeIn 0.4s ease-out forwards` : 'none',
                animationDelay: !isTransitioning ? `${Math.min(index * 30, 500)}ms` : '0ms'
              }}
            >
              <SuitCard suit={suit} />
            </div>
          );
        }}
      </List>
    )}
  </AutoSizer>
</div>
);
};

return (
<section ref={sectionRef} id="our-works" className={styles.readySuitsSection}>
<div className={styles.sectionHeader}>
  <h2 className={styles.sectionTitle}>Наши работы</h2>
</div>

<div className={styles.filtersContainer}>
  <select
    className={styles.filterSelect}
    value={activeFilter}
    onChange={handleFilterChange}
    disabled={isTransitioning}
  >
    <option value="all" className={styles.mainOption}>
      Все купальники ({getCountForFilter('all')})
    </option>
    <optgroup label="Категории">
      <option value="acrobatics_gymnastics">
        Акробатика/Гимнастика ({getCountForFilter('acrobatics_gymnastics')})
      </option>
      <option value="figure-skating">
        Фигурное катание ({getCountForFilter('figure-skating')})
      </option>
      <option value="renta">
        Прокат ({getCountForFilter('renta')})
      </option>
    </optgroup>
    <optgroup label="В наличии">
      <option value="available">
        Все размеры ({getCountForFilter('available')})
      </option>
      <option value="available-124">
        до 124 см. ({getCountForFilter('available-124')})
      </option>
      <option value="available-129">
        125-129 см. ({getCountForFilter('available-129')})
      </option>
      <option value="available-139">
        130-139 см. ({getCountForFilter('available-139')})
      </option>
      <option value="available-154">
        140-154 см. ({getCountForFilter('available-154')})
      </option>
      <option value="available-155">
        от 155 см. ({getCountForFilter('available-155')})
      </option>
    </optgroup>
    <option value="sold">
      Продано ({getCountForFilter('sold')})
    </option>
  </select>
</div>

<div 
  className={styles.transitionContainer}
  style={{
    height: containerHeight
  }}
>
  {renderFilteredItems()}
</div>
</section>
);
}

export default ReadySuits;
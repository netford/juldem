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
  const [activeFilter, setActiveFilter] = useState('all');
  const [showScrollHint, setShowScrollHint] = useState(false);
  const sectionRef = useRef(null);

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

  const filteredSuits = useMemo(() => {
    return suits.filter(suit => {
      // Если выбран фильтр по категории или все купальники
      if (activeFilter === 'all') return true;
      if (activeFilter === suit.category) return true;
      
      // Для фильтра "Продано" - исключаем категорию "renta"
      if (activeFilter === 'sold') 
        return !suit.available && suit.category !== 'renta';
      
      // Для группы фильтров "В наличии" - исключаем категорию "renta"
      if (activeFilter.startsWith('available')) {
        if (!suit.available || suit.category === 'renta') return false;
        if (activeFilter === 'available') return true;
        
        const heightRange = activeFilter.split('-')[1];
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
  }, [activeFilter]);

  // Функция для подсчёта количества товаров для каждого фильтра
  const getCountForFilter = (filter) => {
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
    }).length;
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

  // Фиксированные размеры для виртуализированного списка
  const cardWidth = 300;  // ширина карточки (px)
  const cardHeight = 650; // высота карточки (примерное значение, px)
  const gap = 32;         // отступ между карточками (px)

  // Компонент для отрисовки одной карточки в виртуализированном горизонтальном списке
  const Row = ({ index, style, data }) => {
    const newStyle = {
      ...style,
      width: cardWidth,
      marginRight: gap,
    };
    return (
      <div style={newStyle}>
        <SuitCard suit={data[index]} />
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
          onChange={(e) => setActiveFilter(e.target.value)}
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

      {filteredSuits.length === 0 ? (
        <EmptyState />
      ) : filteredSuits.length > 10 ? (
        // Если карточек больше 10 – используем виртуализацию (горизонтальный список)
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: cardHeight,
          }}
          className={showScrollHint ? styles.scrollHintAnimation : ''}
        >
          <div style={{ width: filteredSuits.length * (cardWidth + gap) - gap, height: cardHeight }}>
            <AutoSizer>
              {({ width }) => (
                <List
                  height={cardHeight}
                  itemCount={filteredSuits.length}
                  itemSize={cardWidth + gap}
                  layout="horizontal"
                  width={width}
                  itemData={filteredSuits}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          </div>
        </div>
      ) : (
        // Если карточек 10 или меньше – отображаем их стандартной CSS-сеткой
        <div className={styles.suitsGrid}>
          {filteredSuits.map(suit => (
            <SuitCard 
              key={suit.id} 
              suit={suit} 
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ReadySuits;
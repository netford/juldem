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
  {
    id: 1,
    name: "Купальник 'Радужный'",
    category: "acrobatics_gymnastics",
    price: 15000,
    height: "до 124 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000.webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (2).webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (3).webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (4).webp',
             'images/products/categories/acrobatics_gymnastics/photo_0000 (5).webp'
            ],
    available: true
  },
  {
    id: 15,
    name: "Купальник 'Гранат'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: "от 155 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_010.png'],
    available: true
  },
  {
    id: 18,
    name: "Купальник 'Бабочка'",
    category: "acrobatics_gymnastics",
    price: 30000,
    height: "140-154 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_017.png',
    'images/products/categories/acrobatics_gymnastics/photo_022.png'
            ],
    available: true
  },
  {
    id: 2,
    name: "Купальник 'Рубин'",
    category: "figure-skating",
    price: 17000,
    height: "125-129 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000 (2).png'],
    available: false
  },
  {
    id: 3,
    name: "Купальник 'Сияние'",
    category: "acrobatics_gymnastics",
    price: 16000,
    height: "до 124 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000.png'],
    available: false
  },
  {
    id: 4,
    name: "Купальник 'Сказка'",
    category: "figure-skating",
    price: 18500,
    height: "140-154 см.",
    images: ['images/products/categories/figure-skating/photo_001.png'],
    available: false
  },
  {
    id: 5,
    name: "Купальник 'Лазурит'",
    category: "figure-skating",
    price: 16500,
    height: "от 155 см.",
    images: ['images/products/categories/figure-skating/photo_002.png',
             'images/products/categories/figure-skating/photo_003.png'
            ],
    available: false
  },
  {
    id: 6,
    name: "Купальник 'Фуксия'",
    category: "figure-skating",
    price: 15500,
    height: "130-139 см.",
    images: ['images/products/categories/figure-skating/photo_004.png'],
    available: false
  },
  {
    id: 7,
    name: "Купальник 'Персея'",
    category: "figure-skating",
    price: 17500,
    height: "125-129 см.",
    images: ['images/products/categories/figure-skating/photo_005.png'],
    available: false
  },
  {
    id: 8,
    name: "Купальник 'Каскад'",
    category: "figure-skating",
    price: 16500,
    height: "до 124 см.",
    images: ['images/products/categories/figure-skating/photo_006.png'],
    available: false
  },
  {
    id: 9,
    name: "Купальник 'Лаванда'",
    category: "acrobatics_gymnastics",
    price: 19000,
    height: "140-154 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_001.png',
             'images/products/categories/acrobatics_gymnastics/photo_002.png'
            ],
    available: false
  },
  {
    id: 10,
    name: "Купальник 'Феникс'",
    category: "acrobatics_gymnastics",
    price: 17000,
    height: "от 155 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_003.png'],
    available: false
  },
  {
    id: 11,
    name: "Купальник 'Тропикана'",
    category: "acrobatics_gymnastics",
    price: 16000,
    height: "130-139 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_004.png',
             'images/products/categories/acrobatics_gymnastics/photo_005.png',
             'images/products/categories/acrobatics_gymnastics/photo_006.png'
            ],
    available: false
  },
  {
    id: 12,
    name: "Купальник 'Волна'",
    category: "acrobatics_gymnastics",
    price: 18000,
    height: "125-129 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_007.png'],
    available: false
  },
  {
    id: 13,
    name: "Купальник 'Вулкан'",
    category: "acrobatics_gymnastics",
    price: 18000,
    height: "125-129 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_008.png'],
    available: false
  },
  {
    id: 14,
    name: "Купальник 'Византия'",
    category: "acrobatics_gymnastics",
    price: 18000,
    height: "125-129 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_009.png',
             'images/products/categories/acrobatics_gymnastics/photo_009(2).png'
            ],
    available: false
  },
  {
    id: 16,
    name: "Купальник 'Аметист'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: "от 155 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_018.png',
    'images/products/categories/acrobatics_gymnastics/photo_019.webp',
    'images/products/categories/acrobatics_gymnastics/photo_020.png',
    'images/products/categories/acrobatics_gymnastics/photo_021.webp'
            ],
    available: false
  },
  {
    id: 17,
    name: "Купальник 'Бабочка'",
    category: "acrobatics_gymnastics",
    price: 35000,
    height: "140-154 см.",
    images: ['images/products/categories/acrobatics_gymnastics/photo_017.png',
    'images/products/categories/acrobatics_gymnastics/photo_022.png'
            ],
    available: false
  }

  // {
  //   id: 18,
  //   name: "Купальник 'Венера'",
  //   category: "renta",
  //   price: 2500, // Цена за неделю проката
  //   height: "130-139 см.",
  //   images: ['images/products/categories/acrobatics_gymnastics/photo_017.png'],
  //   available: true
  // }
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
            return suit.height === 'до 124 см.';
          case '129':
            return suit.height === '125-129 см.';
          case '139':
            return suit.height === '130-139 см.';
          case '154':
            return suit.height === '140-154 см.';
          case '155':
            return suit.height === 'от 155 см.';
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
            return suit.height === 'до 124 см.';
          case '129':
            return suit.height === '125-129 см.';
          case '139':
            return suit.height === '130-139 см.';
          case '154':
            return suit.height === '140-154 см.';
          case '155':
            return suit.height === 'от 155 см.';
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
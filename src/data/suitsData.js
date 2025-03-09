// src/data/suitsData.js
import nonePhoto from '../assets/images/suits/none_photo.jpg';

export const suits = [
  /* КУПАЛЬНИКИ В НАЛИЧИИ (available: true) */
  {
    id: 1,
    name: '"Бабочка"',
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
    name: '"Гранат"',
    category: "acrobatics_gymnastics",
    price: 35000,
    height: [164],
    images: ['images/products/categories/acrobatics_gymnastics/photo_010.png'],
    available: true
  },
  {
    id: 3,
    name: '"Полярная звезда"',
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
    name: '"Морской бриз"',
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
    name: '"Лаванда"',
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
    name: '"Радужный"',
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
    name: '"Амазонка"',
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
    name: '"Нежный пион"',
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
    name: '"Закат"',
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
    name: '"Малинка"',
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
    name: '"Туника" (голубой)',
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
    name: '"Туника" (сиреневый)',
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
    name: '"Январь"',
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
    name: '"Океан"',
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
    name: '"Эльза"',
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
    name: '"Всплеск"',
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
    name: '"Всплеск"',
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
    name: '"Бразильянка"',
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
    name: '"Рубин"',
    category: "figure-skating",
    price: 17000,
    height: [125, 129],
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000 (2).png'],
    available: false
  },
  {
    id: 19,
    name: '"Сияние"',
    category: "acrobatics_gymnastics",
    price: 16000,
    height: [122],
    images: ['images/products/categories/acrobatics_gymnastics/photo_0000.png'],
    available: false
  },
  {
    id: 20,
    name: '"Сказка"',
    category: "figure-skating",
    price: 18500,
    height: [140, 154],
    images: ['images/products/categories/figure-skating/photo_001.png'],
    available: false
  },
  {
    id: 21,
    name: '"Лазурит"',
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
    name: '"Фуксия"',
    category: "figure-skating",
    price: 15500,
    height: [130, 139],
    images: ['images/products/categories/figure-skating/photo_004.png'],
    available: false
  },
  {
    id: 23,
    name: '"Персея"',
    category: "figure-skating",
    price: 17500,
    height: [125, 129],
    images: ['images/products/categories/figure-skating/photo_005.png'],
    available: false
  },
  {
    id: 24,
    name: '"Каскад"',
    category: "figure-skating",
    price: 16500,
    height: [120],
    images: ['images/products/categories/figure-skating/photo_006.png'],
    available: false
  },
  {
    id: 25,
    name: '"Лаванда"',
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
    name: '"Феникс"',
    category: "acrobatics_gymnastics",
    price: 17000,
    height: [158],
    images: ['images/products/categories/acrobatics_gymnastics/photo_003.png'],
    available: false
  },
  {
    id: 27,
    name: '"Тропикана"',
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
    name: '"Волна"',
    category: "acrobatics_gymnastics",
    price: 18000,
    height: [125, 129],
    images: ['images/products/categories/acrobatics_gymnastics/photo_007.png'],
    available: false
  },
  {
    id: 29,
    name: '"Вулкан"',
    category: "acrobatics_gymnastics",
    price: 18000,
    height: [125, 129],
    images: ['images/products/categories/acrobatics_gymnastics/photo_008.png'],
    available: false
  },
  {
    id: 30,
    name: '"Византия"',
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
    name: '"Аметист"',
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
    name: '"Бабочка"',
    category: "acrobatics_gymnastics",
    price: 35000,
    height: [140, 154],
    images: ['images/products/categories/acrobatics_gymnastics/photo_017.png',
             'images/products/categories/acrobatics_gymnastics/photo_022.png'
            ],
    available: false
  }
];

// Вспомогательные функции для работы с данными
export const getImageFallback = () => nonePhoto;

// Проверка высоты в указанном диапазоне
export const isHeightInRange = (suit, minHeight, maxHeight = Infinity) => {
  if (suit.height.length === 1) {
    return suit.height[0] >= minHeight && suit.height[0] <= maxHeight;
  } else if (suit.height.length === 2) {
    return (
      (suit.height[0] >= minHeight && suit.height[0] <= maxHeight) ||
      (suit.height[1] >= minHeight && suit.height[1] <= maxHeight) ||
      (suit.height[0] < minHeight && suit.height[1] > maxHeight)
    );
  }
  return false;
};
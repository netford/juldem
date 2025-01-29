import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const ReadySuits = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSlides, setActiveSlides] = useState({});
  const slideIntervals = useRef({});
  
  const suits = [
    {
      id: 1,
      name: "Купальник 'Снегурочка'",
      category: "figure-skating",
      price: 15000,
      height: "130-139 см.",
      images: ['/images/suits/snow_maiden.jpg'],
      available: true,
      tags: ['Новинка']
    },
    {
      id: 2,
      name: "Купальник 'Виктория'",
      category: "figure-skating",
      price: 17000,
      height: "125-129 см.",
      images: [],
      available: true
    },
    {
      id: 3,
      name: "Купальник 'Лилия'",
      category: "gymnastics",
      price: 16000,
      height: "до 124 см.",
      images: [],
      available: false
    }
  ];

  // Функция для запуска автоматической прокрутки слайдов
  const startSlideshow = (suitId, images) => {
    if (images.length <= 1) return;
    
    if (slideIntervals.current[suitId]) {
      clearInterval(slideIntervals.current[suitId]);
    }

    slideIntervals.current[suitId] = setInterval(() => {
      setActiveSlides(prev => ({
        ...prev,
        [suitId]: (prev[suitId] + 1) % images.length
      }));
    }, 3000);
  };

  // Инициализация активных слайдов
  useEffect(() => {
    const initialSlides = {};
    suits.forEach(suit => {
      initialSlides[suit.id] = 0;
      if (suit.images.length > 1) {
        startSlideshow(suit.id, suit.images);
      }
    });
    setActiveSlides(initialSlides);

    return () => {
      Object.values(slideIntervals.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, []);

  return (
    <section id="our-works" className="ready-suits-section">
      <style>{`
        .ready-suits-section {
          padding: 6rem 0;
          background: var(--color-secondary);
          color: var(--color-white);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          margin-bottom: 1rem;
          color: #fff;
        }

        .filters-container {
          max-width: 600px;
          margin: 0 auto 3rem;
          padding: 0 1rem;
          position: relative;
        }

        .filter-select {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          color: #fff;
          background-color: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.5rem;
          padding-right: 3rem;
        }

        .suits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .suit-card {
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #333;
          transition: all 0.3s ease;
        }

        .suit-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .suit-image-container {
          position: relative;
          padding-top: 133%;
          overflow: hidden;
          background: #262626;
        }

        .suit-image-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .suit-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease;
          opacity: 0;
        }

        .suit-image.active {
          opacity: 1;
        }

        .tags-container {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          z-index: 2;
        }

        .tag {
          background: var(--color-primary);
          color: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .tag.sold {
          background: #00e6ff;
          color: #1a1a1a;
        }

        .suit-content {
          padding: 1.5rem;
        }

        .suit-title {
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .suit-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .suit-size {
          color: #ccc;
          font-size: 0.9rem;
        }

        .suit-price {
          color: #fff;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .suit-action-btn {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .buy-btn {
          background: var(--color-primary);
          color: #fff;
        }

        .buy-btn:hover {
          background: var(--color-accent);
        }

        .order-btn {
          background: #00e6ff;
          color: #1a1a1a;
          font-weight: 600;
        }

        .order-btn:hover {
          background: #00ccff;
        }

        @media (max-width: 1200px) {
          .suits-grid {
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .ready-suits-section {
            padding: 4rem 0;
          }

          .suits-grid {
            grid-template-columns: 1fr;
            padding: 0 1rem;
          }
        }
      `}</style>

      <div className="section-header">
        <h2 className="section-title">Наши работы</h2>
      </div>

      <div className="filters-container">
        <select
          className="filter-select"
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
        >
          <option value="all">Все купальники</option>
          <option value="available">В наличии</option>
          <option value="sold">Продано</option>
          <optgroup label="Рост">
            <option value="height-124">до 124 см.</option>
            <option value="height-129">125-129 см.</option>
            <option value="height-139">130-139 см.</option>
            <option value="height-154">140-154 см.</option>
            <option value="height-155">от 155 см.</option>
          </optgroup>
          <optgroup label="Категории">
            <option value="gymnastics">Художественная гимнастика</option>
            <option value="figure-skating">Фигурное катание</option>
            <option value="acrobatics">Спортивная акробатика</option>
          </optgroup>
        </select>
      </div>

      <div className="suits-grid">
        {suits.map(suit => (
          <article key={suit.id} className="suit-card">
            <div className="suit-image-container">
              <div className="tags-container">
                {suit.tags && suit.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
                {!suit.available && (
                  <span className="tag sold">Продано</span>
                )}
              </div>
              <div className="suit-image-slider">
                {suit.images.length > 0 ? (
                  suit.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${suit.name} - фото ${index + 1}`}
                      className={`suit-image ${index === activeSlides[suit.id] ? 'active' : ''}`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/src/assets/images/suits/none_photo.jpg';
                      }}
                    />
                  ))
                ) : (
                  <img
                    src="/src/assets/images/suits/none_photo.jpg"
                    alt={suit.name}
                    className="suit-image active"
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            <div className="suit-content">
              <h3 className="suit-title">{suit.name}</h3>
              <div className="suit-details">
                <span className="suit-size">Рост: {suit.height}</span>
                {suit.available && (
                  <span className="suit-price">
                    {suit.price.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </div>
              {suit.available ? (
                <button className="suit-action-btn buy-btn">
                  <ShoppingBag size={18} />
                  Купить
                </button>
              ) : (
                <button className="suit-action-btn order-btn">
                  <ShoppingBag size={18} />
                  Заказать
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReadySuits;
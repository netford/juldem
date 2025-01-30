import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, MessageCircle, Phone } from 'lucide-react';
import nonePhoto from '../assets/images/suits/none_photo.jpg';
import snegurochka from '../assets/images/suits/snegurochka.jpg';

function ReadySuits() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const suits = [
    {
      id: 1,
      name: "Купальник 'Аврора'",
      category: "gymnastics",
      price: 15000,
      height: "130-139 см.",
      description: "Гимнастический купальник с кристаллами Swarovski",
      images: [nonePhoto],
      available: true,
      tags: ['Новинка']
    },
    {
      id: 2,
      name: "Купальник 'Снегурочка'",
      category: "figure-skating",
      price: 17000,
      height: "125-129 см.",
      description: "Купальник для фигурного катания с градиентом",
      images: [snegurochka],
      available: true
    },
    {
      id: 3,
      name: "Купальник 'Лилия'",
      category: "gymnastics",
      price: 16000,
      height: "до 124 см.",
      description: "Купальник с цветочным орнаментом",
      images: ["/api/placeholder/400/500"],
      available: false
    },
    {
      id: 4,
      name: "Купальник 'Снежинка'",
      category: "figure-skating",
      price: 18500,
      height: "140-154 см.",
      description: "Купальник для фигурного катания с узором из страз",
      images: ["/api/placeholder/400/500"],
      available: false
    },
    {
      id: 5,
      name: "Купальник 'Феникс'",
      category: "acrobatics",
      price: 16500,
      height: "от 155 см.",
      description: "Купальник для спортивной акробатики с эффектом омбре",
      images: ["/api/placeholder/400/500"],
      available: true
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredSuits = suits.filter(suit => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'available') return suit.available;
    if (activeFilter === 'sold') return !suit.available;
    if (activeFilter === suit.category) return true;
    
    if (activeFilter.startsWith('height-')) {
      if (!suit.available) return false;
      
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

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-state-content">
        <p className="empty-state-text">
          К сожалению, по вашим критериям не найдено ни одного подходящего купальника. 
          Но не стоит расстраиваться! Мы с радостью изготовим для вас идеальный купальник 
          по индивидуальному заказу в кратчайшие сроки. Свяжитесь с нами для консультации 
          и обсуждения деталей.
        </p>
        <div className="empty-state-buttons">
          <button className="hero-button primary">
            <MessageCircle size={20} />
            Получить консультацию
          </button>
          <button className="hero-button secondary">
            <Phone size={20} />
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="our-works" className="ready-suits-section">
      <style>{`
        .ready-suits-section {
          padding: 6rem 0;
          background: var(--color-secondary);
          color: var(--color-white);
          min-height: 100vh;
        }

        .empty-state {
          padding: 3rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .empty-state-content {
          max-width: 600px;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 3rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .empty-state-text {
          color: #ccc;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .empty-state-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .hero-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .hero-button.primary {
          background: var(--color-primary);
          color: #fff;
          border: none;
        }

        .hero-button.primary:hover {
          background: var(--color-accent);
          transform: translateY(-2px);
        }

        .hero-button.secondary {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .hero-button.secondary:hover {
          border-color: #fff;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .empty-state {
            padding: 2rem 1rem;
          }

          .empty-state-content {
            padding: 2rem 1.5rem;
          }

          .empty-state-buttons {
            flex-direction: column;
          }

          .hero-button {
            width: 100%;
            justify-content: center;
          }
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

        .filter-select option {
          background: #1a1a1a;
          color: #fff;
          padding: 1rem;
        }

        .filter-select optgroup {
          background: #1a1a1a;
          color: #fff;
          font-weight: bold;
        }

        .suits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0 2rem;
        }

        .suit-card {
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          border: 1px solid #333;
        }

        .suit-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .suit-image-container {
          position: relative;
          padding-top: 133%;
          overflow: hidden;
        }

        .suit-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .suit-card:hover .suit-image {
          transform: scale(1.05);
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
          background: #1a1a1a;
          color: #fff;
          height: 245px;
          display: flex;
          flex-direction: column;
        }
        
        .suit-info {
          flex-grow: 1;
        }

        .suit-title {
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .suit-description {
          color: #ccc;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          line-height: 1.5;
          height: 3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .suit-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .suit-details.sold {
          justify-content: flex-start;
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

        .order-btn svg {
          color: #1a1a1a;
        }

        @media (max-width: 768px) {
          .ready-suits-section {
            padding: 4rem 0;
          }

          .suits-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            padding: 0 1rem;
            gap: 1.5rem;
          }

          .suit-content {
            padding: 1rem;
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

      {filteredSuits.length > 0 ? (
        <div className="suits-grid">
          {filteredSuits.map(suit => (
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
                <img 
                  src={suit.images[0]} 
                  alt={suit.name}
                  className="suit-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = nonePhoto;
                  }}
                />
              </div>

              <div className="suit-content">
                <div className="suit-info">
                  <h3 className="suit-title">{suit.name}</h3>
                  <p className="suit-description">{suit.description}</p>
                  <div className={`suit-details ${!suit.available ? 'sold' : ''}`}>
                    <span className="suit-size">Рост: {suit.height}</span>
                    {suit.available && (
                      <span className="suit-price">
                        {suit.price.toLocaleString('ru-RU')} ₽
                      </span>
                    )}
                  </div>
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
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

export default ReadySuits;
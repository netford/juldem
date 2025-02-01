import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import review images
import review001 from '../assets/images/reviews/reviews_001.png';
import review002 from '../assets/images/reviews/reviews_002.png';
import review003 from '../assets/images/reviews/reviews_003.png';
import review004 from '../assets/images/reviews/reviews_004.png';
import review005 from '../assets/images/reviews/reviews_005.png';
import review006 from '../assets/images/reviews/reviews_006.png';
import review007 from '../assets/images/reviews/reviews_007.png';
import review008 from '../assets/images/reviews/reviews_008.png';
import review009 from '../assets/images/reviews/reviews_009.png';

const ReviewsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const trackRef = useRef(null);

  const reviews = [
    { id: 1, image: review001 },
    { id: 2, image: review002 },
    { id: 3, image: review003 },
    { id: 4, image: review004 },
    { id: 5, image: review005 },
    { id: 6, image: review006 },
    { id: 7, image: review007 },
    { id: 8, image: review008 },
    { id: 9, image: review009 }
  ];

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    if (!isSwiping) return;
    setTouchEnd(e.targetTouches[0].clientX);
    e.preventDefault();
  };

  const onTouchEnd = () => {
    if (!isSwiping) return;
    
    setIsSwiping(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && activeIndex < reviews.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
    
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < reviews.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  return (
    <section id="reviews" className="reviews-section">
      <style>{`
        .reviews-section {
          padding: 6rem 0;
          background: #1a1a1a;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          color: #fff;
          margin-bottom: 1rem;
        }

        .carousel-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          transition: transform 0.3s ease-out;
          margin: 0 auto;
        }

        .review-card {
          flex: 0 0 100%;
          min-width: 100%;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .review-image {
          max-width: 100%;
          max-height: 500px;
          object-fit: contain;
          border-radius: 16px;
          background: transparent;
        }

        .carousel-container {
          background: transparent;
        }

        .review-card {
          background: transparent;
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-primary);
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
          opacity: 0.7;
        }

        .carousel-button:hover {
          background: var(--color-accent);
          transform: translateY(-50%) scale(1.1);
          opacity: 1;
        }

        .carousel-button:disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .carousel-button:disabled:hover {
          transform: translateY(-50%);
        }

        .prev-button {
          left: 20px;
        }

        .next-button {
          right: 20px;
        }

        @media (max-width: 768px) {
          .reviews-section {
            padding: 4rem 0;
          }

          .carousel-container {
            max-width: 100%;
          }

          .carousel-button {
            display: none;
          }
          
          .carousel-track {
            transform: translateX(-${activeIndex * 100}%);
            touch-action: pan-y pinch-zoom;
          }

          .review-image {
            max-height: 400px;
          }
        }
      `}</style>

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Отзывы</h2>
        </div>

        <div className="carousel-container">
          <button 
            className="carousel-button prev-button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={trackRef}
            className="carousel-track"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <img 
                  src={review.image} 
                  alt={`Отзыв ${review.id}`} 
                  className="review-image" 
                />
              </div>
            ))}
          </div>

          <button 
            className="carousel-button next-button"
            onClick={handleNext}
            disabled={activeIndex === reviews.length - 1}
            aria-label="Следующий отзыв"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
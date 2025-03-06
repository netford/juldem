import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import ProductImageSlider from './ProductImageSlider';
import OrderModal from './OrderModal';
import RentalFormModal from './RentalFormModal';
import styles from './ReadySuits.module.css';
import nonePhoto from '../assets/images/suits/none_photo.jpg';

const SuitCard = React.memo(({ suit }) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRentalFormModalOpen, setIsRentalFormModalOpen] = useState(false);
  
  // Определяем текст метки в зависимости от категории и доступности
  const getTagText = () => {
    if (suit.category === 'renta') {
      return 'Прокат';
    }
    if (suit.available) {
      return 'В наличии';
    }
    return 'Продано';
  };

  // Функция для форматирования отображения роста
  const formatHeight = (heightArray) => {
    if (heightArray.length === 1) {
      return `${heightArray[0]} см.`;
    } else if (heightArray.length === 2) {
      return `${heightArray[0]} - ${heightArray[1]} см.`;
    }
    return ""; // На случай некорректных данных
  };
  
  // Подготавливаем данные о продукте для модального окна
  const productInfo = {
    name: suit.name,
    height: formatHeight(suit.height),
    price: suit.price,
    deposit: suit.deposit, // Добавляем залог для купальников категории "renta"
    image: suit.images && suit.images.length > 0 ? suit.images[0] : nonePhoto
  };
  
  // Обработчик клика по кнопке купить/заказать/арендовать
  const handleOrderClick = (e) => {
    e.preventDefault();
    // Определяем, какое модальное окно открывать
    if (suit.category === 'renta') {
      setIsRentalFormModalOpen(true);
    } else {
      setIsOrderModalOpen(true);
    }
  };

  // Стиль для цены проката (уменьшенный размер шрифта)
  const priceStyle = suit.category === 'renta' ? {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#00aaff'
  } : {};

  return (
    <>
      <article className={styles.suitCard}>
        <div className={styles.suitImageContainer}>
          <div className={styles.tagsContainer}>
            {suit.tags && suit.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
            
            {/* Метка для статуса купальника */}
            {(suit.available || !suit.available || suit.category === 'renta') && (
              <span
                className={`
                  ${styles.tagSold}
                  ${suit.category === 'renta' ? styles.tagRenta : ''}
                  ${suit.available && suit.category !== 'renta' ? styles.tagAvailable : ''}
                `}
              >
                {getTagText()}
              </span>
            )}
          </div>
          <ProductImageSlider
            images={suit.images}
            onError={() => nonePhoto}
          />
        </div>
        <div className={styles.suitContent}>
          <div className={styles.suitInfo}>
            <h3 className={styles.suitTitle}>{suit.name}</h3>
            <div className={`${styles.suitDetails} ${!suit.available ? styles.suitDetailsSold : ''}`}>
              {/* Отображаем рост только для доступных товаров и товаров из проката */}
              {(suit.available || suit.category === 'renta') && (
                <span className={styles.suitSize}>Рост: {formatHeight(suit.height)}</span>
              )}
              {(suit.available || suit.category === 'renta') && (
                <span className={styles.suitPrice} style={priceStyle}>
                  {suit.category === 'renta' 
                    ? `${suit.price.toLocaleString('ru-RU')} / ${suit.deposit.toLocaleString('ru-RU')} ₽` 
                    : `${suit.price.toLocaleString('ru-RU')} ₽`
                  }
                </span>
              )}
            </div>
          </div>
          {suit.available && suit.category !== 'renta' ? (
            <a href="#" className={styles.buyBtn} onClick={handleOrderClick}>
              <ShoppingBag size={18} />
              Купить
            </a>
          ) : suit.category === 'renta' ? (
            <a href="#" className={`${styles.orderBtn} ${styles.rentaBtn}`} onClick={handleOrderClick}>
              <ShoppingBag size={18} />
              Забронировать
            </a>
          ) : (
            <a href="#" className={styles.orderBtn} onClick={handleOrderClick}>
              <ShoppingBag size={18} />
              Заказать
            </a>
          )}
        </div>
      </article>
      
      {/* Модальное окно заказа для обычных товаров */}
      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={productInfo}
      />
      
      {/* Модальное окно для аренды */}
      <RentalFormModal 
        isOpen={isRentalFormModalOpen}
        onClose={() => setIsRentalFormModalOpen(false)}
        product={productInfo}
      />
    </>
  );
});

export default SuitCard;
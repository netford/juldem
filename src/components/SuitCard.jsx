import React from 'react';
import { ShoppingBag } from 'lucide-react';
import ProductImageSlider from './ProductImageSlider';
import styles from './ReadySuits.module.css';
import nonePhoto from '../assets/images/suits/none_photo.jpg';

const SuitCard = React.memo(({ suit }) => {
  return (
    <article className={styles.suitCard}>
      <div className={styles.suitImageContainer}>
        <div className={styles.tagsContainer}>
          {suit.tags && suit.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
          {!suit.available && (
            <span className={styles.tagSold}>Продано</span>
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
          <p className={styles.suitDescription}>{suit.description}</p>
          <div className={`${styles.suitDetails} ${!suit.available ? styles.suitDetailsSold : ''}`}>
            <span className={styles.suitSize}>Рост: {suit.height}</span>
            {suit.available && (
              <span className={styles.suitPrice}>
                {suit.price.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
        </div>
        {suit.available ? (
          <button className={styles.buyBtn}>
            <ShoppingBag size={18} />
            Купить
          </button>
        ) : (
          <button className={styles.orderBtn}>
            <ShoppingBag size={18} />
            Заказать
          </button>
        )}
      </div>
    </article>
  );
});

export default SuitCard;

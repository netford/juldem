// OrderForm/OrderHeader.jsx
import React from 'react';
import { Shield, CreditCard } from 'lucide-react';
import styles from './OrderHeader.module.css';

const OrderHeader = ({ product, isMobile }) => {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.image} 
        />
      </div>
      <div className={styles.productInfo}>
      <h3 className={styles.productName}>Купальник {product.name}</h3>
        <div className={styles.tagContainer}>
          <div className={styles.sizeInfo}>
            <Shield size={isMobile ? 14 : 16} color="#0088ff" className={styles.icon} />
            Рост: {product.height}
          </div>
          <div className={styles.priceInfo}>
            <CreditCard size={isMobile ? 14 : 16} color="#ffc107" className={styles.icon} />
            Цена: {product.price.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
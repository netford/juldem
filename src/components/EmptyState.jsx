// src/components/EmptyState.jsx
import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import styles from './ReadySuits.module.css';

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

export default EmptyState;
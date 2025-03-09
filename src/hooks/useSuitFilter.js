// src/hooks/useSuitFilter.js
import { useState, useMemo } from 'react';
import { suits, isHeightInRange } from '../data/suitsData';

const useSuitFilter = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Фильтрация товаров в зависимости от выбранного фильтра
  const filteredSuits = useMemo(() => {
    return suits.filter(suit => {
      // Если выбран фильтр по категории или все купальники
      if (activeFilter === 'all') return true;
      if (activeFilter === suit.category) return true;
      
      // Для фильтра "Продано" - исключаем категорию "renta"
      if (activeFilter === 'sold') 
        return !suit.available && suit.category !== 'renta';
      
      // Для группы фильтров "В наличии"
      if (activeFilter.startsWith('available')) {
        if (!suit.available || suit.category === 'renta') return false;
        if (activeFilter === 'available') return true;
        
        const heightRange = activeFilter.split('-')[1];
        switch (heightRange) {
          case '124':
            // Для проверки "до 124 см."
            return isHeightInRange(suit, 0, 124);
          case '129':
            // Для проверки "125-129 см."
            return isHeightInRange(suit, 125, 129);
          case '139':
            // Для проверки "130-139 см."
            return isHeightInRange(suit, 130, 139);
          case '154':
            // Для проверки "140-154 см."
            return isHeightInRange(suit, 140, 154);
          case '155':
            // Для проверки "от 155 см."
            return isHeightInRange(suit, 155);
          default:
            return false;
        }
      }
      return false;
    });
  }, [activeFilter]);

  // Подсчет количества товаров для каждого фильтра
  const getCountForFilter = (filter) => {
    return suits.filter(suit => {
      if (filter === 'all') return true;
      if (filter === suit.category) return true;
      
      if (filter === 'sold') 
        return !suit.available && suit.category !== 'renta';
      
      if (filter.startsWith('available')) {
        if (!suit.available || suit.category === 'renta') return false;
        if (filter === 'available') return true;
        
        const heightRange = filter.split('-')[1];
        switch (heightRange) {
          case '124': return isHeightInRange(suit, 0, 124);
          case '129': return isHeightInRange(suit, 125, 129);
          case '139': return isHeightInRange(suit, 130, 139);
          case '154': return isHeightInRange(suit, 140, 154);
          case '155': return isHeightInRange(suit, 155);
          default: return false;
        }
      }
      return false;
    }).length;
  };

  return {
    activeFilter,
    setActiveFilter,
    filteredSuits,
    getCountForFilter
  };
};

export default useSuitFilter;
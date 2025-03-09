// src/components/SuitFilter.jsx
import React from 'react';
import { Filter } from 'lucide-react';
import styles from './ReadySuits.module.css';

const SuitFilter = ({ activeFilter, onFilterChange, getCountForFilter, isTransitioning }) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterWrapper}>
        <Filter className={styles.filterIcon} size={20} />
        <select
          className={styles.filterSelect}
          value={activeFilter}
          onChange={onFilterChange}
          disabled={isTransitioning}
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
    </div>
  );
};

export default SuitFilter;
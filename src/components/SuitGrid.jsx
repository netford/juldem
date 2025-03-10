// src/components/SuitGrid.jsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import SuitCard from './SuitCard';
import EmptyState from './EmptyState';
import styles from './ReadySuits.module.css';

const SuitGrid = ({ suits, isTransitioning }) => {
  if (suits.length === 0) {
    return <EmptyState />;
  }

  const isMobile = window.innerWidth <= 768;
  const isSmallSet = suits.length <= 5;
  const isMediumSet = suits.length > 5 && suits.length <= 10;
  
  // Для десктопа с кнопками навигации вместо виртуализированного списка используем обычный рендеринг
  if (!isMobile) {
    return (
      <div 
        className={`${styles.desktopGrid} ${!isTransitioning ? styles.fadeIn : ''}`}
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: `opacity ${isTransitioning ? '0.2s' : '0.5s'} ease-out`
        }}
      >
        {suits.map((suit) => (
          <SuitCard key={suit.id} suit={suit} className={styles.cardItem} />
        ))}
      </div>
    );
  }
  
  // Для небольших наборов используем обычную сетку
  if (isSmallSet) {
    return (
      <div 
        className={`${styles.smallGrid} ${!isTransitioning ? styles.smallBatchContainer : ''}`}
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: `opacity ${isTransitioning ? '0.2s' : '0.5s'} ease-out`
        }}
      >
        {suits.map((suit) => (
          <SuitCard key={suit.id} suit={suit} />
        ))}
      </div>
    );
  }
  
  // Для средних наборов используем сетку с анимацией появления
  if (isMediumSet) {
    return (
      <div 
        className={styles.smallGrid}
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: `opacity ${isTransitioning ? '0.2s' : '0.4s'} ease-out`
        }}
      >
        {suits.map((suit, index) => (
          <div 
            key={suit.id}
            className={styles.smallGridCardWrapper}
            style={{
              opacity: 0,
              animation: !isTransitioning ? `fadeIn 0.4s ease-out forwards` : 'none',
              animationDelay: !isTransitioning ? `${Math.min(index * 20, 150)}ms` : '0ms'
            }}
          >
            <SuitCard suit={suit} />
          </div>
        ))}
      </div>
    );
  }
  
  // Для больших наборов используем виртуализацию
  const cardWidth = 300;
  const gap = 32;
  const cardHeight = 650;
  
  return (
    <div
      style={{
        height: cardHeight,
        opacity: isTransitioning ? 0 : 1,
        transition: `opacity ${isTransitioning ? '0.2s' : '0.4s'} ease-out`
      }}
      className={isMobile ? styles.scrollHintAnimation : ''}
    >
      <AutoSizer>
        {({ width }) => (
          <List
            height={cardHeight}
            itemCount={suits.length}
            itemSize={cardWidth + gap}
            layout="horizontal"
            width={width}
            itemData={suits}
          >
            {({ index, style, data }) => {
              const suit = data[index];
              return (
                <div
                  style={{
                    ...style,
                    width: cardWidth,
                    marginRight: gap,
                    opacity: 0,
                    animation: !isTransitioning ? `fadeIn 0.4s ease-out forwards` : 'none',
                    animationDelay: !isTransitioning ? `${Math.min(index * 30, 500)}ms` : '0ms'
                  }}
                >
                  <SuitCard suit={suit} />
                </div>
              );
            }}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default SuitGrid;
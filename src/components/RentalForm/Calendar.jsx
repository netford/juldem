// RentalForm/Calendar.jsx
import React from 'react';
import styles from './Calendar.module.css';

const Calendar = ({ 
  visible, 
  calendarWeeks = [],
  selectedDate, 
  onDateSelect 
}) => {
  if (!visible) return null;

  return (
    <div id="custom-calendar" className={styles.calendar}>
      {/* Заголовок календаря с днями недели */}
      <div className={styles.header}>
        <div className={styles.dayHeader}>ПН</div>
        <div className={styles.dayHeader}>ВТ</div>
        <div className={styles.dayHeader}>СР</div>
        <div className={styles.dayHeader}>ЧТ</div>
        <div className={styles.dayHeader}>ПТ</div>
        <div className={styles.dayHeader}>СБ</div>
        <div className={styles.dayHeader}>ВС</div>
      </div>
      
      {/* Отображение дат по неделям */}
      {calendarWeeks.map((week, weekIndex) => (
        <div key={`week-${weekIndex}`} className={styles.grid}>
          {week.map((dateObj) => (
            <div
              key={dateObj.value}
              onClick={() => {
                if (dateObj.isInRange && !dateObj.isPast) {
                  onDateSelect(dateObj.value);
                }
              }}
              className={`
                ${styles.dateItem}
                ${selectedDate === dateObj.value ? styles.selected : ''}
                ${!dateObj.isInRange || dateObj.isPast ? styles.disabled : ''}
                ${dateObj.isToday ? styles.today : ''}
              `}
              title={dateObj.isInRange ? '' : "Доступны даты не ранее, чем через 7 дней от текущей даты"}
            >
              {dateObj.date.getDate()}
            </div>
          ))}
        </div>
      ))}
      
      <div className={styles.calendarInfo}>
        Доступны даты не ранее, чем через 7 дней от текущей даты
      </div>
    </div>
  );
};

export default Calendar;
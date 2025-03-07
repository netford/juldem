// RentalForm/Calendar.jsx
import React from 'react';
import styles from './Calendar.module.css';

const Calendar = ({ 
  visible, 
  calendarWeeks, 
  selectedDate, 
  onDateSelect,
  onOutsideClick 
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
          {week.map((dateObj, dayIndex) => (
            dateObj ? (
              <div
                key={dateObj.date.getTime()}
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
              >
                {dateObj.date.getDate()}
              </div>
            ) : (
              <div key={`empty-${dayIndex}`} className={styles.emptyCell}></div>
            )
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;

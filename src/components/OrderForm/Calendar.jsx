import React, { useEffect, useState } from 'react';
import styles from './Calendar.module.css'; // Импортируем CSS рядом

const Calendar = ({ 
  visible, 
  selectedDate, 
  onDateSelect,
  minimumDays = 7
}) => {
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  
  useEffect(() => {
    if (visible) {
      setCalendarWeeks(generateCalendarWeeks());
    }
  }, [visible, minimumDays]);
  
  if (!visible) return null;
  
  function generateCalendarWeeks() {
    const today = new Date();
    
    // Минимальная дата - сегодня + указанное количество дней
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minimumDays);
    
    // Функция для получения названия дня недели
    const getDayOfWeekName = (dayIndex) => {
      const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      return dayNames[dayIndex];
    };
    
    // Генерация дат на 60 дней вперед, начиная с минимальной даты
    const generateAvailableDates = () => {
      const dates = [];
      const lastDate = new Date(minDate);
      lastDate.setDate(minDate.getDate() + 60); // 60 дней вперед
      
      // Определяем первый день недели (понедельник)
      const firstMonday = new Date(minDate);
      const dayOfWeek = firstMonday.getDay(); // 0 - воскресенье, 1 - понедельник, ...
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      firstMonday.setDate(firstMonday.getDate() - daysToSubtract);
      
      // Находим следующее воскресенье после последнего дня
      const lastSunday = new Date(lastDate);
      const lastDayOfWeek = lastSunday.getDay();
      const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
      lastSunday.setDate(lastSunday.getDate() + daysToAdd);
      
      // Создаем массив всех дат от первого понедельника до последнего воскресенья
      const allDates = [];
      const currentDate = new Date(firstMonday);
      
      while (currentDate <= lastSunday) {
        // Проверяем, находится ли дата в диапазоне разрешенных дат
        const isInRange = currentDate >= minDate && currentDate <= lastDate;
        
        // Проверяем, является ли дата текущей
        const isToday = currentDate.getDate() === today.getDate() && 
                      currentDate.getMonth() === today.getMonth() && 
                      currentDate.getFullYear() === today.getFullYear();
        
        allDates.push({
          date: new Date(currentDate),
          dayOfWeek: currentDate.getDay(),
          formatted: `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`,
          value: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
          isPast: false, // Не может быть в прошлом, т.к. минимальная дата в будущем
          isInRange: isInRange,
          isToday: isToday
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return allDates;
    };
    
    const allDates = generateAvailableDates();
    
    // Группируем даты по неделям
    const groupDatesByWeeks = (dates) => {
      const weeks = [];
      let currentWeek = [];
      
      dates.forEach((dateObj, index) => {
        // Добавляем дату в текущую неделю
        currentWeek.push(dateObj);
        
        // Если это воскресенье или последняя дата, начинаем новую неделю
        if (dateObj.dayOfWeek === 0 || index === dates.length - 1) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
      });
      
      return weeks;
    };
    
    return groupDatesByWeeks(allDates);
  }

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
              title={dateObj.isInRange ? "" : "Доступны даты не ранее, чем через 7 дней от текущей даты"}
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
// hooks/useCalendar.js
import { useState, useEffect } from 'react';

const useCalendar = (formData, setShowCustomCalendar, clearErrorOnFocus) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [isFirefoxMobile, setIsFirefoxMobile] = useState(false);

  // Определение Firefox Mobile
  useEffect(() => {
    const mobile = window.innerWidth <= 768;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    setIsFirefoxMobile(isFirefox && mobile);
  }, []);

  // Генерация временных слотов при инициализации хука
  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);

  // Функция для генерации временных слотов
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Генерация слотов на сегодня
    for (let hour = 10; hour < 19; hour++) {
      // Пропускаем прошедшие часы
      if (hour < currentHour) continue;
      
      // Пропускаем текущий час, если до его окончания осталось менее 15 минут
      if (hour === currentHour && currentMinutes > 45) continue;

      slots.push({
        value: `today-${hour}`,
        label: `Сегодня с ${hour}:00 до ${hour + 1}:00`
      });
    }

    // Генерация слотов на завтра
    for (let hour = 10; hour < 19; hour++) {
      slots.push({
        value: `tomorrow-${hour}`,
        label: `Завтра с ${hour}:00 до ${hour + 1}:00`
      });
    }

    return slots;
  };

  // Функция для получения названия дня недели
  const getDayOfWeekName = (dayIndex) => {
    const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    return dayNames[dayIndex];
  };

  // Функция для генерации дат на 30 дней вперед, правильно группированных по неделям
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const currentHour = today.getHours();
    
    // Определяем первый день (сегодня) и последний день (сегодня + 29 дней)
    const firstDate = new Date(today);
    const lastDate = new Date(today);
    lastDate.setDate(today.getDate() + 29);
    
    // Получаем полные недели (начиная с понедельника)
    // Находим предыдущий понедельник или текущий день, если сегодня понедельник
    const firstMonday = new Date(firstDate);
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
      // Проверяем, находится ли дата в диапазоне разрешенных дат (сегодня + 30 дней)
      const isInRange = currentDate >= firstDate && currentDate <= lastDate;
      
      // Проверяем, является ли дата текущей
      const isToday = currentDate.getDate() === today.getDate() && 
                    currentDate.getMonth() === today.getMonth() && 
                    currentDate.getFullYear() === today.getFullYear();
                    
      // Проверяем, является ли дата прошедшей
      // Если сегодняшний день и уже поздно вечером
      const isPast = isToday && currentHour >= 19;
      
      allDates.push({
        date: new Date(currentDate),
        dayOfWeek: currentDate.getDay(),
        formatted: `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`,
        value: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        isPast: isPast,
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

  const calendarWeeks = groupDatesByWeeks(allDates);

  // Обработчик выбора даты в календаре
  const handleDateSelect = (dateValue) => {
    // Обновляем состояние формы
    setShowCustomCalendar(false);
    clearErrorOnFocus();
    
    return dateValue;
  };

  return {
    calendarWeeks,
    timeSlots,
    handleDateSelect,
    isFirefoxMobile
  };
};

export default useCalendar;

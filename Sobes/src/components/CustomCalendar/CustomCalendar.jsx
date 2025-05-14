import React, { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addYears,
  subYears,
  startOfWeek,
  endOfWeek,
  addDays,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import './CustomCalendar.css';

const CustomCalendar = ({ value, onChange }) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [viewMode, setViewMode] = useState('month'); // Начинаем с дня
  const [hoveredYear, setHoveredYear] = useState(null);

  useEffect(() => {
    if (value) {
      setCurrentDate(value);
    }
  }, [value]);

  const generateYears = (centerYear) => {
    const years = [];
    const startYear = centerYear - 6;
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  const generateDays = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 41); // 6 недель × 7 дней - 1 день

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const prevPeriod = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    if (viewMode === 'year') setCurrentDate(subYears(currentDate, 1));
    if (viewMode === 'decade') setCurrentDate(subYears(currentDate, 12));
  };

  const nextPeriod = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (viewMode === 'year') setCurrentDate(addYears(currentDate, 1));
    if (viewMode === 'decade') setCurrentDate(addYears(currentDate, 12));
  };

  const handleSelectDate = (day) => {
    const selected = new Date(day);
    if (onChange) onChange(selected);
  };

  const handleSelectMonth = (month) => {
    const monthDate = new Date(currentDate.getFullYear(), month, 1);
    setCurrentDate(monthDate);
    setViewMode('month'); 
  };

  const handleSelectYear = (year) => {
    const yearDate = new Date(year, currentDate.getMonth(), 1);
    setCurrentDate(yearDate);
    setViewMode('year'); 
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-controls">
        <button onClick={prevPeriod}>&#8592;</button>

        <div
          className="current-period"
          onClick={() =>
            setViewMode(
              viewMode === 'month'
                ? 'year'
                : viewMode === 'year'
                ? 'decade'
                : 'month'
            )
          }
        >
          {viewMode === 'month' && format(currentDate, 'LLLL yyyy', { locale: ru })}
          {viewMode === 'year' && format(currentDate, 'yyyy', { locale: ru })}
          {viewMode === 'decade' &&
            `${format(currentDate, 'yyyy')} — ${format(addYears(currentDate, 11), 'yyyy')}`}
        </div>

        <button onClick={nextPeriod}>&#8594;</button>
      </div>

      {viewMode === 'month' && (
        <div className="month-view">
          <div className="weekdays">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="days-grid">
            {generateDays().map((day) => (
              <div
                key={day.toString()}
                className={`day-cell ${isSameDay(day, value) ? 'selected' : ''}`}
                onClick={() => handleSelectDate(day)}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'year' && (
        <div className="year-view">
          <div className="months-grid">
            {Array.from({ length: 12 }).map((_, month) => {
              const monthDate = new Date(currentDate.getFullYear(), month, 1);
              return (
                <div
                  key={month}
                  className="month-cell"
                  onClick={() => handleSelectMonth(month)}
                >
                  {format(monthDate, 'LLL', { locale: ru })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'decade' && (
        <div className="decade-view">
          <div className="years-grid">
            {generateYears(currentDate.getFullYear()).map((year) => (
              <div
                key={year}
                className={`year-cell ${hoveredYear === year ? 'hovered' : ''}`}
                onClick={() => handleSelectYear(year)}
                onMouseEnter={() => setHoveredYear(year)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                {year}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
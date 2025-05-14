import React, { useState, useRef, useEffect } from 'react';
import './WorkSpace.css';
import { FiX, FiCalendar } from 'react-icons/fi';
import CustomCalendar from '../CustomCalendar/CustomCalendar';
import { format, parse, isValid } from 'date-fns';

const WorkSpace = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [goTime, setGoTime] = useState(false);
  const [error, setError] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [calendarViewMode, setCalendarViewMode] = useState('month');
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (selectedDate) {
      const formatString = goTime ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy';
      setInputValue(format(selectedDate, formatString));
    } else {
      setInputValue('');
    }
  }, [selectedDate, goTime]);

  const parseInput = (value) => {
    if (!value.trim()) return null;

    const cleanValue = value.replace(/\D/g, '');

    if (!goTime) {
      if (cleanValue.length <= 8) {
        const day = parseInt(cleanValue.slice(0, 2)) || 1;
        const month = (parseInt(cleanValue.slice(2, 4)) || 1) - 1;
        let year = parseInt(cleanValue.slice(4)) || new Date().getFullYear();

        if (cleanValue.slice(4).length <= 2) {
          year = year > 80 ? 1900 + year : 2000 + year;
        }

        const tempDate = new Date(year, month, Math.min(day, 31));

        if (
          tempDate.getFullYear() === year &&
          tempDate.getMonth() === month &&
          tempDate.getDate() === day
        ) {
          return tempDate;
        }
        return null;
      }
    }

    try {
      const formatString = goTime ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy';
      const parsed = parse(value, formatString, new Date());
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const formatInputValue = (value) => {
    const digits = value.replace(/\D/g, '');

    if (goTime) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
      if (digits.length <= 8)
        return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
      return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)} ${digits.slice(
        8,
        10
      )}:${digits.slice(10, 12)}`;
    } else {
      if (digits.length <= 2) return digits;
      if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
      return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatInputValue(value);
    setInputValue(formattedValue);
    const cursorPosition = e.target.selectionStart;
    setTimeout(() => {
      const newCursorPos = cursorPosition + (formattedValue.length - value.length);
      e.target.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    if (formattedValue.length === (goTime ? 16 : 10)) {
      const parsed = parseInput(formattedValue);
      if (parsed) {
        setSelectedDate(parsed);
        setError(false);
      } else {
        setSelectedDate(null);
        setError(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const parsed = parseInput(inputValue);
      if (parsed) {
        setSelectedDate(parsed);
        setError(false);
      } else {
        setSelectedDate(null);
        if (error) setError(true);
      }
      e.preventDefault();
    }
  };

  const handleInputBlur = () => {
    const parsed = parseInput(inputValue);
    if (parsed) {
      setSelectedDate(parsed);
      setError(false);
    } else {
      setSelectedDate(null);
      if (error && inputValue) setError(true);
    }
  };

  const clearInput = () => {
    setInputValue('');
    setSelectedDate(null);
    inputRef.current?.focus();
  };

  const toggleDateTime = () => {
    setGoTime(!goTime);
    if (selectedDate) {
      const formatString = !goTime ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy';
      setInputValue(format(selectedDate, formatString));
    } else {
      setInputValue('');
    }
  };

  const toggleError = (e) => {
    setError(e.target.checked);
    if (!e.target.checked && selectedDate) {
      setError(false);
    }
  };

  const toggleInactive = (e) => {
    setInactive(e.target.checked);
  };

  const getInputClassName = () => {
    let className = 'custom-date-input';
    if (inactive) className += ' inactive';
    if (error && !selectedDate && !inactive) className += ' error';
    return className;
  };

  const openCalendar = (e) => {
    e.preventDefault();
    if (!inactive) setShowCalendar(true);
  };

  // Закрытие календаря по клику вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <div className="workspace-main-div">
      <div className="workspace">
        <div className="checkboxes">
          <div className="checkbox">
            <input
              type="checkbox"
              checked={inactive}
              onChange={toggleInactive}
              id="inactive-checkbox"
            />
            <label htmlFor="inactive-checkbox">Выключить</label>
          </div>
          <div className="checkbox errorbox">
            <input
              type="checkbox"
              checked={error}
              onChange={toggleError}
              id="error-checkbox"
            />
            <label htmlFor="error-checkbox">Ошибка</label>
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              checked={goTime}
              onChange={toggleDateTime}
              id="time-checkbox"
            />
            <label htmlFor="time-checkbox">Время</label>
          </div>
        </div>

        <div className="date-zone">
          <div className="input-zone">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className={getInputClassName()}
              style={{ width: goTime ? '197px' : '160px' }}
              onClick={() => !inactive && setShowCalendar(true)}
              disabled={inactive}
              placeholder={goTime ? 'Введите дату и время' : 'Введите дату'}
              aria-invalid={error && !selectedDate}
              aria-describedby={error && !selectedDate ? 'date-error' : undefined}
            />
            {inputValue && !inactive && (
              <button
                className="clear-button"
                onClick={clearInput}
                aria-label="Очистить дату"
                tabIndex={-1}
              >
                <FiX />
              </button>
            )}
            {!inactive && (
              <button
                className="calendar-button"
                onClick={openCalendar}
                aria-label="Открыть календарь"
              >
                <FiCalendar />
              </button>
            )}
            {showCalendar && (
                <div className="calendar-overlay" ref={calendarRef}>
                    <CustomCalendar
                    value={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                    }}
                    viewMode={calendarViewMode}
                    onViewModeChange={setCalendarViewMode}
                    />
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
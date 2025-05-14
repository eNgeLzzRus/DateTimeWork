import React, { useState, useEffect } from 'react';
import './WorkSpace.css';
import { FiX } from 'react-icons/fi';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';

const WorkSpace = () => {
    const [date, setDate] = useState('');
    const [datetime, setDatetime] = useState('');
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [goTime, setGoTime] = useState(false);
    const [error, setError] = useState(false);
    const [showError, setShowError] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const selectedDate = goTime ? datetime : date;

    useEffect(() => {
        if (error) {
            const value = goTime ? datetime : date;
            setShowError(!value);
        } else {
            setShowError(false);
        }
    }, [error, date, datetime, goTime]);

    const checkError = (value) => {
        setShowError(error && !value);
    };

    const handleDateChange = (newDate) => {
        if (goTime) {
            setDatetime(newDate);
        } else {
            setDate(newDate);
        }
        if (newDate) {
            setShowPlaceholder(false);
            setShowError(false);
        }
    };
    
    const toggleDateTime = () => {
        setGoTime(!goTime);
        setShowPlaceholder(true);
    };

    const toggleError = (e) => {
        const isChecked = e.target.checked;
        setError(isChecked);
    };

    const toggleInactive = (e) => {
        const isActive = e.target.checked;
        setInactive(isActive);
    };

    const getInputClassName = () => {
        let className = inactive ? 'inactive ' : '';
        if (showError && !inactive) className += 'error ';
        if (showPlaceholder && !(goTime ? datetime : date)) className += 'has-placeholder ';
        return className.trim();
    };

    const openCalendar = () => {
        if (!inactive) setShowCalendar(true);
    }

    const clearInput = () => {
        if (goTime) {
            setDatetime('');
        } else {
            setDate('');
        }
        setShowPlaceholder(true);
    };

    return (
        <div className='workspace-main-div'>
            <div className='workspace'>
                <div className="checkboxes">
                    <div className="checkbox">
                        <input 
                            type="checkbox" 
                            checked={inactive}
                            onChange={toggleInactive} 
                        />
                        <p>Выключить</p>
                    </div>
                    <div className="checkbox errorbox">
                        <input 
                            type="checkbox" 
                            checked={error}
                            onChange={toggleError} 
                        />
                        <p>Ошибка</p>
                    </div>
                    <div className="checkbox">
                        <input 
                            type="checkbox" 
                            checked={goTime}
                            onChange={toggleDateTime}
                        />
                        <p>Время</p>
                    </div>
                </div>

                <div className="date-zone">
                    <div className="input-zone">
                        <input
                            type='text'
                            value={selectedDate ? new Date(selectedDate).toLocaleString(goTime ? 'ru' : 'ru', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                ...(goTime && { hour: '2-digit', minute: '2-digit' })
                            }) : ''}
                            onClick={openCalendar}
                            readOnly
                            placeholder={goTime ? 'Выберите дату и время' : 'Выберите дату'}
                            onFocus={() => setShowPlaceholder(false)}
                            className={getInputClassName()}
                        />
                        {selectedDate && !inactive && (
                            <button
                                className='clear-button'
                                onClick={clearInput}
                                aria-label='Очистить дату'
                            >
                                <FiX />
                            </button>
                        )}
                    </div>
                    {showPlaceholder && !selectedDate && (
                        <span className={`date-placeholder ${inactive ? 'inactive' : ''}`}>
                            {goTime ? 'Выберите дату и время' : 'Выберите дату'}
                        </span>
                    )}

                    {showCalendar && !inactive && (
                        <div className="calendar-overlay">
                            <DatePicker 
                                selected={selectedDate || null}
                                onChange={(d) => {
                                    handleDateChange(d)
                                    setShowCalendar()
                                }}
                                showTimeSelect={goTime}
                                timeFormat='HH:mm'
                                timeIntervals={15}
                                dateFormat={goTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                                inline
                                locale='ru'
                                onClickOutside={() => setShowCalendar(false)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkSpace;
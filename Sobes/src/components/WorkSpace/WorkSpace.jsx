import React, { useState, useEffect } from 'react'
import './WorkSpace.css'
import { FiX } from 'react-icons/fi'

const WorkSpace = () => {
    const [date, setDate] = useState('')
    const [datetime, setDatetime] = useState('')
    const [showPlaceholder, setShowPlaceholder] = useState(true)
    const [goTime, setGoTime] = useState(false)
    const [error, setError] = useState(false)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        if (error) {
            const value = goTime ? datetime : date
            setShowError(!value)
        } else {
            setShowError(false)
        }
    }, [error, date, datetime, goTime])

    const checkError = (value) => {
        setShowError(error && !value)
    }

    const handleDateChange = (e) => {
        const value = e.target.value
        if (goTime) {
            setDatetime(value)
        } else {
            setDate(value)
        }
        if (value) {
            setShowPlaceholder(false)
            setShowError(false)
        }
    }

    const handleDateBlur = (e) => {
        if (!e.target.value) {
            setShowPlaceholder(true)
            checkError(e.target.value) 
        }
    }
    
    const toggleDateTime = () => {
        setGoTime(!goTime)
        setShowPlaceholder(true)
    }

    const toggleError = (e) => {
        const isChecked = e.target.checked
        setError(isChecked)
    }

    const getInputClassName = () => {
        if (showError) return 'error'
        if (showPlaceholder && !(goTime ? datetime : date)) return 'has-placeholder'
        return ''
    }

    return (
        <div className='workspace-main-div'>
            <div className='workspace'>
                <div className="checkboxes">
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
                {!goTime ? (
                    <div className="date-zone">
                        <div className="input-zone">
                            <input
                                type='date'
                                value={date}
                                onChange={handleDateChange}
                                onFocus={() => {setShowPlaceholder(false); setShowError(false)}}
                                onBlur={handleDateBlur}
                                className={getInputClassName()}
                            />
                            {date && (
                                <button
                                    className='clear-button'
                                    onClick={() => {
                                        setDate('')
                                        setShowPlaceholder(true)
                                    }}
                                    aria-label='Очистить дату'
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>
                        {showPlaceholder && !date && (
                            <span className='date-placeholder'>Выберите дату</span>
                        )}
                    </div>
                ) : (
                    <div className="date-zone"> 
                        <div className="input-zone">
                            <input
                                type='datetime-local'
                                value={datetime}
                                onChange={handleDateChange}
                                onFocus={() => {setShowPlaceholder(false); setShowError(false)}}
                                onBlur={handleDateBlur}
                                className={getInputClassName()}
                            />
                            {datetime && (
                                <button
                                    className='clear-button'
                                    onClick={() => {
                                        setDatetime('')
                                        setShowPlaceholder(true)
                                    }}
                                    aria-label='Очистить дату'
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>
                        {showPlaceholder && !datetime && (
                            <span className='date-placeholder'>Выберите дату и время</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WorkSpace
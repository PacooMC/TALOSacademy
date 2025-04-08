import React, { useState } from 'react'
import './TimeOptions.css'

function TimeOptions() {
  const [selectedTime, setSelectedTime] = useState(null);
  
  const timeOptions = [
    { id: 1, label: '30 min' },
    { id: 2, label: '1 hora' },
    { id: 3, label: '2 horas' }
  ];
  
  return (
    <div className="time-options">
      {timeOptions.map(option => (
        <button
          key={option.id}
          className={`time-option ${selectedTime === option.id ? 'selected' : ''}`}
          onClick={() => setSelectedTime(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default TimeOptions

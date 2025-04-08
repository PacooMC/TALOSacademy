import React, { useState } from 'react'
import './MoodTracker.css'

function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moods = [
    { id: 'happy', emoji: '😃', background: '#4287f5' },
    { id: 'neutral', emoji: '🙂', background: '#f5ca42' },
    { id: 'confused', emoji: '😐', background: '#e6e6e6' }
  ];
  
  return (
    <div className="mood-tracker">
      {moods.map(mood => (
        <button
          key={mood.id}
          className={`mood-option ${selectedMood === mood.id ? 'selected' : ''}`}
          style={{ backgroundColor: selectedMood === mood.id ? mood.background : 'transparent' }}
          onClick={() => setSelectedMood(mood.id)}
        >
          <span role="img" aria-label={mood.id}>{mood.emoji}</span>
        </button>
      ))}
    </div>
  )
}

export default MoodTracker

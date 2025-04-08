import React from 'react';
import './YesNoSelector.css';

function YesNoSelector({ question, value, onChange }) {
  return (
    <div className="yes-no-selector">
      <label>{question}</label>
      <div className="options">
        <button
          type="button" // Prevent form submission if inside a form
          className={`option-btn ${value === true ? 'selected yes' : ''}`}
          onClick={() => onChange(true)}
        >
          Sí
        </button>
        <button
          type="button"
          className={`option-btn ${value === false ? 'selected no' : ''}`}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default YesNoSelector;

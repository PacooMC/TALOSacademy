import React from 'react';
import './TextInput.css';

// Added placeholder, value, onChange, and id props
function TextInput({ placeholder = "Escribe aquí...", value, onChange, id }) {
  return (
    <div className="text-input-container">
      <input
        type="text"
        className="text-input"
        id={id} // Use id prop
        placeholder={placeholder} // Use prop
        value={value} // Use prop
        onChange={onChange} // Use prop
      />
    </div>
  );
}

export default TextInput;

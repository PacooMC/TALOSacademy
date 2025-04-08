import React, { useState } from 'react'; // Removed useRef, useEffect
import './CollapsibleSection.css';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

function CollapsibleSection({ title, children, startOpen = false }) {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    // Add 'open' class to the main container based on state
    <div className={`collapsible-section ${isOpen ? 'open' : ''}`}>
      <button className="section-header" onClick={() => setIsOpen(!isOpen)}>
        {/* Chevron rotation handled by CSS based on .open class */}
        <FaChevronRight className="chevron-icon" />
        <span className="section-title">{title}</span>
      </button>
      {/*
        Conditionally render the content wrapper OR
        always render and use CSS display property. Let's use CSS display.
      */}
      <div className="section-content-wrapper">
        <div className="section-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleSection;

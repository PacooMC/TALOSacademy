import React from 'react';
import './PracticalAppContext.css'; // Create this CSS file
import { FaLink } from 'react-icons/fa';

function PracticalAppContext({ appData }) {
  // Basic placeholder - expand later
  return (
    // Removed margin from here, handled by parent gap
    <div className="practical-app-context">
       <FaLink className="context-icon"/>
      <div className="context-text">
         Este concepto se aplica en <strong>{appData.practiceName}</strong>.
         <p>{appData.description}</p>
         {/* Add button to show more details if needed */}
         <button className="show-details-btn">Ver aplicación</button>
      </div>
    </div>
  );
}

export default PracticalAppContext;

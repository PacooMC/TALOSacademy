import React, { useState } from 'react';
import './ExerciseDisplay.css';
import { FaLightbulb, FaSyncAlt } from 'react-icons/fa';

function ExerciseDisplay({ exerciseData }) {
  const [showSolution, setShowSolution] = useState(false);

  // Check if exerciseData exists and has the expected properties
  if (!exerciseData || !exerciseData.statement || !exerciseData.solutionSteps) {
    // Optionally return null or a placeholder if data is missing
    console.error("ExerciseDisplay: Missing exercise data", exerciseData);
    return <div className="exercise-display error">Error: Datos del ejercicio incompletos.</div>;
  }

  const handleGenerateSimilar = () => {
    alert('Funcionalidad "Generar ejercicio similar" no implementada.');
  };

  return (
    <div className="exercise-display">
      <div className="exercise-statement">
        <strong>Enunciado:</strong>
        {/* Render statement directly, assuming it's plain text */}
        <p>{exerciseData.statement}</p>
        {/* Placeholder for image if exerciseData.image exists */}
      </div>

      <div className="exercise-actions">
        <button
          className={`solution-toggle ${showSolution ? 'active' : ''}`}
          onClick={() => setShowSolution(!showSolution)}
        >
          <FaLightbulb /> {showSolution ? 'Ocultar Solución' : 'Mostrar Solución'}
        </button>
        <button className="generate-similar-btn" onClick={handleGenerateSimilar}>
          <FaSyncAlt /> Generar Similar
        </button>
      </div>

      {showSolution && (
        <div className="exercise-solution-steps">
          <strong>Solución Paso a Paso:</strong>
          <ol>
            {/* Map over solutionSteps, rendering HTML if present */}
            {exerciseData.solutionSteps.map((step, index) => (
              // Use dangerouslySetInnerHTML for steps containing HTML (like the integral)
              <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default ExerciseDisplay;

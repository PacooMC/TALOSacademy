import React from 'react';
import './HelpPanel.css';
// Corrected import statement
import { FaTimes, FaLightbulb } from 'react-icons/fa';

// Added onClose prop
function HelpPanel({ onClose }) {
  // Static content for now
  const helpContent = {
    title: "Explicación Alternativa: Transformada de Fourier",
    points: [
      "Imagina que una canción (señal en el tiempo) está hecha de diferentes notas musicales (frecuencias).",
      "La Transformada de Fourier es como un 'ecualizador mágico' que te dice exactamente qué notas (frecuencias) componen esa canción y con qué volumen (amplitud).",
      "En vez de ver la canción como una onda que sube y baja con el tiempo, la ves como un gráfico de barras donde cada barra es una nota/frecuencia.",
      "Esto es útil para quitar ruido (frecuencias no deseadas) o para entender qué partes de la señal son las más importantes.",
      "La FFT (Fast Fourier Transform) es solo una forma muy rápida de calcular esto en un ordenador."
    ],
    question: "¿Qué parte específica no te queda clara?"
  };

  return (
    <div className="help-panel-overlay">
      <div className="help-panel">
        <button className="help-panel-close-btn" onClick={onClose} title="Cerrar">
          <FaTimes />
        </button>
        <div className="help-panel-header">
          <FaLightbulb className="help-icon" />
          <h3>{helpContent.title}</h3>
        </div>
        <div className="help-panel-content">
          <ul>
            {helpContent.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <p className="help-question">{helpContent.question}</p>
          {/* Placeholder for further interaction */}
          <div className="help-interaction-placeholder">
            (Aquí irían opciones o un campo de texto para preguntar)
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPanel;

import React, { useState } from 'react';
import './Exercises.css';
import { FaFileUpload, FaPlusCircle, FaTrashAlt, FaEye, FaSave, FaSyncAlt, FaQuestionCircle, FaLightbulb, FaTimes } from 'react-icons/fa';

// --- Mock Data ---
const initialExerciseSets = [
  {
    id: 'set-1',
    name: 'PDF: Problemas Tema 1.pdf',
    type: 'uploaded',
    exercises: [
      {
        id: 'ex-1-1',
        title: 'Ejercicio 1.1',
        statement: 'Una señal se describe por la forma de onda de banda base mostrada en la figura. Determine los coeficientes de la serie de Fourier a_n para la señal modulada.',
        image: '/images/baseband_waveform.png', // Reusing placeholder
        solution: [
          'Identificar el periodo fundamental T de la señal (parece ser 2T en la figura, ajustar si es necesario).',
          'Definir la señal x(t) matemáticamente en un periodo.',
          'Aplicar la fórmula del coeficiente a_n = (1/T_periodo) * integral(x(t) * cos(n * w0 * t) dt) sobre un periodo.',
          'Resolver la integral para obtener a_n.',
          'Resultado final: a_n = (A/nπ) * sin(nπ/2) (asumiendo periodo 2T y simetría).'
        ],
        reference: 'Fourier Series Transforms'
      },
      {
        id: 'ex-1-2',
        title: 'Ejercicio 1.2',
        statement: 'Calcule el ancho de banda requerido para una señal AM-DSB si la señal moduladora tiene componentes de frecuencia hasta 4 kHz.',
        solution: [
          'El ancho de banda de una señal AM-DSB (Doble Banda Lateral) es el doble de la frecuencia máxima de la señal moduladora (mensaje).',
          'Frecuencia máxima de la moduladora (fm) = 4 kHz.',
          'Ancho de banda (BW) = 2 * fm.',
          'BW = 2 * 4 kHz = 8 kHz.'
        ],
        reference: 'Amplitude Modulation'
      },
    ]
  },
  {
    id: 'set-2',
    name: 'Generado: Fourier Básico',
    type: 'generated',
    exercises: [
      {
        id: 'ex-2-1',
        title: 'Ejercicio 2.1 (Generado)',
        statement: "Calcula la Transformada de Fourier de un pulso rectangular x(t) = 2 para |t| < 1 y 0 en otro caso. Dibuja su espectro de magnitud.",
        solution: [
          "Aplicar la definición integral de la FT: X(f) = integral(x(t) * exp(-j*2*pi*f*t) dt) de -inf a +inf.",
          "La integral se reduce a: integral(2 * exp(-j*2*pi*f*t) dt) de -1 a 1.",
          "Resolver la integral: [2 / (-j*2*pi*f)] * [exp(-j*2*pi*f*t)] evaluado entre -1 y 1.",
          "Evaluar: [1 / (-j*pi*f)] * [exp(-j*2*pi*f) - exp(j*2*pi*f)].",
          "Usar Euler (exp(jx) - exp(-jx) = 2j*sin(x)): [1 / (-j*pi*f)] * [-2j*sin(2*pi*f)].",
          "Simplificar: (2 / (pi*f)) * sin(2*pi*f) = 4 * [sin(2*pi*f) / (2*pi*f)] = 4 * sinc(2*pi*f). (Nota: definición de sinc puede variar)",
          "El espectro de magnitud |X(f)| es |4 * sinc(2*pi*f)|, una función sinc con amplitud 4 en f=0."
        ],
        reference: 'Fourier Transform Properties'
      }
    ]
  }
];
// --- End Mock Data ---

// --- Helper Components ---
function SolutionDisplay({ solution }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!solution || solution.length === 0) {
    return <p className="no-solution">No hay solución disponible.</p>;
  }

  return (
    <div className={`solution-display ${isOpen ? 'open' : ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="solution-toggle">
        <FaLightbulb /> {isOpen ? 'Ocultar Solución' : 'Mostrar Solución'}
      </button>
      {isOpen && (
        <div className="solution-content">
          {Array.isArray(solution) ? (
            <ol>
              {solution.map((step, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
              ))}
            </ol>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: solution }}></p>
          )}
        </div>
      )}
    </div>
  );
}

function ExerciseFigure({ image, caption }) {
  if (!image) return null;
  // Basic SVG placeholder if the specific image isn't found or needed
  const isPlaceholder = image === '/images/baseband_waveform.png'; // Check if it's the known placeholder path

  return (
    <div className="exercise-figure">
      {isPlaceholder ? (
         <svg width="350" height="160" viewBox="0 0 400 180" className="placeholder-svg">
           <line x1="50" y1="100" x2="350" y2="100" stroke="#9ca3af" strokeWidth="1.5" />
           <line x1="200" y1="40" x2="200" y2="160" stroke="#9ca3af" strokeWidth="1.5" />
           <path d="M100,100 L100,60 L300,60 L300,100 Z" fill="none" stroke="#6b7280" strokeWidth="2" />
           <text x="90" y="120" fill="#6b7280" fontSize="12" textAnchor="middle">−T/2</text>
           <text x="310" y="120" fill="#6b7280" fontSize="12" textAnchor="middle">T/2</text>
           <text x="200" y="120" fill="#6b7280" fontSize="12" textAnchor="middle">0</text>
           <text x="360" y="105" fill="#6b7280" fontSize="12">t</text>
           <text x="215" y="55" fill="#6b7280" fontSize="12">A</text>
           <polygon points="200,40 196,48 204,48" fill="#9ca3af" />
           <polygon points="350,100 342,96 342,104" fill="#9ca3af" />
           <text x="200" y="150" fill="#adb5bd" fontSize="14" textAnchor="middle">Placeholder Figure</text>
         </svg>
      ) : (
        <img src={image} alt="Diagrama del ejercicio" />
      )}
      {caption && <div className="figure-caption">{caption}</div>}
    </div>
  );
}
// --- End Helper Components ---


function Exercises() {
  const [exerciseSets, setExerciseSets] = useState(initialExerciseSets);
  const [selectedSetId, setSelectedSetId] = useState(initialExerciseSets[0]?.id || null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  // Add state for modals if needed later

  const handleSelectSet = (setId) => {
    setSelectedSetId(setId);
    setSelectedExerciseIndex(0); // Reset to first exercise when changing set
  };

  const handleSelectExercise = (index) => {
    setSelectedExerciseIndex(index);
  };

  const handleDeleteSet = (setId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este conjunto de ejercicios?')) {
      setExerciseSets(prevSets => prevSets.filter(set => set.id !== setId));
      // If the deleted set was selected, select the first available set or null
      if (selectedSetId === setId) {
        const remainingSets = exerciseSets.filter(set => set.id !== setId);
        setSelectedSetId(remainingSets[0]?.id || null);
        setSelectedExerciseIndex(0);
      }
    }
  };

  const handleUploadPDF = () => {
    alert('Funcionalidad "Subir PDF" no implementada.\nEn una aplicación real, esto requeriría procesamiento en el servidor o librerías complejas para extraer texto e imágenes del PDF.');
    // Simulate adding a new set
    const newSet = {
      id: `set-${Date.now()}`,
      name: `PDF: subido_${Date.now()}.pdf`,
      type: 'uploaded',
      exercises: [ { id: 'new-ex-1', title: 'Ejercicio Extraído 1', statement: '...', solution: ['...'] } ]
    };
    setExerciseSets(prev => [...prev, newSet]);
    setSelectedSetId(newSet.id);
    setSelectedExerciseIndex(0);
  };

  const handleGenerateSet = () => {
     alert('Funcionalidad "Generar Conjunto" no implementada.\nEsto requeriría integración con IA para crear ejercicios basados en temas o dificultad.');
     // Simulate adding a new generated set
     const newSet = {
       id: `set-${Date.now()}`,
       name: `Generado: ${new Date().toLocaleTimeString()}`,
       type: 'generated',
       exercises: [ { id: 'gen-ex-1', title: 'Ejercicio Generado 1', statement: '...', solution: ['...'] } ]
     };
     setExerciseSets(prev => [...prev, newSet]);
     setSelectedSetId(newSet.id);
     setSelectedExerciseIndex(0);
  };

  // --- Exercise Action Handlers (Simulated) ---
  const handleGenerateSimilar = (exerciseId) => {
    alert(`Generar ejercicio similar a ${exerciseId} (Simulación IA)`);
    // In real app: Call AI, potentially add the new exercise to the set or a new 'Similar' set.
  };

  const handleGetHelp = (exerciseId) => {
    alert(`Pedir ayuda/explicación para ${exerciseId} (Simulación IA)`);
    // In real app: Open a help panel/modal, send context to AI, display response.
  };

  const handleSaveExercise = (exerciseId) => {
     alert(`Guardar cambios en ejercicio ${exerciseId} (Simulación)`);
     // In real app: Update state/database with modified exercise data.
  };
  // --- End Exercise Action Handlers ---

  const selectedSet = exerciseSets.find(set => set.id === selectedSetId);
  const currentExercise = selectedSet?.exercises[selectedExerciseIndex];

  return (
    <div className="exercises-page-container">
      {/* Header */}
      <div className="exercises-header">
        <h1>Mis Ejercicios</h1>
        <div className="exercises-main-actions">
          <button onClick={handleUploadPDF} className="action-btn primary">
            <FaFileUpload /> Subir PDF
          </button>
          <button onClick={handleGenerateSet} className="action-btn secondary">
            <FaPlusCircle /> Generar Conjunto
          </button>
        </div>
      </div>

      {/* Exercise Sets List */}
      <div className="exercise-sets-list">
        <h2>Conjuntos de Ejercicios</h2>
        {exerciseSets.length === 0 ? (
          <p className="no-sets-message">No hay conjuntos de ejercicios. Sube un PDF o genera uno nuevo.</p>
        ) : (
          <ul>
            {exerciseSets.map(set => (
              <li key={set.id} className={set.id === selectedSetId ? 'active' : ''}>
                <span className={`set-type-indicator ${set.type}`}></span>
                <button className="set-name" onClick={() => handleSelectSet(set.id)}>
                  {set.name} ({set.exercises.length} ej.)
                </button>
                <div className="set-actions">
                   <button onClick={() => handleSelectSet(set.id)} title="Ver Conjunto" className="icon-btn view-btn">
                     <FaEye />
                   </button>
                   <button onClick={() => handleDeleteSet(set.id)} title="Eliminar Conjunto" className="icon-btn delete-btn">
                     <FaTrashAlt />
                   </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Exercise Viewer Area */}
      <div className="exercise-viewer-area">
        {selectedSet && currentExercise ? (
          <>
            {/* Exercise Tabs/Selector */}
            <div className="exercise-tabs">
              {selectedSet.exercises.map((ex, index) => (
                <button
                  key={ex.id}
                  className={`exercise-tab ${index === selectedExerciseIndex ? 'active' : ''}`}
                  onClick={() => handleSelectExercise(index)}
                >
                  {ex.title || `Ejercicio ${index + 1}`}
                </button>
              ))}
            </div>

            {/* Current Exercise Card */}
            <div className="exercise-card">
              <h3>{currentExercise.title || `Ejercicio ${selectedExerciseIndex + 1}`}</h3>

              <div className="exercise-statement-section">
                <h4>Enunciado</h4>
                <p dangerouslySetInnerHTML={{ __html: currentExercise.statement }}></p>
                <ExerciseFigure image={currentExercise.image} caption={currentExercise.reference ? `Ref: ${currentExercise.reference}` : null} />
              </div>

              <SolutionDisplay solution={currentExercise.solution} />

              <div className="exercise-card-actions">
                <button onClick={() => handleGenerateSimilar(currentExercise.id)} title="Generar ejercicio similar">
                  <FaSyncAlt /> Similar
                </button>
                <button onClick={() => handleGetHelp(currentExercise.id)} title="Necesito ayuda con este ejercicio">
                  <FaQuestionCircle /> Ayuda
                </button>
                 <button onClick={() => handleSaveExercise(currentExercise.id)} title="Guardar cambios (simulado)">
                   <FaSave /> Guardar
                 </button>
              </div>
            </div>
          </>
        ) : (
          <div className="exercise-viewer-placeholder">
            {exerciseSets.length > 0 ? 'Selecciona un conjunto de ejercicios para empezar.' : 'Sube o genera un conjunto de ejercicios.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Exercises;

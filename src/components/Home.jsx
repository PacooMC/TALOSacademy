import React, { useState } from 'react';
import TimeOptions from './TimeOptions';
import TextInput from './TextInput';
import YesNoSelector from './YesNoSelector';
import './Home.css';
import { FaChalkboardTeacher, FaBookOpen, FaChartLine, FaFlask, FaFilePdf, FaPencilAlt, FaMap, FaTrophy, FaCalendarAlt, FaBullseye, FaListAlt, FaCheckCircle, FaArrowRight, FaRedoAlt, FaExclamationCircle } from 'react-icons/fa';
// Removed direct import of competencies data
// import { competencies as mapNodesData, edges as mapEdgesData } from '../data/competencies';

// Function to get state color class (can be moved to a utils file later)
const getStateClass = (state) => {
  switch (state) {
    case 'done': return 'state-done';
    case 'progress': return 'state-progress';
    case 'lag': return 'state-lag';
    case 'none': return 'state-none';
    default: return '';
  }
};

// Accept subjectId and subjectData as props
function Home({ onNavigate, subjectId, subjectData }) {
  const [hasExam, setHasExam] = useState(null);
  const [examDetails, setExamDetails] = useState('');
  const [hasPractice, setHasPractice] = useState(null);
  const [practiceDetails, setPracticeDetails] = useState('');

  // --- Extract map data from subjectData ---
  const mapNodesData = subjectData?.competencies || [];
  // Select a few key nodes for the preview (e.g., root, next steps)
  // Simple logic: take the first few nodes, or implement more complex logic later
  const previewNodes = mapNodesData.slice(0, 4); // Example: first 4 nodes

  // --- Simulation for "Continue" feature (could be subject-specific later) ---
  const lastSessionIncomplete = true; // Example
  const lastTopic = "Aplicar FFT"; // Example topic

  return (
    <div className="home-container">
      <div className="home-greeting">
        <h1>Hola, Paco 👋</h1>
        {/* Add subject context to greeting */}
        <h2>¿Listo para estudiar {subjectData?.name || 'tu próxima asignatura'}?</h2>
      </div>

      {/* Continue Session Banner */}
      {lastSessionIncomplete && (
        <div className="continue-session-banner">
          <FaExclamationCircle className="banner-icon" />
          <div className="banner-text">
            Parece que dejaste <strong>{lastTopic}</strong> a medias ayer.
          </div>
          <button className="continue-btn" onClick={() => { /* Logic to resume session */ }}>
            Continuar donde lo dejaste <FaRedoAlt />
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="home-main-grid">

        {/* Left Column: Setup & Objective */}
        <div className="home-left-column">
          <div className="home-card study-setup-card">
            <div className="card-header">
              <FaBullseye />
              <h3>Define tu Sesión</h3>
            </div>
            <div className="input-group">
              <label>¿Cuánto tiempo tienes?</label>
              <TimeOptions />
            </div>
            <div className="input-group">
              <YesNoSelector
                question="¿Tienes algún examen próximamente?"
                value={hasExam}
                onChange={setHasExam}
              />
            </div>
            {hasExam === true && (
              <div className="input-group conditional-input">
                <label htmlFor="exam-details">Describe brevemente el examen (temas, fecha...)</label>
                <TextInput
                  id="exam-details"
                  placeholder="Ej: Examen parcial Tema 1-3, próximo martes"
                  value={examDetails}
                  onChange={(e) => setExamDetails(e.target.value)}
                />
              </div>
            )}
            <div className="input-group">
              <YesNoSelector
                question="¿Tienes alguna práctica/entrega cercana?"
                value={hasPractice}
                onChange={setHasPractice}
              />
            </div>
            {hasPractice === true && (
              <div className="input-group conditional-input">
                <label htmlFor="practice-details">Describe brevemente la práctica (tema, fecha...)</label>
                <TextInput
                  id="practice-details"
                  placeholder="Ej: Práctica 3 sobre FFT, entrega el viernes"
                  value={practiceDetails}
                  onChange={(e) => setPracticeDetails(e.target.value)}
                />
              </div>
            )}
            <div className="input-group">
              <label>¿Algo específico que quieras trabajar hoy?</label>
              <TextInput placeholder="Ej: Repasar transformaciones lineales..." />
            </div>
             <div className="session-action-buttons">
               <button className="action-button primary" onClick={() => onNavigate('coach')}>
                 <FaChalkboardTeacher /> Generar Plan Personalizado
               </button>
               <button className="action-button secondary" onClick={() => onNavigate('study')}>
                 <FaBookOpen /> Seguir Planificación Guiada
               </button>
             </div>
          </div>
        </div>

        {/* Right Column: Map Preview & Quick Actions */}
        <div className="home-right-column">
          <div className="home-card map-preview-card">
            <div className="card-header">
              <FaMap />
              <h3>Tu Progreso Actual</h3>
            </div>
            <div className="map-preview-content">
              {previewNodes.length > 0 ? (
                previewNodes.map(node => (
                  <div key={node.id} className={`map-preview-node ${getStateClass(node.state)}`}>
                    <span className="node-state-indicator"></span>
                    <span className="node-title-preview">{node.title}</span>
                    <span className="node-level-preview">{node.level}</span>
                  </div>
                ))
              ) : (
                <p className="no-data-msg">Aún no hay datos de progreso para esta asignatura.</p>
              )}
            </div>
            <button className="view-full-map" onClick={() => onNavigate('map')}>
              Explorar Mapa Completo <FaArrowRight />
            </button>
          </div>

          <div className="home-card quick-access-card">
            <div className="card-header">
              <FaFlask />
              <h3>Herramientas</h3>
            </div>
            <div className="quick-access-buttons">
              <button className="quick-button" onClick={() => onNavigate('coach')}><FaChalkboardTeacher /><span>Tutor Diario</span></button>
              <button className="quick-button" onClick={() => onNavigate('exercises')}><FaPencilAlt /><span>Ejercicios</span></button>
              <button className="quick-button" onClick={() => onNavigate('exams')}><FaFilePdf /><span>Exámenes</span></button>
              <button className="quick-button" onClick={() => onNavigate('challenges')}><FaTrophy /><span>Retos</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;

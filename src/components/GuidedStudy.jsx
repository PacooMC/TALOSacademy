import React, { useState, useEffect } from 'react';
import TopicSidebar from './TopicSidebar';
// Removed direct import of guidedStudyTopics
// import { guidedStudyTopics as initialTopics } from '../data/guidedStudyData';
import './GuidedStudy.css';
import { FaBullseye, FaBrain, FaExchangeAlt, FaQuestionCircle, FaSyncAlt, FaCheckCircle, FaDownload, FaMapMarkedAlt, FaCheck, FaPaperPlane, FaExclamationTriangle, FaTimes, FaUndo } from 'react-icons/fa';

// --- Report Issue Modal Component (remains the same) ---
function ReportIssueModal({ isOpen, onClose, onSubmit }) {
  const [issueDetails, setIssueDetails] = useState('');
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (issueDetails.trim()) {
      onSubmit(issueDetails);
      setIssueDetails('');
    }
  };
  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <button className="report-modal-close-btn" onClick={onClose} title="Cerrar"><FaTimes /></button>
        <h3><FaExclamationTriangle /> Reportar Errata o Sugerencia</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="issue-details">Describe detalladamente la errata o el cambio que sugieres:</label>
          <textarea id="issue-details" value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)} placeholder="Ej: En la sección 1.1, la fórmula..." rows="6" required />
          <div className="report-modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Enviar Reporte</button>
          </div>
        </form>
      </div>
    </div>
  );
}
// --- End Report Issue Modal Component ---

// Accept subjectData (which should contain the guided study topics) as a prop
function GuidedStudy({ subjectData }) {
  const [topics, setTopics] = useState([]);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [helpQuery, setHelpQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  // Update state when subjectData prop changes
  useEffect(() => {
    const initialTopics = subjectData || []; // Use subjectData directly
    setTopics(initialTopics);

    // Reset selection if needed or select first pending
    const allSubtopics = initialTopics.flatMap(t => t.subtopics || []);
    const firstPendingSubtopic = allSubtopics.find(s => s.status === 'pending');
    const currentSelectedIsValid = allSubtopics.some(s => s.id === selectedSubtopicId);

    if (!currentSelectedIsValid || !selectedSubtopicId) {
        setSelectedSubtopicId(firstPendingSubtopic?.id || allSubtopics[0]?.id || null);
    }
    // Reset help form on subject change
    setShowHelpForm(false);
    setHelpQuery('');

  }, [subjectData]); // Depend on subjectData

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // --- Help Form Handlers (remain the same) ---
  const toggleHelpForm = () => {
    setShowHelpForm(!showHelpForm);
    setHelpQuery('');
  };
  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (helpQuery.trim()) {
      alert(`Pregunta enviada: "${helpQuery}" (Simulación: Se enviaría a IA)`);
      setHelpQuery('');
      setShowHelpForm(false);
    }
  };
  // --- End Help Form Handlers ---

  // --- Report Modal Handlers (remain the same) ---
   const handleReportSubmit = (details) => {
     alert(`Reporte enviado:\n"${details}"\n(Simulación: Se guardaría para revisión)`);
     setShowReportModal(false);
   };
  // --- End Report Modal Handlers ---

  // Function to update subtopic status (remains the same logic)
  const updateSubtopicStatus = (subtopicId, newStatus) => {
    setTopics(currentTopics => {
        const updatedTopics = currentTopics.map(topic => ({
            ...topic,
            subtopics: topic.subtopics.map(subtopic =>
                subtopic.id === subtopicId ? { ...subtopic, status: newStatus } : subtopic
            )
        }));

        // Optional: Auto-navigate to next pending subtopic
        if (newStatus === 'completed') {
            const allSubtopics = updatedTopics.flatMap(t => t.subtopics);
            const currentIndex = allSubtopics.findIndex(s => s.id === subtopicId);
            const nextPendingSubtopic = allSubtopics.find((sub, index) => index > currentIndex && sub.status === 'pending');
            if (nextPendingSubtopic) {
                setSelectedSubtopicId(nextPendingSubtopic.id);
                // Optionally scroll content area to top
            }
        }
        return updatedTopics;
    });
     // TODO: Persist this change (e.g., API call)
  };

  let selectedSubtopicData = null;
  if (selectedSubtopicId) {
    for (const topic of topics) { // Use stateful topics
      const foundSubtopic = topic.subtopics.find(sub => sub.id === selectedSubtopicId);
      if (foundSubtopic) {
        selectedSubtopicData = foundSubtopic;
        break;
      }
    }
  }

  // Placeholder action handlers (remain the same)
  const handleGenerateNew = () => alert('Funcionalidad "Generar uno nuevo" no implementada.');
  const handleExport = () => alert('Funcionalidad "Exportar Resumen/Mapa" no implementada.');
  const handleViewMap = () => alert('Funcionalidad "Ver en mapa" no implementada.');

  // Specific handler for marking complete/pending using the state updater
  const handleToggleComplete = () => {
    if (selectedSubtopicData) {
      const newStatus = selectedSubtopicData.status === 'completed' ? 'pending' : 'completed';
      updateSubtopicStatus(selectedSubtopicData.id, newStatus);
      alert(`Subtema "${selectedSubtopicData.title}" marcado como ${newStatus === 'completed' ? 'completado' : 'pendiente'}.`);
    }
  };

  // Handle loading or no data state
  if (!subjectData) {
      return <div className="placeholder">Cargando datos de Estudio Guiado...</div>;
  }
   if (topics.length === 0) {
      return <div className="placeholder">No hay temas de Estudio Guiado disponibles para esta asignatura.</div>;
  }


  return (
    <div className={`guided-study-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <TopicSidebar
        topics={topics} // Pass stateful topics
        selectedId={selectedSubtopicId}
        onSelect={(id) => {
          setSelectedSubtopicId(id);
          setShowHelpForm(false); // Close help form when changing subtopic
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div className="guided-study-content-area">
        {selectedSubtopicData ? (
          <>
            <div className="subtopic-content-card">
              {/* Header */}
              <h2 className="subtopic-title">📘 Subtema: {selectedSubtopicData.title}</h2>

              {/* Objective */}
              <div className="content-section objective-section">
                <h3><FaBullseye /> Objetivo</h3>
                <p>{selectedSubtopicData.objective}</p>
              </div>

              {/* Explanation */}
              <div className="content-section explanation-section">
                <h3><FaBrain /> Explicación</h3>
                <div dangerouslySetInnerHTML={{ __html: selectedSubtopicData.explanation }} />
              </div>

              {/* Example */}
              <div className="content-section example-section">
                <h3><FaExchangeAlt /> Ejemplo trabajado</h3>
                <div dangerouslySetInnerHTML={{ __html: selectedSubtopicData.example }} />
              </div>

              {/* Exercise */}
              <div className="content-section exercise-section">
                <h3><FaQuestionCircle /> Ejercicio intercalado</h3>
                <div className="exercise-statement" dangerouslySetInnerHTML={{ __html: selectedSubtopicData.exercise.statement }} />
                <div className="exercise-actions">
                  <button onClick={toggleHelpForm}><FaQuestionCircle /> ¿No lo entiendes?</button>
                  <button onClick={handleGenerateNew}><FaSyncAlt /> Generar uno nuevo</button>
                </div>
                {/* Inline Help Form */}
                <div className={`inline-help-form-container ${showHelpForm ? 'open' : ''}`}>
                  {showHelpForm && (
                    <form className="inline-help-form" onSubmit={handleHelpSubmit}>
                      <label htmlFor={`help-query-${selectedSubtopicData.id}`}>¿Qué parte específica necesitas aclarar?</label>
                      <textarea id={`help-query-${selectedSubtopicData.id}`} value={helpQuery} onChange={(e) => setHelpQuery(e.target.value)} placeholder="Escribe tu duda aquí..." rows="3" required />
                      <button type="submit"><FaPaperPlane /> Enviar Pregunta</button>
                    </form>
                  )}
                </div>
              </div>

              {/* Competencies */}
              <div className="content-section competencies-section">
                <h3><FaCheckCircle /> Competencias cubiertas</h3>
                <ul className="competencies-list">
                  {selectedSubtopicData.competencies.map((comp, index) => (
                    <li key={index}>{comp}</li>
                  ))}
                </ul>
              </div>

              {/* Footer Actions */}
              <div className="content-footer-actions">
                <button onClick={handleExport}><FaDownload /> Exportar Resumen</button>
                <button onClick={handleViewMap}><FaMapMarkedAlt /> Ver en mapa</button>
                {/* Conditional Completion Button */}
                {selectedSubtopicData.status === 'completed' ? (
                   <button onClick={handleToggleComplete} className="pending-btn">
                     <FaUndo /> Marcar como Pendiente
                   </button>
                 ) : (
                   <button onClick={handleToggleComplete} className="complete-btn">
                     <FaCheck /> Marcar como Completado
                   </button>
                 )}
              </div>

            </div>

            {/* Report Errata Link/Button */}
            <div className="report-errata-trigger">
              <button onClick={() => setShowReportModal(true)}>
                <FaExclamationTriangle /> Reportar errata o sugerir cambio
              </button>
            </div>
          </>
        ) : (
          <div className="placeholder">Selecciona un subtema del menú lateral para comenzar.</div>
        )}
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

export default GuidedStudy;

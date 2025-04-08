import React, { useState } from 'react';
import './KnowledgeNodeCard.css';
import CollapsibleSection from './CollapsibleSection';
import ExerciseDisplay from './ExerciseDisplay';
import PracticalAppContext from './PracticalAppContext';
import NodeActions from './NodeActions';
import { FaPaperPlane } from 'react-icons/fa';

// Added onUpdateStatus prop
function KnowledgeNodeCard({ nodeData, onUpdateStatus }) {
  const { id, title, content, status } = nodeData; // Destructure status
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [helpQuery, setHelpQuery] = useState('');

  const toggleHelpForm = () => {
    setShowHelpForm(!showHelpForm);
    setHelpQuery('');
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (helpQuery.trim()) {
      alert(`Pregunta enviada: "${helpQuery}" (no implementado)`);
      setHelpQuery('');
      setShowHelpForm(false);
    }
  };

  const renderSectionContent = (sectionContent) => {
    if (!sectionContent) return null;
    const text = typeof sectionContent === 'string' ? sectionContent : sectionContent.text;
    const image = typeof sectionContent === 'object' && sectionContent.image ? sectionContent.image : null;
    return (
      <>
        {image && (
          <div className="content-image-wrapper">
            <img src={image} alt={`${title} illustration`} className="content-image" loading="lazy" />
          </div>
        )}
        {text && typeof text === 'string' && <div dangerouslySetInnerHTML={{ __html: text }} />}
      </>
    );
  };

  return (
    <div className="knowledge-node-card">
      <h3 className="node-card-title">
        🧩 {title}
      </h3>
      <div className="node-card-sections">
        {content.introduction && (
          <CollapsibleSection title="Introducción" startOpen={true}>
            {renderSectionContent(content.introduction)}
          </CollapsibleSection>
        )}
        {content.theory && (
          <CollapsibleSection title="Desarrollo Teórico">
             {renderSectionContent(content.theory)}
          </CollapsibleSection>
        )}
        {content.example && (
          <CollapsibleSection title="Ejemplo Explicado">
             {renderSectionContent(content.example)}
          </CollapsibleSection>
        )}
        {content.practicalApplication?.relevant && (
           <PracticalAppContext appData={content.practicalApplication} />
        )}
        {content.exercise && (
          <CollapsibleSection title="Ejercicio Práctico" startOpen={false}>
            <ExerciseDisplay exerciseData={content.exercise} />
          </CollapsibleSection>
        )}
      </div>
      <div className="node-card-footer">
         {/* Pass status and onUpdateStatus down to NodeActions */}
         <NodeActions
            nodeId={id}
            status={status} // Pass current status
            onUpdateStatus={onUpdateStatus} // Pass handler function
            onNeedHelpClick={toggleHelpForm}
         />
      </div>

      {/* Inline Help Form - Conditionally Rendered */}
      <div className={`inline-help-form-container ${showHelpForm ? 'open' : ''}`}>
        {showHelpForm && (
          <form className="inline-help-form" onSubmit={handleHelpSubmit}>
            <label htmlFor={`help-query-${id}`}>¿Qué parte específica necesitas aclarar?</label>
            <textarea
              id={`help-query-${id}`}
              value={helpQuery}
              onChange={(e) => setHelpQuery(e.target.value)}
              placeholder="Escribe tu duda aquí..."
              rows="3"
              required
            />
            <button type="submit">
              <FaPaperPlane /> Enviar Pregunta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default KnowledgeNodeCard;

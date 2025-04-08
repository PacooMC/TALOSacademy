import React from 'react';
import './SessionHeader.css';
import { FaCalendarAlt, FaClock, FaBullseye, FaFlask, FaGraduationCap, FaEdit } from 'react-icons/fa'; // Added FaEdit

function SessionHeader({ context }) {
  return (
    <div className="session-header-card">
      <div className="header-top-row">
        <div className="header-info-item">
          <FaCalendarAlt />
          <span>{context.date}</span>
        </div>
        <div className="header-info-item">
          <FaClock />
          <span>Estimado: {context.estimatedTime}</span>
        </div>
        <button className="edit-focus-btn" title="Editar Foco del Día">
          <FaEdit />
        </button>
      </div>
      <div className="header-focus">
        <FaBullseye className="focus-icon" />
        <div className="focus-details">
          <strong>Foco Principal:</strong>
          <div className="focus-nodes-list">
            {context.focusNodes.map((node, index) => (
              <span key={node.id} className="focus-node-tag">
                {node.title}
                {index < context.focusNodes.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      {(context.upcomingPractice || context.upcomingExam) && (
        <div className="header-reminders">
          {context.upcomingPractice && (
            <div className="reminder-item">
              <FaFlask />
              <span>Próxima Práctica: {context.upcomingPractice.name} ({context.upcomingPractice.due})</span>
            </div>
          )}
          {context.upcomingExam && (
            <div className="reminder-item">
              <FaGraduationCap />
              <span>Próximo Examen: {context.upcomingExam.date}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SessionHeader;

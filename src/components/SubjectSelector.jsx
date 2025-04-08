import React from 'react';
import './SubjectSelector.css';
import { FaBook } from 'react-icons/fa'; // Example icon

function SubjectSelector({ enrolledSubjects, currentSubjectId, onSubjectChange }) {
  if (!enrolledSubjects || enrolledSubjects.length === 0) {
    return <div className="subject-selector-placeholder">No hay asignaturas</div>;
  }

  // Find the current subject name for display
  const currentSubject = enrolledSubjects.find(s => s.id === currentSubjectId);

  return (
    <div className="subject-selector-container">
      <FaBook className="subject-icon" />
      <select
        className="subject-select"
        value={currentSubjectId}
        onChange={(e) => onSubjectChange(e.target.value)}
        aria-label="Seleccionar asignatura"
      >
        {enrolledSubjects.map(subject => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
        {/* Optionally add a link/button to manage subjects */}
        {/* <option value="manage" disabled>--- Gestionar ---</option> */}
      </select>
      {/* Display current subject name if needed, or handle in header */}
      {/* {currentSubject && <span className="current-subject-name">{currentSubject.name}</span>} */}
    </div>
  );
}

export default SubjectSelector;

import React, { useState } from 'react';
import './Settings.css';
import { availableSubjects, getSubjectById } from '../data/subjects'; // Import available subjects
import { FaPlus, FaTrashAlt, FaSearch, FaCog } from 'react-icons/fa';

// Renamed props to match App.jsx state
function Settings({ enrolledSubjects, onAddSubject, onRemoveSubject }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCareer, setFilterCareer] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  // Derive available subjects NOT already enrolled
  const enrolledIds = new Set(enrolledSubjects.map(s => s.id));
  const subjectsToAdd = availableSubjects.filter(subject => {
    const isEnrolled = enrolledIds.has(subject.id);
    const nameMatch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const careerMatch = !filterCareer || subject.career === filterCareer;
    const courseMatch = !filterCourse || subject.courseYear === parseInt(filterCourse);
    return !isEnrolled && nameMatch && careerMatch && courseMatch;
  });

  // Get unique careers and course years for filters
  const uniqueCareers = [...new Set(availableSubjects.map(s => s.career))];
  const uniqueCourses = [...new Set(availableSubjects.map(s => s.courseYear))].sort((a, b) => a - b);

  return (
    <div className="settings-container">
      <h1><FaCog /> Configuración</h1>

      {/* Section: Enrolled Subjects */}
      <div className="settings-section">
        <h2>Mis Asignaturas Inscritas</h2>
        {enrolledSubjects.length > 0 ? (
          <ul className="enrolled-subjects-list">
            {enrolledSubjects.map(subject => (
              <li key={subject.id}>
                <div className="subject-info">
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-details">{subject.career} - Curso {subject.courseYear}</span>
                </div>
                <button
                  onClick={() => onRemoveSubject(subject.id)}
                  className="remove-subject-btn"
                  title="Eliminar asignatura"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder-text">No tienes ninguna asignatura inscrita. ¡Añade una!</p>
        )}
        {/* Add limit info here later based on subscription plan */}
        {/* <p className="limit-info">Puedes añadir hasta X asignaturas más.</p> */}
      </div>

      {/* Section: Add New Subjects */}
      <div className="settings-section">
        <h2>Añadir Nueva Asignatura</h2>
        <div className="add-subject-filters">
          <div className="filter-group search-filter">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterCareer} onChange={(e) => setFilterCareer(e.target.value)}>
              <option value="">Todas las Carreras</option>
              {uniqueCareers.map(career => <option key={career} value={career}>{career}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
              <option value="">Todos los Cursos</option>
              {uniqueCourses.map(course => <option key={course} value={course}>Curso {course}</option>)}
            </select>
          </div>
        </div>

        {subjectsToAdd.length > 0 ? (
          <ul className="available-subjects-list">
            {subjectsToAdd.map(subject => (
              <li key={subject.id}>
                <div className="subject-info">
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-details">{subject.career} - Curso {subject.courseYear}</span>
                </div>
                <button
                  onClick={() => onAddSubject(subject.id)}
                  className="add-subject-btn"
                  title="Añadir asignatura"
                >
                  <FaPlus /> Añadir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder-text">No hay más asignaturas disponibles con los filtros actuales, o ya estás inscrito en todas.</p>
        )}
      </div>

      {/* Add other settings sections here (Profile, Preferences, Subscription, etc.) */}

    </div>
  );
}

export default Settings;

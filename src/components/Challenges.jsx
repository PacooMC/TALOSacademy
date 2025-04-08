import React, { useState } from 'react';
    import './Challenges.css';
    // Import icons
    import {
      FaBullseye, FaClock, FaMapSigns, FaFileAlt, FaFlask, FaChartBar, FaChartLine, FaChartPie,
      FaCalendarAlt, FaUserGraduate, FaLightbulb, FaTrophy, FaPlus, FaCalendarCheck, FaTasks,
      FaFire, FaStar, FaPlusCircle, FaChevronRight // Added new icons
    } from 'react-icons/fa';

    // --- Mock Data ---
    const mockObjectives = [
      { id: 'obj1', type: 'hours', title: 'Estudiar 8h esta semana', current: 5.25, goal: 8, unit: 'h' },
      { id: 'obj2', type: 'nodes', title: 'Cubrir 3 competencias nuevas', current: 2, goal: 3, unit: 'nodos' },
      { id: 'obj3', type: 'exams', title: 'Hacer 1 examen completo', current: 1, goal: 1, unit: 'examen' },
      { id: 'obj4', type: 'practice', title: 'Analizar 2 prácticas', current: 0, goal: 2, unit: 'prácticas' },
    ];

    const mockSuggestions = [
      { id: 'sug1', text: 'Veo que llevas 4 días sin tocar Prácticas. ¿Qué tal si completas 1 esta semana?' },
      { id: 'sug2', text: 'Has mejorado mucho en teoría. ¿Te animas con un test completo esta tarde?' },
    ];

    const mockAchievements = [
      { id: 'ach1', title: 'Primer test sin errores', unlocked: true, date: '2024-04-05' },
      { id: 'ach2', title: 'Práctica explicada 100% por IA', unlocked: false, date: null },
      { id: 'ach3', title: 'Rama "Fourier" cubierta', unlocked: true, date: '2024-03-28' },
      { id: 'ach4', title: '3 días seguidos de estudio', unlocked: false, date: null },
      { id: 'ach5', title: 'Maestro de la Modulación', unlocked: false, date: null },
      { id: 'ach6', title: '10 Horas de Estudio Semanal', unlocked: true, date: '2024-04-01' },
    ];

    const mockStreak = { current: 4, longest: 7 }; // Current and longest study streak

    const mockPersonalBests = [
      { id: 'pb1', title: 'Sesión más larga', value: '2h 15m', icon: <FaClock /> },
      { id: 'pb2', title: 'Más ejercicios/día', value: '12', icon: <FaTasks /> },
      { id: 'pb3', title: 'Mejor nota examen', value: '9.2', icon: <FaUserGraduate /> },
    ];
    // --- End Mock Data ---

    // --- Sub-Components ---

    function ObjectiveCard({ objective }) {
      const progress = objective.goal > 0 ? Math.min((objective.current / objective.goal) * 100, 100) : 0;
      const isCompleted = objective.current >= objective.goal;

      let icon;
      switch (objective.type) {
        case 'hours': icon = <FaClock />; break;
        case 'nodes': icon = <FaMapSigns />; break;
        case 'exams': icon = <FaFileAlt />; break;
        case 'practice': icon = <FaFlask />; break;
        default: icon = <FaBullseye />;
      }

      return (
        <div className={`objective-card ${isCompleted ? 'completed' : ''}`}>
          <div className="objective-icon-wrapper">
            <div className="objective-icon">{icon}</div>
          </div>
          <div className="objective-details">
            <span className="objective-title">{objective.title}</span>
            <div className="objective-progress">
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="progress-text">{objective.current}/{objective.goal} {objective.unit} {isCompleted && '✓'}</span>
            </div>
          </div>
        </div>
      );
    }

    function SuggestionCard({ suggestion, onAccept }) {
      return (
        <div className="suggestion-card">
          <FaLightbulb className="suggestion-icon" />
          <p className="suggestion-text">{suggestion.text}</p>
          <div className="suggestion-actions">
            <button onClick={() => onAccept(suggestion.id)} className="accept-button">
              <FaPlus /> Aceptar Reto
            </button>
          </div>
        </div>
      );
    }

    function AchievementBadge({ achievement }) {
      return (
        <div className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
          <div className="achievement-icon-container">
            <FaTrophy className="achievement-icon" />
          </div>
          <div className="achievement-details">
            <span className="achievement-title">{achievement.title}</span>
            {achievement.unlocked && achievement.date && (
              <span className="achievement-date">Desbloqueado: {achievement.date}</span>
            )}
          </div>
        </div>
      );
    }

    function StreakCounter({ streak }) {
      return (
        <div className="streak-counter-card">
          <div className="streak-icon fire">
            <FaFire />
          </div>
          <div className="streak-info">
            <span className="streak-value">{streak.current}</span>
            <span className="streak-label">Días seguidos</span>
          </div>
          <div className="streak-longest">
            <FaTrophy /> Récord: {streak.longest}
          </div>
        </div>
      );
    }

    function PersonalBestCard({ best }) {
      return (
        <div className="personal-best-card">
          <div className="pb-icon">{best.icon}</div>
          <div className="pb-details">
            <span className="pb-title">{best.title}</span>
            <span className="pb-value">{best.value}</span>
          </div>
        </div>
      );
    }

    // --- Main Challenges Component ---

    function Challenges() {
      const [objectives, setObjectives] = useState(mockObjectives);
      const [suggestions, setSuggestions] = useState(mockSuggestions);

      const handleAcceptSuggestion = (suggestionId) => {
        alert(`Reto aceptado (ID: ${suggestionId}) - Simulación: Se añadiría a objetivos.`);
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      };

      const handleAddCustomGoal = () => {
        alert("Funcionalidad 'Añadir Objetivo Personalizado' no implementada.");
        // In a real app, this would open a modal or form
      };

      return (
        <div className="challenges-container">
          <div className="challenges-header">
            <h1><FaTasks /> Retos y Progreso</h1>
            {/* Add button for custom goals */}
            <button className="add-goal-btn" onClick={handleAddCustomGoal}>
              <FaPlusCircle /> Añadir Objetivo
            </button>
          </div>

          {/* Top Row: Streak and Personal Bests */}
          <div className="challenges-top-row">
            <StreakCounter streak={mockStreak} />
            <div className="personal-bests-section">
              <h3><FaStar /> Récords Personales</h3>
              <div className="personal-bests-grid">
                {mockPersonalBests.map(pb => <PersonalBestCard key={pb.id} best={pb} />)}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="challenges-main-grid">

            {/* Column 1: Objectives & Suggestions */}
            <div className="challenges-column">
              <div className="challenges-section current-objectives">
                <h2><FaBullseye /> Objetivos Actuales</h2>
                {objectives.length > 0 ? (
                  objectives.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)
                ) : (
                  <p className="placeholder-text">No hay objetivos definidos. ¡Crea uno nuevo o acepta una sugerencia!</p>
                )}
              </div>

              <div className="challenges-section suggested-objectives">
                <h2><FaLightbulb /> Retos Sugeridos</h2>
                {suggestions.length > 0 ? (
                  suggestions.map(sug => <SuggestionCard key={sug.id} suggestion={sug} onAccept={handleAcceptSuggestion} />)
                ) : (
                  <p className="placeholder-text">¡Buen trabajo! No hay nuevas sugerencias por ahora.</p>
                )}
              </div>
            </div>

            {/* Column 2: Achievements & Visualizations */}
            <div className="challenges-column">
               <div className="challenges-section achievements">
                <h2><FaTrophy /> Logros</h2>
                <div className="achievements-list">
                  {mockAchievements.map(ach => <AchievementBadge key={ach.id} achievement={ach} />)}
                </div>
                <button className="view-all-btn">Ver todos <FaChevronRight /></button>
              </div>

              <div className="challenges-section visualizations">
                <h2><FaChartBar /> Visualizaciones</h2>
                <div className="chart-placeholder">
                  <FaChartLine /> Gráfica de Actividad Semanal (Placeholder)
                </div>
                <div className="chart-placeholder">
                  <FaChartPie /> Progreso Global por Asignatura (Placeholder)
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    export default Challenges;

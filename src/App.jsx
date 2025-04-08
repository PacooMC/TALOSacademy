import React, { useState, useEffect } from 'react'; // Added useEffect
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import DailyCoach from './components/DailyCoach';
import Dashboard from './components/Dashboard'; // Assuming Dashboard exists
import ContentProposal from './components/ContentProposal'; // Assuming ContentProposal exists
import GuidedStudy from './components/GuidedStudy'; // Import GuidedStudy
import CompetencyMap from './components/CompetencyMap';
import Exercises from './components/Exercises';
import PracticeMode from './components/PracticeMode'; // Import PracticeMode
import ExamsMode from './components/ExamsMode'; // Import ExamsMode
import Challenges from './components/Challenges'; // Import Challenges
import Settings from './components/Settings'; // Import Settings component
import './App.css';

// Import subject data and helpers
import { initialEnrolledSubjects, getSubjectById } from './data/subjects';
import { getSubjectData } from './data/allSubjectData';

function App() {
  const [screen, setScreen] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- Multi-Subject State ---
  const [enrolledSubjects, setEnrolledSubjects] = useState(initialEnrolledSubjects);
  // Default to the first enrolled subject or null
  const [currentSubjectId, setCurrentSubjectId] = useState(enrolledSubjects[0]?.id || null);
  const [currentSubjectData, setCurrentSubjectData] = useState(null);

  // Effect to load data when subject changes
  useEffect(() => {
    if (currentSubjectId) {
      console.log(`Loading data for subject: ${currentSubjectId}`);
      setCurrentSubjectData(getSubjectData(currentSubjectId));
    } else {
      setCurrentSubjectData(null); // Clear data if no subject selected
    }
  }, [currentSubjectId]); // Re-run when currentSubjectId changes

  const handleSubjectChange = (newSubjectId) => {
    if (newSubjectId !== currentSubjectId) {
      setCurrentSubjectId(newSubjectId);
      // Optionally navigate to home or dashboard on subject change
      setScreen('home');
    }
  };

  // --- Subject Management Functions (for Settings) ---
  const handleAddSubject = (subjectIdToAdd) => {
    // Simulate adding - in real app, check limits, update backend
    const subjectToAdd = getSubjectById(subjectIdToAdd);
    if (subjectToAdd && !enrolledSubjects.find(s => s.id === subjectIdToAdd)) {
      setEnrolledSubjects(prev => [...prev, subjectToAdd]);
      alert(`Asignatura "${subjectToAdd.name}" añadida.`);
      // Optionally switch to the newly added subject
      // setCurrentSubjectId(subjectIdToAdd);
    } else {
      alert('Error al añadir asignatura.');
    }
  };

  const handleRemoveSubject = (subjectIdToRemove) => {
    // Prevent removing the last subject (optional)
    if (enrolledSubjects.length <= 1) {
      alert('No puedes eliminar tu única asignatura.');
      return;
    }
    // Simulate removal
    const subjectToRemove = getSubjectById(subjectIdToRemove);
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${subjectToRemove?.name}"?`)) {
      setEnrolledSubjects(prev => prev.filter(s => s.id !== subjectIdToRemove));
      // If the removed subject was the current one, switch to the first remaining
      if (currentSubjectId === subjectIdToRemove) {
        const remainingSubjects = enrolledSubjects.filter(s => s.id !== subjectIdToRemove);
        setCurrentSubjectId(remainingSubjects[0]?.id || null);
      }
      alert(`Asignatura "${subjectToRemove?.name}" eliminada.`);
    }
  };
  // --- End Subject Management ---


  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderScreen = () => {
    // Pass subject data or ID to components that need it
    // Handle case where currentSubjectData might be loading or null
    if (!currentSubjectId && screen !== 'settings') {
        return (
            <div className="placeholder">
                Por favor, selecciona una asignatura en la cabecera o añade una en Configuración.
                <button onClick={() => setScreen('settings')} style={{marginTop: '15px', padding: '8px 15px'}}>Ir a Configuración</button>
            </div>
        );
    }
     if (!currentSubjectData && screen !== 'settings' && currentSubjectId) {
        return <div className="placeholder">Cargando datos de la asignatura...</div>; // Loading state
    }


    switch (screen) {
      case 'home':
        // Home might need subject context for map preview, etc.
        return <Home onNavigate={setScreen} subjectId={currentSubjectId} subjectData={currentSubjectData} />;
      case 'coach':
        // Pass specific data needed by DailyCoach
        return <DailyCoach isAppSidebarCollapsed={isSidebarCollapsed} subjectData={currentSubjectData?.dailySession} />;
      case 'dashboard':
        // Pass specific data needed by Dashboard
        return <Dashboard subjectId={currentSubjectId} subjectData={currentSubjectData} />;
      case 'proposal':
        return <ContentProposal />; // Needs subject context?
      case 'study':
        // Pass specific data needed by GuidedStudy
        return <GuidedStudy subjectData={currentSubjectData?.guidedStudy} />;
      case 'exams':
        return <ExamsMode />; // Needs subject context?
      case 'labs':
        return <PracticeMode />; // Needs subject context?
      case 'exercises':
        return <Exercises />; // Needs subject context?
      case 'map':
         // Pass specific data needed by CompetencyMap
        return <CompetencyMap subjectData={currentSubjectData} />;
      case 'settings':
        // Pass enrolled subjects and handlers to Settings
        return <Settings
                  enrolledSubjects={enrolledSubjects}
                  onAddSubject={handleAddSubject}
                  onRemoveSubject={handleRemoveSubject}
               />;
      case 'challenges':
        return <Challenges />; // Needs subject context?
      default:
        return <Home onNavigate={setScreen} subjectId={currentSubjectId} subjectData={currentSubjectData} />;
    }
  };

  return (
    <div className={`app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar onNavigate={setScreen} current={screen} isCollapsed={isSidebarCollapsed} />
      <div className="main-area">
        <Header
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          onNavigate={setScreen}
          // Pass subject state and handler to Header
          enrolledSubjects={enrolledSubjects}
          currentSubjectId={currentSubjectId}
          onSubjectChange={handleSubjectChange}
        />
        <div className="content-area">
          {renderScreen()}
        </div>
      </div>
    </div>
  )
}

export default App;

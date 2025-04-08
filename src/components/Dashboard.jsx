import React from 'react'
import TimeOptions from './TimeOptions'
import MoodTracker from './MoodTracker'
import TextInput from './TextInput'
import DailyObjective from './DailyObjective'
import PlanForToday from './PlanForToday'
import CompetencyMap from './CompetencyMap'
import './Dashboard.css'

function Dashboard() {
  const username = "Paco";
  
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="greeting">
          <h1>Hola, {username} <span role="img" aria-label="wave">👋</span></h1>
          <h2>¿Listo para tu sesión de hoy?</h2>
        </div>
        
        <div className="main-section">
          <div className="left-panel">
            <div className="card study-options">
              <h3>¿Cuánto tiempo tienes para estudiar hoy?</h3>
              <TimeOptions />
              
              <h3 className="mood-title">¿Cómo te sentiste ayer estudiando Algebra lineal?</h3>
              <MoodTracker />
              
              <h3 className="custom-input-title">También puedes decirme qué quieres trabajar hoy</h3>
              <TextInput />
            </div>
            
            <DailyObjective />
            
            <div className="plan-section">
              <h2>Plan para hoy</h2>
              <PlanForToday />
            </div>
          </div>
          
          <div className="right-panel">
            <h2>Mapa de competencias</h2>
            <CompetencyMap />
            
            <h2 className="plan-title">Plan para hoy</h2>
            <div className="right-plan-items">
              <div className="plan-item">
                <span className="notes-icon">≡</span>
                <div>
                  <h3>Apuntes generasdos</h3>
                  <p>Transformaciones lineales</p>
                </div>
              </div>
              
              <div className="plan-item">
                <span className="practice-icon">🧪</span>
                <h3>Práctica asóciada</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

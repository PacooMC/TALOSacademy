import React from 'react'
import './DailyObjective.css'

function DailyObjective() {
  return (
    <div className="daily-objective">
      <div className="date-icon">
        <div className="month">ENE</div>
        <div className="day">06</div>
      </div>
      <div className="objective-content">
        <h3>Objetivo del día</h3>
        <p>Entender transformaciones lineales</p>
      </div>
    </div>
  )
}

export default DailyObjective

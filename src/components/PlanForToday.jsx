import React from 'react'
import './PlanForToday.css'

function PlanForToday() {
  return (
    <div className="plan-items">
      <div className="plan-item">
        <div className="plan-item-icon notes">≡</div>
        <div className="plan-item-text">Apuntes generados</div>
      </div>
      <div className="plan-item">
        <div className="plan-item-icon test">✓</div>
        <div className="plan-item-text">Minitest</div>
      </div>
    </div>
  )
}

export default PlanForToday

import React, { useState } from 'react'
import './ContentProposal.css'

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="section">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <span>{open ? '▾' : '▸'}</span> {title}
      </div>
      {open && <div className="section-content">{children}</div>}
    </div>
  )
}

function ContentProposal() {
  return (
    <div className="proposal-container">
      <div className="proposal-header">
        <h2>📚 Propuesta personalizada</h2>
        <p>Te sugerimos estudiar: <strong>Transformada de Fourier</strong></p>
        <p>🎯 Objetivo: Comprender el análisis en frecuencia</p>
        <div className="proposal-actions">
          <button className="accept-btn">Aceptar propuesta</button>
          <button className="choose-btn">Elegir manualmente</button>
        </div>
      </div>

      <div className="content-preview">
        <CollapsibleSection title="Introducción">
          <p>La transformada de Fourier permite analizar señales en el dominio de la frecuencia...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Desarrollo teórico">
          <p>Matemáticamente, la transformada se define como...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Ejemplo paso a paso">
          <p>Sea la señal f(t) = sin(2πt)...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Aplicación práctica">
          <p>Utilizando la función fft() podemos obtener...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Ejercicios">
          <ul>
            <li>¿Qué representa la transformada de Fourier?</li>
            <li>¿Cuál es la relación con la serie de Fourier?</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Resumen final">
          <p>La transformada de Fourier es fundamental para...</p>
        </CollapsibleSection>
      </div>

      <div className="export-section">
        <button>Exportar contenido ▾</button>
      </div>
    </div>
  )
}

export default ContentProposal

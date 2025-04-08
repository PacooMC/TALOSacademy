import React from 'react';
import './NodeActions.css';
// Added FaUndo
import { FaCheckCircle, FaQuestionCircle, FaPlusCircle, FaMapMarkedAlt, FaUndo } from 'react-icons/fa';

// Added status and onUpdateStatus props
function NodeActions({ nodeId, status, onUpdateStatus, onNeedHelpClick }) {

  // Call the update function passed from parent
  const handleMarkComplete = () => {
    if (onUpdateStatus) {
      onUpdateStatus(nodeId, 'completed'); // Update status to completed
      alert(`Nodo ${nodeId} marcado como completado.`); // Keep alert for simulation
    }
  };

  // Function to mark as pending again
  const handleMarkPending = () => {
    if (onUpdateStatus) {
      onUpdateStatus(nodeId, 'pending'); // Update status to pending
      alert(`Nodo ${nodeId} marcado como pendiente.`);
    }
  };

  const handleAddExercise = () => alert(`Añadir ejercicio extra para Nodo ${nodeId} (no implementado)`);
  const handleViewOnMap = () => alert(`Ver Nodo ${nodeId} en mapa (no implementado)`);

  const handleHelpClick = () => {
    if (onNeedHelpClick) {
      onNeedHelpClick();
    } else {
      console.warn("onNeedHelpClick prop not provided to NodeActions");
    }
  };

  return (
    <div className="node-actions">
      {/* Conditionally render Mark Complete / Mark Pending button */}
      {status === 'pending' ? (
        <button onClick={handleMarkComplete} title="Marcar como completado" className="action-complete">
          <FaCheckCircle /> Marcar como Completado
        </button>
      ) : (
        <button onClick={handleMarkPending} title="Marcar como pendiente" className="action-pending">
          <FaUndo /> Marcar como Pendiente
        </button>
      )}
      <button onClick={handleHelpClick} title="Pedir explicación alternativa o ayuda"><FaQuestionCircle /> Algo no me queda claro</button>
      <button onClick={handleAddExercise} title="Añadir ejercicio extra"><FaPlusCircle /> Añadir Ejercicio</button>
      <button onClick={handleViewOnMap} title="Ver en mapa"><FaMapMarkedAlt /> Ver en Mapa</button>
    </div>
  );
}

export default NodeActions;

import React from 'react';
import './NodeNavigator.css';
// Added FaCheckCircle
import { FaBook, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

// Added isCollapsed and onToggleCollapse props
function NodeNavigator({ nodes, activeNodeId, onNavClick, isCollapsed, onToggleCollapse }) {
  return (
    <nav className={`node-navigator ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="navigator-header">
        {!isCollapsed && <h4>Contenido de Hoy</h4>}
        <button
          onClick={onToggleCollapse}
          className="navigator-toggle-btn"
          title={isCollapsed ? "Expandir índice" : "Contraer índice"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <ul className="navigator-list">
        {nodes.map((node, index) => (
          // Add status class to li
          <li key={node.id} className={`${node.id === activeNodeId ? 'active' : ''} ${node.status === 'completed' ? 'status-completed' : ''}`}>
            <button onClick={() => onNavClick(node.id)} title={isCollapsed ? `${index + 1}. ${node.title}` : node.title}>
              {isCollapsed ? (
                // Show checkmark or index when collapsed
                node.status === 'completed' ? <FaCheckCircle className="nav-status-icon completed" /> : <span className="nav-index">{index + 1}</span>
              ) : (
                // Show checkmark or book icon when expanded
                node.status === 'completed' ? <FaCheckCircle className="nav-status-icon completed" /> : <FaBook className="nav-icon" />
              )}
              {!isCollapsed && <span className="nav-text">{node.title}</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NodeNavigator;

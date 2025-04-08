import React, { useState, useRef, useEffect } from 'react';
import './DailyCoach.css';
// Removed direct import of dailySessionData
// import { dailySessionData as initialData } from '../data/dailySessionData';
import SessionHeader from './SessionHeader';
import NodeNavigator from './NodeNavigator';
import KnowledgeNodeCard from './KnowledgeNodeCard';

// Accept subjectData as a prop
function DailyCoach({ isAppSidebarCollapsed, subjectData }) {
  const [nodes, setNodes] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [isNavigatorCollapsed, setIsNavigatorCollapsed] = useState(false);
  const contentAreaRef = useRef(null);
  const [sessionContext, setSessionContext] = useState(null); // State for context

  // Update state when subjectData prop changes
  useEffect(() => {
    if (subjectData) {
      const initialNodes = subjectData.nodes || [];
      setNodes(initialNodes);
      setSessionContext(subjectData.context || null); // Set context
      // Reset active node if it's no longer valid or select the first pending
      const firstPendingNode = initialNodes.find(n => n.status === 'pending');
      const currentActiveIsValid = initialNodes.some(n => n.id === activeNodeId);
      if (!currentActiveIsValid || !activeNodeId) {
          setActiveNodeId(firstPendingNode?.id || initialNodes[0]?.id || null);
      }
    } else {
      // Clear state if subjectData is null
      setNodes([]);
      setActiveNodeId(null);
      setSessionContext(null);
    }
    // Reset navigator collapse state on subject change? Optional.
    // setIsNavigatorCollapsed(false);
  }, [subjectData]); // Depend on subjectData

  const handleNavClick = (nodeId) => {
    setActiveNodeId(nodeId);
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleNavigatorCollapse = () => {
    setIsNavigatorCollapsed(!isNavigatorCollapsed);
  };

  // Function to update node status (remains the same logic)
  const updateNodeStatus = (nodeId, newStatus) => {
    setNodes(currentNodes => {
        const updatedNodes = currentNodes.map(node =>
            node.id === nodeId ? { ...node, status: newStatus } : node
        );
        // Optional: Auto-navigate to next pending node
        if (newStatus === 'completed') {
            const currentIndex = updatedNodes.findIndex(node => node.id === nodeId);
            const nextPendingNode = updatedNodes.find((node, index) => index > currentIndex && node.status === 'pending');
            if (nextPendingNode) {
                setActiveNodeId(nextPendingNode.id);
                if (contentAreaRef.current) {
                    contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }
        return updatedNodes;
    });
    // TODO: Persist this change (e.g., API call)
  };

  const activeNodeData = nodes.find(node => node.id === activeNodeId);

  // Handle loading or no data state
  if (!subjectData) {
      return <div className="placeholder">Cargando datos del Tutor Diario...</div>;
  }
  if (!sessionContext || nodes.length === 0) {
      return <div className="placeholder">No hay sesión de Tutor Diario disponible para esta asignatura.</div>;
  }

  return (
    <div className={`daily-coach-container ${isNavigatorCollapsed ? 'navigator-collapsed' : ''}`}>
      <NodeNavigator
        nodes={nodes}
        activeNodeId={activeNodeId}
        onNavClick={handleNavClick}
        isCollapsed={isNavigatorCollapsed}
        onToggleCollapse={toggleNavigatorCollapse}
      />
      <div className="daily-coach-content" ref={contentAreaRef}>
        {/* Pass sessionContext from state */}
        <SessionHeader context={sessionContext} />
        {activeNodeData ? (
          <div className="knowledge-node-wrapper">
            <KnowledgeNodeCard
              nodeData={activeNodeData}
              onUpdateStatus={updateNodeStatus}
            />
          </div>
        ) : (
          <div className="placeholder">Selecciona un nodo del menú para empezar.</div>
        )}
      </div>
    </div>
  );
}

export default DailyCoach;

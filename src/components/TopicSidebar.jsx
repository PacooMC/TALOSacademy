import React from 'react';
import './TopicSidebar.css';
// Added FaCheckCircle
import { FaFolder, FaFolderOpen, FaFileAlt, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

function TopicSidebar({ topics, selectedId, onSelect, isCollapsed, onToggleCollapse }) {

  return (
    <nav className={`topic-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="topic-sidebar-header">
        {!isCollapsed && <h4>Temario</h4>}
        <button
          onClick={onToggleCollapse}
          className="topic-sidebar-toggle-btn"
          title={isCollapsed ? "Expandir temario" : "Contraer temario"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <ul className="topic-list">
        {topics.map(topic => (
          <li key={topic.id} className="topic-item">
            <div className="topic-title">
              <FaFolderOpen className="topic-icon" />
              {!isCollapsed && <span>{topic.title}</span>}
            </div>
            {!isCollapsed && topic.subtopics && (
              <ul className="subtopic-list">
                {topic.subtopics.map(subtopic => (
                  // Add status class to li
                  <li
                    key={subtopic.id}
                    className={`subtopic-item ${subtopic.id === selectedId ? 'active' : ''} ${subtopic.status === 'completed' ? 'status-completed' : ''}`}
                    onClick={() => onSelect(subtopic.id)}
                  >
                    {/* Show checkmark or file icon */}
                    {subtopic.status === 'completed' ? (
                      <FaCheckCircle className="subtopic-status-icon completed" />
                    ) : (
                      <FaFileAlt className="subtopic-icon" />
                    )}
                    <span>{subtopic.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TopicSidebar;

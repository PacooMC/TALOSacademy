import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { FaBars, FaAngleLeft, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import SubjectSelector from './SubjectSelector'; // Import the new component

// Added subject props: enrolledSubjects, currentSubjectId, onSubjectChange
function Header({
  onToggleSidebar,
  isSidebarCollapsed,
  onNavigate,
  enrolledSubjects,
  currentSubjectId,
  onSubjectChange
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    alert("Simulación: Cerrar sesión");
    setIsDropdownOpen(false);
  };

  const handleNavigateToSettings = () => {
    onNavigate('settings');
    setIsDropdownOpen(false);
  };

  return (
    <div className="header">
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle-btn"
          title={isSidebarCollapsed ? "Expandir menú principal" : "Contraer menú principal"}
        >
          {isSidebarCollapsed ? <FaBars /> : <FaAngleLeft />}
        </button>
        {/* Add the Subject Selector */}
        <SubjectSelector
          enrolledSubjects={enrolledSubjects}
          currentSubjectId={currentSubjectId}
          onSubjectChange={onSubjectChange}
        />
      </div>

      <div className="user-menu-container" ref={dropdownRef}>
        <button
          className="user-menu-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <FaUserCircle className="user-avatar-icon" />
          <span className="user-name">Paco</span>
        </button>

        {isDropdownOpen && (
          <div className="user-dropdown" role="menu">
            <div className="dropdown-header">
              Conectado como <strong>Paco</strong>
            </div>
            <button className="dropdown-item" role="menuitem" onClick={handleNavigateToSettings}>
              <FaCog /> Configuración
            </button>
            <button className="dropdown-item" role="menuitem" onClick={handleLogout}>
              <FaSignOutAlt /> Salir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;

import React from 'react'
import './Sidebar.css'
// Icons remain the same
import { FaHome, FaBook, FaChalkboardTeacher, FaMap, FaChartLine, FaFlask, FaFilePdf, FaPencilAlt, FaCog, FaTrophy } from 'react-icons/fa'
// Removed logo import: import logo from '/images/logo-talos.svg'

function Sidebar({ onNavigate, current, isCollapsed }) {
  // Reordered menu items array
  const menuItems = [
    { key: 'home', icon: FaHome, label: 'Inicio' },
    { key: 'coach', icon: FaChalkboardTeacher, label: 'Tutor Diario' },
    { key: 'study', icon: FaChartLine, label: 'Estudio Guiado' },
    // New Order: Ejercicios, Prácticas, Exámenes
    { key: 'exercises', icon: FaPencilAlt, label: 'Ejercicios' },
    { key: 'labs', icon: FaFlask, label: 'Prácticas' },
    { key: 'exams', icon: FaFilePdf, label: 'Exámenes' },
    // Remaining items
    { key: 'map', icon: FaMap, label: 'Mapa' },
    { key: 'challenges', icon: FaTrophy, label: 'Retos' },
  ];

  const settingsItem = { key: 'settings', icon: FaCog, label: 'Configuración' };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-container"> {/* Changed div class */}
        {/* Removed logo image tag */}
        {/* <img
          src={logo}
          alt="Talos Logo"
          className={`sidebar-logo ${isCollapsed ? 'collapsed' : ''}`}
        /> */}
        {/* Optionally keep text if needed, but logo might replace it */}
        {!isCollapsed && <span className="logo-text">TALOS</span>} {/* Added fallback text */}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div
            key={item.key}
            className={`sidebar-item ${current === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon className="sidebar-icon" />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
       <div className="sidebar-footer">
         <div
           key={settingsItem.key}
           className={`sidebar-item ${current === settingsItem.key ? 'active' : ''}`}
           onClick={() => onNavigate(settingsItem.key)}
           title={isCollapsed ? settingsItem.label : ''}
         >
           <settingsItem.icon className="sidebar-icon" />
           {!isCollapsed && <span>{settingsItem.label}</span>}
         </div>
       </div>
    </div>
  )
}

export default Sidebar

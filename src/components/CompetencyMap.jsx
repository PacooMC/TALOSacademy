import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
    import './CompetencyMap.css';
    // Removed direct import of competencies data
    // import { competencies as nodesData, edges as edgesData, topics as topicDefinitions } from '../data/competencies';
    import { FaSearch, FaPlus, FaMinus, FaRoute, FaTable, FaProjectDiagram, FaCheckCircle, FaRegCircle, FaExclamationTriangle, FaHourglassHalf, FaTimes, FaBookOpen, FaCheck, FaVial } from 'react-icons/fa';

    const MIN_SCALE = 0.3;
    const MAX_SCALE = 2.5;

    // Accept subjectData as a prop
    function CompetencyMap({ subjectData }) {
      const [selected, setSelected] = useState(null);
      const [filter, setFilter] = useState('all');
      const [tableView, setTableView] = useState(false);
      const [highlightPath, setHighlightPath] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');

      // State for pan and zoom
      const [scale, setScale] = useState(1);
      const [offset, setOffset] = useState({ x: 0, y: 0 });
      const [isPanning, setIsPanning] = useState(false);
      const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
      const svgRef = useRef(null);

      // --- Extract data from subjectData prop ---
      const nodesData = useMemo(() => subjectData?.competencies || [], [subjectData]);
      const edgesData = useMemo(() => subjectData?.edges || [], [subjectData]);
      const topicDefinitions = useMemo(() => subjectData?.topics || {}, [subjectData]);

      // Reset view and selection when subjectData changes
      useEffect(() => {
          setSelected(null);
          setFilter('all');
          setTableView(false);
          setHighlightPath(false);
          setSearchTerm('');
          setScale(1);
          setOffset({ x: 0, y: 0 }); // Reset pan/zoom
      }, [subjectData]);


      // --- Node dimensions and constants ---
      const nodeWidth = 180;
      const nodeHeight = 130;
      const headerHeight = 38;
      const bulletOffsetY = 22;
      const bulletLineHeight = 17;
      const iconSize = 16;
      const topicLabelOffsetY = 25; // Keep this relative to the top edge of the rect
      const topicLabelMarginY = 15; // Space between label and top edge of rect
      const topicRectPadding = 8; // *** REDUCED PADDING VALUE ***

      // Filter nodes based on UI controls
      const filteredNodes = useMemo(() => nodesData.filter(node => {
        const stateMatch = filter === 'all' || node.state === filter;
        const searchMatch = searchTerm === '' || node.title.toLowerCase().includes(searchTerm.toLowerCase());
        return stateMatch && searchMatch;
        // Depend on nodesData derived from props
      }), [filter, searchTerm, nodesData]);

      const visibleNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);
      // Depend on edgesData derived from props
      const filteredEdges = useMemo(() => edgesData.filter(edge => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)), [visibleNodeIds, edgesData]);

      // Group nodes by topic and calculate bounding boxes (tight fit + padding)
      const topicGroups = useMemo(() => {
        const groups = {};
        filteredNodes.forEach(node => {
          if (!node.topic) return;
          if (!groups[node.topic]) {
            groups[node.topic] = {
              nodes: [],
              minX: node.x, maxX: node.x, minY: node.y, maxY: node.y
            };
          }
          groups[node.topic].nodes.push(node);
          groups[node.topic].minX = Math.min(groups[node.topic].minX, node.x);
          groups[node.topic].maxX = Math.max(groups[node.topic].maxX, node.x);
          groups[node.topic].minY = Math.min(groups[node.topic].minY, node.y);
          groups[node.topic].maxY = Math.max(groups[node.topic].maxY, node.y);
        });

        Object.keys(groups).forEach(topicId => {
          const group = groups[topicId];
          // Calculate base rectangle including nodes
          const baseRectX = group.minX - nodeWidth / 2;
          const baseRectY = group.minY - nodeHeight / 2;
          const baseRectWidth = (group.maxX - group.minX) + nodeWidth;
          const baseRectHeight = (group.maxY - group.minY) + nodeHeight;

          // Apply padding
          group.rectX = baseRectX - topicRectPadding;
          group.rectY = baseRectY - topicRectPadding - topicLabelOffsetY; // Adjust Y for label space + padding
          group.rectWidth = baseRectWidth + (topicRectPadding * 2);
          group.rectHeight = baseRectHeight + (topicRectPadding * 2) + topicLabelOffsetY; // Add space for label + padding

          // Position label above the padded rectangle
          group.labelX = group.rectX + 15; // Keep label indented from the left edge
          group.labelY = group.rectY + topicLabelOffsetY - topicLabelMarginY; // Position label relative to the new top edge

          // Depend on topicDefinitions derived from props
          group.topicInfo = topicDefinitions[topicId] || { name: `Tema ${topicId}`, color: 'rgba(230, 230, 230, 0.7)' };
        });
        return groups;
        // Depend on filteredNodes, topicDefinitions, and padding/layout constants
      }, [filteredNodes, nodeWidth, nodeHeight, topicLabelOffsetY, topicLabelMarginY, topicRectPadding, topicDefinitions]);


      // --- Pan and Zoom Handlers (remain the same) ---
      const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.node-group') || e.target.closest('button, a, select, input')) return;
        e.preventDefault();
        setIsPanning(true);
        setStartDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      }, [offset.x, offset.y]);

      const handleMouseMove = useCallback((e) => {
        if (!isPanning) return;
        e.preventDefault();
        setOffset({
          x: e.clientX - startDrag.x,
          y: e.clientY - startDrag.y,
        });
      }, [isPanning, startDrag.x, startDrag.y]);

      const handleMouseUp = useCallback(() => {
        setIsPanning(false);
      }, []);

      const handleMouseLeave = useCallback(() => {
        setIsPanning(false);
      }, []);

      const zoom = useCallback((direction) => {
        const factor = direction === 'in' ? 1.2 : 1 / 1.2;
        const newScale = Math.min(Math.max(scale * factor, MIN_SCALE), MAX_SCALE);
        if (newScale === scale) return;
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return;
        const centerX = svgRect.width / 2;
        const centerY = svgRect.height / 2;
        const pointX = (centerX - offset.x) / scale;
        const pointY = (centerY - offset.y) / scale;
        const newOffsetX = centerX - pointX * newScale;
        const newOffsetY = centerY - pointY * newScale;
        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
      }, [scale, offset.x, offset.y]);

      const zoomIn = useCallback(() => zoom('in'), [zoom]);
      const zoomOut = useCallback(() => zoom('out'), [zoom]);
      // --- End Pan and Zoom Handlers ---

      // --- Node Click Handler (remains the same) ---
      const handleNodeClick = useCallback((node) => {
        if (selected?.id === node.id) {
          setSelected(null);
        } else {
          setSelected(node);
        }
      }, [selected]);
      // --- End Node Click Handler ---

      const getStateIcon = (state, size = iconSize) => {
        const style = { fontSize: `${size}px` };
        switch (state) {
          case 'done': return <FaCheckCircle style={style} className="status-icon done" />;
          case 'progress': return <FaHourglassHalf style={style} className="status-icon progress" />;
          case 'lag': return <FaExclamationTriangle style={style} className="status-icon lag" />;
          case 'none': return <FaRegCircle style={style} className="status-icon none" />;
          default: return null;
        }
      };

      // Handle case where subjectData is not yet loaded
      if (!subjectData) {
          return <div className="placeholder">Cargando datos del mapa de competencias...</div>;
      }
      // Handle case where subjectData is loaded but has no nodes
      if (nodesData.length === 0) {
          return <div className="placeholder">No hay datos de mapa de competencias para esta asignatura.</div>;
      }


      return (
        <div className="competency-container">
          {/* Toolbar */}
          <div className="toolbar">
            <select value={filter} onChange={e => setFilter(e.target.value)} title="Filtrar por estado">
              <option value="all">Todos</option>
              <option value="none">No empezado</option>
              <option value="progress">En progreso</option>
              <option value="done">Dominado</option>
              <option value="lag">Laguna</option>
            </select>
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar competencia..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="toolbar-group">
              <button title="Acercar" onClick={zoomIn}><FaPlus /></button>
              <button title="Alejar" onClick={zoomOut}><FaMinus /></button>
            </div>
            <button title="Resaltar Ruta" onClick={() => setHighlightPath(!highlightPath)} className={highlightPath ? 'active' : ''}>
              <FaRoute />
            </button>
            <button title={tableView ? 'Vista Mapa' : 'Vista Tabla'} onClick={() => setTableView(!tableView)}>
              {tableView ? <FaProjectDiagram /> : <FaTable />}
            </button>
          </div>

          {/* Map or Table View */}
          {tableView ? (
            <div className="table-view">
              <table>
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Nombre</th>
                    <th>Nivel</th>
                    <th>Tipo</th>
                    <th>Tema</th>
                    <th>Última vez</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNodes.map(node => (
                    <tr key={node.id} onClick={() => handleNodeClick(node)}>
                      <td>{getStateIcon(node.state, 16)}</td>
                      <td>{node.title}</td>
                      <td>{node.level}</td>
                      <td>{node.type}</td>
                      <td>{node.topic ? (topicDefinitions[node.topic]?.name || node.topic) : '-'}</td>
                      <td>{node.last || 'Nunca'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className={`map-area ${isPanning ? 'panning' : ''}`}
              ref={svgRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <svg className="map-svg" viewBox="0 0 1200 900"> {/* Adjust viewBox if needed */}
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#a0aec0" />
                  </marker>
                  <linearGradient id="headerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#f8fafc', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#f1f5f9', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
                  {/* Topic Groups */}
                  {Object.entries(topicGroups).map(([topicId, group]) => (
                    <g key={`topic-group-${topicId}`} className="topic-group">
                      <rect
                        x={group.rectX} y={group.rectY}
                        width={group.rectWidth} height={group.rectHeight}
                        rx="15" ry="15" fill={group.topicInfo.color}
                        className="topic-group-rect"
                      />
                      <text x={group.labelX} y={group.labelY} className="topic-group-label">
                        {`${topicId}: ${group.topicInfo.name}`}
                      </text>
                    </g>
                  ))}

                  {/* Edges */}
                  {filteredEdges.map((edge, idx) => {
                    // Use nodesData derived from props
                    const fromNode = nodesData.find(n => n.id === edge.from);
                    const toNode = nodesData.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    const startY = fromNode.y + nodeHeight / 2;
                    const endY = toNode.y - nodeHeight / 2;
                    const startX = fromNode.x;
                    const endX = toNode.x;
                    return (
                      <line
                        key={`edge-${idx}`}
                        x1={startX} y1={startY} x2={endX} y2={endY}
                        className={`edge ${edge.type} ${highlightPath ? 'highlight' : ''}`}
                        markerEnd="url(#arrow)"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {filteredNodes.map(node => (
                    <g
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      className={`node-group ${selected?.id === node.id ? 'selected' : ''}`}
                    >
                      <rect
                        x={node.x - nodeWidth / 2} y={node.y - nodeHeight / 2}
                        width={nodeWidth} height={nodeHeight}
                        className={`node node-state-${node.state}`}
                      />
                      <rect
                        x={node.x - nodeWidth / 2} y={node.y - nodeHeight / 2}
                        width={nodeWidth} height={headerHeight}
                        className="node-header"
                      />
                      <foreignObject
                        x={node.x - nodeWidth / 2 + 12} y={node.y - nodeHeight / 2 + (headerHeight - iconSize) / 2}
                        width={iconSize} height={iconSize}>
                        <div className="icon-container">{getStateIcon(node.state)}</div>
                      </foreignObject>
                      <text
                        x={node.x - nodeWidth / 2 + 12 + iconSize + 10} y={node.y - nodeHeight / 2 + headerHeight / 2 + 6}
                        textAnchor="start" className="node-title">
                        {node.title}
                      </text>
                      {node.bullets.slice(0, 3).map((bullet, idx) => (
                        <text
                          key={idx}
                          x={node.x - nodeWidth / 2 + 18} y={node.y - nodeHeight / 2 + headerHeight + bulletOffsetY + idx * bulletLineHeight}
                          textAnchor="start" className="node-bullet">
                          • {bullet}
                        </text>
                      ))}
                    </g>
                  ))}
                </g>
              </svg>
            </div>
          )}

          {/* Side Panel */}
          <div className={`side-panel ${selected ? 'open' : ''}`}>
            {selected && (
              <>
                <button className="side-panel-close-btn" onClick={() => setSelected(null)} title="Cerrar">
                  <FaTimes />
                </button>
                <div className="side-panel-header">
                  {getStateIcon(selected.state, 24)}
                  <h3>{selected.title}</h3>
                </div>
                <div className="side-panel-content">
                  <div className="side-panel-section side-panel-details">
                    <h4>Detalles</h4>
                    <div className="detail-item"><span className="detail-label">Nivel:</span><span className="detail-value">{selected.level}</span></div>
                    <div className="detail-item"><span className="detail-label">Tipo:</span><span className="detail-value">{selected.type}</span></div>
                    <div className="detail-item"><span className="detail-label">Tema:</span><span className="detail-value">{selected.topic ? (`${selected.topic}: ${topicDefinitions[selected.topic]?.name || ''}`) : '-'}</span></div>
                    <div className="detail-item"><span className="detail-label">Última vez:</span><span className="detail-value">{selected.last || 'Nunca'}</span></div>
                  </div>
                  <div className="side-panel-section">
                    <h4>Subtemas Clave</h4>
                    <ul className="subtopic-list">
                      {selected.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="side-panel-footer">
                  <button className="action-button primary"><FaBookOpen /> Repasar Contenido</button>
                  <button className="action-button secondary"><FaCheck /> Marcar como Dominada</button>
                  <button className="action-button secondary"><FaVial /> Generar Test Rápido</button>
                </div>
              </>
            )}
          </div>
        </div>
      ); // Added missing closing parenthesis here
    }

    export default CompetencyMap;

import React, { useState, useCallback } from 'react';
import './PracticeMode.css';
import {
  FaFileUpload, FaFilePdf, FaFileWord, FaFileImage, FaFileCsv, FaFileCode,
  FaBrain, FaEdit, FaSyncAlt, FaDownload, FaCommentDots, FaGraduationCap,
  FaBullseye, FaTools, FaTable, FaQuestionCircle, FaCheckCircle, FaFileAlt,
  FaExclamationTriangle, FaTimes, FaSpinner, FaCheck, FaMarkdown // Added FaSpinner, FaCheck, FaMarkdown
} from 'react-icons/fa';

// Helper to get file icon (remains the same)
const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  if (extension === 'pdf') return <FaFilePdf />;
  if (['doc', 'docx'].includes(extension)) return <FaFileWord />;
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(extension)) return <FaFileImage />;
  if (extension === 'csv') return <FaFileCsv />;
  if (['m', 'py', 'js', 'cpp', 'c', 'java'].includes(extension)) return <FaFileCode />;
  return <FaFileAlt />; // Default icon
};

// Mock structure derived after processing guion
const mockDetectedStructure = [
  { id: 'ej1', type: 'exercise', title: 'Ejercicio 1' },
  { id: 'ej1.1', type: 'section', title: 'Apartado 1.1', parent: 'ej1' },
  { id: 'ej1.2', type: 'section', title: 'Apartado 1.2', parent: 'ej1' },
  { id: 'ej2', type: 'exercise', title: 'Ejercicio 2' },
  { id: 'ej2.1', type: 'section', title: 'Apartado 2.1', parent: 'ej2' },
];

// --- Modal Component for Analysis Results ---
function AnalysisResultsModal({ isOpen, onClose, analysisContent }) {
  if (!isOpen) return null;
  return (
    <div className="analysis-modal-overlay" onClick={onClose}>
      <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
        <button className="analysis-modal-close-btn" onClick={onClose} title="Cerrar"><FaTimes /></button>
        <h3><FaBrain /> Análisis de Resultados (IA)</h3>
        <div className="analysis-modal-content">
          {analysisContent ? (
            // Render Markdown or formatted HTML here
            <pre>{analysisContent}</pre> // Simple pre for now
          ) : (
            <p>No se ha generado ningún análisis aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
// --- End Modal Component ---

function PracticeMode() {
  const [guionFile, setGuionFile] = useState(null);
  const [isProcessingGuion, setIsProcessingGuion] = useState(false);
  const [structure, setStructure] = useState([]); // Detected structure [{id, type, title, parent?}]
  const [sectionData, setSectionData] = useState({}); // { sectionId: { images: [], results: [], analysis: '' } }
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGuionUpload = (files) => {
    if (files.length > 0) {
      setGuionFile(files[0]);
      setStructure([]); // Reset structure
      setSectionData({}); // Reset section data
      setAnalysisResults(null);
      setFinalReport(null);
      // Simulate processing
      setIsProcessingGuion(true);
      setTimeout(() => {
        setStructure(mockDetectedStructure);
        setIsProcessingGuion(false);
      }, 1500);
    }
  };

  const handleGuionFileChange = (event) => {
    handleGuionUpload(Array.from(event.target.files));
  };

  const handleGuionDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    handleGuionUpload(Array.from(event.dataTransfer.files));
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleSectionFileChange = (sectionId, fileType, event) => {
    const files = Array.from(event.target.files);
    setSectionData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fileType]: [...(prev[sectionId]?.[fileType] || []), ...files]
      }
    }));
  };

  const handleAnalysisChange = (sectionId, event) => {
    const text = event.target.value;
    setSectionData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        analysis: text
      }
    }));
  };

  const removeSectionFile = (sectionId, fileType, fileName) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fileType]: prev[sectionId]?.[fileType]?.filter(f => f.name !== fileName) || []
      }
    }));
  };

  const handleAnalyzeResults = () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    console.log("Simulating AI Analysis with data:", sectionData);
    // Simulate API call
    setTimeout(() => {
      // Mock analysis generation based on sectionData
      let mockAnalysis = "Análisis General:\n\n";
      structure.filter(s => s.type === 'section').forEach(section => {
        mockAnalysis += `Apartado ${section.title}:\n`;
        const data = sectionData[section.id] || {};
        mockAnalysis += `  - Imágenes: ${data.images?.length || 0}\n`;
        mockAnalysis += `  - Resultados: ${data.results?.length || 0}\n`;
        mockAnalysis += `  - Análisis Usuario: ${data.analysis ? 'Sí' : 'No'}\n`;
        // Add more sophisticated mock analysis here
        if (data.results?.length > 0) {
          mockAnalysis += `  - Comentario IA: Los resultados de ${data.results[0].name} parecen consistentes.\n`;
        }
        if (data.analysis) {
           mockAnalysis += `  - Comentario IA: El análisis proporcionado es claro.\n`;
        }
         mockAnalysis += `\n`;
      });
      setAnalysisResults(mockAnalysis);
      setIsAnalyzing(false);
      setShowAnalysisModal(true); // Show modal after analysis
    }, 2000);
  };

  const handleGenerateReport = () => {
     setIsGeneratingReport(true);
     setFinalReport(null);
     console.log("Generating Report with data:", sectionData);
     // Simulate report generation
     setTimeout(() => {
        // Use guionFile.name for the main title if available
        let report = `Memoria de Práctica: ${guionFile?.name || 'Práctica'}\n`;
        report += "========================================\n\n"; // Separator for title

        structure.forEach(item => {
            // Use item.title directly without Markdown prefixes
            if (item.type === 'exercise') {
                report += `${item.title}\n`; // Exercise Title
                report += "---------------------\n\n"; // Separator for exercise
            } else if (item.type === 'section') {
                report += `${item.title}\n\n`; // Section Title

                const data = sectionData[item.id] || {};
                if (data.analysis) {
                    report += `**Análisis del Usuario:**\n${data.analysis}\n\n`;
                }
                if (data.images?.length > 0) {
                    report += `**Imágenes:**\n`;
                    data.images.forEach(img => report += `- ${img.name}\n`);
                    report += `\n`;
                }
                 if (data.results?.length > 0) {
                    report += `**Resultados:**\n`;
                    data.results.forEach(res => report += `- ${res.name}\n`);
                    report += `\n`;
                }
                // Include AI analysis snippet if available
                if (analysisResults) {
                   // Basic extraction for demo
                   const sectionAnalysisMatch = analysisResults.match(new RegExp(`Apartado ${item.title}:([\\s\\S]*?)\n\n`));
                   if (sectionAnalysisMatch && sectionAnalysisMatch[1]) {
                       report += `**Comentarios IA:**\n${sectionAnalysisMatch[1].trim().replace(/(\n\s\s- )/g, '\n- ')}\n\n`;
                   }
                }
                report += `\n---\n\n`; // Separator between sections
            }
        });
        setFinalReport(report);
        setIsGeneratingReport(false);
     }, 2000);
  };


  return (
    <div className="practice-mode-container">
      <h1>🧪 Prácticas Asistidas (Nuevo Flujo)</h1>

      {/* Step 1: Upload Guion */}
      <div className="practice-step upload-guion-step">
        <h2>1. Sube el Guion de la Práctica</h2>
        {!guionFile && !isProcessingGuion && (
          <div
            className="upload-drop-zone"
            onDrop={handleGuionDrop}
            onDragOver={handleDragOver}
          >
            <FaFileUpload className="upload-icon" />
            <p>Arrastra aquí el archivo principal (PDF, DOCX...)</p>
            <p>o</p>
            <input
              type="file"
              id="guion-upload-input"
              accept=".pdf,.doc,.docx,.txt,image/*" // Adjust accepted types
              onChange={handleGuionFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="guion-upload-input" className="upload-button">
              Selecciona el Guion
            </label>
          </div>
        )}
        {isProcessingGuion && (
          <div className="processing-indicator">
            <FaSpinner className="spinner-icon" /> Procesando guion...
          </div>
        )}
        {guionFile && !isProcessingGuion && (
          <div className="guion-uploaded-info">
            <FaCheck className="check-icon" /> Guion cargado: <strong>{guionFile.name}</strong>
            <button onClick={() => { setGuionFile(null); setStructure([]); setSectionData({}); setAnalysisResults(null); setFinalReport(null); }} className="change-guion-btn">Cambiar Guion</button>
          </div>
        )}
      </div>

      {/* Step 2: Guided Uploads per Section */}
      {structure.length > 0 && (
        <div className="practice-step guided-upload-step">
          <h2>2. Carga Materiales por Apartado</h2>
          <div className="structure-display">
            {structure.map(item => {
              if (item.type === 'exercise') {
                // Display Exercise title using h3 as before for visual structure
                return <h3 key={item.id} className="exercise-header">{item.title}</h3>;
              }
              if (item.type === 'section') {
                const currentData = sectionData[item.id] || {};
                return (
                  <div key={item.id} className="section-upload-block">
                     {/* Display Section title using h4 as before */}
                    <h4>{item.title}</h4>
                    <div className="section-inputs">
                      {/* Image Upload */}
                      <div className="input-group">
                        <label htmlFor={`images-${item.id}`}>Imágenes (Ej: {item.id}_result.png):</label>
                        <input type="file" id={`images-${item.id}`} multiple accept="image/*" onChange={(e) => handleSectionFileChange(item.id, 'images', e)} />
                        <ul className="section-file-list">
                          {currentData.images?.map((f, idx) => (
                            <li key={idx}>{getFileIcon(f.name)} {f.name} <button onClick={() => removeSectionFile(item.id, 'images', f.name)}>×</button></li>
                          ))}
                        </ul>
                      </div>
                      {/* Results Upload */}
                      <div className="input-group">
                        <label htmlFor={`results-${item.id}`}>Resultados (CSV, etc.):</label>
                        <input type="file" id={`results-${item.id}`} multiple accept=".csv,.txt,.dat,.mat" onChange={(e) => handleSectionFileChange(item.id, 'results', e)} />
                         <ul className="section-file-list">
                          {currentData.results?.map((f, idx) => (
                            <li key={idx}>{getFileIcon(f.name)} {f.name} <button onClick={() => removeSectionFile(item.id, 'results', f.name)}>×</button></li>
                          ))}
                        </ul>
                      </div>
                      {/* Analysis Textarea */}
                      <div className="input-group">
                        <label htmlFor={`analysis-${item.id}`}>Tu Análisis / Respuestas:</label>
                        <textarea
                          id={`analysis-${item.id}`}
                          rows="4"
                          placeholder={`Escribe aquí tu análisis para ${item.title}...`}
                          value={currentData.analysis || ''}
                          onChange={(e) => handleAnalysisChange(item.id, e)}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Step 3: Analyze Results */}
      {structure.length > 0 && (
        <div className="practice-step analysis-step">
          <h2>3. Analizar Resultados</h2>
          <button onClick={handleAnalyzeResults} disabled={isAnalyzing} className="action-button analyze-btn">
            {isAnalyzing ? <FaSpinner className="spinner-icon" /> : <FaBrain />}
            {isAnalyzing ? 'Analizando...' : 'Analizar Resultados (IA)'}
          </button>
          {analysisResults && !isAnalyzing && (
             <button onClick={() => setShowAnalysisModal(true)} className="action-button view-analysis-btn">
                Ver Análisis Generado
             </button>
          )}
        </div>
      )}

       {/* Step 4: Generate Report */}
       {structure.length > 0 && (
         <div className="practice-step report-step">
           <h2>4. Generar Memoria</h2>
           <button onClick={handleGenerateReport} disabled={isGeneratingReport} className="action-button generate-report-btn">
             {isGeneratingReport ? <FaSpinner className="spinner-icon" /> : <FaMarkdown />}
             {isGeneratingReport ? 'Generando...' : 'Generar Memoria'}
           </button>
           {finalReport && !isGeneratingReport && (
             <div className="final-report-preview">
               <h4>Vista Previa de la Memoria:</h4>
               <textarea value={finalReport} readOnly rows="15" />
               {/* Add download button here */}
               <button className="action-button download-report-btn" onClick={() => alert('Descarga no implementada')}>
                   <FaDownload /> Descargar Memoria
               </button>
             </div>
           )}
         </div>
       )}

        {/* Analysis Results Modal */}
        <AnalysisResultsModal
            isOpen={showAnalysisModal}
            onClose={() => setShowAnalysisModal(false)}
            analysisContent={analysisResults}
        />

    </div>
  );
}

export default PracticeMode;

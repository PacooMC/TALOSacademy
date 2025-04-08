import React, { useState, useCallback } from 'react';
import './ExamsMode.css';
import {
  FaFileUpload, FaFilePdf, FaFileWord, FaFileImage, FaSpinner, FaCheck,
  FaListAlt, FaEdit, FaBrain, FaSyncAlt, FaCheckCircle, FaTimesCircle,
  FaQuestionCircle, FaFlask, FaBookOpen, FaArrowRight, FaClock, FaFileSignature,
  FaCog // Added FaCog for settings
} from 'react-icons/fa';

// --- Mock Data ---
const mockDetectedQuestions = [
  { id: 'q1', title: 'Define señal periódica y da un ejemplo.', type: 'Teoría' },
  { id: 'q2', title: 'Calcula los coeficientes de Fourier para x(t)=|sin(t)|.', type: 'Cálculo' },
  { id: 'q3', title: 'Dibuja el esquema de un modulador AM DSB-SC.', type: 'Esquema' },
  { id: 'q4', title: '¿Cuál es el ancho de banda de una señal FM?', type: 'Test' },
];

const mockQuestionDetails = {
  q1: {
    statement: 'Define señal periódica y da un ejemplo.',
    studentAnswer: 'Una señal es periódica si se repite cada T segundos. Ejemplo: x(t)=sin(t).', // Mock student answer
    aiCorrection: {
      result: 'Parcialmente Correcto',
      comment: 'La definición es correcta, pero falta indicar que T debe ser el *menor* valor positivo. El ejemplo es válido.',
      solution: [
        'Una señal x(t) es periódica si existe un T > 0 tal que x(t) = x(t + T) para todo t.',
        'El *periodo fundamental* T₀ es el valor más pequeño de T que cumple la condición.',
        'Ejemplo válido: x(t) = sin(t), con T₀ = 2π.',
        'Otro ejemplo: Una onda cuadrada de periodo T.'
      ],
      competency: 'Conceptos básicos de señales',
    }
  },
  q2: {
    statement: 'Calcula los coeficientes de Fourier para x(t)=|sin(t)|.',
    studentAnswer: 'a0 = 4/pi, an = ... (cálculos)', // Mock student answer
    aiCorrection: {
      result: 'Correcto',
      comment: 'El cálculo de a₀ es correcto. Los coeficientes a\' para n par también. Buen trabajo al notar la simetría.', // Replaced sequence
      solution: [
        'La señal y(t)=|sin(t)| es periódica con periodo fundamental T₀ = π.',
        'La frecuencia fundamental es ω₀ = 2π/T₀ = 2.',
        'La señal es par, por lo que b\' = 0 para todo n.', // Replaced sequence
        'a₀ = (2/T₀) ∫[0, T₀] y(t) dt = (2/π) ∫[0, π] sin(t) dt = (2/π) [-cos(t)]\'₀<0xE1><0xB5><0x87> = 4/π.', // Note: Prime might still be an issue here, let's use '
        'a\' = (2/T₀) ∫[0, T₀] y(t)cos(nω₀t) dt = (2/π) ∫[0, π] sin(t)cos(2nt) dt.', // Replaced sequence
        'Usando identidades trigonométricas, se obtiene a\' = -4 / (π(4n² - 1)) para n ≥ 1.', // Replaced sequence
        'Nota: a\' = 0 si n es impar (distinto de 1, donde la fórmula aplica).' // Replaced sequence
      ],
      competency: 'Cálculo de Series de Fourier',
    }
  },
  // Add mock details for q3, q4 if needed
};
// --- End Mock Data ---

// --- Helper Components ---
function FileUploadZone({ onFileUpload, isProcessing }) {
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      onFileUpload(event.target.files[0]);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileUpload(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <div
      className={`exam-upload-zone ${isProcessing ? 'processing' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {isProcessing ? (
        <>
          <FaSpinner className="spinner-icon" />
          <p>Analizando examen...</p>
        </>
      ) : (
        <>
          <FaFileUpload className="upload-icon" />
          <p>Arrastra aquí tu examen (PDF, DOCX, JPG, PNG...)</p>
          <p>o</p>
          <input
            type="file"
            id="exam-upload-input"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isProcessing}
          />
          <label htmlFor="exam-upload-input" className="upload-button">
            Selecciona Archivo
          </label>
        </>
      )}
    </div>
  );
}

function QuestionList({ questions, selectedQuestionId, onSelectQuestion }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="question-list-section">
      <h4><FaListAlt /> Preguntas Detectadas ({questions.length})</h4>
      <ul className="question-list">
        {questions.map(q => (
          <li
            key={q.id}
            className={`question-item ${q.id === selectedQuestionId ? 'active' : ''}`}
            onClick={() => onSelectQuestion(q.id)}
          >
            <span className="question-title">{q.title}</span>
            <span className="question-type-badge">{q.type}</span>
          </li>
        ))}
      </ul>
      <button className="edit-questions-btn"><FaEdit /> Editar Preguntas</button>
    </div>
  );
}

function QuestionDetailView({ question, details }) {
  if (!question || !details) return <div className="detail-placeholder">Selecciona una pregunta de la lista.</div>;

  const { statement, studentAnswer, aiCorrection } = details;
  const getResultClass = (result) => {
    if (!result) return '';
    if (result.toLowerCase().includes('correcto')) return 'result-correct';
    if (result.toLowerCase().includes('parcial')) return 'result-partial';
    if (result.toLowerCase().includes('incorrecto')) return 'result-incorrect';
    return '';
  };

  return (
    <div className="question-detail-view">
      <h3>Pregunta: {question.title}</h3>

      <div className="detail-section statement-section">
        <h4>Enunciado Extraído</h4>
        <p>{statement}</p>
      </div>

      {/* Placeholder/Area for student's answer */}
      <div className="detail-section student-answer-section">
        <h4>Tu Respuesta (Detectada/Introducida)</h4>
        <textarea defaultValue={studentAnswer || ''} placeholder="Introduce o pega aquí tu respuesta..." rows="4"></textarea>
        {/* Add upload button if needed */}
      </div>

      {aiCorrection && (
        <div className="detail-section ai-feedback-section">
          <h4><FaBrain /> Corrección IA</h4>
          <div className={`feedback-summary ${getResultClass(aiCorrection.result)}`}>
            <strong>Resultado:</strong> {aiCorrection.result}
          </div>
          <div className="feedback-comment">
            <strong>Comentario:</strong> {aiCorrection.comment}
          </div>
          <div className="feedback-solution">
            <strong>Solución Paso a Paso:</strong>
            <ol>
              {aiCorrection.solution.map((step, index) => (
                // Use simple apostrophe ' instead of prime symbol sequence
                <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/<0xE2><0x82><0x99>/g, "'").replace(/<0xE1><0xB5><0x87>/g, 'π') }}></li>
              ))}
            </ol>
          </div>
          <div className="feedback-competency">
            <strong>Competencia Evaluada:</strong>
            <span className="competency-tag">{aiCorrection.competency}</span>
          </div>
          <div className="feedback-actions">
            <button className="action-btn similar-btn"><FaSyncAlt /> Generar Ejercicio Similar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalAnalysis({ questions, questionDetails }) {
    if (!questions || questions.length === 0) return null;

    // Simple mock analysis
    const correctCount = questions.filter(q => questionDetails[q.id]?.aiCorrection?.result?.toLowerCase().includes('correcto')).length;
    const partialCount = questions.filter(q => questionDetails[q.id]?.aiCorrection?.result?.toLowerCase().includes('parcial')).length;
    const totalQuestions = questions.length;
    const score = correctCount + partialCount * 0.5; // Example scoring

    return (
        <div className="global-analysis-section">
            <h3><FaCheckCircle /> Análisis Global del Examen</h3>
            <div className="analysis-summary">
                <p><strong>Resultado General:</strong> {correctCount} Correctas, {partialCount} Parciales de {totalQuestions} ({((score / totalQuestions) * 100).toFixed(0)}%)</p>
                {/* Mock difficulties and recommendations */}
                {/* Replaced sequence with ' */}
                <p><strong>Dificultades Detectadas:</strong> Cálculo de coeficientes b', Aplicación de propiedades de Fourier.</p>
                <p><strong>Recomendación:</strong> Repasar el Tema 2 (Análisis de Fourier) y la Práctica 3.</p>
            </div>
            <div className="analysis-actions">
                <button className="action-btn review-btn"><FaBookOpen /> Repasar en Estudio Guiado</button>
                <button className="action-btn export-btn"><FaFileSignature /> Exportar Informe</button>
            </div>
        </div>
    );
}

// --- Main Component ---
function ExamsMode() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedQuestions, setDetectedQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  // State for Flow B (Simulated Exam)
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorParams, setGeneratorParams] = useState({
      subject: 'Teoría de Señal',
      topics: ['Tema 1', 'Tema 2'],
      numQuestions: 5,
      examType: 'mixto',
      difficulty: 'medio',
      style: 'Profesor X',
      useTimer: false,
  });
  const [generatedExam, setGeneratedExam] = useState(null); // { questions: [], timer?: number }
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setDetectedQuestions([]);
    setSelectedQuestionId(null);
    setGeneratedExam(null); // Clear generated exam if uploading
    setShowGenerator(false); // Hide generator

    // Simulate processing and decomposition
    console.log("Simulating decomposition for:", file.name);
    setTimeout(() => {
      setDetectedQuestions(mockDetectedQuestions);
      setIsProcessing(false);
      // Automatically select the first question
      if (mockDetectedQuestions.length > 0) {
        setSelectedQuestionId(mockDetectedQuestions[0].id);
      }
    }, 2000);
  };

  const handleSelectQuestion = (id) => {
    setSelectedQuestionId(id);
  };

  const handleGenerateExam = () => {
      setIsGenerating(true);
      setGeneratedExam(null);
      setUploadedFile(null); // Clear uploaded file
      setDetectedQuestions([]); // Clear detected questions
      setSelectedQuestionId(null);

      console.log("Simulating exam generation with params:", generatorParams);
      // Simulate generation
      setTimeout(() => {
          // Create mock questions based on params (simplified)
          const mockGenerated = {
              questions: Array.from({ length: generatorParams.numQuestions }, (_, i) => ({
                  id: `gen-q${i + 1}`,
                  title: `Pregunta ${i + 1} (${generatorParams.examType}, ${generatorParams.difficulty}) sobre ${generatorParams.topics[i % generatorParams.topics.length]}`,
                  type: generatorParams.examType === 'test' ? 'Test' : (i % 2 === 0 ? 'Teoría' : 'Cálculo'),
              })),
              timer: generatorParams.useTimer ? generatorParams.numQuestions * 10 * 60 : null // 10 mins/question
          };
          setGeneratedExam(mockGenerated);
          setDetectedQuestions(mockGenerated.questions); // Use generated questions for the list
          if (mockGenerated.questions.length > 0) {
              setSelectedQuestionId(mockGenerated.questions[0].id); // Select first generated question
          }
          setIsGenerating(false);
      }, 2000);
  };

  const selectedQuestion = detectedQuestions.find(q => q.id === selectedQuestionId);
  // Use mock details for both uploaded and generated for now
  const selectedQuestionDetails = mockQuestionDetails[selectedQuestionId] || {
      statement: `Enunciado para ${selectedQuestion?.title || 'pregunta desconocida'}...`,
      aiCorrection: { result: 'Pendiente', comment: 'Responde a esta pregunta.', solution: ['...'], competency: 'Desconocida' }
  };

  return (
    <div className="exams-mode-container">
      <h1><FaFlask /> Modo Exámenes</h1>

      <div className="exam-mode-options">
         <button
            onClick={() => { setShowGenerator(false); setGeneratedExam(null); }}
            className={!showGenerator ? 'active' : ''}
         >
            Subir Examen Real
         </button>
         <button
            onClick={() => {
                setShowGenerator(true);
                setUploadedFile(null);
                setDetectedQuestions([]);
                setSelectedQuestionId(null);
            }}
            className={showGenerator ? 'active' : ''}
         >
            Generar Simulacro IA
         </button>
      </div>

      {/* --- Flow B: Generator UI --- */}
      {showGenerator && !generatedExam && (
          <div className="practice-step exam-generator-form">
              <h2>Configura tu Simulacro</h2>
              {/* Add form elements for generatorParams */}
              <div className="generator-grid">
                  {/* Example: Subject (replace with actual inputs/selects) */}
                  <div className="param-group">
                      <label htmlFor="gen-subject">Asignatura:</label>
                      <input type="text" id="gen-subject" value={generatorParams.subject} onChange={e => setGeneratorParams({...generatorParams, subject: e.target.value})} />
                  </div>
                  <div className="param-group">
                      <label htmlFor="gen-topics">Temas (separados por coma):</label>
                      <input type="text" id="gen-topics" value={generatorParams.topics.join(', ')} onChange={e => setGeneratorParams({...generatorParams, topics: e.target.value.split(',').map(t => t.trim())})} />
                  </div>
                   <div className="param-group">
                      <label htmlFor="gen-numq">Nº Preguntas:</label>
                      <input type="number" id="gen-numq" min="1" max="20" value={generatorParams.numQuestions} onChange={e => setGeneratorParams({...generatorParams, numQuestions: parseInt(e.target.value) || 1})} />
                  </div>
                   <div className="param-group">
                      <label htmlFor="gen-type">Tipo:</label>
                      <select id="gen-type" value={generatorParams.examType} onChange={e => setGeneratorParams({...generatorParams, examType: e.target.value})}>
                          <option value="mixto">Mixto</option>
                          <option value="desarrollo">Desarrollo</option>
                          <option value="test">Test</option>
                      </select>
                  </div>
                   <div className="param-group">
                      <label htmlFor="gen-difficulty">Dificultad:</label>
                      <select id="gen-difficulty" value={generatorParams.difficulty} onChange={e => setGeneratorParams({...generatorParams, difficulty: e.target.value})}>
                          <option value="baja">Baja</option>
                          <option value="media">Media</option>
                          <option value="alta">Alta</option>
                      </select>
                  </div>
                   <div className="param-group">
                      <label htmlFor="gen-style">Estilo Profesor:</label>
                      <input type="text" id="gen-style" value={generatorParams.style} onChange={e => setGeneratorParams({...generatorParams, style: e.target.value})} />
                  </div>
                   <div className="param-group timer-param">
                      <label htmlFor="gen-timer">Activar Temporizador:</label>
                      <input type="checkbox" id="gen-timer" checked={generatorParams.useTimer} onChange={e => setGeneratorParams({...generatorParams, useTimer: e.target.checked})} />
                  </div>
              </div>
              <button onClick={handleGenerateExam} disabled={isGenerating} className="action-btn generate-exam-btn">
                  {isGenerating ? <FaSpinner className="spinner-icon" /> : <FaCog />}
                  {isGenerating ? 'Generando...' : 'Generar Examen'}
              </button>
          </div>
      )}

      {/* --- Flow A: Upload UI --- */}
      {!showGenerator && !uploadedFile && (
        <div className="practice-step">
          <FileUploadZone onFileUpload={handleFileUpload} isProcessing={isProcessing} />
        </div>
      )}

      {/* --- Shared Display Area (Uploaded or Generated) --- */}
      {(uploadedFile || generatedExam) && !isProcessing && !isGenerating && (
        <div className="exam-display-area">
          <div className="exam-sidebar">
            {uploadedFile && (
              <div className="uploaded-file-info">
                <strong>Archivo:</strong> {uploadedFile.name}
                <button onClick={() => { setUploadedFile(null); setDetectedQuestions([]); setSelectedQuestionId(null); }} className="change-file-btn">Cambiar</button>
              </div>
            )}
             {generatedExam && (
              <div className="generated-exam-info">
                <strong>Simulacro Generado</strong>
                {/* Display timer if active */}
                {generatedExam.timer && <div className="timer"><FaClock /> Tiempo: {Math.floor(generatedExam.timer / 60)} min</div>}
              </div>
            )}
            <QuestionList
              questions={detectedQuestions}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
          <div className="exam-main-content">
            <QuestionDetailView
              question={selectedQuestion}
              details={selectedQuestionDetails}
            />
             {/* Show global analysis only for uploaded exams for now */}
             {uploadedFile && detectedQuestions.length > 0 && (
                 <GlobalAnalysis questions={detectedQuestions} questionDetails={mockQuestionDetails} />
             )}
             {/* Add "Correct Exam" button for generated exams */}
             {generatedExam && (
                 <div className="generated-exam-actions">
                     <button className="action-btn correct-exam-btn">Corregir Examen (Simulado)</button>
                 </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamsMode;

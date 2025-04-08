// Centralized data store keyed by subject ID

import { competencies as commsCompetencies, edges as commsEdges, topics as commsTopics } from './competencies';
import { dailySessionData as commsDailySession } from './dailySessionData';
import { guidedStudyTopics as commsGuidedStudy } from './guidedStudyData';
// Import other data files if they exist

// --- Placeholder Data for Algebra Lineal ---
const algebraCompetencies = [
 { id: 101, title: 'Espacios Vectoriales', level: 'Básico', type: 'Teoría', state: 'done', bullets: ['Definición', 'Propiedades', 'Subespacios'], topic: 'AL-T1', x: 300, y: 100 },
 { id: 102, title: 'Bases y Dimensión', level: 'Medio', type: 'Teoría', state: 'progress', bullets: ['Linealmente Independiente', 'Sistema Generador', 'Teorema de la Base'], topic: 'AL-T1', x: 300, y: 250 },
 { id: 103, title: 'Matrices', level: 'Básico', type: 'Práctica', state: 'done', bullets: ['Operaciones', 'Matriz Inversa', 'Rango'], topic: 'AL-T2', x: 600, y: 100 },
 { id: 104, title: 'Determinantes', level: 'Medio', type: 'Práctica', state: 'none', bullets: ['Cálculo', 'Propiedades', 'Adjunta'], topic: 'AL-T2', x: 600, y: 250 },
];
const algebraEdges = [
  { from: 101, to: 102, type: 'prereq' },
  { from: 103, to: 104, type: 'prereq' },
  { from: 101, to: 103, type: 'assoc' }, // Example association
];
const algebraTopics = {
  'AL-T1': { name: "Espacios Vectoriales", color: "rgba(254, 249, 195, 0.6)" },
  'AL-T2': { name: "Matrices y Determinantes", color: "rgba(254, 226, 226, 0.6)" },
};

const algebraDailySession = {
  context: { date: "Martes, 8 de abril", estimatedTime: "45 minutos", focusNodes: [{ id: 102, title: "Bases y Dimensión" }], upcomingExam: { date: "20 de abril" } },
  nodes: [
    { id: 102, title: "Bases y Dimensión", status: 'pending', content: { introduction: { text: "Una base de un espacio vectorial es un conjunto 'mágicamente' perfecto de vectores..." }, theory: { text: "Un conjunto es LI si..." }, example: { text: "En R², {(1,0), (0,1)} es una base." }, exercise: { statement: "Verifica si {(1,1), (1,-1)} es base de R²." } } },
    { id: 104, title: "Determinantes", status: 'pending', content: { introduction: { text: "El determinante es un número especial asociado a matrices cuadradas..." }, theory: { text: "Para 2x2, det = ad-bc..." }, example: { text: "det([[1,2],[3,4]]) = 1*4 - 2*3 = -2" }, exercise: { statement: "Calcula det([[1,0,2],[2,-1,3],[4,1,8]])." } } },
  ]
};

const algebraGuidedStudy = [
 { id: 'topic-al-1', title: 'Tema 1: Espacios Vectoriales', subtopics: [
    { id: 'subtopic-al-1-1', title: '1.1 Definición y Ejemplos', status: 'pending', objective: 'Comprender qué es un espacio vectorial.', explanation: 'Un EV es un conjunto con suma y producto por escalar...', example: 'R², R³, Polinomios P₂(x)...', exercise: { statement: '¿Es el conjunto de matrices 2x2 un EV?' }, competencies: ['Espacios Vectoriales'] },
    { id: 'subtopic-al-1-2', title: '1.2 Subespacios Vectoriales', status: 'pending', objective: 'Identificar subespacios.', explanation: 'Un subconjunto que es EV por sí mismo...', example: 'Una recta por el origen en R².', exercise: { statement: '¿Es W={(x,y) | x ≥ 0} subespacio de R²?' }, competencies: ['Espacios Vectoriales'] },
 ]},
];
// --- End Placeholder Data ---


export const allSubjectData = {
  'sistemas-comunicaciones': {
    competencies: commsCompetencies,
    edges: commsEdges,
    topics: commsTopics,
    dailySession: commsDailySession,
    guidedStudy: commsGuidedStudy,
    // Add other data specific to this subject
  },
  'algebra-lineal': {
    competencies: algebraCompetencies,
    edges: algebraEdges,
    topics: algebraTopics,
    dailySession: algebraDailySession,
    guidedStudy: algebraGuidedStudy,
    // Add other data specific to this subject
  },
  // Add entries for other subjects as needed
};

// Helper function to get data for the current subject
export const getSubjectData = (subjectId) => {
  return allSubjectData[subjectId] || null; // Return null or default data if subject not found
};

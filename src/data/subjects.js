// Mock data for available subjects and user enrollment

export const availableSubjects = [
  {
    id: 'sistemas-comunicaciones',
    name: 'Sistemas de Comunicaciones',
    career: 'Ingeniería de Telecomunicación',
    courseYear: 3,
  },
  {
    id: 'algebra-lineal',
    name: 'Álgebra Lineal',
    career: 'Ingeniería Informática',
    courseYear: 1,
  },
  {
    id: 'calculo-1',
    name: 'Cálculo I',
    career: 'Ingeniería Informática',
    courseYear: 1,
  },
  {
    id: 'electronica-analogica',
    name: 'Electrónica Analógica',
    career: 'Ingeniería de Telecomunicación',
    courseYear: 2,
  },
  {
    id: 'programacion-2',
    name: 'Programación II',
    career: 'Ingeniería Informática',
    courseYear: 2,
  },
];

// Simulate user's enrolled subjects
export const initialEnrolledSubjects = [
  availableSubjects.find(s => s.id === 'sistemas-comunicaciones'),
  availableSubjects.find(s => s.id === 'algebra-lineal'),
];

// Function to get subject details by ID
export const getSubjectById = (subjectId) => {
    return availableSubjects.find(s => s.id === subjectId);
}

// Define topics (can be expanded later)
    const topics = {
      T1: { name: "Fundamentos de Señales", color: "rgba(239, 246, 255, 0.7)" }, // Light Blue tint
      T2: { name: "Análisis de Fourier", color: "rgba(240, 253, 244, 0.7)" }, // Light Green tint
      T3: { name: "Álgebra Lineal Aplicada", color: "rgba(254, 249, 195, 0.6)" } // Light Yellow tint
    };

    export const competencies = [
      // Level 1 - Topic 1
      {
        id: 1,
        title: 'Identificar señales',
        level: 'Básico',
        type: 'Teoría',
        state: 'done',
        last: '01/04/25',
        bullets: ['Tipos de señales', 'Propiedades básicas', 'Ejemplos prácticos'],
        x: 500,
        y: 80,
        topic: 'T1' // Added topic
      },
      // Level 2 - Topic 2
      {
        id: 2,
        title: 'Aplicar FFT',
        level: 'Medio',
        type: 'Práctica',
        state: 'progress',
        last: '03/04/25',
        bullets: ['Transformada rápida', 'Interpretación espectral', 'MATLAB'],
        x: 500,
        y: 260,
        topic: 'T2' // Added topic
      },
      // Level 3 (Branching from 2) - Topic 2
      {
        id: 3,
        title: 'Filtrado paso bajo',
        level: 'Alto',
        type: 'Teoría',
        state: 'lag',
        last: '02/04/25',
        bullets: ['Diseño de filtros', 'Respuesta frec.', 'Aplicaciones'],
        x: 250,
        y: 440,
        topic: 'T2' // Added topic
      },
      // Level 3 (Branching from 2) - Topic 2
      {
        id: 4,
        title: 'Convolución MATLAB',
        level: 'Medio',
        type: 'Práctica',
        state: 'none',
        last: '',
        bullets: ['Función conv()', 'Ejemplos', 'Interpretación'],
        x: 750,
        y: 440,
        topic: 'T2' // Added topic
      },
      // Level 4 (Branching from 3) - Topic 3
      {
        id: 5,
        title: 'Espacios vectoriales',
        level: 'Básico',
        type: 'Teoría',
        state: 'done',
        last: '28/03/25',
        bullets: ['Definición', 'Bases', 'Subespacios'],
        x: 100,
        y: 620,
        topic: 'T3' // Added topic
      },
      // Level 4 (Branching from 3) - Topic 3
      {
        id: 6,
        title: 'Álgebra lineal',
        level: 'Medio',
        type: 'Teoría',
        state: 'progress',
        last: '02/04/25',
        bullets: ['Matrices', 'Determinantes', 'Sistemas Ecu.'],
        x: 400,
        y: 620,
        topic: 'T3' // Added topic
      },
      // Level 4 (Branching from 4) - Topic 3
      {
        id: 7,
        title: 'Transformaciones L.',
        level: 'Alto',
        type: 'Práctica',
        state: 'progress',
        last: '05/04/25',
        bullets: ['Núcleo e Imagen', 'Matriz asociada', 'Aplicaciones Geom.'],
        x: 750,
        y: 620,
        topic: 'T3' // Added topic
      }
    ];

    // Edges remain the same logically, but connect to the new coordinates
    export const edges = [
      { from: 1, to: 2, type: 'prereq' },
      { from: 2, to: 3, type: 'prereq' },
      { from: 2, to: 4, type: 'prereq' }, // Changed to prereq for tree structure
      { from: 3, to: 5, type: 'assoc' },
      { from: 3, to: 6, type: 'prereq' },
      { from: 4, to: 7, type: 'prereq' }
    ];

    // Export topics definition as well
    export { topics };

// Sample data for Guided Study
export const guidedStudyTopics = [
  {
    id: 'topic-1',
    title: 'Tema 1: Señales y Sistemas',
    subtopics: [
      {
        id: 'subtopic-1-1',
        title: '1.1 Señales deterministas',
        status: 'pending', // Added status
        objective: 'Clasificar señales según sus propiedades fundamentales.',
        explanation: `Una señal determinista es aquella cuyo valor puede predecirse con exactitud en cualquier instante de tiempo. No dependen del azar.<br><br>Se clasifican principalmente en:<ul><li>Continuas vs. Discretas (en tiempo)</li><li>Analógicas vs. Digitales (en amplitud)</li><li>Periódicas vs. Aperiódicas</li><li>Energía vs. Potencia</li></ul>Comprender esta clasificación es clave para elegir las herramientas de análisis adecuadas.`,
        example: `<strong>Ejemplo:</strong> Una señal senoidal <code>x(t) = A * sin(2 * pi * f * t + phi)</code> es determinista, continua, analógica y periódica. Una secuencia <code>x[n] = {1, 0, -1, 0, 1, ...}</code> es determinista, discreta y periódica. Una función escalón unitario <code>u(t)</code> es determinista, continua y aperiódica.
        <div class="embedded-graph">Gráfico de una señal exponencial decreciente (ejemplo de aperiódica).</div>`,
        exercise: {
          statement: 'Clasifica la señal <code>x(t) = e^(-at) * u(t)</code> donde a > 0.',
        },
        competencies: ['Identificar señales', 'Clasificación básica'],
      },
      {
        id: 'subtopic-1-2',
        title: '1.2 Señales periódicas',
        status: 'pending', // Added status
        objective: 'Identificar y calcular el periodo fundamental de señales periódicas.',
        explanation: `Una señal x(t) es periódica si existe un T > 0 tal que x(t) = x(t + T) para todo t. El valor más pequeño de T se llama periodo fundamental (T₀).<br>Para señales discretas x[n], la condición es x[n] = x[n + N] para algún entero N > 0 (periodo fundamental N₀).<br>La frecuencia fundamental es f₀ = 1/T₀ (o F₀ = 1/N₀ para discreta). La frecuencia angular es ω₀ = 2πf₀.
        <div class="embedded-graph">Gráfico de una señal senoidal mostrando su periodo T₀.</div>`,
        example: `<strong>Senoide:</strong> x(t) = sin(5πt). ω₀ = 5π = 2πf₀ => f₀ = 2.5 Hz, T₀ = 1/2.5 = 0.4 s.<br><strong>Suma de senoides:</strong> x(t) = cos(2t) + sin(3t). T₁=π, T₂=2π/3. El periodo fundamental es el mínimo común múltiplo: T₀ = MCM(π, 2π/3) = 2π.<br><strong>Discreta:</strong> x[n] = cos(πn/4). Debe cumplirse cos(π(n+N)/4) = cos(πn/4). Esto ocurre si πN/4 = 2πk (k entero). N/4 = 2k => N = 8k. El menor N es N₀ = 8.`,
        exercise: {
          statement: 'Determina si x[n] = sin(3πn/7 + π/2) es periódica y calcula su periodo fundamental N₀.',
        },
        competencies: ['Identificar señales', 'Análisis de periodicidad'],
      },
    ],
  },
  {
    id: 'topic-2',
    title: 'Tema 2: Análisis de Fourier',
    subtopics: [
      {
        id: 'subtopic-2-1',
        title: '2.1 Transformada de Fourier (Digital)',
        status: 'pending', // Added status
        objective: 'Entender la transformada de Fourier en el contexto digital (DFT/FFT).',
        explanation: `La Transformada Discreta de Fourier (DFT) analiza el contenido frecuencial de una señal muestreada (discreta y finita). Convierte una secuencia de N muestras en el dominio del tiempo, x[n], en una secuencia de N muestras en el dominio de la frecuencia, X[k].<br><br>La fórmula es: <div class="math-formula">X[k] = <span class="summation"><sup>N-1</sup><sub>n=0</sub></span> x[n] · e<sup>-j·2π·k·n/N</sup></div> para k = 0, 1, ..., N-1.<br><br>La FFT (Fast Fourier Transform) no es una transformada diferente, sino un conjunto de algoritmos muy eficientes para calcular la DFT rápidamente. Es la herramienta estándar en software (MATLAB, Python) para el análisis espectral.`,
        example: `Si tenemos la secuencia x[n] = {1, 0, 1, 0} (N=4).<br>X[0] = <span class="summation"><sup>3</sup><sub>n=0</sub></span> x[n] = 1+0+1+0 = 2 (Componente DC)<br>X[1] = x[0]e⁰ + x[1]e<sup>-jπ/2</sup> + x[2]e<sup>-jπ</sup> + x[3]e<sup>-j3π/2</sup> = 1 + 0 + 1(-1) + 0 = 0<br>X[2] = x[0]e⁰ + x[1]e<sup>-jπ</sup> + x[2]e<sup>-j2π</sup> + x[3]e<sup>-j3π</sup> = 1 + 0 + 1(1) + 0 = 2<br>X[3] = x[0]e⁰ + x[1]e<sup>-j3π/2</sup> + x[2]e<sup>-j3π</sup> + x[3]e<sup>-j9π/2</sup> = 1 + 0 + 1(-1) + 0 = 0<br>El espectro es X[k] = {2, 0, 2, 0}.
        <div class="embedded-graph">Gráfico del espectro de magnitud X[k] = {2, 0, 2, 0}.</div>`,
        exercise: {
          statement: 'Usando MATLAB o Python (numpy.fft), calcula la FFT de la señal x[n] = sin(2πn/8) para n=0 a 7. ¿En qué índices k esperas encontrar los picos?',
        },
        competencies: ['Aplicar FFT', 'Análisis espectral', 'DFT/FFT'],
      },
      // Add more subtopics here...
    ],
  },
  // Add more topics here...
];

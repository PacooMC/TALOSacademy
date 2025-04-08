export const dailySessionData = {
  context: {
    date: "Martes, 8 de abril",
    estimatedTime: "50 minutos",
    focusNodes: [
      { id: 2, title: "Transformada de Fourier" },
      { id: 3, title: "Filtrado paso bajo" }
    ],
    upcomingPractice: { name: "Práctica 3", due: "jueves" },
    upcomingExam: { date: "15 de abril" }
  },
  nodes: [
    {
      id: 2,
      title: "Transformada de Fourier",
      status: 'pending', // Added status
      content: {
        introduction: {
            text: "La Transformada de Fourier (FT) es una herramienta matemática fundamental que descompone una señal (una función del tiempo) en las frecuencias que la componen. Permite analizar una señal en el dominio de la frecuencia en lugar del dominio del tiempo.<br><br>Es esencial en áreas como el procesamiento de señales, comunicaciones, análisis de imágenes y física. Comprender cómo una señal se ve en el dominio de la frecuencia nos da información valiosa sobre sus características periódicas y su contenido armónico.",
            image: "https://via.placeholder.com/500x200.png?text=Señal+en+Tiempo+vs+Frecuencia"
        },
        theory: {
          text: `Para una señal continua x(t), su Transformada de Fourier X(f) se define como la integral:
<div class="math-formula">X(f) = <span class="integral"><sup>∞</sup><sub>−∞</sub></span> x(t) · e<sup>-j·2π·f·t</sup> dt</div>
Donde 'j' es la unidad imaginaria y 'f' es la frecuencia. La transformada inversa permite recuperar la señal original:
<div class="math-formula">x(t) = <span class="integral"><sup>∞</sup><sub>−∞</sub></span> X(f) · e<sup>j·2π·f·t</sup> df</div>
Propiedades clave incluyen linealidad, desplazamiento en tiempo y frecuencia, convolución (la convolución en tiempo equivale a multiplicación en frecuencia), y la relación de Parseval (conservación de la energía). En la práctica, para señales digitales, se utiliza la Transformada Discreta de Fourier (DFT) y su algoritmo eficiente, la FFT.`,
          image: "https://via.placeholder.com/500x250.png?text=Fórmula+Integral+FT+y+Propiedades"
        },
        example: {
          text: `Consideremos una señal sinusoidal simple: x(t) = A·cos(2π·f₀·t). Su Transformada de Fourier consiste en dos impulsos (deltas de Dirac) en las frecuencias +f₀ y -f₀:
<div class="math-formula">X(f) = (A/2) [δ(f - f₀) + δ(f + f₀)]</div>
Si tenemos una señal compuesta por varias sinusoides, su espectro mostrará picos en cada una de esas frecuencias. Una señal cuadrada en el tiempo tiene una transformada de Fourier con forma de función sinc(f) en la frecuencia, mostrando que contiene infinitas componentes frecuenciales:
<div class="math-formula">X(f) = A·T·sinc(πfT) = A·T · [sin(πfT) / (πfT)]</div>`,
          image: "https://via.placeholder.com/500x200.png?text=Espectro+Senoide+y+Onda+Cuadrada"
        },
        practicalApplication: {
          relevant: true,
          practiceName: "Práctica 3: Análisis espectral",
          description: "La FT (y su implementación FFT) es la base para visualizar el espectro de señales de audio, radio, imágenes médicas, etc., permitiendo identificar componentes, ruido o aplicar filtrado."
        },
        exercise: {
          statement: "Calcula la Transformada de Fourier de un pulso rectangular x(t) = A para |t| < T/2 y 0 en otro caso. Dibuja su espectro de magnitud.",
          solutionSteps: [
            "Aplicar la definición integral de la FT a la señal pulso.",
            "Resolver la integral: <span class=\"integral\"><sup>T/2</sup><sub>-T/2</sub></span> A · e<sup>-j·2π·f·t</sup> dt.",
            "Evaluar la integral: [A / (-j·2π·f)] · [e<sup>-jπfT</sup> - e<sup>jπfT</sup>].",
            "Simplificar usando la fórmula de Euler (e<sup>jx</sup> - e<sup>-jx</sup> = 2j·sin(x)).",
            "Obtener: A·T · [sin(πfT) / (πfT)] = A·T·sinc(πfT).",
            "Dibujar la magnitud |X(f)|, que tendrá un lóbulo principal centrado en f=0 y lóbulos laterales decrecientes."
          ]
        }
      }
    },
    {
      id: 3,
      title: "Filtrado paso bajo",
      status: 'pending', // Added status
      content: {
        introduction: {
            text: "Un filtro paso bajo (LPF) es un sistema que permite el paso de señales con frecuencias por debajo de una frecuencia de corte (fc) determinada y atenúa significativamente las frecuencias superiores. Son fundamentales para eliminar ruido de alta frecuencia o seleccionar una banda de interés.",
            image: "https://via.placeholder.com/450x200.png?text=Respuesta+Ideal+vs+Real+LPF"
        },
        theory: {
          text: "Se caracterizan por su frecuencia de corte (fc), el orden (que determina la pendiente de atenuación en la banda de rechazo), y la forma de la respuesta (Butterworth, Chebyshev, Bessel, etc.). Los filtros Butterworth tienen una respuesta plana en la banda de paso, los Chebyshev tienen una caída más abrupta pero con rizado, y los Bessel priorizan una fase lineal (importante para no distorsionar la forma de onda). La función de transferencia H(s) o H(z) describe matemáticamente el comportamiento del filtro.",
          image: "https://via.placeholder.com/500x250.png?text=Comparativa+Butterworth+vs+Chebyshev"
        },
        example: {
            text: `Diseño de un filtro Butterworth analógico de orden N=2 con fc=1 kHz (wc = 2πfc). Los polos normalizados para N=2 son s₁,₂ = -0.707 ± j0.707. Desnormalizando (multiplicando por wc) y construyendo H(s):
<div class="math-formula">H(s) = wc² / [(s - s₁')(s - s₂')] = wc² / (s² + √2·wc·s + wc²)</div>
Para un filtro digital, se aplicaría una transformación como la bilineal a H(s).`,
            image: "https://via.placeholder.com/450x200.png?text=Polos+LPF+Butterworth+N=2"
        },
        practicalApplication: null,
        exercise: {
          statement: "Diseña un filtro paso bajo Butterworth analógico con una atenuación máxima de 1 dB en la banda de paso (fp=1kHz) y una atenuación mínima de 15 dB en la banda de rechazo (fs=2kHz).",
          solutionSteps: [
            "Calcular el orden N del filtro usando las especificaciones de atenuación.",
            "Determinar la frecuencia de corte wc (a -3dB o según especificación).",
            "Obtener los polos normalizados para el orden N de las tablas de Butterworth.",
            "Desnormalizar los polos usando wc.",
            "Construir la función de transferencia H(s) a partir de los polos."
          ]
        }
      }
    }
  ]
};

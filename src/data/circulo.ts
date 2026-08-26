/**
 * Círculo dorado (Sinek): tres anillos concéntricos. El usuario abre cada uno
 * y el panel de la derecha muestra el contenido. `frase` admite <em> para
 * resaltar en amarillo.
 */
export type Anillo = {
  key: 'que' | 'como' | 'why';
  /** etiqueta sobre el anillo */
  label: string;
  /** kicker del panel */
  kicker: string;
  /** titular del panel — HTML acotado a <em> */
  frase: string;
  body: string;
};

export const anillos: Anillo[] = [
  {
    key: 'que',
    label: 'Qué',
    kicker: 'Qué hacemos',
    frase: 'Publicidades. Contenido. Videoclips. <em>Ficción.</em>',
    body: 'Las publicidades conectan propósito y marcas. El contenido digital nos deja ser ágiles y experimentales. Los videoclips abren el mundo emocional. Y la ficción es el horizonte: historias nuestras, sin brief ni cliente.',
  },
  {
    key: 'como',
    label: 'Cómo',
    kicker: 'Cómo lo hacemos',
    frase: 'Contamos <em>buenas historias.</em>',
    body: 'Las que entretienen, conectan e inspiran. No historias perfectas: historias vivas, honestas, cargadas de emoción o de verdad. Todo lo que hacemos responde una pregunta: ¿qué historia estás contando con esto?',
  },
  {
    key: 'why',
    label: 'Por qué',
    kicker: 'Por qué existimos',
    frase: 'La cultura no se observa, <em>se hace.</em>',
    body: 'No creemos que la cultura sea algo que pasa mientras trabajamos. Somos parte activa de lo que las personas ven, piensan, sienten y comparten. No vinimos a mirar cómo se hace. Vinimos a hacerlo.',
  },
];

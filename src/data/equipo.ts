export type Miembro = {
  nombre: string;
  rol: string;
  /** frase del manifiesto que le corresponde */
  linea: string;
  bio: string;
  /** ruta a la foto en /public. Sin foto → se muestra el placeholder. */
  foto?: string;
};

// El orden del array es el orden en pantalla.
// TODO(brief): sumar las fotos reales en public/equipo/ y completar `foto`.
// Hay tomas de estudio en Dropbox (01_Branding/04_Studio-Photos) de Anita,
// Guido, Santi, Tomi y Agus; faltan las de Toto y Ame.
export const equipo: Miembro[] = [
  {
    nombre: 'Anita Serrano',
    rol: 'Directora Creativa',
    linea: 'Crea sin pedir permiso',
    bio: 'La locura y la pasión si estas palabras fueran una persona, en el mejor de los sentidos. Creadora de mundos de terror, humor con una manera única de ver la vida.',
  },
  {
    nombre: 'Guido Boetsch',
    rol: 'Director · Productor VFX',
    linea: 'Crea universos',
    bio: 'Director y productor de VFX. Donde otros ven un plano, él ve un mundo entero por construir.',
  },
  {
    nombre: 'Santiago Rey',
    rol: 'Director · Director Creativo',
    linea: 'El romántico',
    bio: 'Cree en el cine como se creía antes. Odia la IA, y lo decimos acá porque somos auténticos.',
  },
  {
    nombre: 'Toto Scigliano',
    rol: 'Head of Content',
    linea: 'Está en cada detalle',
    bio: 'Head of Content. Y filmmaker, editor, creativo y CM. Sí, todo eso — y lo hace parecer fácil.',
  },
  {
    nombre: 'Ame Blanco',
    rol: 'Directora de Operaciones · Productora Ejecutiva',
    linea: 'Hace que suceda',
    bio: 'Si algo se filmó, se entregó y salió bien, es porque Ame estuvo ahí antes que todos.',
  },
  {
    nombre: 'Tomás Boetsch',
    rol: 'Admin · Finanzas · RRHH',
    linea: 'Ama la IA',
    bio: 'Administración, finanzas y RRHH, y el responsable #1 en que estemos en la vanguardia de la tecnología. Amante de los videojuegos.',
  },
  {
    nombre: 'Agustín Stegmann',
    rol: 'Fundador · Director',
    linea: 'Imagina lo imposible',
    bio: 'El origen del universo Gran Berta y la brújula de todo lo que hacemos.',
  },
];

/**
 * Manifiesto completo, tal cual figura en el documento de identidad verbal
 * (02_GB_Films_Identidad_Estrategica_y_Verbal). El mockup traía solo la
 * primera estrofa; faltaba la del medio.
 *
 * Estructura: estrofas → frases → renglones. Cada **frase** es una unidad
 * seleccionable en la web (al clickearla se agranda). Una frase puede tener
 * varios renglones si se quiere que se seleccionen juntos.
 */
export const manifiesto = {
  estrofas: [
    [
      ['Creemos en los que imaginan lo imposible,'],
      ['en los que crean sin pedir permiso,'],
      ['en los que están en cada detalle.'],
    ],
    [
      ['Porque son ellos los que lo hacen posible,'],
      ['los que hacen cultura,'],
      ['y los que escriben la historia.'],
    ],
    // El cierre va como tres frases sueltas, cada una seleccionable por su
    // cuenta. Si se quisiera que se destaquen juntas, sería una sola frase de
    // tres renglones: [['Son ellos,', 'somos nosotros,', 'sos vos.']]
    [['Son ellos,'], ['somos nosotros,'], ['sos vos.']],
  ],

  /**
   * Frase que arranca destacada, por posición [estrofa, frase].
   * Hoy: "los que hacen cultura,", que es una derivación del slogan y queda
   * en el centro del bloque.
   */
  destacada: { estrofa: 1, frase: 1 },
};

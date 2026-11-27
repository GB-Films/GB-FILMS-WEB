import archivoX from '../assets/ficcion/archivo-x.jpg';
import jubilada from '../assets/ficcion/jubilada-y-peligrosa.jpg';
import ruma from '../assets/ficcion/ruma.jpg';
import rendering from '../assets/ficcion/rendering.webp';
import elCondenado from '../assets/ficcion/el-condenado.webp';
import cucaracha from '../assets/ficcion/cucaracha.webp';
import elDienteNegro from '../assets/ficcion/el-diente-negro.webp';
import elSonidoDelViento from '../assets/ficcion/el-sonido-del-viento.webp';
import noku from '../assets/ficcion/noku.webp';

export type Pieza = {
  /** URL pública que identifica la pieza y permite asociarle su vista local. */
  url: string;
  /** IP o campaña, si la pieza fue para algo puntual. Se muestra "MARCA × TÍTULO". */
  titulo?: string;
  /** Recursos propios que reemplazan la vista asociada a la URL pública. */
  video?: string;
  poster?: string;
  horizontal?: boolean;
};

export type Marca = {
  nombre: string;
  /** logo en public/marcas/, relativo al BASE_URL del sitio. */
  logo?: string;
  /** Trabajos de esa marca. Sin piezas, la tarjeta es solo logo y no se clickea. */
  piezas?: Pieza[];
};

export const ultimoTrabajoUrl = 'https://youtu.be/kSsZMVwo__w';

// El orden del array es el orden en que aparecen en la franja.
export const marcas: Marca[] = [
  {
    nombre: 'Netflix',
    logo: 'marcas/netflix-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/p/DSp6FnfAFvt/', titulo: 'Stranger Things' },
      { url: 'https://www.instagram.com/p/DSIXPVvAib2/', titulo: 'Stranger Things' },
      { url: 'https://www.instagram.com/p/DRxSYgujkkG/', titulo: 'Stranger Things' },
    ],
  },
  {
    nombre: 'Prime Video',
    logo: 'marcas/prime-video-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/p/DZVvhd4ODQP/', titulo: 'Spider-Noir' },
      { url: 'https://www.instagram.com/p/DNoMQFEA_2O/' },
    ],
  },
  {
    nombre: 'Samsung',
    logo: 'marcas/samsung-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/p/DMtCnCfS6Ax/' },
      { url: 'https://www.instagram.com/reel/DXKIOdQk15C/' },
      {
        url: 'https://youtu.be/Mqo1aXziVUM',
        titulo: 'Mundial 2026',
        video: 'portfolio/videos/samsung-mundial-2026.mp4',
        poster: 'portfolio/videos/samsung-mundial-2026.webp',
        horizontal: true,
      },
    ],
  },
  {
    nombre: 'Microsoft',
    logo: 'marcas/microsoft-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/p/DMLqEvtvv7k/', titulo: 'Minecraft' },
      { url: 'https://www.instagram.com/p/DMdpWQ4PVp0/', titulo: 'Minecraft' },
    ],
  },
  {
    nombre: 'Xbox',
    logo: 'marcas/xbox-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/reel/DYPsUV-yh19/', titulo: 'Forza Horizon' },
      { url: 'https://www.instagram.com/reel/DYScISPkpR0/', titulo: 'Forza Horizon' },
      { url: 'https://www.instagram.com/reel/DYVA6U6DsTh/', titulo: 'Forza Horizon' },
    ],
  },
  {
    nombre: 'HBO Max',
    logo: 'marcas/hbo-max-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/p/C8nTxrhvhk3/', titulo: 'House of the Dragon', horizontal: true },
    ],
  },
  {
    // Misma pieza que HBO Max: fue una acción de las dos marcas juntas, y
    // cuenta como antecedente para las dos.
    nombre: 'Mercado Libre',
    logo: 'marcas/mercado-libre-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/p/C8nTxrhvhk3/', titulo: 'House of the Dragon', horizontal: true },
    ],
  },
  {
    nombre: 'Axe',
    logo: 'marcas/axe-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/C8XQ3xsuMa3/' }],
  },
  {
    nombre: 'ICBC',
    logo: 'marcas/icbc-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/reel/DCSRGsSP_1E/' }],
  },
  {
    nombre: 'Alfajores Jorgito',
    logo: 'marcas/jorgito-mono.webp',
    piezas: [{
      url: ultimoTrabajoUrl,
      titulo: 'Convocatoria Jorgito 2026',
      video: 'portfolio/videos/DZzqHtzOk6S-horizontal.mp4',
      poster: 'portfolio/videos/DZzqHtzOk6S-horizontal.webp',
      horizontal: true,
    }],
  },
  {
    nombre: 'Sprite',
    logo: 'marcas/sprite-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/DUT8Umzj3is/' }],
  },
  {
    nombre: 'Shell',
    logo: 'marcas/shell-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/DQIJh4-jWD9/' }],
  },
  {
    nombre: 'Conmebol',
    logo: 'marcas/conmebol-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/DHoUxSdOufj/' }],
  },
  {
    nombre: '9GAG',
    logo: 'marcas/9gag-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/C9QpsQnPcwH/', titulo: 'PUBG Mobile' }],
  },
  {
    nombre: 'Trenet',
    logo: 'marcas/trenet-mono.webp',
    piezas: [
      { url: 'https://www.instagram.com/p/DR5xKbKDePM/' },
      { url: 'https://www.instagram.com/p/DSVxXIcj3fT/' },
      { url: 'https://www.instagram.com/p/DTJROZijxab/' },
    ],
  },
  {
    nombre: 'Andes',
    logo: 'marcas/andes-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/C_bkKcFvaPv/' }],
  },
  {
    nombre: 'Baldo',
    logo: 'marcas/baldo-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/DZK0cjyh9j3/' }],
  },
  {
    nombre: 'ZonaProp',
    logo: 'marcas/zonaprop-mono.webp',
    piezas: [{ url: 'https://www.instagram.com/p/DNDliYaA_KH/' }],
  },
  // Sin piezas: pesan por el nombre, pero no se pueden clickear.
  { nombre: 'Disney', logo: 'marcas/disney-mono.webp' },
  { nombre: 'Adidas', logo: 'marcas/adidas-mono.webp' },
  { nombre: 'PedidosYa', logo: 'marcas/pedidosya-mono.webp' },
];

export type Ip = {
  /** slug estable: define la URL pública de su ficha */
  id: string;
  titulo: string;
  tipo: string;
  gancho?: string;
  sinopsis?: string;
  generos?: string[];
  anio?: string;
  duracion?: string;
  episodios?: number;
  direccion?: string;
  guion?: string;
  elenco?: string[];
  /** póster: se importa desde src/assets para que Astro lo optimice */
  poster?: ImageMetadata;
  /** Preserva las letras impresas en los pósters de proporción 2:3. */
  posterContain?: boolean;
  /** destino externo confirmado (por ejemplo, la serie en Shorta) */
  link?: { label: string; url: string };
};

// Fuentes editoriales: fichas de Shorta y del WordPress actual de GB Films;
// para El Condenado y El Sonido del Viento, SINOPSIS-cortos Santi.docx.
// No inventar sinopsis ni créditos donde todavía no hay información confirmada.
export const ips: Ip[] = [
  {
    id: 'archivo-x',
    titulo: 'Archivo X',
    tipo: 'Serie',
    poster: archivoX,
    gancho: 'Un año borrado de la memoria. Demasiadas pistas para ignorar.',
    sinopsis: 'Tras un accidente en su librería, Martín pierde los recuerdos del último año. Al despertar, cree estar envuelto en una trama criminal relacionada con el dueño de la lavandería del centro comercial, decidido a comprar todos los locales. Mientras intenta reconstruir lo ocurrido, cada mensaje y cada conversación parecen esconder algo; recuperar la memoria podría cambiar por completo lo que cree saber.',
    generos: ['Comedia', 'Romance'],
    episodios: 31,
    direccion: 'Teo Tamales',
    elenco: ['Benjamín Rojas', 'Adrián Lakerman', 'Candela Molfese', 'Pablo El Pupi'],
    link: { label: 'Ver en Shorta', url: 'https://www.shorta.com/series/archivo-x' },
  },
  {
    id: 'jubilada-y-peligrosa',
    titulo: 'Jubilada y Peligrosa',
    tipo: 'Serie',
    poster: jubilada,
    gancho: 'Amalia dejó el espionaje. El espionaje no la dejó a ella.',
    sinopsis: 'Amalia, una abuela con pasado de agente de inteligencia, no tiene planes de quedarse quieta. Cuando su nieta es tomada como rehén en un supermercado, vuelve a la acción y termina enfrentándose a mafias barriales mientras se convierte, casi sin querer, en una heroína viral.',
    generos: ['Comedia', 'Familiar'],
    episodios: 44,
    direccion: 'Teo Tamales',
    guion: 'Andrea Ise Lasbaines, Ezequiel Golstein y Javier Correa Cáceres',
    elenco: ['Romina Sznaider', 'Maite Lanata', 'Fabián Arenillas', 'Chichilo Viale'],
    link: {
      label: 'Ver en Shorta',
      url: 'https://www.shorta.com/series/jubilada-y-peligrosa',
    },
  },
  {
    id: 'ruma',
    titulo: 'Rumá',
    tipo: 'Serie',
    poster: ruma,
    gancho: 'Tres streamers. Una casa abandonada. Un vivo que no debió empezar.',
    sinopsis: 'Tres amigos entran a una casona abandonada a las afueras de Buenos Aires para transmitir en directo. La propiedad arrastra una tragedia que el barrio prefiere callar. Lo que iba a ser contenido para ganar seguidores se transforma en una noche de terror cuando descubren que no están solos.',
    generos: ['Terror', 'Suspenso'],
    episodios: 34,
    direccion: 'Santiago Rey',
    guion: 'Gabriel Korenfeld',
    elenco: ['Balthazar Murillo', 'Byron Barbieri', 'Nicolas Borroni'],
    link: { label: 'Ver en Shorta', url: 'https://www.shorta.com/series/ruma' },
  },
  { id: 'rendering', titulo: 'Rendering', tipo: 'Short Film', poster: rendering, posterContain: true },
  {
    id: 'el-condenado', titulo: 'El Condenado', tipo: 'Short Film', poster: elCondenado, posterContain: true,
    gancho: 'Hay cosas de las que no se puede escapar.',
    sinopsis: 'Un hombre llega al campo para deshacerse de aquello que lo atormenta. La tarea se convierte en una pesadilla en la que la soledad, la culpa y el miedo desdibujan la frontera entre lo real y lo imaginado.',
    anio: '2025', duracion: '17 min', direccion: 'Santiago Rey',
  },
  {
    id: 'cucaracha', titulo: 'Cucaracha', tipo: 'Short Film', poster: cucaracha, posterContain: true,
    gancho: 'Todo empieza con una cucaracha en una tostada.',
    sinopsis: 'Encerrado en su departamento, un hombre encuentra una cucaracha en su tostada. La repulsión inicial se convierte en una espiral de paranoia y desesperación mientras los insectos invaden su hogar y la realidad empieza a desmoronarse. Hasta su propio cuerpo deja de parecerle un refugio.',
    generos: ['Horror', 'Suspenso'], direccion: 'Anita Serrano', guion: 'Anita Serrano',
    link: { label: 'Conocé Cucaracha', url: 'https://www.anitaserrano.com/cucaracha' },
  },
  {
    id: 'el-diente-negro', titulo: 'El Diente Negro', tipo: 'Short Film', poster: elDienteNegro, posterContain: true,
    gancho: 'Un huésped maligno entre la memoria y la culpa.',
    sinopsis: 'En un asilo, un noticiero sobre niños desaparecidos reabre una herida en una mujer. Al mismo tiempo, Daniel enfrenta un interrogatorio mientras lo acorralan voces infantiles y recuerdos fragmentados. La aparición de un diente negro une las dos historias en un rompecabezas donde se confunden la verdad, la memoria y la culpa.',
    generos: ['Horror'], direccion: 'Anita Serrano', guion: 'Anita Serrano',
    link: { label: 'Conocé El Diente Negro', url: 'https://www.anitaserrano.com/dientenegro' },
  },
  {
    id: 'el-sonido-del-viento', titulo: 'El Sonido del Viento', tipo: 'Short Film', poster: elSonidoDelViento, posterContain: true,
    gancho: 'Una casa, un altillo y los recuerdos que esperan arriba.',
    sinopsis: 'Román vive solo en una antigua casa a las afueras de Buenos Aires. Después de postergarlo durante mucho tiempo, decide subir al altillo: un espacio polvoriento que guarda los recuerdos a los que todavía no se había animado a enfrentarse.',
    anio: '2024', duracion: '13 min', direccion: 'Santiago Rey', guion: 'Santiago Rey',
  },
  {
    id: 'noku', titulo: 'Noku', tipo: 'Short Film', poster: noku,
    sinopsis: 'En el lejano planeta Noku, una tranquila familia alienígena vive su rutina mientras extraños acontecimientos comienzan a alterar su mundo.',
    duracion: '10 min 13 s', direccion: 'Guido Boetsch',
    link: { label: 'Ver Noku en Higgsfield', url: 'https://higgsfield.ai/@bani/projects/noku' },
  },
];

export type Hermana = {
  nombre: string;
  rol: string;
  texto: string;
  logo: string;
  url: string;
};

export const hermanas: Hermana[] = [
  {
    nombre: 'Gran Berta',
    logo: 'universo/gran-berta.webp',
    rol: 'La madre · desde 2015',
    texto:
      'El universo original: contenido propio y comunidad. +2M de seguidores, +400M de vistas, 365 vlogs. Si querés, podés.',
    url: 'https://granberta.com/',
  },
  {
    nombre: 'Bani VFX',
    logo: 'universo/bani-monograma.webp',
    rol: 'Post-producción',
    texto:
      'La empresa de post nacida dentro de Gran Berta. Largometrajes, contenido para The Rock y Zach King, comerciales globales.',
    url: 'https://bani-vfx.com/',
  },
  {
    nombre: 'Totem Rental',
    logo: 'universo/totem.webp',
    rol: 'Rental de producción audiovisual',
    texto:
      'Alquiler de utilería, mobiliario y vestuario para cine, TV, publicidad, teatro y contenidos en Buenos Aires. Objetos con carácter para historias que se ven.',
    url: 'https://gb-films.github.io/Totem/',
  },
];

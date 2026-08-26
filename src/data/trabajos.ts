import archivoX from '../assets/ficcion/archivo-x.jpg';
import jubilada from '../assets/ficcion/jubilada-y-peligrosa.jpg';
import ruma from '../assets/ficcion/ruma.jpg';

export type Pieza = {
  /** URL del trabajo: link de Instagram, embed de YouTube/Vimeo o archivo .mp4 */
  url: string;
  /** IP o campaña, si la pieza fue para algo puntual. Se muestra "MARCA × TÍTULO". */
  titulo?: string;
};

export type Marca = {
  nombre: string;
  /** logo en /public/marcas/. Sin logo se muestra el nombre en Anton. */
  logo?: string;
  /** Trabajos de esa marca. Sin piezas, la tarjeta es solo logo y no se clickea. */
  piezas?: Pieza[];
};

/**
 * Los links de Instagram se aceptan tal cual se copian del navegador (`/p/` o
 * `/reel/`): `urlEmbed()` los convierte al formato embebible.
 *
 * TODO: los embeds de Instagram le ponen la cabecera y el botón "Ver perfil"
 * de Meta encima del trabajo, y son verticales. Cuando estén los mp4 (o los
 * links de YouTube/Vimeo) se reemplazan acá y el resto funciona igual.
 */
export function urlEmbed(url: string): string {
  const ig = url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/);
  return ig ? `https://www.instagram.com/p/${ig[1]}/embed/` : url;
}

/** Instagram es vertical; la tarjeta abierta cambia de forma según esto. */
export function esVertical(url: string): boolean {
  return /instagram\.com/.test(url);
}

// El orden del array es el orden en que aparecen en la franja.
export const marcas: Marca[] = [
  {
    nombre: 'Netflix',
    piezas: [
      { url: 'https://www.instagram.com/p/DSp6FnfAFvt/', titulo: 'Stranger Things' },
      { url: 'https://www.instagram.com/p/DSIXPVvAib2/', titulo: 'Stranger Things' },
      { url: 'https://www.instagram.com/p/DRxSYgujkkG/', titulo: 'Stranger Things' },
    ],
  },
  {
    nombre: 'Prime Video',
    piezas: [
      { url: 'https://www.instagram.com/p/DZVvhd4ODQP/', titulo: 'Spider-Noir' },
      { url: 'https://www.instagram.com/p/DNoMQFEA_2O/' },
    ],
  },
  {
    nombre: 'Samsung',
    piezas: [
      { url: 'https://www.instagram.com/p/DMtCnCfS6Ax/' },
      { url: 'https://www.instagram.com/reel/DXKIOdQk15C/' },
    ],
  },
  {
    nombre: 'Microsoft',
    piezas: [
      { url: 'https://www.instagram.com/p/DMLqEvtvv7k/', titulo: 'Minecraft' },
      { url: 'https://www.instagram.com/p/DMdpWQ4PVp0/', titulo: 'Minecraft' },
    ],
  },
  {
    nombre: 'Xbox',
    piezas: [
      { url: 'https://www.instagram.com/reel/DYPsUV-yh19/', titulo: 'Forza Horizon' },
      { url: 'https://www.instagram.com/reel/DYScISPkpR0/', titulo: 'Forza Horizon' },
      { url: 'https://www.instagram.com/reel/DYVA6U6DsTh/', titulo: 'Forza Horizon' },
    ],
  },
  {
    nombre: 'HBO Max',
    piezas: [
      { url: 'https://www.instagram.com/p/C8nTxrhvhk3/', titulo: 'House of the Dragon' },
    ],
  },
  {
    // Misma pieza que HBO Max: fue una acción de las dos marcas juntas, y
    // cuenta como antecedente para las dos.
    nombre: 'Mercado Libre',
    piezas: [
      { url: 'https://www.instagram.com/p/C8nTxrhvhk3/', titulo: 'House of the Dragon' },
    ],
  },
  {
    nombre: 'Axe',
    piezas: [{ url: 'https://www.instagram.com/p/C8XQ3xsuMa3/' }],
  },
  {
    nombre: 'ICBC',
    piezas: [{ url: 'https://www.instagram.com/reel/DCSRGsSP_1E/' }],
  },
  {
    nombre: 'Alfajores Jorgito',
    piezas: [{ url: 'https://www.instagram.com/p/DZzqHtzOk6S/' }],
  },
  {
    nombre: 'Sprite',
    piezas: [{ url: 'https://www.instagram.com/p/DUT8Umzj3is/' }],
  },
  {
    nombre: 'Shell',
    piezas: [{ url: 'https://www.instagram.com/p/DQIJh4-jWD9/' }],
  },
  {
    nombre: 'Conmebol',
    piezas: [{ url: 'https://www.instagram.com/p/DHoUxSdOufj/' }],
  },
  {
    nombre: '9GAG',
    piezas: [{ url: 'https://www.instagram.com/p/C9QpsQnPcwH/', titulo: 'PUBG Mobile' }],
  },
  {
    nombre: 'Trenet',
    piezas: [
      { url: 'https://www.instagram.com/p/DR5xKbKDePM/' },
      { url: 'https://www.instagram.com/p/DSVxXIcj3fT/' },
      { url: 'https://www.instagram.com/p/DTJROZijxab/' },
    ],
  },
  {
    nombre: 'Andes',
    piezas: [{ url: 'https://www.instagram.com/p/C_bkKcFvaPv/' }],
  },
  {
    nombre: 'Baldo',
    piezas: [{ url: 'https://www.instagram.com/p/DZK0cjyh9j3/' }],
  },
  {
    nombre: 'ZonaProp',
    piezas: [{ url: 'https://www.instagram.com/p/DNDliYaA_KH/' }],
  },
  // Sin piezas: pesan por el nombre, pero no se pueden clickear.
  { nombre: 'Disney' },
  { nombre: 'Adidas' },
  { nombre: 'PedidosYa' },
];

export type Ip = {
  /** slug estable: se usa para vincular la tarjeta con su ficha */
  id: string;
  titulo: string;
  tipo: string;
  /** IP en producción: se muestra con candado y badge */
  locked?: boolean;
  badge?: string;
  /** ficha que se abre al clickear la tarjeta */
  sinopsis?: string;
  formato?: string;
  estado?: string;
  /** póster: se importa desde src/assets para que Astro lo optimice */
  poster?: ImageMetadata;
  /** dónde se puede ver la serie */
  link?: { label: string; url: string };
};

// TODO(brief): faltan sinopsis, formato, estado y póster de cada IP. La ficha
// ya está armada: en cuanto se completen estos campos aparecen solos.
// Primero las tres que ya se estrenaron en Shorta (son las que tienen póster y
// link); después las que todavía no tienen material; al final la que está en
// producción.
export const ips: Ip[] = [
  {
    id: 'archivo-x',
    titulo: 'Archivo X',
    tipo: 'Serie',
    poster: archivoX,
    link: { label: 'Ver en Shorta', url: 'https://www.shorta.com/series/archivo-x' },
  },
  {
    id: 'jubilada-y-peligrosa',
    titulo: 'Jubilada y Peligrosa',
    tipo: 'Serie',
    poster: jubilada,
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
    link: { label: 'Ver en Shorta', url: 'https://www.shorta.com/series/ruma' },
  },
  { id: 'rendering', titulo: 'Rendering', tipo: 'Ficción' },
  { id: 'el-condenado', titulo: 'El Condenado', tipo: 'Ficción' },
  { id: 'cucaracha', titulo: 'Cucaracha', tipo: 'Ficción' },
  { id: 'el-diente-negro', titulo: 'El Diente Negro', tipo: 'Ficción' },
  {
    id: 'modelos-del-segundo-piso',
    titulo: 'Modelos del Segundo Piso',
    tipo: 'Próximamente · 2027',
    locked: true,
    badge: 'En producción',
  },
];

export type Hermana = {
  nombre: string;
  rol: string;
  texto: string;
};

export const hermanas: Hermana[] = [
  {
    nombre: 'Gran Berta',
    rol: 'La madre · desde 2015',
    texto:
      'El universo original: contenido propio y comunidad. +2M de seguidores, +400M de vistas, 365 vlogs. Si querés, podés.',
  },
  {
    nombre: 'Bani VFX',
    rol: 'Post-producción',
    texto:
      'La empresa de post nacida dentro de Gran Berta. Largometrajes, contenido para The Rock y Zach King, comerciales globales.',
  },
];

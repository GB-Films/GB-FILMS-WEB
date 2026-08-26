/**
 * Dominio de producción. Todo lo que no sea este host se considera un preview:
 * se publica con noindex para que no se indexe antes de tiempo.
 * Si cambia, actualizar también DOMINIO_PROD en astro.config.mjs.
 */
export const DOMINIO_PROD = 'granbertafilms.com';

export const site = {
  name: 'Gran Berta Films',
  shortName: 'GB Films',
  tagline: 'Hacemos Cultura.',
  city: 'Buenos Aires',
  country: 'Argentina',
  description:
    'Productora de Buenos Aires: publicidades, contenido digital, videoclips y ficción. La cultura no se observa, se hace.',
  // TODO(brief): confirmar dominio y correo de contacto definitivos.
  locale: 'es_AR',
  lang: 'es',
} as const;

export type NavLink = { href: string; label: string };

// El orden tiene que ser el mismo que el de las secciones en index.astro. Si no,
// recorrer el menú de izquierda a derecha hace saltar hacia atrás, y el
// scrollspy (que resuelve empates por este orden) enciende el link equivocado.
export const navLinks: NavLink[] = [
  // "Trabajos" apunta a la franja de marcas, que es la prueba social y va
  // primero; el reel queda más abajo, en la sección #trabajos.
  { href: '#marcas', label: 'Trabajos' },
  { href: '#que', label: '¿Qué carajo?' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#ficcion', label: 'Ficción' },
  { href: '#tienda', label: 'Tienda' },
  { href: '#universo', label: 'Universo' },
];

export const navCta = { href: '#contacto', label: 'Trabajemos juntos' };

/**
 * Contacto comercial. Hoy el sitio apunta a marcas y agencias: por eso los dos
 * canales son directos (WhatsApp y mail) y no hay formulario.
 */
export const contacto = {
  /**
   * WhatsApp Business de GB Films, en formato internacional y solo dígitos:
   * sin "+", ni espacios, ni guiones. Si queda vacío, el botón de contacto se
   * muestra apagado y el link del footer directamente no aparece.
   */
  whatsapp: '5491138267966',
  whatsappMensaje: 'Hola, quiero hacer un proyecto con GB Films.',
  email: 'agustin@granberta.com',
  emailAsunto: 'Propuesta comercial',
};

/** Línea secundaria para talento, en el footer: hoy no es el foco del sitio. */
export const talento = {
  texto: '¿Sos actor, técnico o creativo y querés trabajar con nosotros?',
  label: 'Escribinos',
  asunto: 'Quiero sumarme a la base de talento',
};

export type Red = { label: string; href: string };

const redesFijas: Red[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/granbertafilms' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@granbertafilms' },
  { label: 'YouTube', href: 'https://www.youtube.com/@granbertafilms' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/granbertafilms/' },
];

/**
 * Redes del footer. WhatsApp sale de `contacto.whatsapp`: mientras ese número
 * esté vacío no aparece el link, así no queda uno muerto en el footer. En
 * cuanto se cargue el número se activan de una los dos lugares (el botón de la
 * sección de contacto y este link).
 */
export const redes: Red[] = [
  ...redesFijas,
  ...(contacto.whatsapp
    ? [
        {
          label: 'WhatsApp',
          href: `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(contacto.whatsappMensaje)}`,
        },
      ]
    : []),
];

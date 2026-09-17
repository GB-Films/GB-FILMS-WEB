import type { APIRoute } from 'astro';
import { DOMINIO_PROD } from '~/data/site';

/**
 * robots.txt dinámico: en producción abre todo y publica el sitemap; en
 * cualquier deploy de preview cierra el sitio entero para que no se indexe
 * antes del lanzamiento.
 */
export const GET: APIRoute = ({ site }) => {
  const esPreview =
    site?.hostname !== DOMINIO_PROD ||
    import.meta.env.MODE === 'preview' ||
    import.meta.env.PUBLIC_PREVIEW === '1';

  const cuerpo = esPreview
    ? ['User-agent: *', 'Disallow: /', ''].join('\n')
    : ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', site)}`, ''].join(
        '\n',
      );

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

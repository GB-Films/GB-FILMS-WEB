// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO(brief): confirmar el dominio definitivo.
// Si cambia, actualizar también DOMINIO_PROD en src/data/site.ts.
const DOMINIO_PROD = 'https://granbertafilms.com';

/**
 * En un deploy de preview queremos que canonical, OG y sitemap apunten a ESA
 * URL y no a la de producción. Netlify, Vercel y Cloudflare publican la URL del
 * deploy en distintas variables; las leemos todas y si no hay ninguna, asumimos
 * producción.
 */
const SITE =
  process.env.PUBLIC_SITE_URL ||
  process.env.CF_PAGES_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  DOMINIO_PROD;

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  build: {
    // Sitio de una sola página: inlinear el CSS crítico evita un round-trip.
    inlineStylesheets: 'auto',
  },
});

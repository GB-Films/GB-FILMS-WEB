import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Recursos propios para las vistas del portfolio. Nunca se inserta la UI de Instagram. */
export function vistaPieza(url: string, base: string, recursos: { video?: string; poster?: string } = {}) {
  const instagram = url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/)?.[1];
  if (!instagram) return null;

  const video = recursos.video ?? `portfolio/videos/${instagram}.mp4`;
  const fotograma = recursos.poster ?? `portfolio/videos/${instagram}.webp`;
  return {
    poster: `${base}${existsSync(join(process.cwd(), 'public', fotograma)) ? fotograma : `portfolio/${instagram}.webp`}`,
    video: existsSync(join(process.cwd(), 'public', video)) ? `${base}${video}` : undefined,
  };
}

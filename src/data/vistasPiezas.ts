import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Recursos propios para las vistas del portfolio. Nunca se inserta la UI de Instagram. */
export function vistaPieza(url: string, base: string, recursos: { video?: string; poster?: string } = {}): { poster: string; video?: string } | null {
  const local = (ruta?: string) => ruta && existsSync(join(process.cwd(), 'public', ruta)) ? `${base}${ruta}` : undefined;
  const youtube = url.match(/^https?:\/\/(?:youtu\.be\/|(?:www\.)?youtube\.com\/(?:watch\?[^#]*?\bv=|embed\/|shorts\/))([\w-]{11})(?:[/?&#]|$)/)?.[1];
  if (youtube) {
    const video = local(recursos.video);
    return {
      poster: local(recursos.poster) ?? `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`,
      video,
    };
  }
  const instagram = url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/)?.[1];
  if (!instagram) {
    const video = local(recursos.video);
    const poster = local(recursos.poster);
    return video || poster ? { poster: poster ?? '', video } : null;
  }

  const video = recursos.video ?? `portfolio/videos/${instagram}.mp4`;
  const fotograma = recursos.poster ?? `portfolio/videos/${instagram}.webp`;
  return {
    poster: local(fotograma) ?? local(`portfolio/${instagram}.webp`) ?? '',
    video: local(video),
  };
}

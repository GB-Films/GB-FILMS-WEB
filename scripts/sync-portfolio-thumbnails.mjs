import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = readFileSync(new URL('../src/data/trabajos.ts', import.meta.url), 'utf8');
const urls = [...new Set(source.match(/https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[\w-]+\//g) ?? [])];
const out = fileURLToPath(new URL('../public/portfolio/', import.meta.url));
mkdirSync(out, { recursive: true });

for (const url of urls) {
  const id = new URL(url).pathname.split('/')[2];
  const file = join(out, `${id}.webp`);
  if (existsSync(file)) continue;
  try {
    const page = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!page.ok) throw new Error(`HTTP ${page.status}`);
    const html = await page.text();
    const imageUrl = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&');
    if (!imageUrl) throw new Error('sin miniatura pública');
    const image = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!image.ok) throw new Error(`imagen HTTP ${image.status}`);
    const bytes = Buffer.from(await image.arrayBuffer());
    await sharp(bytes).resize(900, 560, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(file);
    console.log(`${id}: listo`);
  } catch (error) {
    console.warn(`${id}: ${error.message}`);
  }
}

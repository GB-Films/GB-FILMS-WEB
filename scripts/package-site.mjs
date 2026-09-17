import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const channel = process.argv[2];
if (!['preview', 'production'].includes(channel)) throw new Error('Usar preview o production.');
const base = channel === 'preview' ? '/preview/' : '/';
const site = 'https://granbertafilms.com';
const env = { ...process.env, PUBLIC_SITE_URL: site, PUBLIC_BASE_PATH: base, PUBLIC_PREVIEW: channel === 'preview' ? '1' : '0' };
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { cwd: root, env, stdio: 'inherit', ...options });
  if (result.error || result.status !== 0) throw result.error || new Error(`${command} terminó con código ${result.status}`);
  return result;
};
const astro = join(root, 'node_modules', 'astro', 'astro.js');
if (!existsSync(astro)) throw new Error('Instalar dependencias con npm ci primero.');
run(process.execPath, [astro, 'check']);
run(process.execPath, [astro, 'build', '--mode', channel === 'preview' ? 'preview' : 'production']);

const sha256 = data => createHash('sha256').update(data).digest('hex');
const files = {};
const allowed = /\.(?:html|css|js|svg|png|jpe?g|webp|gif|ico|woff2?|ttf|mp4|webm|txt|xml|json|webmanifest)$/i;
const dist = join(root, 'dist');
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (lstatSync(path).isSymbolicLink() || entry.name.startsWith('.')) throw new Error(`Archivo no publicable: ${entry.name}`);
    if (entry.isDirectory()) inspect(path);
    else {
      if (!entry.isFile() || !allowed.test(entry.name)) throw new Error(`Tipo no publicable: ${entry.name}`);
      files[relative(dist, path).replaceAll('\\', '/')] = sha256(readFileSync(path));
    }
  }
}
inspect(dist);
for (const page of ['index.html', '404.html']) {
  const html = readFileSync(join(dist, page), 'utf8');
  const noindex = /<meta\s+name="robots"\s+content="noindex, nofollow"/.test(html);
  if (noindex !== (channel === 'preview')) throw new Error(`Indexación incorrecta: ${page}`);
}
const index = readFileSync(join(dist, 'index.html'), 'utf8');
if (!index.includes(`rel="canonical" href="${site}${base}"`)) throw new Error('Canonical incorrecto.');
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
if (channel === 'preview' ? !robots.includes('Disallow: /') : !robots.includes('Allow: /')) throw new Error('robots.txt incorrecto.');
const revision = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout?.trim() || 'sin-git';
const dirty = Boolean(spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout?.trim());
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const id = `${timestamp}-${revision}-${channel}`;
const output = join(root, '.releases');
const directory = join(output, id);
mkdirSync(directory, { recursive: true });
cpSync(dist, join(directory, 'site'), { recursive: true });
const manifest = { version: 1, id, channel, site, base, revision, dirty, files };
writeFileSync(join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const bundle = join(output, `${id}.tar.gz`);
run(process.platform === 'win32' ? 'tar.exe' : 'tar', ['-czf', bundle, '-C', directory, 'manifest.json', 'site']);
const digest = sha256(readFileSync(bundle));
writeFileSync(`${bundle}.sha256`, `${digest}  ${id}.tar.gz\n`);
console.log(JSON.stringify({ id, bundle, sha256: digest, url: `${site}${base}`, files: Object.keys(files).length }, null, 2));

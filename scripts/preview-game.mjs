import { spawnSync, spawn } from 'node:child_process';

const env = { ...process.env, PUBLIC_GAME_PROTOTYPE: '1', PUBLIC_PREVIEW: '1' };
const cli = 'node_modules/astro/astro.js';
const check = spawnSync(process.execPath, [cli, 'check'], { env, stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);
const build = spawnSync(process.execPath, [cli, 'build'], { env, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);
const server = spawn(process.execPath, [cli, 'preview', '--host', '127.0.0.1', '--port', '4335'], { env, stdio: 'inherit' });
process.on('SIGINT', () => server.kill('SIGINT'));
server.on('exit', (code) => process.exit(code ?? 0));

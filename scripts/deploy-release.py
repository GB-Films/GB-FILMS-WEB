#!/usr/bin/env python3
"""Install a verified static release; never write to the WordPress directory."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import tarfile

BASE = Path('/var/www/granberta-nueva')
ALLOWED = {'.html', '.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.mp4', '.webm', '.txt', '.xml', '.json', '.webmanifest'}


def validate_bundle(archive, expected_hash, channel):
    digest = hashlib.sha256(Path(archive).read_bytes()).hexdigest()
    if not re.fullmatch(r'[0-9a-f]{64}', expected_hash.lower()) or digest != expected_hash.lower():
        raise ValueError('El SHA-256 del paquete no coincide.')
    content = {}
    names = set()
    total = 0
    with tarfile.open(archive, 'r:gz') as bundle:
        for member in bundle:
            path = PurePosixPath(member.name)
            name = str(path)
            if path.is_absolute() or '..' in path.parts or name in names:
                raise ValueError('Ruta insegura o duplicada en el paquete.')
            names.add(name)
            if len(names) > 10000 or member.size > 200 * 1024 * 1024:
                raise ValueError('Paquete demasiado grande.')
            if not (member.isdir() or member.isfile()):
                raise ValueError('El paquete contiene enlaces o archivos especiales.')
            if name != 'manifest.json' and path.parts[0] != 'site':
                raise ValueError('Contenido fuera del directorio del sitio.')
            if member.isdir():
                continue
            total += member.size
            if total > 1024 * 1024 * 1024:
                raise ValueError('Paquete demasiado grande.')
            content[name] = bundle.extractfile(member).read()
    manifest = json.loads(content.pop('manifest.json'))
    if manifest.get('version') != 1 or manifest.get('channel') != channel:
        raise ValueError('Formato o canal incorrecto.')
    if not re.fullmatch(r'\d{8}T\d{6}Z-[0-9a-f]{7,40}-(preview|production)', manifest.get('id', '')):
        raise ValueError('Identificador de release no válido.')
    base = '/preview/' if channel == 'preview' else '/'
    if manifest.get('base') != base or manifest.get('site') != 'https://granbertafilms.com':
        raise ValueError('Dominio o ruta de publicación incorrectos.')
    files = manifest.get('files', {})
    if not files or set(content) != {'site/' + name for name in files}:
        raise ValueError('El manifiesto no coincide con los archivos del paquete.')
    for name, expected in files.items():
        path = PurePosixPath(name)
        if path.is_absolute() or '..' in path.parts or any(part.startswith('.') for part in path.parts) or path.suffix.lower() not in ALLOWED:
            raise ValueError('Archivo no publicable: ' + name)
        if hashlib.sha256(content['site/' + name]).hexdigest() != expected:
            raise ValueError('Archivo alterado: ' + name)
    for page in ['index.html', '404.html']:
        html = content['site/' + page].decode('utf8')
        if ('name="robots" content="noindex, nofollow"' in html) != (channel == 'preview'):
            raise ValueError('Indexación incorrecta: ' + page)
    if ('rel="canonical" href="https://granbertafilms.com' + base + '"').encode() not in content['site/index.html']:
        raise ValueError('Canonical incorrecto.')
    if (b'Disallow: /' if channel == 'preview' else b'Allow: /') not in content['site/robots.txt']:
        raise ValueError('robots.txt incorrecto.')
    return manifest, content


def deploy(archive, expected_hash, channel):
    if os.geteuid() != 0:
        raise PermissionError('Ejecutar con sudo en wordpress-1-vm.')
    if os.uname().nodename != 'wordpress-1-vm':
        raise ValueError('Servidor inesperado.')
    manifest, content = validate_bundle(archive, expected_hash, channel)
    BASE.mkdir(mode=0o755, exist_ok=True)
    if BASE.resolve() != BASE:
        raise ValueError('El directorio base no debe ser un enlace.')
    releases = BASE / 'releases'
    releases.mkdir(mode=0o755, exist_ok=True)
    if releases.resolve() != releases:
        raise ValueError('El directorio releases no debe ser un enlace.')
    import fcntl
    lock_fd = os.open(str(BASE / '.deploy.lock'), os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
    with os.fdopen(lock_fd, 'w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        target = releases / manifest['id']
        target.mkdir(mode=0o755)  # Fails if this release already exists.
        for name, data in content.items():
            destination = target / name
            destination.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
            with destination.open('xb') as stream:
                stream.write(data)
            destination.chmod(0o644)
        (target / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
        link = BASE / ('preview' if channel == 'preview' else 'current')
        previous = os.readlink(link) if link.is_symlink() else None
        if link.exists() and not link.is_symlink():
            raise ValueError('El destino activo existe y no es un enlace; no se reemplazó.')
        if previous is not None and not link.resolve().is_relative_to(releases):
            raise ValueError('El enlace anterior apunta fuera de releases.')
        temporary = BASE / ('.' + link.name + '-' + manifest['id'])
        temporary.symlink_to(Path('releases') / manifest['id'] / 'site')
        os.replace(temporary, link)
        record = {'release': manifest['id'], 'channel': channel, 'previous': previous, 'sha256': expected_hash}
        with (BASE / 'deployments.jsonl').open('a') as history:
            history.write(json.dumps(record) + '\n')
        print(json.dumps({**record, 'active': str(link), 'files': len(content)}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive')
    parser.add_argument('--sha256', required=True)
    parser.add_argument('--channel', choices=['preview', 'production'], required=True)
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    if args.check_only:
        manifest, content = validate_bundle(args.archive, args.sha256, args.channel)
        print(json.dumps({'valid': True, 'release': manifest['id'], 'files': len(content)}))
    else:
        deploy(args.archive, args.sha256, args.channel)

# Publicación en Google Cloud

## Infraestructura y límites

Datos proporcionados por el responsable del sitio:

- Proyecto: `gran-berta-films`.
- Cuenta de acceso: `info@granbertafilms.com`. El titular completa el inicio de sesión y el segundo factor directamente en Google.
- VM: `wordpress-1-vm`, zona `northamerica-northeast1-a`.
- IP externa: `34.152.39.181`.
- Apache, WordPress, PHP 8.1 y MySQL 8.0.
- Producción: `/var/www/html`. No reemplazar, borrar ni sincronizar archivos sobre esa carpeta.
- El registrador es Squarespace Domains. La delegación activa usa `ns-cloud-a1` a `ns-cloud-a4.googledomains.com`. No modificar MX ni TXT, incluidos los registros de verificación, SPF, DKIM y DMARC.
- No reactivar `/phpmyadmin`, `wp-file-manager` ni el plugin `fix`.
- No actualizar masivamente WordPress, plugins ni tema.
- No incorporar contraseñas, claves, archivos de entorno ni credenciales al repositorio o al paquete publicado.

Respaldos informados:

- Instantánea `post-limpieza-2026-07-29` (pendiente de verificar en la consola).
- SQL `/root/wordpress-db-clean-2026-07-30.sql.gz` (verificado en la VM).
- Cuarentena `/root/wp-quarantine-2026-07-29` (verificada en la VM).

## Vista previa activa

- URL: `https://granbertafilms.com/preview/`.
- Directorio separado: `/var/www/granberta-nueva`.
- Cada publicación se guarda en `releases/<identificador>`. El enlace `preview` selecciona la release visible; `current` se reserva para producción.
- Servir únicamente los archivos estáticos compilados. No es necesario ejecutar Node, PHP o MySQL para esta web.
- Apache sirve `/preview/` mediante un alias separado. El `DocumentRoot` de WordPress continúa en `/var/www/html`.

## Generación de releases

En una terminal PowerShell dedicada, dentro del repositorio:

```powershell
npm.cmd ci
npm.cmd run release:preview
```

El comando genera el build, lo valida y crea en `.releases/` un `.tar.gz`, un
manifiesto y su SHA-256. No usa archivos `.env` ni incluye código fuente,
dependencias o credenciales.

Comprobar antes de transferir:

- `index.html` y `404.html` llevan `noindex, nofollow`.
- Canonical, recursos, Open Graph y sitemap usan `/preview/`.
- `robots.txt` contiene `Disallow: /`.
- El paquete contiene solamente `dist/`, sin `.git`, dependencias, código del servidor ni archivos de entorno o credenciales.

`noindex` evita la indexación; no restringe el acceso de visitantes.

## Secuencia de actualización habitual

1. Editar el repositorio y ejecutar `npm run release:preview`.
2. Transferir el paquete a la VM y comprobar su SHA-256.
3. Ejecutar `/usr/local/sbin/granberta-deploy <paquete> --sha256 <hash> --channel preview`. El instalador valida rutas, tipos, manifiesto y contenido antes de cambiar el enlace activo.
4. Revisar `https://granbertafilms.com/preview/` en escritorio y móvil.
5. Cuando el usuario apruebe producción, generar una release nueva con `npm run release:production`; crear y verificar una instantánea; desplegar con `--channel production`; cambiar Apache a `current`; probar y conservar WordPress como rollback.

## Verificación local del 17 de septiembre de 2026

- Instalación de dependencias reproducible mediante `npm ci`.
- Compilación de producción y preview: 26 archivos comprobados, sin errores ni advertencias del compilador.
- Salida estática; la página no tiene formularios ni servicio de envío de correo. Los enlaces comerciales y de talento usan `agustin@granberta.com`; WhatsApp usa el número configurado en `src/data/site.ts`.
- Revisión visual en escritorio de 1440 × 900 y móvil de 390 × 844. No se detectaron imágenes rotas, anclas inexistentes, desborde horizontal ni errores de consola en la portada.
- La portada no presenta imágenes fallidas ni anclas internas inexistentes en la inspección inicial.
- La imagen para compartir en redes y cinco retratos del equipo están incluidos. Faltan las fotos de Toto y Ame y los videos principales; hay contenido de muestra indicado en la página.
- `npm audit` informa 6 paquetes con alertas (1 crítica, 4 altas y 1 baja). No se aplicaron actualizaciones automáticas. La propuesta publica solamente archivos estáticos; las dependencias de compilación requieren una revisión aparte antes del lanzamiento definitivo.

## Estado público observado

- `https://granbertafilms.com/`: HTTP 200 con Apache/WordPress.
- `https://www.granbertafilms.com/`: HTTP 301 hacia el dominio sin `www`.
- `https://granbertafilms.com/preview/`: HTTP 200 y `noindex`. La release activa se consulta con `readlink /var/www/granberta-nueva/preview`; el historial queda registrado en `/var/www/granberta-nueva/deployments.jsonl`.
- A del dominio principal: `34.152.39.181`.
- CNAME de `www`: `granbertafilms.com`.
- La zona `granbertafilms` visible en el proyecto `gran-berta-films` usa `ns-cloud-d*` y contiene A `34.47.17.87`, pero no es autoritativa para el dominio. No modificarla como si fuera la zona activa.
- MX del dominio principal: prioridad 1, `smtp.google.com`.
- TXT SPF del dominio principal: `v=spf1 include:_spf.google.com ~all`.

Estas consultas públicas son una referencia inicial. No sustituyen la inspección de toda la zona DNS en Cloud, incluidos DKIM y DMARC.

## Antes de pasar a producción

- Cerrar la revisión de diseño, contenido, enlaces, contacto y correo. Un enlace `mailto:` válido no demuestra entrega de mensajes; la recepción debe comprobarla el titular con una prueba autorizada.
- Resolver los pendientes de contenido y las alertas de dependencias.
- Inventariar URLs actuales desde WordPress/sitemap y acordar equivalencias. La portada actual enlaza `/contacto/`, `/nosotros/`, `/proyectos/`, `/en/home/` y `/https-youtu-be-bxxsot9zusisibbff9lvspou3xkvb/`.
- Posibles equivalencias para revisar: `/contacto/` → `/#contacto`, `/nosotros/` → `/#nosotros`, `/proyectos/` → `/#marcas`. No aplicar todavía: falta el inventario completo y resolver la versión en inglés y la página de proyecto.
- Crear y verificar una nueva instantánea inmediatamente antes del cambio definitivo.
- Generar un paquete nuevo con `npm run release:production`. No reutilizar el paquete de preview que lleva `noindex`.
- Definir y verificar el retorno al VirtualHost anterior. Mantener intacto WordPress durante el cambio.
- Requerir una instrucción explícita para el cambio definitivo, una vez presentados los resultados de staging. La preparación de staging no implica que ese cambio ya esté autorizado.

## Referencias

- [SSH desde el navegador en Compute Engine](https://docs.cloud.google.com/compute/docs/connect/ssh-in-browser).
- [VirtualHosts por nombre en Apache](https://httpd.apache.org/docs/2.4/vhosts/name-based.html).

# GB Films: cambios y publicación desde ChatGPT

El usuario quiere pedir cambios en lenguaje natural y que el agente edite, compruebe y publique la web. La fuente de trabajo es este repositorio, no el WordPress anterior. Leer `CLAUDE.md`, `README.md` y `docs/publicacion-google-cloud.md` para el contexto de diseño e infraestructura.

## Trabajo habitual

- Inspeccionar `git status` al empezar y conservar cambios ajenos.
- Editar textos y datos en `src/data/`; componentes y estilos solo cuando corresponda.
- Generar una release con `npm run release:preview`. Los paquetes quedan en `.releases/`, fuera del control de versiones, con manifiesto y SHA-256.
- Revisar el sitio compilado y los cambios en escritorio y móvil. Dar al usuario un resultado concreto para revisar.
- El usuario pidió que cada cambio de la web se publique en el sitio público una vez comprobado, sin tener que pedirlo de nuevo. Completar la publicación dentro del alcance autorizado y no repetir confirmaciones ya concedidas. Si pide expresamente solo una prueba o diseño, entregar esa vista previa.
- Para producción generar un paquete nuevo con `npm run release:production`; nunca publicar como producción un paquete de preview con `noindex`.
- Mantener historial en Git y releases anteriores en el servidor. No afirmar que algo está publicado sin comprobar la URL pública y la versión servida.
- El repositorio de GitHub vigente es `https://github.com/GB-Films/GB-FILMS-WEB` (`origin`). Por pedido del usuario, guardar y subir allí cada cambio de la web después de comprobarlo, sin volver a pedir autorización. Verificar que el commit remoto coincida con el local antes de dar la sincronización por terminada. Si el usuario pide una prueba local, también respaldar su código en GitHub, pero respetar la indicación de no publicarla en la web. No usar el remoto `origin-anterior` para nuevas actualizaciones.

## Acceso y límites

- Cuenta Google Cloud: `info@granbertafilms.com`; proyecto `gran-berta-films`; VM `wordpress-1-vm`; zona `northamerica-northeast1-a`; IP confirmada inicialmente `34.152.39.181`.
- Acceder con la sesión Google autorizada y el SSH de Compute Engine. Si vence la sesión, el usuario inicia sesión y completa el segundo factor directamente en Google. No solicitar contraseñas por chat ni guardarlas en archivos.
- No crear credenciales persistentes ni conectar despliegues automáticos con permisos adicionales sin tratar esa configuración de acceso explícitamente con el usuario.
- `/var/www/html` contiene WordPress: no editar, reemplazar, mover ni borrar sus archivos. La nueva web usa `/var/www/granberta-nueva` y releases separadas.
- No modificar MX/TXT, activar phpMyAdmin, wp-file-manager o el plugin fix, ni actualizar masivamente WordPress.
- Crear y verificar una instantánea nueva antes del cambio inicial definitivo. Conservar la configuración anterior y un procedimiento de reversión.
- El 17/09/2026, la zona Cloud DNS `granbertafilms` de este proyecto era una zona NO autoritativa con NS `ns-cloud-d*` y A `34.47.17.87`. La delegación activa usa `ns-cloud-a*`; el registrador es Squarespace. No confundir las zonas ni cambiar la delegación. Se puede publicar en la VM actual sin cambiar DNS.
- No subir `.env`, claves, credenciales, dumps SQL, cuarentenas ni dependencias al repositorio o al contenido público.

## Estado y pendientes

Consultar el documento de publicación para el estado realmente verificado. Distinguir preparación local, transferencia, preview pública y producción; ninguna de estas etapas implica que la siguiente ya se completó.

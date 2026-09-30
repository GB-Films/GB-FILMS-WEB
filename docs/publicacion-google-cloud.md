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

## Producción activa — 30 de septiembre de 2026

- `https://granbertafilms.com/` sirve la release estática `20260929T175525Z-1d71daa-production` (130 archivos) desde `/var/www/granberta-nueva/current`. El paquete se comprobó en Cloud Shell y en la VM con SHA-256 `a591b5c6b2df8367f4097ad4d5b60aa2d3902b1da44f40d7b6a3845f4aa07975` y el instalador lo validó antes de activarlo.
- Antes del cambio se creó y verificó en estado `READY` la instantánea del disco de arranque `gbfilms-pre-static-20260930`.
- Apache usa `/etc/apache2/sites-enabled/granberta-static-https.conf`, a partir de [`deploy/apache/production-https.conf`](../deploy/apache/production-https.conf). El servicio quedó activo y su sintaxis validó correctamente. `/etc/apache2/sites-available/wordpress-https.conf` y `/var/www/html` permanecen disponibles para revertir; no se modificaron los archivos de WordPress.
- La URL principal, `/ficcion/noku/`, `/favicon.svg` y `/preview/` respondieron HTTP 200; una ruta inexistente devolvió 404 y `www` redirigió con 301 al dominio canónico. La portada mostró el sitio nuevo en el navegador. Producción tiene canonical `/`, `robots.txt` con `Allow: /` y no lleva `noindex`; la vista previa conserva `noindex`.
- Se retiraron los paquetes y el archivo de configuración temporales de la VM y Cloud Shell. La clave SSH temporal se quitó de los metadatos del proyecto, se borraron sus archivos en Cloud Shell y se verificó que quedaron cero claves SSH de proyecto.
- Para volver a WordPress: ejecutar en la VM `sudo a2dissite granberta-static-https.conf`, `sudo a2ensite wordpress-https.conf`, `sudo apache2ctl -t` y, solo si la sintaxis es válida, `sudo systemctl reload apache2`. Esto no elimina la release estática ni la instantánea.
- El tratamiento de las URL antiguas, la versión en inglés y los textos de fichas pendientes se acordó para después del lanzamiento. No se cambiaron DNS ni registros de correo.

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

## Publicación de preview del 28 de septiembre de 2026

- El carrusel del equipo mantiene tarjetas de altura uniforme e incluye cinco retratos. Aún faltan las fotos de Toto y Ame.
- El carrusel de ficción incluye las portadas de Rendering, El Condenado, Cucaracha y El Diente Negro, más una tarjeta nueva para Noku. Las imágenes proceden de la carpeta `01_Shortfilms` compartida por el equipo y están optimizadas en WebP; las cuatro portadas de proporción 2:3 se muestran completas para conservar los títulos impresos.
- La ficha de Noku conserva el texto provisional «Ficha en preparación» hasta recibir la sinopsis.
- La release `20260928T205947Z-ace110c-preview` se compiló sin errores, se validó por SHA-256 y se activó en `/var/www/granberta-nueva/preview`. La URL pública carga Noku, las ocho portadas y los cinco retratos; las tarjetas del equipo conservan una altura de 375 px. El sitio WordPress del dominio principal sigue activo y separado.
- Las claves SSH creadas para esta publicación se revocaron del proyecto y se retiraron de Cloud Shell al finalizar.

### Actualización del carrusel del 28 de septiembre de 2026

- Se retiró la tarjeta «Modelos del Segundo Piso» del carrusel de ficción.
- Las portadas del carrusel ahora miden hasta 380 × 676 px en escritorio (antes 205 × 364 px) y 280 × 498 px en móvil.
- Rendering, El Condenado, Cucaracha, El Diente Negro y Noku muestran «Short Film». Se agregó El Sonido del Viento con su portada y la misma clasificación; su ficha queda provisional hasta recibir la sinopsis.
- La release `20260928T214438Z-028361d-preview` se compiló sin errores, se validó con SHA-256 `d5c660fb9ba2f750b7d0d7022325251ca435a0ce8f4fe50f5cf998b827d79fd4` y se activó en `/var/www/granberta-nueva/preview`.
- La URL pública respondió HTTP 200, mostró los seis cortos y dejó de incluir «Modelos del Segundo Piso». La clave SSH temporal se revocó del proyecto y se borró de Cloud Shell al terminar.

### Ajuste de tamaño y reel del 28 de septiembre de 2026

- Se redujo el título «Nuestras historias» y las tarjetas del carrusel a un máximo de 330 × 587 px en escritorio y 255 × 453 px en móvil, con menos espacio sobre la sección.
- El reel usa el video de YouTube `JZ1AOExsHRM` (57 segundos). El botón de reproducción lo abre embebido y un enlace directo permite verlo en YouTube si el navegador bloquea el reproductor.
- La release `20260928T221715Z-08dce8b-preview` se validó con SHA-256 `9585081860e9112db254d99b90b3f1c611a006aff4bd3e0c60207a8eadbec9ee` y quedó activa en `/var/www/granberta-nueva/preview`. La URL pública respondió HTTP 200 con el nuevo diseño y el enlace del reel; WordPress siguió separado. La clave SSH temporal se revocó y se borró al terminar.

### Actualización de «Nosotros» del 28 de septiembre de 2026

- El manifiesto ocupa casi todo el ancho de escritorio en tres columnas y conserva una sola columna en móvil. El enlace de navegación centra el texto y las tarjetas del equipo juntos.
- Las tarjetas del equipo miden hasta 270 × 405 px en escritorio y 225 × 405 px en móvil; sus fotos tienen 280 px de alto. Se comprobó que las biografías no desbordan las tarjetas.
- La release `20260928T223036Z-b00c53d-preview` se validó con SHA-256 `a978c95ec3e135e21351cb024d2c78a8dab3ba9486429a3b2bb2136aab9661ad` y quedó activa en `/var/www/granberta-nueva/preview`. La URL pública respondió HTTP 200; WordPress siguió separado. La clave SSH temporal se revocó y se borró al terminar.

### Retiro de indicación del carrusel del equipo — 28 de septiembre de 2026

- Se quitó el texto «Pasá el mouse (o tocá) para conocerlos de verdad.» que aparecía debajo del carrusel.
- La release `20260928T225504Z-c65a9d2-preview` se validó con SHA-256 `4dd4ae165a716e148f5ae16e3f5a778caf3f54b4940d1d3c411473ac049b7e0f` y quedó activa en `/var/www/granberta-nueva/preview`.
- La página pública cargó con HTTP 200 y la indicación ya no aparece. La clave temporal se revocó del proyecto y se borró de Cloud Shell; WordPress siguió separado.

### Retratos de Ame, Toto y Norberto — 28 de septiembre de 2026

- Se agregaron las fotos optimizadas de Ame Blanco y Toto Scigliano y el retrato de Norberto al carrusel.
- Norberto aparece como «CEO — Conejo Ejecutivo Oficial», con la línea «El jefe. Sin discusión.» y una bio sobre sus siestas estratégicas.
- La release `20260928T233456Z-1ac937d-preview` se validó con SHA-256 `cf7531a570326810859cd4a319dff4dc37923a4df3189d7a685ae00548e04b82` y quedó activa en `/var/www/granberta-nueva/preview` con 52 archivos.
- El navegador público confirmó las tres fotos cargadas y mostró el perfil de Norberto. La clave SSH temporal se revocó y se borró de Cloud Shell; WordPress siguió separado.

### Logos, reel y paleta — 29 de septiembre de 2026

- La release `20260929T001858Z-d927b16-preview` quedó activa en `/var/www/granberta-nueva/preview` con 75 archivos, tras validar SHA-256 `0628a799c2f3cbda2b3258275fe967c20c5859ace661d2243acf7ddf075706c5`.
- En la URL pública se verificaron 42 imágenes de los 21 logos sin imágenes rotas, el reel de fondo reproduciéndose, el enlace al reel de YouTube y la directiva `noindex`. La página, el video y un logo respondieron HTTP 200.
- El dominio principal continuó respondiendo HTTP 200 con WordPress. La única clave SSH temporal del proyecto se revocó y sus archivos se borraron de Cloud Shell.

### Selector de color y tienda de stickers — 29 de septiembre de 2026

- La release `20260929T021049Z-659eb0b-preview` se validó con SHA-256 `d2dd28e7f4cfea1a3a995b515490750ce898601321caba71bcdcdb95cda87d5e` y quedó activa en `/var/www/granberta-nueva/preview` con 86 archivos. El enlace anterior permanece disponible para revertir.
- Cada carga elige un acento entre amarillo, rojo, naranja, verde flúor y rosa Bani; el botón del monograma GB cambia al siguiente color. En la URL pública se comprobó el paso de verde flúor a rosa Bani.
- El reel de fondo se reproduce al entrar en pantalla y usa un desenfoque de 1 px. Se retiraron el círculo «Qué, cómo, por qué» y el reel duplicado. La tienda muestra los nueve stickers de la plancha provista y el botón de compra deshabilitado hasta contar con un enlace.
- Se comprobaron cargados los nueve stickers y los logos de Gran Berta y Bani VFX, un único botón para el reel y la directiva `noindex, nofollow`. La clave SSH temporal se revocó de los metadatos del proyecto y sus archivos se borraron de Cloud Shell.

### Paleta, Totem Rental y sticker de Tanga — 29 de septiembre de 2026

- La release `20260929T031044Z-098a9d4-preview` se validó con SHA-256 `bbefc2a12e4df2ce63066bb425a82651684cb95df4a46710f56578b97ed39057` y quedó activa en `/var/www/granberta-nueva/preview` con 89 archivos.
- Se ajustó el verde para que sea más verde y menos amarillo, se agregó Totem Rental al universo con su logo y enlace, y se incorporó el sticker de Tanga. La ficha final muestra el logo a la izquierda y la descripción a la derecha.
- La URL pública `/preview/` respondió HTTP 200 y mostró el contenido de Totem. El dominio principal respondió HTTP 200 con su página WordPress.
- El acceso SSH temporal se quitó de los metadatos del proyecto, se borraron sus claves locales de Cloud Shell y se retiró de la VM el archivo temporal de publicación.

### Ajustes de Nosotros y Universo — 29 de septiembre de 2026

- La release `20260929T043906Z-8ba86e0-preview` quedó activa en `/var/www/granberta-nueva/preview` tras validar SHA-256 `6b855517997e49e27897689274998cb341695dba54c0a14c4bac677242e9b798` y 89 archivos.
- Se quitó el título visible de «Nosotros» para evitar que quedara oculto bajo la navegación; el texto introductorio y las tres frases finales se distribuyen en dos columnas sobre las fotos.
- Gran Berta, Bani VFX y Totem Rental se muestran en una fila en escritorio. Sus tres logos usan marcos cuadrados iguales y cada tarjeta enlaza a su página; se retiró la frase final de la sección.
- La URL pública `/preview/` respondió HTTP 200 con las tres tarjetas, los logos cargados y `noindex`; WordPress en `/` siguió respondiendo HTTP 200. El acceso SSH temporal se revocó y el recuento de claves del proyecto volvió a cero.

### Fichas de ficción y ajustes de portada — 29 de septiembre de 2026

- La release `20260929T050009Z-e9d0964-preview` quedó activa en `/var/www/granberta-nueva/preview` tras validar SHA-256 `e926876c9b2d3e12e2499ca42733d24f9204de5da7454fc104338b29099bc6e7` y 133 archivos.
- Los nueve pósters de «Nuestras historias» enlazan a fichas individuales con póster, sinopsis y datos confirmados cuando están disponibles. Rendering y Noku tienen la sinopsis indicada como pendiente hasta recibir el texto oficial.
- El carrusel se detiene al apuntar a una tarjeta para evitar abrir la ficha vecina. Se corrigió el recorte del borde superior y se dio más aire entre menú, título y pósters.
- La portada escribe «CULOS», borra las dos últimas letras y completa «CULTURA.»; con movimiento reducido muestra directamente el texto final. «Marcas que confiaron en nosotros» usa el color de acento actual.
- `/preview/`, las nueve fichas y el WordPress principal respondieron HTTP 200. Las páginas de preview conservaron `noindex`. Se retiró el paquete temporal de la VM y la clave SSH del proyecto y de Cloud Shell; el recuento final fue cero.

## Estado público observado

### Fichas de proyectos más compactas — 29 de septiembre de 2026

- La release `20260929T142048Z-974f12b-preview` quedó activa en `/var/www/granberta-nueva/preview` tras validar SHA-256 `d4c415dff4b89521fbcc174da88879412e59fe546006c40245cb56f6ddc22f71` y 133 archivos.
- Las fichas colocan el póster completo a la izquierda y el título, la sinopsis y los datos básicos a la derecha en escritorio; los créditos adicionales quedan más abajo. El acceso a «Volver a nuestras historias» permanece visible mientras se desplaza la ficha.
- La ficha pública de Noku mostró el póster entero dentro de una pantalla de 720 px de alto y conservó `noindex`; las nueve fichas respondieron HTTP 200. La página principal WordPress respondió HTTP 200 sin cambios.
- El paquete temporal se retiró de la VM y Cloud Shell. La clave SSH temporal se revocó y borró; el recuento final de claves del proyecto fue cero.

### Dos carruseles de marcas y nuevos colores — 29 de septiembre de 2026

- La release `20260929T135111Z-d77c7f8-preview` quedó activa en `/var/www/granberta-nueva/preview` tras validar SHA-256 `1f49c0a01c85ad2b94873b4e4058901e526905cd4ceeb97bccb43cfac02afd98` y 133 archivos.
- Incluye el enlace de Gran Berta a `https://granberta.com/`, el arrastre con mouse del carrusel de ficción, acentos cian y blanco, botón flotante de WhatsApp coordinado con el acento y favicon con el monograma oficial GB Films.
- Las 21 marcas se distribuyen sin repetirse entre dos carruseles que avanzan en sentidos opuestos. La URL pública mostró ambas filas, sin marcas compartidas, y respondió HTTP 200 con `noindex`. El favicon respondió HTTP 200 y la portada principal de WordPress siguió intacta.
- Se retiró el paquete temporal de la VM y de Cloud Shell, se revocó y borró la clave SSH temporal, y el recuento final de claves del proyecto volvió a cero.

### Pie de página horizontal — 29 de septiembre de 2026

- La release `20260929T144430Z-dc4d95e-preview` quedó activa en `/var/www/granberta-nueva/preview` tras validar SHA-256 `9cd8f0c9e65cc2c8a8565a36f20a3994fbbb9d20fd8c502a0a29e50b77fafe2b` y 133 archivos.
- El pie de página distribuye el logo, el lema con las redes y el contacto en tres columnas en escritorio. El copyright queda debajo de una línea divisoria. En móvil las columnas se adaptan al ancho disponible.
- Se verificó visualmente la página pública; `/preview/` y el WordPress principal respondieron HTTP 200. La clave SSH temporal se revocó y borró, y el recuento final de claves del proyecto volvió a cero.

### Poppins, navegación móvil y arrastre del equipo — 29 de septiembre de 2026

- La release `20260929T154755Z-5c73c63-preview` quedó activa en `/var/www/granberta-nueva/preview` tras validar SHA-256 `d86a8213e3ebadf93f1519eefb5a736462eecf5001eb3db765a3195e57c1097b` y 130 archivos.
- El cuerpo usa las fuentes Poppins provistas y conserva Anton para los títulos; Anita figura como «Directora». En móvil se oculta la indicación «Cambiar color» y la navegación se acomoda en dos filas.
- El carrusel de personas permite arrastrar con el botón izquierdo del mouse o con gesto táctil horizontal mediante Pointer Events; `touch-action: pan-y` deja pasar el desplazamiento vertical de la página. Se verificó el movimiento con mouse en la URL pública sin abrir una ficha por accidente. El navegador disponible no aplicó el tamaño móvil solicitado, por lo que no se pudo confirmar el gesto táctil en una emulación o teléfono real.
- `/preview/` y el WordPress principal respondieron HTTP 200. Se comprobó `noindex`; el acceso SSH temporal se quitó de los metadatos del proyecto y sus archivos y el paquete temporal se borraron de Cloud Shell.

### Ajuste del encabezado móvil — 29 de septiembre de 2026

- La release `20260929T161936Z-46eb35e-preview` quedó activa en `/var/www/granberta-nueva/preview` tras validar SHA-256 `8e300af0419ae5d58afeee28e3f792a56fc5cc2024e88200c164f58fd7d07cf3` y 130 archivos.
- Se recuperó «Cambiar color ↻» como último control de la segunda fila móvil; los seis enlaces quedaron agrupados en dos filas con menos separación. En pantallas de hasta 360 px se reducen tipografía y espacios para mantener ese orden.
- En la página pública se verificó que el control cambió el acento de rojo a naranja y actualizó su etiqueta accesible. `/preview/` y WordPress respondieron HTTP 200; la preview conserva `noindex, nofollow`.
- El navegador no aplicó el tamaño móvil para una comprobación visual en esta sesión. La clave SSH temporal se revocó, el recuento de claves del proyecto volvió a cero y se borraron los paquetes temporales de la VM y Cloud Shell.

- `https://granbertafilms.com/`: HTTP 200 con Apache y la nueva web estática.
- `https://www.granbertafilms.com/`: HTTP 301 hacia el dominio sin `www`.
- `https://granbertafilms.com/preview/`: HTTP 200 y `noindex`. La release activa se consulta con `readlink /var/www/granberta-nueva/preview`; el historial queda registrado en `/var/www/granberta-nueva/deployments.jsonl`.
- A del dominio principal: `34.152.39.181`.
- CNAME de `www`: `granbertafilms.com`.
- La zona `granbertafilms` visible en el proyecto `gran-berta-films` usa `ns-cloud-d*` y contiene A `34.47.17.87`, pero no es autoritativa para el dominio. No modificarla como si fuera la zona activa.
- MX del dominio principal: prioridad 1, `smtp.google.com`.
- TXT SPF del dominio principal: `v=spf1 include:_spf.google.com ~all`.

Estas consultas públicas son una referencia inicial. No sustituyen la inspección de toda la zona DNS en Cloud, incluidos DKIM y DMARC.

## Actualización del portfolio del 30 de septiembre de 2026

- Se publicó `20260930T040117Z-0a86755-preview` en `/preview/` y `20260930T040306Z-0a86755-production` en el sitio principal. Ambos paquetes pasaron la validación de integridad y del instalador; la versión anterior de cada canal quedó disponible para revertir.
- Se verificaron con HTTP 200 la portada, el portfolio nuevo, la vista previa y la ficha `/ficcion/noku/`. El menú público muestra «PORTFOLIO». La vista previa conserva `noindex` y producción no lo incluye.
- Se retiraron los paquetes temporales de la VM y Cloud Shell. La clave SSH temporal se revocó y el proyecto volvió a cero claves SSH en sus metadatos.

## Pendientes posteriores al lanzamiento

- Continuar la revisión de contenido, enlaces, contacto y correo. Un enlace `mailto:` válido no demuestra entrega de mensajes; la recepción debe comprobarla el titular con una prueba autorizada.
- Resolver los pendientes de contenido y las alertas de dependencias.
- Inventariar las URL antiguas desde WordPress/sitemap y acordar equivalencias. La portada anterior enlazaba `/contacto/`, `/nosotros/`, `/proyectos/`, `/en/home/` y `/https-youtu-be-bxxsot9zusisibbff9lvspou3xkvb/`.
- Posibles equivalencias para revisar: `/contacto/` → `/#contacto`, `/nosotros/` → `/#nosotros`, `/proyectos/` → `/#marcas`. No aplicar todavía: falta el inventario completo y resolver la versión en inglés y la página de proyecto.

## Referencias

- [SSH desde el navegador en Compute Engine](https://docs.cloud.google.com/compute/docs/connect/ssh-in-browser).
- [VirtualHosts por nombre en Apache](https://httpd.apache.org/docs/2.4/vhosts/name-based.html).

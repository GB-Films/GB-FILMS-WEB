# Sitio Gran Berta Films

Sitio institucional de una página. Astro 5 estático, sin framework de UI, en
español. Construido a partir del mockup `docs/sala-oscura-v2.html`.

Leer también `README.md`: ahí están los comandos, la estructura y los
pendientes. Este archivo guarda las decisiones que **no** se deducen del código.

## Cómo trabajar acá

- **El copy vive en `src/data/`**, no en los componentes. Para cambiar textos,
  tocar ahí.
- **Estilos**: lo compartido en `src/styles/global.css` (tokens de color y
  tipografía, utilidades); lo específico de cada sección en el `<style>` de su
  componente, que Astro aísla solo.
- **Verificar siempre contra el build de producción** (`npm run build` +
  `npm run preview`), no solo contra `npm run dev`. El dev server de Astro a
  veces sirve CSS viejo por HMR y muestra estados que no son reales.
- Los pendientes están marcados en el código como `TODO(brief)`.

## Origen de los assets

- **Logo**: vectorizado a mano en `src/components/Logo.astro` a partir del SVG
  de marca. Se pinta con `currentColor`, así que cambia de color según dónde
  esté. Dos variantes: `monogram` (solo GB, para el nav) y `lockup` (GB + FILMS,
  para el footer).
- **Manifiesto**: el mockup traía solo la primera estrofa; el texto real tiene
  tres. Está completo en `src/data/equipo.ts`.
- **Pósters de ficción**: viven en `src/assets/ficcion/` y los optimiza Astro en
  el build (de 8 MB de originales a 223 KB publicados).

**La tipografía Anton viene del mockup, no del manual de marca**, y no está
confirmada. Si la marca usa otra, se cambia el token `--font-display` en
`global.css` y se actualiza todo el sitio.

## A quién le habla el sitio

**Apunta a marcas y agencias.** Consecuencias en el código:

- El CTA "Trabajemos juntos" lleva a `#contacto`, que es puramente comercial:
  WhatsApp + mail. Sin formulario.
- **El WhatsApp sale de un solo campo** (`contacto.whatsapp` en
  `src/data/site.ts`). De ahí salen tres cosas: el botón de la sección de
  contacto, el link del footer y la burbuja flotante. Si se vacía, los tres
  desaparecen en vez de romperse.
- La captación de talento quedó como una línea chica en el footer, para no
  competir con el CTA comercial. Antes era una sección entera (`Sumate.astro`,
  ya borrado).
- La franja de marcas va apenas debajo del hero: es prueba social y valida todo
  lo que sigue.

## Decisiones que se pueden revertir

- **La franja de marcas es híbrida**: solo las que tienen `piezas` cargadas se
  pueden clickear (llevan un ▶ chico); el resto son logo puro. Es a propósito:
  hay marcas que suman por el nombre pero cuyo material no está para mostrar.
- **Marcas con varios trabajos** abren un coverflow: la pieza activa al centro y
  las otras como satélites a los costados. Debajo de 760px los satélites se
  ocultan (no entran) y queda solo el pasador.
- **Carrusel de ficción sin flechas**: usa la misma franja que marcas y equipo.
  Antes tenía flechas; se unificó para que las tres se comporten igual.
- **El reel completo aparece una sola vez**, dentro de "¿Qué carajo?". La
  portada usa una copia optimizada y más nítida como fondo.
- **El monograma del nav cambia el acento**: la visita empieza con uno de siete
  colores al azar; cada toque avanza al siguiente. `src/data/colores.ts` guarda
  los tonos y `--accent` pinta títulos y controles.
- **La tienda muestra nueve stickers** extraídos de la plancha original. El
  botón de compra queda desactivado hasta que exista un enlace real.
- **En mobile el play va abajo a la derecha** y achicado a 52px: el recuadro
  16:9 mide 184px de alto y el play centrado se superponía con el título.
- **Ficción**: las tres estrenadas van primero porque son las únicas con póster
  y link; el resto son cajas vacías. Las tarjetas son 9:16 para no recortar los
  pósters, y la sección no lleva kicker porque el nav ya marca dónde estás.
- **El centrado del nav respeta la barra fija**: se centra en el espacio libre
  debajo del nav, no en el viewport entero, y si el bloque no entra se apoya
  justo debajo en vez de recortarse por arriba. Está en `Nav.astro`; cada
  sección marca su bloque con `[data-focus]`.
- **Nav sin menú hamburguesa**: en mobile ocupa 126px fijos.

## Trampas que ya costaron una vez

- **Ojo al crear elementos desde el script de un componente Astro**: si se usa
  `createElement` no llevan el atributo `data-astro-cid-*` y **ningún estilo
  scopeado los alcanza**. Los satélites del coverflow se clonan de un molde
  renderizado por Astro (`[data-molde]` en `Marcas.astro`) justamente por eso.
- **No poner `overflow` en un contenedor con `perspective`**: aplana el contexto
  3D y la cara frontal de las tarjetas se cuela espejada.
- **Las tarjetas necesitan aire dentro del recorte de la franja**. Si el borde
  cae justo sobre el filo del clip, el navegador se come el borde inferior
  (mide menos de 1px real en pantallas normales).

## Cómo funcionan las franjas

Marcas, equipo y ficción comparten el movimiento de `src/scripts/franja.ts`:

- **Desplazamiento**: loop propio en `requestAnimationFrame`, no animación CSS —
  con `@keyframes` no se puede cambiar de dirección según el mouse. En reposo va
  a 41 px/s; con el mouse encima la posición del puntero define dirección y
  velocidad (centro = 0, extremos = 240 px/s). En touch se arrastra con el dedo.
- **El listado va duplicado** para que el loop no tenga costura. Una copia tiene
  que ser más ancha que la pantalla, si no se ve la misma tarjeta dos veces.
- **El recorte cuelga de la clase `.auto`**, que agrega el script: sin JS la
  franja queda arrastrable a mano en vez de inalcanzable.
- **Se frenan cuando hay algo abierto** (una marca, una bio, una ficha).

Y en el coverflow de marcas, además:

- **Al abrir una marca** la tarjeta se muda a un "escenario" fuera de la tira
  (dentro de la pista no sirve: su `transform` rompe el posicionamiento en
  pantalla), crece al centro y gira.
- **Todas las piezas se precargan al abrir**, para que cambiar de una a otra no
  parpadee. Como contrapartida hay que frenar a mano las que quedan atrás: los
  `<video>` se pausan y los iframes de Instagram se descartan y se recrean (son
  de otro origen y no se pueden pausar por JS).
- **La tarjeta se amolda a la altura real de cada post**, que Instagram informa
  por `postMessage`. Con una altura fija, los posts más bajos dejaban una franja
  negra enorme.

## Orden de las secciones

Orden en `src/pages/index.astro`: Hero → Marcas → Que(reel) → Nosotros →
Ficción → Tienda → Universo → **Contacto**.

Dos reglas que hay que sostener si se agregan o mueven secciones:

1. **`navLinks` (en `src/data/site.ts`) tiene que ir en el mismo orden que las
   secciones.** Si no, recorrer el menú de izquierda a derecha hace saltar hacia
   atrás. Y hay un motivo menos obvio: el scrollspy resuelve los empates —cuando
   dos secciones tocan la franja central— tomando la primera del array, así que
   con el orden desalineado enciende el link equivocado.
2. **Contacto va último**, justo antes del footer: la página cierra con el
   pedido y no con storytelling.

## Deploy

`npm run release:preview` genera un paquete verificable para
`https://granbertafilms.com/preview/`, marcado con `noindex`. Para producción se
genera otro paquete con `npm run release:production`; nunca se reutiliza el de
preview. El procedimiento completo y el estado del servidor están en
`docs/publicacion-google-cloud.md`.

Sobre el dominio, verificado por DNS:

- **El apex es el canónico**: `www` redirige 301 a `granbertafilms.com`. La
  config del sitio ya usa el apex — no cambiar a `www`.
- **El correo es independiente del registro A**: cambiar el hosting web no lo
  afecta.
- El dominio hoy sirve WordPress desde la misma VM. La nueva web vive en
  `/var/www/granberta-nueva`; `/var/www/html` se conserva como rollback.
- El sitio anterior es multilingüe y tiene URLs propias. Antes del switch hay
  que acordar sus redirecciones porque la web nueva es una sola página en español.

Procedimiento: publicar preview → validar → crear instantánea → generar release
de producción → cambiar el VirtualHost de Apache → verificar. No hace falta
cambiar DNS y WordPress se conserva como rollback.

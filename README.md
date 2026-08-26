# Gran Berta Films — sitio

Sitio de una página (Astro, sin framework de UI) construido a partir del mockup
`sala-oscura-v2.html`.

## Correr el proyecto

```bash
npm install
npm run dev
```

| Comando                | Qué hace                                              |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | servidor local en `http://localhost:4321`             |
| `npm run build`        | build de **producción** a `dist/` (indexable)         |
| `npm run build:preview`| build de **preview** a `dist/` (con `noindex`)        |
| `npm run preview`      | sirve el `dist/` ya construido                        |

## Mostrarlo antes del lanzamiento

Tres caminos, de menos a más definitivo:

**a) En la misma oficina / mismo wifi** — no hace falta subir nada:

```bash
npm run dev -- --host
```

Imprime una IP tipo `http://192.168.0.x:4321`. Cualquiera en esa red la abre.

**b) Link para mandar (rápido, sin cuenta de git)** — generá el bundle de
preview y subí la carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop)
(o Vercel / Cloudflare Pages):

```bash
npm run build:preview
```

**Usá siempre `build:preview` para esto**, no `build`. El de preview marca todas
las páginas con `noindex, nofollow` y sirve un `robots.txt` que cierra el sitio,
así Google no lo indexa antes de tiempo. Ojo: la URL queda pública para quien la
tenga — es "no indexado", no "privado". Si necesitás que sea privado de verdad,
Netlify y Vercel permiten ponerle contraseña al sitio.

**c) Conectado a git (lo que conviene a futuro)** — subí el repo a GitHub y
enlazalo con Netlify/Vercel/Cloudflare. Cada push redeploya solo, y no hace falta
tocar nada: `astro.config.mjs` detecta la URL del deploy (`URL`,
`DEPLOY_PRIME_URL`, `VERCEL_URL`, `CF_PAGES_URL`) y ajusta canonical, Open Graph
y sitemap. Mientras no sea `granbertafilms.com`, sale con `noindex`.

Cuando el sitio salga en serio, se buildea con `npm run build` y listo.

## Estructura

```
src/
  data/         contenido editable (textos, equipo, IPs, marcas, redes)
  components/   una sección de la home por componente
  layouts/      Base.astro — <head>, SEO, script de reveal
  pages/        index.astro y 404.astro
  styles/       global.css — tokens de color/tipografía y utilidades
public/         favicon y assets estáticos
```

**Para cambiar textos no hace falta tocar componentes**: todo el copy vive en
`src/data/`. Los estilos de cada sección están en el `<style>` de su componente
(Astro los aísla automáticamente); lo compartido está en `src/styles/global.css`.

## Pendientes marcados en el código

Buscá `TODO(brief)` para encontrarlos todos:

- **Dominio real** (`astro.config.mjs`) — hoy apunta a
  `granbertafilms.com`. Se usa para canonical, Open Graph y sitemap.
- **Imagen de Open Graph** — falta `public/og.jpg` (1200×630).
- **Video "¿Qué carajo?"** y **Reel 2026** — pasarle `videoUrl` al
  `<VideoFrame>` (embed de YouTube/Vimeo o `.mp4`). El máster del reel pesa
  141 MB: conviene subirlo a YouTube/Vimeo antes que servirlo desde el sitio.
- **Reemplazar los embeds de Instagram** por mp4 o por links de YouTube/Vimeo,
  en `marcas` (`src/data/trabajos.ts`). Instagram le mete su cabecera y el botón
  "Ver perfil" encima del trabajo, y obliga a la tarjeta a abrirse en vertical.
  Con un `.mp4` la tarjeta se abre en 16:9 y el video arranca solo, en loop y
  sin audio. Los links se pegan tal cual: `urlEmbed()` normaliza los de
  Instagram (`/p/` y `/reel/`) y deja pasar el resto.
- **Marcas sin trabajo cargado** (Disney, Adidas, PedidosYa): hoy
  son solo logo y no se clickean. Si aparece la pieza, se les agrega `piezas` y
  quedan interactivas solas.
- **Sinopsis de las IPs** — `sinopsis` en `src/data/trabajos.ts`. Hoy las fichas
  dicen "Ficha en preparación". Los pósters y los links a Shorta ya están
  cargados en las tres series estrenadas; faltan las otras cinco.
- **Fotos del equipo** — cargar en `public/equipo/` y completar `foto` en
  `src/data/equipo.ts`. Hay tomas de estudio de cinco de los siete; faltan las
  de Toto y Ame.
- **Sticker de la tienda**.
- **Formulario de talento** — hoy la captación va por mail, desde una línea en
  el footer (`talento` en `src/data/site.ts`). Si vuelve el formulario, el
  sitio pasa a recolectar datos personales y hace falta una política de
  privacidad.
- **Logos de marcas** — hoy se listan como texto en `src/data/trabajos.ts`.

## Notas de implementación

- **Logo** (`Logo.astro`): vectorizado desde `gb-logo.svg` de la marca. Se pinta
  con `currentColor`, así que cambia de color según el contexto. Dos variantes:
  `monogram` (solo GB, para el nav) y `lockup` (GB + FILMS, para el footer).
- Tipografías **self-hosted** vía `@fontsource` (Anton + Inter variable): sin
  pedidos a Google Fonts, sin salto de layout.
- El **manifiesto** sale de `src/data/equipo.ts` y está completo según el
  documento de identidad verbal (tres estrofas, no una).
- El **nav** hace scrollspy con IntersectionObserver sobre una franja fina en el
  medio del viewport, y al clickear centra el bloque marcado con `[data-focus]`
  de cada sección (el video en "¿Qué carajo?" y "Trabajos", el carrusel en
  "Ficción").
- **`VideoFrame.astro`**: lo que se le pasa por slot se dibuja dentro del
  recuadro y desaparece al apretar play.
- El **círculo dorado** y las **fichas de ficción** sirven todos los textos en el
  HTML y el JS los convierte en acordeón. Sin JS el contenido igual se lee y se
  indexa. Anillos y tarjetas son `<button>`: funcionan con teclado.
- **`prefers-reduced-motion`** desactiva animaciones y muestra todo sin el
  reveal por scroll.
- El alto del nav se mide solo y se publica en `--nav-h`, así los anclajes no
  quedan tapados (en mobile el nav mide 133px, no 63px).

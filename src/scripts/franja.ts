/**
 * Franja horizontal en loop, con la velocidad gobernada por el mouse.
 *
 * En reposo desfila sola hacia la izquierda. Con el puntero encima, su posición
 * horizontal manda: en el centro la velocidad es cero y hacia los costados
 * acelera, invirtiendo el sentido en cada mitad. En touch se arrastra con el
 * dedo.
 *
 * Requisitos del markup:
 * - `pista` tiene que contener el listado **duplicado**, para que el loop no
 *   tenga costura. Una copia sola tiene que ser más ancha que la pantalla, si
 *   no se llega a ver la misma tarjeta dos veces.
 * - `contenedor` recorta; se le agrega la clase `auto` sólo si el script toma
 *   el control, para que sin JS la franja quede arrastrable a mano en vez de
 *   inalcanzable.
 */
export type OpcionesFranja = {
  /** px/s del desfile automático, cuando nadie la toca */
  reposo?: number;
  /** px/s en los extremos, apuntando con el mouse */
  max?: number;
  /** Si devuelve true la franja se queda quieta (por ejemplo, con una tarjeta abierta). */
  frenada?: () => boolean;
};

export function montarFranja(
  contenedor: HTMLElement,
  pista: HTMLElement,
  { reposo = 41, max = 240, frenada }: OpcionesFranja = {},
) {
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (sinMovimiento.matches) return;

  /** null = el mouse no está encima */
  let velMouse: number | null = null;
  let anchoCopia = 0;
  let pos = 0;
  let vel = reposo;
  let marca = 0;
  let arrastrando = false;

  const medirCopia = () => {
    anchoCopia = pista.scrollWidth / 2;
  };
  medirCopia();
  window.addEventListener('resize', medirCopia, { passive: true });

  const aplicar = () => {
    if (anchoCopia <= 0) return;
    pos = ((pos % anchoCopia) + anchoCopia) % anchoCopia;
    pista.style.transform = `translateX(${-pos}px)`;
  };

  const velObjetivo = () => {
    if (arrastrando) return 0;
    if (frenada?.()) return 0;
    return velMouse ?? reposo;
  };

  const cuadro = (t: number) => {
    const dt = marca ? Math.min((t - marca) / 1000, 0.05) : 0;
    marca = t;

    // suaviza el cambio de velocidad para que no salte al mover el mouse
    vel += (velObjetivo() - vel) * Math.min(1, dt * 9);
    pos += vel * dt;
    aplicar();

    requestAnimationFrame(cuadro);
  };

  contenedor.classList.add('auto');
  requestAnimationFrame(cuadro);

  contenedor.addEventListener('mousemove', (ev) => {
    if (arrastrando) return;
    const r = contenedor.getBoundingClientRect();
    if (!r.width) return;
    // -1 en el borde izquierdo, 0 en el centro, +1 en el derecho
    const desdeElCentro = ((ev.clientX - r.left) / r.width - 0.5) * 2;
    velMouse = desdeElCentro * max;
  });

  contenedor.addEventListener('mouseleave', () => (velMouse = null));

  // --- arrastre con el dedo -------------------------------------------------
  // Sin esto, en celular la franja sólo se puede mirar pasar: no hay mouse que
  // gobierne la velocidad.
  let xInicial = 0;
  let posInicial = 0;

  contenedor.addEventListener(
    'pointerdown',
    (ev) => {
      if (ev.pointerType === 'mouse') return;
      arrastrando = true;
      xInicial = ev.clientX;
      posInicial = pos;
    },
    { passive: true },
  );

  contenedor.addEventListener(
    'pointermove',
    (ev) => {
      if (!arrastrando) return;
      pos = posInicial - (ev.clientX - xInicial);
      aplicar();
    },
    { passive: true },
  );

  const soltar = () => {
    arrastrando = false;
  };
  contenedor.addEventListener('pointerup', soltar, { passive: true });
  contenedor.addEventListener('pointercancel', soltar, { passive: true });
}

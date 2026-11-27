import '~/styles/reproductor-pieza.css';

function boton(texto: string, etiqueta: string) {
  const control = document.createElement('button');
  control.type = 'button';
  control.textContent = texto;
  control.setAttribute('aria-label', etiqueta);
  control.title = etiqueta;
  return control;
}

function reloj(segundos: number) {
  const tiempo = Number.isFinite(segundos) ? Math.floor(segundos) : 0;
  return `${Math.floor(tiempo / 60)}:${String(tiempo % 60).padStart(2, '0')}`;
}

export function montarReproductorPieza(visor: HTMLElement, fuente: string, poster: string, titulo: string) {
  const marco = document.createElement('div');
  marco.className = 'reproductor-pieza';
  marco.setAttribute('role', 'group');
  marco.setAttribute('aria-label', `Reproductor de ${titulo}`);

  const video = document.createElement('video');
  video.playsInline = true;
  video.preload = 'metadata';
  video.poster = poster;
  video.src = fuente;
  video.setAttribute('aria-label', titulo);

  const controles = document.createElement('div');
  controles.className = 'reproductor-pieza-controles';
  const play = boton('▶', 'Reproducir');
  const progreso = document.createElement('input');
  progreso.type = 'range';
  progreso.min = '0';
  progreso.max = '0';
  progreso.step = 'any';
  progreso.value = '0';
  progreso.disabled = true;
  progreso.setAttribute('aria-label', 'Posición del video');
  const tiempo = document.createElement('span');
  tiempo.className = 'reproductor-pieza-tiempo';
  const audio = boton('♪', 'Silenciar');
  const pantalla = boton('⛶', 'Pantalla completa');
  const estado = document.createElement('p');
  estado.className = 'reproductor-pieza-estado';
  estado.setAttribute('role', 'status');
  estado.hidden = true;

  const sincronizar = () => {
    const duracion = Number.isFinite(video.duration) ? video.duration : 0;
    progreso.max = String(duracion);
    progreso.disabled = duracion === 0;
    progreso.value = String(video.currentTime);
    progreso.setAttribute('aria-valuetext', reloj(video.currentTime));
    tiempo.textContent = `${reloj(video.currentTime)} / ${reloj(duracion)}`;
    const pausa = video.paused || video.ended;
    play.textContent = pausa ? '▶' : 'Ⅱ';
    play.title = pausa ? 'Reproducir' : 'Pausar';
    play.setAttribute('aria-label', play.title);
  };
  const alternar = () => {
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };
  for (const evento of ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended']) {
    video.addEventListener(evento, sincronizar);
  }
  play.addEventListener('click', alternar);
  video.addEventListener('click', alternar);
  progreso.addEventListener('input', () => {
    video.currentTime = progreso.valueAsNumber;
    sincronizar();
  });
  audio.addEventListener('click', () => {
    video.muted = !video.muted;
    audio.textContent = video.muted ? '×♪' : '♪';
    audio.title = video.muted ? 'Activar sonido' : 'Silenciar';
    audio.setAttribute('aria-label', audio.title);
  });
  pantalla.hidden = !document.fullscreenEnabled;
  pantalla.addEventListener('click', () => {
    if (document.fullscreenElement === marco) void document.exitFullscreen().catch(() => {});
    else void marco.requestFullscreen().catch(() => {});
  });
  marco.addEventListener('fullscreenchange', () => {
    pantalla.title = document.fullscreenElement === marco ? 'Salir de pantalla completa' : 'Pantalla completa';
    pantalla.setAttribute('aria-label', pantalla.title);
  });
  video.addEventListener('error', () => {
    controles.hidden = true;
    estado.textContent = 'No se pudo cargar el video.';
    estado.hidden = false;
  });
  controles.append(play, progreso, tiempo, audio, pantalla);
  marco.append(video, controles, estado);
  visor.replaceChildren(marco);
  sincronizar();
  play.focus({ preventScroll: true });
  void video.play().catch(() => {});
}

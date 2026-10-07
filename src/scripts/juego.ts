import * as THREE from 'three';
import { juego } from '~/data/juego';

export function iniciarSet() {
  const stage = document.querySelector<HTMLElement>('#game-stage');
  if (!stage) return;
  const overlay = document.querySelector<HTMLElement>('[data-overlay]')!;
  const title = document.querySelector<HTMLElement>('[data-overlay-title]')!;
  const copy = document.querySelector<HTMLElement>('[data-overlay-copy]')!;
  const start = document.querySelector<HTMLButtonElement>('[data-start]')!;
  const mission = document.querySelector<HTMLElement>('[data-mission]')!;
  const score = document.querySelector<HTMLElement>('[data-score]')!;
  const pauseButton = document.querySelector<HTMLButtonElement>('[data-pause]')!;
  const stick = document.querySelector<HTMLElement>('[data-stick]')!;
  const knob = document.querySelector<HTMLElement>('[data-knob]')!;
  const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#12191d');
  scene.fog = new THREE.Fog('#12191d', 24, 65);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch {
    title.textContent = 'El set necesita 3D.';
    copy.textContent = juego.unsupported;
    start.hidden = true;
    document.querySelector('[data-loading]')?.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.append(renderer.domElement);
  document.querySelector('[data-loading]')?.remove();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  const materials = {
    dark: new THREE.MeshStandardMaterial({ color: '#141a20', roughness: 0.65 }),
    metal: new THREE.MeshStandardMaterial({ color: '#566069', roughness: 0.4, metalness: 0.6 }),
    white: new THREE.MeshStandardMaterial({ color: '#d2dadc', roughness: 0.7 }),
    fur: new THREE.MeshStandardMaterial({ color: '#b5a292', roughness: 0.95, flatShading: true }),
    ear: new THREE.MeshStandardMaterial({ color: '#8c736d', roughness: 1 }),
    accent: new THREE.MeshStandardMaterial({ color: accent(), emissive: accent(), emissiveIntensity: 0.15, roughness: 0.45 }),
    glow: new THREE.MeshBasicMaterial({ color: accent() }),
    lamp: new THREE.MeshBasicMaterial({ color: '#e8f3ff' }),
    glasses: new THREE.MeshStandardMaterial({ color: '#05090f', roughness: 0.18, metalness: 0.55 }),
  };
  const accentWatcher = new MutationObserver(() => {
    materials.accent.color.set(accent()); materials.accent.emissive.set(accent()); materials.glow.color.set(accent());
  });
  accentWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true;
    parent.add(object); return object;
  }
  function box(w: number, h: number, d: number, material: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) {
    return mesh(new THREE.BoxGeometry(w, h, d), material, parent, x, y, z);
  }
  function cylinder(radius: number, height: number, material: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) {
    return mesh(new THREE.CylinderGeometry(radius, radius, height, 12), material, parent, x, y, z);
  }
  function label(lines: string[], width = 768, height = 384) {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#10161b'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#edf2f5'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.min(width / 8, height / (lines.length + 1))}px sans-serif`;
    lines.forEach((line, i) => ctx.fillText(line, width / 2, height * (i + 1) / (lines.length + 1)));
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: texture });
  }
  scene.add(new THREE.HemisphereLight('#d9e7f2', '#313037', 2));
  const sun = new THREE.DirectionalLight('#ffe9d6', 3.5); sun.position.set(-10, 18, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -23; sun.shadow.camera.right = 23;
  sun.shadow.camera.top = 23; sun.shadow.camera.bottom = -23; sun.shadow.normalBias = 0.03;
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#64a8ff', 2); rim.position.set(10, 7, -13); scene.add(rim);
  const floor = box(36, 0.3, 32, new THREE.MeshStandardMaterial({ color: '#252e34', roughness: 0.9 }), scene, 0, -0.15, -1);
  floor.castShadow = false;
  const grid = new THREE.GridHelper(36, 36, '#62727e', '#364149'); grid.position.y = 0.015; scene.add(grid);
  box(36, 5.8, 0.4, materials.dark, scene, 0, 2.9, -17);
  for (const x of [-17.5, 17.5]) box(0.4, 3.5, 32, materials.dark, scene, x, 1.75, -1);
  box(12, 3.6, 0.15, label(['GB FILMS', 'HACEMOS CULTURA.']), scene, 0, 3.15, -16.73);
  for (const x of [-16.5, -10.5, 10.5, 16.5]) {
    box(0.14, 5.5, 0.14, materials.metal, scene, x, 2.75, -16.4);
    box(0.075, 4.5, 0.08, materials.glow, scene, x, 2.75, -16.25);
  }
  for (const z of [-14, -3, 11]) {
    box(35, 0.2, 0.2, materials.metal, scene, 0, 7, z);
    for (const x of [-12, -4, 4, 12]) box(2, 0.08, 0.35, materials.lamp, scene, x, 6.88, z);
  }
  const colliders: { x: number; z: number; w: number; d: number; h: number }[] = [];
  function obstacle(x: number, z: number, w: number, d: number, h: number) { colliders.push({ x, z, w, d, h }); }
  // Un pequeño decorado: plataforma central, cámaras, luces y cajas de equipo.
  box(7.5, 0.3, 4, materials.dark, scene, 0, 0.15, -10);
  box(7.6, 0.07, 0.07, materials.glow, scene, 0, 0.33, -7.98);
  obstacle(0, -10, 7.5, 4, 0.3);
  const portal = new THREE.Group(); portal.position.set(0, 0.3, -11); scene.add(portal);
  const ring = mesh(new THREE.TorusGeometry(1.55, 0.08, 8, 48), materials.glow, portal, 0, 2.1, 0);
  box(2.5, 0.75, 0.12, label(['ACCIÓN']), portal, 0, 2.1, 0);
  for (const [x, z] of [[-6, -5], [7, -6], [-11, 8]]) {
    const cameraRig = new THREE.Group(); cameraRig.position.set(x, 0, z); cameraRig.rotation.y = x > 0 ? -0.6 : 0.6; scene.add(cameraRig);
    cylinder(0.05, 1.5, materials.metal, cameraRig, 0, 0.8);
    for (let i = 0; i < 3; i++) {
      const leg = cylinder(0.04, 1.4, materials.metal, cameraRig, Math.sin(i * Math.PI * 2 / 3) * 0.3, 0.6, Math.cos(i * Math.PI * 2 / 3) * 0.3);
      leg.rotation.z = Math.cos(i * Math.PI * 2 / 3) * 0.45; leg.rotation.x = Math.sin(i * Math.PI * 2 / 3) * 0.45;
    }
    box(0.8, 0.45, 0.55, materials.dark, cameraRig, 0, 1.7);
    const lens = cylinder(0.18, 0.5, materials.glasses, cameraRig, 0, 1.7, -0.45); lens.rotation.x = Math.PI / 2;
    box(0.35, 0.24, 0.07, materials.accent, cameraRig, 0.55, 1.75, 0);
    obstacle(x, z, 1.3, 1.3, 2);
  }
  for (const [x, z] of [[-12, -11], [12, -12], [-5, 2], [12, 7]]) {
    cylinder(0.045, 2.8, materials.metal, scene, x, 1.4, z);
    box(1.3, 0.7, 0.14, materials.dark, scene, x, 2.8, z);
    box(1.15, 0.55, 0.03, materials.lamp, scene, x, 2.8, z + 0.085);
    cylinder(0.45, 0.07, materials.dark, scene, x, 0.05, z);
    obstacle(x, z, 0.7, 0.7, 3.2);
  }
  for (const [x, z, h] of [[-13, -3, 1], [-12, -2, 0.65], [12, -2, 0.8], [13, -3, 1.3], [5, 10, 0.65]]) {
    box(1.3, h, 1.2, materials.dark, scene, x, h / 2, z);
    box(1.32, 0.1, 1.22, materials.metal, scene, x, h * 0.85, z);
    box(0.4, 0.17, 0.05, materials.accent, scene, x, h / 2, z + 0.61);
    obstacle(x, z, 1.3, 1.2, h);
  }
  for (const x of [-8, 8]) {
    const board = box(3.4, 2.2, 0.2, label([x < 0 ? 'FICCIÓN' : 'PORTFOLIO', 'EN RODAJE']), scene, x, 2.3, -15);
    board.rotation.y = x < 0 ? 0.15 : -0.15;
    for (const offset of [-1.3, 1.3]) cylinder(0.06, 1.2, materials.metal, scene, x + offset, 0.6, -15);
    obstacle(x, -15, 3.5, 0.7, 3.5);
  }

  // Norberto: geometría propia, orejas caídas, buzo y anteojos.
  const player = new THREE.Group(); player.position.set(0, 0, 6.5); scene.add(player);
  const body = new THREE.Group(); player.add(body);
  box(0.62, 0.58, 0.45, materials.dark, body, 0, 0.8);
  box(0.3, 0.19, 0.02, label(['GB'], 256, 128), body, 0, 0.85, -0.235);
  const head = mesh(new THREE.SphereGeometry(0.35, 16, 12), materials.fur, body, 0, 1.36, -0.04);
  head.scale.set(1, 1.05, 0.92);
  const muzzle = mesh(new THREE.SphereGeometry(0.19, 12, 8), materials.fur, body, 0, 1.24, -0.32); muzzle.scale.set(1.15, 0.8, 0.8);
  mesh(new THREE.SphereGeometry(0.046, 8, 6), materials.ear, body, 0, 1.27, -0.47);
  const ears: THREE.Group[] = [];
  for (const sign of [-1, 1]) {
    const ear = new THREE.Group(); ear.position.set(sign * 0.27, 1.56, 0.02); ear.rotation.z = sign * 0.17; body.add(ear);
    const outer = mesh(new THREE.CapsuleGeometry(0.12, 0.42, 4, 8), materials.fur, ear, sign * 0.13, -0.22);
    outer.rotation.z = sign * 0.17;
    const inner = mesh(new THREE.CapsuleGeometry(0.065, 0.3, 3, 6), materials.ear, ear, sign * 0.13, -0.22, -0.09); inner.rotation.z = sign * 0.17;
    ears.push(ear);
    const frame = box(0.26, 0.15, 0.06, materials.white, body, sign * 0.16, 1.4, -0.35); frame.rotation.z = sign * 0.06;
    box(0.21, 0.1, 0.07, materials.glasses, body, sign * 0.16, 1.4, -0.39);
  }
  box(0.1, 0.04, 0.06, materials.white, body, 0, 1.43, -0.38);
  const legs: THREE.Group[] = []; const arms: THREE.Group[] = [];
  for (const sign of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(sign * 0.18, 0.55, 0); body.add(leg);
    box(0.2, 0.38, 0.23, materials.dark, leg, 0, -0.17);
    box(0.24, 0.13, 0.36, materials.white, leg, 0, -0.46, -0.07); legs.push(leg);
    const arm = new THREE.Group(); arm.position.set(sign * 0.39, 1.02, 0); body.add(arm);
    box(0.19, 0.43, 0.23, materials.dark, arm, 0, -0.19);
    mesh(new THREE.SphereGeometry(0.1, 8, 6), materials.fur, arm, 0, -0.43); arms.push(arm);
  }
  const tail = mesh(new THREE.SphereGeometry(0.13, 10, 8), materials.white, body, 0, 0.57, 0.31);
  tail.castShadow = false;
  const playerShadow = mesh(new THREE.CircleGeometry(0.45, 24), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.3, depthWrite: false }), scene);
  playerShadow.rotation.x = -Math.PI / 2;

  const tokens = [[-10, -9], [10, -8], [-9, 3], [8, 5], [0, -4]].map(([x, z], i) => {
    const token = new THREE.Group(); token.position.set(x, 0.9, z); scene.add(token);
    box(0.8, 0.5, 0.1, materials.accent, token);
    box(0.84, 0.13, 0.12, materials.white, token, 0, 0.33);
    for (let j = 0; j < 4; j++) {
      const stripe = box(0.13, 0.14, 0.13, materials.dark, token, -0.3 + j * 0.2, 0.33); stripe.rotation.z = -0.3;
    }
    box(0.45, 0.04, 0.02, materials.dark, token, 0, -0.01, 0.07);
    const halo = mesh(new THREE.TorusGeometry(0.62, 0.018, 6, 32), materials.glow, scene, x, 0.07, z); halo.rotation.x = Math.PI / 2;
    return { token, halo, x, z, phase: i, found: false };
  });

  let running = false; let hasStarted = false; let collected = 0; let jumpSpeed = 0; let jumpQueued = false; let grounded = true;
  let yaw = 0.4; let pitch = 0.5; let gait = 0; let time = 0; let previous = performance.now();
  let cameraDrag: { id: number; x: number; y: number } | null = null;
  let stickPointer: number | null = null;
  const keys = new Set<string>(); const stickInput = new THREE.Vector2();
  const direction = new THREE.Vector3(); const target = new THREE.Vector3(); const desiredCamera = new THREE.Vector3();
  function clearInput() { keys.clear(); stickInput.set(0, 0); knob.style.transform = ''; stickPointer = null; cameraDrag = null; jumpQueued = false; }
  function updateScore() { score.querySelector('b')!.textContent = String(collected); score.setAttribute('aria-label', `Claquetas encontradas: ${collected} de 5`); }
  function resume() {
    running = true; hasStarted = true; clearInput(); overlay.hidden = true;
    pauseButton.setAttribute('aria-label', 'Pausar juego'); stage!.focus();
  }
  function pause() {
    if (!hasStarted || overlay.hidden === false) return;
    running = false; clearInput(); overlay.hidden = false;
    title.textContent = juego.pause; copy.textContent = 'El set te espera. Volvé cuando quieras seguir explorando.';
    start.innerHTML = `${juego.resume}<span>↗</span>`; start.focus();
  }
  function reset() {
    player.position.set(0, 0, 6.5); body.rotation.y = 0; jumpSpeed = 0; grounded = true; collected = 0;
    tokens.forEach(t => { t.found = false; t.token.visible = true; t.halo.visible = true; });
    updateScore(); mission.textContent = juego.goal; yaw = 0.4; pitch = 0.5; resume();
  }
  start.addEventListener('click', resume);
  pauseButton.addEventListener('click', () => running ? pause() : resume());
  document.querySelector('[data-reset]')?.addEventListener('click', reset);
  document.querySelector('[data-jump]')?.addEventListener('pointerdown', ev => { ev.preventDefault(); if (running) jumpQueued = true; });
  const controlKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight'];
  window.addEventListener('keydown', ev => {
    if (ev.code === 'Escape' && hasStarted) { ev.preventDefault(); running ? pause() : resume(); return; }
    if (!running) return;
    if (controlKeys.includes(ev.code)) { ev.preventDefault(); keys.add(ev.code); }
    if (ev.code === 'Space' && !ev.repeat) jumpQueued = true;
    if (ev.code === 'KeyR' && !ev.repeat) reset();
  });
  window.addEventListener('keyup', ev => keys.delete(ev.code));
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); previous = performance.now(); });
  stage.addEventListener('pointerdown', ev => {
    if (!running || ev.button !== 0) return;
    cameraDrag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY }; stage.setPointerCapture(ev.pointerId);
  });
  stage.addEventListener('pointermove', ev => {
    if (!cameraDrag || cameraDrag.id !== ev.pointerId) return;
    yaw -= (ev.clientX - cameraDrag.x) * 0.007;
    pitch = THREE.MathUtils.clamp(pitch + (ev.clientY - cameraDrag.y) * 0.004, 0.22, 1.05);
    cameraDrag.x = ev.clientX; cameraDrag.y = ev.clientY;
  });
  function endCamera(ev: PointerEvent) { if (cameraDrag?.id === ev.pointerId) cameraDrag = null; }
  stage.addEventListener('pointerup', endCamera); stage.addEventListener('pointercancel', endCamera); stage.addEventListener('lostpointercapture', endCamera);
  function moveStick(ev: PointerEvent) {
    if (stickPointer !== ev.pointerId) return;
    const rect = stick.getBoundingClientRect();
    stickInput.set((ev.clientX - rect.left - rect.width / 2) / 35, (ev.clientY - rect.top - rect.height / 2) / 35);
    if (stickInput.length() > 1) stickInput.normalize();
    knob.style.transform = `translate(${stickInput.x * 30}px, ${stickInput.y * 30}px)`;
  }
  stick.addEventListener('pointerdown', ev => { if (!running || stickPointer !== null) return; ev.preventDefault(); stickPointer = ev.pointerId; stick.setPointerCapture(ev.pointerId); moveStick(ev); });
  stick.addEventListener('pointermove', moveStick);
  function releaseStick(ev: PointerEvent) { if (stickPointer !== ev.pointerId) return; stickPointer = null; stickInput.set(0, 0); knob.style.transform = ''; }
  stick.addEventListener('pointerup', releaseStick); stick.addEventListener('pointercancel', releaseStick); stick.addEventListener('lostpointercapture', releaseStick);
  function blocked(x: number, z: number) {
    return x < -16.8 || x > 16.8 || z < -16.1 || z > 14.3 || colliders.some(c => player.position.y < c.h - 0.02 && Math.abs(x - c.x) < c.w / 2 + 0.38 && Math.abs(z - c.z) < c.d / 2 + 0.38);
  }
  function resize() { const { width, height } = stage!.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); }
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(stage); resize();
  function animate(now: number) {
    const dt = Math.min((now - previous) / 1000, 0.04); previous = now;
    if (document.hidden) return;
    time += dt;
    let speed = 0;
    if (running) {
      const side = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft')) + stickInput.x;
      const forward = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')) - stickInput.y;
      direction.set(Math.cos(yaw) * side - Math.sin(yaw) * forward, 0, -Math.sin(yaw) * side - Math.cos(yaw) * forward);
      const magnitude = Math.min(direction.length(), 1);
      if (magnitude > 0.05) {
        direction.normalize(); speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 7 : 4) * magnitude;
        // Resolve horizontal axes independently, so walls slide rather than snag.
        const dx = direction.x * speed * dt; const dz = direction.z * speed * dt;
        if (!blocked(player.position.x + dx, player.position.z)) player.position.x += dx;
        if (!blocked(player.position.x, player.position.z + dz)) player.position.z += dz;
        const turn = Math.atan2(direction.x, direction.z) + Math.PI;
        const difference = Math.atan2(Math.sin(turn - body.rotation.y), Math.cos(turn - body.rotation.y));
        body.rotation.y += difference * Math.min(1, dt * 12);
      }
      if (jumpQueued && grounded) { jumpSpeed = 6; grounded = false; }
      jumpQueued = false;
      const ground = colliders.reduce((height, c) => player.position.y >= c.h - 0.04 && Math.abs(player.position.x - c.x) < c.w / 2 + 0.33 && Math.abs(player.position.z - c.z) < c.d / 2 + 0.33 ? Math.max(height, c.h) : height, 0);
      jumpSpeed -= 16 * dt;
      const nextY = player.position.y + jumpSpeed * dt;
      grounded = jumpSpeed <= 0 && nextY <= ground;
      player.position.y = grounded ? ground : nextY;
      if (grounded) jumpSpeed = 0;
      tokens.forEach(t => {
        if (t.found || Math.hypot(player.position.x - t.x, player.position.z - t.z) > 0.9 || player.position.y > 1.8) return;
        t.found = true; t.token.visible = false; t.halo.visible = false; collected++; updateScore();
        mission.textContent = collected === 5 ? 'Tenemos película. Seguí explorando el set.' : `${5 - collected} claquetas más y estamos listos para rodar.`;
        if (collected === 5) {
          running = false; clearInput(); overlay.hidden = false; title.textContent = juego.win;
          copy.textContent = juego.winDescription; start.innerHTML = 'Seguir explorando<span>↗</span>'; start.focus();
        }
      });
    }
    gait += dt * (speed > 0 ? speed * 3.5 : 2);
    legs.forEach((leg, i) => leg.rotation.x = speed > 0 ? Math.sin(gait + i * Math.PI) * 0.55 : 0);
    arms.forEach((arm, i) => arm.rotation.x = speed > 0 ? Math.sin(gait + i * Math.PI) * -0.4 : Math.sin(time * 2) * 0.04);
    body.position.y = speed > 0 && grounded ? Math.abs(Math.sin(gait)) * 0.035 : Math.sin(time * 2) * 0.015;
    ears.forEach((ear, i) => ear.rotation.x = Math.sin(gait + i) * (speed > 0 ? 0.15 : 0.025));
    playerShadow.position.set(player.position.x, 0.02, player.position.z); playerShadow.scale.setScalar(1 - player.position.y * 0.12);
    tokens.forEach(t => { t.token.rotation.y = time * 0.8 + t.phase; t.token.position.y = 0.95 + Math.sin(time * 2 + t.phase) * 0.12; });
    ring.rotation.z = time * 0.08;
    target.set(player.position.x, player.position.y + 1, player.position.z);
    const distance = camera.aspect < 0.85 ? 9 : 7.5;
    desiredCamera.set(target.x + Math.sin(yaw) * distance * Math.cos(pitch), target.y + Math.sin(pitch) * distance, target.z + Math.cos(yaw) * distance * Math.cos(pitch));
    desiredCamera.x = THREE.MathUtils.clamp(desiredCamera.x, -17.1, 17.1);
    desiredCamera.z = THREE.MathUtils.clamp(desiredCamera.z, -16.5, 15);
    camera.position.lerp(desiredCamera, 1 - Math.exp(-dt * 8)); camera.lookAt(target);
    stage!.dataset.position = `${player.position.x.toFixed(2)},${player.position.y.toFixed(2)},${player.position.z.toFixed(2)}`;
    stage!.dataset.running = String(running);
    renderer.render(scene, camera);
  }
  camera.position.set(5, 5.7, 13.5); camera.lookAt(0, 1, 6.5);
  renderer.setAnimationLoop(animate);
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) { pause(); return; }
    renderer.setAnimationLoop(null); sizeObserver.disconnect(); accentWatcher.disconnect();
    scene.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
    renderer.dispose();
  });
}

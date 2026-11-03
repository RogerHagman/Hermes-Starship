/* ═══════════════ briefing room: the crew round the plotting table ═══════════════ */
// A made-up first session on the idea doc's "Not decided yet" list. Nothing in it is decided.
const AGENDA = [
  { k: '01', t: 'The tech stack' },
  { k: '02', t: 'Where the ship lives' },
  { k: '03', t: 'Look and feel' },
  { k: '04', t: 'Data in, actions out' },
];
const BRIEF = [
  { who: 'captain', say: 'Today’s question: how do we build the ship? The first version only looks.' },
  { who: 'xo', say: 'Four items from the idea doc: the stack, where it lives, the look, and how data gets in and out.', agenda: true },
  { who: 'chief', item: 0, say: 'A static site on made-up fixtures. One page per deck, nothing to install.', prop: 'Static site on made-up fixtures, one page per deck' },
  { who: 'holo', item: 0, say: 'I lay the first bricks on the Holodeck. Once a deck works, the bridge gets it.', prop: 'Build each deck on the Holodeck, use it from the bridge' },
  { who: 'science', item: 0, say: 'Whatever we pick, walking the ship must never wait on a model. I’ll measure it.', prop: 'Moving around never waits on a model, and we measure it' },
  { who: 'ops', item: 1, say: 'It could live on the NAS, with a link from the Hermes dashboard’s menu.', prop: 'On the NAS, linked from the Hermes dashboard' },
  { who: 'carto', item: 2, say: 'Keep the dashboard’s look. Navy hull, colour means rail, gold is the captain.', prop: 'Dashboard look: navy hull, colour means rail' },
  { who: 'security', item: 3, say: 'Fixtures first, read-only live data next, buttons last. Every action still goes through the captain.', prop: 'Fixtures, then read-only live data, then buttons' },
  { who: 'computer', say: 'Minutes saved on the local rail. Four items, six proposals, none decided.' },
  { who: 'captain', say: 'Write them up as options. I’ll decide after the first static deck.', close: true },
];
// seat angle measured from the captain, who stands with the windows behind him
const SEATS = [['captain', 0], ['xo', -0.6], ['computer', 0.6], ['chief', -1.2], ['holo', 1.2], ['ops', -1.8], ['carto', 1.8], ['security', -2.4], ['science', 2.4]];
const crewLabel = (id) => (id === 'xo' ? 'Number One' : CREW_BY_ID[id].name.replace(/^The /, ''));

function agendaCard(a) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 236;
  const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
  function draw(n, on) {
    const g = c.getContext('2d');
    g.clearRect(0, 0, 512, 236);
    g.fillStyle = on ? 'rgba(14, 20, 52, .86)' : 'rgba(6, 10, 28, .74)'; g.fillRect(6, 6, 500, 224);
    g.setLineDash([16, 9]); g.lineWidth = 3; g.strokeStyle = on ? '#d4d9ff' : 'rgba(143, 168, 224, .75)'; g.strokeRect(6, 6, 500, 224); g.setLineDash([]);
    g.fillStyle = '#8fa8e0'; g.fillRect(6, 6, 8, 224);
    g.font = '500 24px "JetBrains Mono", monospace'; g.fillStyle = 'rgba(200, 210, 255, .75)'; g.fillText('AGENDA ' + a.k, 38, 52);
    g.font = '700 44px "Chakra Petch", "Barlow", sans-serif'; g.fillStyle = '#ffffff'; g.fillText(a.t, 38, 118);
    g.font = '500 24px "JetBrains Mono", monospace'; g.fillStyle = '#8fa8e0';
    g.fillText(`OPEN · ${n} PROPOSAL${n === 1 ? '' : 'S'}`, 38, 186);
    tex.needsUpdate = true;
  }
  draw(0, false);
  return { tex, draw };
}

function initBriefing() {
  const canvas = $('#brief-canvas');
  if (!canvas) return;
  const wrapEl = canvas.parentElement;
  const S = makeStage(canvas, { fov: 38, bloom: { strength: 0.62, radius: 0.5, threshold: 0.92 }, vignette: 0.72, shadows: true, clear: 0x02040a });
  const { scene, camera, renderer } = S;
  S.grade.uniforms.uAberration.value = 0.0018;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(makeEnvTexture()).texture;

  // space outside the windows
  scene.add(makeNebula());
  const stars = makeStars(3500, 1100); scene.add(stars);
  const sunDir = new THREE.Vector3(0.7, 0.45, 0.55).normalize();
  const planet = makePlanet(sunDir); planet.position.set(-470, -250, -1250); planet.scale.setScalar(0.62); scene.add(planet);

  // light
  scene.add(new THREE.HemisphereLight(0x8090d0, 0x05070f, 0.32));
  const key = new THREE.SpotLight(0xfff0dc, 1.45, 14, 0.8, 0.7, 1.2); key.position.set(0.3, 5.6, 0.9); key.target.position.set(0, 0.4, 0);
  key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 3;
  scene.add(key, key.target);
  const starlight = new THREE.DirectionalLight(0x7088ff, 0.5); starlight.position.set(-2, 3, -8); scene.add(starlight);
  const holoLight = new THREE.PointLight(0x8f9bff, 1.1, 5, 1.8); holoLight.position.set(0, 1.6, 0); scene.add(holoLight);
  const spk = new THREE.PointLight(0xffffff, 0, 3.4, 2); scene.add(spk);

  // room
  const glowLine = (hex, k) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k) });
  const metal = new THREE.MeshStandardMaterial({ color: 0x10172f, roughness: 0.4, metalness: 0.65 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(7.6, 96), new THREE.MeshStandardMaterial({ color: 0x0a0f22, roughness: 0.28, metalness: 0.7 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  for (const [r, k, w] of [[2.75, 1.8, 0.02], [5.3, 0.9, 0.014]]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(r, w, 6, 160), glowLine(RAIL.mixed.hex, k)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.01; scene.add(ring); }
  const strips = new THREE.Group(); scene.add(strips);
  for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; const s = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.01, 0.9), glowLine(RAIL.local.hex, 1.1)); s.position.set(Math.sin(a) * 4.1, 0.01, Math.cos(a) * 4.1); s.rotation.y = a; strips.add(s); }

  // windows on the back arc, a panelled wall round the rest
  const WR = 7.2, wA0 = Math.PI - 1.25, wA1 = Math.PI + 1.25, H = 5.0;
  const band = (y0, y1) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(WR, WR, y1 - y0, 96, 1, true, wA0, wA1 - wA0), new THREE.MeshStandardMaterial({ color: 0x0c1228, roughness: 0.5, metalness: 0.5, side: THREE.BackSide })); m.position.y = (y0 + y1) / 2; scene.add(m); };
  band(0, 0.6); band(4.4, H);
  for (let a = wA0; a <= wA1 + 1e-3; a += (wA1 - wA0) / 10) {
    const mu = new THREE.Mesh(new THREE.BoxGeometry(0.16, H, 0.3), metal); mu.position.set(Math.sin(a) * (WR - 0.1), H / 2, Math.cos(a) * (WR - 0.1)); mu.rotation.y = a; scene.add(mu);
  }
  for (const y of [0.6, 4.4]) { const sill = new THREE.Mesh(new THREE.TorusGeometry(WR - 0.12, 0.03, 6, 120, wA1 - wA0), glowLine(RAIL.mixed.hex, 1.4)); sill.rotation.x = Math.PI / 2; sill.rotation.z = -wA1 + Math.PI / 2; sill.position.y = y; scene.add(sill); }
  const pw = panelWall(4);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(WR, WR, H, 96, 1, true, wA1, Math.PI * 2 - (wA1 - wA0)), new THREE.MeshStandardMaterial({ map: pw.map, emissive: 0xffffff, emissiveMap: pw.emissiveMap, emissiveIntensity: 1.5, side: THREE.BackSide, roughness: 0.6, metalness: 0.4 }));
  wall.position.y = H / 2; wall.receiveShadow = true; scene.add(wall);
  const ceil = new THREE.Mesh(new THREE.CircleGeometry(WR + 0.2, 64), new THREE.MeshStandardMaterial({ color: 0x080c1c, roughness: 0.8, side: THREE.BackSide })); ceil.rotation.x = -Math.PI / 2; ceil.position.y = H; scene.add(ceil);
  const ceilRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.05, 8, 96), glowLine('#dfe6ff', 2)); ceilRing.rotation.x = Math.PI / 2; ceilRing.position.y = H - 0.1; scene.add(ceilRing);

  // the plotting table
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.22, 0.08, 72), new THREE.MeshStandardMaterial({ color: 0x1a2246, roughness: 0.22, metalness: 0.8 }));
  tableTop.position.y = 0.78; tableTop.castShadow = tableTop.receiveShadow = true; scene.add(tableTop);
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 0.74, 48), metal); ped.position.y = 0.37; ped.castShadow = ped.receiveShadow = true; scene.add(ped);
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.018, 6, 128), glowLine(RAIL.mixed.hex, 2.6)); rimRing.rotation.x = Math.PI / 2; rimRing.position.y = 0.82; scene.add(rimRing);
  const holoCol = new THREE.Color(RAIL.mixed.hex), MIXED = new THREE.Color(RAIL.mixed.hex);
  const surfMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCol: { value: holoCol } },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uTime; uniform vec3 uCol; varying vec2 vP;
      float line(float v, float w){ float d = abs(fract(v) - 0.5); return smoothstep(w, 0.0, 0.5 - d); }
      void main(){ float r = length(vP); float a = atan(vP.y, vP.x);
        float rings = line(r * 6.0, 0.06) * 0.5;
        float spokes = line(a / 6.2831853 * 24.0, 0.07) * smoothstep(0.3, 0.6, r) * 0.3;
        float sweep = pow(max(0.0, sin(a - uTime * 0.8)), 24.0) * 0.9 * smoothstep(0.2, 1.1, r);
        float pulse = smoothstep(0.03, 0.0, abs(r - fract(uTime * 0.35) * 1.2)) * 0.7;
        float v = (rings + spokes + sweep + pulse) * smoothstep(1.2, 1.1, r) + smoothstep(0.3, 0.0, r) * 0.25;
        gl_FragColor = vec4(uCol * v * 0.45, 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const surf = new THREE.Mesh(new THREE.CircleGeometry(1.2, 96), surfMat); surf.rotation.x = -Math.PI / 2; surf.position.y = 0.825; scene.add(surf);
  const emitter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.06, 32), glowLine(RAIL.mixed.hex, 1.3)); emitter.position.y = 0.85; scene.add(emitter);
  const beamMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCol: { value: holoCol } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uTime; uniform vec3 uCol; varying vec2 vUv;
      void main(){ float fade = pow(1.0 - vUv.y, 1.5);
        float streak = 0.55 + 0.45 * sin(vUv.x * 6.2831853 * 18.0 + uTime * 1.6);
        float band = smoothstep(0.06, 0.0, abs(fract(vUv.y + uTime * 0.25) - 0.5));
        gl_FragColor = vec4(uCol * fade * (streak * 0.2 + band * 0.15), 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.22, 0.9, 48, 1, true), beamMat); beam.position.y = 0.88 + 0.45; scene.add(beam);
  const holoShip = buildShip();
  const shipMat = holoize(holoShip, RAIL.mixed.hex);
  holoShip.scale.setScalar(0.15); holoShip.position.y = 1.55; scene.add(holoShip);

  // agenda cards orbit above the table
  const cards = AGENDA.map((a) => {
    const c = agendaCard(a);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: c.tex, transparent: true, depthWrite: false, opacity: 0 }));
    sp.scale.set(0.6, 0.277, 1); sp.position.set(0, 2.8, 0); scene.add(sp);
    return { ...c, sp, n: 0, on: false, show: 0, showT: 0 };
  });

  // the crew, standing round the table on their status rings
  const R = 1.95;
  const people = SEATS.map(([id, d]) => {
    const spec = CREW_BY_ID[id];
    const ch = buildCharacter(spec);
    const th = Math.PI + d;
    const x = Math.sin(th) * R, z = Math.cos(th) * R;
    const ped = makePedestal(spec.rail, spec.status); ped.scale.set(0.78, 0.35, 0.78); ped.position.set(x, 0, z); scene.add(ped);
    ch.root.position.set(x, 0.058, z);
    ch.baseRy = Math.atan2(-x, -z); ch.root.rotation.y = ch.baseRy;
    ch.turn = 0; ch.look = 0; ch.talk = 0;
    ch.root.traverse((o) => { if (o.isMesh && !(o.material && o.material.transparent)) o.castShadow = true; });
    scene.add(ch.root);
    return ch;
  });
  const byId = Object.fromEntries(people.map((p) => [p.spec.id, p]));

  // speaker marker: a pool of light and a ring at their feet
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.85, 48), new THREE.MeshBasicMaterial({ map: glowSprite.tex || (glowSprite.tex = glowTexture()), color: new THREE.Color(1, 1, 1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  pool.rotation.x = -Math.PI / 2; pool.position.y = 0.07; scene.add(pool);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 6, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1) })); halo.rotation.x = Math.PI / 2; halo.position.y = 0.075; scene.add(halo);
  const spkCol = new THREE.Color(RAIL.gold.hex), spkTarget = new THREE.Color(RAIL.gold.hex);

  // name tags
  const tagLayer = $('#brief-tags');
  const tags = people.map((ch) => {
    const el = document.createElement('div'); el.className = 'tag';
    el.style.setProperty('--c', RAIL[ch.spec.rail].hex);
    el.innerHTML = `<i></i><span>${esc(crewLabel(ch.spec.id))}</span>`;
    tagLayer.appendChild(el);
    const anchor = new THREE.Object3D(); anchor.position.y = ch.spec.id === 'computer' ? 1.85 : 1.72; ch.root.add(anchor);
    return { el, anchor, ch, w: 0, h: 0, off: 0 };
  });
  const v = new THREE.Vector3();
  function placeTags() {
    tags.forEach((tg) => {
      tg.anchor.getWorldPosition(v);
      tg.dist = v.distanceTo(camera.position);
      v.project(camera);
      tg.x = (v.x + 1) / 2 * S.w; tg.y = (1 - v.y) / 2 * S.h;
      if (!tg.w) { tg.w = tg.el.offsetWidth; tg.h = tg.el.offsetHeight; }
      tg.ok = v.z < 1 && tg.x > 30 && tg.x < S.w - 30 && tg.y > 24 && tg.y < S.h - 90;
    });
    layoutTags(tags);
    tags.forEach((tg) => {
      tg.off += ((tg.ok ? tg.ly - tg.y : 0) - tg.off) * 0.25;
      tg.el.style.transform = `translate(${tg.x.toFixed(1)}px, ${(tg.y + tg.off).toFixed(1)}px) translate(-50%, -100%)`;
      const on = tg.ch === speaker;
      tg.el.classList.toggle('on', on);
      tg.el.style.opacity = tg.ok ? (on ? '1' : String(clamp(1.1 - tg.dist / 12, 0.35, 0.62))) : '0';
    });
  }

  // minutes panel and subtitles
  const agendaEl = $('#brief-agenda');
  agendaEl.innerHTML = AGENDA.map((a) => `<li><div class="ah"><b>${esc(a.t)}</b><span>Open · 0 proposals</span></div><ul></ul></li>`).join('');
  const items = $$('li', agendaEl).filter((li) => li.parentElement === agendaEl);
  const verdict = $('#brief-verdict');
  const sub = $('#brief-sub'), subWho = $('.who span', sub), subLine = $('.line', sub);
  function resetMinutes() {
    items.forEach((li, i) => { li.classList.remove('shown', 'on'); $('ul', li).innerHTML = ''; $('.ah span', li).textContent = 'Open · 0 proposals'; cards[i].n = 0; cards[i].draw(0, false); cards[i].show = 0; });
    verdict.innerHTML = 'Waiting for the captain';
    verdict.classList.remove('done');
  }
  function addProposal(L) {
    const li = items[L.item], cd = cards[L.item], spec = CREW_BY_ID[L.who];
    const row = document.createElement('li'); row.style.setProperty('--c', RAIL[spec.rail].hex);
    row.innerHTML = `<i></i><span>${esc(L.prop)} <em>${esc(crewLabel(L.who))}</em></span>`;
    $('ul', li).appendChild(row);
    cd.n++; $('.ah span', li).textContent = `Open · ${cd.n} proposal${cd.n === 1 ? '' : 's'}`;
    cd.draw(cd.n, true);
  }

  // the session script
  let lineI = -1, lineT = 0, lineDur = 1, typed = -1, holdT = 0, speaker = null, propDone = false, activeItem = -1;
  function startLine(i) {
    lineI = i; lineT = 0; typed = -1; propDone = false;
    const L = BRIEF[i], spec = CREW_BY_ID[L.who];
    speaker = byId[L.who];
    lineDur = L.say.length / 42 + (REDUCED ? 4 : 2.8);
    sub.style.setProperty('--c', RAIL[spec.rail].hex);
    subWho.textContent = L.who === 'captain' ? 'The Captain' : `${crewLabel(L.who)} · ${RAIL[spec.rail].name} rail`;
    subLine.textContent = '';
    spkTarget.set(RAIL[spec.rail].hex);
    if (i === 0) resetMinutes();
    if (L.agenda) items.forEach((li, k) => setTimeout(() => li.classList.add('shown'), 400 + k * 450));
    if (L.agenda) cards.forEach((cd, k) => { cd.showT = 0.4 + k * 0.45; });
    activeItem = L.item ?? -1;
    items.forEach((li, k) => li.classList.toggle('on', k === activeItem));
    cards.forEach((cd, k) => { const on = k === activeItem; if (on !== cd.on) { cd.on = on; cd.draw(cd.n, on); } });
    if (L.close) setTimeout(() => { verdict.innerHTML = '<b>Captain:</b> write the proposals up as options. Decision after the first static deck.'; verdict.classList.add('done'); }, 1600);
  }

  // camera: a slow wide orbit, cutting in to frame whoever has the floor
  const cam = { px: 0, py: 3, pz: 6.5, lx: 0, ly: 1.2, lz: 0 };
  let snap = true;
  function dampK(o, k, target, dt, w = 1.2) {
    const vv = o['v' + k] || 0, x = o[k];
    const f = 1 + 2 * dt * w, oo = w * w, hoo = dt * oo, hhoo = dt * hoo, inv = 1 / (f + hhoo);
    o[k] = (f * x + dt * vv + hhoo * target) * inv; o['v' + k] = (vv + hoo * (target - x)) * inv;
  }
  let wide = 6.6;
  function fit() { const a = S.w / S.h; camera.fov = a < 0.8 ? 60 : a < 1.2 ? 48 : 38; wide = a < 0.8 ? 7.4 : 6.6; camera.updateProjectionMatrix(); tags.forEach((tg) => { tg.w = 0; }); }
  S.onResize = fit; fit();
  let px = 0, tpx = 0, tpy = 0, py = 0;
  wrapEl.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); tpx = (e.clientX - r.left) / r.width - 0.5; tpy = (e.clientY - r.top) / r.height - 0.5; });
  function cameraTarget(t) {
    const L = lineI >= 0 ? BRIEF[lineI] : null;
    const wideShot = !L || L.who === 'captain' || L.agenda || REDUCED;
    if (wideShot) {
      const ph = Math.sin(t * 0.06) * 0.38;
      return [Math.sin(ph) * wide, 2.95, Math.cos(ph) * wide, 0, 1.2, -0.3];
    }
    const p = speaker.root.position;
    const th = Math.atan2(p.x, p.z);
    const side = lineI % 2 ? 1 : -1;
    const a = th + Math.PI + side * 0.5;
    const r = wide * 0.8;
    return [Math.sin(a) * r, 3.35, Math.cos(a) * r, p.x * 0.7, 1.25, p.z * 0.7];
  }

  // click a crew member to meet them in crew quarters
  people.forEach((ch, i) => ch.root.traverse((o) => { o.userData.briefIdx = i; }));
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(people.map((c) => c.root), true).find((h) => h.object.userData.briefIdx !== undefined);
    return hit ? people[hit.object.userData.briefIdx] : null;
  }
  let downAt = null;
  canvas.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener('click', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
    const ch = pick(e);
    if (ch && window.crewSelect) { window.crewSelect(ch.spec.id); $('#crew').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
  });
  let hoverT = 0;
  canvas.addEventListener('pointermove', (e) => { const n = performance.now(); if (n - hoverT < 120) return; hoverT = n; canvas.style.cursor = pick(e) ? 'pointer' : 'default'; });

  const tgt = new THREE.Vector3();
  let t = 0, last = performance.now(), started = false;
  function tick(now) {
    requestAnimationFrame(tick);
    const raw = (now - last) / 1000, dt = Math.min(0.05, raw); last = now;
    if (!S.visible || document.hidden) return;
    S.adapt(raw);
    t += dt * (REDUCED ? 0.4 : 1);
    if (!started) { started = true; startLine(0); }

    // script
    lineT += dt;
    const L = BRIEF[lineI];
    const n = REDUCED ? L.say.length : Math.min(L.say.length, Math.floor(lineT * 42));
    if (n !== typed) { typed = n; subLine.textContent = L.say.slice(0, n); }
    const talking = n < L.say.length;
    if (L.prop && !propDone && lineT > 1.0) { propDone = true; addProposal(L); }
    if (lineT > lineDur) {
      if (lineI === BRIEF.length - 1) { holdT += dt; if (holdT > 5) { holdT = 0; startLine(0); } }
      else startLine(lineI + 1);
    }

    // crew: everyone turns toward whoever has the floor
    people.forEach((ch) => {
      const me = ch === speaker;
      poseCharacter(ch, t, dt, me && ch.spec.id === 'computer');
      const target = me ? tgt.set(0, 0, 0) : speaker.root.position;
      let yaw = Math.atan2(target.x - ch.root.position.x, target.z - ch.root.position.z) - ch.baseRy;
      yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
      yaw = clamp(yaw, -1.3, 1.3);
      const k1 = 1 - Math.exp(-dt * 2.5), k2 = 1 - Math.exp(-dt * 5);
      ch.turn += (yaw * 0.4 - ch.turn) * k1;
      ch.look += (yaw * 0.6 - ch.look) * k2;
      ch.root.rotation.y = ch.baseRy + ch.turn;
      if (ch.arms) ch.head.rotation.y = ch.head.rotation.y * 0.25 + ch.look;
      ch.talk += ((me ? 1 : 0) - ch.talk) * (1 - Math.exp(-dt * 4));
      if (ch.arms && ch.talk > 0.01) {
        const k = smooth(ch.talk), A = ch.arms.R;
        A.sh.rotation.x = lerp(A.sh.rotation.x, -0.95 + Math.sin(t * 2.3) * 0.12, k);
        A.sh.rotation.z = lerp(A.sh.rotation.z, -0.28, k);
        A.elbow.rotation.x = lerp(A.elbow.rotation.x, -0.85 + Math.sin(t * 3.1) * 0.16, k);
        ch.head.rotation.x += Math.sin(t * 9) * 0.035 * k * (talking ? 1 : 0.2);
      }
    });

    // speaker marker and light
    spkCol.lerp(spkTarget, 1 - Math.exp(-dt * 3));
    const sp = speaker.root.position;
    pool.position.x += (sp.x - pool.position.x) * (1 - Math.exp(-dt * 6)); pool.position.z += (sp.z - pool.position.z) * (1 - Math.exp(-dt * 6));
    halo.position.x = pool.position.x; halo.position.z = pool.position.z;
    pool.material.color.copy(spkCol).multiplyScalar(0.32 + 0.08 * Math.sin(t * 4));
    halo.material.color.copy(spkCol).multiplyScalar(1.7);
    halo.scale.setScalar(1 + 0.06 * Math.sin(t * 5));
    spk.color.copy(spkCol); spk.intensity = 0.8;
    spk.position.set(pool.position.x * 0.6, 2.1, pool.position.z * 0.6);

    // hologram takes on the speaker's rail colour
    holoCol.lerp(spkTarget, 1 - Math.exp(-dt * 1.2));
    holoCol.lerp(MIXED, 0.02);
    shipMat.uniforms.uColor.value.copy(holoCol);
    shipMat.uniforms.uTime.value = t;
    surfMat.uniforms.uTime.value = t; beamMat.uniforms.uTime.value = t;
    holoLight.color.copy(holoCol);
    holoShip.rotation.y = t * 0.25; holoShip.position.y = 1.55 + Math.sin(t * 0.8) * 0.04;
    strips.rotation.y = -t * 0.03;
    stars.material.uniforms.uTime.value = t;

    // agenda cards: unfold on the agenda line, the one under discussion rises
    cards.forEach((cd, i) => {
      if (cd.showT > 0) { cd.showT -= dt; if (cd.showT <= 0) cd.show = 1; }
      const s = cd.sp, on = i === activeItem;
      const a = t * 0.16 + i * Math.PI / 2;
      const tr = on ? 0.82 : 0.95;
      s.position.x += (Math.sin(a) * tr - s.position.x) * 0.1;
      s.position.z += (Math.cos(a) * tr - s.position.z) * 0.1;
      s.position.y += ((on ? 2.95 : 2.8) - s.position.y) * 0.08;
      const op = cd.show * (activeItem < 0 || on ? 0.95 : 0.28);
      s.material.opacity += (op - s.material.opacity) * 0.08;
      const sc = (on ? 0.78 : 0.6) * (0.6 + 0.4 * s.material.opacity);
      s.scale.set(sc, 0.461 * sc, 1);
    });

    // camera
    const ct = cameraTarget(t);
    px += (tpx - px) * 0.05; py += (tpy - py) * 0.05;
    ct[0] += px * 0.5; ct[1] -= py * 0.25;
    if (snap) { [cam.px, cam.py, cam.pz, cam.lx, cam.ly, cam.lz] = ct; snap = false; }
    else ['px', 'py', 'pz', 'lx', 'ly', 'lz'].forEach((k, i) => dampK(cam, k, ct[i], dt, 1.05));
    camera.position.set(cam.px, cam.py, cam.pz);
    camera.lookAt(cam.lx, cam.ly, cam.lz);

    S.grade.uniforms.uTime.value = t;
    placeTags();
    S.composer.render(dt);
  }
  requestAnimationFrame(tick);
  window.__briefDebug = { S, people, go(i) { startLine(i); lineT = 3; snap = true; }, advance(sec) { t += sec; },
    show() { items.forEach((li) => li.classList.add('shown')); cards.forEach((cd, i) => { cd.show = 1; cd.showT = 0; cd.sp.material.opacity = 0.9; const a = t * 0.16 + i * Math.PI / 2; cd.sp.position.set(Math.sin(a) * 0.95, 2.8, Math.cos(a) * 0.95); }); } };
}

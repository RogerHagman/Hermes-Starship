/* ═══════════════ the bridge: interior with the crew at their consoles ═══════════════ */
const ON_SCREEN = [
  { k: 'Campaign', t: 'Hermes Starship interface', s: 'Milestone 0 · static UI on fixtures', rail: 'gold' },
  { k: 'Order 0142', t: 'Engineering: read API PR', s: 'Codex rail · customs scan passed', rail: 'codex' },
  { k: 'Sector chart', t: 'Rails 3 / 3 nominal', s: 'Local · Codex · Claude', rail: 'local' },
  { k: 'Briefing', t: 'Stack for the ship’s interface', s: 'Observation Lounge · minutes pending', rail: 'mixed' },
  { k: 'Awaiting orders', t: '2 items need the captain', s: 'Nothing acts without approval', rail: 'gold' },
];

/* LCARS drawing helpers: an elbow is a filled L with a rounded outer corner and a small inner one */
function lcElbow(g, x, y, w, h, sw, bh, r, col) {
  g.fillStyle = col; g.beginPath();
  g.moveTo(x, y + h); g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5); g.lineTo(x + w, y); g.lineTo(x + w, y + bh);
  const ir = Math.min(r * 0.45, sw * 0.6);
  g.lineTo(x + sw + ir, y + bh); g.quadraticCurveTo(x + sw, y + bh, x + sw, y + bh + ir); g.lineTo(x + sw, y + h); g.closePath(); g.fill();
}
function lcPill(g, x, y, w, h, col, left = true, right = true) {
  const r = h / 2; g.fillStyle = col; g.beginPath();
  g.moveTo(x + (left ? r : 0), y); g.lineTo(x + w - (right ? r : 0), y);
  if (right) g.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2); else { g.lineTo(x + w, y); g.lineTo(x + w, y + h); }
  g.lineTo(x + (left ? r : 0), y + h);
  if (left) g.arc(x + r, y + r, r, Math.PI / 2, Math.PI * 1.5); else { g.lineTo(x, y + h); g.lineTo(x, y); }
  g.closePath(); g.fill();
}

function consoleTexture(hex, kind) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#05080f'; g.fillRect(0, 0, 256, 128);
  const slab = '#2a4a7c';
  // frame: elbow down the left, a bar along the top, blocks down the side
  lcElbow(g, 6, 6, 120, 70, 30, 9, 16, hex);
  g.fillStyle = slab; g.fillRect(130, 6, 70, 9); lcPill(g, 204, 6, 46, 9, hex, false, true);
  g.fillStyle = slab; g.fillRect(6, 80, 30, 18); g.fillStyle = hex; g.fillRect(6, 102, 30, 20);
  // readouts
  g.fillStyle = hex; g.strokeStyle = hex; g.lineWidth = 2;
  if (kind === 'radar') {
    g.globalAlpha = 0.55; for (let r = 10; r < 50; r += 12) { g.beginPath(); g.arc(90, 70, r, 0, Math.PI * 2); g.stroke(); }
    g.globalAlpha = 1; for (let i = 0; i < 7; i++) lcPill(g, 150, 26 + i * 13, 30 + Math.random() * 66, 7, i % 3 ? hex : slab, true, true);
  } else if (kind === 'bars') {
    for (let i = 0; i < 9; i++) { const hh = 12 + Math.random() * 74; g.globalAlpha = 0.55 + Math.random() * 0.45; g.fillRect(48 + i * 21, 118 - hh, 14, hh); }
  } else {
    g.beginPath(); for (let x = 46; x <= 250; x += 5) { const y = 70 + Math.sin(x * 0.05) * 20 + Math.sin(x * 0.13) * 8; x > 46 ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.globalAlpha = 0.35; for (let y = 30; y < 124; y += 18) g.fillRect(46, y, 204, 1);
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  return t;
}

function makeConsole(hex, kind) {
  const g = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x111832, roughness: 0.35, metalness: 0.7 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x8e98b6, roughness: 0.3, metalness: 0.6 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.55), dark); base.position.y = 0.4; base.castShadow = base.receiveShadow = true; g.add(base);
  const top = new THREE.Group(); top.position.set(0, 0.86, 0.02); top.rotation.x = 0.55; g.add(top);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.06, 0.7), edge); slab.castShadow = true; top.add(slab);
  const tex = consoleTexture(hex, kind);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.56), new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(1.6, 1.6, 1.6) }));
  scr.rotation.x = -Math.PI / 2; scr.position.y = 0.035; top.add(scr);
  const strip = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.03, 0.03), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(3) })); strip.position.set(0, 0.06, 0.29); g.add(strip);
  const kick = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.03), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(1.6) })); kick.position.set(0, 0.03, -0.28); g.add(kick);
  g.userData.tex = tex;
  return g;
}

function makeChair(captain = true) {
  const g = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x151d3a, roughness: 0.5, metalness: 0.5 });
  const cush = new THREE.MeshStandardMaterial({ color: 0x4a3a33, roughness: 0.78, metalness: 0.05 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe8c37a, metalness: 0.95, roughness: 0.25 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.22, 0.42, 20), dark); post.position.y = 0.21; g.add(post);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.66), cush); seat.position.y = 0.48; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.6, 0.12), cush); back.position.set(0, 0.82, 0.3); back.rotation.x = -0.14; g.add(back);
  if (captain) { const backTrim = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.02, 6, 30, Math.PI), gold); backTrim.position.set(0, 1.08, 0.34); backTrim.scale.y = 0.5; g.add(backTrim); }
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.62), dark); arm.position.set(0.42 * s, 0.68, 0.02); g.add(arm);
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(captain ? '#e8c37a' : '#8fa8e0').multiplyScalar(2.2) })); pad.rotation.x = -Math.PI / 2; pad.position.set(0.42 * s, 0.733, -0.05); g.add(pad);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function viewscreenMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uWarp: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: NOISE_GLSL + `
      uniform float uTime, uWarp; varying vec2 vUv;
      float h21(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5); }
      void main(){
        vec2 p = (vUv - 0.5) * vec2(2.36, 1.0);
        vec3 col = vec3(0.004, 0.007, 0.02);
        float n = fbm(vec3(p * 1.6, uTime * 0.02));
        col += vec3(0.05, 0.04, 0.16) * smoothstep(-0.2, 0.8, n) + vec3(0.13, 0.01, 0.07) * smoothstep(0.3, 0.9, fbm(vec3(p * 2.4 + 4.0, 1.0)));
        // stars streaming out from the centre
        for (float i = 0.0; i < 1.0; i += 0.2) {
          float depth = fract(i + uTime * (0.03 + uWarp * 0.5));
          float scale = mix(24.0, 1.2, depth);
          float fade = depth * smoothstep(1.0, 0.85, depth);
          vec2 q = p * scale + i * 413.7;
          vec2 id = floor(q); vec2 gv = fract(q) - 0.5;
          float r = h21(id);
          vec2 off = (vec2(r, fract(r * 37.1)) - 0.5) * 0.7;
          float d = length(gv - off);
          col += vec3(0.9, 0.95, 1.2) * smoothstep(0.06 + uWarp * 0.04, 0.0, d) * step(0.55, r) * fade * 2.4;
        }
        // planet in the lower left, lit from the right
        vec2 pc = p - vec2(-0.75, -0.42); float pr = 0.42;
        float pd = length(pc);
        if (pd < pr) {
          vec3 nrm = vec3(pc / pr, sqrt(max(0.0, 1.0 - dot(pc, pc) / (pr * pr))));
          float bands = sin(nrm.y * 16.0 + fbm(nrm * 3.0 + uTime * 0.01) * 3.0) * 0.5 + 0.5;
          vec3 pcol = mix(vec3(0.02, 0.06, 0.12), vec3(0.05, 0.2, 0.22), bands);
          float l = max(dot(nrm, normalize(vec3(0.7, 0.4, 0.5))), 0.0);
          col = pcol * (0.05 + 1.4 * l) + vec3(0.25, 0.45, 1.0) * pow(1.0 - nrm.z, 3.0) * 0.8 * l;
        }
        col += vec3(0.2, 0.35, 1.0) * smoothstep(0.03, 0.0, abs(pd - pr)) * 0.5;
        // scanlines and edge falloff
        col *= 0.85 + 0.15 * sin(vUv.y * 600.0);
        col *= smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x) * smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
        gl_FragColor = vec4(col * 1.3, 1.0);
      }`,
  });
}

function hudTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 434;
  const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
  function draw(item) {
    const g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    const col = RAIL[item.rail].hex;
    g.strokeStyle = 'rgba(160,180,230,.6)'; g.lineWidth = 3;
    const br = (x, y, dx, dy) => { g.beginPath(); g.moveTo(x + dx * 40, y); g.lineTo(x, y); g.lineTo(x, y + dy * 40); g.stroke(); };
    br(20, 20, 1, 1); br(1004, 20, -1, 1); br(20, 414, 1, -1); br(1004, 414, -1, -1);
    // LCARS card: an elbow in the rail colour, a bar with a rounded end, text in the opening
    g.fillStyle = 'rgba(7,11,20,.7)'; g.fillRect(596, 62, 386, 128);
    lcElbow(g, 556, 48, 380, 142, 34, 12, 26, col);
    lcPill(g, 942, 48, 40, 12, col, false, true);
    g.fillStyle = 'rgba(7,11,20,.9)'; g.font = '600 15px "JetBrains Mono", monospace'; g.fillText(String(10 + (item.t.length * 37) % 89), 562, 182);
    g.font = '600 21px "JetBrains Mono", monospace'; g.fillStyle = 'rgba(200,214,240,.8)'; g.fillText(('ON SCREEN · ' + item.k).toUpperCase(), 610, 94);
    const fit = (txt, weight, size, fam, max) => { let fs = size; do { g.font = `${weight} ${fs}px ${fam}`; fs -= 1; } while (g.measureText(txt).width > max && fs > 14); };
    fit(item.t, 700, 34, '"Chakra Petch", "Barlow", sans-serif', 356); g.fillStyle = '#ffffff'; g.fillText(item.t, 610, 138);
    fit(item.s, 500, 20, '"JetBrains Mono", monospace', 356); g.fillStyle = col; g.fillText(item.s, 610, 174);
    g.font = '500 17px "JetBrains Mono", monospace'; g.fillStyle = 'rgba(200,214,240,.55)'; g.fillText('MAIN VIEWSCREEN · LOCAL RAIL ONLY', 610, 224);
    tex.needsUpdate = true;
  }
  return { tex, draw };
}

/* Panelled wall with light slots, shared by the bridge and the observation lounge */
function panelWall(repeat) {
  // Drawn on a 512 x 512 logical grid, squashed into a 512 x 256 canvas: the wall tile is about as tall as it is wide.
  const W = 512, H = 256;
  const wc = document.createElement('canvas'); wc.width = W; wc.height = H; const wg = wc.getContext('2d');
  const wem = document.createElement('canvas'); wem.width = W; wem.height = H; const we = wem.getContext('2d');
  wg.fillStyle = '#0c1526'; wg.fillRect(0, 0, W, H);
  we.fillStyle = '#000'; we.fillRect(0, 0, W, H);
  wg.save(); we.save(); wg.scale(1, 0.5); we.scale(1, 0.5);
  // wall plating and pilasters
  for (let x = 0; x < W; x += 128) { wg.fillStyle = '#101c33'; wg.fillRect(x + 6, 30, 116, 150); wg.fillStyle = '#080e1a'; wg.fillRect(x, 0, 6, 512); }
  // two LCARS displays per tile, at standing height
  const cols = [['#3fc1a5', '#8fa8e0'], ['#8fa8e0', '#4fa3ff']];
  [[18, 214], [272, 214]].forEach(([x0, y0], k) => {
    const [a, b] = cols[k];
    for (const [ctx, dim] of [[wg, 1], [we, 0.85]]) {
      ctx.fillStyle = '#04070d'; ctx.fillRect(x0, y0, 222, 168);
      ctx.globalAlpha = dim;
      lcElbow(ctx, x0 + 6, y0 + 6, 150, 96, 36, 12, 22, a);
      ctx.fillStyle = '#2a4a7c'; ctx.fillRect(x0 + 160, y0 + 6, 30, 12); lcPill(ctx, x0 + 194, y0 + 6, 22, 12, b, false, true);
      ctx.fillStyle = '#2a4a7c'; ctx.fillRect(x0 + 6, y0 + 106, 36, 22); ctx.fillStyle = b; ctx.fillRect(x0 + 6, y0 + 132, 36, 30);
      for (let i = 0; i < 6; i++) lcPill(ctx, x0 + 54, y0 + 30 + i * 21, 40 + ((i * 37 + k * 23) % 90), 11, i % 3 === 1 ? '#2a4a7c' : (i % 2 ? a : b), true, true);
      ctx.fillStyle = a; for (let i = 0; i < 4; i++) ctx.fillRect(x0 + 180, y0 + 38 + i * 30, 30, 18);
      ctx.globalAlpha = 1;
    }
  });
  // light line along the floor
  wg.fillStyle = '#4fa3ff'; wg.fillRect(0, 478, W, 5);
  we.fillStyle = '#2b5fa8'; we.fillRect(0, 478, W, 5);
  wg.restore(); we.restore();
  const tex = (c) => { const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(repeat, 1); t.encoding = THREE.sRGBEncoding; return t; };
  return { map: tex(wc), emissiveMap: tex(wem) };
}

function initBridge() {
  const canvas = $('#bridge-canvas');
  const sec = $('#bridge');
  const S = makeStage(canvas, { fov: 46, bloom: { strength: 0.7, radius: 0.5, threshold: 0.9 }, vignette: 0.7, shadows: true, clear: 0x03050c });
  const { scene, camera, renderer } = S;
  S.grade.uniforms.uAberration.value = 0.002;
  scene.fog = new THREE.Fog(0x070b1a, 9, 22);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(makeEnvTexture()).texture;

  // light
  scene.add(new THREE.HemisphereLight(0x7d89c8, 0x05070f, 0.5));
  const key = new THREE.SpotLight(0xfff0dc, 3.0, 16, 0.8, 0.6, 1.1); key.position.set(0, 6.2, 2.2); key.target.position.set(0, 0, -0.5);
  key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 3;
  scene.add(key, key.target);
  const screenLight = new THREE.PointLight(0x7a86ff, 1.6, 12, 1.6); screenLight.position.set(0, 2.6, -4.8); scene.add(screenLight);
  const rails = [['#f0a948', -5, 2.4], ['#e889b6', 5, 2.4]].map(([c, x, z]) => { const l = new THREE.PointLight(new THREE.Color(c), 0.8, 7, 2); l.position.set(x, 2.6, z); scene.add(l); return l; });

  // room
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0b1024, roughness: 0.28, metalness: 0.7 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(7.4, 96), floorMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const inlay = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.025, 6, 128), new THREE.MeshBasicMaterial({ color: new THREE.Color('#8fa8e0').multiplyScalar(2) })); inlay.rotation.x = Math.PI / 2; inlay.position.y = 0.01; scene.add(inlay);
  const inlay2 = new THREE.Group(); scene.add(inlay2);
  for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; const d = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.01, 0.05), new THREE.MeshBasicMaterial({ color: new THREE.Color('#3fc1a5').multiplyScalar(1.4) })); d.position.set(Math.sin(a) * 5.5, 0.01, Math.cos(a) * 5.5); d.rotation.y = a + Math.PI / 2; inlay2.add(d); }
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.8, 0.2, 64), new THREE.MeshStandardMaterial({ color: 0x141b38, roughness: 0.3, metalness: 0.7 })); dais.position.set(0, 0.1, 0.9); dais.receiveShadow = dais.castShadow = true; scene.add(dais);
  const daisRing = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.02, 6, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#e8c37a').multiplyScalar(2.2) })); daisRing.rotation.x = Math.PI / 2; daisRing.position.set(0, 0.2, 0.9); scene.add(daisRing);

  // walls: wrap round the back and sides, open at the front for the viewscreen
  const pw = panelWall(6);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(7.3, 7.3, 5.4, 96, 1, true, -2.35, 4.7), new THREE.MeshStandardMaterial({ map: pw.map, emissive: 0xffffff, emissiveMap: pw.emissiveMap, emissiveIntensity: 1.6, side: THREE.BackSide, roughness: 0.6, metalness: 0.4 }));
  wall.position.y = 2.7; wall.receiveShadow = true; scene.add(wall);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(12, 5.4), new THREE.MeshStandardMaterial({ color: 0x0a0f22, roughness: 0.5, metalness: 0.5 })); front.position.set(0, 2.7, -5.3); scene.add(front);
  const ceil = new THREE.Mesh(new THREE.CircleGeometry(7.4, 64), new THREE.MeshStandardMaterial({ color: 0x080c1c, roughness: 0.8, side: THREE.BackSide })); ceil.rotation.x = -Math.PI / 2; ceil.position.y = 5.4; scene.add(ceil);
  const ceilRing = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.05, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#dfe6ff').multiplyScalar(2) })); ceilRing.rotation.x = Math.PI / 2; ceilRing.position.set(0, 5.3, 0.6); scene.add(ceilRing);
  // pillars with light strips
  for (const a of [-2.0, -1.2, 1.2, 2.0, 2.9, -2.9]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.4, 0.5), new THREE.MeshStandardMaterial({ color: 0x10172f, roughness: 0.4, metalness: 0.6 }));
    p.position.set(Math.sin(a) * 6.9, 2.7, Math.cos(a) * 6.9); p.rotation.y = a; p.castShadow = true; scene.add(p);
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.2, 0.06), new THREE.MeshBasicMaterial({ color: new THREE.Color(a < 0 ? '#f0a948' : '#e889b6').multiplyScalar(1.8) }));
    s.position.set(Math.sin(a) * 6.62, 2.7, Math.cos(a) * 6.62); scene.add(s);
  }

  // main viewscreen
  const vsMat = viewscreenMaterial();
  const vs = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 3.56), vsMat); vs.position.set(0, 2.75, -5.25); scene.add(vs);
  const hud = hudTexture(); hud.draw(ON_SCREEN[0]);
  const hudPlane = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 3.56), new THREE.MeshBasicMaterial({ map: hud.tex, transparent: true, color: new THREE.Color(1.3, 1.3, 1.3), depthWrite: false }));
  hudPlane.position.set(0, 2.75, -5.23); scene.add(hudPlane);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x8e98b6, roughness: 0.3, metalness: 0.7 });
  for (const [w, h, x, y] of [[8.7, 0.12, 0, 4.58], [8.7, 0.12, 0, 0.92], [0.12, 3.78, -4.29, 2.75], [0.12, 3.78, 4.29, 2.75]]) { const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), frameMat); f.position.set(x, y, -5.22); scene.add(f); }

  // consoles and crew
  const consoles = [];
  const station = (id, ox, oz, fx, fz, kind) => {
    const spec = CREW_BY_ID[id];
    const hex = RAIL[spec.rail].hex;
    const L = Math.hypot(fx, fz); fx /= L; fz /= L;
    const ry = Math.atan2(fx, fz);
    // the console sits in front of the operator, screen tilted back toward them
    const con = makeConsole(hex, kind);
    con.position.set(ox + fx * 0.8, 0, oz + fz * 0.8); con.rotation.y = ry + Math.PI; scene.add(con);
    consoles.push(con);
    const ch = buildCharacter(spec);
    ch.root.position.set(ox, 0, oz); ch.root.rotation.y = ry;
    ch.typing = true;
    if (ch.dress && ch.dress.pose && id !== 'helm') ch.dress.pose = { L: { x: -0.72, z: -0.1, ex: -0.62 }, R: { x: -0.72, z: 0.1, ex: -0.62 } };
    scene.add(ch.root);
    return ch;
  };
  const crew = [];
  crew.push(station('helm', -1.75, -2.35, 0, -1, 'chart'));
  crew.push(station('nav', 1.75, -2.35, 0, -1, 'radar'));
  crew.push(station('ops', -3.9, -0.7, -0.8, -0.6, 'bars'));
  crew.push(station('sensors', -3.2, 2.7, -0.6, 0.8, 'radar'));
  crew.push(station('science', 3.2, 2.7, 0.6, 0.8, 'bars'));
  // Security works tactical, built into the rail behind the command chairs
  crew.push(station('security', 0.95, 3.62, -0.12, -1, 'radar'));
  // an unmanned side station opposite Ops
  { const con = makeConsole(RAIL.mixed.hex, 'chart'); con.position.set(3.9 + 0.8 * 0.8, 0, -0.7 - 0.6 * 0.8); con.rotation.y = Math.atan2(0.8, -0.6) + Math.PI; scene.add(con); consoles.push(con); }
  // the tactical rail: a wooden horseshoe round the command area, open to the viewscreen, with a gap for tactical
  {
    const RC = 0.9, RR = 2.15;
    const wc = document.createElement('canvas'); wc.width = 256; wc.height = 32; const wg = wc.getContext('2d');
    wg.fillStyle = '#7a4a2c'; wg.fillRect(0, 0, 256, 32);
    for (let i = 0; i < 40; i++) { wg.strokeStyle = `rgba(${40 + Math.random() * 30},${20 + Math.random() * 14},10,${0.25 + Math.random() * 0.3})`; wg.lineWidth = 1 + Math.random() * 1.5; wg.beginPath(); const y = Math.random() * 32; wg.moveTo(0, y); wg.bezierCurveTo(80, y + rand(-4, 4), 170, y + rand(-4, 4), 256, y + rand(-3, 3)); wg.stroke(); }
    const woodTex = new THREE.CanvasTexture(wc); woodTex.encoding = THREE.sRGBEncoding; woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping; woodTex.repeat.set(0.4, 0.4);
    const wood = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.42, metalness: 0.05 });
    const panel = new THREE.MeshStandardMaterial({ color: 0x1a2440, roughness: 0.5, metalness: 0.5, side: THREE.DoubleSide });
    for (const [a0, a1] of [[-1.9, 0.12], [0.62, 1.9]]) {
      const sh = new THREE.Shape();
      // shape angle a - PI/2 lands at angle a from +z once the slab is laid flat
      sh.absarc(0, 0, RR + 0.16, a0 - Math.PI / 2, a1 - Math.PI / 2, false);
      sh.absarc(0, 0, RR - 0.12, a1 - Math.PI / 2, a0 - Math.PI / 2, true);
      const top = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 48 }), wood);
      top.rotation.x = -Math.PI / 2; top.position.set(0, 1.0, RC); top.castShadow = top.receiveShadow = true; scene.add(top);
      const wallP = new THREE.Mesh(new THREE.CylinderGeometry(RR, RR, 0.94, 48, 1, true, a0, a1 - a0), panel);
      wallP.position.set(0, 0.5, RC); wallP.castShadow = wallP.receiveShadow = true; scene.add(wallP);
      const strip = new THREE.Mesh(new THREE.TorusGeometry(RR + 0.01, 0.012, 6, 64, a1 - a0), new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL.local.hex).multiplyScalar(2) }));
      strip.rotation.set(Math.PI / 2, 0, Math.PI / 2 - a1); strip.position.set(0, 0.86, RC); scene.add(strip);
    }
  }
  const chair = makeChair(); chair.position.set(0, 0.2, 1.4); chair.rotation.y = Math.PI; scene.add(chair);
  for (const sx of [-1, 1]) { const c = makeChair(false); c.scale.setScalar(0.9); c.position.set(1.18 * sx, 0.2, 1.3); c.rotation.y = Math.PI + 0.18 * sx; scene.add(c); }
  const cap = buildCharacter(CREW_BY_ID.captain); cap.root.position.set(-0.55, 0.2, 0.45); cap.root.rotation.y = Math.PI - 0.15; scene.add(cap.root); crew.push(cap);
  const xo = buildCharacter(CREW_BY_ID.xo); xo.root.position.set(0.75, 0.2, 0.35); xo.root.rotation.y = Math.PI + 0.35; scene.add(xo.root); crew.push(xo);
  const comp = buildCharacter(CREW_BY_ID.computer); comp.root.position.set(-0.6, 0, 5.3); scene.add(comp.root); crew.push(comp);
  const compPed = makePedestal('local', 'live'); compPed.position.set(-0.6, 0, 5.3); scene.add(compPed);
  crew.forEach((c) => c.root.traverse((o) => { if (o.isMesh && o.castShadow === undefined) o.castShadow = true; }));

  // name tags
  const tagLayer = $('#bridge-tags');
  const tags = crew.map((ch) => {
    const el = document.createElement('div'); el.className = 'tag';
    el.style.setProperty('--c', RAIL[ch.spec.rail].hex);
    el.innerHTML = `<i></i><span>${esc(ch.spec.id === 'xo' ? 'Number One' : ch.spec.name.replace(/^The /, ''))}</span>`;
    tagLayer.appendChild(el);
    const anchor = new THREE.Object3D(); anchor.position.y = ch.spec.id === 'computer' ? 1.85 : 1.66; ch.root.add(anchor);
    return { el, anchor, ch, w: 0, h: 0, off: 0 };
  });
  const v = new THREE.Vector3();
  let copyRect = null;
  function measure() { const sr = sec.getBoundingClientRect(), cr = $('.bridge-copy', sec).getBoundingClientRect(); copyRect = { l: cr.left - sr.left - 60, t: cr.top - sr.top - 10, r: cr.right - sr.left + 60, b: cr.bottom - sr.top + 10 }; }
  function fit() { const a = S.w / S.h; camera.fov = a < 0.8 ? 70 : a < 1.2 ? 58 : 46; camera.updateProjectionMatrix(); measure(); tags.forEach((tg) => { tg.w = 0; }); }
  S.onResize = fit; fit();
  function placeTags() {
    tags.forEach((tg) => {
      tg.anchor.getWorldPosition(v);
      tg.dist = v.distanceTo(camera.position);
      v.project(camera);
      const x = tg.x = (v.x + 1) / 2 * S.w, y = tg.y = (1 - v.y) / 2 * S.h;
      if (!tg.w) { tg.w = tg.el.offsetWidth; tg.h = tg.el.offsetHeight; }
      tg.ok = v.z < 1 && x > 20 && x < S.w - 20 && y > 30 && y < S.h - 20 && !(copyRect && x > copyRect.l && x < copyRect.r && y > copyRect.t && y < copyRect.b + 16);
    });
    layoutTags(tags);
    tags.forEach((tg) => {
      tg.off += ((tg.ok ? tg.ly - tg.y : 0) - tg.off) * 0.25;
      tg.el.style.transform = `translate(${tg.x.toFixed(1)}px, ${(tg.y + tg.off).toFixed(1)}px) translate(-50%, -100%)`;
      tg.el.style.opacity = tg.ok ? String(clamp(1.4 - tg.dist / 12, 0.35, 1)) : '0';
    });
  }

  // camera shots
  const SH = [
    { name: 'From the chair', p: [0.0, 2.5, 4.4], l: [0, 1.6, -3.5], dur: 9 },
    { name: 'Viewscreen side', p: [0.3, 2.9, -4.6], l: [0, 0.95, 1.2], dur: 9 },
    { name: 'Port side', p: [-4.9, 2.7, 3.0], l: [0.8, 1.1, -1.2], dur: 8 },
    { name: 'Starboard side', p: [4.6, 2.3, -2.9], l: [-1.0, 1.1, 1.3], dur: 8 },
    { name: 'Over the shoulder', p: [2.5, 2.5, 2.6], l: [-0.8, 1.4, -4.5], dur: 8 },
  ];
  let shot = 0, shotT = 0, snap = true;
  const camState = { px: 0, py: 0, pz: 0, lx: 0, ly: 0, lz: 0 };
  const elShot = $('#bridge-shot');
  function dampK(o, k, target, dt, w = 1.3) {
    const vv = o['v' + k] || 0, x = o[k];
    const f = 1 + 2 * dt * w, oo = w * w, hoo = dt * oo, hhoo = dt * hoo, inv = 1 / (f + hhoo);
    o[k] = (f * x + dt * vv + hhoo * target) * inv; o['v' + k] = (vv + hoo * (target - x)) * inv;
  }
  let px = 0, py = 0, tpx = 0, tpy = 0;
  sec.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); tpx = (e.clientX - r.left) / r.width - 0.5; tpy = (e.clientY - r.top) / r.height - 0.5; });
  $('#bridge-next').addEventListener('click', () => { shot = (shot + 1) % SH.length; shotT = 0; elShot.textContent = SH[shot].name; });

  crew.forEach((ch, i) => ch.root.traverse((o) => { o.userData.bridgeIdx = i; }));
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let downAt = null;
  canvas.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(crew.map((c) => c.root), true).find((h) => h.object.userData.bridgeIdx !== undefined);
    return hit ? crew[hit.object.userData.bridgeIdx] : null;
  }
  canvas.addEventListener('click', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
    const ch = pick(e);
    if (ch && window.crewSelect) { window.crewSelect(ch.spec.id); $('#crew').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
  });
  let hoverT = 0;
  canvas.addEventListener('pointermove', (e) => { const n = performance.now(); if (n - hoverT < 120) return; hoverT = n; canvas.style.cursor = pick(e) ? 'pointer' : 'default'; });

  let hudI = 0, hudT = 5, t = 0, last = performance.now();
  elShot.textContent = SH[0].name;
  function tick(now) {
    requestAnimationFrame(tick);
    const raw = (now - last) / 1000, dt = Math.min(0.05, raw); last = now;
    if (!S.visible || document.hidden) return;
    S.adapt(raw);
    t += dt * (REDUCED ? 0.3 : 1);
    shotT += dt;
    if (shotT > SH[shot].dur && !REDUCED) { shotT = 0; shot = (shot + 1) % SH.length; elShot.textContent = SH[shot].name; }
    const s = SH[shot];
    const drift = Math.sin(shotT / s.dur * Math.PI - Math.PI / 2) * 0.35;
    px += (tpx - px) * 0.05; py += (tpy - py) * 0.05;
    const tp = [s.p[0] + drift + px * 0.6, s.p[1] - py * 0.3, s.p[2]], tl = s.l;
    if (snap) { [camState.px, camState.py, camState.pz] = tp; [camState.lx, camState.ly, camState.lz] = tl; snap = false; }
    else { dampK(camState, 'px', tp[0], dt); dampK(camState, 'py', tp[1], dt); dampK(camState, 'pz', tp[2], dt); dampK(camState, 'lx', tl[0], dt); dampK(camState, 'ly', tl[1], dt); dampK(camState, 'lz', tl[2], dt); }
    camera.position.set(camState.px, camState.py, camState.pz);
    camera.lookAt(camState.lx, camState.ly, camState.lz);

    crew.forEach((ch) => poseCharacter(ch, t, dt, false));
    vsMat.uniforms.uTime.value = t;
    vsMat.uniforms.uWarp.value += ((window.__shipWarp || 0) - vsMat.uniforms.uWarp.value) * Math.min(1, dt * 3);
    inlay2.rotation.y = t * 0.05;
    hudT -= dt; if (hudT <= 0) { hudT = 6; hudI = (hudI + 1) % ON_SCREEN.length; hud.draw(ON_SCREEN[hudI]); }
    screenLight.intensity = 1.5 + Math.sin(t * 0.7) * 0.2;
    S.grade.uniforms.uTime.value = t;
    placeTags();
    S.composer.render(dt);
  }
  requestAnimationFrame(tick);
  window.__bridgeDebug = { shot(i) { shot = i; shotT = 0; snap = true; elShot.textContent = SH[i].name; } };
}

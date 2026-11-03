/* ═══════════════ exterior: the ship in orbit ═══════════════ */
function makeEnvTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#2a3a7a'); gr.addColorStop(0.45, '#141c3c'); gr.addColorStop(0.55, '#0c1128'); gr.addColorStop(1, '#05070f');
  g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  const spot = (x, y, r, col) => { const s = g.createRadialGradient(x, y, 0, x, y, r); s.addColorStop(0, col); s.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = s; g.fillRect(0, 0, 512, 256); };
  spot(90, 70, 70, 'rgba(255,240,220,1)');
  spot(330, 120, 120, 'rgba(120,130,255,.55)');
  spot(440, 150, 90, 'rgba(232,137,182,.35)');
  spot(210, 190, 90, 'rgba(63,193,165,.25)');
  const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.encoding = THREE.sRGBEncoding;
  return t;
}

function makeNebula() {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: NOISE_GLSL + `
      uniform float uTime; varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir);
        float band = exp(-pow(dot(d, normalize(vec3(0.3, 1.0, -0.25))) * 2.6, 2.0));
        float n1 = fbm(d * 2.1 + vec3(0.0, 0.0, uTime * 0.003));
        float n2 = fbm(d * 4.3 + vec3(7.1, 2.0, 1.0));
        float n3 = fbm(d * 3.0 + vec3(3.0, 9.0, 4.0));
        vec3 col = vec3(0.002, 0.004, 0.013);
        col += vec3(0.035, 0.035, 0.13) * smoothstep(-0.2, 0.7, n1) * (0.35 + band);
        col += vec3(0.16, 0.012, 0.075) * smoothstep(0.15, 0.85, n2) * smoothstep(-0.1, 0.6, n1) * (0.25 + band);
        col += vec3(0.0, 0.07, 0.075) * smoothstep(0.3, 0.95, n3) * (0.25 + band * 0.75);
        col += vec3(0.03, 0.03, 0.06) * band;
        // dark dust lanes
        col *= 0.55 + 0.45 * smoothstep(-0.4, 0.2, fbm(d * 6.0 + vec3(1.3)));
        gl_FragColor = vec4(col, 1.0);
      }`,
    side: THREE.BackSide, depthWrite: false,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(1500, 64, 32), mat);
  m.renderOrder = -10;
  return m;
}

function makeStars(count = 5000, radius = 1200) {
  const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), size = new Float32Array(count), ph = new Float32Array(count);
  const tint = [new THREE.Color('#cfd8ff'), new THREE.Color('#ffffff'), new THREE.Color('#ffe2c0'), new THREE.Color('#bfeaff'), new THREE.Color('#ffc7e0')];
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    // bias toward the galactic band
    let x = s * Math.cos(th), y = u, z = s * Math.sin(th);
    if (Math.random() < 0.45) { const n = new THREE.Vector3(0.3, 1.0, -0.25).normalize(); const v = new THREE.Vector3(x, y, z); v.addScaledVector(n, -v.dot(n) * 0.85).normalize(); x = v.x; y = v.y; z = v.z; }
    pos.set([x * radius, y * radius, z * radius], i * 3);
    const b = Math.pow(Math.random(), 6);
    const c = tint[(Math.random() * tint.length) | 0].clone().multiplyScalar(0.35 + b * 3.2);
    col.set([c.r, c.g, c.b], i * 3);
    size[i] = 1.2 + b * 3.4; ph[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPR: { value: DPR }, uStretch: { value: 0 } },
    vertexShader: `attribute vec3 aColor; attribute float aSize; attribute float aPhase; uniform float uTime, uPR; varying vec3 vC;
      void main(){ vC = aColor * (0.78 + 0.22 * sin(uTime * (0.8 + aPhase * 2.0) + aPhase * 40.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uPR; }`,
    fragmentShader: `varying vec3 vC; void main(){ vec2 p = gl_PointCoord - 0.5; float d = length(p); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC * a * a, 1.0); }`,
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
  });
  const pts = new THREE.Points(geo, mat); pts.renderOrder = -9; pts.frustumCulled = false;
  return pts;
}

function makePlanet(sunDir) {
  const g = new THREE.Group();
  const R = 300;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uSun: { value: sunDir.clone() }, uTime: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vWN; varying vec3 vV;
      void main(){ vN = normal; vWN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: NOISE_GLSL + `
      uniform vec3 uSun; uniform float uTime; varying vec3 vN; varying vec3 vWN; varying vec3 vV;
      void main(){
        vec3 n = normalize(vN);
        float warp = fbm(n * 2.5 + vec3(0.0, uTime * 0.004, 0.0));
        float bands = sin(n.y * 18.0 + warp * 3.2) * 0.5 + 0.5;
        float storms = smoothstep(0.35, 0.8, fbm(n * 7.0 + warp));
        vec3 c1 = vec3(0.015, 0.04, 0.09), c2 = vec3(0.04, 0.16, 0.19), c3 = vec3(0.14, 0.09, 0.26);
        vec3 col = mix(c1, c2, bands);
        col = mix(col, c3, storms * 0.55);
        float ndl = dot(normalize(vWN), uSun);
        float diff = max(ndl, 0.0);
        float rim = pow(1.0 - max(dot(normalize(vWN), vV), 0.0), 3.5);
        float day = smoothstep(-0.15, 0.3, ndl);
        vec3 outc = col * (0.02 + 1.5 * diff) + vec3(0.25, 0.42, 1.0) * rim * day * 1.6;
        gl_FragColor = vec4(outc, 1.0);
      }`,
  });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), mat);
  planet.rotation.z = 0.35;
  g.add(planet);
  // atmosphere halo
  const halo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.08, 64, 32), new THREE.ShaderMaterial({
    uniforms: { uSun: { value: sunDir.clone() } },
    vertexShader: `varying vec3 vWN; varying vec3 vV; void main(){ vWN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform vec3 uSun; varying vec3 vWN; varying vec3 vV;
      void main(){ float f = pow(max(0.0, 1.0 + dot(vWN, vV) * 1.0) , 1.0); float edge = pow(clamp(1.0 - abs(dot(vWN, vV)), 0.0, 1.0), 4.0);
        float day = smoothstep(-0.4, 0.4, dot(vWN, uSun)); gl_FragColor = vec4(vec3(0.2, 0.38, 1.0) * edge * day * 1.4, 1.0); }`,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }));
  g.add(halo);
  // rings
  const ringGeo = new THREE.RingGeometry(R * 1.35, R * 2.2, 160, 1);
  const ringMat = new THREE.ShaderMaterial({
    uniforms: { uR0: { value: R * 1.35 }, uR1: { value: R * 2.2 }, uSun: { value: sunDir.clone() } },
    vertexShader: 'varying vec3 vP; varying vec3 vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float uR0, uR1; uniform vec3 uSun; varying vec3 vP;
      float h(float x){ return fract(sin(x * 91.7) * 43758.5); }
      void main(){ float r = (length(vP.xy) - uR0) / (uR1 - uR0);
        float k = floor(r * 90.0); float s = 0.35 + 0.65 * h(k); s *= 0.6 + 0.4 * sin(r * 260.0);
        float gap = smoothstep(0.0, 0.02, abs(r - 0.62)) * smoothstep(0.0, 0.01, abs(r - 0.3));
        float a = s * gap * smoothstep(0.0, 0.05, r) * smoothstep(1.0, 0.85, r);
        vec3 c = mix(vec3(0.35, 0.36, 0.55), vec3(0.6, 0.45, 0.5), h(k + 3.0)) * 0.55;
        gl_FragColor = vec4(c * a * 0.35, a * 0.3); }`,
    side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2 + 0.28; ring.rotation.y = 0.18;
  g.add(ring);
  // moon
  const moon = new THREE.Mesh(new THREE.SphereGeometry(26, 48, 32), new THREE.MeshStandardMaterial({ color: 0x8890a8, roughness: 0.95, metalness: 0 }));
  moon.position.set(R * 1.9, R * 0.55, R * 0.9);
  g.add(moon);
  g.userData = { planet, ring, moon, mat };
  return g;
}

/* Space dust that becomes warp streaks. */
function makeWarpField(count = 900) {
  const box = { x: 70, y: 22, z: 34 };
  const P = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let y, z;
    do { y = rand(-box.y, box.y); z = rand(-box.z, box.z); } while (Math.abs(y) < 2.2 && Math.abs(z) < 5);
    P.set([rand(-box.x, box.x), y, z], i * 3);
  }
  const lineGeo = new THREE.BufferGeometry();
  const L = new Float32Array(count * 6), C = new Float32Array(count * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(L, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(C, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  lines.frustumCulled = false;
  const dotGeo = new THREE.BufferGeometry(); dotGeo.setAttribute('position', new THREE.BufferAttribute(P, 3));
  const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: new THREE.Color('#9fb0ff').multiplyScalar(0.9), size: 0.06, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  dots.frustumCulled = false;
  const g = new THREE.Group(); g.add(lines, dots);
  const tints = [new THREE.Color('#cdd6ff'), new THREE.Color('#8fa8e0'), new THREE.Color('#3fc1a5'), new THREE.Color('#e889b6'), new THREE.Color('#f0a948')];
  const tintIdx = new Uint8Array(count).map(() => (Math.random() < 0.86 ? 0 : (1 + Math.random() * 4) | 0));
  function update(dt, warp) {
    const speed = 3 + warp * 260;
    const len = 0.02 + warp * warp * 22;
    for (let i = 0; i < count; i++) {
      let x = P[i * 3] - speed * dt;
      if (x < -box.x) x += box.x * 2;
      P[i * 3] = x;
      const y = P[i * 3 + 1], z = P[i * 3 + 2];
      L[i * 6] = x; L[i * 6 + 1] = y; L[i * 6 + 2] = z;
      L[i * 6 + 3] = x + len; L[i * 6 + 4] = y; L[i * 6 + 5] = z;
      const c = tints[tintIdx[i]]; const k = warp * (tintIdx[i] ? 1.6 : 1.1);
      C[i * 6] = c.r * k; C[i * 6 + 1] = c.g * k; C[i * 6 + 2] = c.b * k;
      C[i * 6 + 3] = 0; C[i * 6 + 4] = 0; C[i * 6 + 5] = 0;
    }
    lineGeo.attributes.position.needsUpdate = true; lineGeo.attributes.color.needsUpdate = true;
    dotGeo.attributes.position.needsUpdate = true;
    dots.material.opacity = 1 - warp;
    lines.visible = warp > 0.01;
  }
  return { obj: g, update };
}

/* Engine exhaust particles. */
function makeTrails(max = 1400) {
  const pos = new Float32Array(max * 3), col = new Float32Array(max * 3), life = new Float32Array(max), vel = new Float32Array(max * 3), size = new Float32Array(max);
  const base = [];
  for (let i = 0; i < max; i++) base.push(new THREE.Color());
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uPR: { value: DPR } },
    vertexShader: `attribute vec3 aColor; attribute float aSize; uniform float uPR; varying vec3 vC;
      void main(){ vC = aColor; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = aSize * uPR * (260.0 / -mv.z); }`,
    fragmentShader: `varying vec3 vC; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC * a * a, 1.0); }`,
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
  });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false;
  let head = 0;
  const acc = new Map();
  const tmp = new THREE.Vector3();
  function update(dt, emitters, warp) {
    for (const e of emitters) {
      const n = (acc.get(e) || 0) + e.rate * dt * (1 + warp * 2);
      const k = Math.floor(n); acc.set(e, n - k);
      e.obj.localToWorld(tmp.copy(e.local));
      for (let j = 0; j < k; j++) {
        const i = head; head = (head + 1) % max;
        const sp = e.spread || 0.12;
        pos[i * 3] = tmp.x; pos[i * 3 + 1] = tmp.y + rand(-sp, sp) * 0.6; pos[i * 3 + 2] = tmp.z + rand(-sp, sp);
        vel[i * 3] = -rand(5, 9) * (1 + warp * 6); vel[i * 3 + 1] = rand(-0.15, 0.15); vel[i * 3 + 2] = rand(-0.15, 0.15);
        life[i] = 1; base[i].copy(e.color);
      }
    }
    for (let i = 0; i < max; i++) {
      if (life[i] <= 0) { size[i] = 0; continue; }
      life[i] -= dt * 1.25;
      pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      const l = Math.max(0, life[i]);
      const k = l * l * 2.2;
      col[i * 3] = base[i].r * k; col[i * 3 + 1] = base[i].g * k; col[i * 3 + 2] = base[i].b * k;
      size[i] = (0.18 + (1 - l) * 0.55);
    }
    geo.attributes.position.needsUpdate = true; geo.attributes.aColor.needsUpdate = true; geo.attributes.aSize.needsUpdate = true;
  }
  return { obj: pts, update };
}

function initHero() {
  const canvas = $('#hero-canvas');
  const hero = $('#exterior');
  const S = makeStage(canvas, { fov: 34, bloom: { strength: 1.05, radius: 0.62, threshold: 0.8 }, vignette: 0.6, clear: 0x010208 });
  const { scene, camera, renderer } = S;

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(makeEnvTexture()).texture;

  const sunDir = new THREE.Vector3(0.62, 0.38, 0.68).normalize();
  scene.add(new THREE.HemisphereLight(0x8090d0, 0x080b18, 0.22));
  const key = new THREE.DirectionalLight(0xfff0dc, 1.25); key.position.copy(sunDir).multiplyScalar(30); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8c7dff, 1.5); rim.position.set(-14, 5, -10); scene.add(rim);
  const under = new THREE.DirectionalLight(0x3fc1a5, 0.35); under.position.set(0, -10, 3); scene.add(under);

  const nebula = makeNebula(); scene.add(nebula);
  const stars = makeStars(); scene.add(stars);
  const sun = glowSprite('#fff1d6', 160, 3.2); sun.position.copy(sunDir).multiplyScalar(1000); scene.add(sun);
  const sunHalo = glowSprite('#8fa8e0', 700, 0.35); sunHalo.position.copy(sun.position); scene.add(sunHalo);
  const planet = makePlanet(sunDir); planet.position.set(-760, -560, -980); planet.scale.setScalar(1.15); scene.add(planet);

  const ship = buildShip();
  const rig = new THREE.Group(); rig.add(ship); scene.add(rig);
  const shieldMat = new THREE.ShaderMaterial({
    uniforms: { uHit: { value: 0 }, uRipple: { value: 0 }, uHitPos: { value: new THREE.Vector3(1, 0, 0) }, uTime: { value: 0 }, uCol: { value: new THREE.Color('#8fa8e0') } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = cameraPosition - w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform float uHit, uRipple, uTime; uniform vec3 uHitPos, uCol; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      vec2 hexCell(vec2 p){ vec2 r = vec2(1.0, 1.7320508); vec2 h = r * 0.5; vec2 a = mod(p, r) - h; vec2 b = mod(p - h, r) - h; return dot(a, a) < dot(b, b) ? a : b; }
      float hexD(vec2 p){ p = abs(p); return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x); }
      void main(){
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.5);
        vec2 uv = vec2(atan(vP.z, vP.x) * 7.0, vP.y * 9.0);
        float edge = smoothstep(0.40, 0.5, hexD(hexCell(uv)));
        float d = distance(normalize(vP), normalize(uHitPos));
        float ring = smoothstep(0.22, 0.0, abs(d - uRipple)) * (1.0 - smoothstep(0.0, 2.0, uRipple));
        float near = smoothstep(0.9, 0.0, d);
        float a = uHit * (f * 0.5 + edge * (0.25 + near * 0.9) * (0.3 + f) + ring * 1.4 * (0.4 + edge));
        gl_FragColor = vec4(uCol * a * 1.6, a);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const shield = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), shieldMat);
  shield.scale.set(6.3, 2.5, 4.5); shield.position.set(0.3, -0.12, 0); rig.add(shield);
  function shieldHit(worldPoint, strength = 1) {
    const local = shield.worldToLocal(worldPoint.clone());
    shieldMat.uniforms.uHitPos.value.copy(local);
    shieldMat.uniforms.uHit.value = Math.max(shieldMat.uniforms.uHit.value, strength);
    shieldMat.uniforms.uRipple.value = 0;
  }
  // tap the ship to test the shields
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let downAt = null;
  canvas.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener('click', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(ship, true)[0];
    if (hit) shieldHit(hit.point, 1.2);
  });

  const warpField = makeWarpField(); scene.add(warpField.obj);
  const trails = makeTrails(); scene.add(trails.obj);

  // little courier drones: one per cloud rail, orbiting the ship
  const drones = ['#f0a948', '#e889b6', '#3fc1a5'].map((c, i) => {
    const d = new THREE.Group();
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), new THREE.MeshStandardMaterial({ color: 0xc3cbe0, metalness: 0.6, roughness: 0.3 }));
    body.scale.set(2.2, 0.6, 1);
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(5) }));
    tail.position.x = -0.25;
    d.add(body, tail);
    d.userData = { r: 6.5 + i * 1.6, sp: 0.32 - i * 0.06, ph: i * 2.1, tilt: 0.4 - i * 0.35, color: new THREE.Color(c), local: new THREE.Vector3(-0.28, 0, 0) };
    scene.add(d);
    return d;
  });
  const droneEmitters = drones.map((d) => ({ obj: d, local: d.userData.local, color: d.userData.color, rate: 40, spread: 0.02 }));

  // OrbitControls for free look
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enabled = false; controls.enableDamping = true; controls.dampingFactor = 0.06;
  controls.minDistance = 7; controls.maxDistance = 42; controls.enablePan = false;
  controls.target.set(0.4, 0, 0);

  // ─ view offset: push the ship right of the title on wide screens
  let titleRect = null, distScale = 1, avoidRects = [];
  function frame() {
    const w = S.w, h = S.h;
    const hr0 = hero.getBoundingClientRect();
    avoidRects = ['.title-block', '.telemetry', '.controls', '.legend'].map((q) => $(q, hero)).filter((e) => e && e.offsetParent !== null).map((e) => {
      const r = e.getBoundingClientRect(); return { l: r.left - hr0.left - 10, t: r.top - hr0.top - 10, r: r.right - hr0.left + 10, b: r.bottom - hr0.top + 10 };
    });
    distScale = w / h < 0.8 ? 1.9 : w / h < 1.25 ? 1.35 : 1;
    const hr = hero.getBoundingClientRect(), tr = $('.title-block', hero).getBoundingClientRect();
    titleRect = { l: tr.left - hr.left - 10, t: tr.top - hr.top - 10, r: tr.right - hr.left + 10, b: tr.bottom - hr.top + 10 };
    if (w > 900) camera.setViewOffset(w * 1.16, h, 0, h * 0.02, w, h);
    else camera.setViewOffset(w, h * 1.12, 0, h * 0.0, w, h);
  }
  S.onResize = frame; frame();

  // ─ callouts
  const P = ship.userData.parts;
  const CALLOUTS = [
    { a: P.anchors.bridge, title: 'Bridge', sub: 'Number One routes every order', c: '#e8c37a', dx: 70, dy: -70 },
    { a: P.anchors.customs, title: 'Customs ring', sub: 'Security scans what goes to the cloud', c: '#8fa8e0', dx: 80, dy: 40 },
    { a: P.anchors.codex, title: 'Codex nacelle', sub: 'the Codex top model · engineering', c: '#f0a948', dx: -70, dy: -58 },
    { a: P.anchors.claude, title: 'Claude nacelle', sub: 'plan sign-in · research, design', c: '#e889b6', dx: 60, dy: 62 },
    { a: P.anchors.local, title: 'Local core', sub: 'the local model · RTX 3090', c: '#3fc1a5', dx: -80, dy: 58 },
    { a: P.anchors.holodeck, title: 'Holodeck', sub: 'Where the decks get built', c: '#e889b6', dx: -40, dy: -84 },
    { a: P.anchors.sensors, title: 'Sensor array', sub: 'Cited research only', c: '#e889b6', dx: 40, dy: 84 },
  ];
  const layer = $('#callouts'), svg = $('#callout-lines');
  CALLOUTS.forEach((c) => {
    c.el = document.createElement('div'); c.el.className = 'callout'; c.el.style.setProperty('--c', c.c);
    c.el.innerHTML = `<b>${c.title}</b>${c.sub}`; layer.appendChild(c.el);
    c.line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    c.line.setAttribute('fill', 'none'); c.line.setAttribute('stroke', c.c); c.line.setAttribute('stroke-width', '1'); c.line.setAttribute('stroke-opacity', '.75');
    c.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.dot.setAttribute('r', '3'); c.dot.setAttribute('fill', c.c);
    c.ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.ring.setAttribute('r', '7'); c.ring.setAttribute('fill', 'none'); c.ring.setAttribute('stroke', c.c); c.ring.setAttribute('stroke-opacity', '.5');
    svg.append(c.line, c.ring, c.dot);
  });
  let calloutsOn = window.innerWidth > 760;
  const btnCallouts = $('#btn-callouts');
  function setCallouts(v) { calloutsOn = v; hero.classList.toggle('no-callouts', !v); btnCallouts.setAttribute('aria-pressed', String(v)); }
  setCallouts(calloutsOn);
  btnCallouts.addEventListener('click', () => setCallouts(!calloutsOn));
  const btnPoster = $('#btn-poster');
  btnPoster.addEventListener('click', () => { const on = !hero.classList.contains('poster'); hero.classList.toggle('poster', on); btnPoster.setAttribute('aria-pressed', String(on)); });
  const v3 = new THREE.Vector3(), c3 = new THREE.Vector3(), camDir = new THREE.Vector3();
  function placeCallouts(t) {
    if (!calloutsOn) return;
    const w = S.w, h = S.h;
    ship.getWorldPosition(c3);
    camDir.copy(camera.position).sub(c3).normalize();
    const items = CALLOUTS.map((c, i) => {
      c.a.getWorldPosition(v3);
      const facing = v3.clone().sub(c3).normalize().dot(camDir);
      v3.project(camera);
      const x = (v3.x + 1) / 2 * w, y = (1 - v3.y) / 2 * h;
      const side = x > w * 0.55 ? 1 : -1;
      const bw = c.bw || (c.bw = c.el.offsetWidth || 160), bh = c.bh || (c.bh = c.el.offsetHeight || 34);
      const lx = x + side * Math.abs(c.dx);
      const bx = clamp(side > 0 ? lx : lx - bw, 10, w - bw - 10);
      const ok = facing > -0.35 && v3.z < 1 && x > 0 && x < w && y > 40 && y < h - 40 && warpNow < 0.2;
      return { c, i, x, y, side, bx, by: y + c.dy - bh / 2, bw, bh, ok };
    });
    // keep labels from stacking on each other
    const vis = items.filter((it) => it.ok).sort((a, b) => a.by - b.by);
    for (let a = 0; a < vis.length; a++) for (let b = a + 1; b < vis.length; b++) {
      const A = vis[a], B = vis[b];
      if (A.bx < B.bx + B.bw && A.bx + A.bw > B.bx && B.by < A.by + A.bh + 6) B.by = A.by + A.bh + 6;
    }
    items.forEach(({ c, i, x, y, side, bx, by, bw, bh, ok }) => {
      const visible = ok && by + bh < h - 8 && by > 8 && !avoidRects.some((r) => bx < r.r && bx + bw > r.l && by < r.b && by + bh > r.t);
      const ly = by + bh / 2;
      c.el.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px)`;
      c.el.style.opacity = visible ? '1' : '0';
      const ex = side > 0 ? bx : bx + bw;
      const elbowX = x + (ex - x) * 0.45;
      c.line.setAttribute('points', `${x.toFixed(1)},${y.toFixed(1)} ${elbowX.toFixed(1)},${ly.toFixed(1)} ${ex.toFixed(1)},${ly.toFixed(1)}`);
      const op = visible ? 1 : 0;
      c.line.style.opacity = op; c.dot.style.opacity = op; c.ring.style.opacity = op * (0.5 + 0.5 * Math.sin(t * 3 + i));
      c.dot.setAttribute('cx', x); c.dot.setAttribute('cy', y);
      c.ring.setAttribute('cx', x); c.ring.setAttribute('cy', y); c.ring.setAttribute('r', 6 + 3 * ((t * 0.8 + i * 0.3) % 1));
    });
  }

  // ─ warp + modes
  let warpTarget = REDUCED ? 0 : 1, warpNow = REDUCED ? 0 : 1, introDrop = REDUCED ? -1 : 1.6;
  let free = false;
  const btnWarp = $('#btn-warp'), btnLook = $('#btn-look'), flash = $('#warp-flash');
  function flashOnce(strength = 1) {
    S.grade.uniforms.uFlash.value = 0.9 * strength;
    flash.animate([{ opacity: 0.85 * strength }, { opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  function setWarp(on) {
    warpTarget = on ? 1 : 0;
    btnWarp.lastChild.textContent = on ? 'Drop out of warp' : 'Engage warp';
    if (!on) { flashOnce(0.8); shieldHit(ship.localToWorld(new THREE.Vector3(6, 0, 0)), 1.4); }
  }
  btnWarp.addEventListener('click', () => { introDrop = -1; setWarp(warpTarget < 0.5); });
  btnLook.addEventListener('click', () => {
    free = !free; controls.enabled = free; hero.classList.toggle('free', free); btnLook.setAttribute('aria-pressed', String(free));
    if (free) { controls.target.set(0.4, 0, 0); controls.update(); elCam.textContent = 'Free look'; }
    else {
      const p = camera.position; cam.R = p.length(); cam.el = Math.asin(clamp(p.y / cam.R, -1, 1)); cam.az = Math.atan2(p.x, p.z); cam.tx = 0.4;
      cam.vaz = cam.vel = cam.vR = cam.vtx = 0; shotT = 0; elCam.textContent = SHOTS[shotIdx].name;
    }
  });

  // pointer parallax
  let px = 0, py = 0, tpx = 0, tpy = 0;
  hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); tpx = (e.clientX - r.left) / r.width - 0.5; tpy = (e.clientY - r.top) / r.height - 0.5; });

  // telemetry
  const elVel = $('#t-vel'), elHead = $('#t-head'), elSD = $('#t-stardate');
  const now = new Date(); const start = new Date(now.getFullYear(), 0, 1);
  const sd = (now.getFullYear() - 1946) * 1000 + ((now - start) / 864e5 / 365) * 1000;
  elSD.textContent = sd.toFixed(1);

  const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3(0.6, 0, 0), look = new THREE.Vector3();
  let t = 0, last = performance.now(), telT = 0, snap = true;
  // cinematic shot list: spherical camera around the ship, drifting within each shot
  const SHOTS = [
    { name: 'Three-quarter', az: 0.55, el: 0.2, R: 14.5, tx: 0.6, dur: 11, daz: 0.2, del: 0.04 },
    { name: 'Starboard profile', az: 0.04, el: 0.05, R: 12.5, tx: 0.2, dur: 9, daz: 0.14, del: 0.02 },
    { name: 'Engines', az: -2.3, el: 0.17, R: 11.8, tx: -2.0, dur: 9, daz: -0.2, del: 0.03 },
    { name: 'Overhead', az: -0.9, el: 1.0, R: 14.5, tx: 0, dur: 9, daz: 0.25, del: -0.06 },
    { name: 'Bow', az: 1.2, el: -0.08, R: 11.5, tx: 2.0, dur: 9, daz: 0.18, del: 0.05 },
    { name: 'Port bow', az: -0.8 + Math.PI, el: 0.26, R: 15, tx: 0, dur: 10, daz: 0.14, del: 0.03 },
  ];
  let shotIdx = 0, shotT = 0;
  const cam = { az: 0, el: 0, R: 14, tx: 0 };
  const elCam = $('#t-cam'); elCam.textContent = SHOTS[0].name;
  // critically damped spring
  function damp(o, k, target, dt, w = 1.5) {
    const v = o['v' + k] || 0, x = o[k];
    const f = 1 + 2 * dt * w, oo = w * w, hoo = dt * oo, hhoo = dt * hoo, inv = 1 / (f + hhoo);
    o[k] = (f * x + dt * v + hhoo * target) * inv;
    o['v' + k] = (v + hoo * (target - x)) * inv;
  }
  function tick(nowMs) {
    requestAnimationFrame(tick);
    const raw = (nowMs - last) / 1000, dt = Math.min(0.05, raw); last = nowMs;
    if (!S.visible || document.hidden) return;
    S.adapt(raw);
    t += dt * (REDUCED ? 0.25 : 1);

    if (introDrop > 0) { introDrop -= dt; if (introDrop <= 0) { setWarp(false); } }
    warpNow += (warpTarget - warpNow) * (1 - Math.exp(-dt * (warpTarget > warpNow ? 1.6 : 3.2)));
    const W = warpNow;
    window.__shipWarp = W;

    // ship motion
    rig.position.y = Math.sin(t * 0.55) * 0.12;
    rig.rotation.x = Math.sin(t * 0.33) * 0.06 + (W > 0.05 ? Math.sin(t * 37) * 0.004 * W : 0);
    rig.rotation.z = Math.sin(t * 0.27) * 0.025 - W * 0.04;
    rig.rotation.y = Math.sin(t * 0.21) * 0.04;
    animateShip(ship, t, W);

    // drones
    drones.forEach((d) => {
      const u = d.userData; const a = t * u.sp + u.ph;
      d.position.set(Math.cos(a) * u.r, Math.sin(a * 1.3) * 1.2 + Math.sin(a) * u.tilt * u.r * 0.3, Math.sin(a) * u.r);
      const nx = -Math.sin(a), nz = Math.cos(a);
      d.rotation.y = Math.atan2(-nz, nx);
      d.visible = W < 0.3;
    });

    warpField.update(dt, W);
    trails.update(dt, P.emitters.concat(W < 0.3 ? droneEmitters : []), W);

    // camera
    px += (tpx - px) * 0.04; py += (tpy - py) * 0.04;
    if (!free) {
      shotT += dt;
      let s = SHOTS[shotIdx];
      if (shotT > s.dur && W < 0.1 && !REDUCED) { shotT = 0; shotIdx = (shotIdx + 1) % SHOTS.length; s = SHOTS[shotIdx]; elCam.textContent = s.name; }
      const u = clamp(shotT / s.dur, 0, 1) * 2 - 1;
      const tAz = s.az + s.daz * u + px * 0.22, tEl = clamp(s.el + s.del * u - py * 0.1, -0.5, 1.2);
      const tR = s.R * (1 - W * 0.22) * distScale, tTx = W > 0.3 ? 0.4 : s.tx;
      let dAz = tAz - cam.az; dAz = Math.atan2(Math.sin(dAz), Math.cos(dAz));
      if (snap) { cam.az = tAz; cam.el = tEl; cam.R = tR; cam.tx = tTx; snap = false; }
      else { damp(cam, 'az', cam.az + dAz, dt); damp(cam, 'el', tEl, dt); damp(cam, 'R', tR, dt); damp(cam, 'tx', tTx, dt); }
      camera.position.set(cam.R * Math.cos(cam.el) * Math.sin(cam.az), cam.R * Math.sin(cam.el), cam.R * Math.cos(cam.el) * Math.cos(cam.az));
      look.set(cam.tx, 0, 0); camera.lookAt(look);
    } else {
      controls.update();
    }
    const fov = 34 + W * 26;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    if (W > 0.02) camera.position.add(new THREE.Vector3(rand(-1, 1), rand(-1, 1), 0).multiplyScalar(0.02 * W));

    stars.material.uniforms.uTime.value = t;
    nebula.material.uniforms.uTime.value = t;
    planet.userData.mat.uniforms.uTime.value = t;
    planet.userData.planet.rotation.y = t * 0.01;
    S.grade.uniforms.uTime.value = t;
    shieldMat.uniforms.uTime.value = t;
    shieldMat.uniforms.uHit.value *= Math.exp(-dt * 1.4);
    shieldMat.uniforms.uRipple.value += dt * 1.5;
    shield.visible = shieldMat.uniforms.uHit.value > 0.01;
    S.grade.uniforms.uFlash.value *= Math.exp(-dt * 3.5);
    S.grade.uniforms.uAberration.value = 0.004 + W * 0.01;
    S.bloom.strength = 1.05 + W * 0.6;

    placeCallouts(t);

    telT -= dt;
    if (telT <= 0) {
      telT = 0.25;
      elVel.textContent = W > 0.5 ? `Warp ${(6 + W * 1.2).toFixed(2)}` : `${(0.18 + W * 0.6 + Math.sin(t) * 0.005).toFixed(3)} c`;
      const hd = (212 + Math.sin(t * 0.1) * 6 + 360) % 360;
      elHead.textContent = `${hd.toFixed(1)}° m${(14 + Math.sin(t * 0.07) * 3).toFixed(0)}`;
    }
    S.composer.render(dt);
  }
  requestAnimationFrame(tick);
  window.__heroDebug = { skip(sec = 20) { introDrop = -1; warpTarget = 0; warpNow = 0; t += sec; snap = true; }, warp() { introDrop = -1; warpTarget = 1; warpNow = 1; }, free() { btnLook.click(); }, shot(i) { introDrop = -1; warpTarget = 0; warpNow = 0; shotIdx = i; shotT = 0; snap = true; elCam.textContent = SHOTS[i].name; }, hit() { shieldHit(ship.localToWorld(new THREE.Vector3(3, 1, 2)), 1.3); }, state() { return { warpNow, warpTarget, calloutsOn, t, W: S.w, H: S.h, avoid: avoidRects.length }; } };
  return { stage: S, ship };
}

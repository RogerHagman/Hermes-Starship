/* ═══════════════ the ship model ═══════════════ */
// A saucer, a neck, an engineering hull below and behind it, and two nacelles on swept pylons.
// Ship space: +x is the bow, +y is up, +z is starboard.
const SAUCER = { x: 2.45, y: 0.55, rx: 2.7, rz: 3.0 };
// Saucer profile with the radius normalised to the rim: [r, y], top centre first, round the rim, bottom centre last.
const SAUCER_PROFILE = [[0, 0.34], [0.12, 0.33], [0.3, 0.29], [0.5, 0.23], [0.7, 0.155], [0.85, 0.09], [0.95, 0.045], [1.0, 0.0], [0.99, -0.04], [0.93, -0.07], [0.75, -0.115], [0.5, -0.185], [0.3, -0.24], [0.12, -0.285], [0, -0.3]];
// Engineering hull profile: [radius, position along the ship]. Stern at -4.3, deflector face at +1.52.
const HULL_PROFILE = [[0.0, -4.3], [0.24, -4.28], [0.36, -4.14], [0.47, -3.7], [0.58, -2.8], [0.6, -1.6], [0.6, -0.4], [0.57, 0.5], [0.52, 1.1], [0.47, 1.42], [0.44, 1.5], [0.0, 1.52]];
const HULL_Y = -0.7, HULL_SQUASH = 1.0, HULL_WIDE = 0.82;
const NACELLE = { x: -2.75, y: 0.45, z: 2.5 };
function hullRadius(x) {
  const P = HULL_PROFILE;
  if (x <= P[0][1]) return P[0][0];
  for (let i = 1; i < P.length; i++) {
    if (x <= P[i][1]) { const t = (x - P[i - 1][1]) / (P[i][1] - P[i - 1][1]); return lerp(P[i - 1][0], P[i][0], t); }
  }
  return 0;
}

function makeSaucerTextures() {
  const W = 2048, H = 1024;
  const map = document.createElement('canvas'); map.width = W; map.height = H;
  const em = document.createElement('canvas'); em.width = W; em.height = H;
  const g = map.getContext('2d'), e = em.getContext('2d');
  g.fillStyle = '#8a94ac'; g.fillRect(0, 0, W, H);
  e.fillStyle = '#000'; e.fillRect(0, 0, W, H);
  // Lathe UVs: u runs round the saucer from starboard (0) through the bow (.25) and port (.5) to the stern (.75);
  // v here runs from the top centre (0) out to the rim (.5) and back to the bottom centre (1). The lathe is built bottom first
  // (so its faces point outward), which puts the top on the canvas's upper half.
  const SP = SAUCER_PROFILE, N = SP.length - 1;
  const vTop = (r) => { for (let i = 1; i <= 7; i++) { const r0 = SP[i - 1][0], r1 = SP[i][0]; if (r <= r1) return (i - 1 + (r - r0) / (r1 - r0)) / N; } return 0.5; };
  const vBot = (r) => { for (let i = 8; i <= N; i++) { const r0 = SP[i - 1][0], r1 = SP[i][0]; if (r >= r1) return (i - 1 + (r0 - r) / (r0 - r1)) / N; } return 1; };
  const Y = (v) => v * H;
  // plating: rings of panels, more of them toward the rim
  const bands = [[0.12, 0.3], [0.3, 0.45], [0.45, 0.58], [0.58, 0.7], [0.7, 0.8], [0.8, 0.88], [0.88, 0.95], [0.95, 0.995]];
  for (const vf of [vTop, vBot]) {
    for (const [r0, r1] of bands) {
      const ya = Y(vf(r0)), yb = Y(vf(r1)), y0 = Math.min(ya, yb), hh = Math.abs(yb - ya);
      const n = Math.round(16 + r1 * 80);
      for (let k = 0; k < n; k++) {
        const x = k * W / n, w = W / n;
        const j = rand(-12, 12);
        g.fillStyle = `rgb(${138 + j},${148 + j},${172 + j})`; g.fillRect(x, y0, w, hh);
        g.strokeStyle = 'rgba(32,38,60,.5)'; g.lineWidth = 2; g.strokeRect(x + 1, y0 + 1, w - 2, hh - 2);
        if (Math.random() < 0.16) { g.fillStyle = 'rgba(44,52,78,.35)'; g.fillRect(x + 5, y0 + 4, w - 10, Math.min(8, hh - 8)); }
      }
    }
  }
  // lifeboat hatches in a ring on the top
  g.fillStyle = 'rgba(30,36,56,.7)';
  for (let k = 0; k < 96; k++) if (k % 12 > 1) g.fillRect(k * W / 96 + 4, Y(vTop(0.66)) - 5, 9, 10);
  // a teal light ring on the top, the local rail
  for (const ctx of [g, e]) { ctx.fillStyle = ctx === g ? '#3fc1a5' : 'rgba(63,193,165,.55)'; ctx.fillRect(0, Y(vTop(0.8)) - 3, W, 6); }
  // rim pinstripes: starboard half in Claude pink, port half in Codex amber, with gaps at the bow and stern
  const stripe = (u0, u1, col, glowCol) => {
    for (const ctx of [g, e]) { ctx.fillStyle = ctx === g ? col : glowCol; ctx.fillRect(u0 * W, Y(vTop(0.975)) - 3, (u1 - u0) * W, 6); }
  };
  stripe(0.28, 0.72, '#f0a948', 'rgba(240,169,72,.55)');
  stripe(0.78, 1.0, '#e889b6', 'rgba(232,137,182,.55)'); stripe(0.0, 0.22, '#e889b6', 'rgba(232,137,182,.55)');
  // windows: rows near the rim, top and bottom
  const windowRow = (y) => {
    let x = rand(0, 20);
    while (x < W) {
      const run = Math.floor(rand(4, 16));
      for (let i = 0; i < run && x < W; i++) {
        g.fillStyle = '#121a2c'; g.fillRect(x, y - 3, 7, 6);
        if (Math.random() < 0.74) { const r = Math.random(); e.fillStyle = r < 0.72 ? '#ffd9a0' : r < 0.92 ? '#cfe6ff' : '#3fc1a5'; e.fillRect(x + 1, y - 2, 5, 4); }
        x += 11;
      }
      x += rand(16, 48);
    }
  };
  [0.9, 0.94, 0.985].forEach((r) => windowRow(Y(vTop(r))));
  [0.97, 0.9, 0.82].forEach((r) => windowRow(Y(vBot(r))));
  windowRow(Y(7.5 / N));
  // registry on the top, centred on the bow; turned round so it reads from above with the bow up
  const regY = Y(vTop(0.55));
  for (const ctx of [g, e]) {
    ctx.save(); ctx.translate(0.25 * W, regY); ctx.scale(-1.35, -1);
    ctx.font = '700 40px "Chakra Petch", "Barlow", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = ctx === g ? '#e8ecf8' : 'rgba(120,140,210,.35)';
    ctx.fillText('H E R M E S   ·   R H - 2 7', 0, 0);
    ctx.restore();
  }
  const mapT = new THREE.CanvasTexture(map); mapT.encoding = THREE.sRGBEncoding; mapT.anisotropy = 8;
  const emT = new THREE.CanvasTexture(em); emT.encoding = THREE.sRGBEncoding; emT.anisotropy = 8;
  return { map: mapT, emissive: emT };
}

function makeHullTextures() {
  const W = 2048, H = 1024;
  const map = document.createElement('canvas'); map.width = W; map.height = H;
  const em = document.createElement('canvas'); em.width = W; em.height = H;
  const g = map.getContext('2d'), e = em.getContext('2d');
  // canvas x = around the hull (u), canvas y = along the hull, bow at the top (v = 1)
  g.fillStyle = '#7f8aa2'; g.fillRect(0, 0, W, H);
  e.fillStyle = '#000'; e.fillRect(0, 0, W, H);
  // plating: recursive panels
  function panel(x, y, w, h, depth) {
    if (depth > 0 && (w > 90 || h > 60) && Math.random() < 0.88) {
      if (w / 3.2 > h) { const s = w * rand(0.3, 0.7); panel(x, y, s, h, depth - 1); panel(x + s, y, w - s, h, depth - 1); }
      else { const s = h * rand(0.3, 0.7); panel(x, y, w, s, depth - 1); panel(x, y + s, w, h - s, depth - 1); }
      return;
    }
    const k = rand(-14, 14);
    g.fillStyle = `rgb(${127 + k},${138 + k},${162 + k})`;
    g.fillRect(x, y, w, h);
    g.strokeStyle = 'rgba(30,36,56,.55)'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2);
    if (Math.random() < 0.18) { g.fillStyle = 'rgba(40,48,72,.35)'; g.fillRect(x + 6, y + 6, w - 12, Math.min(10, h - 12)); }
  }
  for (let x = 0; x < W; x += 256) for (let y = 0; y < H; y += 128) panel(x, y, 256, 128, 5);
  // dorsal spine (top is u = .75)
  g.fillStyle = 'rgba(38,46,72,.85)'; g.fillRect(W * 0.75 - 70, 0, 140, H);
  g.fillStyle = 'rgba(160,170,200,.35)'; for (let y = 10; y < H; y += 26) g.fillRect(W * 0.75 - 60, y, 120, 3);
  // ventral keel (bottom is u = .25)
  g.fillStyle = 'rgba(30,36,58,.8)'; g.fillRect(W * 0.25 - 90, 0, 180, H);
  // livery: starboard upper flank pink, port upper flank amber, teal waist line both sides
  const stripe = (u, col, wpx, glow) => {
    g.fillStyle = col; g.fillRect(u * W - wpx / 2, H * 0.08, wpx, H * 0.84);
    e.fillStyle = glow; e.fillRect(u * W - wpx / 2, H * 0.08, wpx, H * 0.84);
  };
  stripe(0.885, '#e889b6', 10, 'rgba(232,137,182,.55)');
  stripe(0.615, '#f0a948', 10, 'rgba(240,169,72,.55)');
  stripe(0.0 + 0.004, '#3fc1a5', 6, 'rgba(63,193,165,.5)'); stripe(0.996, '#3fc1a5', 6, 'rgba(63,193,165,.5)');
  stripe(0.5, '#3fc1a5', 6, 'rgba(63,193,165,.5)');
  // windows: deck rows run along the ship at constant u
  const rows = [0.975, 0.95, 0.925, 0.03, 0.055, 0.525, 0.55, 0.575, 0.47, 0.445];
  rows.forEach((u, ri) => {
    const x = u * W;
    let y = H * rand(0.14, 0.2);
    const end = H * rand(0.84, 0.9);
    while (y < end) {
      const run = Math.floor(rand(3, 14));
      for (let i = 0; i < run && y < end; i++) {
        g.fillStyle = '#121a2c'; g.fillRect(x - 6, y, 12, 6);
        if (Math.random() < 0.72) {
          const r = Math.random();
          e.fillStyle = r < 0.7 ? '#ffd9a0' : r < 0.9 ? '#cfe6ff' : '#3fc1a5';
          e.fillRect(x - 5, y + 1, 10, 4);
        }
        y += 10;
      }
      y += rand(14, 40);
    }
  });
  // registry on both upper flanks, near the nose; text runs along the ship
  const reg = (u, flip) => {
    for (const ctx of [g, e]) {
      ctx.save(); ctx.translate(u * W, H * 0.66); ctx.rotate(flip ? Math.PI / 2 : -Math.PI / 2);
      ctx.font = '700 34px "Chakra Petch", "Barlow", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = ctx === g ? '#e8ecf8' : 'rgba(120,135,220,.35)';
      ctx.fillText('H E R M E S   ·   R H - 2 7', 0, 0);
      ctx.restore();
    }
  };
  reg(0.83, false); reg(0.67, true);
  // shuttle bay at the tail top
  e.fillStyle = 'rgba(255,220,170,.9)'; e.fillRect(W * 0.75 - 40, H * 0.04, 80, 16);
  g.fillStyle = '#22293f'; g.fillRect(W * 0.75 - 46, H * 0.035, 92, 26);
  const mapT = new THREE.CanvasTexture(map); mapT.encoding = THREE.sRGBEncoding; mapT.anisotropy = 8;
  const emT = new THREE.CanvasTexture(em); emT.encoding = THREE.sRGBEncoding; emT.anisotropy = 8;
  return { map: mapT, emissive: emT };
}

function buildShip() {
  const ship = new THREE.Group();
  ship.name = 'HSS Hermes';
  const P = { anchors: {}, pulse: [], blink: [], emitters: [], nacelleMats: [], scan: null, glowMats: [] };
  const tex = makeHullTextures(), stex = makeSaucerTextures();
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex.map, emissive: 0xffffff, emissiveMap: tex.emissive, emissiveIntensity: 2.4, metalness: 0.5, roughness: 0.4, envMapIntensity: 0.55 });
  const saucerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: stex.map, emissive: 0xffffff, emissiveMap: stex.emissive, emissiveIntensity: 2.4, metalness: 0.5, roughness: 0.38, envMapIntensity: 0.55 });
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xaab3cb, metalness: 0.55, roughness: 0.32, envMapIntensity: 0.55 });
  const plateMat2 = new THREE.MeshStandardMaterial({ color: 0x7f89a3, metalness: 0.6, roughness: 0.38, envMapIntensity: 0.55 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1b2238, metalness: 0.7, roughness: 0.42, envMapIntensity: 0.6 });
  const glassGold = new THREE.MeshStandardMaterial({ color: 0x2a2208, emissive: new THREE.Color('#e8c37a'), emissiveIntensity: 0.22, metalness: 0.9, roughness: 0.08, envMapIntensity: 1.2 });
  const glow = (hex, k = 3) => { const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k) }); m.userData.base = new THREE.Color(hex); m.userData.k = k; P.glowMats.push(m); return m; };
  const S = SAUCER;

  // ─── saucer
  const sGeo = new THREE.LatheGeometry(SAUCER_PROFILE.slice().reverse().map(([r, y]) => new THREE.Vector2(r, y)), 128);
  sGeo.scale(S.rx, 1, S.rz);
  const saucer = new THREE.Mesh(sGeo, saucerMat); saucer.position.set(S.x, S.y, 0); ship.add(saucer);
  const top = S.y + SAUCER_PROFILE[0][1];
  // raised command deck and the bridge dome (gold glass: the captain's colour)
  const bmGeo = new THREE.LatheGeometry([[0, -0.05], [0.48, -0.05], [0.42, 0.03], [0.3, 0.1], [0.16, 0.145], [0, 0.15]].map(([r, y]) => new THREE.Vector2(r, y)), 64);
  bmGeo.scale(1.2, 1, 1);
  const bm = new THREE.Mesh(bmGeo, plateMat); bm.position.set(S.x + 0.2, top - 0.01, 0); ship.add(bm);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassGold);
  dome.scale.set(1.3, 0.55, 1); dome.position.set(S.x + 0.24, top + 0.13, 0); ship.add(dome);
  const domeRing = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.018, 8, 48), glow('#e8c37a', 2.2));
  domeRing.rotation.x = Math.PI / 2; domeRing.scale.set(1.3, 1, 1); domeRing.position.set(S.x + 0.24, top + 0.135, 0); ship.add(domeRing);
  P.anchors.bridge = new THREE.Object3D(); P.anchors.bridge.position.set(S.x + 0.24, top + 0.3, 0); ship.add(P.anchors.bridge);
  // lower sensor dome (Sensors' array)
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 16), glow('#e889b6', 2.2)); lens.scale.set(1.35, 0.42, 1.35); lens.position.set(S.x + 0.25, S.y + SAUCER_PROFILE[SAUCER_PROFILE.length - 1][1] + 0.01, 0); ship.add(lens);
  const lensRim = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.035, 8, 48), plateMat2); lensRim.rotation.x = Math.PI / 2; lensRim.position.copy(lens.position).add(new THREE.Vector3(0, 0.03, 0)); ship.add(lensRim);
  P.pulse.push({ m: lens.material, base: 2.2, amp: 0.8, f: 1.3 });
  P.anchors.sensors = new THREE.Object3D(); P.anchors.sensors.position.set(S.x + 0.25, S.y - 0.4, 0); ship.add(P.anchors.sensors);
  // rim light round the saucer (hull glow: decoration only), with a running light that circles it
  const rimPts = [];
  for (let i = 0; i < 180; i++) { const a = i / 180 * Math.PI * 2; rimPts.push(new THREE.Vector3(Math.cos(a) * S.rx * 1.012, 0, Math.sin(a) * S.rz * 1.012)); }
  const ring = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPts, true), 360, 0.028, 8, true), glow('#4fa3ff', 1.3));
  ring.position.set(S.x, S.y, 0); ship.add(ring);
  P.pulse.push({ m: ring.material, base: 1.3, amp: 0.4, f: 0.7 });
  const scan = new THREE.Group(); ship.add(scan);
  scan.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), glow('#ffffff', 4)));
  scan.add(glowSprite('#4fa3ff', 0.9, 2.4));
  P.scan = scan;
  // impulse engines on the aft rim, on the local rail
  for (const s of [1, -1]) {
    const imp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.075, 0.5), glow('#3fc1a5', 3.2));
    const a = Math.PI + 0.17 * s;
    imp.position.set(S.x + Math.cos(a) * S.rx * 0.992, S.y + 0.005, Math.sin(a) * S.rz * 0.992); imp.rotation.y = -0.17 * s; ship.add(imp);
    P.pulse.push({ m: imp.material, base: 3.2, amp: 0.8, f: 2, ph: s, warp: true });
    P.emitters.push({ obj: ship, local: imp.position.clone().add(new THREE.Vector3(-0.08, 0, 0)), color: new THREE.Color('#3fc1a5'), rate: 26, spread: 0.08 });
  }
  // antenna mast and the running lights on the rim (red to port, green to starboard)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.42, 6), darkMat); mast.position.set(S.x - 1.0, top + 0.12, 0); ship.add(mast);
  const mastTip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glow('#ff4040', 4)); mastTip.position.set(S.x - 1.0, top + 0.34, 0); ship.add(mastTip);
  P.blink.push({ m: mastTip.material, kind: 'slow', phase: 0.3 });
  for (const s of [1, -1]) {
    const rl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), glow(s > 0 ? '#38ff7a' : '#ff3b3b', 4));
    rl.position.set(S.x - 0.2, S.y + 0.02, (S.rz + 0.04) * s); ship.add(rl);
    P.blink.push({ m: rl.material, kind: 'steady', phase: s });
  }
  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), glow('#8fa8e0', 4)); noseTip.position.set(S.x + S.rx + 0.05, S.y, 0); ship.add(noseTip);
  P.blink.push({ m: noseTip.material, kind: 'slow', phase: 1.2 });

  // ─── neck: a swept fin from the aft underside of the saucer down to the engineering hull
  const neckShape = new THREE.Shape();
  neckShape.moveTo(1.6, 0.44);
  neckShape.lineTo(0.35, 0.58);
  neckShape.quadraticCurveTo(-0.5, 0.15, -1.15, -0.3);
  neckShape.lineTo(0.7, -0.3);
  neckShape.quadraticCurveTo(0.95, 0.12, 1.6, 0.44);
  const neckGeo = new THREE.ExtrudeGeometry(neckShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 3, curveSegments: 24 });
  neckGeo.translate(0, 0, -0.25);
  const neckW = (y) => lerp(1.15, 0.72, clamp((y + 0.3) / 0.86, 0, 1));
  const np = neckGeo.attributes.position;
  for (let i = 0; i < np.count; i++) np.setZ(i, np.getZ(i) * neckW(np.getY(i)));
  neckGeo.computeVertexNormals();
  ship.add(new THREE.Mesh(neckGeo, plateMat));
  // lit windows down both faces of the neck
  for (const s of [1, -1]) {
    for (let k = 0; k < 7; k++) {
      const y = -0.18 + k * 0.075, x = lerp(0.85, 1.32, k / 6) - 0.22;
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.01), glow('#ffe2b0', 2.2));
      win.position.set(x, y, (0.25 * neckW(y) + 0.072) * s); ship.add(win);
    }
  }

  // ─── engineering hull
  const fusGeo = new THREE.LatheGeometry(HULL_PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 96);
  fusGeo.rotateZ(-Math.PI / 2);
  fusGeo.scale(1, HULL_SQUASH, HULL_WIDE);
  const fus = new THREE.Mesh(fusGeo, hullMat); fus.position.y = HULL_Y; ship.add(fus);
  // deflector dish on the bow of the engineering hull (hull glow: decoration, not a rail)
  const defl = new THREE.Group(); defl.position.set(1.5, HULL_Y - 0.02, 0); defl.scale.set(1, 0.98, 0.84); ship.add(defl);
  const dishRim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 10, 48), plateMat); dishRim.rotation.y = Math.PI / 2; defl.add(dishRim);
  const dish = new THREE.Mesh(new THREE.CircleGeometry(0.33, 48), glow('#4fa3ff', 2.0)); dish.rotation.y = Math.PI / 2; dish.position.x = 0.02; defl.add(dish);
  const dishCore = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), glow('#ffffff', 3)); dishCore.position.x = 0.05; defl.add(dishCore);
  for (let k = 0; k < 3; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.14 + k * 0.065, 0.008, 6, 40), glow('#bfe0ff', 2.4)); r.rotation.y = Math.PI / 2; r.position.x = 0.03; defl.add(r); }
  P.pulse.push({ m: dish.material, base: 2.0, amp: 1.0, f: 2.6 });
  // main engine (the local core) at the stern
  const eng = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 12, 48), glow('#3fc1a5', 3.5)); eng.rotation.y = Math.PI / 2; eng.scale.set(HULL_WIDE, HULL_SQUASH * 1.05, 1); eng.position.set(-4.27, HULL_Y, 0); ship.add(eng);
  const engDisc = new THREE.Mesh(new THREE.CircleGeometry(0.24, 40), glow('#3fc1a5', 2.4)); engDisc.rotation.y = -Math.PI / 2; engDisc.scale.set(HULL_WIDE, HULL_SQUASH, 1); engDisc.position.set(-4.31, HULL_Y, 0); ship.add(engDisc);
  P.pulse.push({ m: eng.material, base: 3.5, amp: 1.0, f: 1.7, warp: true }, { m: engDisc.material, base: 2.4, amp: 0.8, f: 1.7, warp: true });
  const engFlare = glowSprite('#3fc1a5', 2.0, 1.2); engFlare.position.set(-4.5, HULL_Y, 0); ship.add(engFlare);
  P.pulse.push({ m: engFlare.material, base: 1.4, amp: 0.4, f: 4, warp: true, sprite: true });
  P.emitters.push({ obj: ship, local: new THREE.Vector3(-4.38, HULL_Y, 0), color: new THREE.Color('#3fc1a5'), rate: 100, spread: 0.22 });
  P.anchors.local = new THREE.Object3D(); P.anchors.local.position.set(-4.32, HULL_Y, 0); ship.add(P.anchors.local);
  // holodeck: a lit pod on the engineering hull's back, aft of the pylons
  const hullTop = (x) => HULL_Y + hullRadius(x) * HULL_SQUASH;
  const holo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.27, 0.13, 6), darkMat); holo.position.set(-3.75, hullTop(-3.75) - 0.01, 0); ship.add(holo);
  const holoGrid = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.02, 6), glow('#e889b6', 2.0)); holoGrid.position.set(-3.75, hullTop(-3.75) + 0.065, 0); ship.add(holoGrid);
  P.pulse.push({ m: holoGrid.material, base: 1.8, amp: 0.9, f: 2.1 });
  P.anchors.holodeck = new THREE.Object3D(); P.anchors.holodeck.position.set(-3.75, hullTop(-3.75) + 0.13, 0); ship.add(P.anchors.holodeck);
  // greebles along the engineering hull's back
  const gGeo = new THREE.BoxGeometry(1, 1, 1);
  const gCount = 22;
  const greebles = new THREE.InstancedMesh(gGeo, plateMat2, gCount);
  const greebles2 = new THREE.InstancedMesh(gGeo, plateMat, gCount);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3();
  for (let i = 0; i < gCount; i++) {
    for (const [im, spread] of [[greebles, 0.55], [greebles2, 0.75]]) {
      let x = rand(-3.6, 1.2);
      if (x > -1.3 && x < 0.85) x = rand(-3.6, -1.4);
      const r = hullRadius(x);
      const z = rand(-spread, spread) * r;
      const y = HULL_Y + HULL_SQUASH * Math.sqrt(Math.max(0, r * r - z * z));
      pos.set(x, y, z * HULL_WIDE);
      sc.set(rand(0.06, 0.2), rand(0.015, 0.035), rand(0.04, 0.1));
      m4.compose(pos, q, sc); im.setMatrixAt(i, m4);
    }
  }
  ship.add(greebles, greebles2);
  // waistline lights along both flanks and two armour bands
  for (const sgn of [1, -1]) {
    const pts = [];
    for (let x = -4.0; x <= 1.3; x += 0.25) pts.push(new THREE.Vector3(x, HULL_Y + 0.02, (hullRadius(x) * HULL_WIDE + 0.004) * sgn));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 100, 0.014, 6), glow('#3fc1a5', 2.2));
    ship.add(tube);
    P.pulse.push({ m: tube.material, base: 2.2, amp: 0.8, f: 0.8, ph: sgn });
  }
  for (const bx of [-3.95, 1.12]) {
    const r = hullRadius(bx) + 0.035;
    const band = new THREE.Mesh(new THREE.TorusGeometry(r, 0.045, 8, 64), darkMat);
    band.rotation.y = Math.PI / 2; band.scale.set(HULL_WIDE, HULL_SQUASH * 1.02, 1); band.position.set(bx, HULL_Y, 0); ship.add(band);
    for (const s of [1, -1]) {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), glow('#ffe2b0', 3.5));
      lamp.position.set(bx, HULL_Y, (r * HULL_WIDE + 0.02) * s); ship.add(lamp);
    }
  }
  // customs ring round the engineering hull where the pylons leave it: everything bound for a nacelle passes Security's scan
  const CX = -2.72;
  for (const [dx, k, tube] of [[0, 2.6, 0.045], [0.16, 1.4, 0.018], [-0.16, 1.4, 0.018]]) {
    const r = hullRadius(CX + dx) + 0.05;
    const cr = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, 72), glow('#8fa8e0', k));
    cr.rotation.y = Math.PI / 2; cr.scale.set(HULL_WIDE, HULL_SQUASH, 1); cr.position.set(CX + dx, HULL_Y, 0); ship.add(cr);
    if (!dx) { P.ring = cr; P.pulse.push({ m: cr.material, base: 2.6, amp: 1.4, f: 0.9 }); }
  }
  P.anchors.customs = new THREE.Object3D(); P.anchors.customs.position.set(CX, HULL_Y + hullRadius(CX) * HULL_SQUASH + 0.1, 0); ship.add(P.anchors.customs);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), glow('#ffffff', 4)); belly.position.set(-1.2, HULL_Y - hullRadius(-1.2) * HULL_SQUASH - 0.02, 0); ship.add(belly);
  P.blink.push({ m: belly.material, kind: 'strobe', phase: 0.5 });

  // ─── pylons and nacelles. Port carries Codex, starboard carries Claude.
  const railCol = { port: '#f0a948', star: '#e889b6' };
  const N = NACELLE;
  const root = new THREE.Vector3(0, HULL_Y + 0.34, 0.36);
  const tip = new THREE.Vector3(0, N.y - 0.14, N.z - 0.1);
  const span = tip.clone().sub(root), L = span.length(), th = Math.atan2(span.z, span.y);
  // planform in pylon space: x along the ship, y along the span
  const pyShape = new THREE.Shape();
  pyShape.moveTo(-2.05, 0);
  pyShape.quadraticCurveTo(-2.3, L * 0.6, -2.65, L);
  pyShape.lineTo(-3.4, L);
  pyShape.quadraticCurveTo(-3.33, L * 0.5, -3.42, 0);
  pyShape.lineTo(-2.05, 0);
  const pyGeo = new THREE.ExtrudeGeometry(pyShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.035, bevelSegments: 3, curveSegments: 24 });
  pyGeo.translate(0, 0, -0.04);
  const pyLE = new THREE.QuadraticBezierCurve(new THREE.Vector2(-2.05, 0), new THREE.Vector2(-2.3, L * 0.6), new THREE.Vector2(-2.65, L));
  for (const side of ['star', 'port']) {
    const sgn = side === 'star' ? 1 : -1;
    const col = railCol[side];
    // built for starboard; the port side is the same group mirrored
    const mirror = new THREE.Group(); mirror.scale.z = sgn; ship.add(mirror);
    const pylon = new THREE.Group(); pylon.position.copy(root); pylon.rotation.x = th; mirror.add(pylon);
    pylon.add(new THREE.Mesh(pyGeo, plateMat));
    // lit leading edge and two power conduits in the rail colour
    const le = pyLE.getPoints(30).map((p) => new THREE.Vector3(p.x + 0.045, p.y, 0));
    const leTube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(le), 48, 0.02, 8), glow(col, 2.2));
    pylon.add(leTube);
    P.pulse.push({ m: leTube.material, base: 2.2, amp: 0.6, f: 1.4, ph: sgn > 0 ? 0 : 2 });
    for (const [x0, x1, ph] of [[-2.5, -2.88, 0], [-2.95, -3.16, 1.6]]) {
      const c = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(x0, L * 0.06, 0.078), new THREE.Vector3(x1, L * 0.94, 0.078)), 8, 0.013, 6), glow(col, 1.5));
      pylon.add(c);
      P.pulse.push({ m: c.material, base: 1.5, amp: 1.2, f: 3, ph, warp: true });
    }

    const nac = new THREE.Group();
    nac.position.set(N.x, N.y, N.z * sgn); nac.scale.set(1.12, 0.72, 0.86);
    const nProf = [[0, -1.85], [0.17, -1.85], [0.26, -1.7], [0.3, -1.2], [0.32, 0.2], [0.31, 1.1], [0.27, 1.5], [0.2, 1.72], [0.0, 1.78]].map(([r, y]) => new THREE.Vector2(r, y));
    const nGeo = new THREE.LatheGeometry(nProf, 40); nGeo.rotateZ(-Math.PI / 2);
    nac.add(new THREE.Mesh(nGeo, plateMat));
    const buss = new THREE.Mesh(new THREE.SphereGeometry(0.235, 24, 16), glow(col, 3.2)); buss.position.x = 1.6; buss.scale.set(1.15, 1, 1); nac.add(buss);
    P.pulse.push({ m: buss.material, base: 3.2, amp: 1.2, f: 2.4, warp: true });
    // inboard warp grilles
    for (const yy of [0.12, -0.12]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.07, 0.06), glow(col, 2.6));
      strip.position.set(-0.1, yy, -0.3 * sgn); nac.add(strip);
      P.pulse.push({ m: strip.material, base: 2.6, amp: 1.2, f: 3.1, ph: yy * 10, warp: true });
    }
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 0.12), glow(col, 1.8)); topStrip.position.set(-0.1, 0.31, 0); nac.add(topStrip);
    // coil segments along the nacelle
    const coilGeo = new THREE.TorusGeometry(0.322, 0.022, 8, 40);
    for (let k = 0; k < 7; k++) {
      const coil = new THREE.Mesh(coilGeo, k % 2 ? darkMat : plateMat2);
      coil.rotation.y = Math.PI / 2; coil.position.x = -1.3 + k * 0.38; nac.add(coil);
    }
    // outboard grille lights
    for (let k = 0; k < 9; k++) {
      const gl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.04), glow(col, 2.2));
      gl.position.set(-1.25 + k * 0.29, 0, 0.31 * sgn); nac.add(gl);
      P.pulse.push({ m: gl.material, base: 2.2, amp: 2.2, f: 6, ph: -k * 0.7, warp: true });
    }
    // tail fin and a strobe on top
    const tfShape = new THREE.Shape(); tfShape.moveTo(0, 0); tfShape.lineTo(0.7, 0); tfShape.lineTo(0.05, 0.36); tfShape.lineTo(-0.15, 0.36); tfShape.lineTo(0, 0);
    const tfGeo = new THREE.ExtrudeGeometry(tfShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 1 }); tfGeo.translate(0, 0, -0.02);
    const tfTop = new THREE.Mesh(tfGeo, plateMat2); tfTop.position.set(-1.75, 0.26, 0); nac.add(tfTop);
    const strobe = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), glow('#ffffff', 4)); strobe.position.set(-1.88, 0.64, 0); nac.add(strobe);
    P.blink.push({ m: strobe.material, kind: 'strobe', phase: sgn > 0 ? 0 : 0.5 });
    // spinning vane inside the bussard
    const vane = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.012, 6, 32), glow(col, 3)); vane.position.x = 1.62; nac.add(vane);
    P.spin = P.spin || []; P.spin.push({ o: vane, axis: 'x', speed: 3 * sgn });
    const exhaust = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 32), glow(col, 4)); exhaust.rotation.y = Math.PI / 2; exhaust.position.x = -1.86; nac.add(exhaust);
    const flare = glowSprite(col, 1.3, 1.3); flare.position.x = -2.0; nac.add(flare);
    P.pulse.push({ m: flare.material, base: 1.6, amp: 0.5, f: 5, warp: true, sprite: true });
    ship.add(nac);
    P.emitters.push({ obj: nac, local: new THREE.Vector3(-2.0, 0, 0), color: new THREE.Color(col), rate: 70 });
    P.anchors[side === 'star' ? 'claude' : 'codex'] = buss;
  }

  ship.userData.parts = P;
  ship.userData.hullMat = hullMat;
  return ship;
}

function animateShip(ship, t, warp) {
  const P = ship.userData.parts;
  for (const p of P.pulse) {
    const k = p.base * (1 + (p.warp ? warp * 1.4 : 0)) + p.amp * Math.sin(t * p.f + (p.ph || 0)) * 0.5;
    const base = p.m.userData.base;
    if (base) p.m.color.copy(base).multiplyScalar(Math.max(0.2, k));
    else if (p.sprite) { /* sprite: scale opacity */ p.m.opacity = clamp(0.75 + 0.25 * Math.sin(t * p.f + (p.ph || 0)), 0, 1); }
  }
  if (P.spin) for (const s of P.spin) s.o.rotation[s.axis] = t * s.speed * (1 + warp * 3);
  if (P.scan) { const a = -t * 0.7; P.scan.position.set(SAUCER.x + Math.cos(a) * SAUCER.rx * 1.012, SAUCER.y, Math.sin(a) * SAUCER.rz * 1.012); }
  for (const b of P.blink) {
    const base = b.m.userData.base; if (!base) continue;
    let on;
    if (b.kind === 'strobe') { const c = (t * 0.75 + b.phase) % 1; on = (c < 0.04 || (c > 0.1 && c < 0.14)) ? 6 : 0.15; }
    else if (b.kind === 'slow') { on = (Math.sin(t * 2.2 + b.phase) > 0.4) ? 4 : 0.3; }
    else { on = 3 + Math.sin(t * 1.5 + b.phase) * 0.6; }
    b.m.color.copy(base).multiplyScalar(on);
  }
}

/* ═══════════════ crew: stylised character models ═══════════════ */
const GEO = {};
const geo = (k, f) => GEO[k] || (GEO[k] = f());
const MATS = {};
function crewMats(rail) {
  if (MATS[rail]) return MATS[rail];
  const c = new THREE.Color(RAIL[rail].hex);
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.5, metalness: 0.2 }, o));
  const m = {
    c,
    suit: std({ color: 0x1b2343, roughness: 0.78, metalness: 0.1 }),
    suit2: std({ color: 0x27325c, roughness: 0.72, metalness: 0.12 }),
    plate: std({ color: 0xdfe4f2, roughness: 0.3, metalness: 0.3, side: THREE.DoubleSide }),
    plate2: std({ color: 0xa9b2cc, roughness: 0.35, metalness: 0.45, side: THREE.DoubleSide }),
    dark: std({ color: 0x0c1020, roughness: 0.45, metalness: 0.6 }),
    visor: std({ color: 0x04060d, roughness: 0.06, metalness: 0.95, envMapIntensity: 1.8 }),
    accent: std({ color: c, emissive: c, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.2 }),
    glow: new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(3.2) }),
    glowSoft: new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(1.4), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    gold: std({ color: 0xe8c37a, metalness: 0.95, roughness: 0.22, emissive: new THREE.Color(0x3a2a00), emissiveIntensity: 0.6 }),
    glass: std({ color: 0xcfe0ff, transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.1, depthWrite: false }),
    coat: std({ color: 0xd6dbea, roughness: 0.82, metalness: 0.05, side: THREE.DoubleSide }),
    // two-tone uniform: a tunic in the rail colour under a black yoke
    tunic: std({ color: rail === 'gold' ? new THREE.Color('#d6a650') : c.clone().multiplyScalar(0.92), roughness: 0.68, metalness: 0.06 }),
    yoke: std({ color: 0x0b0e17, roughness: 0.66, metalness: 0.1 }),
    pip: std({ color: rail === 'gold' ? 0xe8c37a : 0xc9d2e6, metalness: 0.9, roughness: 0.25 }),
  };
  MATS[rail] = m;
  return m;
}
function mk(g, mat, x = 0, y = 0, z = 0, parent) {
  const o = new THREE.Mesh(g, mat); o.position.set(x, y, z); o.castShadow = true;
  if (parent) parent.add(o);
  return o;
}
function glowM(hex, k = 3) { return new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k) }); }

function makeBody(m, o = {}) {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  const legGeo = geo('leg', () => new THREE.CapsuleGeometry(0.075, 0.26, 4, 14));
  const bootGeo = geo('boot', () => { const g = new THREE.CapsuleGeometry(0.075, 0.12, 4, 12); g.rotateX(Math.PI / 2); g.scale(1.05, 0.75, 1); return g; });
  for (const s of [-1, 1]) {
    mk(legGeo, m.suit, 0.095 * s, 0.31, 0, body);
    mk(bootGeo, m.dark, 0.095 * s, 0.07, 0.035, body);
    mk(geo('knee', () => new THREE.SphereGeometry(0.06, 16, 10)), m.plate2, 0.095 * s, 0.3, 0.05, body).scale.set(1, 0.8, 0.6);
  }
  const pelvis = mk(geo('pelvis', () => new THREE.SphereGeometry(0.16, 24, 14)), m.suit, 0, 0.5, 0, body); pelvis.scale.set(1.12, 0.62, 0.85);
  const torsoGeo = geo('torso', () => new THREE.LatheGeometry([[0, 0.48], [0.165, 0.5], [0.18, 0.58], [0.165, 0.66], [0.2, 0.78], [0.235, 0.88], [0.225, 0.95], [0.14, 1.0], [0.06, 1.02], [0, 1.02]].map(([r, y]) => new THREE.Vector2(r, y)), 32));
  const torso = mk(torsoGeo, o.coat ? m.coat : m.tunic, 0, 0, 0, body); torso.scale.z = 0.8;
  // the black yoke across the chest and over the shoulders
  const yoke = mk(geo('yoke', () => new THREE.LatheGeometry([[0.186, 0.7], [0.21, 0.78], [0.245, 0.88], [0.236, 0.95], [0.149, 1.002], [0.064, 1.024], [0, 1.026]].map(([r, y]) => new THREE.Vector2(r, y)), 32)), m.yoke, 0, 0, 0, body); yoke.scale.z = 0.8;
  const collar = mk(geo('collar', () => new THREE.TorusGeometry(0.12, 0.04, 10, 28)), m.yoke, 0, 0.995, 0, body); collar.rotation.x = Math.PI / 2;
  // rank pips on the collar
  for (let i = 0; i < (o.pips || 2); i++) { const a = -2.55 - i * 0.17; mk(geo('pip', () => new THREE.SphereGeometry(0.011, 10, 8)), m.pip, Math.cos(a) * 0.163, 0.99, -Math.sin(a) * 0.163, body); }
  const belt = mk(geo('belt', () => new THREE.TorusGeometry(0.172, 0.028, 8, 32)), m.dark, 0, 0.53, 0, body); belt.rotation.x = Math.PI / 2; belt.scale.y = 0.82;
  mk(geo('buckle', () => new THREE.BoxGeometry(0.07, 0.045, 0.02)), m.glow, 0, 0.53, 0.148, body);
  // emblem: the Hermes chevron
  const emb = mk(geo('emblem', () => { const s = new THREE.Shape(); s.moveTo(-0.06, -0.02); s.lineTo(0, 0.045); s.lineTo(0.06, -0.02); s.lineTo(0.04, -0.035); s.lineTo(0, 0.012); s.lineTo(-0.04, -0.035); s.lineTo(-0.06, -0.02); return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false }); }), o.emblemMat || m.gold, 0.08, 0.86, 0.19, body);
  emb.rotation.y = 0.32;
  // shoulders + arms
  const arms = {};
  for (const [side, s] of [['L', 1], ['R', -1]]) {
    const sh = new THREE.Group(); sh.position.set(0.255 * s, 0.925, 0); body.add(sh);
    const pad = mk(geo('pad', () => new THREE.SphereGeometry(0.098, 20, 12)), o.padMat || m.yoke, 0, 0.01, 0, sh); pad.scale.set(1.12 * (o.padScale || 1), 0.72 * (o.padScale || 1), 1.0 * (o.padScale || 1));
    mk(geo('upper', () => new THREE.CapsuleGeometry(0.056, 0.16, 4, 12)), m.tunic, 0, -0.13, 0, sh);
    const elbow = new THREE.Group(); elbow.position.y = -0.265; sh.add(elbow);
    mk(geo('fore', () => new THREE.CapsuleGeometry(0.052, 0.15, 4, 12)), m.tunic, 0, -0.105, 0, elbow);
    const cuff = mk(geo('cuff', () => new THREE.TorusGeometry(0.056, 0.016, 6, 20)), m.accent, 0, -0.19, 0, elbow); cuff.rotation.x = Math.PI / 2;
    mk(geo('hand', () => new THREE.SphereGeometry(0.06, 16, 12)), m.plate, 0, -0.25, 0, elbow).scale.set(0.9, 1.05, 0.8);
    const hand = new THREE.Group(); hand.position.y = -0.27; elbow.add(hand);
    arms[side] = { sh, elbow, hand, s };
  }
  mk(geo('neck', () => new THREE.CylinderGeometry(0.055, 0.065, 0.09, 14)), m.dark, 0, 1.05, 0, body);
  const head = new THREE.Group(); head.position.y = 1.08; body.add(head);
  const helmet = mk(geo('helmet', () => new THREE.SphereGeometry(0.25, 40, 28)), o.helmMat || m.plate, 0, 0.21, 0, head); helmet.scale.set(1, 0.96, 1);
  const visor = mk(geo('visor', () => new THREE.SphereGeometry(0.254, 40, 24, Math.PI / 2 - 0.95, 1.9, 1.02, 0.92)), m.visor, 0, 0.21, 0, head);
  visor.castShadow = false;
  // visor rim
  const rim = mk(geo('vrim', () => { const g = new THREE.TorusGeometry(0.255, 0.012, 6, 40, 1.9); return g; }), m.accent, 0, 0.21 + 0.255 * Math.cos(1.02) * 0.98, 0, head);
  rim.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.95 + Math.PI); rim.scale.setScalar(Math.sin(1.02)); rim.visible = false;
  for (const s of [-1, 1]) {
    const ear = mk(geo('ear', () => new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20)), m.dark, 0.245 * s, 0.2, 0, head); ear.rotation.z = Math.PI / 2;
    const ring = mk(geo('earR', () => new THREE.TorusGeometry(0.05, 0.01, 6, 20)), m.glow, 0.272 * s, 0.2, 0, head); ring.rotation.y = Math.PI / 2;
  }
  // eyes
  const eyes = [];
  const vc = new THREE.Vector3(0, 0.21, 0);
  const eyeMat = o.eyeMat || m.glow;
  const style = o.eyes || 'dots';
  if (style === 'dots' || style === 'goggles') {
    for (const s of [-1, 1]) {
      const d = new THREE.Vector3(Math.sin(0.34) * s, 0.1, Math.cos(0.34)).normalize();
      const e = new THREE.Mesh(geo('eye', () => new THREE.SphereGeometry(0.034, 14, 10)), eyeMat);
      e.position.copy(vc).addScaledVector(d, 0.252); e.lookAt(e.position.clone().add(d)); e.scale.set(1, 1.4, 0.35);
      head.add(e); eyes.push(e);
    }
  } else if (style === 'bar') {
    const holder = new THREE.Group(); holder.position.set(0, 0.235, 0); holder.rotation.x = Math.PI / 2; head.add(holder);
    const bar = new THREE.Mesh(geo('ebar', () => new THREE.TorusGeometry(0.247, 0.019, 6, 30, 1.25)), eyeMat); bar.rotation.z = Math.PI / 2 - 0.625; bar.scale.set(1, 1, 1.6);
    holder.add(bar); eyes.push(holder);
  }
  return { root, body, head, torso, arms, eyes, helmet, m, eyeStyle: style };
}

/* small builders for props */
/* Feather outline for the First Officer's winged helmet and staff */
function featherShape(L, w, mirror) {
  const s = mirror ? -1 : 1;
  const sh = new THREE.Shape();
  sh.moveTo(0, -w * 0.5 * s);
  sh.bezierCurveTo(L * 0.35, -w * 0.62 * s, L * 0.8, -w * 0.35 * s, L, 0);
  sh.bezierCurveTo(L * 0.82, w * 0.22 * s, L * 0.4, w * 0.5 * s, 0, w * 0.5 * s);
  sh.lineTo(0, -w * 0.5 * s);
  return sh;
}
function featherEdgeShape(L, w, mirror) {
  const s = mirror ? -1 : 1;
  const sh = new THREE.Shape();
  sh.moveTo(0, -w * 0.5 * s);
  sh.bezierCurveTo(L * 0.35, -w * 0.62 * s, L * 0.8, -w * 0.35 * s, L, 0);
  sh.bezierCurveTo(L * 0.78, -w * 0.27 * s, L * 0.35, -w * 0.47 * s, 0.02, -w * 0.38 * s);
  sh.lineTo(0, -w * 0.5 * s);
  return sh;
}

function featherMesh(L, w, mat, edgeMat) {
  const g = new THREE.Group();
  const a = new THREE.ExtrudeGeometry(featherShape(L, w, false), { depth: 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1, curveSegments: 16 });
  a.translate(0, 0, -0.006);
  const e = new THREE.ExtrudeGeometry(featherEdgeShape(L, w, false), { depth: 0.022, bevelEnabled: false, curveSegments: 16 });
  e.translate(0, 0, -0.011);
  g.add(mk(a, mat), new THREE.Mesh(e, edgeMat));
  return g;
}
function screenTexture(hex, kind = 'chart') {
  const c = document.createElement('canvas'); c.width = 256; c.height = 160;
  const g = c.getContext('2d');
  g.fillStyle = '#050a14'; g.fillRect(0, 0, 256, 160);
  g.strokeStyle = hex; g.fillStyle = hex; g.lineWidth = 3;
  if (kind === 'chart') {
    g.globalAlpha = 0.35; for (let y = 20; y < 160; y += 28) g.fillRect(10, y, 236, 1);
    g.globalAlpha = 1; g.beginPath(); for (let x = 0; x <= 256; x += 8) { const y = 90 + Math.sin(x * 0.05) * 30 + Math.sin(x * 0.17) * 12; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    for (let i = 0; i < 6; i++) g.fillRect(18 + i * 38, 140 - i * 9 - 10, 22, i * 9 + 10);
  } else {
    for (let y = 16; y < 150; y += 18) { g.globalAlpha = 0.9; g.fillRect(12, y, 30 + Math.random() * 40, 6); g.globalAlpha = 0.45; g.fillRect(100, y, 50 + Math.random() * 90, 6); }
  }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = THREE.RepeatWrapping;
  return t;
}
function screenMat(hex, kind) { return new THREE.MeshBasicMaterial({ map: screenTexture(hex, kind), color: new THREE.Color(1.8, 1.8, 1.8), side: THREE.DoubleSide }); }

/* Per-character dressing. Each returns { pose, update(t, dt, sel, ch), greet }. */
const DRESS = {
  captain(b, m) {
    // the plain two-tone uniform; gold is the captain's alone
    return { pose: { L: { x: 0.3, z: 0.06, ex: -0.5 }, R: { x: 0.3, z: -0.06, ex: -0.5 } }, greet: 'salute' };
  },

  xo(b, m) {
    // winged helmet: Hermes
    const wingMat = m.plate, edge = glowM(RAIL.local.hex, 2.4);
    const wings = [];
    for (const s of [-1, 1]) {
      const w = new THREE.Group(); w.position.set(0.24 * s, 0.27, -0.03); b.head.add(w);
      [[0.32, 0.09, 0.15], [0.26, 0.08, 0.5], [0.2, 0.07, 0.85]].forEach(([L, wd, a]) => {
        const f = featherMesh(L, wd, wingMat, edge);
        f.rotation.set(0, s > 0 ? -0.35 : Math.PI + 0.35, (0.5 + a * 0.6));
        if (s < 0) f.rotation.z = (0.5 + a * 0.6);
        w.add(f);
      });
      wings.push(w);
    }
    // caduceus
    const staff = new THREE.Group();
    mk(new THREE.CylinderGeometry(0.014, 0.014, 1.15, 10), m.gold, 0, 0.3, 0, staff);
    mk(new THREE.SphereGeometry(0.045, 16, 12), glowM(RAIL.local.hex, 3.5), 0, 0.9, 0, staff);
    for (const s of [-1, 1]) { const f = featherMesh(0.15, 0.05, m.plate, edge); f.position.set(0.02 * s, 0.86, 0); f.rotation.set(0, s > 0 ? 0 : Math.PI, 0.5); staff.add(f); }
    const helix = new THREE.Group(); staff.add(helix);
    for (const k of [0, Math.PI]) {
      const pts = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 5 + k; pts.push(new THREE.Vector3(Math.cos(a) * 0.045, -0.12 + i / 60 * 0.95, Math.sin(a) * 0.045)); }
      helix.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.009, 6), glowM(k ? RAIL.mixed.hex : RAIL.local.hex, 2.4)));
    }
    staff.rotation.set(1.28, 0, 0.32); staff.position.set(0, -0.02, 0.02);
    b.arms.R.hand.add(staff);
    return {
      pose: { L: { x: 0.05, z: 0.1, ex: -0.15 }, R: { x: -0.35, z: -0.34, ex: -0.95 } }, greet: 'nod',
      update(t) { wings.forEach((w, i) => { w.rotation.z = Math.sin(t * 3 + i) * 0.08; }); helix.rotation.y = t * 1.5; },
    };
  },

  ops(b, m) {
    const tips = [];
    for (const s of [-1, 1]) {
      mk(new THREE.CylinderGeometry(0.008, 0.012, 0.24, 6), m.dark, 0.13 * s, 0.5, -0.05, b.head).rotation.z = -0.25 * s;
      const tip = mk(new THREE.SphereGeometry(0.022, 10, 8), glowM(s > 0 ? '#ff5050' : RAIL.local.hex, 4), 0.16 * s, 0.62, -0.05, b.head); tips.push(tip);
    }
    const tab = new THREE.Group();
    mk(new THREE.BoxGeometry(0.26, 0.17, 0.016), m.dark, 0, 0, 0, tab);
    const scr = mk(new THREE.PlaneGeometry(0.235, 0.145), screenMat(RAIL.local.hex, 'chart'), 0, 0, 0.009, tab);
    tab.position.set(0, -0.06, 0.06); tab.rotation.set(-0.4, 0, 0);
    b.arms.L.hand.add(tab);
    const lamp = mk(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12), m.dark, -0.27, 1.04, 0.02, b.body); lamp.rotation.x = Math.PI / 2;
    mk(new THREE.CircleGeometry(0.026, 12), glowM('#ffffff', 3), -0.27, 1.04, 0.062, b.body);
    // tool pouches
    for (const s of [-1, 1]) mk(new THREE.BoxGeometry(0.07, 0.08, 0.05), m.plate2, 0.15 * s, 0.5, 0.12, b.body);
    return {
      pose: { L: { x: -0.55, z: 0.15, ex: -1.0 }, R: { x: 0.08, z: -0.1, ex: -0.2 } }, greet: 'wave',
      update(t) { tips.forEach((tp, i) => { tp.visible = Math.sin(t * 3 + i * 3) > 0; }); scr.material.map.offset.x = (t * 0.05) % 1; },
    };
  },

  qm(b, m) {
    const crate = new THREE.Group(); crate.position.set(0, 0.7, 0.29); b.body.add(crate);
    mk(new THREE.BoxGeometry(0.36, 0.25, 0.26), m.plate2, 0, 0, 0, crate);
    for (const x of [-0.12, 0.12]) mk(new THREE.BoxGeometry(0.03, 0.26, 0.27), m.dark, x, 0, 0, crate);
    mk(new THREE.BoxGeometry(0.12, 0.05, 0.005), glowM(RAIL.local.hex, 2.6), 0, 0.05, 0.132, crate);
    const amber = mk(new THREE.SphereGeometry(0.014, 8, 6), glowM(RAIL.codex.hex, 4), 0.06, -0.05, 0.132, crate);
    // floating ledger
    const ledger = new THREE.Group(); ledger.position.set(0.42, 1.3, 0.05); b.root.add(ledger);
    mk(new THREE.PlaneGeometry(0.3, 0.38), Object.assign(screenMat(RAIL.local.hex, 'rows'), { transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }), 0, 0, 0, ledger).castShadow = false;
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.3, 0.38)), new THREE.LineBasicMaterial({ color: new THREE.Color(RAIL.local.hex).multiplyScalar(2.5) })); ledger.add(frame);
    // cargo vest pockets
    for (const s of [-1, 1]) mk(new THREE.BoxGeometry(0.09, 0.09, 0.04), m.suit2, 0.11 * s, 0.68, 0.17, b.body);
    return {
      pose: { L: { x: -0.85, z: -0.2, ex: -0.75 }, R: { x: -0.85, z: 0.2, ex: -0.75 } }, greet: 'nod',
      update(t) { ledger.position.y = 1.3 + Math.sin(t * 1.4) * 0.04; ledger.rotation.y = -0.4 + Math.sin(t * 0.6) * 0.15; amber.visible = Math.sin(t * 2) > -0.3; },
    };
  },

  chief(b, m) {
    // goggles on the forehead
    const band = mk(new THREE.TorusGeometry(0.252, 0.018, 8, 40), m.dark, 0, 0.33, 0, b.head); band.rotation.x = Math.PI / 2 - 0.25;
    for (const s of [-1, 1]) {
      const gg = mk(new THREE.CylinderGeometry(0.06, 0.065, 0.06, 20), m.dark, 0.085 * s, 0.4, 0.2, b.head); gg.rotation.x = Math.PI / 2 - 0.6;
      const lens = mk(new THREE.CircleGeometry(0.05, 20), glowM(RAIL.codex.hex, 2.4), 0.085 * s, 0.42, 0.226, b.head); lens.rotation.x = -0.6;
    }
    // wrench over the right shoulder
    const wrench = new THREE.Group();
    mk(new THREE.BoxGeometry(0.05, 0.62, 0.028), m.plate2, 0, 0.25, 0, wrench);
    const headR = mk(new THREE.TorusGeometry(0.085, 0.032, 10, 24, Math.PI * 1.45), m.plate2, 0, 0.62, 0, wrench); headR.rotation.z = -Math.PI * 0.22 + Math.PI / 2;
    mk(new THREE.BoxGeometry(0.06, 0.12, 0.03), glowM(RAIL.codex.hex, 1.4), 0, 0.02, 0, wrench);
    wrench.rotation.set(0.2, 0, 0.3); wrench.position.set(0, -0.02, 0.0);
    b.arms.R.hand.add(wrench);
    // backpack with glowing vents
    const pack = mk(new THREE.BoxGeometry(0.32, 0.36, 0.14), m.plate2, 0, 0.8, -0.24, b.body);
    for (const s of [-1, 1]) { const v = mk(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 16), m.dark, 0.09 * s, 1.02, -0.26, b.body); mk(new THREE.CircleGeometry(0.04, 16), glowM(RAIL.codex.hex, 3), 0.09 * s, 1.081, -0.26, b.body).rotation.x = -Math.PI / 2; }
    // welding torch in the left hand + sparks
    const torch = new THREE.Group(); mk(new THREE.CylinderGeometry(0.02, 0.025, 0.18, 10), m.dark, 0, 0, 0, torch);
    const flame = mk(new THREE.SphereGeometry(0.022, 10, 8), glowM('#fff1c0', 6), 0, -0.1, 0, torch);
    torch.rotation.x = 1.6; torch.position.set(0, -0.02, 0.05); b.arms.L.hand.add(torch);
    const N = 50; const sp = new Float32Array(N * 3), sv = new Float32Array(N * 3), sl = new Float32Array(N);
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: new THREE.Color('#ffc46b').multiplyScalar(5), size: 0.025, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    sparks.frustumCulled = false; b.root.add(sparks);
    const wp = new THREE.Vector3(); let acc = 0;
    return {
      pose: { L: { x: -0.7, z: 0.1, ex: -0.7 }, R: { x: -0.15, z: -0.22, ex: -2.35 } }, greet: 'nod',
      update(t, dt) {
        const on = Math.sin(t * 1.3) > 0.2; flame.visible = on;
        acc += dt * (on ? 60 : 0);
        flame.getWorldPosition(wp); b.root.worldToLocal(wp);
        for (let i = 0; i < N; i++) {
          if (sl[i] <= 0 && acc >= 1) { acc -= 1; sl[i] = rand(0.3, 0.7); sp.set([wp.x, wp.y, wp.z], i * 3); sv.set([rand(-0.8, 0.8), rand(0.2, 1.2), rand(0.1, 1.0)], i * 3); }
          if (sl[i] > 0) { sl[i] -= dt; sv[i * 3 + 1] -= 4 * dt; for (let k = 0; k < 3; k++) sp[i * 3 + k] += sv[i * 3 + k] * dt; } else sp[i * 3 + 1] = -99;
        }
        sg.attributes.position.needsUpdate = true;
      },
    };
  },

  science(b, m) {
    const prof = [[0.2, 0.62], [0.22, 0.5], [0.255, 0.32], [0.28, 0.2]].map(([r, y]) => new THREE.Vector2(r, y));
    mk(new THREE.LatheGeometry(prof, 36, 0.38, Math.PI * 2 - 0.76), m.coat, 0, 0, 0, b.body).scale.z = 0.85;
    for (const s of [-1, 1]) { const lap = mk(new THREE.BoxGeometry(0.05, 0.3, 0.02), m.coat, 0.07 * s, 0.82, 0.19, b.body); lap.rotation.z = 0.25 * s; }
    // flask
    const flask = new THREE.Group();
    const fp = [[0.0, 0], [0.07, 0.005], [0.085, 0.04], [0.06, 0.1], [0.025, 0.14], [0.025, 0.2]].map(([r, y]) => new THREE.Vector2(r, y));
    mk(new THREE.LatheGeometry(fp, 24), m.glass, 0, 0, 0, flask).castShadow = false;
    const liq = mk(new THREE.LatheGeometry(fp.slice(0, 4).map((v) => new THREE.Vector2(v.x * 0.9, v.y * 0.95)), 24), glowM(RAIL.mixed.hex, 2.2), 0, 0.004, 0, flask);
    const bubbles = []; for (let i = 0; i < 5; i++) { const bb = mk(geo('bub', () => new THREE.SphereGeometry(0.008, 6, 4)), glowM('#ffffff', 3), rand(-0.03, 0.03), 0, rand(-0.03, 0.03), flask); bb.userData.ph = Math.random(); bubbles.push(bb); }
    flask.position.set(0, -0.06, 0.03); flask.rotation.x = 1.1;
    b.arms.R.hand.add(flask);
    // hologram bar chart over the left palm
    const chart = new THREE.Group(); chart.position.set(0.36, 0.98, 0.32); b.root.add(chart);
    const bars = []; for (let i = 0; i < 5; i++) { const bar = mk(geo('hbar', () => { const g = new THREE.BoxGeometry(0.035, 1, 0.035); g.translate(0, 0.5, 0); return g; }), glowM(RAIL.mixed.hex, 1.6 + i * 0.2), (i - 2) * 0.05, 0, 0, chart); bar.castShadow = false; bars.push(bar); }
    const base = mk(new THREE.CylinderGeometry(0.15, 0.15, 0.005, 32), m.glowSoft, 0, -0.01, 0, chart); base.castShadow = false;
    return {
      pose: { L: { x: -0.55, z: 0.35, ex: -0.9 }, R: { x: -0.3, z: -0.1, ex: -1.0 } }, greet: 'nod',
      update(t) {
        bars.forEach((bar, i) => { bar.scale.y = 0.05 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.8 + i * 1.1)); });
        chart.rotation.y = Math.sin(t * 0.5) * 0.3;
        bubbles.forEach((bb) => { const p = (t * 0.4 + bb.userData.ph) % 1; bb.position.y = 0.01 + p * 0.07; bb.scale.setScalar(1 - p); });
      },
    };
  },

  sensors(b, m) {
    const mast = mk(new THREE.CylinderGeometry(0.012, 0.016, 0.12, 8), m.dark, 0, 0.5, -0.02, b.head);
    const dishG = new THREE.Group(); dishG.position.set(0, 0.57, -0.02); b.head.add(dishG);
    const dp = []; for (let i = 0; i <= 10; i++) { const r = i / 10 * 0.15; dp.push(new THREE.Vector2(r, r * r * 2.4)); }
    const dish = mk(new THREE.LatheGeometry(dp, 32), m.plate, 0, 0, 0, dishG); dish.rotation.x = -0.9;
    const feed = mk(new THREE.SphereGeometry(0.018, 10, 8), glowM(RAIL.claude.hex, 4), 0, 0.07, 0.06, dishG);
    const beam = mk(new THREE.ConeGeometry(0.16, 0.5, 24, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL.claude.hex).multiplyScalar(0.6), transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, 0.28, 0.2, dishG);
    beam.rotation.x = -0.9 + Math.PI; beam.castShadow = false;
    // scanner device in the left hand
    const dev = new THREE.Group(); mk(new THREE.BoxGeometry(0.1, 0.16, 0.04), m.dark, 0, 0, 0, dev); mk(new THREE.PlaneGeometry(0.08, 0.09), screenMat(RAIL.claude.hex, 'chart'), 0, 0.02, 0.021, dev);
    dev.position.set(0, -0.05, 0.05); dev.rotation.x = 0.9; b.arms.L.hand.add(dev);
    return {
      pose: { L: { x: -0.7, z: 0.15, ex: -0.75 }, R: { x: 0.05, z: -0.12, ex: -0.25 } }, greet: 'wave',
      update(t) { dishG.rotation.y = Math.sin(t * 0.9) * 1.1; beam.material.opacity = 0.12 + 0.1 * (0.5 + 0.5 * Math.sin(t * 6)); feed.scale.setScalar(1 + 0.3 * Math.sin(t * 6)); },
    };
  },

  away(b, m) {
    mk(new THREE.BoxGeometry(0.34, 0.42, 0.18), m.plate2, 0, 0.8, -0.26, b.body);
    mk(new THREE.BoxGeometry(0.3, 0.1, 0.16), m.suit2, 0, 0.55, -0.26, b.body);
    const ant = mk(new THREE.CylinderGeometry(0.006, 0.01, 0.5, 6), m.dark, 0.12, 1.22, -0.28, b.body); ant.rotation.z = -0.15;
    const antTip = mk(new THREE.SphereGeometry(0.02, 8, 6), glowM(RAIL.mixed.hex, 4), 0.157, 1.47, -0.28, b.body);
    const lamp = mk(new THREE.CylinderGeometry(0.035, 0.03, 0.08, 14), m.dark, -0.24, 0.32, 0.1, b.head); lamp.rotation.x = Math.PI / 2;
    mk(new THREE.CircleGeometry(0.03, 14), glowM('#ffffff', 5), -0.24, 0.32, 0.141, b.head);
    for (const s of [-1, 1]) mk(new THREE.BoxGeometry(0.07, 0.07, 0.06), m.dark, 0.16 * s, 0.53, 0.12, b.body);
    // transporter shimmer
    const N = 160, P = new Float32Array(N * 3), ph = [];
    for (let i = 0; i < N; i++) { const a = Math.random() * Math.PI * 2, r = rand(0.3, 0.45); P.set([Math.cos(a) * r, rand(0, 1.7), Math.sin(a) * r], i * 3); ph.push(Math.random()); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3));
    const pm = new THREE.PointsMaterial({ color: new THREE.Color(RAIL.mixed.hex).multiplyScalar(4), size: 0.02, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const shimmer = new THREE.Points(g, pm); b.root.add(shimmer);
    return {
      pose: { L: { x: 0.05, z: 0.12, ex: -0.3 }, R: { x: 0.05, z: -0.12, ex: -0.3 } }, greet: 'wave',
      update(t) {
        const c = (t * 0.18) % 1; const k = c < 0.18 ? Math.sin(c / 0.18 * Math.PI) : 0;
        pm.opacity = k; shimmer.rotation.y = t * 0.8;
        for (let i = 0; i < N; i++) { P[i * 3 + 1] = (ph[i] * 1.7 + t * 0.6) % 1.7; }
        g.attributes.position.needsUpdate = true;
        antTip.visible = Math.sin(t * 4) > 0;
      },
    };
  },

  security(b, m) {
    // crest ridge
    mk(new THREE.BoxGeometry(0.04, 0.06, 0.4), m.plate2, 0, 0.45, 0, b.head);
    // hex shield on the left forearm
    const sh = new THREE.Group(); sh.position.set(0.06, -0.1, 0.06); sh.rotation.set(0, Math.PI / 2 - 0.3, Math.PI / 2); b.arms.L.elbow.add(sh);
    const hexG = new THREE.CylinderGeometry(0.27, 0.27, 0.02, 6);
    const face = mk(hexG, new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL.mixed.hex).multiplyScalar(0.9), transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, 0, 0, sh); face.castShadow = false;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(hexG), new THREE.LineBasicMaterial({ color: new THREE.Color(RAIL.mixed.hex).multiplyScalar(3) })); sh.add(edges);
    const inner = mk(new THREE.CylinderGeometry(0.12, 0.12, 0.025, 6), glowM(RAIL.mixed.hex, 1.6), 0, 0, 0, sh); inner.castShadow = false;
    // scanner ring
    const ring = mk(new THREE.TorusGeometry(0.46, 0.012, 8, 64), glowM(RAIL.mixed.hex, 3), 0, 0.5, 0, b.root); ring.rotation.x = Math.PI / 2; ring.castShadow = false;
    const ringFill = mk(new THREE.CylinderGeometry(0.46, 0.46, 0.06, 64, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL.mixed.hex).multiplyScalar(0.8), transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, 0, 0, ring); ringFill.rotation.x = Math.PI / 2; ringFill.castShadow = false;
    return {
      pose: { L: { x: -0.65, z: 0.25, ex: -1.2 }, R: { x: 0.08, z: -0.15, ex: -0.2 } }, greet: 'nod',
      update(t) { ring.position.y = 0.85 + Math.sin(t * 1.4) * 0.75; face.material.opacity = 0.22 + 0.12 * Math.sin(t * 3); },
    };
  },

  helm(b, m) {
    const wheel = new THREE.Group(); wheel.position.set(0, 0.74, 0.36); b.body.add(wheel);
    mk(new THREE.TorusGeometry(0.17, 0.016, 8, 40), m.gold, 0, 0, 0, wheel);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const sp = mk(geo('spoke', () => new THREE.CylinderGeometry(0.008, 0.008, 0.25, 6)), m.plate2, Math.cos(a) * 0.125, Math.sin(a) * 0.125, 0, wheel); sp.rotation.z = a - Math.PI / 2;
      mk(geo('knob', () => new THREE.SphereGeometry(0.018, 8, 6)), m.gold, Math.cos(a) * 0.235, Math.sin(a) * 0.235, 0, wheel);
    }
    mk(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16), glowM(RAIL.local.hex, 2.6), 0, 0, 0, wheel).rotation.x = Math.PI / 2;
    // course chevrons ahead
    const course = new THREE.Group(); course.position.set(0, 1.75, 0.2); b.root.add(course);
    const chev = []; for (let i = 0; i < 4; i++) { const s = new THREE.Shape(); s.moveTo(-0.08, 0); s.lineTo(0, 0.06); s.lineTo(0.08, 0); s.lineTo(0.08, -0.025); s.lineTo(0, 0.035); s.lineTo(-0.08, -0.025); const c = mk(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL.local.hex).multiplyScalar(2.6), transparent: true, side: THREE.DoubleSide, depthWrite: false }), 0, 0, 0, course); c.castShadow = false; chev.push(c); }
    return {
      pose: { L: { x: -0.95, z: -0.12, ex: -0.45 }, R: { x: -0.95, z: 0.12, ex: -0.45 } }, greet: 'nod',
      update(t) {
        wheel.rotation.z = Math.sin(t * 0.8) * 0.6;
        chev.forEach((c, i) => { const p = (t * 0.4 + i / 4) % 1; c.position.set(Math.sin(p * 3) * 0.1, p * 0.35, 0); c.material.opacity = Math.sin(p * Math.PI); });
      },
    };
  },

  carto(b, m) {
    // beret
    const beret = mk(new THREE.SphereGeometry(0.2, 24, 12), m.accent, 0.04, 0.42, -0.02, b.head); beret.scale.set(1.2, 0.35, 1.15); beret.rotation.z = -0.25;
    mk(new THREE.SphereGeometry(0.02, 8, 6), m.accent, 0.02, 0.49, 0, b.head);
    // star map globe over the right palm
    const globe = new THREE.Group(); globe.position.set(-0.36, 1.12, 0.3); b.root.add(globe);
    const pts = []; for (let i = 0; i < 70; i++) { const v = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(0.16); pts.push(v); }
    const pg = new THREE.BufferGeometry().setFromPoints(pts);
    globe.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: new THREE.Color(RAIL.claude.hex).multiplyScalar(4), size: 0.018, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
    const lines = []; for (let i = 0; i < 14; i++) { lines.push(pts[i], pts[(i * 7 + 3) % 30]); }
    globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines), new THREE.LineBasicMaterial({ color: new THREE.Color(RAIL.claude.hex).multiplyScalar(1.6), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })));
    const eq = mk(new THREE.TorusGeometry(0.19, 0.004, 4, 64), glowM(RAIL.claude.hex, 2), 0, 0, 0, globe); eq.rotation.x = Math.PI / 2 + 0.3; eq.castShadow = false;
    const mer = mk(new THREE.TorusGeometry(0.19, 0.003, 4, 64), glowM(RAIL.claude.hex, 1.4), 0, 0, 0, globe); mer.castShadow = false;
    // stylus
    const sty = new THREE.Group(); mk(new THREE.CylinderGeometry(0.01, 0.006, 0.2, 8), m.plate, 0, 0, 0, sty); mk(new THREE.SphereGeometry(0.012, 8, 6), glowM(RAIL.claude.hex, 4), 0, -0.1, 0, sty);
    sty.rotation.x = 1.3; sty.position.set(0, -0.03, 0.04); b.arms.L.hand.add(sty);
    return {
      pose: { L: { x: -0.5, z: 0.2, ex: -1.1 }, R: { x: -0.65, z: -0.35, ex: -0.85 } }, greet: 'nod',
      update(t) { globe.rotation.y = t * 0.5; globe.position.y = 1.12 + Math.sin(t * 1.2) * 0.02; },
    };
  },

  archivist(b, m) {
    for (const s of [-1, 1]) { const r = mk(new THREE.TorusGeometry(0.055, 0.008, 6, 24), m.gold, 0.088 * s, 0.235, 0.255, b.head); }
    mk(new THREE.CylinderGeometry(0.005, 0.005, 0.06, 4), m.gold, 0, 0.24, 0.27, b.head).rotation.z = Math.PI / 2;
    // open book in hands
    const book = new THREE.Group(); book.position.set(0, 0.72, 0.3); book.rotation.x = -0.6; b.body.add(book);
    for (const s of [-1, 1]) { const p = mk(new THREE.BoxGeometry(0.15, 0.2, 0.012), m.coat, 0.075 * s, 0, 0, book); p.rotation.y = -0.25 * s; p.position.z = 0.02; }
    mk(new THREE.BoxGeometry(0.31, 0.21, 0.01), m.accent, 0, 0, -0.005, book);
    mk(new THREE.PlaneGeometry(0.2, 0.12), glowM(RAIL.local.hex, 0.9), 0, 0, 0.035, book).castShadow = false;
    // orbiting books
    const orbit = new THREE.Group(); orbit.position.y = 1.15; orbit.rotation.z = 0.25; b.root.add(orbit);
    const cols = ['#8fa8e0', '#3fc1a5', '#f0a948', '#e889b6', '#d8dcea', '#7fd2ff'];
    cols.forEach((c, i) => {
      const bk = mk(new THREE.BoxGeometry(0.05, 0.16, 0.12), new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: 0.6, emissive: new THREE.Color(c), emissiveIntensity: 0.25 }), 0, 0, 0, orbit);
      bk.userData.a = i / cols.length * Math.PI * 2;
    });
    return {
      pose: { L: { x: -0.7, z: -0.15, ex: -0.85 }, R: { x: -0.7, z: 0.15, ex: -0.85 } }, greet: 'nod',
      update(t) { orbit.children.forEach((bk) => { const a = bk.userData.a + t * 0.5; bk.position.set(Math.cos(a) * 0.55, Math.sin(a * 2) * 0.05, Math.sin(a) * 0.55); bk.rotation.y = -a; }); },
    };
  },

  nav(b, m) {
    const scarf = mk(new THREE.TorusGeometry(0.13, 0.04, 8, 24), m.accent, 0, 1.0, 0.01, b.body); scarf.rotation.x = Math.PI / 2;
    const tail = mk(new THREE.BoxGeometry(0.06, 0.2, 0.02), m.accent, 0.05, 0.9, 0.18, b.body); tail.rotation.z = 0.2;
    const astro = new THREE.Group(); astro.position.set(0.36, 1.05, 0.3); b.root.add(astro);
    const rings = [0.15, 0.12, 0.09].map((r, i) => { const g = mk(new THREE.TorusGeometry(r, 0.008, 6, 48), i === 1 ? glowM(RAIL.local.hex, 2.4) : m.gold, 0, 0, 0, astro); g.castShadow = false; return g; });
    mk(new THREE.SphereGeometry(0.035, 16, 10), glowM(RAIL.local.hex, 3.5), 0, 0, 0, astro);
    const needle = mk(new THREE.ConeGeometry(0.012, 0.22, 8), glowM('#ffffff', 2), 0, 0, 0, astro); needle.rotation.z = Math.PI / 2;
    return {
      pose: { L: { x: -0.55, z: 0.35, ex: -0.9 }, R: { x: 0.05, z: -0.1, ex: -0.3 } }, greet: 'wave',
      update(t) { rings[0].rotation.x = t * 0.7; rings[1].rotation.y = t * 1.1; rings[2].rotation.x = -t * 1.4; rings[2].rotation.z = t; needle.rotation.y = Math.sin(t * 0.7) * 1.2; astro.position.y = 1.05 + Math.sin(t * 1.3) * 0.02; },
    };
  },

  holo(b, m) {
    // hard hat with a brim
    const hat = mk(new THREE.SphereGeometry(0.265, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.1), m.accent, 0, 0.24, 0, b.head);
    const brim = mk(new THREE.CylinderGeometry(0.3, 0.3, 0.015, 32), m.accent, 0, 0.25, 0.03, b.head); brim.scale.z = 1.1;
    mk(new THREE.BoxGeometry(0.03, 0.04, 0.5), m.plate, 0, 0.5, 0, b.head);
    // brick builder: a wire cube that fills with glowing bricks
    const cube = new THREE.Group(); cube.position.set(-0.38, 1.1, 0.3); b.root.add(cube);
    const S = 0.27;
    cube.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(S, S, S)), new THREE.LineBasicMaterial({ color: new THREE.Color(RAIL.claude.hex).multiplyScalar(2.4) })));
    const bricks = [];
    const bg = new THREE.BoxGeometry(S / 3 * 0.86, S / 3 * 0.86, S / 3 * 0.86);
    for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) for (let x = 0; x < 3; x++) {
      const br = mk(bg, glowM(RAIL.claude.hex, 0.9 + ((x + y + z) % 3) * 0.35), (x - 1) * S / 3, (y - 1) * S / 3, (z - 1) * S / 3, cube); br.castShadow = false; bricks.push(br);
    }
    // tool belt
    for (let i = -2; i <= 2; i++) mk(new THREE.BoxGeometry(0.045, 0.07, 0.04), i % 2 ? m.plate2 : m.dark, i * 0.065, 0.5, 0.155, b.body);
    return {
      pose: { L: { x: 0.05, z: 0.12, ex: -0.3 }, R: { x: -0.6, z: -0.3, ex: -0.9 } }, greet: 'wave',
      update(t) {
        cube.rotation.y = t * 0.4; cube.rotation.x = 0.35;
        const n = Math.floor(((t * 4) % 36)); bricks.forEach((br, i) => { const vis = i < n && n < 31; br.scale.setScalar(vis ? (i === n - 1 ? 0.6 + 0.4 * ((t * 4) % 1) : 1) : 0.001); });
      },
    };
  },

  comms(b, m) {
    const band = mk(new THREE.TorusGeometry(0.26, 0.015, 6, 32, Math.PI), m.dark, 0, 0.21, 0, b.head); band.rotation.y = Math.PI / 2;
    const boom = mk(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 6), m.dark, -0.24, 0.12, 0.12, b.head); boom.rotation.x = Math.PI / 2 - 0.3;
    mk(new THREE.SphereGeometry(0.02, 8, 6), m.glow, -0.24, 0.09, 0.22, b.head);
    const env = new THREE.Group(); env.position.set(0.38, 1.25, 0.2); b.root.add(env);
    mk(new THREE.BoxGeometry(0.24, 0.16, 0.01), m.plate, 0, 0, 0, env);
    const flap = mk(new THREE.ConeGeometry(0.17, 0.08, 4), m.plate, 0, 0.04, 0.01, env); flap.rotation.set(0, Math.PI / 4, Math.PI); flap.scale.z = 0.05;
    return { pose: { L: { x: -0.4, z: 0.2, ex: -0.8 }, R: { x: 0.05, z: -0.1, ex: -0.2 } }, greet: 'nod', update(t) { env.rotation.y = Math.sin(t) * 0.4; env.position.y = 1.25 + Math.sin(t * 1.3) * 0.03; } };
  },
  doctor(b, m) {
    const cross = new THREE.Group(); cross.position.set(0, 0.84, 0.2); b.body.add(cross);
    mk(new THREE.BoxGeometry(0.12, 0.04, 0.01), m.glow, 0, 0, 0, cross); mk(new THREE.BoxGeometry(0.04, 0.12, 0.01), m.glow, 0, 0, 0, cross);
    const heart = new THREE.Group(); heart.position.set(-0.38, 1.2, 0.25); b.root.add(heart);
    const pts = []; for (let i = 0; i <= 40; i++) { const x = i / 40 * 0.4 - 0.2; const y = (i > 16 && i < 24) ? Math.sin((i - 16) / 8 * Math.PI * 2) * 0.08 : 0; pts.push(new THREE.Vector3(x, y, 0)); }
    heart.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: m.c.clone().multiplyScalar(3) })));
    return { pose: { L: { x: 0.05, z: 0.1, ex: -0.2 }, R: { x: -0.4, z: -0.25, ex: -0.9 } }, greet: 'nod', update(t) { heart.scale.y = 1 + 0.3 * Math.sin(t * 6); } };
  },
  life(b, m) {
    const leaf = new THREE.Group(); leaf.position.set(0.38, 1.1, 0.25); b.root.add(leaf);
    for (let i = 0; i < 5; i++) { const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(0.06, 0.08, 0, 0.18); s.quadraticCurveTo(-0.06, 0.08, 0, 0); const l = mk(new THREE.ShapeGeometry(s), m.glow, 0, 0, 0, leaf); l.rotation.z = (i - 2) * 0.5; }
    const bulb = mk(new THREE.SphereGeometry(0.06, 16, 12), m.glow, -0.36, 1.25, 0.25, b.root);
    return { pose: { L: { x: -0.4, z: 0.3, ex: -0.8 }, R: { x: -0.4, z: -0.3, ex: -0.8 } }, greet: 'nod', update(t) { leaf.rotation.y = t * 0.6; bulb.scale.setScalar(1 + 0.15 * Math.sin(t * 2)); } };
  },
};

function makeComputer() {
  const m = crewMats('local');
  const root = new THREE.Group();
  const core = new THREE.Group(); core.position.y = 1.05; root.add(core);
  mk(new THREE.SphereGeometry(0.16, 32, 20), glowM(RAIL.local.hex, 3.4), 0, 0, 0, core).castShadow = false;
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), new THREE.MeshStandardMaterial({ color: 0x9fe8dd, transparent: true, opacity: 0.18, roughness: 0.1, metalness: 0.4, depthWrite: false }));
  core.add(shell);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.345, 1)), new THREE.LineBasicMaterial({ color: new THREE.Color(RAIL.local.hex).multiplyScalar(2.2), transparent: true, opacity: 0.9 }));
  core.add(wire);
  const rings = [0.52, 0.6, 0.68].map((r, i) => { const g = mk(new THREE.TorusGeometry(r, 0.011, 6, 80), i === 1 ? glowM(RAIL.local.hex, 2.6) : m.plate2, 0, 0, 0, core); g.rotation.x = Math.PI / 2 + (i - 1) * 0.5; g.rotation.y = i * 0.6; return g; });
  const shards = []; for (let i = 0; i < 12; i++) { const s = mk(geo('shard', () => new THREE.OctahedronGeometry(0.035, 0)), i % 3 ? glowM(RAIL.local.hex, 2) : m.plate, 0, 0, 0, core); s.userData = { a: Math.random() * 6.28, r: rand(0.4, 0.8), y: rand(-0.4, 0.4), sp: rand(0.4, 1.0) }; shards.push(s); }
  const beam = mk(new THREE.CylinderGeometry(0.06, 0.25, 0.7, 24, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL.local.hex).multiplyScalar(0.6), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, 0.42, 0, root); beam.castShadow = false;
  // an eye ring so it can look at you
  const eye = mk(new THREE.TorusGeometry(0.07, 0.012, 8, 32), glowM('#ffffff', 3), 0, 0, 0.17, core); eye.castShadow = false;
  const head = new THREE.Group(); // stand-in for head turns
  return {
    root, body: core, head, arms: null, eyes: [eye], eyeStyle: 'ring', torso: null,
    dress: {
      pose: null, greet: 'spin',
      update(t, dt, sel) {
        const sp = sel ? 1.6 : 1;
        core.position.y = 1.05 + Math.sin(t * 1.2) * 0.05;
        rings.forEach((r, i) => { r.rotation.z += dt * (0.4 + i * 0.25) * sp * (i % 2 ? -1 : 1); });
        wire.rotation.y = shell.rotation.y = t * 0.3; wire.rotation.x = shell.rotation.x = t * 0.17;
        shards.forEach((s) => { const u = s.userData; const a = u.a + t * u.sp * sp; s.position.set(Math.cos(a) * u.r, u.y + Math.sin(a * 2) * 0.05, Math.sin(a) * u.r); s.rotation.y = a * 2; });
      },
    },
  };
}

/* Pedestal with a status ring: solid = live, dashed = proposed, dotted = future */
function makePedestal(rail, status) {
  const g = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x0f1428, roughness: 0.4, metalness: 0.7 });
  const top = new THREE.MeshStandardMaterial({ color: 0x1a2240, roughness: 0.25, metalness: 0.6 });
  const base = new THREE.Mesh(geo('ped', () => new THREE.CylinderGeometry(0.56, 0.64, 0.14, 48)), dark); base.position.y = 0.07; base.receiveShadow = true; g.add(base);
  const cap = new THREE.Mesh(geo('pedTop', () => new THREE.CylinderGeometry(0.52, 0.56, 0.02, 48)), top); cap.position.y = 0.15; cap.receiveShadow = true; g.add(cap);
  const col = new THREE.Color(RAIL[rail].hex).multiplyScalar(2.6);
  const mat = new THREE.MeshBasicMaterial({ color: col });
  const ring = new THREE.Group(); ring.position.y = 0.165; g.add(ring);
  if (status === 'live') { const t = new THREE.Mesh(geo('pr1', () => new THREE.TorusGeometry(0.54, 0.012, 6, 96)), mat); t.rotation.x = Math.PI / 2; ring.add(t); }
  else if (status === 'proposed') { for (let i = 0; i < 16; i++) { const t = new THREE.Mesh(geo('pr2', () => new THREE.TorusGeometry(0.54, 0.012, 6, 8, (Math.PI * 2 / 16) * 0.58)), mat); t.rotation.set(Math.PI / 2, 0, i / 16 * Math.PI * 2); ring.add(t); } }
  else { for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; const d = new THREE.Mesh(geo('pr3', () => new THREE.SphereGeometry(0.014, 6, 4)), mat); d.position.set(Math.cos(a) * 0.54, 0, Math.sin(a) * 0.54); ring.add(d); } }
  // soft rail-coloured pool of light on the cap
  const pool = new THREE.Mesh(geo('pool', () => new THREE.CircleGeometry(0.5, 48)), new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL[rail].hex).multiplyScalar(0.35), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, map: glowSprite.tex || (glowSprite.tex = glowTexture()) }));
  pool.rotation.x = -Math.PI / 2; pool.position.y = 0.162; g.add(pool);
  g.userData.ring = ring;
  return g;
}

function holoize(root, color) {
  const mat = holoMaterial(color);
  root.traverse((o) => {
    if (o.isMesh) { o.material = mat; o.castShadow = false; }
    else if (o.isLineSegments || o.isLine) { o.material = new THREE.LineBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.5), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }); }
  });
  return mat;
}

/* The Captain is human: a face and hair in place of the helmet and visor */
function makeHumanHead(b) {
  const head = b.head;
  head.children.slice().forEach((c) => head.remove(c));
  b.eyes.length = 0;
  const std = (color, roughness = 0.6) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
  const skin = std(0xc6906c, 0.62), hair = std(0x2e2420, 0.72), dark = std(0x17110f, 0.35), white = std(0xf3efe9, 0.4), lip = std(0x8a4a3e, 0.6);
  const face = mk(new THREE.SphereGeometry(0.2, 40, 30), skin, 0, 0.2, 0, head); face.scale.set(0.95, 1.08, 0.98);
  mk(new THREE.SphereGeometry(0.03, 14, 10), skin, 0, 0.178, 0.19, head).scale.set(0.85, 1.1, 1);
  for (const s of [-1, 1]) {
    mk(new THREE.SphereGeometry(0.045, 16, 12), skin, 0.186 * s, 0.19, -0.01, head).scale.set(0.45, 1, 0.75);
    const ew = mk(new THREE.SphereGeometry(0.03, 16, 12), white, 0.068 * s, 0.226, 0.17, head); ew.scale.set(1.1, 0.8, 0.5); ew.userData.sy = 0.8;
    const pu = mk(new THREE.SphereGeometry(0.019, 14, 10), dark, 0.068 * s, 0.226, 0.183, head); pu.scale.set(1, 1.15, 0.5); pu.userData.sy = 1.15;
    const brow = mk(new THREE.BoxGeometry(0.06, 0.01, 0.014), hair, 0.07 * s, 0.281, 0.172, head); brow.rotation.set(-0.3, 0, -0.1 * s);
    b.eyes.push(ew, pu);
  }
  const mouth = mk(new THREE.TorusGeometry(0.034, 0.007, 6, 16, Math.PI * 0.8), lip, 0, 0.11, 0.18, head); mouth.rotation.z = Math.PI * 1.1;
  // short hair: a cap tilted back to show the forehead, and a side-swept fringe
  const cap = mk(new THREE.SphereGeometry(0.213, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), hair, 0, 0.215, -0.012, head); cap.scale.set(0.99, 1.1, 1.03); cap.rotation.x = -0.6;
  const fringe = mk(new THREE.SphereGeometry(0.11, 24, 12), hair, 0.05, 0.345, 0.12, head); fringe.scale.set(1.25, 0.5, 0.8); fringe.rotation.set(0.5, 0, -0.25);
  // soft shading on the face: no self-shadowing between the overlapping head shapes
  head.traverse((o) => { if (o.isMesh) { o.receiveShadow = false; o.castShadow = o === cap; } });
  // skin-toned neck and hands
  b.body.children.forEach((c) => { if (c.geometry === GEO.neck) c.material = skin; });
  for (const side of ['L', 'R']) b.arms[side].elbow.children.forEach((c) => { if (c.geometry === GEO.hand) c.material = skin; });
  b.eyeStyle = 'human';
  b.helmet = face;
}

function buildCharacter(spec) {
  let ch;
  if (spec.id === 'computer') {
    ch = makeComputer();
  } else {
    const m = crewMats(spec.rail);
    const opts = {};
    if (spec.id === 'captain') { opts.helmMat = m.plate; opts.eyeMat = glowM(RAIL.gold.hex, 3.4); opts.pips = 4; }
    if (spec.id === 'xo') opts.pips = 3;
    if (spec.id === 'security') { opts.padScale = 1.45; opts.eyes = 'bar'; }
    if (spec.id === 'ops' || spec.id === 'sensors') opts.eyes = 'bar';
    if (spec.id === 'science') opts.coat = true;
    if (spec.id === 'xo') opts.emblemMat = glowM(RAIL.local.hex, 2.2);
    ch = makeBody(m, opts);
    ch.dress = (DRESS[spec.id] || (() => ({})))(ch, m) || {};
    if (spec.id === 'security') ch.root.scale.setScalar(1.08);
    if (spec.id === 'captain') { ch.root.scale.setScalar(1.04); makeHumanHead(ch); }
  }
  ch.spec = spec;
  ch.phase = Math.random() * 10;
  ch.nextBlink = 1 + Math.random() * 3;
  ch.greetT = 0;
  if (spec.status === 'future') ch.holo = holoize(ch.root, RAIL[spec.rail].hex);
  return ch;
}

function poseCharacter(ch, t, dt, sel) {
  const d = ch.dress || {};
  const ph = ch.phase;
  d.update && d.update(t, dt, sel, ch);
  if (ch.holo) ch.holo.uniforms.uTime.value = t;
  // blink
  ch.nextBlink -= dt;
  let blink = 1;
  if (ch.nextBlink < 0) { blink = 0.12; if (ch.nextBlink < -0.12) ch.nextBlink = 2 + Math.random() * 4; }
  ch.eyes.forEach((e) => { if (ch.eyeStyle === 'human') e.scale.y = e.userData.sy * blink; else if (ch.eyeStyle === 'dots' || ch.eyeStyle === 'goggles') e.scale.y = 1.4 * blink; else if (ch.eyeStyle === 'bar') e.scale.y = blink; else e.scale.setScalar(blink < 1 ? 0.6 : 1); });
  if (!ch.arms) return;
  // greet
  if (ch.greetT > 0) ch.greetT -= dt;
  const g = ch.greetT > 0 ? Math.sin(Math.min(1, (2.4 - ch.greetT) / 0.4) * Math.PI / 2) * Math.min(1, ch.greetT / 0.4) : 0;
  const breathe = Math.sin(t * 1.7 + ph);
  ch.body.position.y = breathe * 0.006;
  if (ch.torso) ch.torso.scale.y = 1 + breathe * 0.008;
  const look = sel ? 0.25 : 0.55;
  ch.head.rotation.y = Math.sin(t * 0.37 + ph) * 0.28 * look + Math.sin(t * 1.1 + ph * 2) * 0.03;
  ch.head.rotation.x = Math.sin(t * 0.5 + ph) * 0.05 - 0.04;
  ch.head.rotation.z = Math.sin(t * 0.29 + ph) * 0.04;
  const P = d.pose || { L: { x: 0.05, z: 0.1, ex: -0.2 }, R: { x: 0.05, z: -0.1, ex: -0.2 } };
  for (const side of ['L', 'R']) {
    const a = ch.arms[side], p = P[side];
    a.sh.rotation.x = p.x + Math.sin(t * 1.1 + ph + (side === 'L' ? 0 : 1.5)) * 0.03;
    a.sh.rotation.z = p.z + a.s * (0.02 + breathe * 0.01);
    a.elbow.rotation.x = p.ex;
    a.elbow.rotation.z = 0;
  }
  if (g > 0) {
    if (d.greet === 'wave') {
      const R = ch.arms.R;
      R.sh.rotation.z = lerp(R.sh.rotation.z, -2.5, g); R.sh.rotation.x = lerp(R.sh.rotation.x, 0, g);
      R.elbow.rotation.x = lerp(R.elbow.rotation.x, 0, g); R.elbow.rotation.z = -Math.sin(t * 11) * 0.45 * g - 0.3 * g;
      ch.head.rotation.z += 0.12 * g;
    } else if (d.greet === 'salute') {
      const R = ch.arms.R;
      R.sh.rotation.x = lerp(R.sh.rotation.x, -1.2, g); R.sh.rotation.z = lerp(R.sh.rotation.z, -1.0, g); R.elbow.rotation.x = lerp(R.elbow.rotation.x, -2.0, g);
      R.elbow.rotation.z = lerp(0, 0.9, g);
    } else {
      ch.head.rotation.x += Math.sin(Math.min(1, (2.4 - ch.greetT) / 1.2) * Math.PI * 2) * 0.22 * g;
    }
    ch.head.rotation.y *= 1 - g;
  }
  if (ch.typing && !(g > 0)) {
    for (const side of ['L', 'R']) { const a = ch.arms[side]; a.elbow.rotation.x += Math.sin(t * 12 + (side === 'L' ? 0 : 1.9) + ph) * 0.07; }
    ch.head.rotation.x += 0.12;
  }
}

function makeCrewFloor() {
  const g = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 96), new THREE.MeshStandardMaterial({ color: 0x0a0f22, roughness: 0.35, metalness: 0.6 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);
  const grid = new THREE.Mesh(new THREE.CircleGeometry(30, 96), new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCol: { value: new THREE.Color(RAIL.mixed.hex) } },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uTime; uniform vec3 uCol; varying vec2 vP;
      float line(float v, float w){ float d = abs(fract(v) - 0.5); return smoothstep(w, 0.0, 0.5 - d); }
      void main(){ float r = length(vP); float a = atan(vP.y, vP.x);
        float rings = line(r * 1.0, 0.035) * 0.6 + line(r * 0.25, 0.02) * 0.6;
        float spokes = line(a / 6.2831853 * 36.0, 0.04) * smoothstep(2.0, 4.0, r) * 0.35;
        float sweep = pow(max(0.0, sin(a - uTime * 0.4)), 30.0) * 0.6;
        float pulse = smoothstep(0.08, 0.0, abs(r - mod(uTime * 2.0, 30.0))) * 0.8;
        float fade = smoothstep(26.0, 6.0, r);
        float v = (rings + spokes + sweep * smoothstep(1.5, 8.0, r) + pulse) * fade;
        gl_FragColor = vec4(uCol * v * 0.6, 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  grid.rotation.x = -Math.PI / 2; grid.position.y = 0.003; g.add(grid);
  g.userData.grid = grid;
  return g;
}

function initCrew() {
  const canvas = $('#crew-canvas');
  const S = makeStage(canvas, { fov: 30, bloom: { strength: 0.75, radius: 0.5, threshold: 0.88 }, vignette: 0.75, shadows: true, clear: 0x03050c });
  const { scene, camera, renderer } = S;
  scene.fog = new THREE.FogExp2(0x060a18, 0.06);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(makeEnvTexture()).texture;

  const N = CREW.length, R = 5.4;
  scene.add(new THREE.HemisphereLight(0x8a96d8, 0x05070f, 0.35));
  const spot = new THREE.SpotLight(0xfff3e4, 3.2, 14, 0.42, 0.55, 1.2);
  spot.position.set(1.4, 5.6, R + 2.6); spot.target.position.set(0, 0.8, R);
  spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0004; spot.shadow.normalBias = 0.02; spot.shadow.radius = 4;
  scene.add(spot, spot.target);
  const rimL = new THREE.DirectionalLight(0x8fa8e0, 1.3); rimL.position.set(-6, 4, -2); scene.add(rimL);
  const rimR = new THREE.DirectionalLight(0xe889b6, 0.7); rimR.position.set(7, 3, 0); scene.add(rimR);
  const fill = new THREE.DirectionalLight(0x6070a0, 0.35); fill.position.set(0, 2, 12); scene.add(fill);

  const floor = makeCrewFloor(); scene.add(floor);

  // centre: the bridge table, with the ship as a hologram
  const centre = new THREE.Group(); scene.add(centre);
  const table = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.5, 64), new THREE.MeshStandardMaterial({ color: 0x0f1530, roughness: 0.3, metalness: 0.7 })); table.position.y = 0.25; table.receiveShadow = true; centre.add(table);
  const tableTop = new THREE.Mesh(new THREE.CircleGeometry(1.45, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(RAIL.mixed.hex).multiplyScalar(0.5), map: glowSprite.tex || (glowSprite.tex = glowTexture()), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  tableTop.rotation.x = -Math.PI / 2; tableTop.position.y = 0.505; centre.add(tableTop);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.42, 1.6, 48, 1, true), new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCol: { value: new THREE.Color(RAIL.mixed.hex) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uTime; uniform vec3 uCol; varying vec2 vUv;
      void main(){ float a = (1.0 - vUv.y); a = a * a * 0.35; float s = 0.6 + 0.4 * sin(vUv.x * 120.0 + uTime * 2.0); float sc = smoothstep(0.9, 1.0, sin(vUv.y * 40.0 - uTime * 3.0)) * 0.3;
        gl_FragColor = vec4(uCol * (a * s + sc * (1.0 - vUv.y)) * 0.45, 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }));
  column.position.y = 1.3; centre.add(column);
  const mini = buildShip();
  const miniMat = holoize(mini, RAIL.mixed.hex);
  mini.scale.setScalar(0.3); mini.position.y = 3.55; centre.add(mini);

  // the crew on a turning ring
  const ring = new THREE.Group(); scene.add(ring);
  const chars = CREW.map((spec, i) => {
    const a = i / N * Math.PI * 2;
    const slot = new THREE.Group();
    slot.position.set(Math.sin(a) * R, 0, Math.cos(a) * R);
    slot.rotation.y = a;
    const ped = makePedestal(spec.rail, spec.status); slot.add(ped);
    const ch = buildCharacter(spec);
    ch.root.position.y = 0.17;
    ch.root.traverse((o) => { o.userData.crewIdx = i; });
    slot.add(ch.root);
    ch.slot = slot; ch.ped = ped; ch.angle = a;
    ring.add(slot);
    return ch;
  });

  // UI
  const card = $('#crew-card'), roster = $('#roster'), big = $('#crew-big');
  CREW.forEach((c, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = `status-${c.status}`;
    b.innerHTML = `<i style="background:${RAIL[c.rail].hex};box-shadow:0 0 6px ${RAIL[c.rail].hex}"></i>${esc(c.name.replace(/^The /, ''))}`;
    b.addEventListener('click', () => { stopTour(); select(i); });
    roster.appendChild(b);
  });
  let cur = 0, ringAngle = 0, ringTarget = 0;
  function renderCard(i) {
    const c = CREW[i];
    card.innerHTML = `
      <div class="num">${String(i + 1).padStart(2, '0')} / ${N} · ${c.id === 'captain' ? 'Command' : c.status === 'future' ? 'Future hire' : 'Station'}</div>
      <h3>${esc(c.name)}</h3>
      <div class="who">${esc(c.who)}${c.profile && c.profile !== c.who && c.status !== 'future' && c.id !== 'captain' ? ` · profile <span style="color:var(--ink-2)">${esc(c.profile)}</span>` : ''}</div>
      <div class="chips">${railChip(c.rail)}${statusChip(c.status)}</div>
      <dl class="facts">
        <dt>Duty</dt><dd>${esc(c.duty)}</dd>
        <dt>Brain</dt><dd class="mono">${esc(c.brain)}</dd>
        ${c.id === 'captain' ? '' : `<dt>Call it</dt><dd class="say">${sayLine(c)}</dd>`}
      </dl>
      <button class="textlink" type="button" data-room="${c.id}">Find their room on the deck plan →</button>`;
    $('[data-room]', card).addEventListener('click', (e) => window.deckSelect && window.deckSelect(e.currentTarget.dataset.room));
    $$('button', roster).forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    big.textContent = c.name.replace(/^The /, '').replace("Ship's ", '');
    big.style.webkitTextStroke = `1px ${RAIL[c.rail].hex}55`;
  }
  function select(i, instant) {
    cur = (i + N) % N;
    const target = -chars[cur].angle;
    // shortest path
    let d = target - ringTarget; d = Math.atan2(Math.sin(d), Math.cos(d));
    ringTarget += d;
    if (instant) ringAngle = ringTarget;
    chars[cur].greetT = 2.4;
    renderCard(cur);
  }
  window.crewSelect = (id) => { const i = CREW.findIndex((c) => c.id === id); if (i >= 0) { stopTour(); select(i); } };

  let tour = true, tourT = 7;
  const btnTour = $('#crew-tour');
  function stopTour() { tour = false; btnTour.setAttribute('aria-pressed', 'false'); }
  btnTour.addEventListener('click', () => { tour = !tour; btnTour.setAttribute('aria-pressed', String(tour)); tourT = 5; });
  $('#crew-prev').addEventListener('click', () => { stopTour(); select(cur - 1); });
  $('#crew-next').addEventListener('click', () => { stopTour(); select(cur + 1); });
  window.addEventListener('keydown', (e) => {
    if (!S.visible || e.target.closest('input,textarea')) return;
    const r = canvas.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === 'ArrowRight') { stopTour(); select(cur + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { stopTour(); select(cur - 1); e.preventDefault(); }
  });
  // pick by click
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let downX = 0, downY = 0;
  canvas.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; });
  canvas.addEventListener('click', (e) => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(ring.children, true);
    const h = hits.find((x) => x.object.userData.crewIdx !== undefined);
    if (h) { stopTour(); select(h.object.userData.crewIdx); }
  });
  // drag to spin the ring
  let dragging = false, lastX = 0;
  canvas.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') { dragging = true; lastX = e.clientX; } });
  window.addEventListener('pointerup', () => {
    if (!dragging) return; dragging = false;
    // snap to nearest crew member
    let best = 0, bd = 9;
    chars.forEach((c, i) => { const d = Math.abs(Math.atan2(Math.sin(-c.angle - ringTarget), Math.cos(-c.angle - ringTarget))); if (d < bd) { bd = d; best = i; } });
    if (best !== cur) { stopTour(); select(best); } else select(cur);
  });
  window.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; ringTarget += dx * 0.004; if (Math.abs(dx) > 2) stopTour(); });

  select(0, true);

  let t = 0, last = performance.now(), camDist = 5;
  S.onResize = (w, h) => { camDist = w / h < 1 ? 6.6 : w / h < 1.3 ? 5.6 : 5.0; };
  S.onResize(S.w, S.h);
  S.grade.uniforms.uAberration.value = 0.0025;
  function tick(now) {
    requestAnimationFrame(tick);
    const raw = (now - last) / 1000, dt = Math.min(0.05, raw); last = now;
    if (!S.visible || document.hidden) return;
    S.adapt(raw);
    t += dt * (REDUCED ? 0.3 : 1);
    if (tour && !REDUCED) { tourT -= dt; if (tourT <= 0) { tourT = 7; select(cur + 1); } }
    ringAngle += (ringTarget - ringAngle) * (1 - Math.exp(-dt * 3.2));
    ring.rotation.y = ringAngle;
    chars.forEach((ch, i) => {
      const sel = i === cur;
      // only animate the ones near the front
      const rel = Math.atan2(Math.sin(ch.angle + ringAngle), Math.cos(ch.angle + ringAngle));
      const near = Math.abs(rel) < 1.4;
      ch.slot.visible = Math.abs(rel) < 2.2;
      if (near) poseCharacter(ch, t, dt, sel);
      ch.ped.userData.ring.rotation.y = t * (sel ? 0.6 : 0.15);
    });
    mini.rotation.y = t * 0.3; mini.position.y = 3.55 + Math.sin(t * 0.8) * 0.06;
    miniMat.uniforms.uTime.value = t;
    column.material.uniforms.uTime.value = t;
    floor.userData.grid.material.uniforms.uTime.value = t;
    // camera: gentle drift
    const cx = Math.sin(t * 0.21) * 0.25, cy = 1.32 + Math.sin(t * 0.17) * 0.06;
    camera.position.set(cx, cy, R + camDist + Math.sin(t * 0.13) * 0.15);
    camera.lookAt(cx * 0.3, 0.92, R);
    S.grade.uniforms.uTime.value = t;
    S.composer.render(dt);
  }
  requestAnimationFrame(tick);
  window.__crewDebug = { select, chars, S, advance(sec) { t += sec; } };
  return { stage: S, select };
}

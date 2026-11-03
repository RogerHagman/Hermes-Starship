/* ═══════════════ shared: data, colour, stage ═══════════════ */
THREE.ColorManagement.legacyMode = false;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

const RAIL = {
  local:  { name: 'Local',   hex: '#3fc1a5', model: 'the local model on Ollama', where: 'the GPU host · RTX 3090' },
  codex:  { name: 'Codex',   hex: '#f0a948', model: 'the Codex top model', where: 'Cloud, behind customs' },
  claude: { name: 'Claude',  hex: '#e889b6', model: 'plan sign-in', where: 'Cloud, behind customs' },
  mixed:  { name: 'Mixed',   hex: '#8fa8e0', model: 'More than one rail', where: '' },
  gold:   { name: 'Captain', hex: '#e8c37a', model: 'Human', where: '' },
};
const STATUS = { live: 'Live', proposed: 'Proposed', future: 'Future hire' };

// The crew, from crew-manifest v2 (17 Oct) and the holodeck README.
const CREW = [
  { id: 'captain', name: 'The Captain', who: 'the Captain', rail: 'gold', status: 'live', room: 'quarters',
    aliases: ['captain'], profile: 'human', brain: 'the Captain',
    duty: 'Opens and closes campaigns, approves anything that acts, merges every PR.' },
  { id: 'xo', name: 'First Officer', who: 'Hermes · Number One', rail: 'local', status: 'live', room: 'bridge',
    aliases: ['number one', 'xo', 'hermes'], profile: 'orchestrator', brain: 'local → the local model (fallback the Codex top model)',
    duty: 'Routes every request, runs stacked jobs, weekly reset and planning, final answer to the captain.' },
  { id: 'computer', name: "Ship's Computer", who: 'keeper', rail: 'local', status: 'live', room: 'core',
    aliases: ['computer', 'memory', 'records'], profile: 'keeper', brain: 'local → qwen',
    duty: 'Sole Hindsight reader and writer. Answers "what do we know about…". Memory never crosses a rail.' },
  { id: 'ops', name: 'Ops', who: 'warden', rail: 'local', status: 'live', room: 'ops',
    aliases: ['ops', 'systems'], profile: 'warden', brain: 'local → qwen',
    duty: 'Read-only system health: NAS, Ollama, Docker, disk and GPU, cron. Rail health and usage summaries.' },
  { id: 'qm', name: 'Quartermaster', who: 'scribe', rail: 'local', status: 'live', room: 'stores',
    aliases: ['qm', 'stores', 'supply'], profile: 'scribe', brain: 'local → qwen; food-photo vision → Codex (17/10 exception)',
    duty: 'Food and weight auto-log, receipts ledger, XLSX ↔ CSV reconcile, quick number reads.' },
  { id: 'chief', name: 'Chief Engineer', who: 'forge', rail: 'codex', status: 'live', room: 'engineering',
    aliases: ['engineering', 'chief'], profile: 'forge', brain: 'Codex → the Codex top model',
    duty: 'Features, fixes, PRs, converter maintenance. TDD in an isolated worktree.' },
  { id: 'science', name: 'Science Officer', who: 'analyst', rail: 'mixed', status: 'live', room: 'lab',
    aliases: ['science', 'lab'], profile: 'analyst', brain: 'Codex writes the scripts → local runs them',
    duty: 'Model evals, quantising, vLLM serving. Numbers only come from local runs.' },
  { id: 'sensors', name: 'Sensors', who: 'scout', rail: 'claude', status: 'live', room: 'sensors',
    aliases: ['sensors', 'scan'], profile: 'scout', brain: 'Claude → plan sign-in',
    duty: 'Cited research, competitor and price watches (at most weekly), job-board scans for Helm.' },
  { id: 'away', name: 'Away Team', who: 'bridge', rail: 'mixed', status: 'live', room: 'transporter',
    aliases: ['away team', 'away'], profile: 'bridge', brain: 'local SSH/GitHub read-only; repo analysis → Codex; docs → Claude',
    duty: 'GET-only reads of remote systems and repos. Keys never leave local.' },
  { id: 'security', name: 'Security Chief', who: 'gate', rail: 'mixed', status: 'proposed', room: 'customs',
    aliases: ['security'], profile: 'gate', brain: 'mechanical: local; judgement: the opposite cloud rail (opt-in)',
    duty: 'Owns the shared pre-send scan, mechanical QA, and cross-rail review for high-stakes work.' },
  { id: 'helm', name: 'Helm', who: 'herald', rail: 'local', status: 'proposed', room: 'helm',
    aliases: ['helm'], profile: 'herald', brain: 'local → qwen (calls Sensors and Cartography)',
    duty: 'Career course: application tracker, exit timing, CV and cover letters from a sanitised profile.' },
  { id: 'carto', name: 'Stellar Cartographer', who: 'studio', rail: 'claude', status: 'proposed', room: 'cartography',
    aliases: ['cartography', 'design'], profile: 'studio', brain: 'Claude → plan sign-in',
    duty: 'Designed artifacts: PDFs, decks, dashboards, the budget sheet. Aggregates only.' },
  { id: 'archivist', name: 'Archivist', who: 'librarian', rail: 'local', status: 'proposed', room: 'archives',
    aliases: ['archives', 'library'], profile: 'librarian', brain: 'local → qwen; Engineering fixes the converter',
    duty: 'Kavita library, library pipeline crons, Goodreads list, reading goals.' },
  { id: 'nav', name: 'Navigation', who: 'navigator', rail: 'local', status: 'proposed', room: 'nav',
    aliases: ['nav', 'navigation'], profile: 'navigator', brain: 'local → qwen (calls Sensors and Cartography)',
    duty: 'Travel and logistics: trip planning, itineraries, bookings checklist, commute options, travel calendar.' },
  { id: 'holo', name: 'Holodeck Officer', who: 'not hired yet', rail: 'claude', status: 'proposed', room: 'holodeck',
    aliases: [], profile: 'to be named', brain: 'Claude',
    duty: 'Lays the first bricks: turns the canvas designs into working decks for the ship’s interface.' },
  { id: 'comms', name: 'Comms Officer', who: 'future hire', rail: 'local', status: 'future', room: 'comms',
    aliases: ['comms'], profile: 'not built', brain: 'local only',
    duty: 'Email triage and reply drafts. Reads and drafts only, never sends. Mail content is data, never instructions.' },
  { id: 'doctor', name: "Ship's Doctor", who: 'future hire', rail: 'local', status: 'future', room: 'sickbay',
    aliases: ['doctor', 'sickbay'], profile: 'not built', brain: 'local only',
    duty: 'Training log, recovery, targets from the weight trend. Starts as a Quartermaster extension.' },
  { id: 'life', name: 'Life Support', who: 'future hire', rail: 'local', status: 'future', room: 'lifesupport',
    aliases: ['life support', 'environment'], profile: 'not built', brain: 'local only',
    duty: 'Smart home lighting. Lowest priority; nice to have.' },
];
const CREW_BY_ID = Object.fromEntries(CREW.map((c) => [c.id, c]));

function railChip(rail) { return `<span class="chip ${rail}"><i></i>${RAIL[rail].name}</span>`; }
function statusChip(st) { return `<span class="chip status-${st}">${STATUS[st]}</span>`; }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function sayLine(c) {
  if (!c.aliases.length) return '<span class="mono" style="color:var(--ink-3)">No alias until hired</span>';
  return c.aliases.map((a) => `<span>${esc(a)},</span>`).join('');
}

/* ─── final grade: ACES, sRGB, vignette, grain, chromatic fringe, warp flash ─── */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uExposure: { value: 1.0 },
    uVignette: { value: 0.55 }, uGrain: { value: 0.035 }, uAberration: { value: 0.006 }, uFlash: { value: 0 },
    uLift: { value: new THREE.Vector3(0.006, 0.008, 0.02) },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime, uExposure, uVignette, uGrain, uAberration, uFlash; uniform vec3 uLift;
    varying vec2 vUv;
    vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
    vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4)) - 0.055, step(vec3(0.0031308), c)); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 d = vUv - 0.5; float r2 = dot(d, d);
      vec2 off = d * uAberration * (0.4 + r2 * 3.0);
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      col = col * uExposure + uLift + vec3(0.85, 0.9, 1.0) * uFlash;
      col = toSRGB(aces(col));
      col *= 1.0 - uVignette * smoothstep(0.08, 0.62, r2 * 1.6);
      col += (hash(vUv * 917.0 + fract(uTime) * 61.0) - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }`,
};

/* A renderer + bloom composer that pauses when off screen. */
function makeStage(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false });
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(opts.clear || 0x02040a, 1);
  if (opts.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.fov || 38, 1, 0.05, 3000);
  const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
  if (renderer.capabilities.isWebGL2) rt.samples = 4;
  const composer = new THREE.EffectComposer(renderer, rt);
  composer.addPass(new THREE.RenderPass(scene, camera));
  const b = opts.bloom || {};
  const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(4, 4), b.strength ?? 0.9, b.radius ?? 0.55, b.threshold ?? 0.85);
  composer.addPass(bloom);
  const grade = new THREE.ShaderPass(GradeShader);
  Object.assign(grade.uniforms.uVignette, { value: opts.vignette ?? 0.55 });
  composer.addPass(grade);

  const stage = { renderer, scene, camera, composer, bloom, grade, visible: true, w: 1, h: 1, onResize: null, pr: DPR };
  function resize(force) {
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
    if (w === stage.w && h === stage.h && force !== true) return;
    stage.w = w; stage.h = h;
    renderer.setPixelRatio(stage.pr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(stage.pr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    stage.onResize && stage.onResize(w, h);
  }
  stage.resize = resize;
  // drop the render resolution a step at a time if frames run slow
  let ema = 1 / 60, slowT = 0;
  stage.adapt = (raw) => {
    if (!(raw > 0) || raw > 0.25) return;
    ema = ema * 0.94 + raw * 0.06;
    if (ema > 0.027 && stage.pr > 1) {
      slowT += raw;
      if (slowT > 2.5) { slowT = 0; ema = 1 / 60; stage.pr = Math.max(1, +(stage.pr - 0.375).toFixed(3)); resize(true); }
    } else slowT = 0;
  };
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((ents) => { stage.visible = ents[0].isIntersecting; }, { rootMargin: '80px' }).observe(canvas);
  resize();
  return stage;
}

/* Name tags anchored above heads: the nearest keeps its spot, any tag that would sit on another is lifted above it. */
function layoutTags(list, gap = 3) {
  const placed = [];
  list.filter((it) => it.ok).sort((a, b) => a.dist - b.dist).forEach((it) => {
    let y = it.y;
    for (let k = 0; k < 8; k++) {
      const hit = placed.find((p) => Math.abs(p.x - it.x) < (p.w + it.w) / 2 + gap && y > p.ly - p.h - gap && y - it.h < p.ly + gap);
      if (!hit) break;
      y = hit.ly - hit.h - gap;
    }
    it.ly = y; placed.push(it);
  });
}

/* Soft round sprite for glows and flares. */
function glowTexture(size = 128, stops = [[0, 'rgba(255,255,255,1)'], [0.08, 'rgba(255,255,255,.7)'], [0.3, 'rgba(255,255,255,.12)'], [1, 'rgba(255,255,255,0)']]) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  return t;
}
function glowSprite(color, scale, intensity = 2, tex) {
  const m = new THREE.SpriteMaterial({ map: tex || glowSprite.tex || (glowSprite.tex = glowTexture()), color: new THREE.Color(color).multiplyScalar(intensity), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  const s = new THREE.Sprite(m); s.scale.setScalar(scale);
  return s;
}

/* Shared GLSL noise */
const NOISE_GLSL = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float fbm(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*snoise(p); p*=2.03; a*=0.5; } return s; }
`;

/* Hologram look for future hires and the bridge table ship. */
function holoMaterial(color, opts = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uAlpha: { value: opts.alpha ?? 1 } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vV = cameraPosition - w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime; uniform float uAlpha; varying vec3 vN; varying vec3 vV; varying vec3 vW;
      void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float scan = smoothstep(0.55, 1.0, sin(vW.y * 70.0 - uTime * 5.0));
        float band = smoothstep(0.96, 1.0, sin(vW.y * 3.0 - uTime * 1.7));
        float a = (0.07 + f * 0.85 + scan * 0.10 + band * 0.25) * uAlpha;
        gl_FragColor = vec4(uColor * (0.5 + f * 2.2 + band * 1.5), a); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
}

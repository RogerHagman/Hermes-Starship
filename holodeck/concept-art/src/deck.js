/* ═══════════════ deck plan: top-down cutaway with live-looking traffic ═══════════════ */
const SPACES = {
  lounge: { name: 'Observation Lounge', who: 'shared space · the Briefing Room', rail: 'mixed', status: 'proposed', aliases: ['lounge', 'briefing', 'all hands'],
    duty: 'Group chats between stations: briefings, stacked jobs, debates. Number One chairs. If a cloud station is in the room, the whole conversation counts as crossing to that rail.', brain: 'each station speaks with its own brain' },
  viewscreen: { name: 'Main Viewscreen', who: 'shared space', rail: 'local', status: 'proposed', aliases: ['on screen', 'viewscreen'],
    duty: '"On screen" captures the whole screen. Local brain only, and every click, type or drag needs the captain’s approval.', brain: 'local only (screenshots are personal data)' },
};

const ROOMS = [
  // saucer: the bridge at the centre, an inner ring along the spine and two outer rows
  { id: 'bridge', crew: 'xo', x: 852, y: 244, w: 112, h: 112, label: 'Bridge', tall: true },
  { id: 'quarters', crew: 'captain', x: 744, y: 244, w: 98, h: 50, label: 'Quarters' },
  { id: 'lounge', space: 'lounge', x: 744, y: 306, w: 98, h: 50, label: 'Obs. lounge' },
  { id: 'helm', crew: 'helm', x: 974, y: 244, w: 94, h: 50, label: 'Helm' },
  { id: 'nav', crew: 'nav', x: 974, y: 306, w: 94, h: 50, label: 'Navigation' },
  { id: 'viewscreen', space: 'viewscreen', x: 1078, y: 254, w: 58, h: 40, label: 'Screen', small: true },
  { id: 'comms', crew: 'comms', x: 1078, y: 306, w: 58, h: 40, label: 'Comms', small: true },
  { id: 'ops', crew: 'ops', x: 722, y: 150, w: 104, h: 72, label: 'Ops', ring: 'top' },
  { id: 'lab', crew: 'science', x: 834, y: 150, w: 118, h: 72, label: 'Science lab', ring: 'top' },
  { id: 'sickbay', crew: 'doctor', x: 960, y: 150, w: 96, h: 72, label: 'Sickbay', ring: 'top' },
  { id: 'stores', crew: 'qm', x: 722, y: 378, w: 104, h: 72, label: 'Stores', ring: 'bot' },
  { id: 'core', crew: 'computer', x: 834, y: 378, w: 118, h: 72, label: 'Core', ring: 'bot' },
  { id: 'archives', crew: 'archivist', x: 960, y: 378, w: 96, h: 72, label: 'Archives', ring: 'bot' },
  // engineering hull
  { id: 'lifesupport', crew: 'life', x: 124, y: 244, w: 100, h: 48, label: 'Life supp.' },
  { id: 'transporter', crew: 'away', x: 124, y: 308, w: 112, h: 48, label: 'Transporter' },
  { id: 'customs', crew: 'security', x: 392, y: 244, w: 72, h: 112, label: 'Customs', tall: true },
  // port nacelle: Codex
  { id: 'engineering', crew: 'chief', x: 196, y: 62, w: 236, h: 42, label: 'Main Engineering', wing: 'port' },
  // starboard nacelle: Claude
  { id: 'holodeck', crew: 'holo', x: 142, y: 496, w: 116, h: 42, label: 'Holodeck', wing: 'star' },
  { id: 'sensors', crew: 'sensors', x: 266, y: 496, w: 100, h: 42, label: 'Sensors', wing: 'star' },
  { id: 'cartography', crew: 'carto', x: 374, y: 496, w: 112, h: 42, label: 'Cartography', wing: 'star' },
];
const ROOM_BY_ID = Object.fromEntries(ROOMS.map((r) => [r.id, r]));
function roomInfo(r) { return r.space ? SPACES[r.space] : CREW_BY_ID[r.crew]; }

const ORDERS = [
  { to: 'engineering', text: 'fix the reconcile test' },
  { to: 'stores', text: 'log a meal photo' },
  { to: 'sensors', text: 'weekly price watch' },
  { to: 'core', text: 'what do we know about the NAS?' },
  { to: 'ops', text: 'status: Ollama, disk, GPU' },
  { to: 'cartography', text: 'monthly budget PDF, aggregates only' },
  { to: 'lab', text: 'run the quantisation eval' },
  { to: 'holodeck', text: 'build the deck plan board' },
  { to: 'helm', text: 'update the application tracker' },
  { to: 'archives', text: 'sync the reading list' },
  { to: 'transporter', text: 'GET remote repo status' },
  { to: 'nav', text: 'draft a trip itinerary' },
  { to: 'engineering', text: 'open a PR for the read API' },
  { to: 'sensors', text: 'cited survey, three sources' },
];

function initDeck() {
  const svg = $('#deck');
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  // defs
  const defs = el('defs', {}, svg);
  defs.innerHTML = `
    <linearGradient id="hullG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#132240"/><stop offset=".5" stop-color="#0f1b34"/><stop offset="1" stop-color="#0c162b"/></linearGradient>
    <radialGradient id="saucerG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#183056"/><stop offset=".7" stop-color="#122444"/><stop offset="1" stop-color="#0e1c36"/></radialGradient>
    <radialGradient id="engG"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".9"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
    <radialGradient id="nacP"><stop offset="0" stop-color="#f0a948" stop-opacity=".8"/><stop offset="1" stop-color="#f0a948" stop-opacity="0"/></radialGradient>
    <radialGradient id="nacS"><stop offset="0" stop-color="#e889b6" stop-opacity=".8"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></radialGradient>
    <pattern id="plating" width="40" height="22" patternUnits="userSpaceOnUse"><path d="M0 0H40M0 11H20M20 0V11M0 22H40M30 11V22" stroke="#22344f" stroke-width=".7" fill="none"/></pattern>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#14213a" stroke-width=".6" fill="none"/></pattern>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>`;

  el('rect', { x: 0, y: 0, width: 1200, height: 600, fill: 'url(#grid)', opacity: 0.8 }, svg);

  // ─ the ship from above, the same shape as the 3D model: nacelles on swept pylons, engineering hull, saucer
  const art = el('g', {}, svg);
  const SX = 905, SY = 300, SRX = 255, SRY = 236;
  [{ sgn: -1, rail: '#f0a948', grad: 'url(#nacP)' }, { sgn: 1, rail: '#e889b6', grad: 'url(#nacS)' }].forEach(({ sgn, rail, grad }) => {
    const Y = (y) => 300 + sgn * (300 - y); // written for the port (top) side
    const pt = ([x, y]) => `${x},${Y(y)}`;
    // pylon from the hull up to the nacelle, swept back
    const py = `M${pt([470, 240])} L${pt([400, 240])} L${pt([312, 122])} L${pt([392, 122])} Z`;
    el('path', { d: py, fill: '#15243f', stroke: '#2e4569', 'stroke-width': 1.2 }, art);
    el('path', { d: `M${pt([470, 240])} L${pt([392, 122])}`, stroke: rail, 'stroke-width': 1.6, 'stroke-opacity': 0.8, filter: 'url(#glow)' }, art);
    // nacelle
    const ny = Y(88);
    el('ellipse', { cx: 112, cy: ny, rx: 54, ry: 24, fill: grad, class: 'exhaust' }, art);
    el('rect', { x: 120, y: ny - 32, width: 440, height: 64, rx: 32, fill: '#13213c', stroke: '#2e4569', 'stroke-width': 1.5 }, art);
    el('rect', { x: 150, y: Y(sgn < 0 ? 119 : 117) - 2, width: 360, height: 4, rx: 2, fill: rail, opacity: 0.8, class: 'nacelle-strip' }, art);
    el('circle', { cx: 538, cy: ny, r: 13, fill: rail, filter: 'url(#glow)', class: 'bussard' }, art);
    el('text', { x: 340, y: Y(44), class: 'rsub', 'text-anchor': 'middle', style: `fill:${rail};letter-spacing:.18em` }, art).textContent = sgn < 0 ? 'PORT NACELLE · CODEX RAIL' : 'STARBOARD NACELLE · CLAUDE RAIL';
  });
  // engineering hull, running forward under the saucer
  const hullD = 'M 70 262 C 70 248, 82 238, 112 238 L 700 238 C 742 240, 764 268, 764 300 C 764 332, 742 360, 700 362 L 112 362 C 82 362, 70 352, 70 338 Z';
  el('ellipse', { cx: 58, cy: 300, rx: 44, ry: 52, fill: 'url(#engG)', class: 'exhaust' }, art);
  el('path', { d: hullD, fill: 'url(#hullG)', stroke: '#2e4569', 'stroke-width': 1.5 }, art);
  el('path', { d: hullD, fill: 'url(#plating)', opacity: 0.7 }, art);
  el('rect', { x: 64, y: 272, width: 10, height: 56, rx: 4, fill: '#3fc1a5', filter: 'url(#glow)' }, art);
  // saucer
  el('ellipse', { cx: SX, cy: SY, rx: SRX, ry: SRY, fill: 'url(#saucerG)', stroke: '#2e4569', 'stroke-width': 1.5 }, art);
  el('ellipse', { cx: SX, cy: SY, rx: SRX, ry: SRY, fill: 'url(#plating)', opacity: 0.55 }, art);
  for (const k of [0.94, 0.62]) el('ellipse', { cx: SX, cy: SY, rx: SRX * k, ry: SRY * k, fill: 'none', stroke: k > 0.9 ? '#3fc1a5' : '#22344f', 'stroke-width': k > 0.9 ? 1.4 : 1, 'stroke-opacity': k > 0.9 ? 0.55 : 1 }, art);
  el('ellipse', { cx: SX, cy: SY, rx: SRX + 3, ry: SRY + 3, fill: 'none', stroke: '#4fa3ff', 'stroke-width': 1.5, 'stroke-opacity': 0.5 }, art);
  for (const y of [272, 328]) el('rect', { x: 648, y: y - 9, width: 8, height: 18, rx: 3, fill: '#3fc1a5', filter: 'url(#glow)' }, art);
  // customs ring round the engineering hull where the pylons leave it
  el('ellipse', { cx: 478, cy: 300, rx: 8, ry: 64, fill: 'none', stroke: '#8fa8e0', 'stroke-width': 3, filter: 'url(#glow)', class: 'ringpulse' }, art);
  // corridors: the spine from the stern to the bridge, the saucer's two ring corridors, and a passage up each pylon
  const corridor = (d, w = 12) => el('path', { d, stroke: '#22344f', 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, art);
  corridor('M 112 300 H 852', 14);
  corridor('M 722 231 H 1056 M 722 369 H 1056', 8);
  corridor('M 908 231 V 244 M 908 356 V 369', 8);
  for (const sgn of [-1, 1]) {
    const Y = (y) => 300 + sgn * (300 - y);
    corridor(`M 428 ${Y(244)} L 428 ${Y(240)} L 346 ${Y(122)} L 346 ${Y(112)}`, 10);
    corridor(`M 140 ${Y(112)} H 520`, 8);
  }
  const flow = el('path', { d: 'M 112 300 H 852', stroke: '#8fa8e0', 'stroke-width': 1.5, 'stroke-dasharray': '2 10', opacity: 0.6 }, art);
  // area labels
  const area = (x, y, t, c, anchor = 'start') => { const tx = el('text', { x, y, class: 'rsub', 'text-anchor': anchor, style: `fill:${c};letter-spacing:.18em` }, art); tx.textContent = t; };
  area(SX, 132, 'SAUCER · LOCAL RAIL', '#3fc1a5', 'middle');
  area(496, 346, 'HULL · LOCAL RAIL', '#3fc1a5');
  area(1166, 304, 'BOW', '#8ea3c4');
  area(18, 232, 'STERN', '#8ea3c4');

  // ─ rooms
  const roomLayer = el('g', {}, svg);
  const roomEls = {};
  ROOMS.forEach((r) => {
    const info = roomInfo(r);
    const col = RAIL[info.rail].hex;
    const g = el('g', { class: `room ${info.status}`, tabindex: 0, role: 'button', 'aria-label': `${r.label}: ${info.name}` }, roomLayer);
    const dash = info.status === 'live' ? '' : info.status === 'proposed' ? '6 4' : '0.5 4.5';
    const shell = el('rect', { class: 'shell', x: r.x, y: r.y, width: r.w, height: r.h, rx: 7, fill: col, 'fill-opacity': info.status === 'future' ? 0.04 : 0.1, stroke: col, 'stroke-width': 1.4, 'stroke-dasharray': dash, 'stroke-linecap': 'round', 'stroke-opacity': info.status === 'future' ? 0.7 : 1 }, g);
    const flash = el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: 7, fill: col, opacity: 0 }, g);
    const tx = r.x + 8;
    const lbl = el('text', { class: 'rlabel', x: tx, y: r.y + 17, style: r.small ? 'font-size:10px' : '' }, g); lbl.textContent = r.label;
    if (!r.small) {
      const sub = el('text', { class: 'rsub', x: tx, y: r.y + 30 }, g);
      sub.textContent = r.space ? 'shared space' : (info.id === 'captain' ? 'the Captain' : info.status === 'future' ? 'future hire' : info.id === 'holo' ? 'not hired yet' : info.profile);
    }
    // crew badge
    const bx = r.x + r.w - 14, by = r.tall ? r.y + 14 : r.y + r.h - 14;
    const badge = el('circle', { cx: bx, cy: by, r: 5, fill: col, opacity: info.status === 'future' ? 0.4 : 1 }, g);
    const halo = el('circle', { cx: bx, cy: by, r: 5, fill: 'none', stroke: col, 'stroke-width': 1.2, opacity: 0 }, g);
    if (r.id === 'core') { el('circle', { cx: r.x + r.w / 2, cy: r.y + r.h / 2 + 10, r: 14, fill: 'none', stroke: col, 'stroke-dasharray': '3 3', class: 'spin' }, g); }
    if (r.id === 'bridge') {
      const mx = r.x + r.w / 2;
      el('path', { d: `M ${mx - 30} ${r.y + 84} q 30 -24 60 0`, fill: 'none', stroke: '#e8c37a', 'stroke-width': 1.5, opacity: 0.6 }, g);
      el('circle', { cx: mx, cy: r.y + 64, r: 8, fill: 'none', stroke: '#e8c37a', 'stroke-width': 1.5 }, g);
      const s = el('text', { class: 'rsub', x: mx, y: r.y + r.h - 9, 'text-anchor': 'middle' }, g); s.textContent = 'conn: Number One';
    }
    if (r.id === 'customs') {
      el('line', { x1: r.x + 6, y1: 300, x2: r.x + r.w - 6, y2: 300, stroke: col, 'stroke-width': 1, opacity: 0.6 }, g);
      for (const gy of [r.y + 2, r.y + r.h - 2]) el('rect', { x: 414, y: gy - 3, width: 28, height: 6, rx: 2, fill: col, class: 'gate' }, g);
      const s1 = el('text', { class: 'rsub', x: tx, y: r.y + r.h - 10 }, g); s1.textContent = 'scan';
    }
    roomEls[r.id] = { g, shell, flash, badge, halo, r, info, col };
    const choose = () => selectRoom(r.id, true);
    g.addEventListener('click', choose);
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
  });
  const style = el('style', {}, svg);
  style.textContent = `.spin{transform-box:fill-box;transform-origin:center;animation:spin 8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
    .exhaust{animation:ex 1.6s ease-in-out infinite alternate}@keyframes ex{from{opacity:.55}to{opacity:1}}
    .bussard{animation:ex 1.1s ease-in-out infinite alternate}.ringpulse{animation:ex 2.2s ease-in-out infinite alternate}
    .nacelle-strip{animation:strip 0.9s linear infinite}@keyframes strip{50%{opacity:.5}}`;

  // ─ panel
  const card = $('#station-card');
  let selected = null;
  function selectRoom(id, user) {
    if (selected) roomEls[selected].g.classList.remove('sel');
    selected = id; const R = roomEls[id]; R.g.classList.add('sel');
    const info = R.info;
    const crewLink = !R.r.space ? `<button class="textlink" type="button" id="meet">Meet ${esc(info.name.replace(/^The /, 'the '))} in crew quarters →</button>` : '';
    card.innerHTML = `
      <div class="eyebrow">${esc(R.r.label)}${R.r.wing ? ` · ${R.r.wing === 'port' ? 'port nacelle' : 'starboard nacelle'}` : ''}</div>
      <h3>${esc(info.name)}</h3>
      <div class="who">${esc(info.who)}</div>
      <div class="chips">${railChip(info.rail)}${statusChip(info.status)}</div>
      <dl class="facts">
        <dt>Duty</dt><dd>${esc(info.duty)}</dd>
        <dt>Brain</dt><dd class="mono">${esc(info.brain)}</dd>
        ${info.id === 'captain' ? '' : `<dt>Call it</dt><dd class="say">${sayLine(info)}</dd>`}
      </dl>
      ${crewLink}`;
    const meet = $('#meet', card);
    if (meet) meet.addEventListener('click', () => { window.crewSelect && window.crewSelect(info.id); $('#crew').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); });
  }
  selectRoom('bridge');

  // ─ crew walking the corridor
  const walkLayer = el('g', {}, svg);
  const walkerCols = ['#3fc1a5', '#3fc1a5', '#3fc1a5', '#8fa8e0', '#3fc1a5', '#8fa8e0', '#3fc1a5', '#e8c37a'];
  const walkers = walkerCols.map((c, i) => {
    const x = rand(140, 840);
    return { x, y: 300 + (i % 2 ? 3.5 : -3.5), tx: rand(140, 840), sp: rand(18, 34), wait: rand(0, 2), dot: el('circle', { cx: x, cy: 300, r: 2.6, fill: c, opacity: 0.9 }, walkLayer) };
  });
  // ─ traffic
  const traffic = el('g', {}, svg);
  const logEl = $('#ship-log');
  function log(html, minsAgo = 0) {
    const d = new Date(Date.now() - minsAgo * 60000);
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML = `<time>${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</time><span>${html}</span>`;
    logEl.prepend(row);
    while (logEl.children.length > 9) logEl.lastChild.remove();
  }
  window.shipLog = log;
  function routeTo(id) {
    const r = ROOM_BY_ID[id];
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    const pts = [[908, 300]];
    if (r.wing) {
      // aft along the spine, through customs, up the pylon and along the nacelle
      const Y = (y) => (r.wing === 'port' ? y : 600 - y);
      pts.push([428, 300], 'customs', [428, Y(240)], [346, Y(122)], [346, Y(112)], [cx, Y(112)], [cx, cy]);
    } else if (r.ring) {
      const ry = r.ring === 'top' ? 231 : 369;
      pts.push([908, ry], [cx, ry], [cx, cy]);
    } else if (r.id !== 'bridge') {
      const doorY = r.y < 300 ? r.y + r.h : r.y; pts.push([cx, 300], [cx, doorY], [cx, cy]);
    }
    return pts;
  }
  const pulses = [];
  function spawn(order, back) {
    const target = ROOM_BY_ID[order.to];
    const info = roomInfo(target);
    let pts = routeTo(order.to);
    if (back) pts = pts.slice().reverse();
    const col = back ? RAIL[info.rail].hex : '#e8c37a';
    const trail = el('polyline', { fill: 'none', stroke: col, 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0.8 }, traffic);
    const dot = el('circle', { r: 4.5, fill: col, filter: 'url(#glow)' }, traffic);
    const segs = [];
    let prev = null;
    pts.forEach((p) => {
      if (p === 'customs') { segs.push({ wait: 0.7 }); return; }
      if (prev) segs.push({ a: prev, b: p, len: Math.hypot(p[0] - prev[0], p[1] - prev[1]) });
      prev = p;
    });
    pulses.push({ order, back, segs, i: 0, s: 0, hist: [], trail, dot, col, info, target, waited: 0 });
  }
  function arrive(p) {
    const R = roomEls[p.target.id];
    if (!p.back) {
      R.flash.animate([{ opacity: 0.45 }, { opacity: 0 }], { duration: 1100, easing: 'ease-out' });
      R.halo.animate([{ opacity: 1, r: 5 }, { opacity: 0, r: 22 }], { duration: 1100, easing: 'ease-out' });
      setTimeout(() => spawn(p.order, true), 900 + Math.random() * 900);
    } else {
      roomEls.bridge.flash.animate([{ opacity: 0.3 }, { opacity: 0 }], { duration: 900 });
      log(`<span class="k">${esc(p.info.name.replace(/^The /, ''))}</span> reported back <span class="ok">done</span>`);
    }
  }
  let k = 0, spawnT = 0.8;
  let last = performance.now();
  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(svg);
  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible || document.hidden) return;
    flow.setAttribute('stroke-dashoffset', String((now / 40) % 12));
    walkers.forEach((w) => {
      if (w.wait > 0) { w.wait -= dt; return; }
      const d = w.tx - w.x;
      if (Math.abs(d) < 1) { w.wait = rand(0.8, 3.5); w.tx = clamp(w.x + rand(-260, 260), 130, 840); return; }
      w.x += Math.sign(d) * Math.min(Math.abs(d), w.sp * dt);
      w.dot.setAttribute('cx', w.x.toFixed(1)); w.dot.setAttribute('cy', (w.y + Math.sin(now / 160 + w.x) * 0.5).toFixed(1));
    });
    spawnT -= dt;
    if (spawnT <= 0 && pulses.length < 6) {
      spawnT = REDUCED ? 6 : 2.6;
      const o = ORDERS[k++ % ORDERS.length];
      spawn(o, false);
      const info = roomInfo(ROOM_BY_ID[o.to]);
      log(`Number One → <span class="k">${esc(info.name.replace(/^The /, ''))}</span>: ${esc(o.text)}`);
    }
    for (let j = pulses.length - 1; j >= 0; j--) {
      const p = pulses[j];
      const seg = p.segs[p.i];
      let x, y;
      if (!seg) { p.trail.remove(); p.dot.remove(); pulses.splice(j, 1); arrive(p); continue; }
      if (seg.wait !== undefined) {
        p.waited += dt;
        const last = p.hist[p.hist.length - 1] || [428, 300]; x = last[0]; y = last[1];
        if (p.waited === dt) {
          const c = roomEls.customs; c.flash.animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: 700 });
          c.halo.animate([{ opacity: 1, r: 5 }, { opacity: 0, r: 20 }], { duration: 700 });
          if (!p.back) log(`Security: customs scan <span class="ok">passed</span> → ${RAIL[p.info.rail].name} rail`);
        }
        p.dot.setAttribute('r', String(4.5 + Math.sin(p.waited * 20) * 1.5));
        if (p.waited >= seg.wait) { p.i++; p.waited = 0; p.dot.setAttribute('r', '4.5'); }
      } else {
        p.s += dt * 260;
        if (p.s >= seg.len) { p.s -= seg.len; p.i++; x = seg.b[0]; y = seg.b[1]; }
        else { const u = p.s / seg.len; x = lerp(seg.a[0], seg.b[0], u); y = lerp(seg.a[1], seg.b[1], u); }
      }
      p.hist.push([x, y]); if (p.hist.length > 14) p.hist.shift();
      p.dot.setAttribute('cx', x.toFixed(1)); p.dot.setAttribute('cy', y.toFixed(1));
      p.trail.setAttribute('points', p.hist.map((h) => h[0].toFixed(1) + ',' + h[1].toFixed(1)).join(' '));
    }
  }
  requestAnimationFrame(tick);
  log('Bridge: all stations reporting. Customs ring online.', 14);
  log('Number One → <span class="k">Ops</span>: morning health check', 11);
  log('<span class="k">Ops</span> reported back <span class="ok">done</span>', 10);
  log('Number One → <span class="k">Sensors</span>: cited survey, three sources', 6);
  log('Security: customs scan <span class="ok">passed</span> → Claude rail', 6);
  log('<span class="k">Sensors</span> reported back <span class="ok">done</span>', 2);
  window.deckSelect = (crewId) => { const r = ROOMS.find((x) => x.crew === crewId); if (r) { selectRoom(r.id, true); $('#decks').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); } };
}

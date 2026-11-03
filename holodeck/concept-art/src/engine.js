/* ═══════════════ engine room: the three rail cores + customs log ═══════════════ */
const CORES = [
  { rail: 'local', title: 'Local core', meterLabel: 'GPU load', base: 0.46, note: 'No quota. Memory, secrets and personal data stay here.' },
  { rail: 'codex', title: 'Codex core', meterLabel: '5-hour window used', base: 0.38, note: 'Engineering and precise structured output.' },
  { rail: 'claude', title: 'Claude core', meterLabel: 'Weekly limit used', base: 0.71, note: 'Research, writing, design and planning.' },
];

function initEngines() {
  const wrap = $('#engine-cores');
  const cores = CORES.map((c) => {
    const R = RAIL[c.rail];
    const on = CREW.filter((m) => m.rail === c.rail && m.status !== 'future' && m.id !== 'captain').map((m) => m.name.replace(/^The /, ''));
    const mixed = CREW.filter((m) => m.rail === 'mixed' && m.status !== 'future' && (c.rail !== 'local' || true)).map((m) => m.name);
    const el = document.createElement('article');
    el.className = `core ${c.rail}`;
    el.innerHTML = `
      <canvas aria-hidden="true"></canvas>
      <div class="core-body">
        <h3>${c.title} <span>${esc(R.model)}</span></h3>
        <div class="mono" style="font-size:12px;color:var(--ink-3)">${esc(R.where)}</div>
        <p style="margin:0;color:var(--ink-2);font-size:15px">${esc(c.note)}</p>
        <div class="meter"><div class="lbl"><span>${c.meterLabel}</span><b class="val">—</b></div><div class="bar"><i style="width:0%"></i></div></div>
        <div class="eyebrow" style="font-size:10.5px">Stations on this core</div>
        <div class="runs">${on.map((n) => `<span>${esc(n)}</span>`).join('')}${mixed.map((n) => `<span style="opacity:.6" title="mixed rail">${esc(n)}</span>`).join('')}</div>
      </div>`;
    wrap.appendChild(el);
    const cv = $('canvas', el);
    const parts = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), v: rand(0.05, 0.22), s: rand(0.6, 2.2) }));
    return { c, el, cv, ctx: cv.getContext('2d'), col: R.hex, parts, bar: $('.bar i', el), val: $('.val', el), level: c.base };
  });

  let visible = false;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { rootMargin: '60px' }).observe(wrap);
  function size() { cores.forEach((k) => { const r = k.cv.getBoundingClientRect(); k.cv.width = Math.max(1, r.width * DPR); k.cv.height = Math.max(1, r.height * DPR); }); }
  new ResizeObserver(size).observe(wrap); size();

  const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  function draw(k, t) {
    const { ctx, cv, col } = k;
    const W = cv.width, H = cv.height, d = DPR;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#060a17'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cw = Math.min(W * 0.34, 64 * d), top = H * 0.1, bot = H * 0.9;
    // floor grid glow
    const fg = ctx.createRadialGradient(cx, bot, 0, cx, bot, W * 0.7); fg.addColorStop(0, hexA(col, 0.22)); fg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
    // housing
    ctx.fillStyle = '#0d1530'; ctx.strokeStyle = '#2a3a6e'; ctx.lineWidth = 1 * d;
    ctx.fillRect(cx - cw * 0.85, top - 8 * d, cw * 1.7, 14 * d); ctx.fillRect(cx - cw * 0.85, bot - 6 * d, cw * 1.7, 14 * d);
    ctx.globalCompositeOperation = 'lighter';
    // plasma column
    const g = ctx.createLinearGradient(cx - cw / 2, 0, cx + cw / 2, 0);
    g.addColorStop(0, hexA(col, 0.05)); g.addColorStop(0.5, hexA(col, 0.55)); g.addColorStop(1, hexA(col, 0.05));
    ctx.fillStyle = g; ctx.fillRect(cx - cw / 2, top, cw, bot - top);
    // rising bands
    for (let i = 0; i < 9; i++) {
      const p = ((t * 0.22 * (k.level + 0.5) + i / 9) % 1);
      const y = bot - p * (bot - top);
      const bg = ctx.createLinearGradient(0, y - 18 * d, 0, y + 18 * d);
      bg.addColorStop(0, 'rgba(0,0,0,0)'); bg.addColorStop(0.5, hexA(col, 0.5 * Math.sin(p * Math.PI))); bg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bg; ctx.fillRect(cx - cw / 2, y - 18 * d, cw, 36 * d);
    }
    // bright core line
    const cl = ctx.createLinearGradient(cx - 6 * d, 0, cx + 6 * d, 0);
    cl.addColorStop(0, 'rgba(255,255,255,0)'); cl.addColorStop(0.5, `rgba(255,255,255,${0.35 + 0.15 * Math.sin(t * 5)})`); cl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = cl; ctx.fillRect(cx - 6 * d, top, 12 * d, bot - top);
    // containment rings
    for (let i = 0; i < 6; i++) {
      const y = top + (i + 0.5) / 6 * (bot - top);
      const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(t * 3 - i * 0.9));
      ctx.strokeStyle = hexA(col, 0.25 + 0.6 * pulse); ctx.lineWidth = 2 * d;
      ctx.beginPath(); ctx.ellipse(cx, y, cw * 0.72, 7 * d, 0, 0, Math.PI * 2); ctx.stroke();
    }
    // particles
    ctx.fillStyle = hexA(col, 0.9);
    for (const p of k.parts) {
      p.y -= p.v * 0.016 * (0.6 + k.level);
      if (p.y < 0) { p.y = 1; p.x = Math.random(); }
      const x = cx + (p.x - 0.5) * cw * 1.1 + Math.sin(t * 2 + p.y * 10) * 3 * d, y = top + p.y * (bot - top);
      ctx.globalAlpha = Math.sin(p.y * Math.PI);
      ctx.fillRect(x, y, p.s * d, p.s * d);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    // glass edges
    ctx.strokeStyle = 'rgba(200,215,255,.22)'; ctx.lineWidth = 1 * d;
    ctx.strokeRect(cx - cw / 2, top, cw, bot - top);
  }

  // customs log
  const tbody = $('#clog');
  const crossing = [
    ['Number One', 'codex', 'fix the reconcile test'], ['Number One', 'claude', 'weekly price watch'], ['Helm', 'claude', 'job-board scan (sanitised profile)'],
    ['Number One', 'claude', 'monthly budget PDF, aggregates only'], ['Science Officer', 'codex', 'write the eval script'], ['Away Team', 'codex', 'repo analysis on a scratch copy'],
    ['Number One', 'codex', 'open a PR for the read API'], ['Navigation', 'claude', 'trip PDF layout'], ['Quartermaster', 'codex', 'meal photo, EXIF stripped'],
  ];
  let ci = 0;
  function addRow(isNew, minsAgo = 0) {
    const [from, rail, order] = crossing[ci++ % crossing.length];
    const d = new Date(Date.now() - minsAgo * 60000);
    const tr = document.createElement('tr'); if (isNew) tr.className = 'new';
    tr.innerHTML = `<td>${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</td><td>${esc(from)}</td><td><span class="dot" style="background:${RAIL[rail].hex}"></span>${RAIL[rail].name}</td><td>${esc(order)}</td><td class="pass">passed</td>`;
    tbody.prepend(tr);
    while (tbody.children.length > 6) tbody.lastChild.remove();
  }
  for (let i = 5; i >= 0; i--) addRow(false, i * 7 + 3);
  let rowT = 6;

  let last = performance.now(), t = 0, meterT = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible || document.hidden) return;
    t += dt * (REDUCED ? 0.2 : 1);
    cores.forEach((k) => draw(k, t));
    meterT -= dt;
    if (meterT <= 0) {
      meterT = 2.5;
      cores.forEach((k) => {
        k.level = clamp(k.c.base + rand(-0.04, 0.04), 0.05, 0.98);
        k.bar.style.width = (k.level * 100).toFixed(0) + '%';
        k.val.textContent = (k.level * 100).toFixed(0) + '%';
      });
    }
    rowT -= dt; if (rowT <= 0) { rowT = 6; addRow(true); }
  }
  requestAnimationFrame(tick);
}

function initNav() {
  const links = $$('.nav a');
  const secs = links.map((a) => $('#' + a.dataset.sec));
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.dataset.sec === e.target.id)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => s && io.observe(s));
}

// Wrap the single-file build in a design-board viewer: the board renders at exactly
// 2560 x 1440 inside an iframe (so its own layout never reflows) and is scaled to fit
// the window, like the boards on the Starship Deck canvas. Fit / 1:1 / Full screen.
//   npm run board   ->  dist-board/bridge.html
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const here = import.meta.dirname;
const board = readFileSync(resolve(here, '../dist-single/index.html'));
const b64 = board.toString('base64');
const W = 2560, H = 1440;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hermes Starship · Bridge</title>
<style>
  :root{--bg:#04070d;--bar:#0c1526;--line:#2e4569;--text:#e6ecf5;--label:#9fb0cc;--gold:#e8c37a}
  html,body{margin:0;height:100%;background:var(--bg);color:var(--text);font:13px/1.3 'JetBrains Mono',ui-monospace,monospace;overflow:hidden}
  #viewport{position:fixed;inset:0;overflow:hidden}
  body.one #viewport{overflow:auto}
  #stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;box-shadow:0 0 0 1px var(--line),0 20px 60px rgba(0,0,0,.6)}
  #stage iframe{width:${W}px;height:${H}px;border:0;display:block;background:#070b14}
  #bar{position:fixed;right:14px;top:12px;z-index:5;display:flex;gap:6px;align-items:center;padding:6px;border-radius:99px;background:rgba(12,21,38,.92);border:1.5px solid var(--line);opacity:0;transition:opacity .3s}
  #bar.show,#bar:hover,#bar:focus-within{opacity:1}
  #bar span{padding:0 8px;color:var(--label);letter-spacing:.08em;white-space:nowrap}
  #bar button{min-height:30px;padding:0 12px;border-radius:99px;border:1.5px solid var(--line);background:transparent;color:var(--text);font:inherit;cursor:pointer;white-space:nowrap}
  #bar button[aria-pressed="true"]{background:var(--gold);border-color:var(--gold);color:#1a1420}
  #bar button:focus-visible{outline:2px solid #fff;outline-offset:2px}
  #note{position:fixed;left:50%;top:64px;transform:translateX(-50%);padding:8px 14px;border-radius:99px;background:var(--bar);border:1.5px solid var(--line);opacity:0;transition:opacity .25s;pointer-events:none}
  #note.show{opacity:1}
</style>
</head>
<body>
<div id="viewport"><div id="stage"><iframe id="board" title="Hermes Starship Bridge, 2560 by 1440"></iframe></div></div>
<div id="bar" role="toolbar" aria-label="Board view">
  <span id="size">${W} × ${H}</span>
  <button type="button" id="fit" aria-pressed="true">Fit</button>
  <button type="button" id="one" aria-pressed="false">1:1</button>
  <button type="button" id="full">Full screen</button>
</div>
<div id="note" role="status"></div>
<script>
  // The board itself, built by npm run single, unpacked into the iframe.
  var bytes = Uint8Array.from(atob('${b64}'), function (c) { return c.charCodeAt(0); });
  document.getElementById('board').srcdoc = new TextDecoder().decode(bytes);

  var W = ${W}, H = ${H}, mode = 'fit';
  var stage = document.getElementById('stage');
  function layout() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = mode === 'fit' ? Math.min(vw / W, vh / H) : 1;
    var x = mode === 'fit' ? Math.max(0, (vw - W * s) / 2) : 0;
    var y = mode === 'fit' ? Math.max(0, (vh - H * s) / 2) : 0;
    stage.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    document.getElementById('viewport').style.height = '';
    document.getElementById('size').textContent = W + ' × ' + H + ' · ' + Math.round(s * 100) + '%';
  }
  function setMode(m) {
    mode = m;
    document.body.classList.toggle('one', m === 'one');
    document.getElementById('fit').setAttribute('aria-pressed', m === 'fit');
    document.getElementById('one').setAttribute('aria-pressed', m === 'one');
    // At 1:1 the viewport scrolls over the full-size board.
    stage.style.position = m === 'one' ? 'relative' : 'absolute';
    layout();
  }
  var noteTimer;
  function note(t) {
    var n = document.getElementById('note'); n.textContent = t; n.classList.add('show');
    clearTimeout(noteTimer); noteTimer = setTimeout(function () { n.classList.remove('show'); }, 3500);
  }
  function full() {
    var el = document.documentElement;
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (!document.fullscreenEnabled || !el.requestFullscreen) { note('Full screen is blocked in this frame. Use the expand button on the artifact, or F11.'); return; }
    el.requestFullscreen().catch(function () { note('Full screen is blocked in this frame. Use the expand button on the artifact, or F11.'); });
  }
  document.getElementById('fit').onclick = function () { setMode('fit'); };
  document.getElementById('one').onclick = function () { setMode('one'); };
  document.getElementById('full').onclick = full;
  document.addEventListener('fullscreenchange', function () {
    document.getElementById('full').textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
    layout();
  });
  window.addEventListener('resize', layout);
  // The view controls stay out of the way: they appear when the mouse moves, then fade.
  var bar = document.getElementById('bar'), barTimer;
  function showBar() { bar.classList.add('show'); clearTimeout(barTimer); barTimer = setTimeout(function () { bar.classList.remove('show'); }, 2500); }
  document.addEventListener('mousemove', showBar);
  document.getElementById('board').addEventListener('load', function () {
    try { this.contentWindow.document.addEventListener('mousemove', showBar); } catch (e) {}
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'f' || e.key === 'F') full(); });
  showBar();
  setMode('fit');
</script>
</body>
</html>
`;
mkdirSync(resolve(here, '../dist-board'), { recursive: true });
writeFileSync(resolve(here, '../dist-board/bridge.html'), html);
console.log('dist-board/bridge.html', html.length, 'bytes');

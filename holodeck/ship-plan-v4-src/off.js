const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const m = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);
let timers = [];
global.setTimeout = (fn) => { timers.push(fn); return timers.length; };
global.clearTimeout = () => {};
class DCLogic { constructor(p) { this.props = p || {}; } setState(p) { this.state = Object.assign({}, this.state, typeof p === 'function' ? p(this.state) : p); } }
const Component = new Function('DCLogic', m[1] + '\nreturn Component;')(DCLogic);
const c = new Component({});
const flush = () => { let n = 0; while (timers.length && n < 500) { timers.shift()(); n++; } };
const markup = src.slice(0, src.indexOf('<script type="text/x-dc"'));
if (/<!--/.test(markup)) console.log('HTML COMMENT FOUND');
function get(obj, path) { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj); }
let problems = new Set();
function checkHoles(v, label) {
  const re = /<sc-for\b[^>]*list="\{\{([^}]+)\}\}"[^>]*as="([^"]+)"[^>]*>|<\/sc-for>|<sc-if\b[^>]*value="\{\{([^}]+)\}\}"[^>]*>|<\/sc-if>|\{\{([^}]+)\}\}/g;
  const stack = [{ scope: v }]; let mm; const bad = new Set();
  const dead = () => stack.some(s => s.empty);
  while ((mm = re.exec(markup))) {
    const scope = Object.assign({}, ...stack.map(s => s.scope));
    if (mm[1]) {
      const list = dead() ? [] : get(scope, mm[1].trim());
      if (!dead() && !Array.isArray(list)) bad.add('list ' + mm[1]);
      stack.push({ kind: 'for', scope: { [mm[2]]: Array.isArray(list) && list.length ? list[0] : undefined }, empty: !(Array.isArray(list) && list.length) });
    } else if (mm[0] === '</sc-for>') { const s = stack.pop(); if (s.kind !== 'for') bad.add('nesting for'); }
    else if (mm[3]) {
      const val = dead() ? false : get(scope, mm[3].trim());
      if (!dead() && val === undefined) bad.add('if ' + mm[3]);
      stack.push({ kind: 'if', scope: {}, empty: !val });
    } else if (mm[0] === '</sc-if>') { const s = stack.pop(); if (s.kind !== 'if') bad.add('nesting if'); }
    else {
      if (dead()) continue;
      const p = mm[4].trim(); if (/^(true|false|\d+)$/.test(p)) continue;
      const val = get(scope, p);
      if (val === undefined || (typeof val === 'number' && isNaN(val)) || (typeof val === 'string' && /undefined|NaN/.test(val))) bad.add(p + '=' + val);
    }
  }
  if (stack.length !== 1) bad.add('unbalanced ' + stack.length);
  if (bad.size) { const msg = label + ' UNRESOLVED: ' + [...bad].join(', '); if (!problems.has(msg)) { problems.add(msg); console.log(msg); } }
}
let errs = 0;
c.state = Object.assign({}, c.state);
let v = c.renderVals(); checkHoles(v, 'default');
console.log('labels', v.labelOpts.map(o => o.label + (o.on === 'true' ? '*' : '')).join(' '));
v.labelOpts[2].pick(); flush(); v = c.renderVals(); checkHoles(v, 'off');
const t = v.tiles.find(x => x.line1 === 'Science') || v.tiles[10];
console.log('off: labels', v.labelOpts.map(o => o.label + (o.on === 'true' ? '*' : '')).join(' '), '| text', t.textShow, '| bg', t.bg, '| edge', t.edge, '| slot', t.slotDisplay, '| cap', v.capShow);
v.tiles[3].pick(); flush(); v = c.renderVals(); checkHoles(v, 'off+pick');
const p = v.tiles.find(x => x.on === 'true'); console.log('picked in off: bg', p.bg.slice(0, 40), 'edge', p.edge);
v.labelOpts[0].pick(); flush(); v = c.renderVals(); checkHoles(v, 'back');
console.log('back: text', v.tiles[10].textShow, 'cap', v.capShow, 'problems', problems.size);

const fs = require('fs');
const src = (f) => fs.readFileSync(__dirname + '/src/' + f, 'utf8');
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.147.0/';
const libs = ['build/three.min.js', 'examples/js/shaders/CopyShader.js', 'examples/js/shaders/LuminosityHighPassShader.js', 'examples/js/postprocessing/EffectComposer.js', 'examples/js/postprocessing/RenderPass.js', 'examples/js/postprocessing/ShaderPass.js', 'examples/js/postprocessing/UnrealBloomPass.js', 'examples/js/controls/OrbitControls.js'];
const parts = (process.argv[2] || 'common.js,ship.js,hero.js,deck.js,crew.js,bridge.js,briefing.js,engine.js,comm.js,main.js').split(',');
const js = parts.filter((p) => fs.existsSync(__dirname + '/src/' + p)).map(src).join('\n\n');
const out = src('page.html') + '\n' + libs.map((l) => `<script src="${CDN}${l}"></script>`).join('\n') + '\n<script>\n' + js + '\n</script>\n';
fs.writeFileSync(__dirname + '/hermes-starship.html', out);
// local test wrapper with the same skeleton the artifact host adds
fs.writeFileSync(__dirname + '/test.html', '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>' + out + '</body></html>');
console.log('built', out.length, 'bytes');

/* ═══════════════ boot ═══════════════ */
function boot() {
const lede = $('#hero-lede');
{
  const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const crewOnly = CREW.filter((c) => c.id !== 'captain' && c.id !== 'xo');
  const live = crewOnly.filter((c) => c.status === 'live').length, proposed = crewOnly.filter((c) => c.status === 'proposed').length;
  lede.textContent = `the Captain's agent crew, drawn as the ship it serves on. A captain, a first officer, ${words[live] || live} live stations and ${words[proposed] || proposed} proposed ones, each thinking on one of three rails: local, Codex or Claude.`;
}
if (typeof initHero === 'function') window.__hero = initHero();
if (typeof initDeck === 'function') initDeck();
if (typeof initCrew === 'function') window.__crew = initCrew();
if (typeof initBridge === 'function') initBridge();
if (typeof initBriefing === 'function') initBriefing();
if (typeof initEngines === 'function') initEngines();
if (typeof initNav === 'function') initNav();
if (typeof initComm === 'function') initComm();
}
const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(boot, boot);

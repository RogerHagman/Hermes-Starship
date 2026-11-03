/* ═══════════════ comm badge: one place to approve from anywhere on the ship ═══════════════ */
const AWAITING = [
  { from: 'chief', what: 'Merge the read API pull request', note: 'Codex rail · tests green · customs scan passed' },
  { from: 'sensors', what: 'Run this week’s price watch', note: 'Claude rail · sanitised list, aggregates only' },
];

function initComm() {
  const btn = $('#comm'), panel = $('#comm-panel');
  if (!btn || !panel) return;
  const list = $('#comm-list'), status = $('#comm-status'), num = $('.n', btn);
  list.innerHTML = AWAITING.map((a, i) => {
    const spec = CREW_BY_ID[a.from];
    return `<li data-i="${i}" style="--c:${RAIL[spec.rail].hex}">
      <div class="cw"><i></i>${esc(crewLabel(a.from))}</div>
      <b>${esc(a.what)}</b>
      <span class="note">${esc(a.note)}</span>
      <div class="acts"><button class="btn primary" type="button" data-act="ok">Approve</button><button class="btn" type="button" data-act="later">Later</button></div>
    </li>`;
  }).join('');
  function count() {
    const n = $$('li:not(.done)', list).length;
    status.textContent = n ? `${n} item${n === 1 ? ' awaits' : 's await'} the captain` : 'Nothing awaits the captain';
    btn.dataset.n = String(n); num.textContent = n;
    btn.setAttribute('aria-label', `Comm badge: ${status.textContent}`);
  }
  count();
  let open = false;
  function chirp() { btn.classList.remove('chirp'); void btn.offsetWidth; btn.classList.add('chirp'); }
  function toggle(v = !open) {
    open = v; panel.hidden = !v; btn.setAttribute('aria-expanded', String(v)); chirp();
    if (v) { const first = $('button', panel); first && first.focus({ preventScroll: true }); }
  }
  btn.addEventListener('click', () => toggle());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { toggle(false); btn.focus(); } });
  document.addEventListener('pointerdown', (e) => { if (open && !panel.contains(e.target) && !btn.contains(e.target)) toggle(false); });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const li = b.closest('li'), a = AWAITING[+li.dataset.i];
    const ok = b.dataset.act === 'ok';
    li.classList.add('done'); li.classList.toggle('later', !ok);
    $('.acts', li).innerHTML = `<span class="okay">${ok ? 'Approved · logged' : 'Held for later'}</span>`;
    if (ok && window.shipLog) window.shipLog(`<span class="k">Captain</span> approved: ${esc(a.what.charAt(0).toLowerCase() + a.what.slice(1))} <span class="ok">logged</span>`);
    count();
    const nextBtn = $('li:not(.done) button', list); (nextBtn || btn).focus({ preventScroll: true });
    // the demo refills itself so the badge keeps working
    if (!$$('li:not(.done)', list).length) setTimeout(() => { $$('li', list).forEach((x) => { x.classList.remove('done', 'later'); $('.acts', x).innerHTML = '<button class="btn primary" type="button" data-act="ok">Approve</button><button class="btn" type="button" data-act="later">Later</button>'; }); count(); chirp(); }, 25000);
  });
  // the badge comes aboard once you leave the exterior view
  const hero = $('#exterior');
  let seen = false;
  new IntersectionObserver((ents) => {
    const away = ents[0].intersectionRatio > 0.35;
    btn.classList.toggle('away', away);
    if (away && open) toggle(false);
    if (!away && !seen) { seen = true; setTimeout(chirp, 400); }
  }, { threshold: [0, 0.35, 0.6, 1] }).observe(hero);
}

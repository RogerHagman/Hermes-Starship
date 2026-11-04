// Hermes Starship · Bridge landing page.
//
// Plain JavaScript, no framework and no build step. It reads the fixture files,
// draws the page, and redraws when you pick a rail filter or run a drill.
// Moving around never calls a model: the only requests are for local files.

(function () {
  'use strict';

  // ---------- fixed lookups (design data) ----------

  var RAIL = {
    local:   { label: 'LOCAL',   color: 'var(--rail-local)',   legend: 'Local qwen' },
    codex:   { label: 'CODEX',   color: 'var(--rail-codex)',   legend: 'Codex' },
    claude:  { label: 'CLAUDE',  color: 'var(--rail-claude)',  legend: 'Claude' },
    mixed:   { label: 'MIXED',   color: 'var(--rail-mixed)',   legend: 'Mixed' },
    captain: { label: 'CAPTAIN', color: 'var(--captain)',      legend: 'Captain' }
  };

  var STATUS = {
    live:     { label: 'LIVE',               line: 'solid' },
    approved: { label: 'APPROVED, NOT BUILT', line: 'dashed' },
    proposed: { label: 'PROPOSED',           line: 'dashed' },
    reserved: { label: 'NAME RESERVED',      line: 'dotted' }
  };

  // Rank order decides who acts as department head. Lower number = more senior.
  var RANK = {
    captain: { label: 'Captain', order: 0, officer: true },
    commander: { label: 'Commander', order: 1, officer: true },
    ltcmdr: { label: 'Lieutenant Commander', order: 2, officer: true },
    lt: { label: 'Lieutenant', order: 3, officer: true },
    ltjg: { label: 'Lieutenant junior grade', order: 4, officer: true },
    ensign: { label: 'Ensign', order: 5, officer: true },
    cpo: { label: 'Chief Petty Officer', order: 6, officer: false },
    po: { label: 'Petty Officer', order: 7, officer: false },
    cadet: { label: 'Cadet', order: 8, officer: false },
    none: { label: 'No rank (the computer)', order: 9, officer: false },
    team: { label: 'No rank (a team)', order: 10, officer: false },
    space: { label: 'A place', order: 11, officer: false }
  };

  var DEPT = [
    { id: 'command',  name: 'Command',           uniform: '#e8645c' },
    { id: 'flight',   name: 'Flight Control',    uniform: '#e8645c' },
    { id: 'ops',      name: 'Operations',        uniform: '#e3b24a' },
    { id: 'security', name: 'Security',          uniform: '#e3b24a' },
    { id: 'eng',      name: 'Engineering',       uniform: '#e3b24a' },
    { id: 'holo',     name: 'Holodeck & Design', uniform: '#e3b24a' },
    { id: 'sci',      name: 'Sciences',          uniform: '#5aa4ec' },
    { id: 'med',      name: 'Medical',           uniform: '#5aa4ec' }
  ];

  var DECKS = ['Bridge', 'Command deck', 'Sciences, records & sickbay', 'Holodeck & design',
               'Crew quarters', 'Operations & customs', 'Main engineering', 'Lower decks'];

  // Stations that never take command, whatever their rank.
  var NEVER_COMMANDS = { strategist: true };

  // The other boards. Only the bridge exists in Milestone 0.
  var BOARDS = [
    { id: 'bridge',      label: 'Bridge',             built: true },
    { id: 'deckplan',    label: 'Deck plan',          phase: 'H2' },
    { id: 'sector',      label: 'Sector chart',       phase: 'H2' },
    { id: 'science',     label: 'Science lab',        phase: 'H3' },
    { id: 'sensors',     label: 'Sensor array',       phase: 'H3' },
    { id: 'engineering', label: 'Main Engineering',   phase: 'H3' },
    { id: 'quarters',    label: "Captain's Quarters", phase: 'H4' },
    { id: 'conn',        label: 'Conn handoff',       phase: 'H4' }
  ];

  var SPEEDS_NOTE = 'Speed words set the reasoning level: Thrusters, Impulse, Warp, High Warp, Maximum Warp.';

  // ---------- state ----------

  var data = null;                                  // fixtures, once loaded
  var view = { rail: 'all', drills: {}, selected: null, lastFocus: null };

  // ---------- small helpers ----------

  // h('div', {class: 'x'}, child, 'text') builds an element. Text is always set as
  // text, never as HTML, so fixture strings cannot inject markup.
  function h(tag, attrs) {
    var el = document.createElement(tag);
    var key;
    for (key in attrs || {}) {
      if (attrs[key] === null || attrs[key] === undefined || attrs[key] === false) continue;
      if (key === 'style') el.style.cssText = attrs[key];
      else if (key === 'on') { for (var ev in attrs.on) el.addEventListener(ev, attrs.on[ev]); }
      else el.setAttribute(key, attrs[key] === true ? '' : attrs[key]);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { add(el, c); }); return; }
    el.appendChild(typeof child === 'string' || typeof child === 'number' ? document.createTextNode(String(child)) : child);
  }
  function $(id) { return document.getElementById(id); }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function svgIcon(path, cls) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    if (cls) svg.setAttribute('class', cls);
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', path || 'M12 12h.01');
    svg.appendChild(p);
    return svg;
  }
  function railColor(rail) { return (RAIL[rail] || RAIL.mixed).color; }

  var TZ = 'Europe/Stockholm';
  function clockTime(iso) {
    return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(iso));
  }
  function dayAndTime(iso) {
    return new Intl.DateTimeFormat('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(iso));
  }
  // Ages are measured from the fixture's asOf time, so the page reads the same whenever it is opened.
  function age(iso) {
    var mins = Math.round((new Date(data.ship.asOf) - new Date(iso)) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.floor(mins / 60);
    return hrs + ' h ' + (mins % 60) + ' min ago';
  }

  var toastTimer = null;
  function toast(text) {
    var el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }

  // ---------- ship logic: rails, duty, acting heads ----------

  function railState(id) {
    if (view.drills[id]) return 'out';
    var r = data.rails.rails.find(function (x) { return x.id === id; });
    return r ? r.state : 'up';
  }

  // A station is off duty when a rail it needs is out. Places and the Captain never are.
  function offDuty(st) {
    if (st.kind !== 'station' || st.status !== 'live') return null;
    var down = (st.needs || []).filter(function (r) { return railState(r) === 'out'; });
    if (!down.length) return null;
    return down.map(function (r) { return RAIL[r].legend + ' out'; }).join(', ');
  }

  // When a department head is off duty, the next officer by rank who is on duty acts as head.
  function actingHeads() {
    var acting = {};
    DEPT.forEach(function (d) {
      if (d.id === 'command') return;
      var members = data.stations.stations.filter(function (s) { return s.dept === d.id && s.status === 'live'; });
      var head = members.find(function (s) { return s.head; });
      if (!head || !offDuty(head)) return;
      var next = members
        .filter(function (s) { return !s.head && !offDuty(s) && RANK[s.rank].officer && !NEVER_COMMANDS[s.id]; })
        .sort(function (a, b) { return RANK[a.rank].order - RANK[b.rank].order; })[0];
      acting[d.id] = next ? next.id : 'dark';
    });
    return acting;
  }

  function stationById(id) { return data.stations.stations.find(function (s) { return s.id === id; }); }

  // ---------- drawing ----------

  function drawAll() {
    drawTopbar();
    drawShipLabels();
    drawTiles();
    drawRails();
    drawHails();
    drawOrders();
    drawRoster();
    drawCondition();
  }

  function drawTopbar() {
    var st = data.stations.stations.filter(function (s) { return s.kind !== 'place'; });
    var live = st.filter(function (s) { return s.status === 'live' && !offDuty(s); }).length;
    var up = ['local', 'codex', 'claude'].filter(function (r) { return railState(r) !== 'out'; }).length;
    var hails = data.orders.orders.filter(function (o) { return o.state === 'awaiting-captain'; }).length;
    $('topbar-stats').textContent = st.length + ' CREW · ' + live + ' ON DUTY · ' + up + ' OF 3 RAILS UP · ' + hails + ' HAILS';
  }

  function drawCondition() {
    var anyOut = ['local', 'codex', 'claude'].some(function (r) { return railState(r) === 'out'; });
    var level = anyOut ? 'yellow' : data.ship.condition;
    var el = $('condition');
    el.className = 'condition ' + level;
    el.querySelector('.mono').textContent = 'CONDITION ' + level.toUpperCase();
    el.title = anyOut ? 'A rail is out, so its crew are off duty' : 'All rails up';
  }

  function drawShipLabels() {
    var art = $('ship-art');
    var codexUp = railState('codex') !== 'out';
    var claudeUp = railState('claude') !== 'out';
    var localUp = railState('local') !== 'out';
    art.style.setProperty('--codex-glow', codexUp ? '1' : '0.16');
    art.style.setProperty('--codex-text', codexUp ? '#1a1206' : '#f0a948');
    art.style.setProperty('--claude-glow', claudeUp ? '1' : '0.16');
    art.style.setProperty('--claude-text', claudeUp ? '#1a1206' : '#e889b6');
    art.style.setProperty('--core-glow', localUp ? '1' : '0.18');
    art.style.setProperty('--conduit', localUp ? '0.3' : '0.08');
    art.style.setProperty('--core-text', localUp ? '#9fb0cc' : '#f08a7a');
    setText('lbl-codex', codexUp ? 'CODEX · PORT NACELLE · CHIEF · SYSTEMS · DIAGNOSTICS' : 'CODEX · WINDOW OUT · CREW IN QUARTERS');
    setText('lbl-claude', claudeUp ? 'CLAUDE · STARBOARD NACELLE' : 'CLAUDE · WINDOW OUT');
    setText('lbl-core', localUp ? '◂ WARP CORE · LOCAL QWEN' : '◂ WARP CORE COLD · OLLAMA DOWN');
  }
  function setText(id, text) { var el = $(id); if (el) el.textContent = text; }

  function drawTiles() {
    var box = clear($('ship-tiles'));
    var map = window.SHIP_MAP;
    var acting = actingHeads();
    data.stations.stations.forEach(function (st) {
      var at = map.places[st.id];
      if (!at) return;
      var off = offDuty(st);
      var actingFor = Object.keys(acting).find(function (d) { return acting[d] === st.id; });
      var cls = ['tile'];
      if (st.kind === 'place') cls.push('place');
      if (st.id === 'crewq' || st.id === 'lounge') cls.push('space-wide');
      if (st.status === 'reserved') cls.push('reserved');
      if (off) cls.push('off');
      if (view.rail !== 'all' && st.rail !== view.rail && st.kind !== 'place') cls.push('dim');
      var line = off ? 'OFF · ' + off.toUpperCase()
        : actingFor ? 'ACTING HEAD'
        : st.kind === 'place' ? 'PLACE'
        : st.status === 'live' ? (RAIL[st.rail] || RAIL.mixed).label + (st.activeOrder ? ' · ' + st.activeOrder : '')
        : STATUS[st.status].label;
      var tile = h('button', {
        type: 'button',
        class: cls.join(' '),
        'aria-pressed': view.selected === st.id ? 'true' : 'false',
        'aria-label': st.name + ', ' + line.toLowerCase(),
        style: 'left:' + pct(at.x, map.width) + ';top:' + pct(at.y, map.height) + ';width:' + pct(at.w, map.width) +
               ';--c:' + (st.kind === 'place' ? 'var(--border-strong)' : railColor(st.rail)) + ';--ls:' + STATUS[st.status].line,
        on: { click: function () { openDrawer(st.id); } }
      },
        svgIcon(map.icons[st.id], 'ticon'),
        h('span', { class: 't1' }, st.short),
        h('span', { class: 't2' }, line),
        st.activeOrder && !off ? h('span', { class: 'busy', title: 'Working on ' + st.activeOrder }) : null
      );
      box.appendChild(tile);
    });
  }
  function pct(v, of) { return (v / of * 100).toFixed(3) + '%'; }

  function drawLegend() {
    var box = clear($('legend'));
    ['local', 'codex', 'claude', 'mixed', 'captain'].forEach(function (r) {
      box.appendChild(h('span', null, h('i', { style: '--c:' + RAIL[r].color }), RAIL[r].legend));
    });
    [['solid', 'Live'], ['dashed', 'Approved or proposed'], ['dotted', 'Name reserved']].forEach(function (p) {
      box.appendChild(h('span', null, h('i', { class: 'line', style: '--ls:' + p[0] }), p[1]));
    });
  }

  function drawRails() {
    var box = clear($('rails'));
    $('rails-asof').textContent = 'AS OF ' + clockTime(data.rails.asOf);
    data.rails.rails.forEach(function (r) {
      var state = railState(r.id);
      var drilled = !!view.drills[r.id];
      var meters = r.meters.map(function (m) {
        var pctVal = drilled && m.id !== 'vram' ? 100 : m.percent;
        return [
          h('div', { class: 'meter' },
            h('span', { class: 'meter-label' }, m.label.toUpperCase()),
            h('div', { class: 'bar' + (pctVal >= 80 ? ' hot' : ''), role: 'meter', 'aria-valuenow': pctVal, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': r.label + ' ' + m.label },
              h('b', { style: 'width:' + pctVal + '%' })),
            h('span', { class: 'meter-val' }, pctVal + '%')),
          m.resetsAt ? h('div', { class: 'meter', 'aria-hidden': 'true' }, h('span'), h('span', { class: 'meter-reset' }, 'resets ' + dayAndTime(m.resetsAt))) : null
        ];
      });
      box.appendChild(h('div', { class: 'rail' + (state === 'out' ? ' out' : ''), style: '--c:' + railColor(r.id) },
        h('div', null,
          h('div', { class: 'rail-name' }, r.label, h('span', { class: 'state ' + state }, drilled ? 'DRILL · OUT' : state.toUpperCase())),
          h('div', { class: 'rail-sub' }, r.engine),
          r.burn && r.burn.active && !drilled ? h('div', { style: 'margin-top:6px' }, h('span', { class: 'state burn', title: 'Dilithium Burn: full windows overnight until the weekly reset' }, 'BURN TO ' + dayAndTime(r.burn.until).toUpperCase())) : null
        ),
        h('div', { class: 'meters' }, meters)
      ));
    });
  }

  function orderStation(o) { return stationById(o.station) || { short: o.station, rail: 'mixed' }; }

  function drawHails() {
    var box = clear($('hails'));
    var hails = data.orders.orders.filter(function (o) { return o.state === 'awaiting-captain'; })
      .sort(function (a, b) { return b.tier - a.tier; });
    var count = $('hails-count');
    count.textContent = hails.length;
    count.classList.toggle('zero', hails.length === 0);
    if (!hails.length) { box.appendChild(h('p', { class: 'empty' }, 'Nothing waits for you.')); return; }
    hails.forEach(function (o) {
      var st = orderStation(o);
      box.appendChild(h('div', { class: 'hail', role: 'button', tabindex: '0',
          on: { click: function () { openDrawer(o.station, o.id); }, keydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(o.station, o.id); } } } },
        h('div', { class: 'hail-title' }, o.title),
        h('div', { class: 'hail-meta' },
          h('span', { class: 'idtag' }, o.id),
          h('span', { class: 'railpill', style: '--c:' + railColor(st.rail) }, st.short.toUpperCase()),
          h('span', { class: 'tierpill', style: '--c:var(--tier-' + o.tier + ')' }, 'TIER ' + o.tier),
          h('span', { class: 'idtag' }, age(o.updatedAt))),
        h('div', { class: 'hail-actions' },
          h('button', { type: 'button', class: 'btn btn-ghost', disabled: true, title: 'Arrives in H4' }, 'Deny'),
          h('button', { type: 'button', class: 'btn btn-gold', disabled: true, title: 'Arrives in H4' }, 'Approve'))
      ));
    });
  }

  function drawOrders() {
    var box = clear($('orders'));
    var all = data.orders.orders.filter(function (o) { return o.state !== 'done' && o.state !== 'awaiting-captain'; });
    var parents = all.filter(function (o) { return !o.parent || !all.some(function (p) { return p.id === o.parent; }); });
    var shown = 0;
    $('flight-meta').textContent = all.length + ' ORDERS · ' + SPEEDS_NOTE.split(':')[0].toUpperCase();
    $('flight-meta').title = SPEEDS_NOTE;
    parents.forEach(function (p) {
      [p].concat(all.filter(function (c) { return c.parent === p.id; })).forEach(function (o) {
        var st = orderStation(o);
        var off = stationById(o.station) && offDuty(stationById(o.station));
        var state = off ? 'waiting' : o.state;
        if (view.rail !== 'all' && st.rail !== view.rail) return;
        shown++;
        box.appendChild(h('li', null, h('button', {
            type: 'button', class: 'order' + (o.parent ? ' child' : ''), style: '--c:' + railColor(st.rail),
            on: { click: function () { openDrawer(o.station, o.id); } } },
          h('span', { class: 'idtag' }, o.id),
          h('span', { class: 'order-title' }, o.title),
          h('span', { class: 'statepill ' + state }, off ? 'WAITS · ' + off.toUpperCase() : o.state.toUpperCase()),
          h('span', { class: 'order-sub' }, st.short + ' · ' + (o.speed || '') + ' · ' + age(o.updatedAt))
        )));
      });
    });
    if (!shown) box.appendChild(h('li', { class: 'empty' }, 'No orders in flight on this rail.'));
  }

  function drawRoster() {
    var box = clear($('roster'));
    var acting = actingHeads();
    DEPT.forEach(function (d) {
      var members = data.stations.stations
        .filter(function (s) { return s.dept === d.id; })
        .sort(function (a, b) { return (b.head - a.head) || (RANK[a.rank].order - RANK[b.rank].order); });
      var onDuty = members.filter(function (s) { return s.status === 'live' && !offDuty(s); }).length;
      var note = acting[d.id] === 'dark' ? 'DARK · NO ONE TO ACT' : onDuty + ' OF ' + members.length + ' ON DUTY';
      box.appendChild(h('div', { class: 'dept', style: '--u:' + d.uniform },
        h('div', { class: 'dept-name' }, d.name, h('span', { class: 'mono' + (acting[d.id] === 'dark' ? ' dark' : '') }, note)),
        h('div', { class: 'members' }, members.map(function (s) {
          var off = offDuty(s);
          var cls = 'member' + (s.head ? ' head' : '') + (off ? ' off' : '') + (s.status === 'reserved' ? ' reserved' : '');
          var hide = view.rail !== 'all' && s.rail !== view.rail;
          return h('button', { type: 'button', class: cls, hidden: hide,
              style: '--c:' + railColor(s.rail) + ';--ls:' + STATUS[s.status].line,
              title: s.name + ' · ' + RANK[s.rank].label + (off ? ' · off duty: ' + off : ''),
              on: { click: function () { openDrawer(s.id); } } },
            h('span', { class: 'dot' }), s.short,
            acting[d.id] === s.id ? h('span', { class: 'acting' }, 'ACTING') : null,
            s.head && off ? h('span', { class: 'acting', style: 'color:var(--text-muted)' }, 'OFF') : null);
        }))
      ));
    });
  }

  function drawLog() {
    var box = clear($('log'));
    data.shiplog.entries.forEach(function (e) {
      var st = stationById(e.station);
      box.appendChild(h('li', null,
        h('time', { datetime: e.at }, clockTime(e.at)),
        h('span', { class: 'dot', style: '--c:' + railColor(st ? st.rail : 'mixed') }),
        h('span', null, e.text)));
    });
  }

  function drawBoards() {
    var box = clear($('boards'));
    BOARDS.forEach(function (b) {
      box.appendChild(h('li', null, h('button', {
          type: 'button', class: 'board-btn' + (b.built ? '' : ' not-built'),
          'aria-current': b.built ? 'page' : null,
          on: { click: function () { if (!b.built) toast(b.label + " isn't built yet. It arrives in " + b.phase + '.'); } } },
        h('span', null, b.label), h('span', { class: 'tag' }, b.built ? 'HERE' : b.phase))));
    });
  }

  function drawFilters() {
    var box = clear($('filters'));
    ['all', 'local', 'codex', 'claude', 'mixed'].forEach(function (r) {
      box.appendChild(h('button', { type: 'button', class: 'chip', 'aria-pressed': view.rail === r ? 'true' : 'false',
          style: r === 'all' ? null : '--c:' + RAIL[r].color,
          on: { click: function () { view.rail = r; drawFilters(); drawTiles(); drawOrders(); drawRoster(); } } },
        r === 'all' ? null : h('span', { class: 'dot' }), r === 'all' ? 'All' : RAIL[r].legend));
    });
    var drills = clear($('drills'));
    ['local', 'codex', 'claude'].forEach(function (r) {
      drills.appendChild(h('button', { type: 'button', class: 'chip drill', 'aria-pressed': view.drills[r] ? 'true' : 'false',
          style: '--c:' + RAIL[r].color,
          on: { click: function () {
            view.drills[r] = !view.drills[r];
            drawFilters(); drawAll();
            toast(view.drills[r] ? 'Drill: ' + RAIL[r].legend + ' out. Its crew go to quarters.' : 'Drill over: ' + RAIL[r].legend + ' back up.');
          } } },
        h('span', { class: 'dot' }), RAIL[r].legend));
    });
  }

  // ---------- drawer ----------

  function openDrawer(id, orderId) {
    var st = stationById(id);
    if (!st) return;
    view.lastFocus = document.activeElement;
    view.selected = id;
    var off = offDuty(st);
    var acting = actingHeads();
    var actingFor = Object.keys(acting).find(function (d) { return acting[d] === id; });
    var dept = DEPT.find(function (d) { return d.id === st.dept; });
    $('drawer').style.setProperty('--c', st.kind === 'place' ? 'var(--border-strong)' : railColor(st.rail));
    $('drawer-loc').textContent = 'DECK ' + st.deck + ' · ' + DECKS[st.deck - 1].toUpperCase() + (dept ? ' · ' + dept.name.toUpperCase() : '');
    $('drawer-title').textContent = st.name;
    $('drawer-handle').textContent = st.aliases.length ? 'ALIASES · ' + st.aliases.join(' · ').toUpperCase() : '';

    var pills = clear($('drawer-pills'));
    pills.appendChild(h('span', { class: 'railpill', style: '--c:' + railColor(st.rail) }, (RAIL[st.rail] || RAIL.mixed).label));
    pills.appendChild(h('span', { class: 'railpill', style: '--c:var(--text-label);border-style:' + STATUS[st.status].line }, STATUS[st.status].label));
    pills.appendChild(h('span', { class: 'railpill', style: '--c:var(--text-label)' }, RANK[st.rank].label.toUpperCase()));
    if (off) pills.appendChild(h('span', { class: 'railpill', style: '--c:var(--bad)' }, 'OFF DUTY · ' + off.toUpperCase()));
    if (actingFor) pills.appendChild(h('span', { class: 'railpill', style: '--c:var(--captain)' }, 'ACTING HEAD'));

    var facts = clear($('drawer-facts'));
    [['DUTY', st.duty], ['NOTE', st.note], ['MODEL', st.model], ['PROFILE', st.profile], ['ANSWERS TO', st.answersTo],
     ['NEEDS', (st.needs || []).map(function (r) { return RAIL[r].legend; }).join(' and ')]]
      .forEach(function (f) { if (f[1]) { facts.appendChild(h('dt', null, f[0])); facts.appendChild(h('dd', null, f[1])); } });

    var ordBox = clear($('drawer-order'));
    var oid = orderId || st.activeOrder;
    var o = oid && data.orders.orders.find(function (x) { return x.id === oid; });
    if (o) {
      ordBox.appendChild(h('div', { class: 'drawer-order', style: '--c:var(--tier-' + o.tier + ')' },
        h('span', { class: 'idtag' }, o.id + ' · ' + (off ? 'WAITS, ' + off.toUpperCase() : o.state.toUpperCase()) + ' · TIER ' + o.tier + (o.speed ? ' · ' + o.speed.toUpperCase() : '') + ' · ' + age(o.updatedAt).toUpperCase()),
        h('h3', null, o.title),
        o.detail ? h('p', null, o.detail) : null,
        o.state === 'awaiting-captain' ? h('div', { class: 'drawer-actions' },
          h('button', { type: 'button', class: 'btn btn-ghost', disabled: true }, 'Deny'),
          h('button', { type: 'button', class: 'btn btn-gold', disabled: true }, 'Approve'),
          h('p', { class: 'help' }, 'Read-only for now. Orders arrive with the Captain\'s Quarters board.')) : null));
    }

    $('scrim').hidden = false;
    $('drawer').hidden = false;
    drawTiles();
    $('drawer-close').focus();
  }

  function closeDrawer() {
    if ($('drawer').hidden) return;
    $('drawer').hidden = true;
    $('scrim').hidden = true;
    view.selected = null;
    drawTiles();
    if (view.lastFocus && document.body.contains(view.lastFocus)) view.lastFocus.focus();
  }

  // ---------- clock ----------

  function tick() {
    var now = new Date();
    $('clock-time').textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(now);
    $('clock-sub').textContent = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', timeZone: TZ })
      .format(now).toUpperCase() + ' · STOCKHOLM';
  }

  // ---------- loading ----------

  var FILES = ['ship', 'stations', 'rails', 'orders', 'shiplog'];

  function loadFixtures() {
    if (window.FIXTURES) return Promise.resolve(window.FIXTURES);   // single-file preview build
    return Promise.all(FILES.map(function (name) {
      return fetch('fixtures/' + name + '.json', { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('fixtures/' + name + '.json: ' + r.status);
        return r.json();
      });
    })).then(function (list) {
      var out = {};
      FILES.forEach(function (name, i) { out[name] = list[i]; });
      return out;
    });
  }

  function loadShip() {
    if (window.SHIP_SVG) return Promise.resolve(window.SHIP_SVG);
    return fetch('assets/ship.svg').then(function (r) { return r.text(); });
  }

  function start() {
    tick();
    setInterval(tick, 15000);
    drawBoards();
    drawLegend();
    $('drawer-close').addEventListener('click', closeDrawer);
    $('scrim').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

    Promise.all([loadFixtures(), loadShip()]).then(function (res) {
      data = res[0];
      $('ship-art').innerHTML = res[1];       // our own SVG file, not fixture text
      $('brand-reg').textContent = data.ship.registry + ' · BRIDGE';
      $('deck-label').textContent = data.ship.name.toUpperCase() + ' · ' + data.ship.registry + ' · BRIDGE · SHIP STATUS';
      drawFilters();
      drawAll();
      drawLog();
    }).catch(function (err) {
      $('intro').textContent = 'Could not load the fixtures (' + err.message + '). Serve the page with frontend/serve.py, not from file://.';
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();

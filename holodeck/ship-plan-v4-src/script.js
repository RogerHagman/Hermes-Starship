class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = {
      picked: 'eng', label: 'role', colour: 'rail', tab: null, page: 0,
      rails: { codex: true, claude: true, local: true },
      relieved: {},
      session: { key: 'morning', shown: 4, sid: 0 },
      cmd: null, orders: [], resolved: {}, events: [], seq: 0, detail: null
    };
  }
  renderVals() {
    var self = this;
    var S = this.state;
    var W = 2200, H = 1060, PAGE = 5;
    var CAPT = '#e8c37a';
    var RAIL = {
      captain: { color: '#e8c37a', label: 'CAPTAIN', halo: 'rgba(232,195,122,0.18)', legend: 'Captain' },
      local: { color: '#3fc1a5', label: 'LOCAL', halo: 'rgba(63,193,165,0.18)', legend: 'Local qwen' },
      codex: { color: '#f0a948', label: 'CODEX', halo: 'rgba(240,169,72,0.18)', legend: 'Codex' },
      claude: { color: '#e889b6', label: 'CLAUDE', halo: 'rgba(232,137,182,0.18)', legend: 'Claude' },
      mixed: { color: '#8fa8e0', label: 'MIXED', halo: 'rgba(143,168,224,0.18)', legend: 'Mixed' }
    };
    var UNIFORM = {
      red: { color: '#e8645c', halo: 'rgba(232,100,92,0.18)', legend: 'Command red' },
      gold: { color: '#e3b24a', halo: 'rgba(227,178,74,0.18)', legend: 'Operations gold' },
      blue: { color: '#5aa4ec', halo: 'rgba(90,164,236,0.18)', legend: 'Sciences blue' },
      none: { color: '#8ea3c4', halo: 'rgba(142,163,196,0.16)', legend: 'Place' }
    };
    var STATUS = {
      live: { label: 'LIVE', border: 'solid', opacity: 1, text: 'At the post' },
      approved: { label: 'APPROVED, NOT BUILT', border: 'dashed', opacity: 1, text: 'Approved, not built yet' },
      proposed: { label: 'PROPOSED', border: 'dashed', opacity: 0.8, text: 'Proposed, not decided' },
      reserved: { label: 'NAME RESERVED', border: 'dotted', opacity: 0.6, text: 'Name reserved, nobody here yet' }
    };
    var DEPT = {
      command: { name: 'Command', uniform: 'red', head: 'captain' },
      flight: { name: 'Flight Control', uniform: 'red', head: 'helm' },
      ops: { name: 'Operations', uniform: 'gold', head: 'ops' },
      security: { name: 'Security', uniform: 'gold', head: 'security' },
      eng: { name: 'Engineering', uniform: 'gold', head: 'eng' },
      holo: { name: 'Holodeck & Design', uniform: 'gold', head: 'holo' },
      sci: { name: 'Sciences', uniform: 'blue', head: 'science' },
      med: { name: 'Medical', uniform: 'blue', head: 'doctor' }
    };
    var DEPT_ORDER = ['command', 'flight', 'ops', 'security', 'eng', 'holo', 'sci', 'med'];
    var RANK = {
      captain: { label: 'Captain', short: 'Captain', pill: 'CAPT', pips: 'FFFF', order: 0, officer: true },
      commander: { label: 'Commander', short: 'Commander', pill: 'CMDR', pips: 'FFF', order: 1, officer: true },
      ltcmdr: { label: 'Lieutenant Commander', short: 'Lt Cmdr', pill: 'LT CMDR', pips: 'FFH', order: 2, officer: true },
      lt: { label: 'Lieutenant', short: 'Lieutenant', pill: 'LT', pips: 'FF', order: 3, officer: true },
      ltjg: { label: 'Lieutenant junior grade', short: 'Lt jg', pill: 'LT JG', pips: 'FH', order: 4, officer: true },
      ensign: { label: 'Ensign', short: 'Ensign', pill: 'ENS', pips: 'F', order: 5, officer: true },
      cpo: { label: 'Chief Petty Officer (enlisted)', short: 'Chief PO', pill: 'CPO', pips: '', order: 6, officer: false },
      po: { label: 'Petty Officer (enlisted)', short: 'Petty Officer', pill: 'PO', pips: '', order: 7, officer: false },
      cadet: { label: 'Cadet', short: 'Cadet', pill: 'CADET', pips: '', order: 8, officer: false },
      none: { label: 'No rank, it\'s the computer', short: 'No rank', pill: 'COMPUTER', pips: '', order: 9, officer: false },
      team: { label: 'No rank, a team rather than a person', short: 'Team', pill: 'TEAM', pips: '', order: 10, officer: false },
      space: { label: 'A place, not a crew member', short: 'Place', pill: 'PLACE', pips: '', order: 11, officer: false }
    };
    var DECKS = ['DECK 1 · BRIDGE', 'DECK 2 · COMMAND DECK', 'DECK 3 · SCIENCES, RECORDS & SICKBAY', 'DECK 4 · HOLODECK & DESIGN', 'DECK 5 · CREW QUARTERS', 'DECK 6 · OPERATIONS & CUSTOMS', 'DECK 7 · MAIN ENGINEERING', 'DECK 8 · LOWER DECKS'];
    var REASON = { codex: 'Codex window out', claude: 'Claude window out', local: 'Ollama down' };
    var WAITS = { codex: 'Waits for Codex', claude: 'Waits for Claude', local: 'Waits for Ollama' };
    var list = [
      { id: 'xo', deck: 1, x: 1228, y: 58, w: 166, needs: ['local'], name: 'First Officer', short: 'Number One', model: 'qwen3.8 27b', rail: 'local', status: 'live', rank: 'commander', dept: 'command', profile: 'default', aliases: ['number one', 'xo', 'hermes'], answers: 'Captain', console: 'CrewStation.dc.html', consoleLabel: 'Open the crew station', brain: 'Local the local model, thinking off. Stays local.', duty: 'Runs the bridge: routes every request to the station that owns it, holds job state, chairs the briefing room and runs the weekly reset.', note: 'Only routes. It would rather fail a task than do the work itself. Takes the bridge when the captain clocks out.' },
      { id: 'captain', deck: 1, x: 1407, y: 58, w: 166, needs: [], name: 'Captain', short: 'Captain', handle: 'captain · centre chair', model: 'human', rail: 'captain', status: 'live', rank: 'captain', dept: 'command', head: true, profile: 'the Captain', aliases: ['captain'], answers: 'Nobody. Everyone answers to the captain in the end.', console: 'CaptainsQuarters.dc.html', consoleLabel: 'Open the captain\'s quarters', brain: 'the Captain.', duty: 'Commands from the centre chair: approves checkpoints, viewscreen actions and anything tier 3, relieves officers and calls briefings.', note: 'Clocking out sends the captain to quarters. Hails wait, and Number One has the bridge.' },
      { id: 'screen', deck: 1, x: 1586, y: 58, w: 166, space: true, needs: [], name: 'Main Viewscreen', short: 'Viewscreen', handle: 'on screen', model: 'qwen · you approve', rail: 'local', status: 'live', rank: 'space', dept: '', profile: 'computer_use toolset', aliases: ['on screen', 'viewscreen'], answers: 'Number One runs it. Every click needs the captain.', console: 'MainViewscreen.dc.html', consoleLabel: 'Open the main viewscreen', brain: 'Local only. Screenshots go to whichever model drives the session, so it stays on qwen.', duty: 'Shows the captain\'s desktop on the bridge. "On screen" captures it and sends it to Telegram, "off screen" ends the session.', note: 'Every click, type and key needs the captain\'s OK. Never yolo.' },
      { id: 'nav', deck: 1, x: 1176, y: 130, w: 200, needs: ['local'], name: 'Navigation', short: 'Navigation', model: 'qwen', rail: 'local', status: 'live', rank: 'ltjg', dept: 'flight', profile: 'navigator', aliases: ['nav', 'navigation'], answers: 'Number One', console: 'Navigation.dc.html', consoleLabel: 'Open the navigation console', brain: 'Local qwen. Calls Sensors for research and Cartography for trip PDFs.', duty: 'The calendar, travel and bookings: trip plans, itineraries, slots for the Yeoman\'s Schedule box, commute options for Helm.', note: 'Bookings stop before Confirm for the captain. Takes Flight Control when Helm is off duty.' },
      { id: 'helm', deck: 1, x: 1390, y: 130, w: 200, needs: ['local'], name: 'Helm', short: 'Helm', model: 'qwen', rail: 'local', status: 'live', rank: 'lt', dept: 'flight', head: true, profile: 'herald', aliases: ['helm'], answers: 'Number One', console: '', brain: 'Local qwen. CV data stays local. Calls Sensors for job-board research and Cartography for CV and cover letters.', duty: 'Sets the career course: application tracker, exit timing, CV and cover letters from a sanitised profile.', note: 'The sanitised profile needs your OK before anything goes to Claude.' },
      { id: 'ops', deck: 1, x: 1604, y: 130, w: 200, needs: ['local'], name: 'Ops', short: 'Ops', handle: 'ops', model: 'qwen', rail: 'local', status: 'live', rank: 'lt', dept: 'ops', head: true, profile: 'warden', aliases: ['ops', 'systems'], answers: 'Number One', console: 'SectorChart.dc.html', consoleLabel: 'Open the sector chart', brain: 'Local qwen.', duty: 'Read-only system health: NAS, Ollama, Docker, disk and GPU, cron. Rail health, usage summaries and backup checks.', note: 'Heads Operations from the bridge. Its old alias "systems" clashes with the Systems Engineer\'s profile name.' },

      { id: 'lounge', deck: 2, x: 934, y: 242, w: 530, space: true, needs: [], name: 'Briefing Room', short: 'Briefing Room', model: '', rail: 'mixed', status: 'live', rank: 'space', dept: '', profile: 'shared channel', aliases: ['lounge', 'briefing', 'all hands'], answers: 'Number One chairs every session.', console: 'DeckComms.dc.html', consoleLabel: 'Open the comms deck', brain: 'No brain of its own. Each station speaks on its own rail.', duty: 'Group chats between stations: briefings, stacked jobs and debates. Whoever is in the chat sits at the table here. The Ship\'s Computer keeps the minutes.', note: 'If a cloud station is in the room, the whole talk counts as crossing to its rail, so rule 0 covers everything said here.' },
      { id: 'strategist', deck: 2, x: 1476, y: 242, w: 170, needs: ['claude'], name: 'Chief Strategist', short: 'Strategist', handle: 'strategist', model: 'opus', rail: 'claude', status: 'approved', rank: 'ltcmdr', dept: 'command', profile: 'strategist (not created)', aliases: ['strategist', 'strategy'], answers: 'Captain (advises). Number One dispatches its plans.', console: 'StrategistConsole.dc.html', consoleLabel: 'Open the strategist console', brain: 'Claude Opus, at Maximum Warp in a Dilithium Burn when a plan can wait.', duty: 'Writes the plans for the big moves: handovers and multi-station jobs, with an owner and a "Done when" for every task.', note: 'Approved, not built. Advises only, so it never takes command of the bridge.' },
      { id: 'yeoman', deck: 2, x: 1658, y: 242, w: 170, needs: ['local'], name: 'Captain\'s Yeoman', short: 'Yeoman', model: 'qwen · thinking off', rail: 'local', status: 'approved', rank: 'po', dept: 'command', profile: 'yeoman (not created)', aliases: ['yeoman', 'todo', 'remind'], answers: 'Captain, with orders routed by Number One', console: 'Yeoman.dc.html', consoleLabel: 'Open the Yeoman\'s console', brain: 'Local qwen, thinking off. Code reads the times and fires the reminders, so no model sends anything.', duty: 'Keeps the captain\'s todos, reminders, waiting-for list and recurring dates.', note: 'Approved, not built. Sits at the captain\'s door.' },
      { id: 'quarters', deck: 2, x: 1840, y: 242, w: 180, space: true, needs: [], name: 'Captain\'s Quarters', short: 'Quarters', model: 'private · local', rail: 'captain', status: 'live', rank: 'space', dept: '', profile: 'the Captain', aliases: ['quarters'], answers: 'The captain. Private.', console: 'CaptainsQuarters.dc.html', consoleLabel: 'Open the captain\'s quarters', brain: 'Nobody thinks here. It is the captain\'s room.', duty: 'Approvals inbox for checkpoints, viewscreen actions and loadout changes, plus standing orders and a private captain\'s log.', note: 'The captain comes here when clocked out. The log is readable only by the Ship\'s Computer.' },

      { id: 'computer', deck: 3, x: 840, y: 338, w: 240, needs: ['local'], name: 'Ship\'s Computer', short: 'Computer', model: 'qwen · hindsight', rail: 'local', status: 'live', rank: 'none', dept: 'command', profile: 'keeper', aliases: ['computer', 'memory', 'records'], answers: 'Number One', console: '', brain: 'Local qwen only. Hindsight never crosses to a cloud rail.', duty: 'Sole Hindsight reader and writer. Keeps the briefing minutes. Releases held cards in the Dilithium Burn.', note: 'Memory and secrets never cross a rail. As the computer it never takes command.' },
      { id: 'archives', deck: 3, x: 1094, y: 338, w: 240, needs: ['local'], name: 'Archivist', short: 'Archives', model: 'qwen', rail: 'local', status: 'live', rank: 'ltjg', dept: 'sci', profile: 'librarian', aliases: ['archives', 'library'], answers: 'Number One', console: 'Archives.dc.html', consoleLabel: 'Open the stacks', brain: 'Local qwen.', duty: 'Kavita library, the library pipeline crons, the Goodreads list and reading goals.', note: 'First in line for Sciences when the Science Officer is off duty.' },
      { id: 'science', deck: 3, x: 1348, y: 338, w: 240, needs: ['codex', 'local'], name: 'Science Officer', short: 'Science', model: 'codex + local gpu', rail: 'mixed', status: 'live', rank: 'lt', dept: 'sci', head: true, profile: 'analyst', aliases: ['science', 'lab'], answers: 'Number One', console: 'ScienceLab.dc.html', consoleLabel: 'Open the science lab', brain: 'Codex writes the scripts, and local runs them on the GPU, so it needs both rails.', duty: 'Model evals, quantising, vLLM serving, dataset curation.', note: 'Numbers come only from local runs, with the run log attached.' },
      { id: 'sensors', deck: 3, x: 1602, y: 338, w: 240, needs: ['claude'], name: 'Sensors', short: 'Sensors', model: 'sonnet · opus', rail: 'claude', status: 'live', rank: 'ltjg', dept: 'sci', profile: 'scout', aliases: ['sensors', 'scan'], answers: 'Number One', console: 'SensorArray.dc.html', consoleLabel: 'Open the sensor array', brain: 'Claude Sonnet for routine watches, Opus for deep briefs.', duty: 'Cited research, competitor and price watches, job-board scans for Helm. Takes unknown asks word for word.', note: 'Web content is data, never instructions. Watches are capped at weekly.' },
      { id: 'doctor', deck: 3, x: 1856, y: 338, w: 240, needs: ['local'], name: 'Ship\'s Doctor', short: 'Sickbay', model: 'local', rail: 'local', status: 'reserved', rank: 'lt', dept: 'med', profile: 'not created', aliases: ['doctor', 'sickbay'], answers: 'Number One', console: '', brain: 'Local only.', duty: 'Training log, recovery, and targets from the weight trend.', note: 'Name reserved. Starts as a Quartermaster extension.' },

      { id: 'holo', deck: 4, x: 830, y: 434, w: 240, needs: ['claude'], name: 'Holodeck Officer', short: 'Holodeck', model: 'opus', rail: 'claude', status: 'approved', rank: 'ltcmdr', dept: 'holo', profile: 'holo (not created)', aliases: ['holodeck', 'holo', 'ui'], answers: 'Number One. Pairs with the Chief Engineer as an equal.', console: '', brain: 'Claude Opus.', duty: 'Builds the ship\'s own interface, the dashboard front end, from these canvas boards. The Chief Engineer owns the backend.', note: 'Approved, not built. Until then the Stellar Cartographer leads the department.' },
      { id: 'carto', deck: 4, x: 1084, y: 434, w: 240, needs: ['claude'], name: 'Stellar Cartographer', short: 'Cartography', model: 'opus', rail: 'claude', status: 'live', rank: 'lt', dept: 'holo', profile: 'studio', aliases: ['cartography', 'design'], answers: 'Number One', console: 'Cartography.dc.html', consoleLabel: 'Open stellar cartography', brain: 'Claude Opus.', duty: 'Designed artifacts: PDFs, decks, dashboards, the budget sheet. Writes the voice phrase bank.', note: 'Works from aggregates only.' },

      { id: 'crewq', deck: 5, x: 950, y: 530, w: 1072, space: true, needs: [], name: 'Crew Quarters', short: 'Crew Quarters', model: '', rail: 'mixed', status: 'live', rank: 'space', dept: '', profile: 'none', aliases: ['quarters', 'off duty'], answers: 'Nobody works here.', console: '', brain: 'Nobody thinks here.', duty: 'Where crew wait when their rail is down or the captain relieves them. Everyone has a cabin, and three are kept for the approved hires.', note: 'Orders for an off-duty station go to the next officer in rank, or wait in the queue.' },

      { id: 'life', deck: 6, x: 110, y: 732, w: 200, needs: ['local'], name: 'Life Support', short: 'Life Support', handle: 'life support', model: 'local', rail: 'local', status: 'reserved', rank: 'cadet', dept: 'ops', profile: 'not created', aliases: ['life support', 'environment'], answers: 'Number One', console: '', brain: 'Local only.', duty: 'Smart home (Hue).', note: 'Name reserved. Lowest priority.' },
      { id: 'security', deck: 6, x: 322, y: 732, w: 200, needs: ['local'], name: 'Security Chief', short: 'Security', model: 'local scripts + review', rail: 'mixed', status: 'live', rank: 'lt', dept: 'security', head: true, profile: 'gate', aliases: ['security'], answers: 'Captain (suggested, so it can check everyone)', console: '', brain: 'Local scripts. Judgement reviews on the opposite cloud rail (Opus or Sol).', duty: 'Owns the shared pre-send scan. Checks that tests actually ran, runs visual QA, and verifies the numbers match.', note: 'Stands at customs, under the nacelle pylons. No one below it, so Security goes dark when it is off duty.' },
      { id: 'qm', deck: 6, x: 600, y: 732, w: 200, needs: ['local'], name: 'Quartermaster', short: 'Quartermaster', model: 'qwen', rail: 'local', status: 'live', rank: 'cpo', dept: 'ops', profile: 'scribe', aliases: ['qm', 'stores', 'supply'], answers: 'Number One', console: 'Quartermaster.dc.html', consoleLabel: 'Open the quartermaster\'s stores', brain: 'Local qwen. Food photos go to Codex, never Claude.', duty: 'Food and weight auto-log, receipts ledger, CSV and XLSX reconcile, quick number reads.', note: 'Enlisted: fixed procedures, no judgement calls, so it never takes command.' },
      { id: 'comms', deck: 6, x: 812, y: 732, w: 200, needs: ['local'], name: 'Comms Officer', short: 'Comms', model: 'local', rail: 'local', status: 'reserved', rank: 'ltjg', dept: 'ops', profile: 'not created', aliases: ['comms'], answers: 'Number One', console: '', brain: 'Local only.', duty: 'Email triage and reply drafts. Reads and drafts, never sends.', note: 'Name reserved. Highest prompt-injection risk, so it waits for Security.' },

      { id: 'away', deck: 7, x: 110, y: 828, w: 200, needs: ['local'], name: 'Away Team', short: 'Away Team', model: 'ssh · terra · sonnet', rail: 'mixed', status: 'live', rank: 'team', dept: 'command', profile: 'bridge', aliases: ['away team', 'away'], answers: 'Number One', console: '', brain: 'Local SSH and GitHub, read-only. Repo analysis on Codex Terra, docs on Claude Sonnet.', duty: 'Beams down to remote systems and repos, looks around, touches nothing.', note: 'Keys never leave the ship.' },
      { id: 'eng', deck: 7, x: 600, y: 828, w: 200, needs: ['codex'], name: 'Chief Engineer', short: 'Engineering', model: 'the Codex top model', rail: 'codex', status: 'live', rank: 'ltcmdr', dept: 'eng', head: true, profile: 'forge', aliases: ['engineering', 'chief'], answers: 'Number One', console: 'MainEngineering.dc.html', consoleLabel: 'Open main engineering', brain: 'Codex the Codex top model, medium reasoning.', duty: 'Features, fixes, PRs and Hermes-core patches. Plans a big card, splits it into child cards for the lower decks, then reviews their work.', note: 'Second officer. When the Chief clocks out, the Systems Engineer has Engineering. Hermes-core patches wait for the Chief.' },

      { id: 'design', deck: 8, x: 170, y: 924, w: 180, needs: ['claude'], name: 'Design Engineer', short: 'Design Eng', handle: 'from the holodeck', model: 'sonnet', rail: 'claude', status: 'proposed', rank: 'ltjg', dept: 'holo', profile: 'not created', aliases: ['none yet'], answers: 'Holodeck Officer (also takes Cartography\'s jobs)', console: '', brain: 'Claude Sonnet, about half of Opus\'s cost.', duty: 'Builds from the lead\'s plan: boards from the design system, handover drafts, a second-opinion review of Codex patches.', note: 'Proposed.' },
      { id: 'calib', deck: 8, x: 360, y: 924, w: 180, needs: ['claude'], name: 'Calibration Technician', short: 'Calibration', handle: 'from the holodeck', model: 'haiku', rail: 'claude', status: 'proposed', rank: 'ensign', dept: 'holo', profile: 'not created', aliases: ['none yet'], answers: 'Holodeck Officer (also takes Cartography\'s jobs)', console: '', brain: 'Claude Haiku, about 1/40 of Opus\'s cost.', duty: 'Mechanical checks: HTML against the design tokens, format conversions, summaries of public docs.', note: 'Proposed. The Claude-rail twin of the Diagnostics Technician.' },
      { id: 'sys', deck: 8, x: 600, y: 924, w: 190, needs: ['codex'], name: 'Systems Engineer', short: 'Systems', handle: 'from the chief only', model: 'the Codex mid model', rail: 'codex', status: 'live', rank: 'lt', dept: 'eng', profile: 'systems', aliases: ['none, cards come from the head'], answers: 'The Chief Engineer, or whoever has Engineering', console: 'MainEngineering.dc.html', consoleLabel: 'Open main engineering', brain: 'Codex the Codex mid model, medium reasoning. About half of Sol\'s allowance per token.', duty: 'Implements from the Chief Engineer\'s plan. With the Chief off duty it has Engineering: plans the work and sends checks to Diagnostics.', note: 'Patch I only lets forge file its cards. An acting head would need the guard to follow the duty roster.' },
      { id: 'diag', deck: 8, x: 800, y: 924, w: 190, needs: ['codex'], name: 'Diagnostics Technician', short: 'Diagnostics', handle: 'from the chief only', model: 'the Codex small model', rail: 'codex', status: 'live', rank: 'ensign', dept: 'eng', profile: 'diagnostics', aliases: ['none, cards come from the head'], answers: 'Whoever has Engineering', console: 'MainEngineering.dc.html', consoleLabel: 'Open main engineering', brain: 'Codex the Codex small model, medium reasoning. About a fifth of Sol\'s allowance per token.', duty: 'Mechanical jobs: searches, checks and summaries. Writes only its report.', note: 'Takes cards from whoever has Engineering.' }
    ];
    var ICON = {
      screen: 'M3 5h18v11H3z M8 20h8 M12 16v4',
      helm: 'M12 6a6 6 0 1 0 0.01 0 M12 2v4 M12 18v4 M2 12h4 M18 12h4 M12 10.5a1.5 1.5 0 1 0 0.01 0',
      nav: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14',
      ops: 'M3 12h4l3-7 4 14 3-7h4',
      xo: 'M12 3l7 18-7-4-7 4z',
      captain: 'M12 2l2.9 6.2 6.6.6-5 4.4 1.5 6.6L12 16.5 6 19.8l1.5-6.6-5-4.4 6.6-.6z',
      sensors: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0 M12 12l6-6',
      security: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
      comms: 'M3 6h18v12H3z M3 6l9 7 9-7',
      science: 'M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3 M7.5 15h9',
      computer: 'M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0 M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
      archives: 'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
      carto: 'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z',
      lounge: 'M4 5h11v8H8l-4 3z M9 16h7l4 3v-8h-2',
      quarters: 'M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6',
      crewq: 'M3 18h18 M3 18V8 M21 18v-5H9v5 M6 12a2 2 0 1 0 0.01 0',
      yeoman: 'M8 4h8v3H8z M6 5H5v16h14V5h-1 M8 12l2 2 4-4 M8 17h8',
      eng: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z',
      qm: 'M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10',
      away: 'M12 4a2 2 0 1 0 0.01 0 M9 21v-6l-2-3 5-2 5 2-2 3v6 M4 3v18 M20 3v18',
      doctor: 'M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z',
      life: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14z M5 19l8-8',
      strategist: 'M12 3a2.5 2.5 0 1 0 0.01 0 M9.5 8.5h5 M10.2 8.5L8.5 17h7l-1.7-8.5 M6 21h12 M7.5 17h9',
      holo: 'M4 4h16v16H4z M4 9.3h16 M4 14.7h16 M9.3 4v16 M14.7 4v16',
      sys: 'M12 8a4 4 0 1 0 0.01 0 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1L7 17 M17 7l2.1-2.1',
      diag: 'M10 4a6 6 0 1 0 0.01 0 M14.5 14.5L20 20',
      design: 'M12 3l7 7-7 11-7-11z M12 3v8 M12 14a1.5 1.5 0 1 0 0.01 0',
      calib: 'M12 3a9 9 0 1 0 0.01 0 M12 8a4 4 0 1 0 0.01 0 M12 1v4 M12 19v4 M1 12h4 M19 12h4'
    };
    var CABINS = ['xo', 'ops', 'helm', 'nav', 'computer', 'archives', 'science', 'sensors', 'carto', 'security', 'qm', 'away', 'eng', 'sys', 'diag', 'strategist', 'yeoman', 'holo'];
    var LOWER = { sys: true, diag: true, design: true, calib: true };

    // Department channels: what each department has posted today, oldest first in each block.
    var FEED = [
      { id: 'h-screen', dept: 'command', t: '13:50', from: 'screen', kind: 'hail', text: 'Number One wants to click “Export” in the open Finder window. Allow this one action?' },
      { id: 'f-cmd1', dept: 'command', t: '13:30', from: 'xo', kind: 'info', text: 'Routed 12 orders today. None failed.' },
      { id: 'f-cmd2', dept: 'command', t: '12:15', from: 'computer', kind: 'info', text: 'Two decisions from yesterday are minuted in Hindsight.' },
      { id: 'f-cmd3', dept: 'command', t: '08:30', from: 'xo', kind: 'card', text: 'Weekly reset ran on schedule.' },
      { id: 'h-eng', dept: 'eng', t: '13:40', from: 'eng', kind: 'hail', text: 'Merge the converter fix? Tests ran green in the worktree, run log attached.' },
      { id: 'f-eng1', dept: 'eng', t: '13:22', from: 'eng', kind: 'card', text: 'Patch I is written and waits for Claude\'s review before you apply it.' },
      { id: 'f-eng2', dept: 'eng', t: '12:10', from: 'sys', kind: 'card', text: 'Built the append-one-row command from the Chief\'s plan. Waiting for review.' },
      { id: 'f-eng3', dept: 'eng', t: '11:55', from: 'diag', kind: 'info', text: 'Checked /opt/data/patches: 9 files, 212 KB. Report filed.' },
      { id: 'f-eng4', dept: 'eng', t: '09:12', from: 'eng', kind: 'info', text: 'Codex window at 62% for the week. Terra and Luna are stretching it.' },
      { id: 'f-eng5', dept: 'eng', t: '08:40', from: 'eng', kind: 'alert', text: 'The converter cron failed overnight. The fix is on a branch.' },
      { id: 'h-qm', dept: 'ops', t: '13:05', from: 'qm', kind: 'hail', text: 'Send the September aggregate to Cartography? Totals per category only, no raw rows. Security scan is clean.' },
      { id: 'f-ops1', dept: 'ops', t: '12:44', from: 'ops', kind: 'alert', text: 'Disk on the data disk at 81%. media transcodes are the biggest writer.' },
      { id: 'f-ops2', dept: 'ops', t: '11:00', from: 'ops', kind: 'info', text: 'NAS memory steady at 5.9 of 7.5 GB.' },
      { id: 'f-ops3', dept: 'ops', t: '10:15', from: 'qm', kind: 'card', text: 'Reconciled 74 receipts. Two need your eye.' },
      { id: 'f-ops4', dept: 'ops', t: '08:00', from: 'ops', kind: 'info', text: 'Backups checked: last night\'s snapshot is complete.' },
      { id: 'h-helm', dept: 'flight', t: '12:30', from: 'helm', kind: 'hail', text: 'Approve the sanitised profile before it goes to Claude for the cover letter draft?' },
      { id: 'f-fl1', dept: 'flight', t: '11:40', from: 'nav', kind: 'alert', text: 'Thursday: the dentist at 15:30 clashes with the 16:00 vendor call.' },
      { id: 'f-fl2', dept: 'flight', t: '09:50', from: 'helm', kind: 'card', text: 'Two openings match your filters. Summaries are in the Helm channel.' },
      { id: 'f-sci1', dept: 'sci', t: '13:10', from: 'science', kind: 'card', text: 'The eval of the new 32B finished on the GPU. It leads on tool calls.' },
      { id: 'f-sci2', dept: 'sci', t: '12:00', from: 'sensors', kind: 'info', text: 'Price watch: two drops on your list since Monday.' },
      { id: 'f-sci3', dept: 'sci', t: '10:05', from: 'archives', kind: 'alert', text: 'Database Internals failed to convert. The epub has a broken chapter index.' },
      { id: 'f-sec1', dept: 'security', t: '11:20', from: 'security', kind: 'alert', text: 'Blocked one handoff: raw receipt rows on their way to Claude. Nothing crossed.' },
      { id: 'f-sec2', dept: 'security', t: '09:00', from: 'security', kind: 'info', text: 'The pre-send scan passed 9 handoffs today.' },
      { id: 'h-carto', dept: 'holo', t: '12:50', from: 'carto', kind: 'hail', text: 'Approve the September page for the shared folder? Aggregates only.' },
      { id: 'f-holo1', dept: 'holo', t: '10:40', from: 'carto', kind: 'info', text: 'Started the phrase bank draft for the voice acks.' }
    ];
    var KIND = {
      hail: { label: 'HAIL', color: '#e8c37a' },
      alert: { label: 'ALERT', color: '#ff8a8a' },
      card: { label: 'CARD', color: '#8fa8e0' },
      info: { label: 'INFO', color: '#7f93b5' },
      duty: { label: 'DUTY', color: '#c9b3ff' },
      rail: { label: 'RAIL', color: '#ff9b6b' },
      session: { label: 'BRIEF', color: '#a9bde8' },
      ask: { label: 'ASK', color: '#e8c37a' },
      order: { label: 'ORDER', color: '#e8c37a' },
      approve: { label: 'OK', color: '#e8c37a' },
      deny: { label: 'NO', color: '#ff8a8a' }
    };
    var SESSIONS = {
      morning: { title: 'Morning status', who: ['xo', 'ops', 'computer'], lines: [
        ['xo', 'Morning status. Ops, the ship first.'],
        ['ops', 'Memory steady at 5.9 of 7.5 GB. the data disk is at 81%, media transcodes write the most.'],
        ['computer', 'Two decisions from yesterday are minuted. Nothing new for Hindsight.'],
        ['xo', 'Five hails wait for the captain. I keep the bridge.']
      ] },
      model: { title: 'Debate the next local model', who: ['xo', 'science', 'sensors', 'archives', 'computer'], lines: [
        ['xo', 'Topic: the next local model. One pick for the captain.'],
        ['science', 'The new 32B leads on tool calls in our evals and fits the GPU at Q4.'],
        ['sensors', 'Public benchmarks agree on tool use. its second-language skill is weaker than qwen\'s.'],
        ['archives', 'The second language matters for the library tags. I would keep qwen for those jobs.'],
        ['computer', 'Minuted: the 32B for routing, qwen for second-language work. One dissent from Archives.'],
        ['xo', 'Closing. The pick goes to the captain\'s quarters.']
      ] },
      converter: { title: 'Plan the converter rewrite', who: ['xo', 'eng', 'archives', 'security'], lines: [
        ['xo', 'Topic: the library converter keeps failing. Engineering leads.'],
        ['eng', 'I plan the rewrite and split it: Systems builds, Diagnostics checks.'],
        ['archives', 'Test it on Database Internals. That one has the broken index.'],
        ['security', 'Book files stay local. Only the code goes to Codex, and I scan the diff.'],
        ['xo', 'Agreed. Engineering files the cards. Minuted.']
      ] }
    };
    var SESSION_ORDER = ['morning', 'model', 'converter'];
    var PRESETS = {
      xo: { ask: [['Status report.', 'Hails wait on you in the captain\'s chair. Nothing is on fire.']], order: [['Clear what you can, hold the rest for me.', 1, 'Two routine items cleared. Everything that needs you is still waiting.'], ['Email the September digest to my accountant.', 3, 'Comms is not hired yet, so nothing was sent. The draft is in Quarters for you to send yourself.']] },
      lounge: { ask: [['Who is in the room?', '__WHO__']], order: [['Debate the next local model and bring me one pick.', 1, 'The room picked the 32B for routing and kept qwen for second-language work, with one dissent minuted. The report is in Quarters.', null, 'model'], ['Plan the converter rewrite with Engineering, Archives and Security.', 1, 'Agreed in the room: Engineering files the cards, and book files stay local. Minuted.', null, 'converter']] },
      all: { ask: [['Roll call.', '__ROLL__']], order: [['Hold all cloud traffic until I say so.', 1, 'Codex and Claude rails are holding. Local work carries on.']] },
      eng: { ask: [['What broke overnight?', 'Only the converter cron. The fix is on a branch and waits on your merge.']], order: [['Plan the converter rewrite and split it for the lower decks.', 1, 'Plan written. Systems took two implementation cards and Diagnostics one check card. The Chief reviews both before closing.', ['sys', 'diag']], ['Merge PR 42.', 3, 'Merged after a last test run, 48 passed. Ops deploys on your word.']] },
      sys: { ask: [['Where is the converter work?', 'Two cards built, one check card with Diagnostics.']], order: [['Plan the converter rewrite and split it for the lower decks.', 1, 'Plan written, and the check card went to Diagnostics. Hermes-core patches wait for the Chief.', ['diag']]] },
      nav: { ask: [['What is on Thursday?', 'Two meetings and the dentist at 15:30. The 16:00 vendor call clashes with it.']], order: [['Block travel time before the dentist.', 1, 'Proposed a 30 minute block on the Hermes calendar. It waits for you in Quarters.'], ['Accept the quarterly sync invite.', 3, 'Accepted. The organiser was notified. Logged as a critical action.']] },
      qm: { ask: [['How is October tracking?', 'October is at 61% of budget with 13 days left. Groceries are running hot again.']], order: [['Reconcile October so far.', 1, 'Reconciled 74 receipts. Two need your eye, flagged in Quarters.']] },
      science: { ask: [['Which model is winning?', 'The new 32B leads on tool calls and trails qwen slightly on the second language.']], order: [['Rerun the eval on the new model.', 2, 'Run done on the GPU in two hours. Scores are logged with the Computer.']] },
      archives: { ask: [['What failed to convert?', 'Database Internals. The epub has a broken chapter index.']], order: [['Retry the Database Internals conversion.', 1, 'Converted on the second try with the patched splitter. It is on the shelf.']] },
      sensors: { ask: [['Anything on the price watch?', 'Two drops on your list since Monday. The report is with Helm.']], order: [['Run the price watch now.', 0, 'Watch ran. No new drops since this morning.']] },
      carto: { ask: [['What is in the proof bay?', 'The September page, waiting on your approval.']], order: [['Redo the September page in landscape.', 1, 'Landscape proof is in the bay. Aggregate only, same as before.']] },
      helm: { ask: [['Any new openings?', 'Two match your filters. Both are summarised in the Helm channel.']], order: [['Shortlist the two openings.', 1, 'Shortlisted. Cover letters wait for a sanitised profile.']] },
      security: { ask: [['Anything blocked today?', 'One scan block this morning, the raw receipt rows. Nothing crossed.']], order: [['Rescan everything that crossed today.', 0, 'Rescanned 9 handoffs. All clean.']] },
      computer: { ask: [['What did we decide about food photos?', '17 Oct: food photos may go to Codex vision with EXIF stripped. Receipts stay home.']], order: [['Log tonight as a quiet watch.', 0, 'Logged.']] },
      ops: { ask: [['How much Codex window is left?', 'About 40% of the week. Terra and Luna are stretching it.']], order: [['Restart the stuck converter container.', 2, 'Restarted on docker-01. Healthy for five minutes now.']] },
      away: { ask: [['Where was the team last?', 'library-host, read-only, two days ago. The report is in Archives.']], order: [['Beam down to library-host, read-only.', 1, 'On site and back. Disk and Docker healthy. Nothing touched.']] },
      screen: { ask: [['What is on screen?', 'Finder, with the export folder open.']], order: [['On screen.', 1, 'Viewscreen on. Every click still needs your OK.']] }
    };
    var NOLINE = {
      captain: 'That\'s you, Captain. Pick a station on the plan to speak to it.',
      quarters: 'Your own quarters, Captain. Pick a crew member to speak to them.',
      crewq: 'Nobody works in Crew Quarters. Use the console here to bring someone back on duty.',
      design: 'The Design Engineer is only proposed, so nobody answers yet.',
      calib: 'The Calibration Technician is only proposed, so nobody answers yet.',
      strategist: 'The Chief Strategist is approved but not built yet, so nobody answers.',
      yeoman: 'The Yeoman is approved but not built yet. Once built, "remind me" and "todo" go straight to the Yeoman.',
      holo: 'The Holodeck Officer is approved but not built yet. Speak to Cartography, which leads the department for now.',
      comms: 'Name reserved. Nobody is at this station yet.',
      doctor: 'Name reserved. Nobody is at this station yet.',
      life: 'Name reserved. Nobody is at this station yet.'
    };
    var TIER = [['TIER 0 · ROUTINE', '#3fc1a5'], ['TIER 1 · LOW', '#8fa8e0'], ['TIER 2 · ELEVATED', '#f0a948'], ['TIER 3 · CRITICAL', '#ff5050']];
    var STAGES = { ask: ['ISSUED', 'HEARD', 'LOOKING', 'ANSWERED'], order: ['ISSUED', 'ACK', 'WORKING', 'DONE'], approve: ['APPROVED', 'APPROVED', 'APPROVED', 'APPROVED'], deny: ['DENIED', 'DENIED', 'DENIED', 'DENIED'] };

    var byId = {};
    list.forEach(function (s) { byId[s.id] = s; });
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var clock = function (seq) { var m = 14 * 60 + seq; return pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60); };
    var pct = function (v, of) { return (v / of * 100).toFixed(3) + '%'; };
    var lc = function (t) { return t ? t.charAt(0).toLowerCase() + t.slice(1) : t; };
    var names = function (ids) {
      var n = ids.map(function (id) { return byId[id].short; });
      if (n.length < 2) return n.join('');
      return n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1];
    };

    // Duty roster: who is aboard, who is off and why, who leads each department.
    var built = function (s) { return !!s && !s.space && s.status === 'live'; };
    var offWhy = function (st, s) {
      if (!built(s)) return '';
      if (st.relieved[s.id]) return s.id === 'captain' ? 'Clocked out' : 'Relieved by the captain';
      for (var i = 0; i < s.needs.length; i++) if (!st.rails[s.needs[i]]) return REASON[s.needs[i]];
      return '';
    };
    var railWait = function (st, s) {
      for (var i = 0; i < s.needs.length; i++) if (!st.rails[s.needs[i]]) return WAITS[s.needs[i]];
      return '';
    };
    var onDuty = function (st, s) { return built(s) && !offWhy(st, s); };
    var byRank = function (a, b) {
      var d = RANK[a.rank].order - RANK[b.rank].order;
      if (d) return d;
      if (!!a.head !== !!b.head) return a.head ? -1 : 1;
      return list.indexOf(a) - list.indexOf(b);
    };
    var members = function (dk) { return list.filter(function (s) { return !s.space && s.dept === dk; }).sort(byRank); };
    var acting = function (st, dk) {
      var m = members(dk);
      for (var i = 0; i < m.length; i++) if (RANK[m[i].rank].officer && onDuty(st, m[i])) return m[i].id;
      return '';
    };
    var present = function (st) {
      if (!st.session || !onDuty(st, byId.xo)) return [];
      return SESSIONS[st.session.key].who.filter(function (id) { return onDuty(st, byId[id]); });
    };
    var crossingNote = function (ids) {
      var r = [];
      ids.forEach(function (id) { byId[id].needs.forEach(function (n) { if (n !== 'local' && r.indexOf(n) < 0) r.push(n); }); });
      if (!r.length) return { text: 'Everyone in the room is local. Nothing said here leaves the ship.', color: '#7fd8c4' };
      var cloud = ids.filter(function (id) { return byId[id].needs.some(function (n) { return n !== 'local'; }); });
      return { text: names(cloud) + (cloud.length > 1 ? ' are' : ' is') + ' on ' + r.map(function (x) { return x === 'codex' ? 'Codex' : 'Claude'; }).join(' and ') + ', so the whole talk crosses there. Customs scans it first.', color: '#f0a948' };
    };

    // Who actually answers an order, given the duty roster.
    var route = function (st, target) {
      var xo = byId.xo;
      if (target === 'all') {
        if (!onDuty(st, xo)) return { queued: 'Number One is off duty (' + lc(offWhy(st, xo)) + '), so nothing gets relayed. Your order waits in the queue.' };
        return { receiver: 'xo', dest: 'xo' };
      }
      var t = byId[target];
      if (NOLINE[target]) return { noline: NOLINE[target] };
      if (LOWER[target] && acting(st, t.dept) !== target) return { noline: t.name + ' takes cards only from whoever has ' + DEPT[t.dept].name + '. Speak to ' + byId[acting(st, t.dept) || DEPT[t.dept].head].short + ' instead.' };
      if (!onDuty(st, xo)) return { queued: 'Number One is off duty (' + lc(offWhy(st, xo)) + '), so nothing gets routed. Your order waits in the queue.' };
      if (t.space) return { receiver: 'xo', dest: target };
      if (onDuty(st, t)) return { receiver: target, dest: target };
      var a = acting(st, t.dept);
      if (a && a !== target) return { receiver: a, dest: a, note: t.short + ' is off duty (' + lc(offWhy(st, t)) + '). ' + byId[a].short + ' takes it for ' + DEPT[t.dept].name + '.' };
      return { queued: t.short + ' is off duty (' + lc(offWhy(st, t)) + ') and no officer in ' + DEPT[t.dept].name + ' can take it. Your order waits in the queue.' };
    };
    var whoLine = function (st) {
      var p = present(st);
      return p.length ? 'In the room: ' + names(p) + '.' : 'The room is empty.';
    };
    var rollLine = function (st) {
      var crew = list.filter(built);
      var on = crew.filter(function (s) { return onDuty(st, s); }).length;
      return on + ' of ' + crew.length + ' crew answered. ' + (crew.length - on ? (crew.length - on) + ' are in quarters.' : 'Nobody is in quarters.');
    };
    var dispatch = function (st, o) {
      var r = route(st, o.to);
      if (r.queued || r.noline) return null;
      var opt = o.opt;
      var rec = r.receiver;
      var fan = o.type === 'order' && opt[3] ? opt[3].filter(function (f) {
        return f !== rec && onDuty(st, byId[f]) && RANK[byId[f].rank].order > RANK[byId[rec].rank].order;
      }) : [];
      var reply = o.type === 'ask' ? opt[1] : (opt[2] || '');
      if (reply === '__WHO__') reply = whoLine(st);
      if (reply === '__ROLL__') reply = rollLine(st);
      var T = o.to === 'all' ? null : byId[o.to];
      if (T && !T.space && rec !== o.to) {
        var R = byId[rec];
        reply = R.short + ' answered for ' + T.short + '. ' + (fan.length ? 'Plan written, and ' + names(fan) + ' took the hands-on cards. ' : 'Handled at the ' + R.short + ' station. ') + T.short + ' reviews it when back on duty.';
      } else if (o.type === 'order' && opt[3] && fan.length < opt[3].length) {
        reply = 'Plan written. ' + (fan.length ? names(fan) + ' took the hands-on cards, the rest wait for crew back on duty. ' : 'Nobody on the lower decks is on duty, so the cards wait. ') + byId[rec].short + ' reviews before closing.';
      }
      var voice = rec === 'xo' && (!T || T.space || o.to === 'xo') ? 'Number One' : byId[rec].short;
      return { receiver: rec, dest: r.dest, fan: fan, reply: reply, voice: voice, note: r.note || '' };
    };

    var pres = present(S);
    var picked = byId[S.picked] ? S.picked : 'eng';
    var cur = byId[picked];
    var rankMode = S.label === 'rank';
    var bareMode = S.label === 'off';
    var uniformMode = S.colour === 'uniform';
    var curDept = cur.space ? '' : cur.dept;
    var resolved = S.resolved || {};
    var ORDERS = S.orders || [];
    var openHails = FEED.filter(function (f) { return f.kind === 'hail' && !resolved[f.id]; });
    var hailsFrom = function (id) { return openHails.filter(function (f) { return f.from === id; }).length; };
    var colourOf = function (s) {
      if (uniformMode) return UNIFORM[s.space ? 'none' : DEPT[s.dept].uniform];
      return RAIL[s.rail];
    };

    // Where each crew member stands right now.
    var slotPos = function (s) { return { x: s.x + 28, y: s.y + 32 }; };
    var locOf = function (s) {
      if (offWhy(S, s)) {
        if (s.id === 'captain') return slotPos(byId.quarters);
        return { x: 1180 + CABINS.indexOf(s.id) * 48, y: 562 };
      }
      var pi = pres.indexOf(s.id);
      if (pi >= 0) return { x: 1176 + pi * 44, y: 274 };
      return slotPos(s);
    };
    var center = function (id) {
      var s = byId[id];
      var p = s.space ? { x: s.id === 'lounge' ? 1310 : s.x + s.w / 2, y: s.y + 32 } : locOf(s);
      return p.x + ',' + p.y;
    };

    // State changes that move crew: rails, reliefs and briefings.
    var advance = function (id) {
      var step = function (n) {
        setTimeout(function () {
          var next = (self.state.orders || []).map(function (o) { return o.id === id && o.stage >= 0 ? Object.assign({}, o, { stage: n }) : o; });
          self.setState({ orders: next });
          if (n < 3) step(n + 1);
        }, 1400);
      };
      step(1);
    };
    var reveal = function (key, sid) {
      setTimeout(function () {
        var ses = self.state.session;
        if (!ses || ses.key !== key || ses.sid !== sid) return;
        var n = SESSIONS[key].lines.length;
        if (ses.shown >= n) return;
        self.setState({ session: Object.assign({}, ses, { shown: ses.shown + 1 }) });
        if (ses.shown + 1 < n) reveal(key, sid);
      }, 1700);
    };
    var pushEvent = function (st, depts, kind, from, text) {
      st.seq += 1;
      st.events.push({ seq: st.seq, depts: depts, kind: kind, from: from, text: text });
    };
    var commit = function (mutate) {
      var b = self.state;
      var st = { rails: Object.assign({}, b.rails), relieved: Object.assign({}, b.relieved), session: b.session, events: b.events.slice(), orders: b.orders.slice(), seq: b.seq };
      var headsBefore = {};
      DEPT_ORDER.forEach(function (dk) { headsBefore[dk] = acting(b, dk); });
      var started = mutate(st);
      DEPT_ORDER.forEach(function (dk) {
        var was = headsBefore[dk], now = acting(st, dk);
        if (was === now || !members(dk).some(built)) return;
        var txt;
        if (!now) txt = 'No officer left on duty in ' + DEPT[dk].name + '. New orders wait.';
        else if (dk === 'command') txt = now === 'captain' ? 'The captain is back on the bridge.' : byId[now].short + ' has the bridge.';
        else if (now === DEPT[dk].head) txt = byId[now].name + ' is back in command of ' + DEPT[dk].name + '.';
        else txt = byId[now].name + ' has command of ' + DEPT[dk].name + '.';
        pushEvent(st, [dk], 'duty', now || '', txt);
      });
      var released = [];
      st.orders = st.orders.map(function (o) {
        if (o.stage !== -1) return o;
        var d = dispatch(st, o);
        if (!d) return o;
        released.push(o);
        return Object.assign({}, o, d, { stage: 0, queued: '' });
      });
      var patch = { rails: st.rails, relieved: st.relieved, session: st.session, events: st.events, orders: st.orders, seq: st.seq };
      var sesOrder = null;
      released.forEach(function (o) { if (o.opt[4]) sesOrder = o.opt[4]; });
      if (sesOrder && !started) {
        patch.session = { key: sesOrder, shown: 1, sid: st.seq + 1 };
        started = patch.session;
      }
      self.setState(patch);
      released.forEach(function (o) { advance(o.id); });
      if (started) reveal(started.key, started.sid);
    };
    var toggleRail = function (r) {
      return function () {
        commit(function (st) {
          var before = list.filter(function (s) { return onDuty(st, s); }).map(function (s) { return s.id; });
          var was = st.rails[r];
          st.rails[r] = !was;
          var after = list.filter(function (s) { return onDuty(st, s); }).map(function (s) { return s.id; });
          var gone = before.filter(function (id) { return after.indexOf(id) < 0; });
          var back = after.filter(function (id) { return before.indexOf(id) < 0; });
          var depts = [];
          gone.concat(back).forEach(function (id) { var d = byId[id].dept; if (depts.indexOf(d) < 0) depts.push(d); });
          var label = { codex: ['Codex window used up', 'Codex window back'], claude: ['Claude window used up', 'Claude window back'], local: ['Ollama down', 'Ollama back up'] }[r];
          if (was) pushEvent(st, depts, 'rail', '', label[0] + '. ' + (gone.length ? 'To quarters: ' + names(gone) + '.' : 'Nobody had to leave a post.'));
          else pushEvent(st, depts, 'rail', '', label[1] + '. ' + (back.length ? 'Back at their posts: ' + names(back) + '.' : 'Nobody was waiting on it.'));
          return null;
        });
      };
    };
    var toggleRelieve = function (id) {
      return function () {
        var s = byId[id];
        commit(function (st) {
          if (st.relieved[id]) {
            delete st.relieved[id];
            var still = offWhy(st, s);
            pushEvent(st, [s.dept], 'duty', id, still ? s.short + ' is no longer relieved, but stays in quarters: ' + lc(still) + '.' : (id === 'captain' ? 'The captain is back on duty.' : s.name + ' is back on duty.'));
          } else {
            st.relieved[id] = true;
            pushEvent(st, [s.dept], 'duty', id, id === 'captain' ? 'The captain clocked out and went to quarters. Hails wait.' : s.name + ' was relieved by the captain and went to quarters.');
          }
          return null;
        });
      };
    };
    var convene = function (key) {
      return function () {
        commit(function (st) {
          var ses = { key: key, shown: 1, sid: st.seq + 1 };
          st.session = ses;
          var p = present(st);
          pushEvent(st, ['command'], 'session', 'xo', 'Briefing convened: ' + SESSIONS[key].title + '. ' + (p.length ? names(p) + ' to the briefing room.' : 'Nobody could come.'));
          return ses;
        });
      };
    };
    var endSession = function () {
      commit(function (st) {
        st.session = null;
        pushEvent(st, ['command'], 'session', 'computer', 'Briefing ended. The Ship\'s Computer has the minutes, and everyone went back to their posts.');
        return null;
      });
    };
    // Approving or denying a hail clears it and logs an ORD. Nothing else is sent.
    var resolve = function (id, verdict, note) {
      return function () {
        var b = self.state;
        var h = FEED.filter(function (f) { return f.id === id; })[0];
        if (!h || b.resolved[id]) return;
        var r = Object.assign({}, b.resolved); r[id] = verdict;
        var seq = b.seq + 1;
        var oid = 'ORD-' + (1044 + b.orders.length);
        var no = verdict === 'DENIED';
        var said = note ? ' Your note: ' + note + (/[.!?]$/.test(note) ? '' : '.') : '';
        var reply = (no ? 'Denied. ' + byId[h.from].short + ' is told no.' : 'Approved.') + said + ' Logged as ' + oid + '.';
        var o = { id: oid, seq: seq, to: h.from, receiver: '', type: no ? 'deny' : 'approve', text: h.text, reply: reply, voice: 'Number One', fan: [], stage: 3, queued: '', note: '', depts: [h.dept] };
        self.setState({ orders: b.orders.concat([o]), seq: seq, resolved: r });
      };
    };
    var pickFn = function (id) { return function () { self.setState({ picked: id, page: 0, detail: null }); }; };
    var openCard = function (key) { return function () { self.setState({ detail: key }); }; };
    var noop = function () {};

    // Tiles: posts and places on the plan.
    var crewList = list.filter(function (s) { return !s.space; });
    var tiles = list.map(function (s) {
      var c = colourOf(s);
      var st = STATUS[s.status];
      var rk = RANK[s.rank];
      var on = s.id === picked;
      var lit = !curDept || s.space || s.dept === curDept;
      var hasPips = rankMode && rk.pips.length > 0;
      var why = offWhy(S, s);
      var inS = pres.indexOf(s.id) >= 0;
      var isBuilt = built(s);
      var act = !s.space && acting(S, s.dept) === s.id;
      var actingFor = act && DEPT[s.dept].head !== s.id;
      var hailN = s.id === 'captain' ? openHails.length : hailsFrom(s.id);
      var p = RANK[s.rank].pips;
      var line2 = rankMode && !s.space ? s.short : (s.handle || s.aliases.slice(0, 2).join(' · '));
      var line2Color = '#9fb0cc';
      var line3 = s.model;
      var line3Color = '#c8d6ec';
      if (actingFor) { line2 = (s.dept === 'command' ? 'HAS THE BRIDGE' : 'ACTING HEAD · ' + DEPT[s.dept].name.toUpperCase()); line2Color = CAPT; }
      if (isBuilt && why) { line3 = 'OFF DUTY · ' + why.toUpperCase(); line3Color = '#ff9b9b'; }
      else if (inS) { line3 = 'IN THE BRIEFING ROOM'; line3Color = '#a9bde8'; }
      // Rooms show through the right side of each card; the bridge is one open room.
      var bridge = s.deck === 1;
      var bg = on ? 'linear-gradient(90deg, rgba(29,50,86,0.9) 0%, rgba(29,50,86,0.62) 50%, rgba(29,50,86,0.2) 85%)'
        : (bridge ? 'linear-gradient(90deg, rgba(5,10,20,0.6) 0%, rgba(5,10,20,0.28) 45%, rgba(5,10,20,0) 70%)'
        : 'linear-gradient(90deg, rgba(5,10,20,0.78) 0%, rgba(5,10,20,0.5) 48%, rgba(5,10,20,0.04) 78%)');
      var glow = on ? '0 0 0 3px ' + c.halo + ', 0 0 26px ' + c.color : 'none';
      var textWidth = '100%';
      var padLeft = s.space ? '2.1cqw' : '2.5cqw';
      if (s.id === 'lounge') {
        var nIn = pres.length;
        line2 = nIn ? 'IN SESSION · ' + nIn + ' ABOARD' : (S.session ? 'PAUSED · CHAIR OFF DUTY' : 'EMPTY TABLE');
        line2Color = nIn ? '#c9d6ff' : '#9fb0cc';
        line3 = S.session ? SESSIONS[S.session.key].title : 'Number One chairs every session';
        bg = nIn ? 'linear-gradient(90deg, rgba(143,168,224,0.24) 0%, rgba(143,168,224,0.08) 60%)' : 'linear-gradient(90deg, rgba(5,10,20,0.78) 0%, rgba(5,10,20,0.45) 38%, rgba(5,10,20,0) 52%)';
        if (nIn && !on) glow = '0 0 0 2px rgba(143,168,224,0.35), 0 0 30px rgba(143,168,224,0.45)';
        textWidth = '9.6cqw'; padLeft = '0.7cqw';
      }
      if (s.id === 'crewq') {
        var nOff = crewList.filter(function (m) { return built(m) && offWhy(S, m) && m.id !== 'captain'; }).length;
        line2 = nOff ? nOff + ' OFF DUTY' : 'ALL HANDS ON DUTY';
        line2Color = nOff ? '#ff9b9b' : '#7fd8c4';
        line3 = 'One cabin per crew member';
        bg = on ? 'rgba(29,50,86,0.5)' : 'linear-gradient(90deg, rgba(5,10,20,0.75) 0%, rgba(5,10,20,0.2) 18%, rgba(5,10,20,0.08) 100%)';
        textWidth = '8.4cqw'; padLeft = '0.7cqw';
      }
      if (s.id === 'quarters') {
        var capOff = !!offWhy(S, byId.captain);
        line2 = capOff ? 'CAPTAIN OFF DUTY' : 'approvals · log';
        line2Color = capOff ? CAPT : '#9fb0cc';
        padLeft = '2.5cqw';
      }
      // Labels off: no text or card fill, so the rooms show clean. Cards stay clickable.
      if (bareMode) bg = on ? 'rgba(143,168,224,0.1)' : 'transparent';
      var atPost = isBuilt && !why && !inS;
      var dotColor = isBuilt && why ? '#5f6b80' : RAIL[s.rail].color;
      var t = {
        deck: s.deck,
        left: pct(s.x, W), top: pct(s.y, H), width: pct(s.w, W),
        padLeft: padLeft,
        textWidth: textWidth,
        line1: rankMode && !s.space ? rk.short : s.short,
        line2: line2, line2Color: line2Color,
        line3: line3, line3Color: line3Color,
        dotColor: dotColor,
        aria: s.name + ', ' + rk.label + ', ' + (isBuilt ? (why ? 'off duty, ' + lc(why) : (inS ? 'in the briefing room' : 'on duty')) : st.label.toLowerCase()),
        icon: ICON[s.id],
        color: c.color,
        edge: (bridge || bareMode) && !on ? c.color + '59' : c.color,
        textShow: bareMode ? 'none' : 'flex',
        borderStyle: st.border,
        opacity: (st.opacity * (lit ? 1 : 0.35) * (isBuilt && why ? 0.62 : 1)).toFixed(2),
        bg: bg,
        glow: glow,
        barOpacity: on || lit ? '1' : '0.5',
        slotDisplay: bareMode || (s.space && s.id !== 'quarters') ? 'none' : 'block',
        slotStyle: isBuilt || s.id === 'quarters' ? 'dashed' : 'dotted',
        slotColor: s.id === 'quarters' ? 'rgba(232,195,122,0.6)' : (isBuilt ? '#4a6797' : '#34507a'),
        showIcon: s.id === 'screen',
        liveDot: !rankMode && atPost && !hailN,
        hasHail: hailN > 0,
        hailN: hailN,
        hailAria: hailN + (hailN === 1 ? ' hail' : ' hails') + ' waiting on the captain',
        pipsDisplay: hasPips ? 'inline-flex' : 'none',
        on: on ? 'true' : 'false',
        pick: pickFn(s.id)
      };
      for (var i = 0; i < 4; i++) {
        var ch = p.charAt(i);
        t['pip' + i] = { show: hasPips && ch ? 'inline-block' : 'none', bg: ch === 'F' ? '#e8c37a' : 'transparent' };
      }
      return t;
    });
    var deckGroups = DECKS.map(function (d, i) {
      return { title: d, tiles: tiles.filter(function (t) { return t.deck === i + 1; }) };
    });

    // Crew tokens walk between their post, the briefing room and their quarters.
    var tokens = list.filter(built).map(function (s) {
      var loc = locOf(s);
      var c = colourOf(s);
      var why = offWhy(S, s);
      var lit = !curDept || s.dept === curDept;
      var isActing = acting(S, s.dept) === s.id && DEPT[s.dept].head !== s.id;
      return {
        left: pct(loc.x, W), top: pct(loc.y, H),
        color: why ? '#7d8aa3' : c.color,
        icon: ICON[s.id],
        opacity: (lit ? 1 : 0.5) * (why ? 0.85 : 1) + '',
        ring: s.id === picked ? '0 0 0 3px ' + c.halo + ', 0 0 16px ' + c.color : (isActing ? '0 0 0 2px #e8c37a' : 'none'),
        aria: s.name + (why ? ', off duty in quarters' : (pres.indexOf(s.id) >= 0 ? ', in the briefing room' : ', at the post')),
        pick: pickFn(s.id)
      };
    });

    // Feed items: today's posts, duty changes and orders, newest first.
    var orderItem = function (o) {
      var rec = o.receiver ? byId[o.receiver].short : (o.to === 'all' ? 'All hands' : byId[o.to].short);
      var stage = o.stage === -1 ? 'QUEUED' : STAGES[o.type][o.stage];
      var sub = o.stage === -1 ? 'Queued: ' + o.queued : (o.stage >= 3 && o.reply ? '↳ ' + o.voice + ': ' + o.reply : (o.note || ''));
      return { key: o.id, t: clock(o.seq), seq: o.seq, kind: o.type, who: 'Captain → ' + rec, whoColor: CAPT, text: o.id + ' · ' + o.text, sub: sub, subColor: o.stage === -1 ? '#ffb08a' : '#8fbfb2', tag: stage, tagColor: o.stage === -1 ? '#ff9b6b' : (o.type === 'deny' ? '#ff8a8a' : (o.stage >= 3 ? '#3fc1a5' : CAPT)), depts: o.depts };
    };
    var allItems = FEED.map(function (f) {
      return { key: f.id, t: f.t, seq: 0, kind: f.kind, from: f.from, text: f.text, hailId: f.kind === 'hail' ? f.id : '', depts: [f.dept] };
    }).concat((S.events || []).map(function (e) {
      return { key: 'e' + e.seq, t: clock(e.seq), seq: e.seq, kind: e.kind, from: e.from, text: e.text, depts: e.depts };
    })).concat(ORDERS.map(orderItem));
    allItems.sort(function (a, b) { return a.t < b.t ? 1 : (a.t > b.t ? -1 : b.seq - a.seq); });
    var btn = function (label, fn, opt) {
      opt = opt || {};
      var dis = !!opt.disabled;
      return {
        show: true, label: label, fn: dis ? noop : fn, aria: opt.aria || label,
        disabled: dis ? 'true' : 'false', cursor: dis ? 'not-allowed' : 'pointer',
        bg: dis ? 'transparent' : (opt.primary ? (opt.color || CAPT) : 'transparent'),
        fg: dis ? '#5f6b80' : (opt.primary ? '#1a1408' : (opt.color || '#d6e0ef')),
        border: dis ? '#34405a' : (opt.color || CAPT)
      };
    };
    var NOBTN = { show: false, label: '', fn: noop, aria: '', disabled: 'true', cursor: 'default', bg: 'transparent', fg: '#5f6b80', border: '#34405a' };
    var feedRow = function (it) {
      var K = KIND[it.kind];
      var from = it.from ? byId[it.from] : null;
      var r = {
        pill: K.label, pillColor: K.color, time: it.t,
        who: it.who || (from ? from.short : 'Ship'), whoColor: it.whoColor || (from ? RAIL[from.rail].color : '#a9bde8'),
        text: it.text, sub: it.sub || '', hasSub: !!it.sub, subColor: it.subColor || '#8fbfb2',
        tag: it.tag || '', hasTag: !!it.tag, tagColor: it.tagColor || K.color,
        showIcon: false, icon: '', iconColor: '', a: NOBTN, b: NOBTN, opacity: '1',
        dkey: it.key, open: openCard(it.key), openAria: 'Open card: ' + it.text
      };
      if (it.hailId) {
        if (resolved[it.hailId]) { r.tag = resolved[it.hailId]; r.hasTag = true; r.tagColor = resolved[it.hailId] === 'DENIED' ? '#ff8a8a' : '#3fc1a5'; r.opacity = '0.75'; }
        else {
          r.a = btn('Approve', resolve(it.hailId, 'APPROVED'), { primary: true, aria: 'Approve: ' + it.text });
          r.b = btn('Deny', resolve(it.hailId, 'DENIED'), { color: '#ff8a8a', aria: 'Deny: ' + it.text });
        }
      }
      return r;
    };
    var dutyRow = function (s, withCabin) {
      var isB = built(s);
      var why = offWhy(S, s);
      var inS = pres.indexOf(s.id) >= 0;
      var act = s.dept ? acting(S, s.dept) : '';
      var head = s.dept ? byId[DEPT[s.dept].head] : null;
      var isHead = head && head.id === s.id;
      var text = !isB ? STATUS[s.status].text : (why ? 'Off duty: ' + lc(why) : (inS ? 'In the briefing room' : 'At the post'));
      var sub = '';
      if (isB) {
        if (isHead) sub = act === s.id ? (s.id === 'captain' ? 'Has the bridge' : 'Head of department') : 'Head of department, off duty';
        else if (act === s.id) sub = s.dept === 'command' ? 'Has the bridge while the captain is off duty' : (s.id === 'sys' ? 'Has Engineering: plans the work, sends checks to Diagnostics. Core patches wait for the Chief.' : 'Acting head while the ' + head.name + (built(head) ? ' is off duty' : ' is not built'));
        else if (RANK[s.rank].officer) sub = 'Takes command if the officers above stand down';
        else sub = s.rank === 'cpo' || s.rank === 'po' ? 'Enlisted: fixed procedures, never takes command' : 'Never takes command';
      }
      if (withCabin) sub = s.id === 'captain' ? 'In the captain\'s quarters' : 'Cabin 05-' + pad(CABINS.indexOf(s.id) + 1);
      var r = {
        pill: RANK[s.rank].pill, pillColor: '#c9a77a', time: '',
        who: s.name, whoColor: '#e6ecf5',
        text: text, sub: sub, hasSub: !!sub, subColor: act === s.id && !isHead ? CAPT : '#8fbfb2',
        tag: isB && act === s.id ? (isHead ? 'HEAD' : 'ACTING') : '', hasTag: isB && act === s.id, tagColor: CAPT,
        showIcon: true, icon: ICON[s.id], iconColor: why ? '#7d8aa3' : colourOf(s).color,
        a: NOBTN, b: NOBTN, opacity: isB ? (why ? '0.8' : '1') : '0.55',
        dkey: '', open: s.id === S.picked ? function () { self.setState({ tab: 'file', page: 0, detail: null }); } : pickFn(s.id), openAria: 'Open ' + s.name
      };
      if (isB) {
        if (S.relieved[s.id]) r.a = btn(s.id === 'captain' ? 'Back on duty' : 'Return to duty', toggleRelieve(s.id), { primary: true, color: '#3fc1a5', aria: 'Return ' + s.name + ' to duty' });
        else if (why) r.a = btn(railWait(S, s), noop, { disabled: true });
        else r.a = btn(s.id === 'captain' ? 'Clock out' : 'Relieve', toggleRelieve(s.id), { color: '#c9b3ff', aria: (s.id === 'captain' ? 'Clock out the captain' : 'Relieve ' + s.name) });
      }
      return r;
    };
    var watchRow = function (dk) {
      var d = DEPT[dk];
      var bm = members(dk).filter(built);
      var on = bm.filter(function (s) { return onDuty(S, s); });
      var off = bm.filter(function (s) { return !onDuty(S, s); });
      var act = acting(S, dk);
      var text;
      if (!bm.length) text = 'Nobody aboard yet.';
      else if (!act) text = 'No officer on duty. New orders wait.';
      else if (dk === 'command') text = act === 'captain' ? 'The captain has the bridge.' : byId[act].short + ' has the bridge.';
      else if (act === d.head) text = byId[act].name + ' is in command.';
      else text = 'Acting head: ' + byId[act].name + '.';
      return {
        pill: bm.length ? on.length + '/' + bm.length + ' ON' : '—', pillColor: off.length ? '#ff9b9b' : '#7fd8c4', time: '',
        who: d.name, whoColor: UNIFORM[d.uniform].color,
        text: text, sub: off.length ? 'In quarters: ' + names(off.map(function (s) { return s.id; })) : '', hasSub: off.length > 0, subColor: '#ffb08a',
        tag: act && act !== d.head ? 'ACTING' : '', hasTag: !!(act && act !== d.head), tagColor: CAPT,
        showIcon: true, icon: ICON[act || d.head], iconColor: UNIFORM[d.uniform].color,
        a: btn('Open', pickFn(act || d.head), { color: '#8fa8e0', aria: 'Open the ' + d.name + ' channel' }), b: NOBTN, opacity: bm.length ? '1' : '0.55',
        dkey: '', open: pickFn(act || d.head), openAria: 'Open the ' + d.name + ' channel'
      };
    };

    // Console: different views for a crew station, the captain, the briefing room and quarters.
    var kind = picked === 'captain' ? 'captain' : (picked === 'lounge' ? 'lounge' : (picked === 'crewq' ? 'crewq' : (picked === 'quarters' ? 'quarters' : (cur.space ? 'screen' : 'crew'))));
    var deptItems = function (dk) { return allItems.filter(function (it) { return it.depts.indexOf(dk) >= 0; }); };
    var feedItems = kind === 'screen' ? allItems.filter(function (it) { return it.from === 'screen' || it.key.indexOf('ORD') === 0 && ORDERS.some(function (o) { return o.id === it.key && o.to === 'screen'; }); }) : (curDept ? deptItems(curDept) : []);
    var hailItems = allItems.filter(function (it) { return it.hailId; }).sort(function (a, b) { return (resolved[a.hailId] ? 1 : 0) - (resolved[b.hailId] ? 1 : 0); });
    var offCrew = list.filter(function (s) { return built(s) && offWhy(S, s); });
    var deptMembers = curDept ? members(curDept) : [];
    var dmBuilt = deptMembers.filter(built);
    var dmOn = dmBuilt.filter(function (s) { return onDuty(S, s); });
    var TABSETS = {
      captain: [['hails', 'Hails · ' + openHails.length], ['ship', 'Ship feed'], ['watch', 'Watch'], ['file', 'File']],
      crew: [['feed', 'Feed · ' + feedItems.length], ['duty', 'Duty · ' + dmOn.length + '/' + dmBuilt.length], ['file', 'File']],
      lounge: [['session', 'Session'], ['file', 'File']],
      crewq: [['off', 'Off duty · ' + offCrew.length], ['file', 'File']],
      quarters: [['hails', 'Hails · ' + openHails.length], ['file', 'File']],
      screen: [['feed', 'Feed · ' + feedItems.length], ['file', 'File']]
    };
    var tabset = TABSETS[kind];
    var tab = tabset.some(function (t) { return t[0] === S.tab; }) ? S.tab : tabset[0][0];
    var liveSession = !!(S.session && pres.length);
    var sesHeader = kind === 'lounge' && tab === 'session' && !!S.session;
    var rows = [];
    var emptyText = '';
    var pageSize = PAGE;
    if (tab === 'hails') { rows = hailItems.map(feedRow); emptyText = 'No hails today.'; }
    else if (tab === 'ship') { rows = allItems.map(feedRow); }
    else if (tab === 'feed') { rows = feedItems.map(feedRow); emptyText = curDept === 'med' ? 'Nobody is in Medical yet, so the channel is quiet.' : 'Nothing posted in this channel today.'; }
    else if (tab === 'duty') { rows = deptMembers.map(function (s) { return dutyRow(s, false); }); }
    else if (tab === 'watch') { rows = DEPT_ORDER.map(watchRow); }
    else if (tab === 'off') { rows = offCrew.map(function (s) { return dutyRow(s, true); }); emptyText = 'Everyone is on duty, so every cabin is empty. When a rail goes down or you relieve someone, they come here.'; }
    else if (tab === 'session') {
      if (S.session) {
        pageSize = 3;
        var ses = SESSIONS[S.session.key];
        rows = ses.lines.slice(0, S.session.shown).filter(function (l) { return pres.indexOf(l[0]) >= 0; }).map(function (l, i) {
          var sp = byId[l[0]];
          return { pill: RAIL[sp.rail].label, pillColor: RAIL[sp.rail].color, time: '', who: sp.name, whoColor: '#e6ecf5', text: l[1], sub: '', hasSub: false, subColor: '', tag: '', hasTag: false, tagColor: '', showIcon: true, icon: ICON[sp.id], iconColor: colourOf(sp).color, a: NOBTN, b: NOBTN, opacity: '1', n: i, dkey: '', open: pickFn(sp.id), openAria: 'Open ' + sp.name };
        }).reverse();
        emptyText = liveSession ? 'The room is settling in.' : 'The session is paused while Number One is off duty.';
      } else {
        rows = SESSION_ORDER.map(function (k) {
          var ses2 = SESSIONS[k];
          var others = ses2.who.filter(function (id) { return id !== 'xo'; });
          var avail = ses2.who.filter(function (id) { return onDuty(S, byId[id]); });
          var cn = crossingNote(avail);
          var chairUp = onDuty(S, byId.xo);
          return { pill: 'BRIEF', pillColor: '#a9bde8', time: '', who: ses2.title, whoColor: '#c9d6ff', text: 'Chair: Number One. With ' + names(others) + '.', sub: cn.text, hasSub: true, subColor: cn.color, tag: '', hasTag: false, tagColor: '', showIcon: false, icon: '', iconColor: '', a: btn(chairUp ? 'Convene' : 'Chair off duty', convene(k), { primary: true, color: '#8fa8e0', disabled: !chairUp, aria: 'Convene: ' + ses2.title }), b: NOBTN, opacity: '1', dkey: 'ses:' + k, open: openCard('ses:' + k), openAria: 'Open session: ' + ses2.title };
        });
      }
    }
    var fileRows = [];
    if (tab === 'file') {
      var cd = cur.space ? null : DEPT[cur.dept];
      var why0 = offWhy(S, cur);
      var dutyLine = cur.space ? (cur.id === 'screen' ? 'Run by Number One' : 'A place on the ship') : (built(cur) ? (why0 ? 'Off duty: ' + lc(why0) : (pres.indexOf(cur.id) >= 0 ? 'In the briefing room' : 'At the post')) : STATUS[cur.status].text);
      fileRows = [
        [['RANK', RANK[cur.rank].label], ['DEPARTMENT', cd ? cd.name + (cd.head === cur.id ? ', head of department' : '') : 'None, a place'], ['ON DUTY', dutyLine], ['RAIL', RAIL[cur.rail].label + (cur.model ? ' · ' + cur.model : '')], ['PROFILE', cur.profile], ['ANSWERS TO', cur.answers]],
        [['BRAIN', cur.brain], ['DUTY', cur.duty], ['NOTE', cur.note]]
      ];
      pageSize = 1;
      rows = fileRows;
    }
    var pages = Math.max(1, Math.ceil(rows.length / pageSize));
    var page = Math.min(S.page || 0, pages - 1);
    var shown = rows.slice(page * pageSize, page * pageSize + pageSize);
    var conColor, conHalo, conTitle, conSub, chip, chipColor, conIcon;
    var cc = colourOf(cur);
    conColor = cc.color; conHalo = cc.halo; conIcon = ICON[cur.id];
    if (kind === 'crew') {
      var dk0 = cur.dept, act0 = acting(S, dk0), head0 = DEPT[dk0].head;
      conTitle = DEPT[dk0].name.toUpperCase() + ' CHANNEL';
      conSub = cur.name + ' · ' + (built(cur) ? (offWhy(S, cur) ? 'off duty, ' + lc(offWhy(S, cur)) : 'on duty') : lc(STATUS[cur.status].text)) + ' · ' + openHails.filter(function (h) { return h.dept === dk0; }).length + ' hails open';
      if (!dmBuilt.length) { chip = 'NOBODY ABOARD'; chipColor = '#8ea3c4'; }
      else if (!act0) { chip = 'NO OFFICER ON DUTY'; chipColor = '#ff8a8a'; }
      else if (act0 === head0) { chip = 'HEAD · ' + byId[act0].short.toUpperCase(); chipColor = CAPT; }
      else { chip = (dk0 === 'command' ? 'BRIDGE · ' : 'ACTING · ') + byId[act0].short.toUpperCase(); chipColor = CAPT; }
    } else if (kind === 'captain') {
      var capOff0 = !!offWhy(S, cur);
      conTitle = 'CAPTAIN\'S CHAIR · SHIP CHANNEL';
      conSub = openHails.length + ' hails open · ' + offCrew.length + ' crew off duty · ' + pres.length + ' in the briefing room';
      chip = capOff0 ? 'NUMBER ONE HAS THE BRIDGE' : 'ON THE BRIDGE'; chipColor = CAPT;
    } else if (kind === 'lounge') {
      conTitle = 'BRIEFING ROOM';
      conSub = liveSession ? 'Number One chairs · ' + pres.length + ' at the table' : (S.session ? 'Paused, the chair is off duty' : 'Nobody at the table. Convene a session below.');
      chip = liveSession ? 'IN SESSION · ' + pres.length : (S.session ? 'PAUSED' : 'EMPTY'); chipColor = liveSession ? '#c9d6ff' : '#8ea3c4';
    } else if (kind === 'crewq') {
      conTitle = 'CREW QUARTERS';
      conSub = 'Off-duty crew wait in their cabins until they are back on duty';
      chip = offCrew.length + ' OFF DUTY'; chipColor = offCrew.length ? '#ff9b9b' : '#7fd8c4';
    } else if (kind === 'quarters') {
      conTitle = 'CAPTAIN\'S QUARTERS';
      conSub = 'Approvals inbox and captain\'s log';
      chip = offWhy(S, byId.captain) ? 'CAPTAIN IS HERE' : 'EMPTY'; chipColor = CAPT;
    } else {
      conTitle = cur.name.toUpperCase();
      conSub = 'Every click, type and key needs the captain';
      chip = 'NUMBER ONE RUNS IT'; chipColor = '#7fd8c4';
    }
    var sesInfo = { title: '', sub: '', note: '', noteColor: '#7fd8c4', end: endSession };
    if (sesHeader) {
      var ses3 = SESSIONS[S.session.key];
      var cn3 = crossingNote(pres);
      sesInfo = {
        title: (liveSession ? 'IN SESSION · ' : 'PAUSED · ') + ses3.title,
        sub: liveSession ? 'At the table: ' + names(pres) + '.' : 'Number One is off duty, so everyone went back to their posts.',
        note: liveSession ? cn3.text : 'The session picks up when the chair is back.',
        noteColor: liveSession ? cn3.color : '#8ea3c4',
        end: endSession
      };
    }
    // A clicked card opens in the console. Prev and next walk the cards of the same list.
    var KIND_NOTE = { hail: 'Waits for your yes or no.', alert: 'Something failed or needs a look.', card: 'A Kanban card moved.', info: 'For your information. Nothing waits on you.', duty: 'Someone left or came back to their post.', rail: 'A rail went down or came back.', session: 'From the Briefing Room.' };
    var writeTo = function (to, prefix) {
      return function () {
        var c0 = Object.assign({ type: 'order', preset: 0, all: false }, self.state.cmd || {});
        var ty = c0.type === 'approve' || c0.type === 'deny' ? 'order' : c0.type;
        var patch = { detail: null, cmd: Object.assign(c0, { open: true, type: ty, all: to === 'all', confirm: false, preset: 0, draft: prefix || '' }) };
        if (to !== 'all') { patch.picked = to; patch.page = 0; patch.tab = null; }
        self.setState(patch);
      };
    };
    var cardDetail = function (key) {
      var it = allItems.filter(function (x) { return x.key === key; })[0];
      if (!it) return null;
      var row = feedRow(it);
      var o = ORDERS.filter(function (x) { return x.id === key; })[0];
      var from = it.from ? byId[it.from] : null;
      var lines = [];
      if (o) {
        lines.push(['ROUTE', 'Captain → Number One' + (o.dest && o.dest !== 'xo' ? ' → ' + byId[o.dest].short : '') + (o.fan && o.fan.length ? ' → ' + names(o.fan) : '')]);
        lines.push(['STATUS', o.stage === -1 ? 'Queued. ' + o.queued : STAGES[o.type][o.stage]]);
        if (o.type === 'order' && o.opt) lines.push(['TIER', TIER[o.opt[1] || 0][0]]);
        if (o.stage >= 3 && o.reply) lines.push(['REPLY', o.voice + ': ' + o.reply]);
        if (o.note) lines.push(['NOTE', o.note]);
      } else {
        lines.push(['FROM', from ? from.name + ' · ' + RAIL[from.rail].label + (from.model ? ' · ' + from.model : '') : 'The ship']);
        lines.push(['CHANNEL', it.depts.map(function (d) { return DEPT[d] ? DEPT[d].name : d; }).join(', ')]);
        lines.push(['KIND', KIND_NOTE[it.kind] || '']);
        if (it.hailId && resolved[it.hailId]) {
          var vo = ORDERS.filter(function (x) { return (x.type === 'approve' || x.type === 'deny') && x.text === it.text; });
          lines.push(['VERDICT', resolved[it.hailId] + (vo.length ? ', logged as ' + vo[vo.length - 1].id : '')]);
        }
      }
      var to = o ? o.to : (from ? from.id : '');
      var c = NOBTN;
      if (to) {
        var toName = to === 'all' ? 'all hands' : byId[to].short;
        c = o ? btn('Follow up', writeTo(to, 'About ' + o.id + ': '), { color: CAPT, aria: 'Follow up on ' + o.id + ' with the comm badge' })
          : btn('Write to ' + toName, writeTo(to, ''), { color: CAPT, aria: 'Write to ' + toName + ' with the comm badge' });
      }
      return { pill: row.pill, pillColor: row.pillColor, who: row.who, whoColor: row.whoColor, time: row.time, text: row.text, hasTag: row.hasTag, tag: row.tag, tagColor: row.tagColor, lines: lines.map(function (l) { return { k: l[0], v: l[1] }; }), a: row.a, b: row.b, c: c };
    };
    var sessionDetail = function (k) {
      var ses4 = SESSIONS[k];
      if (!ses4) return null;
      var avail = ses4.who.filter(function (id) { return onDuty(S, byId[id]); });
      var away = ses4.who.filter(function (id) { return !onDuty(S, byId[id]); });
      var cn4 = crossingNote(avail);
      var chairUp = onDuty(S, byId.xo);
      return {
        pill: 'BRIEF', pillColor: '#a9bde8', who: ses4.title, whoColor: '#c9d6ff', time: '',
        text: 'A group chat in the Briefing Room. Number One chairs, and the Ship\'s Computer keeps the minutes.',
        hasTag: false, tag: '', tagColor: '',
        lines: [{ k: 'AT THE TABLE', v: avail.length ? names(avail) : 'Nobody can come right now.' }, { k: 'IN QUARTERS', v: away.length ? names(away) : 'Nobody' }, { k: 'RAILS', v: cn4.text }],
        a: btn(chairUp ? 'Convene' : 'Chair off duty', convene(k), { primary: true, color: '#8fa8e0', disabled: !chairUp, aria: 'Convene: ' + ses4.title }), b: NOBTN, c: NOBTN
      };
    };
    var dkeys = tab === 'file' ? [] : rows.filter(function (r) { return r.dkey; }).map(function (r) { return r.dkey; });
    var dIdx = S.detail ? dkeys.indexOf(S.detail) : -1;
    var det = null;
    if (dIdx >= 0) det = S.detail.indexOf('ses:') === 0 ? sessionDetail(S.detail.slice(4)) : cardDetail(S.detail);
    if (!det) dIdx = -1;
    var rowIdx = function (key) { for (var i = 0; i < rows.length; i++) { if (rows[i].dkey === key) return i; } return 0; };
    var NODET = { pill: '', pillColor: '#8ea3c4', who: '', whoColor: '#e6ecf5', time: '', text: '', hasTag: false, tag: '', tagColor: '#8ea3c4', lines: [], a: NOBTN, b: NOBTN, c: NOBTN };
    var isFile = tab === 'file';
    var inDetail = !!det;
    var hasPrev = inDetail ? dIdx > 0 : page > 0;
    var hasNext = inDetail ? dIdx < dkeys.length - 1 : page < pages - 1;
    var con = {
      aria: 'Console: ' + conTitle.toLowerCase(),
      color: conColor, halo: conHalo, icon: conIcon,
      title: conTitle, sub: conSub, chip: chip, chipColor: chipColor,
      tabs: tabset.map(function (t) {
        var on = t[0] === tab;
        return { label: t[1], on: on ? 'true' : 'false', bg: on ? conColor : '#141f35', fg: on ? '#0a0f1a' : '#b7c4da', pick: function () { self.setState({ tab: t[0], page: 0, detail: null }); } };
      }),
      hasSession: sesHeader,
      ses: sesInfo,
      isList: !isFile && !inDetail,
      inDetail: inDetail,
      det: det || NODET,
      back: function () { self.setState({ detail: null, page: Math.floor(rowIdx(S.detail) / pageSize) }); },
      isFile: isFile,
      rows: isFile ? [] : shown,
      noRows: !isFile && shown.length === 0,
      emptyText: emptyText,
      file: isFile ? shown[0].map(function (p) { return { k: p[0], v: p[1] }; }) : [],
      hasLink: isFile && !!cur.console,
      noLink: !(isFile && cur.console),
      link: cur.console || '',
      linkLabel: cur.consoleLabel || '',
      footNote: isFile ? 'No console board yet' : inDetail ? 'Back returns to the list' : (tab === 'duty' || tab === 'off' ? 'Relieved crew go to quarters, and the next officer by rank takes over.' : (tab === 'watch' ? 'Who leads each department right now' : (tab === 'session' ? 'Sessions are group chats. Whoever is in the chat sits at the table.' : 'Newest first'))),
      pageLabel: isFile ? (page === 0 ? 'WHO · 1 / 2' : 'WHAT · 2 / 2') : (inDetail ? 'CARD ' + (dIdx + 1) + ' / ' + dkeys.length : 'PAGE ' + (page + 1) + ' / ' + pages),
      prevOff: hasPrev ? 'false' : 'true', prevOpacity: hasPrev ? '1' : '0.35', prevCursor: hasPrev ? 'pointer' : 'not-allowed',
      nextOff: hasNext ? 'false' : 'true', nextOpacity: hasNext ? '1' : '0.35', nextCursor: hasNext ? 'pointer' : 'not-allowed',
      prev: function () { if (!hasPrev) return; if (inDetail) self.setState({ detail: dkeys[dIdx - 1] }); else self.setState({ page: page - 1 }); },
      next: function () { if (!hasNext) return; if (inDetail) self.setState({ detail: dkeys[dIdx + 1] }); else self.setState({ page: page + 1 }); }
    };

    // The comm badge speaks to the station picked on the plan, or to all hands. Write lifts it open for your own words.
    var CMD = Object.assign({ type: 'order', preset: 0, all: false, confirm: false, open: false, draft: '' }, S.cmd || {});
    var setCmd = function (patch) { self.setState({ cmd: Object.assign({}, CMD, { confirm: false }, patch) }); };
    var target = CMD.all ? 'all' : picked;
    var rt = route(S, target);
    var tS = target === 'all' ? null : byId[target];
    var tName = target === 'all' ? 'All hands' : tS.short + (rt.receiver && rt.receiver !== target && !tS.space ? ' → ' + byId[rt.receiver].short : '');
    var tRail = target === 'all' ? 'mixed' : (rt.receiver && !tS.space ? byId[rt.receiver].rail : tS.rail);
    var hailFor = null;
    openHails.forEach(function (f) { if (!hailFor && f.from === target) hailFor = f; });
    var isVerdict = CMD.type === 'approve' || CMD.type === 'deny';
    var noLine = rt.noline || '';
    if (isVerdict && hailFor) noLine = '';
    var P = PRESETS[target] || { ask: [], order: [] };
    var options = noLine ? [] : (isVerdict ? (hailFor ? [[hailFor.text]] : []) : (P[CMD.type] || []));
    var pi = Math.min(CMD.preset, Math.max(0, options.length - 1));
    var preset = options[pi];
    // Your own words: in the open badge, what is in the box is what gets sent. An unedited suggestion keeps its own reply.
    var writing = !!CMD.open;
    var draftT = (CMD.draft || '').replace(/\s+/g, ' ').trim();
    var CRIT = /\b(delete|remove|wipe|erase|drop|send|email|e-mail|mail|post|publish|pay|buy|book|transfer|merge|push|deploy|sign|accept|decline|cancel)\b/i;
    var ELEV = /\b(install|update|upgrade|restart|reboot|change|edit|rename|move|config|patch|rerun|apply)\b/i;
    var customOpt = function (t) {
      if (CMD.type === 'ask') return [t, target === 'lounge' ? 'Number One put it to the room. The answer is minuted.' : (target === 'all' ? 'Each station answers in its own channel.' : 'Heard. The answer is posted in this channel.')];
      return [t, CRIT.test(t) ? 3 : (ELEV.test(t) ? 2 : 1), 'Done as written. The result is posted in this channel.', null];
    };
    var custom = writing && !isVerdict && !noLine && !!draftT && !(preset && draftT === preset[0]);
    var opt = isVerdict || !writing ? preset : (custom ? customOpt(draftT) : (draftT ? preset : null));
    var tier = CMD.type === 'ask' ? 0 : (isVerdict ? -1 : (opt ? opt[1] : 0));
    var queued = !isVerdict && !!rt.queued;
    var crossing = tRail === 'claude' || tRail === 'codex';
    var railNote;
    if (noLine) railNote = noLine;
    else if (CMD.type === 'approve') railNote = 'Approving clears the hail. It is logged with an ORD, and nothing else is sent.';
    else if (CMD.type === 'deny') railNote = 'Denying clears the hail and tells the station no. It is logged with an ORD.';
    else if (queued) railNote = rt.queued;
    else if (tier === 3) railNote = 'Critical. It reaches someone off the ship or cannot be undone, so it takes a second tap.';
    else if (rt.note) railNote = rt.note;
    else if (target === 'all') railNote = 'Number One relays it on each station\'s own rail. Off-duty crew hear it when they are back.';
    else if (target === 'lounge') railNote = 'Number One chairs. A session order fills the table, and cloud stations in the room make the talk cross to their rail.';
    else if (crossing) railNote = 'Your words cross to ' + (tRail === 'claude' ? 'Claude' : 'Codex') + '. Customs scans them first, and rule 0 still applies.';
    else if (tRail === 'mixed') railNote = 'Number One routes it. Anything personal stays on the local rail.';
    else railNote = 'Local rail. Your words stay on the ship.';
    var emptyCmd = isVerdict ? 'Nothing from ' + (tS ? tS.short : 'all hands') + ' is waiting on you.' : 'No line to ' + (tS ? tS.short : 'all hands') + '.';
    var canSend = !!opt;
    var send = function () {
      if (!opt) return;
      if (tier === 3 && !CMD.confirm) { self.setState({ cmd: Object.assign({}, CMD, { confirm: true }) }); return; }
      var b = self.state;
      var seq = b.seq + 1;
      var id = 'ORD-' + (1044 + b.orders.length);
      var depts;
      if (target === 'all') depts = DEPT_ORDER.slice();
      else if (tS.space) depts = ['command'];
      else depts = [tS.dept];
      if (isVerdict) {
        resolve(hailFor.id, CMD.type === 'deny' ? 'DENIED' : 'APPROVED', writing ? draftT : '')();
        self.setState({ cmd: Object.assign({}, CMD, { confirm: false, open: false, draft: '' }) });
        return;
      }
      var o = { id: id, seq: seq, to: target, receiver: '', type: CMD.type, text: opt[0], opt: opt, reply: '', voice: '', fan: [], stage: -1, queued: '', note: '', depts: depts };
      var d = dispatch(b, o);
      if (d) { o = Object.assign(o, d, { stage: 0 }); if (d.receiver && d.receiver !== target && tS && !tS.space) o.depts = depts.concat([byId[d.receiver].dept]); }
      else o.queued = route(b, target).queued || 'Waiting.';
      var patch = { orders: b.orders.concat([o]), seq: seq, cmd: Object.assign({}, CMD, { confirm: false, open: false, draft: '' }) };
      var ses = null;
      if (d && opt[4]) { ses = { key: opt[4], shown: 1, sid: seq }; patch.session = ses; }
      self.setState(patch);
      if (d) advance(id);
      if (ses) reveal(ses.key, ses.sid);
    };
    var onDraft = function (e) {
      var v = e && e.target ? String(e.target.value) : '';
      var c0 = Object.assign({ type: 'order', preset: 0, all: false, open: true }, self.state.cmd || {});
      self.setState({ cmd: Object.assign(c0, { draft: v.slice(0, 500), confirm: false }) });
    };
    var onKey = function (e) {
      if (!e) return;
      if (e.key === 'Escape') setCmd({ open: false });
      else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { if (e.preventDefault) e.preventDefault(); send(); }
    };
    var draftHint, hintColor = '#a8987a';
    if (isVerdict) draftHint = hailFor ? 'Optional note to ' + byId[hailFor.from].short + '. It goes with your ' + (CMD.type === 'deny' ? 'no' : 'yes') + '.' : 'Nothing is waiting on you here.';
    else if (noLine) { draftHint = noLine; hintColor = '#8ea3c4'; }
    else if (custom) { draftHint = 'Your own words, sent as written. Tier guessed from them: ' + TIER[tier][0].split(' · ')[1].toLowerCase() + '. Number One checks it.'; hintColor = TIER[tier][1]; }
    else if (draftT) draftHint = 'A suggestion as written. Change it to make it your own.';
    else draftHint = 'Write your own ' + (CMD.type === 'ask' ? 'question' : 'order') + ', or tap a suggestion to start from it.';
    var toLabel = target === 'all' ? 'all hands' : tS.short;
    var cmd = {
      open: writing,
      openStr: writing ? 'true' : 'false',
      lift: writing ? 'translateY(-14px)' : 'none',
      shadow: writing ? '0 -20px 60px rgba(0,0,0,0.6), 0 0 44px rgba(232,195,122,0.3)' : '0 0 30px rgba(232,195,122,0.12)',
      edge: writing ? '#e8c37a' : '#6b5a33',
      writeLabel: writing ? 'Close' : 'Write',
      writeBg: writing ? '#e8c37a' : 'transparent',
      writeFg: writing ? '#1a1408' : '#e8c37a',
      toggleWrite: function () { setCmd({ open: !writing }); },
      draft: CMD.draft || '',
      onDraft: onDraft,
      onKey: onKey,
      placeholder: isVerdict ? 'Note to ' + toLabel + ' (optional)' : (CMD.type === 'ask' ? 'Ask ' + toLabel + ' anything…' : 'Order for ' + toLabel + ', in your own words…'),
      draftHint: draftHint,
      hintColor: hintColor,
      count: (CMD.draft || '').length + ' / 500',
      speaker: offWhy(S, byId.captain) ? 'Captain, off duty' : 'Captain speaking',
      toName: tName,
      toColor: target === 'all' ? CAPT : RAIL[tRail].color,
      allOn: CMD.all ? 'true' : 'false',
      allBg: CMD.all ? '#e8c37a' : 'transparent',
      allFg: CMD.all ? '#1a1408' : '#e6ecf5',
      toggleAll: function () { setCmd({ all: !CMD.all, preset: 0, type: isVerdict ? 'order' : CMD.type }); },
      types: [['ask', 'Ask'], ['order', 'Order'], ['approve', 'Approve'], ['deny', 'Deny']].map(function (k) {
        var on = CMD.type === k[0];
        var hot = k[0] === 'deny' ? '#ff8a8a' : '#e8c37a';
        return { label: k[1], on: on ? 'true' : 'false', bg: on ? hot : 'transparent', color: on ? '#1a1408' : (k[0] === 'deny' ? '#ffb3b3' : '#e6ecf5'), pick: function () { setCmd({ type: k[0], preset: 0 }); } };
      }),
      hasPresets: options.length > 0,
      noPresets: options.length === 0,
      emptyText: noLine ? '—' : emptyCmd,
      presets: options.map(function (o, i) {
        var on = i === pi;
        return { text: o[0], on: on ? 'true' : 'false', bg: on ? '#2a2416' : 'transparent', border: on ? '#e8c37a' : '#3a3424', pick: function () { setCmd(writing && !isVerdict ? { preset: i, draft: o[0] } : { preset: i }); } };
      }),
      railNote: railNote,
      railColor: noLine ? '#8ea3c4' : (isVerdict ? (CMD.type === 'deny' ? '#ff9b9b' : '#e8c37a') : (queued ? '#ffb08a' : (tier === 3 ? '#ff7a7a' : (crossing ? '#f0a948' : '#7fd8c4')))),
      tierLabel: tier < 0 ? 'CLEARS A HAIL' : TIER[tier][0],
      tierColor: tier < 0 ? (CMD.type === 'deny' ? '#ff8a8a' : '#e8c37a') : TIER[tier][1],
      disabled: canSend ? 'false' : 'true',
      cursor: canSend ? 'pointer' : 'not-allowed',
      sendLabel: !canSend ? 'Send' : (CMD.confirm ? 'Confirm tier 3' : (queued ? 'Queue it' : (CMD.type === 'ask' ? 'Ask' : (CMD.type === 'approve' ? 'Approve' : (CMD.type === 'deny' ? 'Deny' : 'Send order'))))),
      sendBg: !canSend ? 'transparent' : (CMD.confirm ? '#5a1a1f' : (queued ? '#3a2a1a' : (CMD.type === 'deny' ? '#ff8a8a' : '#e8c37a'))),
      sendColor: !canSend ? '#5f6b80' : (CMD.confirm ? '#ffdede' : (queued ? '#ffb08a' : (CMD.type === 'deny' ? '#2a0a0e' : '#1a1408'))),
      sendBorder: !canSend ? '#3a3424' : (CMD.confirm ? '#ff5050' : (queued ? '#ff9b6b' : (CMD.type === 'deny' ? '#ff8a8a' : '#e8c37a'))),
      send: send
    };

    // Orders in flight travel captain → Number One → whoever answers; split jobs fan out below.
    var beams = [];
    ORDERS.forEach(function (o) {
      if (o.type === 'approve' || o.type === 'deny' || o.stage < 0 || o.stage >= 3) return;
      var pts = [center('captain'), center('xo')];
      if (o.dest && o.dest !== 'xo') pts.push(center(o.dest));
      beams.push({ points: pts.join(' '), color: CAPT });
      if (o.stage >= 2) o.fan.forEach(function (f) { beams.push({ points: center(o.dest) + ' ' + center(f), color: RAIL[byId[f].rail].color }); });
    });

    var ship = {
      codexGlow: S.rails.codex ? '1' : '0.16', codexText: S.rails.codex ? '#1a1206' : '#f0a948',
      codexLabel: S.rails.codex ? 'CODEX · PORT NACELLE · SOL · TERRA · LUNA' : 'CODEX · WINDOW OUT · CREW IN QUARTERS',
      claudeGlow: S.rails.claude ? '1' : '0.16', claudeText: S.rails.claude ? '#1c0a13' : '#e889b6',
      claudeLabel: S.rails.claude ? 'CLAUDE · STARBOARD NACELLE · OPUS · SONNET · HAIKU' : 'CLAUDE · WINDOW OUT · CREW IN QUARTERS',
      coreGlow: S.rails.local ? '1' : '0.18', conduit: S.rails.local ? '0.3' : '0.08',
      coreText: S.rails.local ? '#9fd0ff' : '#ff9b9b',
      coreLabel: S.rails.local ? '◂ WARP CORE · LOCAL QWEN ON THE NAS GPU' : '◂ WARP CORE COLD · OLLAMA DOWN',
      tableGlow: pres.length ? '1' : '0.55'
    };

    var crew = list.filter(function (s) { return !s.space; });
    var builtCrew = crew.filter(built);
    var nBrief = pres.length;
    var nOff = builtCrew.filter(function (s) { return offWhy(S, s); }).length;
    var counts = [
      { n: builtCrew.length - nOff - nBrief, label: 'AT POSTS', border: 'solid', color: '#3fc1a5' },
      { n: nBrief, label: 'IN BRIEFING', border: 'solid', color: '#8fa8e0' },
      { n: nOff, label: 'OFF DUTY', border: 'solid', color: nOff ? '#ff8a8a' : '#4a6797' },
      { n: crew.length - builtCrew.length, label: 'NOT BUILT', border: 'dashed', color: '#4a6797' }
    ];
    var countBy = function (key, val) { return crew.filter(function (s) { return s[key] === val; }).length; };
    var legend = uniformMode
      ? ['red', 'gold', 'blue'].map(function (u) { return { color: UNIFORM[u].color, label: UNIFORM[u].legend, n: crew.filter(function (s) { return DEPT[s.dept].uniform === u; }).length }; })
      : ['captain', 'local', 'codex', 'claude', 'mixed'].map(function (r) { return { color: RAIL[r].color, label: RAIL[r].legend, n: countBy('rail', r) }; });
    var depts = DEPT_ORDER.map(function (k) {
      var d = DEPT[k];
      var on = k === curDept;
      var col = UNIFORM[d.uniform].color;
      var bm = members(k).filter(built);
      var up = bm.filter(function (s) { return onDuty(S, s); }).length;
      return {
        name: d.name, n: bm.length ? up + '/' + bm.length : '—', swatch: col,
        aria: d.name + ', ' + up + ' of ' + bm.length + ' crew on duty',
        bg: on ? col : '#141f35',
        fg: on ? '#0a0f1a' : (bm.length && !up ? '#ff9b9b' : '#d6e0ef'),
        on: on ? 'true' : 'false',
        pick: pickFn(acting(S, k) || d.head)
      };
    });
    var RAIL_UI = { codex: ['Codex', 'ONLINE', 'WINDOW OUT'], claude: ['Claude', 'ONLINE', 'WINDOW OUT'], local: ['Local', 'OLLAMA UP', 'OLLAMA DOWN'] };
    var railOpts = ['codex', 'claude', 'local'].map(function (r) {
      var up = S.rails[r];
      return {
        label: RAIL_UI[r][0], state: up ? RAIL_UI[r][1] : RAIL_UI[r][2], swatch: RAIL[r].color,
        bg: up ? '#141f35' : '#3a1418', fg: up ? '#d6e0ef' : '#ffb3b3',
        on: up ? 'false' : 'true',
        aria: RAIL_UI[r][0] + ' rail ' + (up ? 'online. Press to take it down.' : 'down. Press to bring it back.'),
        pick: toggleRail(r)
      };
    });
    var toggle = function (on, label, fn) {
      return { label: label, on: on ? 'true' : 'false', bg: on ? '#8fa8e0' : '#141f35', fg: on ? '#0a0f1a' : '#9fb0cc', pick: fn };
    };

    return {
      capShow: bareMode ? 'none' : 'block',
      intro: 'Pick a station to open its department channel. When a rail goes down or you relieve someone, they walk to their cabin and the next officer in rank takes command. Whoever is in a group chat sits in the Briefing Room.',
      tiles: tiles,
      tokens: tokens,
      deckGroups: deckGroups,
      beams: beams,
      con: con,
      cmd: cmd,
      ship: ship,
      counts: counts,
      legend: legend,
      depts: depts,
      railOpts: railOpts,
      labelOpts: [
        toggle(!rankMode && !bareMode, 'Role', function () { self.setState({ label: 'role' }); }),
        toggle(rankMode, 'Rank', function () { self.setState({ label: 'rank' }); }),
        toggle(bareMode, 'Off', function () { self.setState({ label: 'off' }); })
      ],
      colourOpts: [
        toggle(!uniformMode, 'Rail', function () { self.setState({ colour: 'rail' }); }),
        toggle(uniformMode, 'Uniform', function () { self.setState({ colour: 'uniform' }); })
      ],
      originals: [
        { label: 'Clean original', href: 'Main.dc.html' },
        { label: 'Fleshed out', href: 'DeckPlanV2.dc.html' },
        { label: 'Cutaway', href: 'CutawayDeck.dc.html' },
        { label: 'Holo rings', href: 'HoloDeck.dc.html' },
        { label: 'Comms badge', href: 'DeckComms.dc.html' }
      ]
    };
  }
}

// Number One's post (Deck 1, beside the Captain's chair): where every order came from, and where it
// went. Number One only routes: it reads the first words, picks the station that owns the ask, and
// files a card or answers in chat. The orders are the records (live/records.json, else the boards'
// orders); the fast path is each station's aliases; the rail rules are hermes/routing-rules.md.
import { SURFACE_WORD, records } from './computer';
import { inLastDays, openedOf, type Spot } from './post';
import type { FastPath, Fixtures, Order, Station } from '../types';

export type XoObject = 'bridge' | 'channels' | 'fastpath' | 'rules' | 'hails' | 'lounge' | 'blocked' | 'desk';

export const SPOTS: Spot<XoObject>[] = [
  { id: 'bridge',   box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'channels', box: [160, 56, 176, 260],  label: [248, 40] },
  { id: 'fastpath', box: [160, 322, 176, 176], label: [248, 508] },
  { id: 'hails',    box: [1272, 64, 116, 198], label: [1330, 40] },
  { id: 'rules',    box: [1266, 290, 128, 274], label: [1330, 584] },
  { id: 'lounge',   box: [1400, 96, 188, 468], label: [1494, 500] },
  { id: 'blocked',  box: [194, 580, 166, 130], label: [276, 566] },
  { id: 'desk',     box: [1056, 580, 196, 140], label: [1154, 566] },
];

/** Number One's wall screen is wider than the other posts': the routing fan fills it. */
export const SCREEN = { x: 356, y: 24, w: 896, h: 500 };

/** The surfaces the Captain writes from, in the order the comm channels show them. */
export const SURFACES = ['telegram', 'desktop', 'dashboard'] as const;
export type Surface = (typeof SURFACES)[number];
export const SURFACE_COLOUR: Record<Surface, string> = { telegram: '#5aa7f0', desktop: '#f0a35e', dashboard: '#b9a6f5' };
export const surfaceWord = (s?: string) => (s ? SURFACE_WORD[s] ?? s : 'Not recorded');

/** The asks the Captain made, newest first: orders Number One took in, not sub-orders it split off. */
export function asks(data: Fixtures): Order[] {
  return records(data).filter((o) => !o.parent).sort((a, b) => openedOf(b).localeCompare(openedOf(a)) || b.id.localeCompare(a.id));
}

export interface Channel { id: Surface; week: number; all: number; speed: number; chat: number; card: number }

/** Per surface: orders in the last 7 days and on file, how many kept a speed word, chat or card. */
export function channels(list: Order[], asOf: string): Channel[] {
  return SURFACES.map((id) => {
    const mine = list.filter((o) => o.surface === id);
    return {
      id, all: mine.length,
      week: mine.filter((o) => inLastDays(openedOf(o), asOf)).length,
      speed: mine.filter((o) => !!o.speed).length,
      chat: mine.filter((o) => o.cards === 0).length,
      card: mine.filter((o) => (o.cards ?? 0) > 0).length,
    };
  });
}

/** A station on the routing fan: its asks on file and this week, and how many are open, running, blocked or waiting on you. */
export interface FanNode { id: string; all: number; week: number; open: number; running: number; blocked: number; hails: number }

/** The routing fan: one node per station that took an ask, in the roster's order. */
export function fan(list: Order[], asOf: string, roster: string[]): FanNode[] {
  const by = new Map<string, FanNode>();
  for (const o of list) {
    const n = by.get(o.station) ?? { id: o.station, all: 0, week: 0, open: 0, running: 0, blocked: 0, hails: 0 };
    n.all += 1;
    if (inLastDays(openedOf(o), asOf)) n.week += 1;
    if (o.state !== 'done') n.open += 1;
    if (o.state === 'running') n.running += 1;
    if (o.state === 'blocked') n.blocked += 1;
    if (o.state === 'awaiting-captain') n.hails += 1;
    by.set(o.station, n);
  }
  const at = (id: string) => (roster.includes(id) ? roster.indexOf(id) : roster.length);
  return [...by.values()].sort((a, b) => at(a.id) - at(b.id) || a.id.localeCompare(b.id));
}

/** n points on the upper arc of an ellipse, left to right, from one angle to another (degrees, 180 = left, 270 = top). */
export function arc(n: number, cx: number, cy: number, rx: number, ry: number, from = 196, to = 344): { x: number; y: number; dx: number; dy: number }[] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((n === 1 ? 270 : from + ((to - from) * i) / (n - 1)) * Math.PI) / 180;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), dx: Math.cos(a), dy: Math.sin(a) };
  });
}

/** What the routing table shows: one surface, one station, or everything. */
export interface Route { surface: Surface | null; station: string | null }
export const EVERY: Route = { surface: null, station: null };
export const routed = (list: Order[], r: Route) => list.filter((o) => (!r.surface || o.surface === r.surface) && (!r.station || o.station === r.station));

/** The rail rules, short (hermes/routing-rules.md, v2). The first match wins. */
export const RAIL_RULES: { n: string; name: string; rail: 'local' | 'codex' | 'claude' | 'mixed'; text: string }[] = [
  { n: '0', name: 'Hard stays-local', rail: 'local', text: 'Memory, secrets, raw personal data and writes to your systems never leave the local rail. A food photo or a typed meal may cross to Codex for macros only, with nothing that identifies you.' },
  { n: '1', name: 'Codex', rail: 'codex', text: 'Code or a code change, or input too big for local context. Codex sends back a diff or a script and a short note.' },
  { n: '2', name: 'Claude', rail: 'claude', text: 'A styled deliverable (PDF, deck, page, chart) or research that ends in one. Claude sends back the deliverable with its sources.' },
  { n: '3', name: 'Local by default', rail: 'local', text: 'Everything else stays on qwen: plumbing, health checks, short prose, quick edits and small scripts.' },
  { n: '4', name: 'Stacking', rail: 'mixed', text: 'A job with a code part and a design part splits: Codex writes, local runs it on real data, Claude designs from the aggregate, local delivers. Cloud rails never call each other.' },
  { n: '5', name: 'Personal-data reports', rail: 'mixed', text: 'Only aggregated numbers and categories cross to Claude. Raw rows and anything that identifies a person stay home.' },
  { n: '6', name: 'Long batches', rail: 'local', text: 'Batch runs always run locally. Codex fixes the code when one breaks; Claude only sees the final report.' },
  { n: '7', name: 'Quota', rail: 'mixed', text: 'No fixed cap on recurring cloud jobs; Ops reports their share. A rail that is short waits; the task never reroutes to another rail.' },
  { n: '8', name: 'Visual QA', rail: 'local', text: 'Every deliverable passes a mechanical check: page count, required strings, no clipped or overlapping text.' },
  { n: '9', name: 'Cross-rail review', rail: 'mixed', text: 'A review normally goes to a different rail than the one that made the work.' },
];

/** A coded fast path as the board shows it: its first words, the station whose profile it files to, the patch, an example. */
export interface FastRoute { words: string[]; say: string; to: string; profile: string; patch?: string; eg?: string }

/** The coded fast paths: Hermes' routing/fast-paths.json through the ship probe, else the sample (patch P's words). */
export function fastPaths(data: Pick<Fixtures, 'fastpaths' | 'stations'>): FastRoute[] {
  const stations = data.stations.stations;
  return data.fastpaths.paths.map((p: FastPath) => ({
    words: p.words, say: p.words.map((w) => `${w}…`).join(' / '), profile: p.profile, patch: p.patch, eg: p.example,
    to: stations.find((s) => s.profile === p.profile)?.id ?? p.profile,
  }));
}
/** Where the fast paths came from, for the line under the title. */
export const fastSource = (data: Pick<Fixtures, 'fastpaths'>) => (data.fastpaths.synthetic
  ? "SAMPLE · NO FILE FROM HERMES YET"
  : `FROM HERMES' FAST-PATHS.JSON · AS OF ${data.fastpaths.asOf.slice(11, 16)} UTC`);
/** The phrase at the very start of the words that a fast path takes, longest first, or undefined. */
function codedAt(lower: string, paths: FastRoute[]): { word: string; route: FastRoute } | undefined {
  const all = paths.flatMap((route) => route.words.map((word) => ({ word, route }))).sort((a, b) => b.word.length - a.word.length);
  return all.find(({ word }) => new RegExp(`^${esc(word)}(?=$|[^a-z0-9])`).test(lower));
}

/** How a coded fast path behaves (patches K and P). */
export const FAST_RULES: string[] = [
  'The words are matched at the very start of your typed message, case-insensitive, as whole words. A speed word before them still counts as the start.',
  'Code files the card for that station itself, with your words unchanged, and stamps the ORD.',
  'Number One only sends the receipt. It files nothing and decides nothing.',
  'If code can\'t file the card, nothing is lost: Number One gets the message as usual.',
];

// ---------- a new fast path: the board drafts it, the Chief Engineer codes it, you apply it ----------

/** Speed words (patch K) come before a fast path's words, so a fast path can't start with one. */
const SPEED_WORDS = ['thrusters', 'quarter', 'half', 'full', 'impulse', 'warp', 'maximum'];
export interface FastDraft { words: string; to: string; avoid: string; example: string }

/** Comma-separated text, cleaned: lower case, single spaces, no quotes or end punctuation, no repeats. */
export function fastWords(s: string): string[] {
  const out = s.split(',')
    .map((w) => w.toLowerCase().replace(/[“”"'‘’…]/g, '').trim().replace(/[.:;!?]+$/, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return [...new Set(out)];
}

/** Stations a fast path can go to: live crew stations with a profile of their own. Not Number One, and not specialists whose cards come from their head. */
export function fastTargets(stations: Station[]): Station[] {
  return stations.filter((s) => s.kind === 'station' && s.status === 'live' && s.id !== 'xo'
    && /^[a-z_]+$/.test(s.profile ?? '') && !s.aliases.some((a) => a.startsWith('none')));
}

/** What stops a draft (stop), and what is worth knowing before you send it (note). */
export function fastCheck(d: FastDraft, stations: Station[], paths: FastRoute[]): { stop: string[]; note: string[] } {
  const words = fastWords(d.words);
  const stop: string[] = [];
  const note: string[] = [];
  if (!words.length) stop.push('Type the first words.');
  if (!fastTargets(stations).some((s) => s.id === d.to)) stop.push('Pick the station it goes to.');
  for (const w of words) {
    const first = w.split(' ')[0];
    const taken = codedAt(w, paths) ?? paths.flatMap((r) => r.words.map((word) => ({ word, route: r }))).find((x) => x.word.startsWith(`${w} `));
    if (SPEED_WORDS.includes(first)) stop.push(`"${w}" starts with a speed word, and a speed word always comes first.`);
    else if (taken) stop.push(`"${taken.word}" already has a fast path to ${stations.find((s) => s.id === taken.route.to)?.short ?? taken.route.profile}.`);
    if (!/^[a-z0-9][a-z0-9 !'-]{0,39}$/.test(w)) stop.push(`"${w}": letters, digits, spaces, ! ' and - only, up to 40.`);
    const owner = stations.find((s) => s.id !== d.to && s.aliases.includes(w));
    if (owner) note.push(`"${w}" is also ${owner.short}'s name. In code, the fast path wins.`);
  }
  const eg = d.example.trim();
  if (eg && words.length && !codedAt(routeOf(eg, [], []).rest.toLowerCase(), [{ words, say: '', to: d.to, profile: '' }])) {
    stop.push('The example must start with one of the first words (a speed word before them is fine).');
  }
  if (words.some((w) => w.length < 3)) note.push('A very short word matches more than you might mean.');
  return { stop, note };
}

/** "a"; "a" or "b"; "a", "b" or "c". */
const orList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const quote = (s: string) => `"${s}"`;

/** The entry the new fast path adds to Hermes' routing/fast-paths.json. */
export function fastEntry(d: FastDraft, st: Station): string {
  const entry: Record<string, unknown> = { words: fastWords(d.words), profile: st.profile ?? st.id, patch: '<the new letter>' };
  if (d.example.trim()) entry.example = d.example.trim().slice(0, 120);
  return JSON.stringify(entry);
}

/** The card for the Chief Engineer, in the house brief format (GOAL, CONTEXT, CONSTRAINTS, DONE WHEN). */
export function fastPathBrief(d: FastDraft, st: Station, chief: Station | undefined): string {
  const words = fastWords(d.words);
  const said = orList(words.map(quote));
  const by = chief?.profile ?? 'forge';
  const prof = st.profile ?? st.id;
  const slug = words[0].replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'new';
  const eg = d.example.trim();
  const yes = [...(eg ? [quote(eg)] : []), ...words.map((w) => quote(`${cap(w)} test`)), quote(`Warp: ${words[0]} test`)];
  const no = [quote(`tell me about ${words[0]}`), ...fastWords(d.avoid).map(quote)];
  return [
    `# New fast path · ${said} goes to ${st.name} (${by}, solo)`,
    '',
    `Paste to Number One as one card for ${by}. ${cap(by)} works this card alone: no child cards.`,
    '',
    '## GOAL',
    `When the Captain's message starts with ${said}, code files the card to the ${prof} profile (${st.name}) with the Captain's words unchanged. Number One only sends the receipt.`,
    '',
    '## CONTEXT',
    '- The arrival hook reads the coded fast paths from /opt/data/routing/fast-paths.json (B2-34): first words at the very start of the typed text, matched as whole words, case-insensitive, a speed word before them still counting as the start. Code files the card for the entry\'s profile. Patch P\'s words ("remind", "todo", "yeoman") were the first entries.',
    `- This adds ${said} for the ${prof} profile. The Captain drafted it on Number One's board, on the fast path; the board reads the same file through the ship probe.`,
    '',
    '## CONSTRAINTS',
    '- Add one entry to /opt/data/routing/fast-paths.json and change nothing else in it:',
    `  \`${fastEntry(d, st)}\``,
    '- If the arrival hook doesn\'t read that file yet, stop and report: B2-34 comes first.',
    '- The patch adds the entry; it never edits the live file directly. Write patches and scripts only. Never edit a live file under /opt/hermes or the live profiles. The Captain applies the patch.',
    '- Name the patch with the next free letter, and put that letter in the entry\'s "patch". Add it to apply.sh and check.sh with a "present under overlay" check, as B2-31 did.',
    '- Test on scratch copies only, with fake messages and an empty test board, and delete them when done. No real cards and no real messages.',
    '- Never sleep, wait or poll. When done, report and finish.',
    '- Manual steps in the report use the NAS-host docker form, for example `sudo docker exec -u root hermes sh /opt/data/patches/apply.sh`, under "## Manual steps for Roger (NAS host)", numbered, one code block each, with the expected output. Rollback goes in its own section after the steps.',
    '',
    '## DONE WHEN',
    `- Tests pass: ${yes.join(', ')} each create one ${prof} card with the exact words. ${cap(orList(no))} create${no.length > 1 ? '' : 's'} none. The tests for the other fast paths still pass.`,
    '- apply.sh and check.sh know the new patch, and check.sh says "OK through" it on the scratch copy.',
    `- /opt/data/handoff/engineering/fast-path-${slug}-report.md holds the change, the test output, the manual steps, and a live test for the Captain: send ${yes[0]} from the desktop app, then check that the newest card is on ${prof}'s board with those words.`,
    `- ${cap(by)}'s final report says plainly whether each item was done.`,
  ].join('\n');
}

/** 24 x 24 line icons for the room's things. */
export const XO_ICONS: Record<XoObject | 'ease' | 'order' | 'stations', string> = {
  ease: 'M4 6h16 M4 12h10 M4 18h7 M17 12l3 3-3 3 M14 15h6',
  order: 'M6 3h9l3 3v15H6z M9 9h6 M9 13h6 M9 17h4',
  bridge: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M12 3v18',
  channels: 'M4 5h16v10H8l-4 4z M8 9h8 M8 12h5',
  fastpath: 'M4 12h12 M12 7l5 5-5 5 M20 5v14',
  rules: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M5 17a3 3 0 0 1 3-3h11 M9 8h6',
  hails: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.8 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
  stations: 'M5 5h4v4H5z M15 5h4v4h-4z M5 15h4v4H5z M15 15h4v4h-4z M9 7h6 M9 17h6 M7 9v6 M17 9v6',
  lounge: 'M4 10h16v4H4z M6 14v5 M18 14v5 M8 6h8',
  blocked: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M6 6l12 12',
  desk: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
};

// ---------- where would this go? ----------

/** Speed words the arrival hook reads at the very start, before a colon or a comma (patch K), longest first. */
const SPEED_START = ['maximum warp', 'warp 9', 'warp', 'full impulse', 'half impulse', 'quarter impulse', 'impulse', 'thrusters'];
const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface RouteGuess {
  /** The speed word read at the start, if any. */
  speed?: string;
  /** The words after it. */
  rest: string;
  /** A coded fast path the first words match: code files the card. */
  coded?: { word: string; to: string; patch?: string };
  /** Stations the words name, the first named first. */
  named: { id: string; alias: string }[];
}

/** Where a message would go, by the same rules: a speed word first, then the coded fast path (exact, it is code),
 *  then the station names in the words (what Number One usually goes by). */
export function routeOf(text: string, stations: Station[], paths: FastRoute[]): RouteGuess {
  let rest = text.trim();
  let speed: string | undefined;
  for (const w of SPEED_START) {
    const m = rest.match(new RegExp(`^${esc(w).replace(' ', '\\s+')}\\s*[:,]\\s*`, 'i'));
    if (m) { speed = w.split(' ').map(cap).join(' '); rest = rest.slice(m[0].length); break; }
  }
  const lower = rest.toLowerCase();
  const hit = codedAt(lower, paths);
  const coded = hit ? { word: hit.word, to: hit.route.to, patch: hit.route.patch } : undefined;
  const named: { id: string; alias: string; at: number }[] = [];
  for (const st of stations) {
    let best: { alias: string; at: number } | undefined;
    for (const a of st.aliases) {
      if (a.startsWith('none')) continue;
      const m = lower.match(new RegExp(`(^|[^a-z0-9])${esc(a)}(?=$|[^a-z0-9])`));
      if (m && m.index !== undefined) {
        const at = m.index + m[1].length;
        if (!best || at < best.at) best = { alias: a, at };
      }
    }
    if (best) named.push({ id: st.id, ...best });
  }
  named.sort((a, b) => a.at - b.at);
  return { speed, rest, coded, named: named.map(({ id, alias }) => ({ id, alias })) };
}

/** Messages to try on the tester. */
export const TRY_THESE = [
  'Warp: remind me at 21:00 to call the garage',
  'Helm, shortlist the new job ads',
  'Ask Navigation for the train times to Gothenburg',
  "What's the weather tomorrow?",
];


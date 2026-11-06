// The computer core (Deck 3): where things are in the picture (assets/computer.svg, a 1600 x 740
// box, drawn by tools/make_computer_svg.py), and the core terminal's records: every order the
// ship has taken, in any state, with the terminal's search. The records come from live/records.json
// on the NAS (the ship probe keeps every order there); without it, from the orders on the boards.
import type { Fixtures, Order, OrdersFile } from '../types';
import type { ShipView } from './ship';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the core terminal. */
export type CoreObject = 'bridge' | 'memory' | 'core' | 'records' | 'desk' | 'minutes' | 'burn';

export const SPOTS: { id: CoreObject; box: [number, number, number, number]; label: [number, number] }[] = [
  { id: 'bridge',  box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'memory',  box: [154, 102, 186, 466], label: [247, 84] },
  { id: 'core',    box: [378, 44, 184, 540],  label: [470, 16] },
  { id: 'records', box: [586, 120, 192, 448], label: [682, 100] },
  { id: 'desk',    box: [854, 580, 362, 146], label: [1035, 570] },
  { id: 'minutes', box: [1226, 560, 148, 168], label: [1300, 562] },
  { id: 'burn',    box: [1412, 540, 166, 190], label: [1495, 538] },
];

/** The records board's table top, where the page lays a count per order state. */
export const TABLE = { x: 170, y: 596, w: 600, h: 96 };
/** The core terminal's screen, where the page lays the terminal. */
export const SCREEN = { x: 810, y: 44, w: 770, h: 470 };

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

export type State = Order['state'];
/** Every order state, in the order an order moves through them. */
export const STATES: State[] = ['queued', 'running', 'review', 'awaiting-captain', 'blocked', 'done'];
export const STATE_WORD: Record<State, string> = {
  queued: 'QUEUED', running: 'RUNNING', review: 'REVIEW', 'awaiting-captain': 'AWAITS YOU', blocked: 'BLOCKED', done: 'DONE',
};

/** Every order on file, newest first: live/records.json when the probe writes it, else the boards' orders. */
export function recordsFile(data: Fixtures): OrdersFile {
  return data.records ?? data.orders;
}

export function records(data: Fixtures): Order[] {
  return [...recordsFile(data).orders].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.id.localeCompare(a.id));
}

/** How many orders are in each state. */
export function counts(list: Order[]): Record<State, number> {
  const out = Object.fromEntries(STATES.map((s) => [s, 0])) as Record<State, number>;
  for (const o of list) out[o.state] += 1;
  return out;
}

/** What the terminal is showing: a state (or all, or every open one), a station, and words to find. */
export interface Query {
  state: State | 'all' | 'open';
  station: string | null;
  words: string;
}
export const ALL: Query = { state: 'all', station: null, words: '' };

const ORD = /^ord-(\d{4})$/i;

/**
 * What the Captain typed on the command line. "ORD-1232" opens that record; "state blocked" (or
 * "open", "done") and "station eng" set the filters; anything else is words to find. Words are
 * matched in the id, title, body, detail and replies, all of them, in any order.
 */
export function parseCommand(line: string, ship: ShipView, q: Query): { query: Query; open?: string } {
  const text = line.trim();
  const ord = ORD.exec(text);
  if (ord) return { query: q, open: `ORD-${ord[1]}` };
  const words: string[] = [];
  let { state, station } = q;
  const parts = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].toLowerCase();
    const next = parts[i + 1]?.toLowerCase();
    if ((p === 'state' || p === 'status') && next) { state = stateOf(next) ?? state; i++; continue; }
    if (p === 'station' && next) { station = stationOf(ship, next) ?? station; i++; continue; }
    if (p === 'all' || p === 'clear' || p === 'reset') { state = 'all'; station = null; continue; }
    if (p === 'open') { state = 'open'; continue; }
    const s = stateOf(p);
    if (s && parts.length === 1) { state = s; continue; }
    words.push(parts[i]);
  }
  return { query: { state, station, words: words.join(' ') } };
}

function stateOf(word: string): State | 'open' | undefined {
  if (word === 'open') return 'open';
  if (word === 'awaiting' || word === 'awaits' || word === 'captain') return 'awaiting-captain';
  return STATES.find((s) => s === word);
}

/** A station by its id, short name, name or alias. */
export function stationOf(ship: ShipView, word: string): string | undefined {
  const w = word.toLowerCase();
  return ship.data.stations.stations.find((s) => s.id === w || s.short.toLowerCase() === w
    || s.name.toLowerCase() === w || (s.aliases ?? []).some((a) => a.toLowerCase() === w) || s.profile?.toLowerCase() === w)?.id;
}

/** The orders a query shows, newest first. */
export function find(list: Order[], q: Query): Order[] {
  const words = q.words.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter((o) => {
    if (q.state === 'open' ? o.state === 'done' : q.state !== 'all' && o.state !== q.state) return false;
    if (q.station && o.station !== q.station) return false;
    if (!words.length) return true;
    const hay = [o.id, o.title, o.body ?? '', o.detail ?? '', ...(o.replies ?? []).map((r) => r.text)].join('\n').toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/** The command line that would show this query, as the terminal echoes it. */
export function echo(q: Query, ship: ShipView): string {
  const parts = ['records'];
  if (q.state !== 'all') parts.push(`--state ${q.state}`);
  if (q.station) parts.push(`--station ${ship.station(q.station)?.short.toLowerCase() ?? q.station}`);
  if (q.words) parts.push(JSON.stringify(q.words));
  return parts.join(' ');
}

/** The most the terminal lists at once. More than this, and it asks for a narrower search. */
export const LIST_MAX = 150;

/** The ship's log lines about one order: when it opened, split, crossed customs, closed. */
export function logOf(data: Fixtures, id: string) {
  return data.shiplog.entries.filter((e) => e.text.includes(id)).sort((a, b) => a.at.localeCompare(b.at));
}

/** The briefing minutes the Computer keeps, newest first. */
export function minutes(data: Fixtures) {
  return data.shiplog.entries.filter((e) => e.kind === 'briefing').sort((a, b) => b.at.localeCompare(a.at));
}

/** 24 x 24 line icons for the room's things. */
export const CORE_ICONS: Record<CoreObject | 'ease' | 'record' | 'station', string> = {
  ease: 'M4 5h16v11H4z M8 20h8 M12 16v4 M7 9l2 2-2 2 M11 13h4',
  record: 'M6 3h9l3 3v15H6z M9 9h6 M9 13h6 M9 17h4',
  records: 'M5 4h14v4H5z M5 10h14v4H5z M5 16h14v4H5z M8 6h.01 M8 12h.01 M8 18h.01',
  desk: 'M4 5h16v11H4z M8 20h8 M12 16v4 M7 9l2 2-2 2 M11 13h4',
  memory: 'M6 10V7a6 6 0 0 1 12 0v3 M5 10h14v11H5z M12 14v3',
  core: 'M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0 M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  minutes: 'M7 3h10v18H7z M10 7h4 M10 11h4 M10 15h2',
  burn: 'M12 3l5 7-5 11-5-11z M7 10h10',
  bridge: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M12 3v18',
  station: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
};

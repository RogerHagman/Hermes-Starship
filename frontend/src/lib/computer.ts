// The computer core (Deck 3): where things are in the picture (assets/computer.svg, a 1600 x 740
// box, drawn by tools/make_computer_svg.py), and the core terminal's records: every order the
// ship has taken, in any state, with the terminal's search. The records come from live/records.json
// on the NAS (the ship probe keeps every order there); without it, from the orders on the boards.
import { dayKey } from './format';
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

/** What the terminal is showing: a state (or all, or every open one), a station, days, and words to find. */
export interface Query {
  state: State | 'all' | 'open';
  station: string | null;
  words: string;
  /** Only orders opened on or after this ship's day (YYYY-MM-DD). */
  since?: string;
  /** Only orders opened before this ship's day (YYYY-MM-DD). */
  before?: string;
}
export const ALL: Query = { state: 'all', station: null, words: '' };

const ORD = /^ord-(\d{4})$/i;

/**
 * What the Captain typed on the command line. "ORD-1232" opens that record; "state blocked" (or
 * "open", "done"), "station eng", "since 20/10" and "before 25/10" set the filters; anything else
 * is words to find. Words are matched in the id, title, body, detail and replies, all of them, in
 * any order. A line in double quotes is only words, so a command word can be found too.
 */
export function parseCommand(line: string, ship: ShipView, q: Query): { query: Query; open?: string; said?: string } {
  const text = line.trim();
  const ord = ORD.exec(text);
  if (ord) return { query: q, open: `ORD-${ord[1]}` };
  const quoted = /^"([^"]*)"?$/.exec(text);
  if (quoted) return { query: { ...q, words: quoted[1].trim() } };
  const words: string[] = [];
  const said: string[] = [];
  let { state, station, since, before } = q;
  const asOf = recordsFile(ship.data).asOf;
  const parts = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].toLowerCase();
    const next = parts[i + 1]?.toLowerCase();
    if ((p === 'state' || p === 'status') && next) {
      const s = stateOf(next);
      if (s) state = s; else said.push(`state: no state called ${next}. The states: ${STATE_NAMES}.`);
      i++; continue;
    }
    if (p === 'station' && next) {
      const s = stationOf(ship, next);
      if (s) station = s; else said.push(`station: no station called ${next}.`);
      i++; continue;
    }
    if ((p === 'since' || p === 'before') && next) {
      const d = next === 'any' ? null : dayOf(next, asOf);
      if (d === undefined) said.push(`${p}: ${next} is not a day. Try 24/10, 24/10/2026 or 2026-10-24.`);
      else if (p === 'since') since = d ?? undefined;
      else before = d ?? undefined;
      i++; continue;
    }
    if (p === 'all' || p === 'clear' || p === 'reset') { state = 'all'; station = null; since = undefined; before = undefined; continue; }
    if (p === 'open') { state = 'open'; continue; }
    const s = stateOf(p);
    if (s && parts.length === 1) { state = s; continue; }
    words.push(parts[i]);
  }
  const query: Query = { state, station, words: words.join(' ') };
  if (since) query.since = since;
  if (before) query.before = before;
  return said.length ? { query, said: said.join(' ') } : { query };
}

const STATE_NAMES = 'queued, running, review, awaiting, blocked, done, open';

/**
 * A day typed on the command line, as the ship's YYYY-MM-DD: 2026-10-24, 24/10/2026, 24/10 (the
 * last 24 October on or before the records' day), today or yesterday. Undefined if it isn't a day.
 */
export function dayOf(word: string, asOf: string): string | undefined {
  const today = dayKey(asOf);
  const [ty, tm, td] = today.split('-').map(Number);
  const key = (y: number, m: number, d: number) => {
    const t = new Date(Date.UTC(y, m - 1, d));
    if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return undefined;
    return t.toISOString().slice(0, 10);
  };
  const w = word.toLowerCase();
  if (w === 'today') return today;
  if (w === 'yesterday') return new Date(Date.UTC(ty, tm - 1, td - 1)).toISOString().slice(0, 10);
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(w);
  if (m) return key(+m[1], +m[2], +m[3]);
  m = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?$/.exec(w);
  if (!m) return undefined;
  if (m[3]) return key(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[2], +m[1]);
  const k = key(ty, +m[2], +m[1]);
  return k && k > today ? key(ty - 1, +m[2], +m[1]) : k;
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

/** The day an order counts as opened on: its opening time, or without one its last update. */
export const openedDay = (o: Order) => dayKey(o.openedAt ?? o.updatedAt);

/** The orders a query shows, in the list's order. Words look in everything, or in titles only. */
export function find(list: Order[], q: Query, look: 'all' | 'titles' = 'all'): Order[] {
  const words = q.words.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter((o) => {
    if (q.state === 'open' ? o.state === 'done' : q.state !== 'all' && o.state !== q.state) return false;
    if (q.station && o.station !== q.station) return false;
    if (q.since || q.before) {
      const d = openedDay(o);
      if (q.since && d < q.since) return false;
      if (q.before && d >= q.before) return false;
    }
    if (!words.length) return true;
    const hay = (look === 'titles' ? [o.id, o.title]
      : [o.id, o.title, o.body ?? '', o.detail ?? '', ...(o.replies ?? []).map((r) => r.text)]).join('\n').toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/** The command line that would show this query, as the terminal echoes it. */
export function echo(q: Query, ship: ShipView): string {
  const parts = ['records'];
  if (q.state !== 'all') parts.push(`--state ${q.state}`);
  if (q.station) parts.push(`--station ${ship.station(q.station)?.short.toLowerCase() ?? q.station}`);
  if (q.since) parts.push(`--since ${q.since}`);
  if (q.before) parts.push(`--before ${q.before}`);
  if (q.words) parts.push(JSON.stringify(q.words));
  return parts.join(' ');
}

/** The ship's log lines about one order: when it opened, split, crossed customs, closed. */
export function logOf(data: Fixtures, id: string) {
  return data.shiplog.entries.filter((e) => e.text.includes(id)).sort((a, b) => a.at.localeCompare(b.at));
}

/** The briefing minutes the Computer keeps, newest first. */
export function minutes(data: Fixtures) {
  return data.shiplog.entries.filter((e) => e.kind === 'briefing').sort((a, b) => b.at.localeCompare(a.at));
}

// ---------- the numbers: what the records say about how the ship works ----------

const MIN = 60_000;

/** Minutes from an order coming in to it closing, for a done order that has both times. */
export function took(o: Order): number | null {
  if (o.state !== 'done' || !o.openedAt || !o.closedAt) return null;
  const m = (Date.parse(o.closedAt) - Date.parse(o.openedAt)) / MIN;
  return Number.isFinite(m) && m >= 0 ? m : null;
}

/** A length of time, short: 45 MIN, 3.5 H, 2.1 DAYS. */
export function span(mins: number): string {
  const one = (x: number) => x.toFixed(1).replace(/\.0$/, '');
  if (mins < 90) return `${Math.max(1, Math.round(mins))} MIN`;
  if (mins < 48 * 60) return `${one(mins / 60)} H`;
  return `${one(mins / 1440)} DAYS`;
}

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export const SURFACE_WORD: Record<string, string> = { telegram: 'Telegram', desktop: 'Desktop app', dashboard: 'Web dashboard' };

export interface Day { key: string; label: string; opened: number; closed: number }
export interface Stats {
  /** The last `days` ship's days, oldest first, ending on the day of asOf. */
  days: Day[];
  /** Done orders with both times, per station: how many and the median time to close. Slowest first. */
  stations: { id: string; done: number; median: number }[];
  /** Where the orders came from, the most first. */
  surfaces: { id: string; n: number }[];
  /** Orders with a card filed, and orders answered in chat (no card). Older records may say neither. */
  card: number;
  chat: number;
  /** Median time to close over every timed done order. */
  median: number | null;
  timed: number;
  week: { opened: number; closed: number };
}

/** What the records say: orders per day, time to close per station, surfaces, chat or card. */
export function stats(list: Order[], asOf: string, days = 14): Stats {
  const [y, m, d] = dayKey(asOf).split('-').map(Number);
  const out: Day[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const t = new Date(Date.UTC(y, m - 1, d - i, 12));
    out.push({ key: t.toISOString().slice(0, 10), opened: 0, closed: 0,
      label: new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(t).toUpperCase() });
  }
  const at = new Map(out.map((x) => [x.key, x]));
  const week = new Set(out.slice(-7).map((x) => x.key));
  const by = new Map<string, number[]>();
  const from = new Map<string, number>();
  const s: Stats = { days: out, stations: [], surfaces: [], card: 0, chat: 0, median: null, timed: 0, week: { opened: 0, closed: 0 } };
  const all: number[] = [];
  for (const o of list) {
    if (o.openedAt) {
      const k = dayKey(o.openedAt);
      if (at.has(k)) at.get(k)!.opened += 1;
      if (week.has(k)) s.week.opened += 1;
    }
    if (o.closedAt) {
      const k = dayKey(o.closedAt);
      if (at.has(k)) at.get(k)!.closed += 1;
      if (week.has(k)) s.week.closed += 1;
    }
    const t = took(o);
    if (t !== null) {
      all.push(t);
      by.set(o.station, [...(by.get(o.station) ?? []), t]);
    }
    if (o.surface) from.set(o.surface, (from.get(o.surface) ?? 0) + 1);
    if (o.cards !== undefined) { if (o.cards > 0) s.card += 1; else s.chat += 1; }
  }
  s.median = median(all);
  s.timed = all.length;
  s.stations = [...by.entries()].map(([id, xs]) => ({ id, done: xs.length, median: median(xs)! }))
    .sort((a, b) => b.median - a.median || a.id.localeCompare(b.id));
  s.surfaces = [...from.entries()].map(([id, n]) => ({ id, n })).sort((a, b) => b.n - a.n || a.id.localeCompare(b.id));
  return s;
}

/** 24 x 24 line icons for the room's things. */
export const CORE_ICONS: Record<CoreObject | 'ease' | 'record' | 'station' | 'stats' | 'man' | 'settings', string> = {
  stats: 'M4 20h16 M7 20v-6 M11 20V8 M15 20v-9 M19 20V5',
  man: 'M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4z M20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z',
  settings: 'M4 7h9 M17 7h3 M4 17h3 M11 17h9 M15 5v4 M9 15v4',
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

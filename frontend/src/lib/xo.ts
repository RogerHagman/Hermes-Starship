// Number One's post (Deck 1, beside the Captain's chair): where every order came from, and where it
// went. Number One only routes: it reads the first words, picks the station that owns the ask, and
// files a card or answers in chat. The orders are the records (live/records.json, else the boards'
// orders); the fast path is each station's aliases; the rail rules are hermes/routing-rules.md.
import { SURFACE_WORD, records } from './computer';
import { inLastDays, openedOf, type Spot } from './post';
import type { Fixtures, Order } from '../types';

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

/** The first words that go straight to a station, without Number One deciding (patch P). */
export const FAST_WORDS: { say: string; to: string }[] = [
  { say: 'remind me…', to: 'yeoman' },
  { say: 'todo… / todo!…', to: 'yeoman' },
  { say: 'yeoman…', to: 'yeoman' },
];

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

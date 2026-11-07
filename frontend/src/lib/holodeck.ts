// The Holodeck board (Deck 4): where the ship's own interface is worked on. Where things are in
// the picture (assets/holodeck.svg, a 1600 x 740 box, drawn by tools/make_holodeck_svg.py),
// the list of the ship's assets, and the drafts of new sections spun up here.
// Drafts live in this browser only until the backend exists (H4); nothing is sent anywhere.
import { DECKS, DEPTS, RAIL } from './lookups';
import { SHIP_MAP } from './shipmap';
import type { RailColour, Station } from '../types';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the work screen. */
export type HoloObject = 'assets' | 'ship' | 'new' | 'safety' | 'programs' | 'bridge';

/** box: the area you can click, in picture units. label: where its name tag sits (its centre). */
export const SPOTS: { id: HoloObject; box: [number, number, number, number]; label: [number, number] }[] = [
  { id: 'assets',   box: [22, 108, 136, 548],   label: [90, 680] },
  { id: 'ship',     box: [340, 650, 320, 76],   label: [500, 640] },
  { id: 'new',      box: [928, 556, 184, 168],  label: [1020, 540] },
  { id: 'safety',   box: [1166, 584, 208, 136], label: [1270, 566] },
  { id: 'programs', box: [1474, 348, 96, 164],  label: [1522, 528] },
  { id: 'bridge',   box: [1452, 128, 140, 210], label: [1522, 110] },
];

/** The hologram of the ship, over the emitter. Same shape as ship.svg (2200 x 1060). */
export const PROJ = { x: 150, y: 128, w: 700, h: 337 };
/** The work screen, hanging in the air, where the page lays its console. */
export const SCREEN = { x: 880, y: 46, w: 560, h: 458 };

/** Percent of a box, for CSS left / top / width / height. */
export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** 24 x 24 line icons for the room's things (same style as the station icons). */
export const HOLO_ICONS: Record<HoloObject | 'ease' | 'room' | 'draft' | 'review', string> = {
  ease: 'M4 4h16v16H4z M4 9.3h16 M4 14.7h16 M9.3 4v16 M14.7 4v16',
  ship: 'M3 13c4-1 6-4 9-4s5 3 9 4c-4 1-6 3-9 3s-5-2-9-3z M12 9V5 M8 16l-2 3 M16 16l2 3',
  room: 'M4 7h16v10H4z M8 7V4h8v3 M8 12h8',
  assets: 'M5 3h14v18H5z M8 6h3v3H8z M13 6h3v3h-3z M8 11h3v3H8z M13 11h3v3h-3z M8 16h8',
  new: 'M4 4h16v16H4z M12 8v8 M8 12h8',
  draft: 'M5 4h14v16H5z M12 8v8 M8 12h8',
  safety: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  programs: 'M5 21V9a7 7 0 0 1 14 0v12 M12 2v19 M8 12h1 M15 12h1',
  bridge: 'M12 3l7 18-7-4-7 4z',
  review: 'M6 3v12 M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 9c0 6-12 3-12 6',
};

// ---------- the assets: every picture the boards draw ----------

/** Which generator draws an asset, so a change starts in the right file. */
export function generatorOf(file: string): string {
  if (file === 'ship.svg') return 'tools/make_ship_svg.py (from holodeck/ship-plan-v4-src)';
  if (file === 'quarters.svg') return 'tools/make_quarters_svg.py';
  if (file === 'holodeck.svg') return 'tools/make_holodeck_svg.py';
  if (file === 'bridge-chair.svg') return 'tools/make_bridge_chair_svg.py';
  const id = file.replace(/^station-(.+)\.svg$/, '$1');
  if (['xo', 'helm', 'nav', 'ops', 'screen'].includes(id)) return 'tools/make_bridge_stations_svg.py';
  return 'tools/make_deck_stations_svg.py';
}

export interface Asset { file: string; kb: number; station?: string; generator: string }

/** The assets from their file names and contents (see HolodeckBoard, which globs src/assets). */
export function assetsFrom(files: Record<string, string>): Asset[] {
  return Object.entries(files)
    .map(([path, text]) => {
      const file = path.replace(/^.*\//, '');
      const m = /^station-(.+)\.svg$/.exec(file);
      return { file, kb: Math.max(1, Math.round(new Blob([text]).size / 1024)), station: m?.[1], generator: generatorOf(file) };
    })
    .sort((a, b) => Number(!!a.station) - Number(!!b.station) || a.file.localeCompare(b.file));
}

// Every src/assets/*.svg, as text, keyed by its file name.
const FILES = import.meta.glob('../assets/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const ASSET_TEXT: Record<string, string> = Object.fromEntries(Object.entries(FILES).map(([k, v]) => [k.replace(/^.*\//, ''), v]));
export const ASSETS: Asset[] = assetsFrom(FILES);

// ---------- the programs: the boards, built and to come ----------

export const PROGRAMS: { id: string; what: string }[] = [
  { id: 'bridge', what: 'The ship plan, rails, hails, orders in flight, the duty roster and the ship\'s log.' },
  { id: 'quarters', what: 'Your hails in full, campaigns and missions, the order log, your own log and the Yeoman.' },
  { id: 'holodeck', what: 'This room: the ship as a hologram, its rooms and assets, and drafts of new sections.' },
  { id: 'science', what: 'Model evals, quantising runs and their logs.' },
  { id: 'sensors', what: 'Every watch on a long-range scope, findings with their sources, asks word for word, the quarantine.' },
  { id: 'engineering', what: 'Sol, Terra and Luna, the warp core shares, patches from brief to live.' },
  { id: 'conn', what: 'Handing the conn to Number One and back, with what is owed.' },
];

// ---------- the safety protocols: the rules every new section keeps ----------

export const PROTOCOLS: string[] = [
  'Boards are 2560 x 1440 and scale to fit the window.',
  'Nothing sits below the comm badge.',
  'Details open in place, in a console or on a screen. No drawers over the board.',
  'No decorative filler: every lit thing means something.',
  'Pagination is quiet: hollow dots, no numbers.',
  'Rail colours keep their meaning on every board.',
  'Art comes from a generator with a fixed seed, so it rebuilds the same.',
  'Nothing on a board calls a model. Fixtures first, live files from the probe.',
];

export const PIPELINE: { step: string; how: string }[] = [
  { step: 'Draw the room', how: 'holodeck/ship-plan-v4-src/rooms.py, then gen.py, then tools/make_ship_svg.py' },
  { step: 'Place it', how: 'src/lib/shipmap.ts places (x, y, width) and its icon' },
  { step: 'Crew it', how: 'fixtures/stations.json, status "proposed" until you approve the hire' },
  { step: 'Station art', how: 'tools/make_deck_stations_svg.py writes src/assets/station-<id>.svg' },
  { step: 'Check', how: 'npm run check, then a PR with the version bumped' },
];

// ---------- drafts: new sections spun up on this screen ----------

export type DraftRail = Exclude<RailColour, 'captain'>;

export interface Draft {
  id: string;            // DRAFT-1, DRAFT-2, ...
  name: string;          // "Stellar Observatory"
  short: string;         // what the tile says
  kind: 'station' | 'place';
  deck: number;          // 1 to 8
  dept: string;          // a DEPTS id
  rail: DraftRail;
  duty: string;          // what it is for
  x: number;             // where it sits on the ship plan (ship.svg units)
  y: number;
  w: number;
  at: string;            // when it was drafted
}

/** The top of each deck's row of rooms on the ship plan, from the places in SHIP_MAP. */
export const DECK_ROWS: Record<number, number> = { 1: 58, 2: 242, 3: 338, 4: 434, 5: 530, 6: 732, 7: 828, 8: 924 };

/** The deck whose row is nearest a height on the ship plan. */
export function deckAt(y: number): number {
  let best = 1;
  for (const [d, top] of Object.entries(DECK_ROWS)) {
    if (Math.abs(top + SHIP_MAP.tileHeight / 2 - y) < Math.abs(DECK_ROWS[best] + SHIP_MAP.tileHeight / 2 - y)) best = Number(d);
  }
  return best;
}

/** True when a draft at x on its deck would overlap a room that is already there. */
export function overlaps(d: Pick<Draft, 'x' | 'y' | 'w'>, drafts: Draft[] = [], skip?: string): boolean {
  const boxes = [
    ...Object.values(SHIP_MAP.places as Record<string, { x: number; y: number; w: number }>),
    ...drafts.filter((o) => o.id !== skip),
  ];
  return boxes.some((p) => p.y === d.y && d.x < p.x + p.w && p.x < d.x + d.w);
}

export function nextDraftId(drafts: Draft[]): string {
  const n = drafts.reduce((m, d) => Math.max(m, Number(d.id.replace(/\D/g, '')) || 0), 0);
  return `DRAFT-${n + 1}`;
}

/**
 * The brief for the Holodeck crew, in the four questions the ship writes every brief in.
 * Plain text, so it can be pasted into a card as it is.
 */
export function draftBrief(d: Draft, stations: Station[]): string {
  const dept = DEPTS.find((x) => x.id === d.dept);
  const neighbours = stations.filter((s) => s.deck === d.deck).map((s) => s.short);
  return [
    `GOAL`,
    `Add a new ${d.kind === 'place' ? 'place' : 'station'} to the ship: ${d.name} ("${d.short}"), on Deck ${d.deck} (${DECKS[d.deck - 1]}).`,
    ``,
    `CONTEXT`,
    `- What it is for: ${d.duty || 'not written yet'}`,
    `- Department: ${dept?.name ?? d.dept}. Rail: ${RAIL[d.rail].legend}.`,
    `- Where: the ship plan at x ${d.x}, y ${d.y}, width ${d.w} (src/lib/shipmap.ts places).`,
    `- On the same deck: ${neighbours.join(', ') || 'nobody yet'}.`,
    `- Drafted on the Holodeck board as ${d.id}.`,
    ``,
    `CONSTRAINTS`,
    `- Draw the room in holodeck/ship-plan-v4-src/rooms.py and rebuild ship.svg with tools/make_ship_svg.py.`,
    `- Station art from tools/make_deck_stations_svg.py with a fixed seed.`,
    d.kind === 'station' ? `- Add it to fixtures/stations.json as "proposed". Only the Captain approves a hire.` : `- Add it to fixtures/stations.json as a place.`,
    `- Keep the safety protocols: nothing below the comm badge, no drawers, no decorative filler.`,
    `- Bump __version__.py by the last number.`,
    ``,
    `DONE WHEN`,
    `- The room shows on the Bridge's ship plan and on the Holodeck's hologram.`,
    `- Its tile opens its console on three pages, like every other station.`,
    `- npm run check passes, and a PR is open for the Captain to review.`,
  ].join('\n');
}

// Drafts are kept in this browser only. Storage can be blocked, so never rely on it.
const DRAFTS_KEY = 'hermes.holoDrafts';

export function loadDrafts(): Draft[] {
  try {
    const v = JSON.parse(localStorage.getItem(DRAFTS_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((d) => d && typeof d.id === 'string' && typeof d.x === 'number') : [];
  } catch { return []; }
}

export function saveDrafts(drafts: Draft[]): void {
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts)); } catch { /* no storage: screen only */ }
}

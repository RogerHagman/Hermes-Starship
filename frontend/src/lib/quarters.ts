// Where things are in the Captain's Quarters picture (assets/quarters.svg, a 1600 x 740 box),
// and the small helpers the Quarters board uses. Redraw the room in tools/make_quarters_svg.py,
// then move the boxes here to match.

import { shipTimeZone } from './format';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the wall screen. */
export type RoomObject = 'viewport' | 'chair' | 'reading' | 'orders' | 'log' | 'yeoman' | 'bridge';

/**
 * box: the area you can click, in picture units. label: where its name tag sits (its centre,
 * or its right end when `hang` is set, so the plaque's tag stays clear of the wall screen).
 * The chair comes after the viewport, so it sits on top where they overlap.
 */
export const SPOTS: { id: RoomObject; box: [number, number, number, number]; label: [number, number]; hang?: boolean }[] = [
  { id: 'reading',  box: [22, 78, 114, 522],   label: [79, 60] },
  { id: 'viewport', box: [144, 86, 512, 480],  label: [400, 122] },
  { id: 'chair',    box: [256, 288, 288, 432], label: [400, 262] },
  { id: 'orders',   box: [664, 110, 64, 360],  label: [738, 492], hang: true },
  { id: 'log',      box: [804, 502, 156, 92],  label: [882, 630] },
  { id: 'yeoman',   box: [988, 570, 104, 40],  label: [1040, 630] },
  { id: 'bridge',   box: [1190, 496, 250, 100], label: [1312, 630] },
];

/** The wall screen's glass, where the page lays its console. */
export const WALL = { x: 752, y: 56, w: 820, h: 436 };

/** Percent of the picture, for CSS left / top / width / height. */
export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** 24 x 24 line icons for the room's things (same style as the station icons). */
export const ROOM_ICONS: Record<RoomObject | 'ease', string> = {
  ease: 'M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6',
  chair: 'M7 3h10v10H7z M5 13h14 M8 13v4 M16 13v4 M12 17v4 M8 21h8',
  viewport: 'M4 5h16l-1.5 14h-13z M10 5l-.8 14 M14 5l.8 14',
  reading: 'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
  orders: 'M7 3h10v18H7z M12 5.5l2 4-2-1.2-2 1.2z M9.5 12h5 M9.5 15h5 M9.5 18h3',
  log: 'M4 4h16v12H4z M8 20h8 M12 16v4 M7 8h7 M7 11h10',
  yeoman: 'M8 4h8v3H8z M6 5H5v16h14V5h-1 M8 12l2 2 4-4 M8 17h8',
  bridge: 'M12 3l7 18-7-4-7 4z',
};

/** "Good evening" by the ship's clock. */
export function greeting(now: Date): string {
  const h = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: shipTimeZone() }).format(now));
  if (h >= 5 && h < 12) return 'Good morning, Captain.';
  if (h >= 12 && h < 17) return 'Good afternoon, Captain.';
  if (h >= 17 && h < 23) return 'Good evening, Captain.';
  return 'The late watch, Captain.';
}

/**
 * The ship's stardate: the year, then how far through it we are, in thousandths.
 * 1 Jan is .000, 31 Dec ends near .997. A Hermes convention, not anyone else's.
 */
export function stardate(now: Date): string {
  const y = now.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const days = (Date.UTC(y + 1, 0, 1) - start) / 86400000;
  const part = Math.floor(((now.getTime() - start) / 86400000 / days) * 1000);
  return `${y}.${String(part).padStart(3, '0')}`;
}

/** Local hour and minute in the ship's time zone, for the windows chart. */
export function localHM(t: number): [number, number] {
  const parts = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: shipTimeZone() }).formatToParts(new Date(t));
  return [Number(parts.find((p) => p.type === 'hour')!.value), Number(parts.find((p) => p.type === 'minute')!.value)];
}

/**
 * The nights between two times, as [start, end] pairs in ms. Night is 22:00 to 07:00 in
 * Stockholm: the hours when Codex and Claude may use their full windows (standing order 5).
 */
export function nights(from: number, to: number, step = 5 * 60000): [number, number][] {
  const out: [number, number][] = [];
  let start: number | null = null;
  for (let t = from; t <= to; t += step) {
    const [h] = localHM(t);
    const dark = h >= 22 || h < 7;
    if (dark && start === null) start = t;
    if (!dark && start !== null) { out.push([start, t]); start = null; }
  }
  if (start !== null) out.push([start, to]);
  return out;
}

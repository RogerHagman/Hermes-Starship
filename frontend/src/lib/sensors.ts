// The Sensor array board (Deck 3): where things are in the picture (assets/sensors.svg, a
// 1600 x 740 box, drawn by tools/make_sensors_svg.py), and the scope's geometry: where each
// watch shows as a contact. Data comes from fixtures/sensors.json.
import type { SensorsFile } from '../types';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the work screen. */
export type SensorObject = 'scope' | 'watches' | 'asks' | 'findings' | 'quarantine' | 'bridge';

export const SPOTS: { id: SensorObject; box: [number, number, number, number]; label: [number, number] }[] = [
  { id: 'bridge',     box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'watches',    box: [170, 566, 440, 150], label: [390, 552] },
  { id: 'asks',       box: [660, 246, 184, 478], label: [752, 228] },
  { id: 'findings',   box: [1004, 570, 272, 144], label: [1140, 552] },
  { id: 'quarantine', box: [1458, 146, 132, 578], label: [1524, 128] },
];

/** The scope's glass: the page draws the live scope here (centre and radius, picture units). */
export const SCOPE = { cx: 390, cy: 290, r: 200 };
/** The work screen, where the page lays its console. */
export const SCREEN = { x: 880, y: 46, w: 560, h: 458 };

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

export type Watch = SensorsFile['watches'][number];
export type Sector = Watch['sector'];

/** The four sectors of the scope, clockwise from the top. Each is a quarter of the circle. */
export const SECTORS: { id: Sector; label: string; from: number }[] = [
  { id: 'jobs', label: 'JOBS', from: -90 },
  { id: 'market', label: 'MARKET', from: 0 },
  { id: 'tech', label: 'TECH', from: 90 },
  { id: 'home', label: 'HOME', from: 180 },
];

const DAY = 86_400_000;
export const CADENCE_MS: Record<Watch['cadence'], number> = { daily: DAY, weekly: 7 * DAY, monthly: 30 * DAY };

/**
 * How far round its scan a watch is: 0 just scanned, 1 due now (or late). The scope draws
 * a watch near the rim when it has just been scanned, and closer to the centre as its next
 * scan comes up, so what is due soon sits in the middle.
 */
export function progress(w: Watch, now: number): number {
  const last = Date.parse(w.lastScan), next = Date.parse(w.nextScan);
  if (!(next > last)) return 1;
  return Math.min(1, Math.max(0, (now - last) / (next - last)));
}

/**
 * Where a watch shows on the scope, as an angle (degrees, 0 = east, clockwise) and a range
 * (0 centre to 1 rim). Watches in a sector are spread evenly across it. Paused watches sit
 * on the rim.
 */
export function contactOf(w: Watch, all: Watch[], now: number): { angle: number; range: number } {
  const sector = SECTORS.find((s) => s.id === w.sector)!;
  const mates = all.filter((x) => x.sector === w.sector);
  const i = mates.findIndex((x) => x.id === w.id);
  const angle = sector.from + (90 * (i + 1)) / (mates.length + 1);
  const range = w.state === 'paused' ? 0.96 : 0.18 + 0.74 * (1 - progress(w, now));
  return { angle, range };
}

/** A point on the scope in its own 0..200 box (centre 100, 100), from an angle and a range. */
export function polar(angle: number, range: number, r = 92): { x: number; y: number } {
  const a = (angle * Math.PI) / 180;
  return { x: 100 + r * range * Math.cos(a), y: 100 + r * range * Math.sin(a) };
}

/** "in 3 h", "in 2 days", "due now". */
export function untilLabel(iso: string, now: number): string {
  const ms = Date.parse(iso) - now;
  if (ms <= 0) return 'due now';
  const h = Math.round(ms / 3_600_000);
  if (h < 1) return 'within the hour';
  if (h < 36) return `in ${h} h`;
  return `in ${Math.round(h / 24)} days`;
}

/** 24 x 24 line icons for the room's things (same style as the station icons). */
export const SENSOR_ICONS: Record<SensorObject | 'ease' | 'watch', string> = {
  ease: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0 M12 12l6-6',
  scope: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 3v18 M3 12h18',
  watch: 'M12 5a7 7 0 1 0 0.01 0 M12 8v4l3 2',
  watches: 'M4 6h16 M4 12h16 M4 18h10 M18 16l2 2 3-3',
  asks: 'M5 5h14v10H9l-4 4z M9 9h1 M14 9h1',
  findings: 'M7 3h10v18H7z M9.5 7h5 M9.5 10h5 M9.5 13h3',
  quarantine: 'M5 4h14v16H5z M5 9h14 M10 13h4v4h-4z',
  bridge: 'M12 3l7 18-7-4-7 4z',
};

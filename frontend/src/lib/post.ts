// What the four Bridge posts share: Number One's post, Helm, Navigation and the Main Viewscreen.
// Each room picture (tools/make_bridge_posts_svg.py) is a 1600 x 740 box with the wall screen and
// the desk top in the same place, so the page lays its views and tiles at the same spots. A post's
// own lib file lists the things in its room (SPOTS) at the same numbers as the picture.
import { dayKey } from './format';
import { records } from './computer';
import type { Fixtures, Order } from '../types';

export const ROOM = { w: 1600, h: 740 };
/** The wall screen, where the page lays the views. */
export const SCREEN = { x: 536, y: 40, w: 716, h: 456 };
/** The desk top, where the page lays the tiles. */
export const TABLE = { x: 392, y: 600, w: 640, h: 100 };

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

export interface Spot<T extends string> { id: T; box: [number, number, number, number]; label: [number, number] }

const DAY = 86_400_000;

/** Every order on file for these stations, newest first. */
export function ordersOf(data: Fixtures, ids: string[]): Order[] {
  return records(data).filter((o) => ids.includes(o.station));
}

/** When an order came in, or the closest time the records have. */
export const openedOf = (o: Order) => o.openedAt ?? o.updatedAt;

/** The last n ship's days, oldest first, ending on the day of asOf. */
export function lastDays(asOf: string, n = 7): { key: string; label: string }[] {
  const [y, m, d] = dayKey(asOf).split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const t = new Date(Date.UTC(y, m - 1, d - (n - 1) + i, 12));
    return { key: t.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(t).toUpperCase() };
  });
}

/** Is this time within the n ship's days that end on the day of asOf? */
export function inLastDays(iso: string | undefined, asOf: string, n = 7): boolean {
  if (!iso) return false;
  return lastDays(asOf, n).some((d) => d.key === dayKey(iso));
}

/** Whole days from a to b (b later), rounded down. */
export const daysBetween = (a: string, b: string) => Math.floor((Date.parse(b) - Date.parse(a)) / DAY);

/** A date as the ship's day key, YYYY-MM-DD. */
export { dayKey };

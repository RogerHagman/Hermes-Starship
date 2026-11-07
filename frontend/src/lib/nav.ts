// Navigation (Deck 1, flight control): the calendar, travel and bookings. Trip plans and itineraries,
// slots for the Yeoman's Schedule box, commute options for Helm. Bookings stop before Confirm: a held
// booking waits for the Captain. Navigation keeps no files of its own yet, so its charts are the
// sample (fixtures/nav.json); its orders are live, and the Schedule box is the Yeoman's real list.
import { clockTime, dayKey, dayLine } from './format';
import type { Spot } from './post';
import { matrix, nowOf } from './yeoman';
import type { Booking, Fixtures, NavEvent, NavFile, Todo, Trip } from '../types';

export type NavObject = 'bridge' | 'chart' | 'week' | 'bookings' | 'slots' | 'helm' | 'orders' | 'desk';

export const SPOTS: Spot<NavObject>[] = [
  { id: 'bridge',   box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'chart',    box: [160, 56, 362, 250],  label: [341, 22] },
  { id: 'week',     box: [160, 318, 362, 180], label: [341, 508] },
  { id: 'bookings', box: [1272, 64, 116, 198], label: [1330, 40] },
  { id: 'slots',    box: [1266, 290, 128, 274], label: [1330, 584] },
  { id: 'helm',     box: [1400, 96, 188, 468], label: [1494, 500] },
  { id: 'orders',   box: [194, 580, 166, 130], label: [276, 566] },
  { id: 'desk',     box: [1056, 580, 196, 140], label: [1154, 566] },
];

export const KIND_WORD: Record<NavEvent['kind'], string> = { appointment: 'Appointment', travel: 'Travel', work: 'Work', personal: 'Personal', hold: 'Held slot' };
export const KIND_COLOUR: Record<NavEvent['kind'], string> = { appointment: '#6fb7f2', travel: '#b9a6f5', work: '#ef7a6a', personal: '#8fd14f', hold: 'var(--captain)' };
export const TRIP_WORD: Record<Trip['status'], string> = { idea: 'Idea', planned: 'Planned', booked: 'Booked', done: 'Done' };
export const TRIP_COLOUR: Record<Trip['status'], string> = { idea: '#7a8696', planned: '#6fb7f2', booked: '#8fd14f', done: '#7a8696' };
export const BOOKING_WORD: Record<Booking['status'], string> = { held: 'Held for you', confirmed: 'Confirmed', released: 'Released' };
export const BOOKING_COLOUR: Record<Booking['status'], string> = { held: 'var(--captain)', confirmed: '#8fd14f', released: '#7a8696' };
export const MODE_WORD: Record<NonNullable<Trip['legs']>[number]['mode'], string> = {
  train: 'Train', bus: 'Bus', car: 'Car', flight: 'Flight', ferry: 'Ferry', walk: 'Walk', bike: 'Bike',
};

/** The day of an instant and its time, in the ship's time zone: "THU 5 NOV · 09:00". */
export const when = (iso: string) => `${dayLine(iso)} · ${clockTime(iso)}`;
/** A span of time on one day: "09:00–09:45". */
export const span = (e: { start: string; end?: string }) => (e.end ? `${clockTime(e.start)}–${clockTime(e.end)}` : clockTime(e.start));

/** The next n ship's days, from the day of asOf: { key, label, short }. */
export function nextDays(asOf: string, n = 7): { key: string; label: string; short: string }[] {
  const [y, m, d] = dayKey(asOf).split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const t = new Date(Date.UTC(y, m - 1, d + i, 12));
    return { key: t.toISOString().slice(0, 10), label: dayLine(t.toISOString()), short: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(t).toUpperCase() };
  });
}

/** What is on one ship's day, by start time. */
export function dayOf(f: NavFile, key: string): NavEvent[] {
  return f.events.filter((e) => dayKey(e.start) === key).sort((a, b) => a.start.localeCompare(b.start));
}

/** The coming events from asOf on, soonest first. */
export const coming = (f: NavFile) => f.events.filter((e) => (e.end ?? e.start) >= f.asOf).sort((a, b) => a.start.localeCompare(b.start));

/** Bookings, the held ones first (soonest hold running out), then confirmed, then released. */
export function bookings(f: NavFile): Booking[] {
  const rank = { held: 0, confirmed: 1, released: 2 } as const;
  return [...f.bookings].sort((a, b) => rank[a.status] - rank[b.status] || (a.heldUntil ?? a.when).localeCompare(b.heldUntil ?? b.when));
}
export const held = (f: NavFile) => f.bookings.filter((b) => b.status === 'held');

/** Hours left on a hold, from asOf (negative when it has run out). */
export const holdLeft = (b: Booking, asOf: string) => (b.heldUntil ? Math.round((Date.parse(b.heldUntil) - Date.parse(asOf)) / 3_600_000) : null);

/** Trips from the soonest; ideas and done ones last. */
export function trips(f: NavFile): Trip[] {
  const rank = { booked: 0, planned: 1, idea: 2, done: 3 } as const;
  return [...f.trips].sort((a, b) => rank[a.status] - rank[b.status] || a.depart.localeCompare(b.depart));
}

/** The stops on a trip, in order: where it starts, each change, where it ends. */
export function stops(t: Trip): string[] {
  if (!t.legs?.length) return [t.from, t.to];
  return [t.legs[0].from, ...t.legs.map((l) => l.to)];
}

/** The day's waking hours, ship's time: free windows of an hour or more are offered as slots. */
export const DAY_FROM = '08:00';
export const DAY_TO = '20:00';
const mins = (hhmm: string) => +hhmm.slice(0, 2) * 60 + +hhmm.slice(3, 5);
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Free windows of an hour or more on each of the next 7 days, between 08:00 and 20:00, after now. */
export function freeSlots(f: NavFile, n = 7): { key: string; label: string; windows: { from: string; to: string }[]; over: boolean }[] {
  const today = dayKey(f.asOf);
  return nextDays(f.asOf, n).map((d) => {
    let start = mins(DAY_FROM);
    if (d.key === today) start = Math.max(start, Math.ceil(mins(clockTime(f.asOf)) / 30) * 30);
    const end = mins(DAY_TO);
    const busy = dayOf(f, d.key).map((e) => [mins(clockTime(e.start)), e.end && dayKey(e.end) === d.key ? mins(clockTime(e.end)) : mins(clockTime(e.start)) + 60] as const);
    const windows: { from: string; to: string }[] = [];
    let at = start;
    for (const [s, e] of busy.sort((a, b) => a[0] - b[0])) {
      if (s - at >= 60) windows.push({ from: hhmm(at), to: hhmm(Math.min(s, end)) });
      at = Math.max(at, e);
    }
    if (end - at >= 60) windows.push({ from: hhmm(at), to: hhmm(end) });
    return { key: d.key, label: d.label, windows: windows.filter((w) => mins(w.to) - mins(w.from) >= 60), over: end - start < 60 };
  });
}

/** The Yeoman's Schedule box: important, not urgent. Each one wants a slot in the calendar. */
export const wanted = (data: Fixtures): Todo[] => matrix(data.yeoman, nowOf(data)).schedule;

/** 24 x 24 line icons for the room's things. */
export const NAV_ICONS: Record<NavObject | 'ease' | 'trip' | 'agenda', string> = {
  ease: 'M4 5h16v15H4z M4 9h16 M9 3v4 M15 3v4 M8 13h3 M13 13h3 M8 16h3',
  agenda: 'M4 6h3 M4 12h3 M4 18h3 M10 6h10 M10 12h10 M10 18h7',
  trip: 'M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M19 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M7 16c6 0 4-10 10-10',
  bridge: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M12 3v18',
  chart: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z',
  week: 'M4 5h16v15H4z M4 9h16 M9 3v4 M15 3v4',
  bookings: 'M4 7h16v10H4z M8 7v10 M12 11h5 M12 14h3',
  slots: 'M5 4h14v16H5z M5 9h14 M5 14h14 M9 4v16',
  helm: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16',
  orders: 'M6 3h9l3 3v15H6z M9 9h6 M9 13h6 M9 17h4',
  desk: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
};

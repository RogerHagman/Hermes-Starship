// The task clock: how long an order has been open, and how long a finished one took.
import type { Order } from '../types';

const S = 1000;

/**
 * "Now" for the clock. Live orders tick with the real clock; the sample orders are measured
 * from their file's asOf, so the sample page reads the same whenever it is opened.
 */
export function clockNow(file: { synthetic: boolean; asOf: string }, now = Date.now()): number {
  const asOf = Date.parse(file.asOf);
  if (file.synthetic) return asOf;
  return Number.isFinite(asOf) ? Math.max(now, asOf) : now;
}

/** A length of time to the second while it is short: 34 s, 3 min 12 s, 1 h 05 min, 2 d 3 h. */
export function duration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / S));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ${String(s % 60).padStart(2, '0')} s`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h ${String(m % 60).padStart(2, '0')} min`;
  return `${Math.floor(h / 24)} d ${h % 24} h`;
}

export interface Clock {
  /** running: open and ticking; done: stopped, with the total. */
  kind: 'running' | 'done';
  /** Milliseconds from the order coming in to now (open) or to its close (done). */
  total: number;
  /** Milliseconds a crew member worked on it: from the first card's start to the close (or now). */
  worked?: number;
  /** The line the boards show: "took 34 s · worked 30 s", "running 3 min 12 s". */
  text: string;
  /** Just the total, for a narrow column: "34 s". */
  short: string;
  /** The total with its word and no worked part, for a field of its own: "took 34 s". */
  main: string;
  /** The worked time alone ("30 s"), when a card was claimed; else undefined. */
  effective?: string;
}

const between = (from?: string, to?: number) => {
  const a = from ? Date.parse(from) : NaN;
  const ms = (to ?? NaN) - a;
  return Number.isFinite(ms) && ms >= 0 ? ms : undefined;
};

/** The clock for an order, or null when it has no opening time to count from. */
export function taskClock(o: Order, now: number): Clock | null {
  const done = o.state === 'done';
  const end = done ? (o.closedAt ? Date.parse(o.closedAt) : NaN) : now;
  const total = between(o.openedAt, end);
  if (total === undefined) return null;
  const worked = between(o.startedAt, end);
  // Only worth a second number when the order waited a noticeable while before anyone started.
  const extra = worked !== undefined && total - worked >= 5 * S ? ` · worked ${duration(worked)}` : '';
  const word = done ? 'took' : o.state === 'running' ? 'running' : 'open';
  return { kind: done ? 'done' : 'running', total, worked, text: `${word} ${duration(total)}${extra}`, short: duration(total),
    main: `${word} ${duration(total)}`, effective: worked === undefined ? undefined : duration(worked) };
}

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

/** A length of time to the second while it is short: 34 S, 3 MIN 12 S, 1 H 05 MIN, 2 D 3 H. */
export function duration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / S));
  if (s < 60) return `${s} S`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} MIN ${String(s % 60).padStart(2, '0')} S`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} H ${String(m % 60).padStart(2, '0')} MIN`;
  return `${Math.floor(h / 24)} D ${h % 24} H`;
}

export interface Clock {
  /** running: open and ticking; done: stopped, with the total. */
  kind: 'running' | 'done';
  /** Milliseconds from the order coming in to now (open) or to its close (done). */
  total: number;
  /** Milliseconds a crew member worked on it: from the first card's start to the close (or now). */
  worked?: number;
  /** The line the boards show: "TOOK 34 S · WORKED 30 S", "RUNNING 3 MIN 12 S". */
  text: string;
  /** Just the total, for a narrow column: "34 S". */
  short: string;
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
  const extra = worked !== undefined && total - worked >= 5 * S ? ` · WORKED ${duration(worked)}` : '';
  const word = done ? 'TOOK' : o.state === 'running' ? 'RUNNING' : 'OPEN';
  return { kind: done ? 'done' : 'running', total, worked, text: `${word} ${duration(total)}${extra}`, short: duration(total) };
}

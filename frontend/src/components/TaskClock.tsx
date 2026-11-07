// The task clock on an order: ticks each second while the order is open, stops when it closes.
import { useEffect, useState } from 'react';
import { clockNow, taskClock, type Clock } from '../lib/clock';
import type { ShipView } from '../lib/ship';
import type { Order } from '../types';

export function useClock(ship: ShipView, o: Order | undefined) {
  const file = ship.data.orders;
  const [now, setNow] = useState(() => clockNow(file));
  const open = !!o && o.state !== 'done' && !file.synthetic;
  useEffect(() => {
    setNow(clockNow(file));
    if (!open) return;
    const t = setInterval(() => setNow(clockNow(file)), 1000);
    return () => clearInterval(t);
  }, [file, open]);
  return o ? taskClock(o, now) : null;
}

/** The clock as a short tag; nothing when the order has no opening time. */
export function TaskClock({ ship, order, className = 'taskclock', short = false, effective = false }: {
  ship: ShipView; order: Order; className?: string; short?: boolean; effective?: boolean;
}) {
  const clock = useClock(ship, order);
  if (!clock) return null;
  // The effective time alone, for the terminal's EFFECTIVE column: always a duration.
  if (effective) return <span className={`${className} ${clock.kind}`} title={EFFECTIVE_WHY[clock.effectiveFrom]}>{clock.effective}</span>;
  return (
    <span className={`${className} ${clock.kind}`} title={short ? clock.text : clock.kind === 'done'
      ? 'Task clock: from the order coming in to it closing'
      : 'Task clock: time since the order came in, ticking while it is open'}>
      {short ? clock.short : clock.text}
    </span>
  );
}

/**
 * The clock as two fields of an order's record: CLOCK (from the order coming in) and EFFECTIVE
 * (from a crew member starting on it). Nothing without an opening time.
 */
export function ClockRow({ ship, order }: { ship: ShipView; order: Order }) {
  const clock = useClock(ship, order);
  if (!clock) return null;
  const cls = `taskclock ${clock.kind}`;
  return (
    <>
      <div><dt>CLOCK</dt><dd><span className={cls} title="From the order coming in to now, or to its close">{clock.main}</span></dd></div>
      <div><dt>EFFECTIVE</dt><dd><span className={cls} title={EFFECTIVE_WHY[clock.effectiveFrom]}>{clock.effective}</span></dd></div>
    </>
  );
}

/** Where the effective time comes from, for its tooltip. */
const EFFECTIVE_WHY: Record<Clock['effectiveFrom'], string> = {
  start: 'Effective: from a crew member starting on it (the first card claimed) to now, or to its close',
  waiting: 'Effective: 0 s, no crew member has started on it yet',
  whole: 'Effective: the whole clock, no card start on file (answered in chat, or the card has no start time)',
};

// The task clock on an order: ticks each second while the order is open, stops when it closes.
import { useEffect, useState } from 'react';
import { clockNow, taskClock } from '../lib/clock';
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
export function TaskClock({ ship, order, className = 'taskclock', short = false }: { ship: ShipView; order: Order; className?: string; short?: boolean }) {
  const clock = useClock(ship, order);
  if (!clock) return null;
  return (
    <span className={`${className} ${clock.kind}`} title={short ? clock.text : clock.kind === 'done'
      ? 'Task clock: from the order coming in to it closing'
      : 'Task clock: time since the order came in, ticking while it is open'}>
      {short ? clock.short : clock.text}
    </span>
  );
}

/** The clock as a row of an order's record ("CLOCK  TOOK 34 S"); nothing without an opening time. */
export function ClockRow({ ship, order }: { ship: ShipView; order: Order }) {
  const clock = useClock(ship, order);
  if (!clock) return null;
  return <div><dt>CLOCK</dt><dd><TaskClock ship={ship} order={order} /></dd></div>;
}

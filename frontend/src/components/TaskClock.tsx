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
export function TaskClock({ ship, order, className = 'taskclock', short = false, effective = false }: {
  ship: ShipView; order: Order; className?: string; short?: boolean; effective?: boolean;
}) {
  const clock = useClock(ship, order);
  if (!clock) return null;
  // The worked time alone, for the terminal's EFFECTIVE column: a dash when no card was claimed.
  if (effective) {
    return <span className={`${className} ${clock.effective ? clock.kind : 'done'}`}
      title={clock.effective ? `Effective: worked ${clock.effective}` : 'No card was claimed'}>{clock.effective ?? '–'}</span>;
  }
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
      <div><dt>EFFECTIVE</dt><dd>{clock.effective
        ? <span className={cls} title="From a crew member starting on it (the first card claimed) to now, or to its close">{clock.effective}</span>
        : <span className="taskclock done" title={noStartWhy(order)}>{noStartWord(order)}</span>}</dd></div>
    </>
  );
}

/** What EFFECTIVE says when there is no start time: no card at all, a card not yet claimed, or a card with no start on file. */
export function noStartWord(o: Order): string {
  if (!o.cards) return o.state === 'done' ? 'no card' : 'not started';
  return o.state === 'queued' ? 'not started' : 'no start time';
}

function noStartWhy(o: Order): string {
  if (!o.cards) return 'No card was filed: answered in chat, or not picked up yet';
  if (o.state === 'queued') return 'The card is waiting for a crew member to claim it';
  return 'The card has no start time on file (the ship probe writes it from the card’s started_at)';
}

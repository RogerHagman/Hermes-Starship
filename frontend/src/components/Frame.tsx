// The LCARS frame around the board: the top elbow and the top bar. Nothing sits below the comm badge.
import type { ReactNode } from 'react';
import type { ShipView } from '../lib/ship';
import { RAIL_IDS } from '../lib/ship';

export function Frame({ ship, side, children }: { ship: ShipView | null; side: ReactNode; children: ReactNode }) {
  return (
    <div className="frame">
      <div className="elbow elbow-top" aria-hidden="true" />
      <header className="topbar">
        <div className="topbar-stats mono">{ship ? topbarStats(ship) : '—'}</div>
        <span className="seg seg-gold" aria-hidden="true" />
        <span className="seg seg-local" aria-hidden="true" />
        <span className="seg seg-claude" aria-hidden="true" />
        <span className="seg seg-end" aria-hidden="true" />
      </header>
      {side}
      {children}
    </div>
  );
}

function topbarStats(ship: ShipView): string {
  const crew = ship.data.stations.stations.filter((s) => s.kind !== 'place');
  const onDuty = crew.filter((s) => s.status === 'live' && !ship.off(s)).length;
  const up = RAIL_IDS.filter((r) => ship.rail(r) !== 'out').length;
  const hails = ship.data.orders.orders.filter((o) => o.state === 'awaiting-captain').length;
  return `${crew.length} CREW · ${onDuty} ON DUTY · ${up} OF 3 RAILS UP · ${hails} HAILS`;
}

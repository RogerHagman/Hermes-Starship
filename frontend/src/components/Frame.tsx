// The LCARS frame around the board: the top elbow and the top bar. Nothing sits below the comm badge.
import type { ReactNode } from 'react';
import type { BoardId } from '../lib/board';
import { dayAndTime } from '../lib/format';
import type { ShipView } from '../lib/ship';
import { RAIL_IDS } from '../lib/ship';

export function Frame({ ship, board, side, children }: { ship: ShipView | null; board: BoardId; side: ReactNode; children: ReactNode }) {
  return (
    <div className="frame">
      <div className="elbow elbow-top" aria-hidden="true" />
      <header className="topbar">
        <div className="topbar-stats mono">{ship ? (board === 'quarters' ? quartersStats(ship) : bridgeStats(ship)) : '—'}</div>
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

function hailCount(ship: ShipView): number {
  return ship.data.orders.orders.filter((o) => o.state === 'awaiting-captain').length;
}

function bridgeStats(ship: ShipView): string {
  const crew = ship.data.stations.stations.filter((s) => s.kind !== 'place');
  const onDuty = crew.filter((s) => s.status === 'live' && !ship.off(s)).length;
  const up = RAIL_IDS.filter((r) => ship.rail(r) !== 'out').length;
  return `${crew.length} CREW · ${onDuty} ON DUTY · ${up} OF 3 RAILS UP · ${hailCount(ship)} HAILS`;
}

function quartersStats(ship: ShipView): string {
  const q = ship.data.quarters;
  const flying = q.missions.filter((m) => m.status === 'in-flight').length;
  const burn = ship.data.rails.rails.find((r) => r.burn?.active && r.burn.until && ship.rail(r.id) !== 'out');
  const relieved = ship.relieved.size ? ` · ${ship.relieved.size} RELIEVED` : '';
  return `${q.campaigns.length} CAMPAIGNS · ${flying} MISSIONS IN FLIGHT · ${hailCount(ship)} HAILS`
    + (burn?.burn?.until ? ` · BURN TO ${dayAndTime(burn.burn.until).toUpperCase()}` : '') + relieved;
}

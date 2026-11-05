// The picture beside a Bridge station's card, like the Captain's chair has its own.
// The art comes from tools/make_bridge_stations_svg.py. Two CSS variables light it:
// --sa-glow dims the station's lights while it is off duty (relieved, or its rail is out),
// and --sa-burn shows warp streaks on the viewscreen while the burn is on.
import { useMemo } from 'react';
import xo from '../assets/station-xo.svg?raw';
import helm from '../assets/station-helm.svg?raw';
import nav from '../assets/station-nav.svg?raw';
import ops from '../assets/station-ops.svg?raw';
import screen from '../assets/station-screen.svg?raw';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';

const ART: Record<string, string> = { xo, helm, nav, ops, screen };

/** True when this station has a picture. */
export const hasArt = (id: string) => id in ART;

/** The burn is on while a rail that has an open burn window is not out. */
export const burning = (ship: ShipView) => ship.data.rails.rails.some((r) => r.burn?.active && ship.rail(r.id) !== 'out');

export function StationArt({ ship, st }: { ship: ShipView; st: Station }) {
  const look = { '--sa-glow': ship.off(st) ? 0.25 : 1, '--sa-burn': burning(ship) ? 1 : 0 } as React.CSSProperties;
  // The picture is our own file, never fixture text, and is inserted once per station.
  const svg = useMemo(() => <div className="cchair-svg" dangerouslySetInnerHTML={{ __html: ART[st.id] }} />, [st.id]);
  return <div className="cchair-art station-art-wrap" style={look}>{svg}</div>;
}

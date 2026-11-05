// The picture for a station, like the Captain's chair has its own. StationScene.tsx shows it
// in the console.
// The art comes from two generators: tools/make_bridge_stations_svg.py (the Bridge) and
// tools/make_deck_stations_svg.py (decks 2 to 8). Each writes src/assets/station-<id>.svg.
// Two CSS variables light it:
// --sa-glow dims the station's lights while it is off duty (relieved, or its rail is out),
//   and dims them a little less for a station that is not built yet (reserved, proposed, approved).
// --sa-burn shows warp streaks on the viewscreen and windows while the burn is on.
import { useMemo } from 'react';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';

// Every src/assets/station-<id>.svg, as text, keyed by <id>.
const FILES = import.meta.glob('../assets/station-*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const ART: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([file, svg]) => [file.replace(/^.*station-(.+)\.svg$/, '$1'), svg]),
);

/** True when this station has a picture. */
export const hasArt = (id: string) => id in ART;

/** The burn is on while a rail that has an open burn window is not out. */
export const burning = (ship: ShipView) => ship.data.rails.rails.some((r) => r.burn?.active && ship.rail(r.id) !== 'out');

/** How bright the station's lights are: off duty 0.25, not built yet 0.45, else full. */
export const glow = (ship: ShipView, st: Station) => (ship.off(st) ? 0.25 : st.status !== 'live' ? 0.45 : 1);

export function StationArt({ ship, st }: { ship: ShipView; st: Station }) {
  const look = { '--sa-glow': glow(ship, st), '--sa-burn': burning(ship) ? 1 : 0 } as React.CSSProperties;
  // The picture is our own file, never fixture text, and is inserted once per station.
  const svg = useMemo(() => <div className="cchair-svg" dangerouslySetInnerHTML={{ __html: ART[st.id] }} />, [st.id]);
  return <div className="cchair-art station-art-wrap" style={look}>{svg}</div>;
}

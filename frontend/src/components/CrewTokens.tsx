// The crew on the ship plan, like the DeckPlanV4 board: every live station has a round token
// with its icon, standing at its post. When the station goes off duty (a rail is out, or the
// Captain relieves it) the token walks to that crew member's cabin in Crew Quarters, and back
// again when it returns. The Captain goes to the Captain's Quarters.
// Each post also has a ring (the "slot"): dashed for a live station, dotted for one not built yet.
// The slot stays when its crew member is away, so an empty post shows.
import { SHIP_MAP } from '../lib/shipmap';
import { railColor } from '../lib/lookups';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';
import { Icon } from './Icon';
import type { RailFilter } from './SideRail';

type Place = { x: number; y: number; w: number };
const PLACES = SHIP_MAP.places as Record<string, Place>;
const ICONS = SHIP_MAP.icons as Record<string, string>;
const CABINS: readonly string[] = SHIP_MAP.cabinOrder;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** A station with a crew member on board: a live station, not a place. */
export const crewed = (st: Station) => st.kind === 'station' && st.status === 'live';

/** The centre of a station's post, where its icon sits on the card. */
export function postOf(id: string) {
  const at = PLACES[id];
  return { x: at.x + 28, y: at.y + SHIP_MAP.tileHeight / 2 };
}

/** The cabin a crew member walks to when off duty (05-01 is the first door). */
export function cabinOf(id: string, all: Station[]) {
  let n = CABINS.indexOf(id);
  // Someone not in the DeckPlanV4 list takes the next free door.
  if (n < 0) n = CABINS.length + all.filter((s) => crewed(s) && !CABINS.includes(s.id)).findIndex((s) => s.id === id);
  n = Math.max(0, n) % 18;
  return { n: n + 1, x: SHIP_MAP.cabins.x + n * SHIP_MAP.cabins.step, y: SHIP_MAP.cabins.y };
}

/** Where a crew member's token stands now. */
export function standOf(ship: ShipView, st: Station) {
  if (!ship.off(st)) return postOf(st.id);
  if (st.id === 'captain') return postOf('quarters');
  return cabinOf(st.id, ship.data.stations.stations);
}

interface Props {
  ship: ShipView;
  filter: RailFilter;
  selected: string | null;
  slots: boolean;            // false when the labels are off, so the rooms show clean
  onPick: (id: string) => void;
}

export function CrewTokens({ ship, filter, selected, slots, onPick }: Props) {
  const all = ship.data.stations.stations.filter((s) => PLACES[s.id]);
  const W = SHIP_MAP.width, H = SHIP_MAP.height;
  const at = (p: { x: number; y: number }) => ({ left: pct(p.x, W), top: pct(p.y, H) });
  const captainOff = all.some((s) => s.id === 'captain' && ship.off(s));
  return (
    <div className="crew-layer">
      {slots && all.filter((s) => s.kind === 'station' || (s.id === 'quarters' && captainOff)).map((s) => (
        <span key={`slot-${s.id}`} aria-hidden="true"
          className={'slot' + (crewed(s) ? '' : ' unbuilt') + (s.id === 'quarters' ? ' quarters' : '')
            + (filter !== 'all' && s.rail !== filter && s.id !== 'quarters' ? ' dim' : '')}
          style={at(postOf(s.id))} />
      ))}
      {all.filter(crewed).map((s) => {
        const off = ship.off(s);
        const acting = ship.actingFor(s.id);
        const cls = ['tok'];
        if (off) cls.push('off');
        if (acting) cls.push('acting');
        if (filter !== 'all' && s.rail !== filter) cls.push('dim');
        const where = off ? (s.id === 'captain' ? 'in the Captain\'s Quarters' : `off duty in cabin 05-${String(cabinOf(s.id, all).n).padStart(2, '0')}`) : 'at the post';
        return (
          <button key={s.id} type="button" className={cls.join(' ')} tabIndex={-1}
            aria-pressed={selected === s.id} aria-label={`${s.name}, ${where}`} title={`${s.short}, ${where}`}
            style={{ ...at(standOf(ship, s)), '--c': railColor(s.rail) } as React.CSSProperties}
            onClick={() => onPick(s.id)}>
            <Icon path={ICONS[s.id]} />
          </button>
        );
      })}
    </div>
  );
}

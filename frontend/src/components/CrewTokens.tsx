// The crew on the ship plan, like the DeckPlanV4 board: every live station has a round token
// with its icon, standing at its post. When the station goes off duty (a rail is out, or the
// Captain relieves it) the token walks to that crew member's cabin in Crew Quarters, and back
// again when it returns. The Captain goes to the Captain's Quarters.
// They take the turbolift: along their deck to the lift, ride it (dimmed, inside the shaft), and
// along Crew Quarters to their door. Crew in the engineering hull ride up to deck 6 and walk up
// the neck into the saucer. The lifts are in SHIP_MAP.lifts.
// Each post also has a ring (the "slot"): dashed for a live station, dotted for one not built yet.
// The slot stays when its crew member is away, so an empty post shows.
import { useLayoutEffect, useRef } from 'react';
import { SHIP_MAP, useShipMap, type ShipMap } from '../lib/shipmap';
import { railColor } from '../lib/lookups';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';
import { Icon } from './Icon';
import type { RailFilter } from './SideRail';

const ICONS = SHIP_MAP.icons as Record<string, string>;
const CABINS: readonly string[] = SHIP_MAP.cabinOrder;
// Every function below takes the ship drawing it works on (the 2200-wide ship unless told otherwise).
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** A station with a crew member on board: a live station, not a place. */
export const crewed = (st: Station) => st.kind === 'station' && st.status === 'live';

/** The centre of a station's post, where its icon sits on the card. */
export function postOf(id: string, map: ShipMap = SHIP_MAP) {
  const at = map.places[id];
  return { x: at.x + 28, y: at.y + map.tileHeight / 2 };
}

/** The cabin a crew member walks to when off duty (05-01 is the first door). */
export function cabinOf(id: string, all: Station[], map: ShipMap = SHIP_MAP) {
  let n = CABINS.indexOf(id);
  // Someone not in the DeckPlanV4 list takes the next free door.
  if (n < 0) n = CABINS.length + all.filter((s) => crewed(s) && !CABINS.includes(s.id)).findIndex((s) => s.id === id);
  n = Math.max(0, n) % 18;
  return { n: n + 1, x: map.cabins.x + n * map.cabins.step, y: map.cabins.y };
}

/** Where a crew member's token stands now. */
export function standOf(ship: ShipView, st: Station, map: ShipMap = SHIP_MAP) {
  if (!ship.off(st)) return postOf(st.id, map);
  if (st.id === 'captain') return postOf('quarters', map);
  return cabinOf(st.id, ship.data.stations.stations, map);
}

type Point = { x: number; y: number };

/** The way from a post to the place a crew member goes off duty, through the turbolift. */
export function walkPath(st: Station, from: Point, to: Point, map: ShipMap = SHIP_MAP): Point[] {
  const L = map.lifts;
  const pts: Point[] = st.deck >= 6
    ? [from, { x: L.engineering, y: from.y }, { x: L.engineering, y: L.deck6 }, { x: L.neckFoot.x, y: L.deck6 },
       L.neckFoot, L.neckTop, { x: L.neckTop.x, y: to.y }, to]
    : [from, { x: L.saucer, y: from.y }, { x: L.saucer, y: to.y }, to];
  return pts.filter((p, i) => i === 0 || p.x !== pts[i - 1].x || p.y !== pts[i - 1].y);
}

/** In a lift shaft: a vertical step at one of the lifts. */
const inLift = (a: Point, b: Point, map: ShipMap) => a.x === b.x && (a.x === map.lifts.saucer || a.x === map.lifts.engineering);
const SPEED = 200;   // ship units a second: an unhurried walk

/** Play the walk along `pts` on the token. Its style already holds the end point. */
function play(el: HTMLElement, pts: Point[], map: ShipMap) {
  if (typeof el.animate !== 'function' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = lens.reduce((a, b) => a + b, 0);
  if (!total) return;
  let run = 0;
  const frames = pts.map((p, i) => {
    if (i) run += lens[i - 1];
    // Dim the token while it rides a lift, so it reads as inside the shaft.
    const riding = (i > 0 && inLift(pts[i - 1], p, map)) || (i < pts.length - 1 && inLift(p, pts[i + 1], map));
    return { left: pct(p.x, map.width), top: pct(p.y, map.height), opacity: riding && i > 0 && i < pts.length - 1 ? 0.55 : 1, offset: run / total };
  });
  el.getAnimations().forEach((a) => a.cancel());
  el.animate(frames, { duration: Math.min(9000, Math.max(1500, (total / SPEED) * 1000)), easing: 'linear' });
}

/** One crew member's token. When their place changes it walks there by the turbolift. */
function Token({ ship, st, all, filter, selected, onPick }: {
  ship: ShipView; st: Station; all: Station[]; filter: RailFilter; selected: boolean; onPick: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const map = useShipMap();
  const off = ship.off(st);
  const here = standOf(ship, st, map);
  const was = useRef(here);
  useLayoutEffect(() => {
    const prev = was.current;
    was.current = here;
    if (!ref.current || (prev.x === here.x && prev.y === here.y)) return;
    const post = postOf(st.id, map);
    // Going off duty walks post -> cabin; coming back walks the same way in reverse.
    const away = off ? here : prev;
    const path = walkPath(st, post, away, map);
    play(ref.current, off ? path : path.reverse(), map);
  }, [here.x, here.y]); // eslint-disable-line react-hooks/exhaustive-deps

  const acting = ship.actingFor(st.id);
  const cls = ['tok'];
  if (off) cls.push('off');
  if (acting) cls.push('acting');
  if (filter !== 'all' && st.rail !== filter) cls.push('dim');
  const where = off ? (st.id === 'captain' ? 'in the Captain\'s Quarters' : `off duty in cabin 05-${String(cabinOf(st.id, all, map).n).padStart(2, '0')}`) : 'at the post';
  return (
    <button ref={ref} type="button" className={cls.join(' ')} tabIndex={-1}
      aria-pressed={selected} aria-label={`${st.name}, ${where}`} title={`${st.short}, ${where}`}
      style={{ left: pct(here.x, map.width), top: pct(here.y, map.height), '--c': railColor(st.rail) } as React.CSSProperties}
      onClick={() => onPick(st.id)}>
      <Icon path={ICONS[st.id]} />
    </button>
  );
}

interface Props {
  ship: ShipView;
  filter: RailFilter;
  selected: string | null;
  slots: boolean;            // false when the labels are off, so the rooms show clean
  onPick: (id: string) => void;
}

export function CrewTokens({ ship, filter, selected, slots, onPick }: Props) {
  const map = useShipMap();
  const all = ship.data.stations.stations.filter((s) => map.places[s.id]);
  const W = map.width, H = map.height;
  const at = (p: { x: number; y: number }) => ({ left: pct(p.x, W), top: pct(p.y, H) });
  const captainOff = all.some((s) => s.id === 'captain' && ship.off(s));
  return (
    <div className="crew-layer">
      {slots && all.filter((s) => s.kind === 'station' || (s.id === 'quarters' && captainOff)).map((s) => (
        <span key={`slot-${s.id}`} aria-hidden="true"
          className={'slot' + (crewed(s) ? '' : ' unbuilt') + (s.id === 'quarters' ? ' quarters' : '')
            + (filter !== 'all' && s.rail !== filter && s.id !== 'quarters' ? ' dim' : '')}
          style={at(postOf(s.id, map))} />
      ))}
      {all.filter(crewed).map((s) => (
        <Token key={s.id} ship={ship} st={s} all={all} filter={filter} selected={selected === s.id} onPick={onPick} />
      ))}
    </div>
  );
}

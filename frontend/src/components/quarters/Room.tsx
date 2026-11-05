// The Captain's Quarters picture, with a button on each thing you can pick.
// The wall screen (passed in as children) is laid over the picture's own screen.
import { memo, useState, type ReactNode } from 'react';
import art from '../../assets/quarters.svg?raw';
import { ROOM, SPOTS, WALL, pct, type RoomObject } from '../../lib/quarters';
import type { ShipView } from '../../lib/ship';

// The SVG is our own file, never fixture text, so it is safe to insert as markup.
const Art = memo(function Art() {
  return <div className="room-art-svg" dangerouslySetInnerHTML={{ __html: art }} />;
});

export interface SpotLabel { name: string; meta?: string }

interface Props {
  ship: ShipView;
  on: RoomObject | null;                       // the thing whose view is on the wall screen
  labels: Record<RoomObject, SpotLabel>;
  onPick: (o: RoomObject) => void;
  children: ReactNode;
}

export function Room({ ship, on, labels, onPick, children }: Props) {
  const [hot, setHot] = useState<RoomObject | null>(null);
  const burning = ship.data.rails.rails.some((r) => r.burn?.active && ship.rail(r.id) !== 'out');
  // The armrest lights follow the rails, and warp streaks pass the window while the burn is on.
  const look = {
    '--q-local': ship.rail('local') === 'out' ? 0.12 : 1,
    '--q-codex': ship.rail('codex') === 'out' ? 0.12 : 1,
    '--q-claude': ship.rail('claude') === 'out' ? 0.12 : 1,
    '--q-burn': burning ? 1 : 0,
  } as React.CSSProperties;

  return (
    <section className="room" aria-label="Captain's Quarters">
      <div className="hero-top">
        <p className="mono hero-label">DECK 2 · THE CAPTAIN'S QUARTERS · PICK SOMETHING IN THE ROOM</p>
        <p className="mono hero-label room-hint">ESC RETURNS THE WALL SCREEN TO AT EASE</p>
      </div>
      <div className="room-wrap">
        <div className="room-pic" data-hot={hot ?? ''} data-on={on ?? ''} style={look}>
          <div className="room-art" aria-hidden="true"><Art /></div>
          {SPOTS.map(({ id, box: [x, y, w, h], label: [lx, ly], hang }) => (
            <button key={id} type="button" className={`spot spot-${id}`} aria-pressed={on === id}
              aria-label={labels[id].meta ? `${labels[id].name}, ${labels[id].meta}` : labels[id].name}
              style={{ left: pct(x, ROOM.w), top: pct(y, ROOM.h), width: pct(w, ROOM.w), height: pct(h, ROOM.h) }}
              onPointerEnter={() => setHot(id)} onPointerLeave={() => setHot(null)}
              onFocus={() => setHot(id)} onBlur={() => setHot(null)}
              onClick={() => onPick(id)}>
              <span className={'spot-label' + (hang ? ' hang' : '')} style={{ left: pct(lx - x, w), top: pct(ly - y, h) }}>
                <span className="spot-name">{labels[id].name}</span>
                {labels[id].meta && <span className="spot-meta mono">{labels[id].meta}</span>}
              </span>
            </button>
          ))}
        </div>
        <div className="wall-slot" style={{
          '--x': pct(WALL.x, ROOM.w), '--y': pct(WALL.y, ROOM.h), '--w': pct(WALL.w, ROOM.w), '--h': pct(WALL.h, ROOM.h),
        } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </section>
  );
}

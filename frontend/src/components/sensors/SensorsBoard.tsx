// The Sensor array board (Deck 3). The room is the hero, like the Captain's Quarters: the
// long-range scope shows every watch as a contact (pick one), and the array console, the asks
// terminal, the findings tray and the quarantine locker each open a view on the work screen
// in place. Around the room: the watches, the asks and the rails on the right, the findings
// and the array's log below, the comm badge at the bottom. Sample data (fixtures/sensors.json).
import { memo, useCallback, useState } from 'react';
import art from '../../assets/sensors.svg?raw';
import type { BoardId } from '../../lib/board';
import { ROOM, SCOPE, SCREEN, SPOTS, pct, type SensorObject } from '../../lib/sensors';
import type { Drills, ShipView } from '../../lib/ship';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { AsksPanel, ArrayLog, FindingsPanel, WatchesPanel } from './Panels';
import { Scope } from './Scope';
import { SensorScreen, type Screen } from './SensorScreen';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  drills: Drills;
  target: string | null;
  onTarget: (id: string) => void;
  onBoard: (b: BoardId) => void;
  onToast: (text: string) => void;
}

// The SVG is our own file, never fixture text, so it is safe to insert as markup.
const Art = memo(function Art() {
  return <div className="room-art-svg" dangerouslySetInnerHTML={{ __html: art }} />;
});

const VIEW_OF: Record<Exclude<SensorObject, 'bridge' | 'scope'>, Screen['view']> = {
  watches: 'watches', asks: 'asks', findings: 'findings', quarantine: 'quarantine',
};

export function SensorsBoard({ ship, filter, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [hot, setHot] = useState<SensorObject | null>(null);
  const s = ship.data.sensors;
  // Sample data runs on its own clock, so the scope reads the same every time.
  const now = s.synthetic ? Date.parse(s.asOf) : Date.now();

  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const pick = (o: SensorObject) => (o === 'bridge' ? onBoard('bridge') : o === 'scope' ? show({ view: 'ease' }) : show({ view: VIEW_OF[o] } as Screen));
  const openWatch = (id: string) => { show({ view: 'watch', id }); onTarget('sensors'); };

  const on = screen.view === 'watch' ? 'scope' : (Object.keys(VIEW_OF) as SensorObject[]).find((k) => VIEW_OF[k as keyof typeof VIEW_OF] === screen.view) ?? null;
  const picked = screen.view === 'watch' ? screen.id : null;
  const unread = s.findings.filter((f) => !f.seen).length;
  const labels: Record<SensorObject, { name: string; meta?: string }> = {
    scope: { name: 'Scope' },
    watches: { name: 'Array console', meta: `${s.watches.length} WATCHES` },
    asks: { name: 'Asks', meta: 'WORD FOR WORD' },
    findings: { name: 'Findings', meta: unread ? `${unread} NEW` : 'ALL READ' },
    quarantine: { name: 'Quarantine', meta: `${s.quarantine.length} HELD` },
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
  };
  const box = SCOPE.r * 2;

  return (
    <div className="qgrid sgrid">
      <section className="room" aria-label="Sensor array">
        <div className="hero-top">
          <p className="mono hero-label">DECK 3 · THE SENSOR ARRAY · PICK A CONTACT ON THE SCOPE, OR SOMETHING IN THE ROOM</p>
          <p className="mono hero-label room-hint">{s.synthetic ? 'SAMPLE WATCHES · ' : ''}ESC RETURNS THE WORK SCREEN</p>
        </div>
        <div className="room-wrap">
          <div className="room-pic sensor-pic" data-hot={hot ?? ''} data-on={on ?? ''}>
            <div className="room-art" aria-hidden="true"><Art /></div>
            {SPOTS.map(({ id, box: [x, y, w, h], label: [lx, ly] }) => (
              <button key={id} type="button" className={`spot sspot-${id}`} aria-pressed={on === id}
                aria-label={labels[id].meta ? `${labels[id].name}, ${labels[id].meta}` : labels[id].name}
                style={{ left: pct(x, ROOM.w), top: pct(y, ROOM.h), width: pct(w, ROOM.w), height: pct(h, ROOM.h) }}
                onPointerEnter={() => setHot(id)} onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(id)} onBlur={() => setHot(null)}
                onClick={() => pick(id)}>
                <span className="spot-label" style={{ left: pct(lx - x, w), top: pct(ly - y, h) }}>
                  <span className="spot-name">{labels[id].name}</span>
                  {labels[id].meta && <span className="spot-meta mono">{labels[id].meta}</span>}
                </span>
              </button>
            ))}
            <div className="scope-slot" style={{
              left: pct(SCOPE.cx - SCOPE.r, ROOM.w), top: pct(SCOPE.cy - SCOPE.r, ROOM.h), width: pct(box, ROOM.w), height: pct(box, ROOM.h),
            }}>
              <Scope ship={ship} now={now} picked={picked} onPick={openWatch} />
            </div>
          </div>
          <div className="wall-slot" style={{
            '--x': pct(SCREEN.x, ROOM.w), '--y': pct(SCREEN.y, ROOM.h), '--w': pct(SCREEN.w, ROOM.w), '--h': pct(SCREEN.h, ROOM.h),
          } as React.CSSProperties}>
            <SensorScreen ship={ship} now={now} screen={screen} onScreen={setScreen} />
          </div>
        </div>
      </section>
      <aside className="side qside">
        <WatchesPanel ship={ship} filter={filter} now={now} picked={picked ?? undefined} onOpen={openWatch} />
        <AsksPanel ship={ship} onOpen={() => setScreen({ view: 'asks' })} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <FindingsPanel ship={ship} picked={screen.view === 'findings' ? screen.id : undefined}
          onOpen={(id) => show({ view: 'findings', id })} />
        <ArrayLog ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

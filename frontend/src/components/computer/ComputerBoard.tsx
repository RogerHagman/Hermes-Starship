// The computer core (Deck 3), where the Ship's Computer lives. The room is the hero, like Ops:
// the memory banks, the core itself, the records racks, the terminal desk, the minutes reader and
// the dilithium chamber each open a view on the core terminal in place. The terminal's records are
// every order the ship has taken, in any state, with a command line to find one. The records board
// on the table has a count per state. Around the room: orders by station, the records keepers and
// the rails on the right, the order log and the minutes below, the comm badge at the bottom.
// Reading only: nothing here reaches Hermes.
import { memo, useCallback, useMemo, useState } from 'react';
import art from '../../assets/computer.svg?raw';
import type { BoardId } from '../../lib/board';
import { ALL, ROOM, SCREEN, SPOTS, counts, pct, records, recordsFile, type CoreObject, type Query } from '../../lib/computer';
import type { Drills, ShipView } from '../../lib/ship';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { ComputerScreen, type Screen } from './ComputerScreen';
import { CoreCrewPanel, MinutesPanel, OrderLog, RecordsBoard, StationsPanel } from './Panels';

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

/** What each thing in the room opens on the terminal. */
const VIEW_OF: Partial<Record<CoreObject, Screen>> = {
  records: { view: 'ease' }, desk: { view: 'ease' }, minutes: { view: 'minutes' }, burn: { view: 'burn' }, memory: { view: 'memory' },
};

export function ComputerBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [query, setQuery] = useState<Query>(ALL);
  const [hot, setHot] = useState<CoreObject | null>(null);
  const n = useMemo(() => counts(records(ship.data)), [ship]);

  // Picking the thing that is already on screen puts the records back.
  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const openStation = (id: string) => { show({ view: 'station', id }); onTarget(id); };
  const openRecord = (id: string) => setScreen({ view: 'record', id });
  // A filter always shows the records it filters.
  const filterBy = (q: Query) => { setQuery(q); setScreen({ view: 'ease' }); };
  const pick = (o: CoreObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'core') return openStation('computer');
    const v = VIEW_OF[o];
    if (v) show(v);
  };

  const on: CoreObject | null = screen.view === 'station' ? (screen.id === 'computer' ? 'core' : null)
    : screen.view === 'ease' || screen.view === 'record' ? 'records'
    : screen.view === 'minutes' ? 'minutes' : screen.view === 'burn' ? 'burn' : screen.view === 'memory' ? 'memory' : null;
  const computer = ship.station('computer');
  const burning = ship.data.rails.rails.some((r) => r.burn?.active);
  const file = recordsFile(ship.data);
  const open = records(ship.data).filter((o) => o.state !== 'done').length;
  const labels: Record<CoreObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    memory: { name: 'Memory banks', meta: 'SEALED' },
    core: { name: "Ship's Computer", meta: computer ? (ship.off(computer) ? 'OFF DUTY' : computer.activeOrder ?? 'KEEPING THE RECORDS') : '' },
    records: { name: 'Records', meta: `${file.orders.length} ON FILE` },
    desk: { name: 'Core terminal', meta: `${open} OPEN` },
    minutes: { name: 'Minutes', meta: 'BRIEFINGS' },
    burn: { name: 'Dilithium', meta: burning ? 'BURN ON' : 'NO BURN' },
  };

  return (
    <div className="qgrid cgrid">
      <section className="room" aria-label="Computer core">
        <div className="hero-top">
          <p className="mono hero-label">DECK 3 · COMPUTER CORE · TYPE ON THE TERMINAL, OR PICK SOMETHING IN THE ROOM</p>
          <p className="mono hero-label room-hint">{file.synthetic ? 'SAMPLE RECORDS · ' : ''}READ ONLY · {n.blocked} BLOCKED · ESC RETURNS THE SCREEN</p>
        </div>
        <div className="room-wrap">
          <div className="room-pic core-pic" data-hot={hot ?? ''} data-on={on ?? ''} data-burn={burning ? 'on' : 'off'}
            data-core={ship.rail('local')}>
            <div className="room-art" aria-hidden="true"><Art /></div>
            {SPOTS.map(({ id, box: [x, y, w, h], label: [lx, ly] }) => (
              <button key={id} type="button" className={`spot cspot-${id}`} aria-pressed={on === id}
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
            <RecordsBoard ship={ship} query={query} onQuery={filterBy} />
          </div>
          <div className="wall-slot" style={{
            '--x': pct(SCREEN.x, ROOM.w), '--y': pct(SCREEN.y, ROOM.h), '--w': pct(SCREEN.w, ROOM.w), '--h': pct(SCREEN.h, ROOM.h),
          } as React.CSSProperties}>
            <ComputerScreen ship={ship} screen={screen} onScreen={setScreen} query={query} onQuery={setQuery} />
          </div>
        </div>
      </section>
      <aside className="side qside">
        <StationsPanel ship={ship} query={query} onQuery={filterBy} />
        <CoreCrewPanel ship={ship} picked={screen.view === 'station' ? screen.id : undefined} onOpen={openStation} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <OrderLog ship={ship} onOpen={openRecord} />
        <MinutesPanel ship={ship} onOpen={() => setScreen({ view: 'minutes' })} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

// The Yeoman's post (Deck 2), by the Captain's door. The room is the hero, like the Computer core:
// the clock (the next 48 hours), the calendar (recurring), the pigeonholes (waiting for), the
// chime (reminders, with the timer's proof), the done cabinet and the in-tray (how to say it) each
// open a view on the wall screen in place. The matrix lies on the desk with a count per box, and the
// wall screen starts on the list in its four boxes, each todo with the reason it sits there. The
// Captain's door leads to the Quarters. Reading only: nothing here reaches Hermes.
import { memo, useCallback, useMemo, useState } from 'react';
import art from '../../assets/yeoman.svg?raw';
import type { BoardId } from '../../lib/board';
import type { Drills, ShipView } from '../../lib/ship';
import {
  BEAT_STALE_MIN, ROOM, SCREEN, SPOTS, heartbeat, late, matrix, next48, nowOf, pct, type Box, type YeomanObject,
} from '../../lib/yeoman';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { DonePanel, MatrixBoard, NextPanel, WaitingPanel, WeekPanel } from './Panels';
import { YeomanScreen, sourceWord, type Screen } from './YeomanScreen';

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

/** What each thing in the room opens on the wall screen. */
const VIEW_OF: Partial<Record<YeomanObject, Screen>> = {
  clock: { view: 'next48' }, calendar: { view: 'recurring' }, waiting: { view: 'waiting' }, chime: { view: 'reminders' },
  done: { view: 'done' }, intray: { view: 'say' }, desk: { view: 'station', id: 'yeoman' },
};

/** Which thing in the room is lit for the view on screen. */
function litFor(s: Screen): YeomanObject | null {
  switch (s.view) {
    case 'next48': return 'clock';
    case 'recurring': return 'calendar';
    case 'waiting': return 'waiting';
    case 'reminders': return 'chime';
    case 'done': return 'done';
    case 'say': return 'intray';
    case 'station': return s.id === 'yeoman' ? 'desk' : null;
    default: return null;
  }
}

export function YeomanBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [hot, setHot] = useState<YeomanObject | null>(null);
  const y = ship.data.yeoman;
  const now = nowOf(ship.data);
  const m = useMemo(() => matrix(y, now), [y, now]);

  // Picking the thing that is already on screen puts the list back.
  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const openItem = (id: string) => setScreen({ view: 'item', id });
  const pick = (o: YeomanObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'door') return onBoard('quarters');
    if (o === 'desk') onTarget('yeoman');
    const v = VIEW_OF[o];
    if (v) show(v);
  };
  const openBox = (b: Box) => show({ view: 'box', box: b });

  const on = litFor(screen);
  const yeoman = ship.station('yeoman');
  const beat = heartbeat(y);
  const lateN = y.waiting.filter((w) => late(w, now)).length;
  const soon = y.reminders.some((r) => r.status === 'open' && Date.parse(r.dueAt) >= now && Date.parse(r.dueAt) - now <= 3_600_000);
  const due = next48(y, now).length;
  const snoozed = y.reminders.filter((r) => r.status === 'snoozed').length;
  const labels: Record<YeomanObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    clock: { name: 'Next 48 hours', meta: `${due} DUE` },
    calendar: { name: 'Recurring', meta: `${y.recurring.length} RULES` },
    waiting: { name: 'Waiting for', meta: lateN ? `${lateN} LATE` : `${y.waiting.length} OPEN` },
    chime: { name: 'Reminders', meta: beat !== null && beat > BEAT_STALE_MIN ? 'TIMER QUIET' : `${y.reminders.length - snoozed} SET` },
    done: { name: 'Done log', meta: `${y.done.length} CLOSED` },
    door: { name: "Captain's Quarters", meta: 'YOUR DOOR' },
    intray: { name: 'In-tray', meta: 'HOW TO SAY IT' },
    desk: { name: 'Yeoman', meta: yeoman ? (ship.off(yeoman) ? 'OFF DUTY' : yeoman.activeOrder ?? 'AT THE POST') : '' },
  };
  const box: Box | null = screen.view === 'box' ? screen.box : null;

  return (
    <div className="qgrid ygrid">
      <section className="room" aria-label="Yeoman's post">
        <div className="hero-top">
          <p className="mono hero-label">DECK 2 · YEOMAN'S POST · BY YOUR DOOR · PICK SOMETHING IN THE ROOM, OR A BOX ON THE DESK</p>
          <p className="mono hero-label room-hint">{sourceWord(ship)} · {m.first.length} DO FIRST · READ ONLY · ESC RETURNS THE SCREEN</p>
        </div>
        <div className="room-wrap">
          <div className="room-pic yeo-pic" data-hot={hot ?? ''} data-on={on ?? ''}
            data-beat={beat === null ? 'unknown' : beat > BEAT_STALE_MIN ? 'stale' : 'ok'} data-late={lateN ? 'on' : 'off'} data-ring={soon ? 'on' : 'off'}>
            <div className="room-art" aria-hidden="true"><Art /></div>
            {SPOTS.map(({ id, box: [x, yy, w, h], label: [lx, ly] }) => (
              <button key={id} type="button" className={`spot yspot-${id}`} aria-pressed={on === id}
                aria-label={labels[id].meta ? `${labels[id].name}, ${labels[id].meta}` : labels[id].name}
                style={{ left: pct(x, ROOM.w), top: pct(yy, ROOM.h), width: pct(w, ROOM.w), height: pct(h, ROOM.h) }}
                onPointerEnter={() => setHot(id)} onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(id)} onBlur={() => setHot(null)}
                onClick={() => pick(id)}>
                <span className="spot-label" style={{ left: pct(lx - x, w), top: pct(ly - yy, h) }}>
                  <span className="spot-name">{labels[id].name}</span>
                  {labels[id].meta && <span className="spot-meta mono">{labels[id].meta}</span>}
                </span>
              </button>
            ))}
            <MatrixBoard ship={ship} on={box} onBox={openBox} />
          </div>
          <div className="wall-slot" style={{
            '--x': pct(SCREEN.x, ROOM.w), '--y': pct(SCREEN.y, ROOM.h), '--w': pct(SCREEN.w, ROOM.w), '--h': pct(SCREEN.h, ROOM.h),
          } as React.CSSProperties}>
            <YeomanScreen ship={ship} screen={screen} onScreen={setScreen} />
          </div>
        </div>
      </section>
      <aside className="side qside">
        <NextPanel ship={ship} onOpen={(id) => setScreen({ view: 'item', id, from: { view: 'next48' } })} onAll={() => setScreen({ view: 'next48' })} />
        <WaitingPanel ship={ship} onOpen={(id) => setScreen({ view: 'item', id, from: { view: 'waiting' } })} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <DonePanel ship={ship} onOpen={openItem} onAll={() => setScreen({ view: 'done' })} />
        <WeekPanel ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

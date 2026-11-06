// Ops (Deck 1), the operations room behind the Bridge. The room is the hero, like Main
// Engineering: the network panel, the NAS rack, the chronometer, the storage bank, the backup
// vault, the usage desk and the GPU tower each open a view on the Ops wall screen in place. The
// status board on the table has a chip per check; the usage desk shows the live rails. Around
// the room: what needs a look, the Operations crew and the rails on the right, the schedule and
// the ops log below, the comm badge at the bottom. Ops only reads. Sample data
// (fixtures/ops.json), except the rails and the GPU's VRAM, which are live on the NAS.
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import art from '../../assets/ops.svg?raw';
import type { BoardId } from '../../lib/board';
import { HEALTH_WORD, ROOM, SCREEN, SPOTS, areas, handAngle, pct, worst, type OpsObject, type OpsView } from '../../lib/ops';
import type { Drills, ShipView } from '../../lib/ship';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { OpsScreen, type Screen } from './OpsScreen';
import { LookPanel, OpsCrewPanel, OpsLog, ScheduleTable, StatusBoard, UsageDesk } from './Panels';

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
const VIEW_OF: Partial<Record<OpsObject, OpsView>> = {
  net: 'net', nas: 'nas', clock: 'schedule', storage: 'storage', vault: 'backups', desk: 'usage', gpu: 'gpu',
};

/** The ship's time on the chronometer, moved on every minute. */
function useHand(): number {
  const [deg, setDeg] = useState(() => handAngle(new Date()));
  useEffect(() => {
    const t = setInterval(() => setDeg(handAngle(new Date())), 60_000);
    return () => clearInterval(t);
  }, []);
  return deg;
}

export function OpsBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [hot, setHot] = useState<OpsObject | null>(null);
  const hand = useHand();
  const list = useMemo(() => areas(ship), [ship]);

  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const openStation = (id: string) => { show({ view: 'station', id }); onTarget(id); };
  const openView = (v: OpsView) => show({ view: v });
  const pick = (o: OpsObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'ops') return openStation('ops');
    const v = VIEW_OF[o];
    if (v) openView(v);
  };

  const on: OpsObject | null = screen.view === 'station'
    ? (screen.id === 'ops' ? 'ops' : null)
    : (Object.keys(VIEW_OF) as OpsObject[]).find((k) => VIEW_OF[k] === screen.view) ?? null;
  const stateOf = (v: OpsView) => worst(list.find((a) => a.id === v)?.checks.map((c) => c.state) ?? []);
  const ops = ship.station('ops');
  const labels: Record<OpsObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    ops: { name: 'Ops console', meta: ops ? (ship.off(ops) ? 'OFF DUTY' : ops.activeOrder ?? 'READING') : '' },
    net: { name: 'Network', meta: HEALTH_WORD[stateOf('net')] },
    nas: { name: 'NAS', meta: HEALTH_WORD[stateOf('nas')] },
    clock: { name: 'Chronometer', meta: `${ship.data.ops.jobs.length} JOBS · ${HEALTH_WORD[stateOf('schedule')]}` },
    storage: { name: 'Storage', meta: HEALTH_WORD[stateOf('storage')] },
    vault: { name: 'Backup vault', meta: HEALTH_WORD[stateOf('backups')] },
    desk: { name: 'Usage desk', meta: 'THE RAILS' },
    gpu: { name: 'GPU', meta: `LOCAL RAIL ${ship.rail('local').toUpperCase()}` },
  };

  return (
    <div className="qgrid ogrid">
      <section className="room" aria-label="Ops">
        <div className="hero-top">
          <p className="mono hero-label">DECK 1 · OPS · PICK SOMETHING IN THE ROOM, OR A CHECK ON THE STATUS BOARD</p>
          <p className="mono hero-label room-hint">{ship.data.ops.synthetic ? 'SAMPLE READINGS, LIVE RAILS · ' : ''}OPS ONLY READS · ESC RETURNS THE SCREEN</p>
        </div>
        <div className="room-wrap">
          <div className="room-pic ops-pic" data-hot={hot ?? ''} data-on={on ?? ''} data-gpu={ship.rail('local')}
            style={{ '--hand': `${hand}deg` } as React.CSSProperties}>
            <div className="room-art" aria-hidden="true"><Art /></div>
            {SPOTS.map(({ id, box: [x, y, w, h], label: [lx, ly] }) => (
              <button key={id} type="button" className={`spot ospot-${id}`} aria-pressed={on === id}
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
            <StatusBoard list={list} on={screen.view} onOpen={openView} />
            <UsageDesk ship={ship} onOpen={() => openView('usage')} />
          </div>
          <div className="wall-slot" style={{
            '--x': pct(SCREEN.x, ROOM.w), '--y': pct(SCREEN.y, ROOM.h), '--w': pct(SCREEN.w, ROOM.w), '--h': pct(SCREEN.h, ROOM.h),
          } as React.CSSProperties}>
            <OpsScreen ship={ship} screen={screen} onScreen={setScreen} />
          </div>
        </div>
      </section>
      <aside className="side qside">
        <LookPanel list={list} onOpen={openView} />
        <OpsCrewPanel ship={ship} picked={screen.view === 'station' ? screen.id : undefined} onOpen={openStation} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <ScheduleTable ship={ship} onOpen={() => openView('schedule')} />
        <OpsLog ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

// Main Engineering (Deck 7). The room is the hero, like the Captain's Quarters: the warp core
// glows with the local rail, the patch line lies on the master systems table (pick a patch),
// and the Chief's, Systems' and Diagnostics' consoles, the test bench and the patch bay each
// open a view on the Chief's wall screen in place. Around the room: the patches in flight, the
// Engineering crew and the rails on the right, every patch and the engineering log below, the
// comm badge at the bottom. Sample data (fixtures/engineering.json).
import { memo, useCallback, useState } from 'react';
import art from '../../assets/engineering.svg?raw';
import type { BoardId } from '../../lib/board';
import { CONSOLE_OF, ROOM, SCREEN, SPOTS, pct, type EngObject } from '../../lib/engineering';
import type { Drills, ShipView } from '../../lib/ship';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { EngScreen, inCharge, type Screen } from './EngScreen';
import { EngCrewPanel, EngLog, InFlightPanel, PatchLine, PatchesTable } from './Panels';
import { Marked } from '../Marked';

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

export function EngineeringBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [hot, setHot] = useState<EngObject | null>(null);
  const e = ship.data.engineering;

  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const openStation = (id: string) => { show({ view: 'station', id }); onTarget(id); };
  const pick = (o: EngObject) => {
    if (o === 'bridge') return onBoard('bridge');
    const st = CONSOLE_OF[o];
    if (st) return openStation(st === 'eng' ? inCharge(ship)?.id ?? 'eng' : st);
    show({ view: o } as Screen);
  };
  const openPatch = (id: string) => show({ view: 'patch', id });

  const on: EngObject | null = screen.view === 'station'
    ? (Object.keys(CONSOLE_OF) as EngObject[]).find((k) => CONSOLE_OF[k] === screen.id) ?? null
    : screen.view === 'core' || screen.view === 'bay' || screen.view === 'bench' ? screen.view : null;
  const picked = screen.view === 'patch' ? screen.id : undefined;
  const crew = (id: string) => { const s = ship.station(id); return s ? (ship.off(s) ? 'OFF DUTY' : s.activeOrder ?? 'NO ORDER') : ''; };
  const lead = inCharge(ship);
  const core = ship.rail('local');
  const labels: Record<EngObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    chief: { name: lead && lead.id !== 'eng' ? `Chief's console · ${lead.short}` : "Chief's console", meta: lead ? crew(lead.id) : 'NOBODY' },
    core: { name: 'Warp core', meta: `LOCAL RAIL ${core.toUpperCase()}` },
    systems: { name: 'Systems', meta: crew('sys') },
    diagnostics: { name: 'Diagnostics', meta: crew('diag') },
    bench: { name: 'Test bench', meta: e.experiment.verdict ? 'CALLED' : 'SPLIT OR SOLO' },
    bay: { name: 'Patch bay', meta: `${e.check.present}/${e.check.total}` },
  };

  return (
    <div className="qgrid egrid">
      <section className="room" aria-label="Main Engineering">
        <div className="hero-top">
          <p className="mono hero-label">DECK 7 · MAIN ENGINEERING · PICK A PATCH ON THE TABLE, OR SOMETHING IN THE ROOM</p>
          <p className="mono hero-label room-hint"><Marked>{e.synthetic ? 'SAMPLE PATCHES · ' : ''}ESC RETURNS THE WORK SCREEN</Marked></p>
        </div>
        <div className="room-wrap">
          <div className="room-pic eng-pic" data-hot={hot ?? ''} data-on={on ?? ''} data-core={core}>
            <div className="room-art" aria-hidden="true"><Art /></div>
            {SPOTS.map(({ id, box: [x, y, w, h], label: [lx, ly] }) => (
              <button key={id} type="button" className={`spot espot-${id}`} aria-pressed={on === id}
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
            <PatchLine ship={ship} picked={picked} onOpen={openPatch} onLine={() => show({ view: 'line' })} />
          </div>
          <div className="wall-slot" style={{
            '--x': pct(SCREEN.x, ROOM.w), '--y': pct(SCREEN.y, ROOM.h), '--w': pct(SCREEN.w, ROOM.w), '--h': pct(SCREEN.h, ROOM.h),
          } as React.CSSProperties}>
            <EngScreen ship={ship} screen={screen} onScreen={setScreen} onToast={onToast} />
          </div>
        </div>
      </section>
      <aside className="side qside">
        <InFlightPanel ship={ship} picked={picked} onOpen={openPatch} />
        <EngCrewPanel ship={ship} picked={screen.view === 'station' ? screen.id : undefined} onOpen={openStation} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <PatchesTable ship={ship} picked={picked} onOpen={openPatch} />
        <EngLog ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}


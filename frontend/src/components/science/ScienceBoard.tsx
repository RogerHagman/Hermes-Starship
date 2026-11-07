// The Science lab (Deck 3). The room is the hero, like the Captain's Quarters: the eval
// chamber shows every score in its glass, and the model shelf, the run console, the serving
// rack, the study bench and the dataset archive each open a view on the work screen in place.
// Every number links to the run that measured it. Around the room: the study bench, serving,
// the meters (speed, spend, leak) and the rails on the right, the evals and the run log below,
// the comm badge at the bottom. Sample data (fixtures/science.json); the meters go live with the meter probe.
import { memo, useCallback, useState } from 'react';
import art from '../../assets/science.svg?raw';
import type { BoardId } from '../../lib/board';
import { ROOM, SCREEN, SPOTS, byNewest, pct, type LabObject } from '../../lib/science';
import type { Drills, ShipView } from '../../lib/ship';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { LabScreen, type Screen } from './LabScreen';
import { MetersPanel } from './Meters';
import { Chamber, EvalsTable, RunLogPanel, ServingPanel, StudyPanel } from './Panels';

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

/** Which thing in the room a view belongs to, so its label lights up. */
const OWNER: Partial<Record<Screen['view'], LabObject>> = {
  models: 'models', model: 'models', evals: 'evals', runs: 'runs', run: 'runs',
  serving: 'serving', datasets: 'datasets', study: 'study', track: 'study',
};

export function ScienceBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [hot, setHot] = useState<LabObject | null>(null);
  const s = ship.data.science;
  const st = ship.station('science');
  const dark = !!(st && ship.off(st));

  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const pick = (o: LabObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'study' || o === 'evals') onTarget('science');
    show({ view: o } as Screen);
  };

  const on = OWNER[screen.view] ?? null;
  const last = byNewest(s.runs)[0];
  const live = s.serving.find((v) => v.state === 'live');
  const left = s.study.reduce((n, t) => n + t.lessons.filter((l) => !l.done).length, 0);
  const labels: Record<LabObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    models: { name: 'Model shelf', meta: `${s.models.length} MODELS` },
    evals: { name: 'Eval chamber', meta: `${s.evals.length} SCORES` },
    runs: { name: 'Run console', meta: last ? `LAST ${last.id}${last.ok ? '' : ' FAILED'}` : 'NO RUNS' },
    serving: { name: 'Serving', meta: live?.tokensPerSec ? `${live.engine.toUpperCase()} ${live.tokensPerSec} T/S` : 'NOTHING LIVE' },
    study: { name: 'Study bench', meta: left ? `${left} LESSONS TO GO` : 'ALL LESSONS TAKEN' },
    datasets: { name: 'Datasets', meta: `${s.datasets.length} SETS` },
  };

  return (
    <div className="qgrid lgrid">
      <section className="room" aria-label="Science lab">
        <div className="hero-top">
          <p className="mono hero-label">DECK 3 · THE SCIENCE LAB · PICK SOMETHING IN THE ROOM · EVERY NUMBER OPENS ITS RUN</p>
          <p className="mono hero-label room-hint">{s.synthetic ? 'SAMPLE RUNS · ' : ''}ESC RETURNS THE WORK SCREEN</p>
        </div>
        <div className="room-wrap">
          <div className="room-pic lab-pic" data-hot={hot ?? ''} data-on={on ?? ''}>
            <div className="room-art" aria-hidden="true"><Art /></div>
            <Chamber ship={ship} dark={dark} />
            {SPOTS.map(({ id, box: [x, y, w, h], label: [lx, ly] }) => (
              <button key={id} type="button" className={`spot lspot-${id}`} aria-pressed={on === id}
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
          </div>
          <div className="wall-slot" style={{
            '--x': pct(SCREEN.x, ROOM.w), '--y': pct(SCREEN.y, ROOM.h), '--w': pct(SCREEN.w, ROOM.w), '--h': pct(SCREEN.h, ROOM.h),
          } as React.CSSProperties}>
            <LabScreen ship={ship} screen={screen} onScreen={setScreen} />
          </div>
        </div>
      </section>
      <aside className="side qside">
        <StudyPanel ship={ship} picked={screen.view === 'track' ? screen.id : undefined} onScreen={setScreen} />
        <MetersPanel ship={ship} onScreen={setScreen} />
        <ServingPanel ship={ship} onScreen={setScreen} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <EvalsTable ship={ship} onScreen={setScreen} />
        <RunLogPanel ship={ship} onScreen={setScreen} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}


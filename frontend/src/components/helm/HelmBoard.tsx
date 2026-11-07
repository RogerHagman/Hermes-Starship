// Helm's post (Deck 1, flight control): the career course. The room is the hero: the job-ad board,
// your gates, the follow-up chronometer, the method plaque and the timeline each open a view on the
// wall screen; the screen starts on the course, every open job and application by stage. On the
// desk, a tile per stage. Around the room: what waits at your gates, what is due, Helm's own orders
// and the search so far. Reading only: nothing here reaches Hermes, and Helm never sends.
import { useCallback, useState } from 'react';
import art from '../../assets/helm.svg?raw';
import type { BoardId } from '../../lib/board';
import { lastDays } from '../../lib/post';
import type { Drills, ShipView } from '../../lib/ship';
import {
  SPOTS, STAGES, course, dateWord, deadlines, followUps, gates, warn, type HelmObject, type Stage,
} from '../../lib/helm';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { PostRoom } from '../post/PostRoom';
import { DayBars, DeskTiles, Kpis, OrdersPanel, css, sourceWord, up } from '../post/Parts';
import { HelmScreen, type Screen } from './HelmScreen';
import { Src } from '../Src';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  drills: Drills;
  target: string | null;
  onTarget: (id: string) => void;
  onBoard: (b: BoardId) => void;
  onToast: (text: string) => void;
}

const VIEW_OF: Partial<Record<HelmObject, Screen>> = {
  ads: { view: 'ads' }, gates: { view: 'gates' }, follow: { view: 'follow' }, method: { view: 'method' }, log: { view: 'log' }, desk: { view: 'station', id: 'helm' },
};
const LIT: Partial<Record<Screen['view'], HelmObject>> = { ads: 'ads', gates: 'gates', follow: 'follow', method: 'method', log: 'log' };
const DESK: Stage[] = ['triage', 'drafting', 'ready', 'applied', 'interview'];

export function HelmBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const pick = (o: HelmObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'desk') onTarget('helm');
    const v = VIEW_OF[o];
    if (v) show(v);
  };

  const f = ship.data.helm;
  const by = course(f);
  const gs = gates(f);
  const fus = followUps(f);
  const due = fus.filter((x) => x.kind !== 'waiting').length;
  const near = deadlines(f).filter(warn).length;
  const helm = ship.station('helm');
  const on: HelmObject | null = screen.view === 'station' ? (screen.id === 'helm' ? 'desk' : null) : LIT[screen.view] ?? null;
  const labels: Record<HelmObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    ads: { name: 'Job ads', meta: `${f.ads.length} ON FILE · ${by.triage.length} TO TRIAGE` },
    gates: { name: 'Your gates', meta: gs.length ? `${gs.length} WAITING` : 'NONE' },
    follow: { name: 'Follow-ups', meta: due + near ? `${due + near} DUE` : `${fus.length} WAITING` },
    method: { name: 'The method', meta: '10 STEPS' },
    log: { name: 'Timeline', meta: `${f.events.length} LINES` },
    desk: { name: 'Helm', meta: helm ? (ship.off(helm) ? 'OFF DUTY' : helm.activeOrder ?? 'ON COURSE') : '' },
  };

  return (
    <div className="qgrid pgrid">
      <PostRoom name="Helm" art={art} prefix="h" spots={SPOTS} labels={labels} on={on} onPick={pick}
        hero="DECK 1 · HELM · THE CAREER COURSE · PICK SOMETHING IN THE ROOM, OR A STAGE ON THE DESK"
        hint={`${sourceWord(f.synthetic, f.asOf)} · HELM NEVER SENDS · READ ONLY · ESC RETURNS THE SCREEN`}
        attrs={{ gates: gs.length ? 'on' : '0' }}
        desk={<DeskTiles tiles={DESK.map((id) => {
          const s = STAGES.find((x) => x.id === id)!;
          return { id, name: s.name, n: by[id].length, sub: up(s.hint), colour: s.colour, label: `${s.name}, ${by[id].length}`,
            pressed: screen.view === 'stage' && screen.id === id, onClick: () => show({ view: 'stage', id }) };
        })} />}>
        <HelmScreen ship={ship} screen={screen} onScreen={setScreen} />
      </PostRoom>
      <aside className="side qside">
        <GatesPanel ship={ship} onOpen={(id) => setScreen(id.startsWith('A-') ? { view: 'app', id } : { view: 'ad', id })} onAll={() => setScreen({ view: 'gates' })} />
        <DuePanel ship={ship} onOpen={(id) => setScreen(id.startsWith('A-') ? { view: 'app', id } : { view: 'ad', id })} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <OrdersPanel ship={ship} ids={['helm']} title="Helm's own orders" onOpen={(id) => setScreen({ view: 'order', id })} />
        <SearchPanel ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

/** Everything waiting on the Captain at a gate. */
function GatesPanel({ ship, onOpen, onAll }: { ship: ShipView; onOpen: (id: string) => void; onAll: () => void }) {
  const list = gates(ship.data.helm);
  return (
    <section className="panel grow" aria-labelledby="hgate-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hgate-title">Waiting at your gates</h2>
        <Src ids={['helm']} />
        <span className="mono panel-meta">{list.length} · TRIAGE, REVIEW, SEND, CLOSE</span>
      </div>
      <ul className="plist">
        {list.length === 0 && <li className="empty">Nothing waits for you.</li>}
        {list.slice(0, 6).map((g) => (
          <li key={`${g.step}-${g.id}`}>
            <button type="button" className="plist-row" style={css({ '--pc': 'var(--captain)' })} onClick={() => onOpen(g.id)}>
              <span className="pl-main">{g.title}</span>
              <span className="pl-meta mono">{g.id} · {up(g.name)} · {up(g.what)}</span>
            </button>
          </li>
        ))}
      </ul>
      {list.length > 6 && <button type="button" className="linkish pmore" onClick={onAll}>All {list.length} at the gates</button>}
    </section>
  );
}

/** Follow-ups that are due and deadlines that are near. */
function DuePanel({ ship, onOpen }: { ship: ShipView; onOpen: (id: string) => void }) {
  const f = ship.data.helm;
  const fus = followUps(f).filter((x) => x.kind !== 'waiting');
  const dls = deadlines(f).filter((d) => warn(d));
  const n = fus.length + dls.length;
  return (
    <section className="panel" aria-labelledby="hdue-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hdue-title">Due now</h2>
        <Src ids={['helm']} />
        <span className="mono panel-meta">{n ? `${n} · FOLLOW-UPS AND DEADLINES` : 'NOTHING DUE'}</span>
      </div>
      <ul className="plist">
        {n === 0 && <li className="empty">No follow-up is due and no deadline is near.</li>}
        {fus.map((x) => (
          <li key={x.app.id}>
            <button type="button" className="plist-row" style={css({ '--pc': x.kind === 'ghosted' ? 'var(--bad)' : 'var(--captain)' })} onClick={() => onOpen(x.app.id)}>
              <span className="pl-main">{x.kind === 'ghosted' ? 'Close as ghosted?' : 'Send one follow-up'} · {x.app.company}</span>
              <span className="pl-meta mono">{x.app.id} · SENT {x.since} DAYS AGO</span>
            </button>
          </li>
        ))}
        {dls.map((d) => (
          <li key={d.ad.id}>
            <button type="button" className="plist-row" style={css({ '--pc': 'var(--captain)' })} onClick={() => onOpen(d.ad.id)}>
              <span className="pl-main">Deadline · {d.ad.company}</span>
              <span className="pl-meta mono">{d.ad.id} · {dateWord(d.ad.deadline!)} · {d.left === 0 ? 'TODAY' : `${d.left} DAYS`}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The search so far: sent, replies, interviews and ghosted, and the tracker's lines per day. */
function SearchPanel({ ship }: { ship: ShipView }) {
  const f = ship.data.helm;
  const sent = f.applications.filter((a) => a.applied).length;
  const replied = new Set(f.events.filter((e) => ['reply', 'interview', 'offer', 'rejected'].includes(e.kind)).map((e) => e.id)).size;
  const days = lastDays(f.asOf, 14).map((d) => ({ ...d, n: f.events.filter((e) => e.date === d.key).length }));
  return (
    <section className="panel" aria-labelledby="hsearch-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hsearch-title">The search so far</h2>
        <Src ids={['helm']} />
        <span className="mono panel-meta">TRACKER LINES PER DAY · LAST 14 DAYS</span>
      </div>
      <div className="pweek-body">
        <Kpis items={[
          { n: sent, label: 'SENT' },
          { n: replied, label: 'GOT A REPLY', tone: replied ? 'good' : undefined },
          { n: f.applications.filter((a) => a.status === 'interview' || a.status === 'offer').length, label: 'IN TALKS' },
          { n: f.applications.filter((a) => a.status === 'ghosted').length, label: 'GHOSTED' },
        ]} />
        <DayBars days={days} label="Tracker lines per day" />
      </div>
    </section>
  );
}

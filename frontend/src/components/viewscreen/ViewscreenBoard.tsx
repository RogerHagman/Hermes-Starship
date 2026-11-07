// The Main Viewscreen (Deck 1, a place on the bridge): the Captain's desktop, on screen. The room is the
// hero: the on-screen switch, the standing order, the Telegram relay, the approve panel, the session
// log, the Captain's chair and the orders tray each open a view on the screen; the screen starts on
// what is on screen now, or the last session when it is off. On the desk, a tile per count. Around the
// room: what waits for your OK, the sessions, the Viewscreen's orders and the week. Reading only.
import { useCallback, useState } from 'react';
import art from '../../assets/viewscreen.svg?raw';
import type { BoardId } from '../../lib/board';
import { clockTime, dayKey, dayLine } from '../../lib/format';
import { lastDays, ordersOf } from '../../lib/post';
import type { Drills, ShipView } from '../../lib/ship';
import { SURFACE_WORD } from '../../lib/computer';
import { SPOTS, current, length, sessions, tally, waiting, weekOf, type VsObject } from '../../lib/viewscreen';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { PostRoom } from '../post/PostRoom';
import { DayBars, DeskTiles, Kpis, OrdersPanel, css, sourceWord, up } from '../post/Parts';
import { ViewscreenScreen, type Screen } from './ViewscreenScreen';
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

const VIEW_OF: Partial<Record<VsObject, Screen>> = {
  rules: { view: 'rules' }, relay: { view: 'relay' }, approve: { view: 'approve' }, log: { view: 'log' }, orders: { view: 'orders' },
  captain: { view: 'station', id: 'captain' }, desk: { view: 'station', id: 'screen' },
};
const LIT: Partial<Record<Screen['view'], VsObject>> = { ease: 'switch', rules: 'rules', relay: 'relay', approve: 'approve', log: 'log', session: 'log', orders: 'orders' };

export function ViewscreenBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const pick = (o: VsObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'switch') return setScreen({ view: 'ease' });
    if (o === 'desk') onTarget('screen');
    const v = VIEW_OF[o];
    if (v) show(v);
  };

  const f = ship.data.viewscreen;
  const now = current(f);
  const asks = waiting(f);
  const wk = weekOf(f);
  const mine = ordersOf(ship.data, ['screen']);
  const on: VsObject | null = screen.view === 'station' ? (screen.id === 'screen' ? 'desk' : screen.id === 'captain' ? 'captain' : null) : LIT[screen.view] ?? null;
  const labels: Record<VsObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    switch: { name: 'On screen', meta: now ? `ON · ${length(now, f.asOf).toUpperCase()}` : 'OFF' },
    rules: { name: 'Standing order', meta: 'NEVER YOLO' },
    relay: { name: 'Telegram relay', meta: `${wk.captures} CAPTURES` },
    approve: { name: 'Approve', meta: asks.length ? `${asks.length} WAITING` : 'NONE' },
    log: { name: 'Session log', meta: `${f.sessions.length} SESSIONS` },
    captain: { name: "Captain's chair", meta: 'YOU APPROVE' },
    orders: { name: 'Orders', meta: `${mine.length} ON FILE` },
    desk: { name: 'Viewscreen', meta: now ? 'ON SCREEN' : 'DARK' },
  };

  return (
    <div className="qgrid pgrid">
      <PostRoom name="The Main Viewscreen" art={art} prefix="v" spots={SPOTS} labels={labels} on={on} onPick={pick}
        hero="DECK 1 · THE MAIN VIEWSCREEN · YOUR DESKTOP, ON SCREEN · PICK SOMETHING IN THE ROOM, OR A TILE ON THE DESK"
        hint={`${sourceWord(f.synthetic, f.asOf)} · EVERY CLICK NEEDS YOUR OK · READ ONLY · ESC RETURNS THE SCREEN`}
        attrs={{ 'on-screen': now ? 'on' : 'off', asking: asks.length ? 'on' : 'off' }}
        desk={<DeskTiles tiles={[
          { id: 'sessions', name: 'Sessions', n: wk.sessions, sub: 'LAST 7 DAYS', colour: 'var(--acc)', pressed: screen.view === 'log', onClick: () => show({ view: 'log' }) },
          { id: 'asking', name: 'Waiting', n: asks.length, sub: 'FOR YOUR OK', colour: 'var(--captain)', pressed: screen.view === 'approve', onClick: () => show({ view: 'approve' }) },
          { id: 'approved', name: 'Approved', n: wk.approved, sub: `OF ${wk.actions} ACTIONS`, colour: '#7fd8a8', pressed: false, onClick: () => show({ view: 'log' }) },
          { id: 'denied', name: 'Denied', n: wk.denied, sub: 'LAST 7 DAYS', colour: 'var(--bad)', pressed: false, onClick: () => show({ view: 'approve' }) },
          { id: 'captures', name: 'Captures', n: wk.captures, sub: 'SENT TO TELEGRAM', colour: '#5aa7f0', pressed: screen.view === 'relay', onClick: () => show({ view: 'relay' }) },
        ]} />}>
        <ViewscreenScreen ship={ship} screen={screen} onScreen={setScreen} />
      </PostRoom>
      <aside className="side qside">
        <SessionsPanel ship={ship} onOpen={(id) => setScreen({ view: 'session', id })} />
        <AskingPanel ship={ship} onOpen={(id) => setScreen({ view: 'session', id })} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <OrdersPanel ship={ship} ids={['screen']} title="The Viewscreen's orders" onOpen={(id) => setScreen({ view: 'order', id })} />
        <WeekPanel ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

/** The sessions, newest first. */
function SessionsPanel({ ship, onOpen }: { ship: ShipView; onOpen: (id: string) => void }) {
  const f = ship.data.viewscreen;
  const list = sessions(f);
  return (
    <section className="panel grow" aria-labelledby="vsess-title">
      <div className="panel-head">
        <h2 className="panel-title" id="vsess-title">Sessions</h2>
        <Src ids={['viewscreen']} />
        <span className="mono panel-meta">{list.length} IN THE LOG · NEWEST FIRST</span>
      </div>
      <ul className="plist">
        {list.length === 0 && <li className="empty">Nothing has been on screen yet.</li>}
        {list.slice(0, 7).map((s) => {
          const t = tally(s);
          return (
            <li key={s.id}>
              <button type="button" className="plist-row" style={css({ '--pc': s.end ? 'var(--acc)' : 'var(--captain)' })} onClick={() => onOpen(s.id)}>
                <span className="pl-main">{s.why}</span>
                <span className="pl-meta mono">{s.end ? '' : 'ON SCREEN · '}{dayLine(s.start)} · {up(SURFACE_WORD[s.surface] ?? s.surface)} · {t.approved} OK{t.denied ? ` · ${t.denied} NO` : ''}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Actions waiting for the Captain's OK. */
function AskingPanel({ ship, onOpen }: { ship: ShipView; onOpen: (id: string) => void }) {
  const list = waiting(ship.data.viewscreen);
  return (
    <section className="panel" aria-labelledby="vask-title">
      <div className="panel-head">
        <h2 className="panel-title" id="vask-title">Waiting for your OK</h2>
        <Src ids={['viewscreen']} />
        <span className="mono panel-meta">{list.length} · NEVER YOLO</span>
      </div>
      <ul className="plist">
        {list.length === 0 && <li className="empty">No action waits for you.</li>}
        {list.map((a) => (
          <li key={a.action.at}>
            <button type="button" className="plist-row" style={css({ '--pc': 'var(--captain)' })} onClick={() => onOpen(a.session.id)}>
              <span className="pl-main">{a.action.what}</span>
              <span className="pl-meta mono">{up(a.action.kind)} · ASKED {clockTime(a.action.at)} · {a.session.id}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The week: sessions, actions, approved and denied, and actions per day. */
function WeekPanel({ ship }: { ship: ShipView }) {
  const f = ship.data.viewscreen;
  const wk = weekOf(f);
  const acts = f.sessions.flatMap((s) => s.actions);
  const days = lastDays(f.asOf).map((d) => ({ ...d, n: acts.filter((a) => dayKey(a.at) === d.key).length }));
  return (
    <section className="panel" aria-labelledby="vweek-title">
      <div className="panel-head">
        <h2 className="panel-title" id="vweek-title">This week</h2>
        <Src ids={['viewscreen']} />
        <span className="mono panel-meta">ACTIONS PER DAY · LAST 7 DAYS</span>
      </div>
      <div className="pweek-body">
        <Kpis items={[
          { n: wk.sessions, label: 'SESSIONS' },
          { n: wk.actions, label: 'ACTIONS ASKED' },
          { n: wk.approved, label: 'APPROVED', tone: 'good' },
          { n: wk.denied, label: 'DENIED', tone: wk.denied ? 'bad' : undefined },
        ]} />
        <DayBars days={days} label="Actions per day" />
      </div>
    </section>
  );
}

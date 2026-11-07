// Number One's post (Deck 1), beside the Captain's chair. The room is the hero: the comm channels
// (where asks come in), the fast-path plaque, the rail rules, the hails, the station lights, the
// briefing room door and the not-done tray each open a view on the wall screen; the screen starts on
// the routing table. On the desk, a tile per surface filters the table. Around the room: where the
// orders went and what waits for you on the side, Number One's own orders and the week below.
// Reading only: nothing here reaches Hermes.
import { useCallback, useState } from 'react';
import art from '../../assets/xo.svg?raw';
import type { BoardId } from '../../lib/board';
import { records, recordsFile } from '../../lib/computer';
import { inLastDays, lastDays, openedOf } from '../../lib/post';
import type { Drills, ShipView } from '../../lib/ship';
import { dayKey } from '../../lib/format';
import { railColor } from '../../lib/lookups';
import {
  EVERY, SPOTS, SURFACES, SURFACE_COLOUR, asks, channels, destinations, surfaceWord, type Route, type XoObject,
} from '../../lib/xo';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { PostRoom } from '../post/PostRoom';
import { DayBars, DeskTiles, Kpis, OrdersPanel, css, sourceWord, up } from '../post/Parts';
import { XoScreen, type Screen } from './XoScreen';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  drills: Drills;
  target: string | null;
  onTarget: (id: string) => void;
  onBoard: (b: BoardId) => void;
  onToast: (text: string) => void;
}

const SHORT = { telegram: 'Telegram', desktop: 'Desktop', dashboard: 'Dashboard' } as const;

const VIEW_OF: Partial<Record<XoObject, Screen>> = {
  channels: { view: 'channels' }, fastpath: { view: 'fastpath' }, rules: { view: 'rules' }, hails: { view: 'hails' },
  stations: { view: 'stations' }, lounge: { view: 'lounge' }, blocked: { view: 'blocked' }, desk: { view: 'station', id: 'xo' },
};
const LIT: Partial<Record<Screen['view'], XoObject>> = {
  channels: 'channels', fastpath: 'fastpath', rules: 'rules', hails: 'hails', stations: 'stations', lounge: 'lounge', blocked: 'blocked',
};

export function XoBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [route, setRoute] = useState<Route>(EVERY);
  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const pick = (o: XoObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'desk') onTarget('xo');
    const v = VIEW_OF[o];
    if (v) show(v);
  };
  // A filter always shows the table it filters.
  const routeTo = (r: Route) => { setRoute(r); setScreen({ view: 'ease' }); };

  const f = recordsFile(ship.data);
  const all = asks(ship.data);
  const ch = channels(all, f.asOf);
  const hails = records(ship.data).filter((o) => o.state === 'awaiting-captain').length;
  const blocked = records(ship.data).filter((o) => o.state === 'blocked').length;
  const xo = ship.station('xo');
  const on: XoObject | null = screen.view === 'station' ? (screen.id === 'xo' ? 'desk' : null) : LIT[screen.view] ?? null;
  const labels: Record<XoObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    channels: { name: 'Comm channels', meta: `${ch.reduce((n, c) => n + c.week, 0)} THIS WEEK` },
    fastpath: { name: 'Fast path', meta: 'FIRST WORDS' },
    rules: { name: 'Rail rules', meta: '0 TO 9' },
    hails: { name: 'Hails', meta: hails ? `${hails} FOR YOU` : 'NONE' },
    stations: { name: 'Stations', meta: `${destinations(all, f.asOf).length} TOOK ORDERS` },
    lounge: { name: 'Briefing room', meta: 'MINUTES' },
    blocked: { name: 'Not done', meta: blocked ? `${blocked} BLOCKED` : 'NONE' },
    desk: { name: 'Number One', meta: xo ? (ship.off(xo) ? 'OFF DUTY' : xo.activeOrder ?? 'ROUTING') : '' },
  };
  const kept = ch.reduce((n, c) => n + c.speed, 0);
  const total = ch.reduce((n, c) => n + c.all, 0);

  return (
    <div className="qgrid pgrid">
      <PostRoom name="Number One's post" art={art} prefix="x" spots={SPOTS} labels={labels} on={on} onPick={pick}
        hero="DECK 1 · NUMBER ONE'S POST · BESIDE YOUR CHAIR · PICK SOMETHING IN THE ROOM, OR A CHANNEL ON THE DESK"
        hint={`${sourceWord(f.synthetic, f.asOf)} · ONLY ROUTES · READ ONLY · ESC RETURNS THE SCREEN`}
        attrs={{ hails: hails ? 'on' : '0' }}
        desk={<DeskTiles tiles={[
          ...SURFACES.map((s) => {
            const c = ch.find((x) => x.id === s)!;
            return { id: s, name: SHORT[s], n: c.week, sub: `LAST 7 DAYS · ${c.all} ON FILE`, colour: SURFACE_COLOUR[s], label: `${surfaceWord(s)}, ${c.week} in the last 7 days`,
              pressed: route.surface === s && screen.view === 'ease', onClick: () => routeTo({ ...route, surface: route.surface === s ? null : s }) };
          }),
          { id: 'speed', name: 'Speed words', n: kept, sub: `OF ${total} KEPT WITH THE ORDER`, colour: 'var(--good)', label: `Speed words, ${kept} of ${total} kept`,
            pressed: screen.view === 'channels', onClick: () => show({ view: 'channels' }) },
        ]} />}>
        <XoScreen ship={ship} screen={screen} onScreen={setScreen} route={route} onRoute={routeTo} />
      </PostRoom>
      <aside className="side qside">
        <WentPanel ship={ship} route={route} onRoute={routeTo} />
        <HailsPanel ship={ship} onOpen={(id) => setScreen({ view: 'order', id, from: { view: 'hails' } })} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <OrdersPanel ship={ship} ids={['xo']} title="Number One's own orders" onOpen={(id) => setScreen({ view: 'order', id })} />
        <WeekPanel ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

/** Where the orders went this week, the busiest station first. Each one filters the routing table. */
function WentPanel({ ship, route, onRoute }: { ship: ShipView; route: Route; onRoute: (r: Route) => void }) {
  const f = recordsFile(ship.data);
  const rows = destinations(asks(ship.data), f.asOf).filter((r) => r.week > 0);
  const most = Math.max(1, ...rows.map((r) => r.week));
  return (
    <section className="panel grow" aria-labelledby="xwent-title">
      <div className="panel-head">
        <h2 className="panel-title" id="xwent-title">Where they went</h2>
        <span className="mono panel-meta">LAST 7 DAYS · {rows.length} STATIONS · PICK ONE TO FILTER</span>
      </div>
      <ul className="pbars" style={{ marginTop: 10 }}>
        {rows.length === 0 && <li className="empty">No orders in the last 7 days.</li>}
        {rows.map((r) => {
          const st = ship.station(r.id);
          return (
            <li key={r.id}>
              <button type="button" className="pbar-row" aria-pressed={route.station === r.id} style={css({ '--pc': railColor(st?.rail ?? 'mixed') })}
                onClick={() => onRoute({ surface: null, station: route.station === r.id ? null : r.id })}>
                <span className="pb-label">{st?.short ?? r.id}</span>
                <span className="pb-track"><b style={{ width: `${(r.week / most) * 100}%` }} /></span>
                <span className="pb-v mono">{r.week}{r.open ? ` · ${r.open} OPEN` : ''}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Orders waiting on the Captain. */
function HailsPanel({ ship, onOpen }: { ship: ShipView; onOpen: (id: string) => void }) {
  const list = records(ship.data).filter((o) => o.state === 'awaiting-captain');
  return (
    <section className="panel" aria-labelledby="xhail-title">
      <div className="panel-head">
        <h2 className="panel-title" id="xhail-title">Waiting for you</h2>
        <span className="mono panel-meta">{list.length} HAILS</span>
      </div>
      <ul className="plist">
        {list.length === 0 && <li className="empty">Nothing waits for you.</li>}
        {list.slice(0, 5).map((o) => (
          <li key={o.id}>
            <button type="button" className="plist-row" style={css({ '--pc': 'var(--captain)' })} onClick={() => onOpen(o.id)}>
              <span className="pl-main">{o.title}</span>
              <span className="pl-meta mono">{o.id} · {up(ship.station(o.station)?.short ?? o.station)} · {up(surfaceWord(o.surface))}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The week: asks in, chat or card, not done, and asks per day. */
function WeekPanel({ ship }: { ship: ShipView }) {
  const f = recordsFile(ship.data);
  const week = asks(ship.data).filter((o) => inLastDays(openedOf(o), f.asOf));
  const days = lastDays(f.asOf).map((d) => ({ ...d, n: week.filter((o) => dayKey(openedOf(o)) === d.key).length }));
  return (
    <section className="panel" aria-labelledby="xweek-title">
      <div className="panel-head">
        <h2 className="panel-title" id="xweek-title">This week</h2>
        <span className="mono panel-meta">ASKS PER DAY · LAST 7 DAYS</span>
      </div>
      <div className="pweek-body">
        <Kpis items={[
          { n: week.length, label: 'ASKS IN' },
          { n: week.filter((o) => o.cards === 0).length, label: 'ANSWERED IN CHAT' },
          { n: week.filter((o) => (o.cards ?? 0) > 0).length, label: 'CARDS FILED' },
          { n: week.filter((o) => o.state === 'blocked').length, label: 'NOT DONE', tone: week.some((o) => o.state === 'blocked') ? 'bad' : undefined },
        ]} />
        <DayBars days={days} label="Asks per day" />
      </div>
    </section>
  );
}

// Number One's post (Deck 1), beside the Captain's chair. The room is the hero: the comm channels
// (where asks come in), the fast-path plaque, the hails, the rail-rules cabinet, the briefing room
// door and the not-done tray each open a view on the wall screen. The wall screen is wider here and
// the routing fan fills it: your channels in, the stations out. Pick a station or a channel and the
// side console lists those asks, a page at a time; the fan's second page tests where a message would
// go. The fast path drafts new coded first words for Engineering. On the desk, a tile per surface filters the fan.
// Around the room: the side console and what waits for you, Number One's own orders and the week.
// Reading only: nothing here reaches Hermes.
import { useCallback, useState } from 'react';
import art from '../../assets/xo.svg?raw';
import type { BoardId } from '../../lib/board';
import { STATE_WORD, records, recordsFile } from '../../lib/computer';
import { inLastDays, lastDays, openedOf } from '../../lib/post';
import type { Drills, ShipView } from '../../lib/ship';
import type { Live } from '../../lib/data';
import { dayAndTime, dayKey } from '../../lib/format';
import { railColor } from '../../lib/lookups';
import {
  EVERY, SCREEN, SPOTS, SURFACES, SURFACE_COLOUR, asks, channels, fastPaths, routed, surfaceWord, type Route, type XoObject,
} from '../../lib/xo';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { PostRoom } from '../post/PostRoom';
import { DayBars, DeskTiles, Kpis, OrdersPanel, css, sourceWord, up } from '../post/Parts';
import { XoScreen, type Screen } from './XoScreen';
import { Marked } from '../Marked';
import { Src } from '../Src';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  drills: Drills;
  target: string | null;
  onTarget: (id: string) => void;
  onBoard: (b: BoardId) => void;
  onToast: (text: string) => void;
  /** Read the probes' files now (the fast path's "Re-sync with the core"). */
  onResync?: () => Promise<Live>;
}

const SHORT = { telegram: 'Telegram', desktop: 'Desktop', dashboard: 'Dashboard' } as const;

const VIEW_OF: Partial<Record<XoObject, Screen>> = {
  channels: { view: 'channels' }, fastpath: { view: 'fastpath' }, rules: { view: 'rules' }, hails: { view: 'hails' },
  lounge: { view: 'lounge' }, blocked: { view: 'blocked' }, desk: { view: 'station', id: 'xo' },
};
const LIT: Partial<Record<Screen['view'], XoObject>> = {
  channels: 'channels', fastpath: 'fastpath', rules: 'rules', hails: 'hails', lounge: 'lounge', blocked: 'blocked',
};

export function XoBoard({ ship, drills, target, onTarget, onBoard, onToast, onResync }: Props) {
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
    fastpath: { name: 'Fast path', meta: `${fastPaths(ship.data).length} IN CODE` },
    rules: { name: 'Rail rules', meta: '0 TO 9' },
    hails: { name: 'Hails', meta: hails ? `${hails} FOR YOU` : 'NONE' },
    lounge: { name: 'Briefing room', meta: 'MINUTES' },
    blocked: { name: 'Not done', meta: blocked ? `${blocked} BLOCKED` : 'NONE' },
    desk: { name: 'Number One', meta: xo ? (ship.off(xo) ? 'OFF DUTY' : xo.activeOrder ?? 'ROUTING') : '' },
  };
  const kept = ch.reduce((n, c) => n + c.speed, 0);
  const total = ch.reduce((n, c) => n + c.all, 0);

  return (
    <div className="qgrid pgrid">
      <PostRoom name="Number One's post" art={art} prefix="x" spots={SPOTS} labels={labels} on={on} onPick={pick} screen={SCREEN}
        hero="DECK 1 · NUMBER ONE'S POST · EVERY ASK IN, ONE STATION OUT · PICK SOMETHING IN THE ROOM, OR A CHANNEL ON THE DESK"
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
        <XoScreen ship={ship} screen={screen} onScreen={setScreen} route={route} onRoute={routeTo} onToast={onToast} onResync={onResync} />
      </PostRoom>
      <aside className="side qside">
        {/* a new pick starts on the first page */}
        <RoutedPanel key={`${route.surface ?? ''}|${route.station ?? ''}`} ship={ship} route={route} onRoute={routeTo} onOpen={(id) => setScreen({ view: 'order', id })} />
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

const PAGE = 12;

/** The side console: every ask, or the ones from the station or channel picked on the fan, newest first, a page at a time. */
function RoutedPanel({ ship, route, onRoute, onOpen }: { ship: ShipView; route: Route; onRoute: (r: Route) => void; onOpen: (id: string) => void }) {
  const list = routed(asks(ship.data), route);
  const st = route.station ? ship.station(route.station) : undefined;
  const [pg, setPg] = useState(0);
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const page = Math.min(pg, pages - 1);
  const shown = list.slice(page * PAGE, (page + 1) * PAGE);
  const from = route.surface ? up(surfaceWord(route.surface)) : '';
  const title = st ? `Routed to ${st.short}` : route.surface ? `From ${surfaceWord(route.surface)}` : 'Every ask';
  const sub = st ? `${up(st.name)}${from ? ` · FROM ${from}` : ''}` : route.surface ? 'EVERY STATION' : 'PICK A STATION ON THE FAN';
  return (
    <section className="panel grow xroute" aria-labelledby="xroute-title">
      <div className="panel-head">
        <h2 className="panel-title" id="xroute-title">{title}</h2>
        <Src ids={['orders']} />
        <span className="mono panel-meta"><Marked>{list.length} · {sub} · NEWEST FIRST</Marked></span>
        {(route.station || route.surface) && <button type="button" className="pchip" onClick={() => onRoute(EVERY)}>× ALL</button>}
      </div>
      <ol className="plist xr-rows">
        {list.length === 0 && <li className="empty">Nothing routed here.</li>}
        {shown.map((o) => {
          const to = ship.station(o.station);
          return (
            <li key={o.id}>
              <button type="button" className={`plist-row ts-${o.state}`} style={css({ '--pc': railColor(to?.rail ?? 'mixed') })} onClick={() => onOpen(o.id)}>
                <span className="pl-main">{o.title}</span>
                <span className="pl-meta mono">
                  {st ? `${o.id} · ${STATE_WORD[o.state]} · FROM ${up(o.surface ?? '?')}` : `${o.id} → ${up(to?.short ?? o.station)} · ${STATE_WORD[o.state]} · ${up(o.surface ?? '?')}`} · {up(dayAndTime(openedOf(o)))}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {pages > 1 && (
        <div className="xr-foot">
          <button type="button" className="pchip" disabled={page === 0} onClick={() => setPg(page - 1)}>‹ NEWER</button>
          <span className="xr-at mono">{page * PAGE + 1}–{page * PAGE + shown.length} OF {list.length}</span>
          <button type="button" className="pchip" disabled={page === pages - 1} onClick={() => setPg(page + 1)}>OLDER ›</button>
        </div>
      )}
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
        <Src ids={['orders']} />
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
        <Src ids={['orders']} />
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

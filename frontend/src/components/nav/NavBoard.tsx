// Navigation's post (Deck 1, flight control): the calendar, travel and bookings. The room is the hero:
// the star chart, the week grid, the booking terminal, the slot board and the door to Helm each open
// a view on the wall screen; the screen starts on the next 7 days. On the desk, a tile per view.
// Around the room: what is held for you, what is coming, Navigation's own orders and the week ahead.
// Reading only: nothing here reaches Hermes, and Navigation never presses Confirm.
import { useCallback, useState } from 'react';
import art from '../../assets/nav.svg?raw';
import type { BoardId } from '../../lib/board';
import { dayKey, dayLine } from '../../lib/format';
import { ordersOf } from '../../lib/post';
import type { Drills, ShipView } from '../../lib/ship';
import {
  KIND_COLOUR, SPOTS, coming, dayOf, held, holdLeft, nextDays, span, trips, wanted, when, type NavObject,
} from '../../lib/nav';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { PostRoom } from '../post/PostRoom';
import { DayBars, DeskTiles, Kpis, OrdersPanel, css, sourceWord, up } from '../post/Parts';
import { NavScreen, type Screen } from './NavScreen';
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

const VIEW_OF: Partial<Record<NavObject, Screen>> = {
  chart: { view: 'chart' }, week: { view: 'agenda' }, bookings: { view: 'bookings' }, slots: { view: 'slots' }, orders: { view: 'orders' }, desk: { view: 'station', id: 'nav' },
};
const LIT: Partial<Record<Screen['view'], NavObject>> = { chart: 'chart', trip: 'chart', agenda: 'week', bookings: 'bookings', slots: 'slots', orders: 'orders' };

export function NavBoard({ ship, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const show = useCallback((x: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(x) ? { view: 'ease' } : x)), []);
  const pick = (o: NavObject) => {
    if (o === 'bridge') return onBoard('bridge');
    if (o === 'helm') return onBoard('helm');
    if (o === 'desk') onTarget('nav');
    const v = VIEW_OF[o];
    if (v) show(v);
  };

  const f = ship.data.nav;
  const days = nextDays(f.asOf);
  const week = days.reduce((n, d) => n + dayOf(f, d.key).length, 0);
  const hold = held(f);
  const plans = trips(f).filter((t) => t.status === 'planned' || t.status === 'booked');
  const want = wanted(ship.data);
  const mine = ordersOf(ship.data, ['nav']);
  const nav = ship.station('nav');
  const on: NavObject | null = screen.view === 'station' ? (screen.id === 'nav' ? 'desk' : null) : LIT[screen.view] ?? null;
  const labels: Record<NavObject, { name: string; meta?: string }> = {
    bridge: { name: 'Turbolift', meta: 'TO THE BRIDGE' },
    chart: { name: 'Star chart', meta: `${plans.length} TRIPS PLANNED` },
    week: { name: 'The calendar', meta: `${week} THIS WEEK` },
    bookings: { name: 'Bookings', meta: hold.length ? `${hold.length} HELD` : 'NONE HELD' },
    slots: { name: 'Slots wanted', meta: `${want.length} IN SCHEDULE` },
    helm: { name: 'Flight control', meta: 'TO HELM' },
    orders: { name: 'Orders', meta: `${mine.length} ON FILE` },
    desk: { name: 'Navigation', meta: nav ? (ship.off(nav) ? 'OFF DUTY' : nav.activeOrder ?? 'PLOTTING') : '' },
  };
  const tile = (id: string, name: string, n: number, sub: string, colour: string, s: Screen) => ({
    id, name, n, sub, colour, label: `${name}, ${n}`, pressed: screen.view === s.view, onClick: () => (s.view === 'ease' ? setScreen(s) : show(s)),
  });

  return (
    <div className="qgrid pgrid">
      <PostRoom name="Navigation" art={art} prefix="n" spots={SPOTS} labels={labels} on={on} onPick={pick}
        hero="DECK 1 · NAVIGATION · CALENDAR, TRAVEL AND BOOKINGS · PICK SOMETHING IN THE ROOM, OR A TILE ON THE DESK"
        hint={`${sourceWord(f.synthetic, f.asOf)} · STOPS BEFORE CONFIRM · READ ONLY · ESC RETURNS THE SCREEN`}
        attrs={{ held: hold.length ? 'on' : '0' }}
        desk={<DeskTiles tiles={[
          tile('week', 'Week', week, 'EVENTS ON THE CALENDAR', 'var(--acc)', { view: 'ease' }),
          tile('held', 'Held', hold.length, 'BOOKINGS BEFORE CONFIRM', 'var(--captain)', { view: 'bookings' }),
          tile('trips', 'Trips', plans.length, 'PLANNED OR BOOKED', '#b9a6f5', { view: 'chart' }),
          tile('slots', 'Slots', want.length, "THE YEOMAN'S SCHEDULE BOX", '#5aa7f0', { view: 'slots' }),
          tile('orders', 'Orders', mine.length, 'ON FILE FOR NAVIGATION', '#8fd14f', { view: 'orders' }),
        ]} />}>
        <NavScreen ship={ship} screen={screen} onScreen={setScreen} />
      </PostRoom>
      <aside className="side qside">
        <ComingPanel ship={ship} onAll={() => setScreen({ view: 'agenda' })} />
        <HeldPanel ship={ship} onOpen={() => setScreen({ view: 'bookings' })} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <OrdersPanel ship={ship} ids={['nav']} title="Navigation's own orders" onOpen={(id) => setScreen({ view: 'order', id })} />
        <AheadPanel ship={ship} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}

/** What is coming on the calendar, soonest first. */
function ComingPanel({ ship, onAll }: { ship: ShipView; onAll: () => void }) {
  const list = coming(ship.data.nav);
  return (
    <section className="panel grow" aria-labelledby="ncoming-title">
      <div className="panel-head">
        <h2 className="panel-title" id="ncoming-title">Coming up</h2>
        <Src ids={['nav']} />
        <span className="mono panel-meta">{list.length} ON THE CALENDAR · SOONEST FIRST</span>
      </div>
      <ul className="plist">
        {list.length === 0 && <li className="empty">Nothing on the calendar.</li>}
        {list.slice(0, 7).map((e) => (
          <li key={e.id}>
            <button type="button" className="plist-row" style={css({ '--pc': KIND_COLOUR[e.kind] })} onClick={onAll}>
              <span className="pl-main">{e.title}</span>
              <span className="pl-meta mono">{dayLine(e.start)} · {span(e)}{e.place ? ` · ${up(e.place)}` : ''}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Bookings held for the Captain, the hold running out first. */
function HeldPanel({ ship, onOpen }: { ship: ShipView; onOpen: () => void }) {
  const f = ship.data.nav;
  const list = held(f).sort((a, b) => (a.heldUntil ?? a.when).localeCompare(b.heldUntil ?? b.when));
  return (
    <section className="panel" aria-labelledby="nheld-title">
      <div className="panel-head">
        <h2 className="panel-title" id="nheld-title">Held for you</h2>
        <Src ids={['nav']} />
        <span className="mono panel-meta">{list.length} · CONFIRM IS YOURS</span>
      </div>
      <ul className="plist">
        {list.length === 0 && <li className="empty">Nothing is held.</li>}
        {list.map((b) => {
          const left = holdLeft(b, f.asOf);
          return (
            <li key={b.id}>
              <button type="button" className="plist-row" style={css({ '--pc': left !== null && left < 0 ? 'var(--bad)' : 'var(--captain)' })} onClick={onOpen}>
                <span className="pl-main">{b.what}</span>
                <span className="pl-meta mono">{when(b.when)}{left !== null ? (left < 0 ? ' · HOLD RAN OUT' : ` · ${left} H LEFT ON THE HOLD`) : ''}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The week ahead: events, held, trips and free days, and events per day. */
function AheadPanel({ ship }: { ship: ShipView }) {
  const f = ship.data.nav;
  const days = nextDays(f.asOf).map((d) => ({ key: d.key, label: d.short, n: dayOf(f, d.key).length }));
  return (
    <section className="panel" aria-labelledby="nahead-title">
      <div className="panel-head">
        <h2 className="panel-title" id="nahead-title">The week ahead</h2>
        <Src ids={['nav']} />
        <span className="mono panel-meta">EVENTS PER DAY · THE NEXT 7 DAYS</span>
      </div>
      <div className="pweek-body">
        <Kpis items={[
          { n: days.reduce((n, d) => n + d.n, 0), label: 'EVENTS' },
          { n: days.filter((d) => d.n === 0).length, label: 'FREE DAYS', tone: 'good' },
          { n: held(f).length, label: 'HELD FOR YOU', tone: held(f).length ? 'warn' : undefined },
          { n: f.trips.filter((t) => t.status !== 'idea' && t.status !== 'done' && days.some((d) => d.key === dayKey(t.depart))).length, label: 'TRIPS LEAVING' },
        ]} />
        <DayBars days={days} label="Events per day, the next 7 days" today={days[0].key} />
      </div>
    </section>
  );
}

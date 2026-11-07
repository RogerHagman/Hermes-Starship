// Navigation's wall screen. One view at a time, in place: the next 7 days, the calendar as a list,
// the star chart of trips, one trip, the bookings held for you, the slots the Yeoman's Schedule box
// wants, Navigation's orders, one order and Navigation's card.
import type { ReactNode } from 'react';
import { clockTime, dayKey, dayLine } from '../../lib/format';
import { ordersOf } from '../../lib/post';
import type { ShipView } from '../../lib/ship';
import {
  BOOKING_COLOUR, BOOKING_WORD, DAY_FROM, DAY_TO, KIND_COLOUR, KIND_WORD, MODE_WORD, NAV_ICONS, TRIP_COLOUR, TRIP_WORD,
  bookings, coming, dayOf, freeSlots, holdLeft, nextDays, span, stops, trips, wanted, when,
} from '../../lib/nav';
import type { NavFile, Trip } from '../../types';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';
import { OrderRow, OrderView, css, sourceWord, up } from '../post/Parts';

export type Screen =
  | { view: 'ease' } | { view: 'agenda' } | { view: 'chart' } | { view: 'trip'; id: string; from?: Screen } | { view: 'bookings' }
  | { view: 'slots' } | { view: 'orders' } | { view: 'order'; id: string; from?: Screen } | { view: 'station'; id: string };

interface Props { ship: ShipView; screen: Screen; onScreen: (s: Screen) => void }

export function NavScreen({ ship, screen, onScreen }: Props) {
  const f = ship.data.nav;
  const back = () => onScreen({ view: 'ease' });
  const from = 'from' in screen ? screen.from : undefined;
  useEscape(screen.view !== 'ease', from ? () => onScreen(from) : back);
  const openTrip = (here: Screen) => (id: string) => onScreen({ view: 'trip', id, from: here });
  const openOrder = (here?: Screen) => (id: string) => onScreen({ view: 'order', id, from: here });
  let body: ReactNode;
  switch (screen.view) {
    case 'agenda': body = <AgendaView f={f} onOrder={openOrder(screen)} onBack={back} />; break;
    case 'chart': body = <ChartView f={f} onOpen={openTrip(screen)} onBack={back} />; break;
    case 'trip': body = <TripView f={f} id={screen.id} back={from ? '‹ Back' : '‹ The next 7 days'} onBack={() => onScreen(from ?? { view: 'ease' })} onOrder={openOrder(screen)} />; break;
    case 'bookings': body = <BookingsView f={f} onOrder={openOrder(screen)} onBack={back} />; break;
    case 'slots': body = <SlotsView ship={ship} onBack={back} />; break;
    case 'orders': body = <OrdersView ship={ship} onOpen={openOrder(screen)} onBack={back} />; break;
    case 'order': body = <OrderView ship={ship} id={screen.id} icon={NAV_ICONS.orders}
      back={from ? '‹ Back' : '‹ The next 7 days'} onBack={() => onScreen(from ?? { view: 'ease' })} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ The next 7 days" onBack={back} here="nav" />;
      break;
    }
  }
  if (!body) body = <WeekView f={f} onTrip={openTrip({ view: 'ease' })} />;
  return (
    <section className="console wall post-screen" role="region" aria-label="Navigation's screen" style={css({ '--c': 'var(--acc)' })}>
      {body}
    </section>
  );
}

const source = (f: NavFile) => sourceWord(f.synthetic, f.asOf).replace('SAMPLE', 'SAMPLE CHARTS');

/** An order number that opens the order, when it has one. */
function Ord({ id, onOrder }: { id?: string; onOrder: (id: string) => void }) {
  return id ? <button type="button" className="linkish mono nord" onClick={() => onOrder(id)}>{id}</button> : null;
}

// ---------- the next 7 days ----------

function WeekView({ f, onTrip }: { f: NavFile; onTrip: (id: string) => void }) {
  const days = nextDays(f.asOf);
  const today = dayKey(f.asOf);
  const tripOn = (key: string) => f.trips.filter((t) => t.status !== 'idea' && dayKey(t.depart) <= key && dayKey(t.back ?? t.depart) >= key);
  return (
    <>
      <ConHead icon={NAV_ICONS.ease} title="The next 7 days" sub={`${days[0].label} TO ${days[6].label} · SHIP'S TIME · ${source(f)}`} />
      <ol className="nweek" aria-label="The next 7 days">
        {days.map((d) => {
          const list = dayOf(f, d.key);
          const tr = tripOn(d.key);
          return (
            <li key={d.key} className={d.key === today ? 'today' : undefined}>
              <span className="nw-day mono">{d.key === today ? 'TODAY' : d.short} <b>{d.label.split(' ')[1]}</b></span>
              {tr.map((t) => (
                <button key={t.id} type="button" className="nw-trip mono" style={css({ '--pc': TRIP_COLOUR[t.status] })} onClick={() => onTrip(t.id)} title={t.title}>
                  {t.to.toUpperCase()}
                </button>
              ))}
              <ol className="nw-list">
                {list.length === 0 && <li className="nw-free mono">FREE</li>}
                {list.map((e) => (
                  <li key={e.id} className={'nw-ev' + (e.kind === 'hold' ? ' hold' : '')} style={css({ '--pc': KIND_COLOUR[e.kind] })} title={`${e.title} · ${KIND_WORD[e.kind]}`}>
                    <span className="mono">{clockTime(e.start)}</span>
                    <span>{e.title}</span>
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>
      <ul className="nlegend mono" aria-label="Kinds">
        {(Object.keys(KIND_WORD) as (keyof typeof KIND_WORD)[]).map((k) => <li key={k} style={css({ '--pc': KIND_COLOUR[k] })}>{up(KIND_WORD[k])}</li>)}
      </ul>
    </>
  );
}

// ---------- the calendar as a list ----------

function AgendaView({ f, onOrder, onBack }: { f: NavFile; onOrder: (id: string) => void; onBack: () => void }) {
  const list = [...f.events].sort((a, b) => a.start.localeCompare(b.start));
  const past = list.filter((e) => (e.end ?? e.start) < f.asOf).length;
  return (
    <>
      <ConHead icon={NAV_ICONS.agenda} title="The calendar" back="‹ The next 7 days" onBack={onBack}
        sub={`${list.length} ON FILE · ${list.length - past} COMING · ${source(f)}`} />
      <div className="con-body pbody">
        <ul className="prows">
          {list.map((e) => (
            <li key={e.id}><div className={'prow' + ((e.end ?? e.start) < f.asOf ? ' dim' : '')} style={css({ '--pc': KIND_COLOUR[e.kind] })}>
              <span className="pr-text">{e.title}</span>
              <span className="pr-when mono">{dayLine(e.start)} · {span(e)}</span>
              <span className="pr-why">{KIND_WORD[e.kind]}{e.place ? ` · ${e.place}` : ''} <Ord id={e.sourceOrd} onOrder={onOrder} /></span>
            </div></li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- the star chart: trips ----------

function Course({ t }: { t: Trip }) {
  const s = stops(t);
  return (
    <ol className="ncourse" aria-label={`From ${s[0]} to ${s[s.length - 1]}`}>
      {s.map((p, i) => <li key={`${p}-${i}`} className={i === s.length - 1 ? 'end' : undefined}><span>{p}</span></li>)}
    </ol>
  );
}

function ChartView({ f, onOpen, onBack }: { f: NavFile; onOpen: (id: string) => void; onBack: () => void }) {
  const list = trips(f);
  return (
    <>
      <ConHead icon={NAV_ICONS.chart} title={`Star chart · ${list.length} trips`} back="‹ The next 7 days" onBack={onBack}
        sub={`BOOKED, THEN PLANNED, THEN IDEAS · ${source(f)}`} />
      <div className="con-body pbody">
        {list.length === 0 && <p className="pnote">No trips on the chart.</p>}
        <ul className="prows">
          {list.map((t) => (
            <li key={t.id}>
              <button type="button" className={'prow' + (t.status === 'idea' || t.status === 'done' ? ' dim' : '')} style={css({ '--pc': TRIP_COLOUR[t.status] })} onClick={() => onOpen(t.id)}>
                <span className="pr-text">{t.title}</span>
                <span className="pr-when mono">{up(TRIP_WORD[t.status])} · {when(t.depart)}</span>
                <span className="pr-why"><Course t={t} /></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function TripView({ f, id, back, onBack, onOrder }: { f: NavFile; id: string; back: string; onBack: () => void; onOrder: (id: string) => void }) {
  const t = f.trips.find((x) => x.id === id);
  if (!t) return <ConHead icon={NAV_ICONS.trip} title={id} sub="NO SUCH TRIP ON THE CHART" back={back} onBack={onBack} />;
  const bk = f.bookings.filter((b) => b.sourceOrd && b.sourceOrd === t.sourceOrd);
  return (
    <>
      <ConHead icon={NAV_ICONS.trip} title={t.title} back={back} onBack={onBack}
        sub={`${up(TRIP_WORD[t.status])} · ${up(t.from)} TO ${up(t.to)} · ${when(t.depart)}${t.back ? ` · BACK ${dayLine(t.back)}` : ''}`} />
      <div className="con-body pbody">
        <Course t={t} />
        {t.legs?.length ? (
          <ol className="prows">
            {t.legs.map((l, i) => (
              <li key={i}><div className="prow" style={css({ '--pc': TRIP_COLOUR[t.status] })}>
                <span className="pr-text">{MODE_WORD[l.mode]} · {l.from} to {l.to}</span>
                <span className="pr-when mono">{dayLine(l.depart)} · {clockTime(l.depart)}{l.arrive ? `–${clockTime(l.arrive)}` : ''}</span>
              </div></li>
            ))}
          </ol>
        ) : <p className="pnote">No legs planned yet: an idea on the chart. Ask Navigation for options when it firms up.</p>}
        {bk.length > 0 && (
          <div className="psec">
            <span className="cb-head mono">BOOKINGS FOR THIS TRIP</span>
            <ul className="prows">
              {bk.map((b) => (
                <li key={b.id}><div className="prow" style={css({ '--pc': BOOKING_COLOUR[b.status] })}>
                  <span className="pr-text">{b.what}</span>
                  <span className="pr-when mono">{up(BOOKING_WORD[b.status])}{b.heldUntil && b.status === 'held' ? ` · UNTIL ${when(b.heldUntil)}` : ''}</span>
                </div></li>
              ))}
            </ul>
          </div>
        )}
        {t.sourceOrd && <p className="pnote">Planned on order <Ord id={t.sourceOrd} onOrder={onOrder} />.</p>}
      </div>
    </>
  );
}

// ---------- bookings ----------

function BookingsView({ f, onOrder, onBack }: { f: NavFile; onOrder: (id: string) => void; onBack: () => void }) {
  const list = bookings(f);
  return (
    <>
      <ConHead icon={NAV_ICONS.bookings} title={`Bookings · ${list.filter((b) => b.status === 'held').length} held for you`} back="‹ The next 7 days" onBack={onBack}
        sub="NAVIGATION STOPS BEFORE CONFIRM · CONFIRM IS YOURS" />
      <div className="con-body pbody">
        <ul className="prows">
          {list.map((b) => {
            const left = b.status === 'held' ? holdLeft(b, f.asOf) : null;
            return (
              <li key={b.id}><div className={'prow' + (b.status === 'released' ? ' dim' : '') + (left !== null && left < 0 ? ' alert' : '')} style={css({ '--pc': BOOKING_COLOUR[b.status] })}>
                <span className="pr-text">{b.what}</span>
                <span className="pr-when mono">{up(BOOKING_WORD[b.status])}{left !== null ? (left < 0 ? ' · THE HOLD RAN OUT' : ` · ${left} H LEFT`) : ''}</span>
                <span className="pr-why">
                  {when(b.when)}{b.where ? ` · ${b.where}` : ''}{b.heldUntil && b.status === 'held' ? `. Held until ${when(b.heldUntil)}.` : '.'} <Ord id={b.sourceOrd} onOrder={onOrder} />
                </span>
              </div></li>
            );
          })}
        </ul>
        <p className="pnote">To take a held booking, confirm it yourself on the provider's own page. Navigation never presses Confirm or pays.</p>
      </div>
    </>
  );
}

// ---------- slots wanted ----------

function SlotsView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const f = ship.data.nav;
  const want = wanted(ship.data);
  const free = freeSlots(f);
  const y = ship.data.yeoman;
  return (
    <>
      <ConHead icon={NAV_ICONS.slots} title={`Slots wanted · ${want.length}`} back="‹ The next 7 days" onBack={onBack}
        sub={`THE YEOMAN'S SCHEDULE BOX · IMPORTANT, NOT URGENT · ${y.synthetic ? 'SAMPLE LIST' : 'LIVE LIST'}`} />
      <div className="con-body pbody">
        <div className="nslots">
          <div className="psec">
            <span className="cb-head mono">WAITING FOR A SLOT</span>
            {want.length === 0 && <p className="pnote">The Schedule box is empty.</p>}
            <ul className="prows">
              {want.map((t) => (
                <li key={t.id}><div className="prow" style={css({ '--pc': '#5aa7f0' })}>
                  <span className="pr-text">{t.text}</span>
                  <span className="pr-when mono">{t.due ? `DUE ${dayLine(t.due)}` : 'NO DUE DATE'}</span>
                </div></li>
              ))}
            </ul>
          </div>
          <div className="psec">
            <span className="cb-head mono">FREE {DAY_FROM}–{DAY_TO} · AN HOUR OR MORE</span>
            <ul className="nfree">
              {free.map((d) => (
                <li key={d.key}>
                  <span className="mono">{d.label}</span>
                  <span>{d.windows.length ? d.windows.map((w) => <span key={w.from} className="ppill">{w.from}–{w.to}</span>) : <i className="mono">{d.over ? 'THE DAY IS OVER' : 'FULL'}</i>}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="pnote">Navigation offers the slots; you pick one, and the Yeoman sets the due date. Nothing here is booked.</p>
      </div>
    </>
  );
}

// ---------- Navigation's orders ----------

function OrdersView({ ship, onOpen, onBack }: { ship: ShipView; onOpen: (id: string) => void; onBack: () => void }) {
  const list = ordersOf(ship.data, ['nav']);
  return (
    <>
      <ConHead icon={NAV_ICONS.orders} title={`Navigation's orders · ${list.length}`} back="‹ The next 7 days" onBack={onBack}
        sub={`EVERY ORDER ON FILE · NEWEST FIRST · ${coming(ship.data.nav).length} EVENTS COMING`} />
      <div className="con-body pbody">
        {list.length === 0 && <p className="pnote">No orders on file for Navigation yet.</p>}
        <ol className="porders">{list.map((o) => <OrderRow key={o.id} ship={ship} o={o} onOpen={onOpen} extra={<span />} />)}</ol>
      </div>
    </>
  );
}

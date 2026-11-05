// A station in the console under the saucer, on three pages like the Captain's chair:
//   1. The station: its picture, status, what it is working on and its console button.
//   2. Station card: the full card (StationDetail).
//   3. Service log: the orders it has handled and its lines in the ship's log, newest first.
// Picking an order on page 3 shows it on page 1.
import { useState } from 'react';
import { dayAndTime } from '../lib/format';
import { SHIP_MAP } from '../lib/shipmap';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';
import { Pager } from './Pager';
import { ConHead, ConsoleFoot, OrderBox, StationDetail, StationPills, stationColour, stationSub, type Relief } from './ShipConsole';
import { StationArt } from './StationArt';

const ICONS = SHIP_MAP.icons as Record<string, string>;
const PAGES = ['The station', 'Station card', 'Service log'];

export function StationScene({ ship, st, orderId, back, onBack, onQuarters, relief }: {
  ship: ShipView; st: Station; orderId?: string; back: string; onBack: () => void; onQuarters?: () => void; relief?: Relief;
}) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(orderId);
  const pager = <Pager pages={PAGES} page={page} onPage={setPage} />;
  const head = <ConHead icon={ICONS[st.id]} title={st.name} sub={stationSub(st)} back={back} onBack={onBack}>{pager}</ConHead>;
  const showOrder = (id: string) => { setOrder(id); setPage(0); };
  return (
    <section className="console scene" role="region" aria-label={`${st.name} console`} style={{ '--c': stationColour(st) } as React.CSSProperties}>
      {page === 1 && <StationDetail ship={ship} st={st} orderId={order} back={back} onBack={onBack} actions={pager} onQuarters={onQuarters} relief={relief} />}
      {page === 2 && <>{head}<ServiceLog ship={ship} st={st} picked={order} onOrder={showOrder} /></>}
      {page === 0 && <>
        {head}
        <div className="cchair-body">
          <StationArt ship={ship} st={st} />
          <div className="station-side">
            <StationPills ship={ship} st={st} />
            <div className="con-body">
              {(order ?? st.activeOrder) ? <OrderBox ship={ship} st={st} orderId={order} /> : <span className="cchair-count mono">NO ORDER AT THIS STATION</span>}
              <p className="con-text station-duty">{st.duty}</p>
            </div>
            <ConsoleFoot st={st} onQuarters={onQuarters} relief={relief} />
          </div>
        </div>
      </>}
    </section>
  );
}

/** Page 3: the station's orders (any state) and its ship's log lines, newest first. */
function ServiceLog({ ship, st, picked, onOrder }: { ship: ShipView; st: Station; picked?: string; onOrder: (id: string) => void }) {
  const orders = ship.data.orders.orders.filter((o) => o.station === st.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const lines = ship.data.shiplog.entries.filter((e) => e.station === st.id);
  return (
    <div className="con-body svc">
      <span className="cchair-count mono">ORDERS · {orders.length || 'NONE YET'}</span>
      {orders.length > 0 && (
        <ul className="svc-list">
          {orders.map((o) => {
            const state = o.state === 'awaiting-captain' ? 'waits for you' : o.state;
            return (
              <li key={o.id}>
                <button type="button" className="svc-row" aria-pressed={picked === o.id} onClick={() => onOrder(o.id)} title={`${o.id} · ${o.title}`}>
                  <span className={`statepill ${o.state}`}>{state.toUpperCase()}</span>
                  <span className="svc-title">{o.title}</span>
                  <span className="idtag">{o.id} · {dayAndTime(o.updatedAt).toUpperCase()}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <span className="cchair-count mono">SHIP'S LOG · {lines.length || 'NOTHING YET'}</span>
      {lines.length > 0 && (
        <ol className="svc-log">
          {lines.map((e) => (
            <li key={e.at + e.text}>
              <time className="idtag" dateTime={e.at}>{dayAndTime(e.at).toUpperCase()}</time>
              <span>{e.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

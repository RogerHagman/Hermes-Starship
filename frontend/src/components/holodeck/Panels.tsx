// The panels around the Holodeck: its crew, the build queue (rooms waiting for their crew,
// and the drafts spun up here), the register of every room on the ship, and the deck's orders.
import { OWN_BOARD } from '../../lib/board';
import { BOARDS, DEPTS, RANK, RAIL, STATUS, railColor } from '../../lib/lookups';
import { clockTime, dayAndTime } from '../../lib/format';
import type { Asset, Draft } from '../../lib/holodeck';
import { SHIP_MAP } from '../../lib/shipmap';
import type { ShipView } from '../../lib/ship';
import { Pips } from '../Roster';
import type { RailFilter } from '../SideRail';
import { stationColour } from '../ShipConsole';
import { leadOf } from './HoloScreen';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const PLACES = SHIP_MAP.places as Record<string, { x: number; y: number; w: number }>;

// ---------- the Holodeck crew ----------

export function CrewPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (id: string) => void }) {
  const crew = ship.data.stations.stations.filter((s) => s.dept === 'holo')
    .sort((a, b) => Number(!!b.head) - Number(!!a.head) || RANK[a.rank].order - RANK[b.rank].order);
  const lead = leadOf(ship);
  const dept = DEPTS.find((d) => d.id === 'holo')!;
  return (
    <section className="panel holo-crew" aria-labelledby="hcrew-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hcrew-title">{dept.name} crew</h2>
        <span className="mono panel-meta">{lead ? `${lead.short.toUpperCase()} LEADS` : 'NOBODY CAN LEAD'} · {crew.filter((s) => s.status === 'live').length} OF {crew.length} ABOARD</span>
      </div>
      <ul className="hcrew">
        {crew.map((s) => {
          const off = ship.off(s);
          const order = s.activeOrder ? ship.data.orders.orders.find((o) => o.id === s.activeOrder) : undefined;
          const note = off ? `off · ${off}` : lead?.id === s.id && !s.head ? 'acting lead' : s.head ? 'head' : RANK[s.rank].label.toLowerCase();
          return (
            <li key={s.id}>
              <button type="button" className={'hcrew-row ' + s.status + (off ? ' off' : '')} aria-pressed={picked === s.id}
                style={css({ '--c': railColor(s.rail), '--ls': STATUS[s.status].line })} onClick={() => onOpen(s.id)}>
                <span className="dot" />
                <span className="hcrew-name">{s.short}<Pips rank={s.rank} /></span>
                <span className="hcrew-state mono">{s.status.toUpperCase()}</span>
                <span className="hcrew-note mono">{note}</span>
                <span className="hcrew-order">{order ? `${order.id} · ${order.title}` : s.status === 'live' ? 'No order on.' : s.note}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------- the build queue ----------

export function QueuePanel({ ship, drafts, picked, onRoom, onDraft, onNew }: {
  ship: ShipView; drafts: Draft[]; picked?: string; onRoom: (id: string) => void; onDraft: (id: string) => void; onNew: () => void;
}) {
  const waiting = ship.data.stations.stations.filter((s) => s.kind === 'station' && s.status !== 'live')
    .sort((a, b) => a.status.localeCompare(b.status) || a.deck - b.deck);
  return (
    <section className="panel holo-queue" aria-labelledby="hq-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hq-title">Build queue</h2>
        <span className="mono panel-meta">{waiting.length} WAITING · {drafts.length} DRAFTS</span>
        <button type="button" className="foldall" onClick={onNew}>NEW SECTION</button>
      </div>
      <p className="help">Rooms on the plan whose crew isn't aboard yet, then your drafts. A hire waits for your approval.</p>
      <ul className="hqueue">
        {waiting.map((s) => (
          <li key={s.id}>
            <button type="button" className="hq-row" aria-pressed={picked === s.id} onClick={() => onRoom(s.id)}
              style={css({ '--c': railColor(s.rail), '--ls': STATUS[s.status].line })}>
              <span className="hq-tile" />
              <span className="hq-name">{s.short}</span>
              <span className="hq-deck mono">DECK {s.deck}</span>
              <span className="hq-state mono">{s.status.toUpperCase()}</span>
            </button>
          </li>
        ))}
        {drafts.map((d) => (
          <li key={d.id}>
            <button type="button" className="hq-row draft" aria-pressed={picked === d.id} onClick={() => onDraft(d.id)}
              style={css({ '--c': 'var(--holo)', '--ls': 'dashed' })}>
              <span className="hq-tile" />
              <span className="hq-name">{d.short}</span>
              <span className="hq-deck mono">DECK {d.deck}</span>
              <span className="hq-state mono">{d.id}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- every room on the ship ----------

export function RegisterPanel({ ship, filter, assets, picked, onOpen }: {
  ship: ShipView; filter: RailFilter; assets: Asset[]; picked?: string; onOpen: (id: string) => void;
}) {
  const rooms = ship.data.stations.stations.filter((s) => PLACES[s.id])
    .filter((s) => filter === 'all' || s.kind === 'place' || s.rail === filter)
    .sort((a, b) => a.deck - b.deck || PLACES[a.id].y - PLACES[b.id].y || PLACES[a.id].x - PLACES[b.id].x);
  const art = new Map(assets.filter((a) => a.station).map((a) => [a.station!, a]));
  return (
    <section className="panel log-table-panel holo-register" aria-labelledby="hreg-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hreg-title">The ship's rooms</h2>
        <span className="mono panel-meta">{rooms.length} ROOMS · WHERE EACH ONE IS DRAWN</span>
      </div>
      <div className="olog-scroll">
        <table className="olog">
          <thead><tr><th>DECK</th><th>ROOM</th><th>STATUS</th><th>RAIL</th><th>ON THE PLAN</th><th>ART</th><th>BOARD</th></tr></thead>
          <tbody>
            {rooms.map((s) => {
              const p = PLACES[s.id];
              const a = art.get(s.id);
              const board = BOARDS.find((b) => b.id === OWN_BOARD[s.id]);
              return (
                <tr key={s.id} className={picked === s.id ? 'picked' : undefined} onClick={() => onOpen(s.id)}>
                  <td className="mono">{s.deck}</td>
                  <td>
                    <button type="button" className="olog-id" aria-pressed={picked === s.id} onClick={(e) => { e.stopPropagation(); onOpen(s.id); }}>
                      <span className="dot" style={css({ '--c': stationColour(s) })} />{s.name}
                    </button>
                  </td>
                  <td className="mono">{s.kind === 'place' ? 'PLACE' : s.status.toUpperCase()}</td>
                  <td className="mono">{s.kind === 'place' ? '—' : RAIL[s.rail].legend.toUpperCase()}</td>
                  <td className="mono">{p.x}, {p.y} · {p.w}</td>
                  <td className="mono">{a ? `${a.kb} KB` : '—'}</td>
                  <td className="mono">{board ? board.label.toUpperCase() : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------- the deck's orders ----------

export function DeckOrders({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (station: string) => void }) {
  const crew = new Set(ship.data.stations.stations.filter((s) => s.dept === 'holo').map((s) => s.id));
  const rows = ship.data.orders.orders.filter((o) => crew.has(o.station)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const sameDay = (iso: string) => dayAndTime(iso).split(' ')[0] === dayAndTime(ship.data.orders.asOf).split(' ')[0];
  return (
    <section className="panel holo-orders" aria-labelledby="hord-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hord-title">On the deck</h2>
        <span className="mono panel-meta">ORDERS FOR THE HOLODECK CREW · {rows.length}</span>
      </div>
      {rows.length === 0 && <p className="help">No orders for the Holodeck crew.</p>}
      <ul className="hq-orders">
        {rows.map((o) => {
          const st = ship.station(o.station);
          const state = o.state === 'awaiting-captain' ? 'WAITS FOR YOU' : o.state.toUpperCase();
          return (
            <li key={o.id}>
              <button type="button" className="hq-order" aria-pressed={picked === o.station} onClick={() => onOpen(o.station)}
                style={css({ '--c': `var(--tier-${o.tier})` })}>
                <span className="idtag">{o.id} · {sameDay(o.updatedAt) ? clockTime(o.updatedAt) : dayAndTime(o.updatedAt).toUpperCase()}</span>
                <span className="hq-order-title">{o.title}</span>
                <span className="hq-order-meta mono"><span className="dot" style={css({ '--c': railColor(st?.rail ?? 'mixed') })} />{st?.short} · TIER {o.tier} · {state}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

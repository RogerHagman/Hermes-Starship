// The panels around the computer core: the records board laid on the table (a count per order
// state), who the orders went to, the Computer and its records crew, the order log, and the minutes.
import { clockTime, dayAndTime, dayLine } from '../../lib/format';
import { RANK, STATUS, railColor } from '../../lib/lookups';
import { ROOM, STATES, STATE_WORD, TABLE, counts, minutes, pct, records, type Query } from '../../lib/computer';
import type { ShipView } from '../../lib/ship';
import type { Station } from '../../types';
import { Pips } from '../Roster';
import { Src } from '../Src';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const up = (s: string) => s.toUpperCase();
const ORD = /\bORD-\d{4}\b/;

/** The records board on the table: a column per order state with its count. Each one filters the terminal. */
export function RecordsBoard({ ship, query, onQuery }: { ship: ShipView; query: Query; onQuery: (q: Query) => void }) {
  const all = records(ship.data);
  const n = counts(all);
  const most = Math.max(1, ...STATES.map((s) => n[s]));
  return (
    <div className="records-board" style={{ left: pct(TABLE.x, ROOM.w), top: pct(TABLE.y, ROOM.h), width: pct(TABLE.w, ROOM.w), height: pct(TABLE.h, ROOM.h) }}>
      <ol className="rb-cols">
        {STATES.map((s) => (
          <li key={s}>
            <button type="button" className={`rb-col ts-${s}`} aria-pressed={query.state === s}
              aria-label={`${STATE_WORD[s]}, ${n[s]} orders`} onClick={() => onQuery({ ...query, state: query.state === s ? 'all' : s })}>
              <span className="rb-word mono">{STATE_WORD[s]}</span>
              <span className="rb-n">{n[s]}</span>
              <span className="rb-bar"><b style={{ width: `${(n[s] / most) * 100}%` }} /></span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Who the orders went to: every station with orders on file, the most first. Each one filters the terminal. */
export function StationsPanel({ ship, query, onQuery }: { ship: ShipView; query: Query; onQuery: (q: Query) => void }) {
  const all = records(ship.data);
  const by = new Map<string, { total: number; open: number }>();
  for (const o of all) {
    const c = by.get(o.station) ?? { total: 0, open: 0 };
    c.total += 1;
    if (o.state !== 'done') c.open += 1;
    by.set(o.station, c);
  }
  const rows = [...by.entries()].sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]));
  const most = Math.max(1, ...rows.map(([, c]) => c.total));
  return (
    <section className="panel core-stations" aria-labelledby="cst-title">
      <div className="panel-head">
        <h2 className="panel-title" id="cst-title">Orders by station</h2>
        <Src ids={['records']} />
        <span className="mono panel-meta">{all.length} ON FILE · {rows.length} STATIONS · PICK ONE TO FILTER</span>
      </div>
      <ul className="cst-list">
        {rows.map(([id, c]) => {
          const st = ship.station(id);
          return (
            <li key={id}>
              <button type="button" className="cst-row" aria-pressed={query.station === id} style={css({ '--rc': railColor(st?.rail ?? 'mixed') })}
                onClick={() => onQuery({ ...query, station: query.station === id ? null : id })}>
                <span className="dot" />
                <span className="cst-name">{st?.short ?? id}</span>
                <span className="cst-bar"><b style={{ width: `${(c.total / most) * 100}%` }} /></span>
                <span className="cst-n mono">{c.total}{c.open ? ` · ${c.open} OPEN` : ''}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The Computer and the Archivist: the stations that keep the ship's records. */
export const CORE_CREW = ['computer', 'archives'];

export function CoreCrewPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (id: string) => void }) {
  const crew = CORE_CREW.map((id) => ship.station(id)).filter((s): s is Station => !!s);
  return (
    <section className="panel holo-crew" aria-labelledby="ccrew-title">
      <div className="panel-head">
        <h2 className="panel-title" id="ccrew-title">Records keepers</h2>
        <span className="mono panel-meta">DECK 3 · {crew.filter((s) => s.status === 'live' && !ship.off(s)).length} OF {crew.length} AT THE POST</span>
      </div>
      <ul className="hcrew">
        {crew.map((s) => {
          const off = ship.off(s);
          const order = s.activeOrder ? ship.data.orders.orders.find((o) => o.id === s.activeOrder) : undefined;
          return (
            <li key={s.id}>
              <button type="button" className={'hcrew-row ' + s.status + (off ? ' off' : '')} aria-pressed={picked === s.id}
                style={css({ '--c': railColor(s.rail), '--ls': STATUS[s.status].line })} onClick={() => onOpen(s.id)}>
                <span className="dot" />
                <span className="hcrew-name">{s.short}<Pips rank={s.rank} /></span>
                <span className="hcrew-state mono">{up(RANK[s.rank].short)}</span>
                <span className="hcrew-note mono">{off ? `off · ${off}` : s.model}</span>
                <span className="hcrew-order">{order ? `${order.id} · ${order.title}` : s.duty}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The order log: orders opening, splitting, crossing customs and closing, newest first. An ORD opens its record. */
export function OrderLog({ ship, onOpen }: { ship: ShipView; onOpen: (id: string) => void }) {
  const known = new Set(records(ship.data).map((o) => o.id));
  const lines = ship.data.shiplog.entries.filter((e) => ['order', 'split', 'customs', 'review', 'done'].includes(e.kind))
    .sort((a, b) => b.at.localeCompare(a.at));
  const today = dayLine(ship.data.shiplog.asOf);
  return (
    <section className="panel array-log" aria-labelledby="corder-title">
      <div className="panel-head">
        <h2 className="panel-title" id="corder-title">Order log</h2>
        <Src ids={['orders']} />
        <span className="mono panel-meta">{lines.length} LINES · OPENED, SPLIT, CUSTOMS, CLOSED · NEWEST FIRST</span>
      </div>
      <ol className="alog">
        {lines.length === 0 && <li className="empty">No order lines yet.</li>}
        {lines.map((l) => {
          const id = ORD.exec(l.text)?.[0];
          return (
            <li key={l.at + l.text}>
              <time className="mono" dateTime={l.at}>{dayLine(l.at) === today ? clockTime(l.at) : up(dayAndTime(l.at))}</time>
              <span className="alog-tag mono">{up(l.kind)}</span>
              {id && known.has(id)
                ? <button type="button" className="alog-link linkish" onClick={() => onOpen(id)}>{l.text}</button>
                : <span>{l.text}</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** The newest briefing minutes, short. The minutes reader in the room shows them all. */
export function MinutesPanel({ ship, onOpen }: { ship: ShipView; onOpen: () => void }) {
  const list = minutes(ship.data);
  const name = (id: string) => ship.station(id)?.short ?? id;
  return (
    <section className="panel core-minutes" aria-labelledby="cmin-title">
      <div className="panel-head">
        <h2 className="panel-title" id="cmin-title">Minutes</h2>
        <Src ids={['orders']} />
        <span className="mono panel-meta">{list.length} BRIEFINGS · KEPT BY THE COMPUTER</span>
      </div>
      <ol className="cmin-list">
        {list.length === 0 && <li className="empty">No briefing minuted yet.</li>}
        {list.map((m) => (
          <li key={m.at + m.text}>
            <button type="button" className="cmin-row" onClick={onOpen}>
              <span className="cmin-topic">{m.text.replace(/^Briefing:\s*/, '')}</span>
              <span className="cmin-when mono">{dayLine(m.at)}{m.attendees ? ` · ${m.attendees.map(name).join(', ').toUpperCase()}` : ''}</span>
              {m.outcome && <span className="cmin-out">{m.outcome}</span>}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

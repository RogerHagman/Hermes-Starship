// Pieces the four Bridge posts share: the tiles on the desk, rows of orders, one order's record,
// the number tiles, the 7-day bars and the panel of a station's own orders. Reading only.
import type { ReactNode } from 'react';
import { dayAndTime, dayLine } from '../../lib/format';
import { speedText } from '../../lib/lookups';
import { STATE_WORD, SURFACE_WORD, logOf, records, span, took } from '../../lib/computer';
import { ROOM, TABLE, openedOf, pct } from '../../lib/post';
import type { ShipView } from '../../lib/ship';
import type { Order } from '../../types';
import { CardBody, Replies } from '../Panels';
import { ConHead } from '../ShipConsole';
import { StatePill } from '../computer/ComputerScreen';

export const up = (s: string) => s.toUpperCase();
export const when = (iso: string) => `${dayLine(iso)} · ${dayAndTime(iso).split(' ')[1]}`;
export const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

export interface Tile { id: string; name: string; n: number | string; sub?: string; colour: string; pressed?: boolean; onClick: () => void; label?: string }

/** Tiles laid on the desk top: a name, a big number and a small line. Each one opens or filters something. */
export function DeskTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="pdesk" style={{ left: pct(TABLE.x, ROOM.w), top: pct(TABLE.y, ROOM.h), width: pct(TABLE.w, ROOM.w), height: pct(TABLE.h, ROOM.h) }}>
      <ol className="pdesk-cols" style={css({ '--n': tiles.length })}>
        {tiles.map((t) => (
          <li key={t.id}>
            <button type="button" className="pdesk-tile" style={css({ '--pc': t.colour })} aria-pressed={!!t.pressed}
              aria-label={t.label ?? `${t.name}, ${t.n}`} onClick={t.onClick}>
              <span className="pdt-name">{t.name}</span>
              <span className="pdt-n">{t.n}</span>
              {t.sub && <span className="pdt-sub mono">{t.sub}</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** One order as a row: id, state, station, title, and when it came in. */
export function OrderRow({ ship, o, onOpen, extra }: { ship: ShipView; o: Order; onOpen: (id: string) => void; extra?: ReactNode }) {
  const st = ship.station(o.station);
  return (
    <li>
      <button type="button" className={`porder ts-${o.state}`} onClick={() => onOpen(o.id)}>
        <span className="po-id mono">{o.id}</span>
        <StatePill state={o.state} />
        <span className="po-title">{o.title}</span>
        {extra ?? <span className="po-st mono">{up(st?.short ?? o.station)}</span>}
        <span className="po-when mono">{up(dayAndTime(openedOf(o)))}</span>
      </button>
    </li>
  );
}

/** One order's full record: the facts, the brief, what came back and its log lines. */
export function OrderView({ ship, id, back, onBack, icon }: { ship: ShipView; id: string; back: string; onBack: () => void; icon?: string }) {
  const o = records(ship.data).find((x) => x.id === id);
  if (!o) return <ConHead icon={icon} title={id} sub="NO SUCH ORDER ON FILE" back={back} onBack={onBack} />;
  const st = ship.station(o.station);
  const lines = logOf(ship.data, o.id);
  return (
    <>
      <ConHead icon={icon} title={`${o.id} · ${o.title}`} back={back} onBack={onBack}
        sub={`${STATE_WORD[o.state]} · ${up(st?.name ?? o.station)} · UPDATED ${up(dayAndTime(o.updatedAt))}`} />
      <div className="con-body pbody">
        <dl className="pfacts mono">
          <div><dt>STATE</dt><dd><StatePill state={o.state} /></dd></div>
          <div><dt>STATION</dt><dd>{st?.name ?? o.station}</dd></div>
          <div><dt>SPEED</dt><dd>{speedText(o.speed, st)}</dd></div>
          {o.openedAt && <div><dt>OPENED</dt><dd>{when(o.openedAt)}{o.surface ? ` · ${up(SURFACE_WORD[o.surface] ?? o.surface)}` : ''}</dd></div>}
          {o.closedAt && <div><dt>CLOSED</dt><dd>{when(o.closedAt)}{took(o) !== null ? ` · TOOK ${span(took(o)!)}` : ''}</dd></div>}
          {o.cards !== undefined && <div><dt>CARDS</dt><dd>{o.cards === 0 ? 'NONE · ANSWERED IN CHAT' : o.cards}</dd></div>}
          {o.parent && <div><dt>PART OF</dt><dd>{o.parent}</dd></div>}
          {o.detail && <div className="wide"><dt>NOTE</dt><dd>{o.detail}</dd></div>}
        </dl>
        {o.body
          ? <div className="psec"><span className="cb-head mono">THE BRIEF</span><CardBody text={o.body} /></div>
          : <p className="pnote">No card body on file: Number One answered this one in chat, or the card had no words.</p>}
        {o.replies && o.replies.length > 0 ? <Replies ship={ship} replies={o.replies} /> : <p className="pnote">Nothing came back on this order yet.</p>}
        {lines.length > 0 && (
          <div className="psec">
            <span className="cb-head mono">SHIP'S LOG · {lines.length}</span>
            <ol className="plog">
              {lines.map((l) => <li key={l.at + l.text}><time className="mono" dateTime={l.at}>{up(dayAndTime(l.at))}</time><span>{l.text}</span></li>)}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}

/** A row of number tiles. */
export function Kpis({ items }: { items: { n: number | string; label: string; tone?: 'warn' | 'bad' | 'good' }[] }) {
  return (
    <ul className="pkpis" style={css({ '--n': items.length })}>
      {items.map((k) => (
        <li key={k.label} className={k.tone ? `tone-${k.tone}` : undefined}><span className="pk-n">{k.n}</span><span className="pk-l mono">{k.label}</span></li>
      ))}
    </ul>
  );
}

/** Thin bars, one per day: one hue, the number in text ink above the tallest and today's (the last day, unless named). */
export function DayBars({ days, label, today: todayKey }: { days: { key: string; label: string; n: number }[]; label: string; today?: string }) {
  const most = Math.max(1, ...days.map((d) => d.n));
  const peak = days.reduce((a, d) => (d.n > a.n ? d : a), days[0]);
  const today = days.find((d) => d.key === todayKey) ?? days[days.length - 1];
  return (
    <ol className="pdays" aria-label={label}>
      {days.map((d) => (
        <li key={d.key} title={`${d.label}: ${d.n}`} aria-label={`${d.label}, ${d.n}`}>
          <span className="pd-n mono">{d.n > 0 && (d === peak || d === today) ? d.n : ''}</span>
          <span className="pd-bar"><b style={{ height: `${(d.n / most) * 100}%` }} /></span>
          <span className={'pd-day mono' + (d === today ? ' today' : '')}>{d.label}</span>
        </li>
      ))}
    </ol>
  );
}

/** A station's own orders, newest first. */
export function OrdersPanel({ ship, ids, title, onOpen, max = 10 }: { ship: ShipView; ids: string[]; title: string; onOpen: (id: string) => void; max?: number }) {
  const list = records(ship.data).filter((o) => ids.includes(o.station));
  const open = list.filter((o) => o.state !== 'done').length;
  return (
    <section className="panel porders-panel" aria-label={title}>
      <div className="panel-head">
        <h2 className="panel-title">{title}</h2>
        <span className="mono panel-meta">{list.length} ON FILE · {open} OPEN · NEWEST FIRST</span>
      </div>
      <ol className="porders">
        {list.length === 0 && <li className="empty">No orders on file yet.</li>}
        {list.slice(0, max).map((o) => <OrderRow key={o.id} ship={ship} o={o} onOpen={onOpen} extra={<span />} />)}
      </ol>
    </section>
  );
}

/** The line under a view's title that says where its data came from. */
export function sourceWord(synthetic: boolean, asOf: string): string {
  return synthetic ? 'SAMPLE' : `LIVE · READ ${up(dayAndTime(asOf))}`;
}

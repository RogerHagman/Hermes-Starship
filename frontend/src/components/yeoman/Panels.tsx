// The panels around the Yeoman's post: the matrix laid on the desk (a count per box), the next 48
// hours and waiting for on the side, and the done log and the week below. Reading only.
import { dayAndTime, dayLine } from '../../lib/format';
import type { ShipView } from '../../lib/ship';
import {
  BOX, BOXES, HOW_WORD, ROOM, TABLE, URGENT_H, late, matrix, next48, nowOf, pct, until, week, type Box,
} from '../../lib/yeoman';
import { BoxPill, DoneRow, KindPill, sourceWord } from './YeomanScreen';
import { Src } from '../Src';

const up = (s: string) => s.toUpperCase();

/** The matrix on the desk: a tile per box with its count. Each one opens that box on the wall screen. */
export function MatrixBoard({ ship, on, onBox }: { ship: ShipView; on: Box | null; onBox: (b: Box) => void }) {
  const m = matrix(ship.data.yeoman, nowOf(ship.data));
  return (
    <div className="ymatrix-board" style={{ left: pct(TABLE.x, ROOM.w), top: pct(TABLE.y, ROOM.h), width: pct(TABLE.w, ROOM.w), height: pct(TABLE.h, ROOM.h) }}>
      <ol className="ymb-cols">
        {BOXES.map((b) => (
          <li key={b}>
            <button type="button" className={`ymb-box yb-${b}`} aria-pressed={on === b}
              aria-label={`${BOX[b].name}, ${m[b].length} todos`} onClick={() => onBox(b)}>
              <span className="ymb-name">{BOX[b].name}</span>
              <span className="ymb-n">{m[b].length}</span>
              <span className="ymb-rule mono">{BOX[b].rule}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** What falls due in the next 48 hours, soonest first. */
export function NextPanel({ ship, onOpen, onAll }: { ship: ShipView; onOpen: (id: string) => void; onAll: () => void }) {
  const now = nowOf(ship.data);
  const marks = next48(ship.data.yeoman, now);
  return (
    <section className="panel ynext" aria-labelledby="ynext-title">
      <div className="panel-head">
        <h2 className="panel-title" id="ynext-title">Next {URGENT_H} hours</h2>
        <Src ids={['yeoman']} />
        <span className="mono panel-meta">{marks.length} DUE · {sourceWord(ship)}</span>
      </div>
      <ol className="ynext-list">
        {marks.length === 0 && <li className="empty">Nothing falls due in the next {URGENT_H} hours.</li>}
        {marks.map((k) => (
          <li key={k.kind + k.id}>
            <button type="button" className="ynext-row" onClick={() => onOpen(k.id)}>
              <time className="mono" dateTime={k.at}>{up(dayAndTime(k.at))}</time>
              <span className="yn-text">{k.text}{k.snoozed ? ' · snoozed' : ''}</span>
              {k.box ? <BoxPill box={k.box} /> : <KindPill kind={k.kind} />}
              <span className="yn-until mono">{up(until(k.at, now))}</span>
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="linkish ymore" onClick={onAll}>The timeline ›</button>
    </section>
  );
}

/** Waiting for: what is owed to you, the late ones first. */
export function WaitingPanel({ ship, onOpen }: { ship: ShipView; onOpen: (id: string) => void }) {
  const now = nowOf(ship.data);
  const list = [...ship.data.yeoman.waiting].sort((a, b) => Number(late(b, now)) - Number(late(a, now)) || a.since.localeCompare(b.since));
  const n = list.filter((w) => late(w, now)).length;
  return (
    <section className="panel ywait" aria-labelledby="ywait-title">
      <div className="panel-head">
        <h2 className="panel-title" id="ywait-title">Waiting for</h2>
        <Src ids={['yeoman']} />
        <span className="mono panel-meta">{list.length} OPEN{n ? ` · ${n} LATE` : ''}</span>
      </div>
      <ul className="ywait-list">
        {list.length === 0 && <li className="empty">You're not waiting for anything.</li>}
        {list.map((w) => (
          <li key={w.id}>
            <button type="button" className={'ywait-row' + (late(w, now) ? ' late' : '')} onClick={() => onOpen(w.id)}>
              <span className="yw-what">{w.what}</span>
              <span className="yw-meta mono">{w.fromWhom ? `${up(w.fromWhom)} · ` : ''}SINCE {dayLine(w.since)}</span>
              {late(w, now) && <span className="ylate mono">LATE</span>}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The done log, newest first: written by code when something closes. */
export function DonePanel({ ship, onOpen, onAll }: { ship: ShipView; onOpen: (id: string) => void; onAll: () => void }) {
  const done = ship.data.yeoman.done;
  return (
    <section className="panel ydone-panel" aria-labelledby="ydone-title">
      <div className="panel-head">
        <h2 className="panel-title" id="ydone-title">Done log</h2>
        <Src ids={['yeoman']} />
        <span className="mono panel-meta">{done.length} CLOSED · WRITTEN BY CODE · NEWEST FIRST</span>
      </div>
      <ol className="ydone">
        {done.length === 0 && <li className="empty">Nothing has closed yet.</li>}
        {done.slice(0, 12).map((d) => <DoneRow key={d.id} d={d} onOpen={onOpen} />)}
      </ol>
      {done.length > 12 && <button type="button" className="linkish ymore" onClick={onAll}>All {done.length} ›</button>}
    </section>
  );
}

const HOWS = ['ticked', 'fired', 'arrived', 'cancelled'];

/** The last 7 days: added, closed, and how they closed. One hue, thin bars, numbers in text ink. */
export function WeekPanel({ ship }: { ship: ShipView }) {
  const w = week(ship.data.yeoman);
  const most = Math.max(1, ...w.days.map((d) => d.n));
  const today = w.days[w.days.length - 1];
  const hows = [...HOWS, ...Object.keys(w.how).filter((h) => !HOWS.includes(h))];
  return (
    <section className="panel yweek" aria-labelledby="yweek-title">
      <div className="panel-head">
        <h2 className="panel-title" id="yweek-title">This week</h2>
        <Src ids={['yeoman']} />
        <span className="mono panel-meta">LAST 7 DAYS TO {dayLine(ship.data.yeoman.asOf)}</span>
      </div>
      <div className="yweek-body">
        <ul className="ykpis">
          <li><span className="yk-n">{w.added}</span><span className="yk-l mono">TODOS ADDED</span></li>
          <li><span className="yk-n">{w.closed}</span><span className="yk-l mono">CLOSED</span></li>
          {hows.map((h) => (
            <li key={h} className="small"><span className="yk-n">{w.how[h] ?? 0}</span><span className="yk-l mono">{HOW_WORD[h] ?? up(h)}</span></li>
          ))}
        </ul>
        <ol className="ydays" aria-label="Closed per day">
          {w.days.map((d) => (
            <li key={d.key} title={`${d.label}: ${d.n} closed`} aria-label={`${d.label}, ${d.n} closed`}>
              <span className="yd-n mono">{d.n > 0 ? d.n : ''}</span>
              <span className="yd-bar"><b style={{ height: `${(d.n / most) * 100}%` }} /></span>
              <span className={'yd-day mono' + (d === today ? ' today' : '')}>{d.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

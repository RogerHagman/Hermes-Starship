// The panels around the Sensor array: the watches (soonest scan first), the asks as they came
// in, every finding with its sources, and the array's log.
import { railColor } from '../../lib/lookups';
import { clockTime, dayAndTime } from '../../lib/format';
import { progress, untilLabel } from '../../lib/sensors';
import type { ShipView } from '../../lib/ship';
import type { RailFilter } from '../SideRail';
import { byNextScan } from './SensorScreen';
import { Marked } from '../Marked';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const up = (s: string) => s.toUpperCase();

export function WatchesPanel({ ship, filter, now, picked, onOpen }: {
  ship: ShipView; filter: RailFilter; now: number; picked?: string; onOpen: (id: string) => void;
}) {
  const ws = byNextScan(ship.data.sensors.watches);
  return (
    <section className="panel watch-panel" aria-labelledby="watch-title">
      <div className="panel-head">
        <h2 className="panel-title" id="watch-title">Watches</h2>
        <span className="mono panel-meta">{ws.length} · SOONEST SCAN FIRST · TRACKED, NEVER CAPPED</span>
      </div>
      <ul className="wlist">
        {ws.map((w) => {
          const to = ship.station(w.forStation);
          const unread = ship.data.sensors.findings.filter((f) => f.watch === w.id && !f.seen).length;
          const p = w.state === 'paused' ? 0 : progress(w, now);
          return (
            <li key={w.id} hidden={filter !== 'all' && to?.rail !== filter}>
              <button type="button" className={'wrow ' + w.state} aria-pressed={picked === w.id} onClick={() => onOpen(w.id)}
                style={css({ '--c': railColor(to?.rail ?? 'mixed') })}>
                <span className="dot" />
                <span className="wrow-name">{w.name}{unread > 0 && <b className="wrow-new mono">{unread} NEW</b>}</span>
                <span className="wrow-meta mono">{up(w.sector)} · {up(w.cadence)} · FOR {up(to?.short ?? w.forStation)}</span>
                <span className="wrow-next mono">{w.state === 'paused' ? 'PAUSED' : untilLabel(w.nextScan, now)}</span>
                <span className="wrow-bar" aria-hidden="true"><b style={{ width: `${Math.round(p * 100)}%` }} /></span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AsksPanel({ ship, onOpen }: { ship: ShipView; onOpen: () => void }) {
  const asks = ship.data.sensors.asks;
  const changed = asks.filter((a) => !a.unchanged).length;
  return (
    <section className="panel asks-panel" aria-labelledby="asks-title">
      <div className="panel-head">
        <h2 className="panel-title" id="asks-title">Asks</h2>
        <span className="mono panel-meta">{changed ? `${changed} NOT WORD FOR WORD` : 'ALL WORD FOR WORD'}</span>
        <button type="button" className="foldall" onClick={onOpen}>OPEN</button>
      </div>
      <ul className="asks mini">
        {asks.slice(0, 3).map((a) => (
          <li key={a.id} className={'ask' + (a.unchanged ? '' : ' changed')}>
            <span className="idtag">{a.id} · {up(dayAndTime(a.at))} · {up(a.state)}</span>
            <q className="ask-words">{a.words}</q>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FindingsPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (id: string) => void }) {
  const s = ship.data.sensors;
  const rows = [...s.findings].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <section className="panel log-table-panel" aria-labelledby="find-title">
      <div className="panel-head">
        <h2 className="panel-title" id="find-title">Findings</h2>
        <span className="mono panel-meta"><Marked>{rows.length} · {rows.filter((f) => !f.seen).length} NEW · EVERY ONE CITED · SAMPLE</Marked></span>
      </div>
      <div className="olog-scroll">
        <table className="olog">
          <thead><tr><th>ID</th><th>WHEN</th><th>WATCH</th><th>WHAT</th><th>TO</th><th>SOURCES</th><th>STATE</th></tr></thead>
          <tbody>
            {rows.map((f) => {
              const w = s.watches.find((x) => x.id === f.watch);
              const to = w && ship.station(w.forStation);
              return (
                <tr key={f.id} className={picked === f.id ? 'picked' : undefined} onClick={() => onOpen(f.id)}>
                  <td className="mono"><button type="button" className="olog-id" aria-pressed={picked === f.id} onClick={(e) => { e.stopPropagation(); onOpen(f.id); }}>{f.id}</button></td>
                  <td className="mono">{dayAndTime(f.at)}</td>
                  <td>{w?.name ?? f.watch}</td>
                  <td className="olog-what">{f.title}</td>
                  <td><span className="dot" style={css({ '--c': railColor(to?.rail ?? 'mixed') })} />{to?.short ?? '—'}</td>
                  <td className="mono">{f.sources.length}</td>
                  <td><span className={'statepill' + (f.seen ? ' done' : '')}>{f.seen ? 'READ' : 'NEW'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** The array's log: its scans, what it held, and the Sensors station's own lines from the ship's log. */
export function ArrayLog({ ship }: { ship: ShipView }) {
  const s = ship.data.sensors;
  const lines = [
    ...s.findings.map((f) => ({ at: f.at, tag: 'FOUND', text: `${s.watches.find((w) => w.id === f.watch)?.name}: ${f.title}` })),
    ...s.quarantine.map((q) => ({ at: q.at, tag: 'HELD', text: `${q.site}: ${q.what.split('.')[0]}.` })),
    ...ship.data.shiplog.entries.filter((e) => e.station === 'sensors').map((e) => ({ at: e.at, tag: e.kind === 'duty' ? 'DUTY' : 'LOG', text: e.text })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  const today = dayAndTime(s.asOf).split(' ')[0];
  return (
    <section className="panel array-log" aria-labelledby="alog-title">
      <div className="panel-head">
        <h2 className="panel-title" id="alog-title">Array log</h2>
        <span className="mono panel-meta">SCANS, HOLDS AND DUTY · NEWEST FIRST</span>
      </div>
      <ol className="alog">
        {lines.map((l) => (
          <li key={l.at + l.tag + l.text} className={l.tag === 'HELD' ? 'alog-held' : l.tag === 'DUTY' ? 'alog-duty' : undefined}>
            <time className="mono" dateTime={l.at}>{dayAndTime(l.at).split(' ')[0] === today ? clockTime(l.at) : dayAndTime(l.at)}</time>
            <span className="alog-tag mono">{l.tag}</span>
            <span>{l.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

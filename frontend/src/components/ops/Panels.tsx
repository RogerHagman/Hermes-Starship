// The panels around Ops: the status board laid on the table (a chip per check), the live rail
// gauges on the usage desk, what needs a look, the Operations crew, the schedule, and the ops log.
import { clockTime, dayAndTime } from '../../lib/format';
import { DESK, HEALTH_WORD, OPS_CREW, ROOM, TABLE, ago, attention, jobState, pct, until, type Area, type OpsView } from '../../lib/ops';
import { RANK, STATUS, railColor } from '../../lib/lookups';
import type { ShipView } from '../../lib/ship';
import type { Station } from '../../types';
import { Pips } from '../Roster';
import { HealthPill } from './OpsScreen';
import { Marked } from '../Marked';
import { Src } from '../Src';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const up = (s: string) => s.toUpperCase();

/** The status board on the table: a column per area, a chip per check, coloured by its state. */
export function StatusBoard({ list, on, onOpen }: { list: Area[]; on?: string; onOpen: (v: OpsView) => void }) {
  return (
    <div className="status-board" style={{ left: pct(TABLE.x, ROOM.w), top: pct(TABLE.y, ROOM.h), width: pct(TABLE.w, ROOM.w), height: pct(TABLE.h, ROOM.h) }}>
      <ol className="sb-cols">
        {list.map((a) => (
          <li key={a.id} className={'sb-col sb-' + a.id}>
            <button type="button" className="sb-area mono" aria-pressed={on === a.id} onClick={() => onOpen(a.id)}>{a.label}</button>
            <span className="sb-chips">
              {a.checks.map((c) => (
                <button key={c.id} type="button" className={`sb-chip h-${c.state}`} title={`${c.label}: ${c.text}`}
                  aria-label={`${c.label}, ${HEALTH_WORD[c.state]}`} onClick={() => onOpen(a.id)} />
              ))}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The live rail gauges on the usage desk: each rail and its meters, from the rails file. */
export function UsageDesk({ ship, onOpen }: { ship: ShipView; onOpen: () => void }) {
  return (
    <button type="button" className="usage-desk" onClick={onOpen} aria-label="The rails and their usage"
      style={{ left: pct(DESK.x, ROOM.w), top: pct(DESK.y, ROOM.h), width: pct(DESK.w, ROOM.w), height: pct(DESK.h, ROOM.h) }}>
      {ship.data.rails.rails.map((r) => {
        const state = ship.rail(r.id);
        return (
          <span key={r.id} className={'ud-rail ' + state} style={css({ '--c': railColor(r.id) })}>
            <span className="ud-name mono">{up(r.label)} · {up(state)}</span>
            {r.meters.map((m) => (
              <span key={m.id} className="ud-meter" title={`${r.label} ${m.label}: ${m.percent}%`}>
                <span className="ud-bar"><b style={{ width: `${Math.min(100, m.percent)}%` }} /></span>
                <span className="ud-val mono">{m.percent}</span>
              </span>
            ))}
          </span>
        );
      })}
    </button>
  );
}

/** What needs a look, the worst first. Each line opens its area on the wall screen. */
export function LookPanel({ list, onOpen }: { list: Area[]; onOpen: (v: OpsView) => void }) {
  const rows = attention(list);
  return (
    <section className="panel look-panel" aria-labelledby="look-title">
      <div className="panel-head">
        <h2 className="panel-title" id="look-title">Needs a look</h2>
        <Src ids={['nas', 'ops']} />
        <span className="mono panel-meta">{rows.length ? `${rows.length} OF ${list.reduce((n, a) => n + a.checks.length, 0)} CHECKS · WORST FIRST` : 'ALL CHECKS OK'}</span>
      </div>
      <ul className="look-list">
        {rows.length === 0 && <li className="empty">Every check is OK.</li>}
        {rows.map((c) => (
          <li key={c.area.id + c.id}>
            <button type="button" className={`look-row s-${c.state}`} onClick={() => onOpen(c.area.id)}>
              <HealthPill state={c.state} />
              <span className="look-name">{c.label}</span>
              <span className="look-area mono">{c.area.label}</span>
              <span className="look-text">{c.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The Operations department: who is at their post and what they are on. */
export function OpsCrewPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (id: string) => void }) {
  const crew = OPS_CREW.map((id) => ship.station(id)).filter((s): s is Station => !!s);
  const live = crew.filter((s) => s.status === 'live');
  return (
    <section className="panel holo-crew" aria-labelledby="ocrew-title">
      <div className="panel-head">
        <h2 className="panel-title" id="ocrew-title">Operations</h2>
        <span className="mono panel-meta">{live.filter((s) => !ship.off(s)).length} OF {live.length} AT THE POST · {crew.length - live.length} NOT CREATED YET</span>
      </div>
      <ul className="hcrew">
        {crew.map((s) => {
          const off = ship.off(s);
          const order = s.activeOrder ? ship.data.orders.orders.find((o) => o.id === s.activeOrder) : undefined;
          const note = s.status !== 'live' ? s.status : off ? `off · ${off}` : s.head ? 'head' : `deck ${s.deck}`;
          return (
            <li key={s.id}>
              <button type="button" className={'hcrew-row ' + s.status + (off ? ' off' : '')} aria-pressed={picked === s.id}
                style={css({ '--c': railColor(s.rail), '--ls': STATUS[s.status].line })} onClick={() => onOpen(s.id)}>
                <span className="dot" />
                <span className="hcrew-name">{s.short}<Pips rank={s.rank} /></span>
                <span className="hcrew-state mono">{up(RANK[s.rank].short)}</span>
                <span className="hcrew-note mono">{note}</span>
                <span className="hcrew-order">{order ? `${order.id} · ${order.title}` : s.status === 'live' ? 'No order on.' : s.duty}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Every scheduled job: when it runs, who owns it, how its last run went, when it runs next. */
export function ScheduleTable({ ship, onOpen }: { ship: ShipView; onOpen: () => void }) {
  const o = ship.data.ops;
  return (
    <section className="panel log-table-panel" aria-labelledby="sched-title">
      <div className="panel-head">
        <h2 className="panel-title" id="sched-title">Schedule</h2>
        <Src ids={['ops']} />
        <span className="mono panel-meta"><Marked>{o.jobs.length} JOBS · SHIP'S TIME{o.synthetic ? ' · SAMPLE' : ''}</Marked></span>
      </div>
      <div className="olog-scroll">
        <table className="olog">
          <thead><tr><th>ID</th><th>JOB</th><th>RUNS</th><th>OWNER</th><th>LAST</th><th>NEXT</th></tr></thead>
          <tbody>
            {o.jobs.map((j) => {
              const who = ship.station(j.owner);
              return (
                <tr key={j.id} onClick={onOpen}>
                  <td className="mono"><button type="button" className="olog-id" onClick={(ev) => { ev.stopPropagation(); onOpen(); }}>{j.id}</button></td>
                  <td className="olog-what">{j.name}</td>
                  <td>{j.every}</td>
                  <td>{who ? <><span className="dot" style={css({ '--c': railColor(who.rail) })} />{who.short}</> : j.owner}</td>
                  <td><HealthPill state={jobState(j)} text={up(j.last)} /> <span className="mono">{j.lastAt ? ago(o.asOf, j.lastAt) : ''}</span></td>
                  <td className="mono">{j.nextAt ? `in ${until(o.asOf, j.nextAt)}` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** The ops log: job runs, backups, and the Operations crew's own lines from the ship's log. */
export function OpsLog({ ship }: { ship: ShipView }) {
  const o = ship.data.ops;
  const lines = [
    ...o.jobs.filter((j) => j.lastAt).map((j) => ({ at: j.lastAt!, tag: up(j.last), bad: j.last === 'failed', text: `${j.id} ${j.name}${j.note && j.last !== 'ok' ? `: ${j.note}` : ''}` })),
    ...o.backups.map((b) => ({ at: b.lastAt, tag: 'BACKUP', bad: b.verified === 'failed', text: `${b.id} ${b.what} to ${b.to}` })),
    ...ship.data.shiplog.entries.filter((x) => OPS_CREW.includes(x.station))
      .map((x) => ({ at: x.at, tag: x.kind === 'duty' ? 'DUTY' : 'LOG', bad: false, text: `${ship.station(x.station)?.short}: ${x.text}` })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  const today = dayAndTime(o.asOf).split(' ')[0];
  return (
    <section className="panel array-log" aria-labelledby="olog-title">
      <div className="panel-head">
        <h2 className="panel-title" id="olog-title">Ops log</h2>
        <Src ids={['ops']} />
        <span className="mono panel-meta">JOBS, BACKUPS AND DUTY · NEWEST FIRST</span>
      </div>
      <ol className="alog">
        {lines.map((l) => (
          <li key={l.at + l.tag + l.text} className={l.bad ? 'alog-held' : l.tag === 'DUTY' ? 'alog-duty' : undefined}>
            <time className="mono" dateTime={l.at}>{dayAndTime(l.at).split(' ')[0] === today ? clockTime(l.at) : dayAndTime(l.at)}</time>
            <span className="alog-tag mono">{l.tag}</span>
            <span>{l.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

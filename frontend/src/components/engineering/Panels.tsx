// The panels around Main Engineering: the patch line laid on the master systems table, the
// patches in flight, the Engineering crew and who has Engineering, every patch, and the
// engineering log.
import { clockTime, dayAndTime } from '../../lib/format';
import { ENGINEERS, LINE, ROOM, STAGES, byStage, inFlight, pct, stageIndex, stageOf } from '../../lib/engineering';
import { RANK, STATUS, railColor } from '../../lib/lookups';
import type { ShipView } from '../../lib/ship';
import type { Station } from '../../types';
import { Pips } from '../Roster';
import { PatchChip, inCharge } from './EngScreen';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const up = (s: string) => s.toUpperCase();

/** The patch line on the table top: a column per stage, a chip per patch. */
export function PatchLine({ ship, picked, onOpen, onLine }: { ship: ShipView; picked?: string; onOpen: (id: string) => void; onLine: () => void }) {
  const ps = byStage(ship.data.engineering.patches);
  const flying = inFlight(ps).length;
  return (
    <div className="patch-line" style={{ left: pct(LINE.x, ROOM.w), top: pct(LINE.y, ROOM.h), width: pct(LINE.w, ROOM.w), height: pct(LINE.h, ROOM.h) }}>
      <button type="button" className="pl-title mono" onClick={onLine}>PATCH LINE · {flying} IN FLIGHT</button>
      <ol className="pl-cols">
        {STAGES.map((s) => (
          <li key={s.id} className={'pl-col pl-' + s.id}>
            <span className="pl-stage mono">{s.label}</span>
            <span className="pl-chips">
              {ps.filter((p) => p.stage === s.id).map((p) => <PatchChip key={p.id} p={p} picked={picked === p.id} onOpen={() => onOpen(p.id)} />)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function InFlightPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (id: string) => void }) {
  const ps = inFlight(ship.data.engineering.patches);
  return (
    <section className="panel flight-panel" aria-labelledby="flight-title">
      <div className="panel-head">
        <h2 className="panel-title" id="flight-title">In flight</h2>
        <span className="mono panel-meta">{ps.length} PATCHES · FURTHEST ALONG FIRST</span>
      </div>
      <ul className="flist">
        {ps.map((p) => {
          const s = stageOf(p.stage);
          const who = s.who === 'captain' ? undefined : ship.station(s.who);
          const at = stageIndex(p.stage);
          return (
            <li key={p.id}>
              <button type="button" className={'frow' + (p.failed ? ' failed' : '')} aria-pressed={picked === p.id} onClick={() => onOpen(p.id)}
                style={css({ '--c': who ? railColor(who.rail) : 'var(--captain)' })}>
                <span className="frow-name">{p.title}</span>
                <span className="frow-stage mono">{p.failed ? 'FAILED · ' : ''}{s.label}</span>
                <span className="frow-meta mono">{p.id} · {who ? `WITH ${up(who.short)}` : 'WITH YOU'}{p.checks ? ` · ${p.checks.passed}/${p.checks.total} CHECKS` : ''}</span>
                <span className="frow-steps" aria-hidden="true">
                  {STAGES.map((x, i) => <i key={x.id} className={i < at ? 'done' : i === at ? 'here' : ''} />)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function EngCrewPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (id: string) => void }) {
  const crew = ENGINEERS.map((id) => ship.station(id)).filter((s): s is Station => !!s);
  const lead = inCharge(ship);
  return (
    <section className="panel holo-crew" aria-labelledby="ecrew-title">
      <div className="panel-head">
        <h2 className="panel-title" id="ecrew-title">Engineering crew</h2>
        <span className="mono panel-meta">{lead ? `${up(lead.short)} HAS ENGINEERING` : 'NOBODY HAS ENGINEERING'} · {crew.filter((s) => !ship.off(s)).length} OF {crew.length} AT THE POST</span>
      </div>
      <ul className="hcrew">
        {crew.map((s) => {
          const off = ship.off(s);
          const order = s.activeOrder ? ship.data.orders.orders.find((o) => o.id === s.activeOrder) : undefined;
          const note = off ? `off · ${off}` : lead?.id === s.id && !s.head ? 'has engineering' : s.head ? 'head' : `deck ${s.deck}`;
          return (
            <li key={s.id}>
              <button type="button" className={'hcrew-row ' + s.status + (off ? ' off' : '')} aria-pressed={picked === s.id}
                style={css({ '--c': railColor(s.rail), '--ls': STATUS[s.status].line })} onClick={() => onOpen(s.id)}>
                <span className="dot" />
                <span className="hcrew-name">{s.short}<Pips rank={s.rank} /></span>
                <span className="hcrew-state mono">{up(RANK[s.rank].short)}</span>
                <span className="hcrew-note mono">{note}</span>
                <span className="hcrew-order">{order ? `${order.id} · ${order.title}` : 'No order on.'}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function PatchesTable({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (id: string) => void }) {
  const rows = byStage(ship.data.engineering.patches);
  return (
    <section className="panel log-table-panel" aria-labelledby="patches-title">
      <div className="panel-head">
        <h2 className="panel-title" id="patches-title">Patches</h2>
        <span className="mono panel-meta">{rows.length} · FURTHEST ALONG FIRST · SAMPLE</span>
      </div>
      <div className="olog-scroll">
        <table className="olog">
          <thead><tr><th>ID</th><th>UPDATED</th><th>PATCH</th><th>STAGE</th><th>WITH</th><th>CHECKS</th><th>ORDER</th></tr></thead>
          <tbody>
            {rows.map((p) => {
              const s = stageOf(p.stage);
              const who = s.who === 'captain' ? undefined : ship.station(s.who);
              return (
                <tr key={p.id} className={picked === p.id ? 'picked' : undefined} onClick={() => onOpen(p.id)}>
                  <td className="mono"><button type="button" className="olog-id" aria-pressed={picked === p.id} onClick={(ev) => { ev.stopPropagation(); onOpen(p.id); }}>{p.id}</button></td>
                  <td className="mono">{dayAndTime(p.updatedAt)}</td>
                  <td className="olog-what">{p.title}</td>
                  <td><span className={'statepill' + (p.stage === 'live' ? ' done' : p.failed ? ' bad' : '')}>{p.failed ? `${s.label} · FAILED` : s.label}</span></td>
                  <td>{p.stage === 'live' ? '—' : who ? <><span className="dot" style={css({ '--c': railColor(who.rail) })} />{who.short}</> : 'You'}</td>
                  <td className="mono">{p.checks ? `${p.checks.passed}/${p.checks.total}` : '—'}</td>
                  <td className="mono">{p.orders?.length ? `${p.orders[0]}${p.orders.length > 1 ? ` +${p.orders.length - 1}` : ''}` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** The engineering log: the patches' moves, the last check, and the engineers' own lines from the ship's log. */
export function EngLog({ ship }: { ship: ShipView }) {
  const e = ship.data.engineering;
  const lines = [
    ...e.patches.map((p) => ({ at: p.updatedAt, tag: p.failed ? 'FAILED' : stageOf(p.stage).label, text: `${p.id} ${p.title}` })),
    { at: e.check.at, tag: 'CHECK', text: `check.sh: ${e.check.present} of ${e.check.total} patches in place` },
    ...ship.data.shiplog.entries.filter((x) => ENGINEERS.includes(x.station))
      .map((x) => ({ at: x.at, tag: x.kind === 'duty' ? 'DUTY' : 'LOG', text: `${ship.station(x.station)?.short}: ${x.text}` })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  const today = dayAndTime(e.asOf).split(' ')[0];
  return (
    <section className="panel array-log" aria-labelledby="elog-title">
      <div className="panel-head">
        <h2 className="panel-title" id="elog-title">Engineering log</h2>
        <span className="mono panel-meta">PATCHES, CHECKS AND DUTY · NEWEST FIRST</span>
      </div>
      <ol className="alog">
        {lines.map((l) => (
          <li key={l.at + l.tag + l.text} className={l.tag === 'FAILED' ? 'alog-held' : l.tag === 'DUTY' ? 'alog-duty' : undefined}>
            <time className="mono" dateTime={l.at}>{dayAndTime(l.at).split(' ')[0] === today ? clockTime(l.at) : dayAndTime(l.at)}</time>
            <span className="alog-tag mono">{l.tag}</span>
            <span>{l.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

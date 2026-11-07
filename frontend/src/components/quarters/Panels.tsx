// The panels around the room in the Captain's Quarters: the duty roster with Relieve and
// Recall, the campaigns with their missions, and the order log.
import { useState } from 'react';
import { DEPTS, railColor, RANK, speedText, tierVar } from '../../lib/lookups';
import { clockTime, dayAndTime } from '../../lib/format';
import { canRelieve, type ShipView } from '../../lib/ship';
import type { Order } from '../../types';
import { Pips } from '../Roster';
import type { RailFilter } from '../SideRail';
import { Marked } from '../Marked';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

// ---------- duty roster ----------

export function DutyPanel({ ship, filter, picked, onOpen, onRelieve }: {
  ship: ShipView; filter: RailFilter; picked?: string; onOpen: (id: string) => void; onRelieve: (id: string) => void;
}) {
  // Everyone the Captain could relieve, by department, head first, then by rank.
  const crew = DEPTS.flatMap((d) => ship.data.stations.stations
    .filter((s) => s.dept === d.id && canRelieve(s))
    .sort((a, b) => Number(!!b.head) - Number(!!a.head) || RANK[a.rank].order - RANK[b.rank].order));
  const relieved = crew.filter((s) => ship.relieved.has(s.id)).length;

  const note = (id: string): { text: string; tone?: 'warn' | 'gold' } => {
    const s = ship.station(id)!;
    const dept = DEPTS.find((d) => d.id === s.dept)!;
    const off = ship.off(s);
    if (off === 'relieved') {
      if (!s.head || s.dept === 'command') return { text: 'relieved · orders wait', tone: 'warn' };
      const acting = ship.acting[s.dept!];
      return { text: acting === 'dark' ? 'relieved · nobody can act' : `relieved · ${ship.station(acting)?.short} acts`, tone: 'warn' };
    }
    if (off) return { text: `off · ${off}`, tone: 'warn' };
    if (ship.actingFor(id)) return { text: `acting head · ${dept.name}`, tone: 'gold' };
    if (s.head) return { text: `head · ${dept.name}` };
    return { text: dept.name };
  };

  return (
    <section className="panel duty-panel" aria-labelledby="duty-title">
      <div className="panel-head">
        <h2 className="panel-title" id="duty-title">Duty roster</h2>
        <span className="mono panel-meta">{relieved ? `${relieved} RELIEVED · ` : ''}SCREEN ONLY, LIKE A DRILL</span>
      </div>
      <p className="help">Relieve a station and the next officer by rank acts as head. Enlisted crew and the Computer never command.</p>
      <ul className="duty">
        {crew.map((s) => {
          const n = note(s.id);
          const isOff = !!ship.off(s);
          const isRelieved = ship.relieved.has(s.id);
          return (
            <li key={s.id} className={'duty-row' + (isOff ? ' off' : '')} hidden={filter !== 'all' && s.rail !== filter}
              style={css({ '--c': railColor(s.rail) })}>
              <button type="button" className="duty-name" aria-pressed={picked === s.id} onClick={() => onOpen(s.id)}
                title={`${s.name} · ${RANK[s.rank].label}`}>
                <span className="dot" />
                <span className="duty-short">{s.short}<Pips rank={s.rank} /></span>
                <span className={'duty-note mono' + (n.tone ? ` ${n.tone}` : '')}>{n.text}</span>
              </button>
              <button type="button" className="duty-btn" aria-pressed={isRelieved} onClick={() => onRelieve(s.id)}
                aria-label={`${isRelieved ? 'Recall' : 'Relieve'} ${s.name}`}>
                {isRelieved ? 'Recall' : 'Relieve'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------- campaigns and missions ----------

export interface Scope { campaign?: string; mission?: string }

const MISSION_STATE: Record<string, string> = {
  'awaiting-captain': 'WAITS FOR YOU', 'in-flight': 'IN FLIGHT', planning: 'PLANNING', closed: 'CLOSED',
};

export function CampaignsPanel({ ship, scope, onScope }: { ship: ShipView; scope: Scope; onScope: (s: Scope) => void }) {
  const q = ship.data.quarters;
  const missions = q.missions.filter((m) => !scope.campaign || m.campaign === scope.campaign);
  return (
    <section className="panel camp-panel" aria-labelledby="camp-title">
      <div className="panel-head">
        <h2 className="panel-title" id="camp-title">Campaigns</h2>
        <span className="mono panel-meta"><Marked>LONG-TERM GOALS · ONLY YOU OPEN OR CLOSE ONE · SAMPLE</Marked></span>
      </div>
      <div className="camps">
        {q.campaigns.map((c) => {
          const on = scope.campaign === c.id;
          return (
            <button key={c.id} type="button" className="camp" aria-pressed={on}
              onClick={() => onScope(on ? {} : { campaign: c.id })}>
              <span className="camp-top mono">{c.id} · BY {targetLabel(c.target)}</span>
              <span className="camp-name">{c.name}</span>
              <span className="camp-meter" role="meter" aria-valuenow={c.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.name}, ${c.percent}%`}>
                <b style={{ width: `${c.percent}%` }} />
              </span>
              <span className="camp-measure"><span>{c.measure}</span><span className="mono">{c.percent}%</span></span>
            </button>
          );
        })}
      </div>
      <ul className="missions" aria-label="Missions">
        {missions.map((m) => {
          const on = scope.mission === m.id;
          return (
            <li key={m.id}>
              <button type="button" className={'mission ' + m.status} aria-pressed={on}
                onClick={() => onScope(on ? { campaign: scope.campaign } : { campaign: scope.campaign, mission: m.id })}>
                <span className="idtag">{m.id}</span>
                <span className="mission-name">{m.name}<span className="mission-done">done when {m.doneWhen}</span></span>
                <span className="mission-crew">
                  {m.stations.map((id) => {
                    const st = ship.station(id);
                    return <span key={id} className="crewdot" title={st?.name} style={css({ '--c': railColor(st?.rail ?? 'mixed') })} />;
                  })}
                </span>
                <span className="mono mission-progress">{m.progress}</span>
                <span className={'mission-state mono ' + m.status}>{MISSION_STATE[m.status]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function targetLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 1))).toUpperCase();
}

// ---------- order log ----------

type LogFilter = 'all' | 'flight' | 'you' | 'done';
const FILTERS: { id: LogFilter; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'flight', label: 'In flight' }, { id: 'you', label: 'Waits for you' }, { id: 'done', label: 'Done' },
];

export function OrderLog({ ship, filter, scope, onScope, picked, onOpen }: {
  ship: ShipView; filter: RailFilter; scope: Scope; onScope: (s: Scope) => void; picked?: string; onOpen: (o: Order) => void;
}) {
  const [show, setShow] = useState<LogFilter>('all');
  const q = ship.data.quarters;
  const inCampaign = (o: Order) => !scope.campaign || q.missions.some((m) => m.id === o.mission && m.campaign === scope.campaign);
  const rows = [...ship.data.orders.orders]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .filter((o) => (!scope.mission || o.mission === scope.mission) && inCampaign(o))
    .filter((o) => filter === 'all' || ship.station(o.station)?.rail === filter)
    .filter((o) => show === 'all' || (show === 'done' ? o.state === 'done' : show === 'you' ? o.state === 'awaiting-captain' : o.state !== 'done' && o.state !== 'awaiting-captain'));
  const scopeLabel = scope.mission ?? scope.campaign;
  const sameDay = (iso: string) => dayAndTime(iso).split(' ')[0] === dayAndTime(ship.data.orders.asOf).split(' ')[0];

  return (
    <section className="panel log-table-panel" aria-labelledby="olog-title">
      <div className="panel-head">
        <h2 className="panel-title" id="olog-title">Order log</h2>
        <div className="olog-filters" role="group" aria-label="Show orders">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={show === f.id} onClick={() => setShow(f.id)}>{f.label}</button>
          ))}
        </div>
        <span className="mono panel-meta">{scopeLabel ? `${scopeLabel} ONLY` : 'EVERY ORDER'} · {rows.length} ROWS</span>
        {scopeLabel && <button type="button" className="foldall" onClick={() => onScope({})}>SHOW ALL</button>}
      </div>
      <div className="olog-scroll">
        <table className="olog">
          <thead>
            <tr><th>ID</th><th>MISSION</th><th>TIME</th><th>SPEED</th><th>TO</th><th>WHAT</th><th>TIER</th><th>STATE</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={8} className="empty">No orders for this filter.</td></tr>}
            {rows.map((o) => {
              const st = ship.station(o.station);
              const off = st ? ship.off(st) : null;
              const state = o.state === 'awaiting-captain' ? 'awaiting-captain' : off && o.state !== 'done' ? 'waiting' : o.state;
              return (
                <tr key={o.id} className={picked === o.id ? 'picked' : undefined} onClick={() => onOpen(o)}>
                  <td className="mono">
                    <button type="button" className="olog-id" aria-pressed={picked === o.id} onClick={(e) => { e.stopPropagation(); onOpen(o); }}>{o.id}</button>
                  </td>
                  <td className="mono">{o.mission ?? '—'}</td>
                  <td className="mono">{sameDay(o.updatedAt) ? clockTime(o.updatedAt) : dayAndTime(o.updatedAt)}</td>
                  <td className="mono">{speedText(o.speed, st).toUpperCase()}</td>
                  <td><span className="dot" style={css({ '--c': railColor(st?.rail ?? 'mixed') })} />{st?.short ?? o.station}</td>
                  <td className="olog-what">{o.title}</td>
                  <td><span className="tierpill" style={css({ '--c': tierVar(o.tier) })}>{o.tier ?? '—'}</span></td>
                  <td><span className={`statepill ${state}`}>{state === 'awaiting-captain' ? 'WAITS FOR YOU' : state === 'waiting' ? 'WAITS' : o.state.toUpperCase()}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

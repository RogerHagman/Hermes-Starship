// Duty roster by department (head first) and the ship's log.
import { DEPTS, RANK, STATUS, railColor } from '../lib/lookups';
import { clockTime } from '../lib/format';
import type { ShipView } from '../lib/ship';
import type { RailFilter } from './SideRail';

export function RosterPanel({ ship, filter, picked, onOpen }: { ship: ShipView; filter: RailFilter; picked?: string; onOpen: (id: string) => void }) {
  return (
    <section className="panel roster-panel" aria-labelledby="roster-title">
      <div className="panel-head">
        <h2 className="panel-title" id="roster-title">Duty roster</h2>
        <span className="mono panel-meta">HEAD FIRST · ACTING HEAD WHEN THE HEAD IS OFF DUTY</span>
      </div>
      <div className="roster">
        {DEPTS.map((d) => {
          const members = ship.data.stations.stations
            .filter((s) => s.dept === d.id)
            .sort((a, b) => Number(!!b.head) - Number(!!a.head) || RANK[a.rank].order - RANK[b.rank].order);
          const onDuty = members.filter((s) => s.status === 'live' && !ship.off(s)).length;
          const dark = ship.acting[d.id] === 'dark';
          return (
            <div key={d.id} className="dept" style={{ '--u': d.uniform } as React.CSSProperties}>
              <div className="dept-name">
                {d.name}
                <span className={'mono' + (dark ? ' dark' : '')}>{dark ? 'DARK · NO ONE TO ACT' : `${onDuty} OF ${members.length} ON DUTY`}</span>
              </div>
              <div className="members">
                {members.map((s) => {
                  const off = ship.off(s);
                  const cls = 'member' + (s.head ? ' head' : '') + (off ? ' off' : '') + (s.status === 'reserved' ? ' reserved' : '');
                  return (
                    <button key={s.id} type="button" className={cls} aria-pressed={picked === s.id} hidden={filter !== 'all' && s.rail !== filter}
                      style={{ '--c': railColor(s.rail), '--ls': STATUS[s.status].line } as React.CSSProperties}
                      title={`${s.name} · ${RANK[s.rank].label}${off ? ` · off duty: ${off}` : ''}`}
                      onClick={() => onOpen(s.id)}>
                      <span className="dot" />{s.short}
                      {ship.acting[d.id] === s.id && <span className="acting">ACTING</span>}
                      {s.head && off && <span className="acting" style={{ color: 'var(--text-muted)' }}>OFF</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function LogPanel({ ship }: { ship: ShipView }) {
  return (
    <section className="panel log-panel" aria-labelledby="log-title">
      <div className="panel-head"><h2 className="panel-title" id="log-title">Ship's log</h2></div>
      <ol className="log">
        {ship.data.shiplog.entries.map((e) => (
          <li key={e.at + e.text}>
            <time dateTime={e.at}>{clockTime(e.at)}</time>
            <span className="dot" style={{ '--c': railColor(ship.station(e.station)?.rail ?? 'mixed') } as React.CSSProperties} />
            <span>{e.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

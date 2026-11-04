// The side panels: rails, hails awaiting the Captain, orders in flight.
import { SPEEDS_NOTE, railColor } from '../lib/lookups';
import { age, clockTime, dayAndTime } from '../lib/format';
import type { Drills, ShipView } from '../lib/ship';
import type { Order } from '../types';
import type { RailFilter } from './SideRail';

export function RailsPanel({ ship, drills }: { ship: ShipView; drills: Drills }) {
  return (
    <section className="panel" aria-labelledby="rails-title">
      <div className="panel-head">
        <h2 className="panel-title" id="rails-title">Rails</h2>
        <span className="mono panel-meta">AS OF {clockTime(ship.data.rails.asOf)}</span>
      </div>
      <p className="help">Engine, nacelles and how much of each window is spent.</p>
      <div className="rails">
        {ship.data.rails.rails.map((r) => {
          const state = ship.rail(r.id);
          const drilled = !!drills[r.id];
          return (
            <div key={r.id} className={'rail' + (state === 'out' ? ' out' : '')} style={{ '--c': railColor(r.id) } as React.CSSProperties}>
              <div>
                <div className="rail-name">{r.label}<span className={`state ${state}`}>{drilled ? 'DRILL · OUT' : state.toUpperCase()}</span></div>
                <div className="rail-sub">{r.engine}</div>
                {r.burn?.active && r.burn.until && !drilled && (
                  <div style={{ marginTop: 6 }}>
                    <span className="state burn" title="Dilithium Burn: full windows overnight until the weekly reset">BURN TO {dayAndTime(r.burn.until).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="meters">
                {r.meters.map((m) => {
                  const value = drilled && m.id !== 'vram' ? 100 : m.percent;
                  return (
                    <div key={m.id}>
                      <div className="meter">
                        <span className="meter-label">{m.label.toUpperCase()}</span>
                        <div className={'bar' + (value >= 80 ? ' hot' : '')} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`${r.label} ${m.label}`}>
                          <b style={{ width: `${value}%` }} />
                        </div>
                        <span className="meter-val">{value}%</span>
                      </div>
                      {m.resetsAt && <div className="meter" aria-hidden="true"><span /><span className="meter-reset">resets {dayAndTime(m.resetsAt)}</span></div>}
                    </div>
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

export function HailsPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (station: string, order?: string) => void }) {
  const hails = ship.data.orders.orders.filter((o) => o.state === 'awaiting-captain').sort((a, b) => b.tier - a.tier);
  return (
    <section className="panel panel-captain" aria-labelledby="hails-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hails-title">Awaiting your orders</h2>
        <span className={'count' + (hails.length ? '' : ' zero')}>{hails.length}</span>
      </div>
      <p className="help">Approve and Deny arrive with the Captain's Quarters board (H4).</p>
      <div className="hails">
        {hails.length === 0 && <p className="empty">Nothing waits for you.</p>}
        {hails.map((o) => {
          const st = ship.station(o.station);
          return (
            <div key={o.id} className="hail" role="button" tabIndex={0} aria-pressed={picked === o.id}
              onClick={() => onOpen(o.station, o.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(o.station, o.id); } }}>
              <div className="hail-title">{o.title}</div>
              <div className="hail-meta">
                <span className="idtag">{o.id}</span>
                <span className="railpill" style={{ '--c': railColor(st?.rail ?? 'mixed') } as React.CSSProperties}>{(st?.short ?? o.station).toUpperCase()}</span>
                <span className="tierpill" style={{ '--c': `var(--tier-${o.tier})` } as React.CSSProperties}>TIER {o.tier}</span>
                <span className="idtag">{age(ship.data.orders.asOf, o.updatedAt)}</span>
              </div>
              <div className="hail-actions">
                <button type="button" className="btn btn-ghost" disabled title="Arrives in H4">Deny</button>
                <button type="button" className="btn btn-gold" disabled title="Arrives in H4">Approve</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function OrdersPanel({ ship, filter, picked, onOpen }: { ship: ShipView; filter: RailFilter; picked?: string; onOpen: (station: string, order?: string) => void }) {
  const open = ship.data.orders.orders.filter((o) => o.state !== 'done' && o.state !== 'awaiting-captain');
  // Parents first, each followed by its child cards.
  const parents = open.filter((o) => !o.parent || !open.some((p) => p.id === o.parent));
  const rows: Order[] = parents.flatMap((p) => [p, ...open.filter((c) => c.parent === p.id)])
    .filter((o) => filter === 'all' || ship.station(o.station)?.rail === filter);
  return (
    <section className="panel panel-grow" aria-labelledby="flight-title">
      <div className="panel-head">
        <h2 className="panel-title" id="flight-title">In flight</h2>
        <span className="mono panel-meta" title={SPEEDS_NOTE}>{open.length} ORDERS · SPEED WORDS SET THE REASONING LEVEL</span>
      </div>
      <ol className="orders">
        {rows.length === 0 && <li className="empty">No orders in flight on this rail.</li>}
        {rows.map((o) => {
          const st = ship.station(o.station);
          const off = st ? ship.off(st) : null;
          return (
            <li key={o.id}>
              <button type="button" aria-pressed={picked === o.id} className={'order' + (o.parent ? ' child' : '')} style={{ '--c': railColor(st?.rail ?? 'mixed') } as React.CSSProperties}
                onClick={() => onOpen(o.station, o.id)}>
                <span className="idtag">{o.id}</span>
                <span className="order-title">{o.title}</span>
                <span className={`statepill ${off ? 'waiting' : o.state}`}>{off ? `WAITS · ${off.toUpperCase()}` : o.state.toUpperCase()}</span>
                <span className="order-sub">{st?.short ?? o.station} · {o.speed ?? ''} · {age(ship.data.orders.asOf, o.updatedAt)}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

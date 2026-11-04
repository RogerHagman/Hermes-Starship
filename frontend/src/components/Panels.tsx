// The side panels: rails, hails awaiting the Captain, orders in flight.
import { useState } from 'react';
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
  // Cards opened with their arrow: an open card shows its full text and its sub-orders.
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set());
  const open = ship.data.orders.orders.filter((o) => o.state !== 'done' && o.state !== 'awaiting-captain');
  const kids = (id: string) => open.filter((c) => c.parent === id);
  // Parents first, each followed by its sub-orders while the parent is open.
  // A picked sub-order always shows, so the card you clicked elsewhere is never hidden.
  const parents = open.filter((o) => !o.parent || !open.some((p) => p.id === o.parent));
  const rows: Order[] = parents.flatMap((p) => [p, ...kids(p.id).filter((c) => opened.has(p.id) || c.id === picked)])
    .filter((o) => filter === 'all' || ship.station(o.station)?.rail === filter);
  const shown = new Set(rows.map((o) => o.id));
  const allOpen = rows.length > 0 && open.every((o) => opened.has(o.id));

  const toggle = (id: string) => setOpened((f) => {
    const next = new Set(f);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleAll = () => setOpened(allOpen ? new Set() : new Set(open.map((o) => o.id)));

  return (
    <section className="panel panel-grow" aria-labelledby="flight-title">
      <div className="panel-head">
        <h2 className="panel-title" id="flight-title">In flight</h2>
        <span className="mono panel-meta" title={SPEEDS_NOTE}>{open.length} ORDERS · SPEED WORDS SET THE REASONING LEVEL</span>
        <button type="button" className="foldall" aria-expanded={allOpen} onClick={toggleAll}>
          <Chevron />{allOpen ? 'COLLAPSE ALL' : 'EXPAND ALL'}
        </button>
      </div>
      <ol className="orders">
        {rows.length === 0 && <li className="empty">No orders in flight on this rail.</li>}
        {rows.map((o, i) => {
          const st = ship.station(o.station);
          const off = st ? ship.off(st) : null;
          const isChild = !!o.parent && shown.has(o.parent);
          const subs = isChild ? [] : kids(o.id);
          const isOpen = opened.has(o.id);
          // Keeps the tree line running down to the next sub-order of the same parent.
          const moreSibs = isChild && rows[i + 1]?.parent === o.parent;
          return (
            <li key={o.id} className={'order-row' + (isChild ? ' child' : '') + (moreSibs ? ' more-sibs' : '')}>
              <button type="button" aria-pressed={picked === o.id} className={'order' + (isOpen ? ' is-open' : '')} style={{ '--c': railColor(st?.rail ?? 'mixed') } as React.CSSProperties}
                onClick={() => onOpen(o.station, o.id)}>
                <span className="idtag">{o.id}</span>
                <span className="order-title">{o.title}</span>
                <span className={`statepill ${off ? 'waiting' : o.state}`}>{off ? `WAITS · ${off.toUpperCase()}` : o.state.toUpperCase()}</span>
                <span className="order-sub">
                  {st?.short ?? o.station} · {o.speed ?? ''} · {age(ship.data.orders.asOf, o.updatedAt)}
                  {subs.length > 0 && !isOpen && <b className="subcount"> · +{subs.length} SUB-ORDERS</b>}
                </span>
                {isOpen && (
                  <span className="order-more" id={`more-${o.id}`}>
                    {o.detail && <span className="order-detail">{o.detail}</span>}
                    <span className="order-facts mono">
                      {(st?.name ?? o.station).toUpperCase()} · TIER {o.tier}
                      {o.parent && ` · PART OF ${o.parent}`}
                      {subs.length > 0 && ` · ${subs.length} SUB-ORDERS BELOW`}
                    </span>
                  </span>
                )}
              </button>
              <button type="button" className="fold" aria-expanded={isOpen} aria-controls={isOpen ? `more-${o.id}` : undefined}
                onClick={() => toggle(o.id)} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${o.id}`}>
                <Chevron />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// The drop-down arrow: points down when the card is shut, up when it is open (turned by CSS).
function Chevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="chev"><path d="M6 9l6 6 6-6" /></svg>
  );
}

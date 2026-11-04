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
  // Two kinds of folding, kept apart:
  // - read: cards opened with their drop-down arrow, showing the full card body.
  // - folded: parent orders whose indented sub-orders are tucked away.
  const [read, setRead] = useState<ReadonlySet<string>>(new Set());
  const [folded, setFolded] = useState<ReadonlySet<string>>(new Set());
  const open = ship.data.orders.orders.filter((o) => o.state !== 'done' && o.state !== 'awaiting-captain');
  const kids = (id: string) => open.filter((c) => c.parent === id);
  // Parents first, each followed by its sub-orders (unless folded; a picked sub-order always shows).
  const parents = open.filter((o) => !o.parent || !open.some((p) => p.id === o.parent));
  const rows: Order[] = parents.flatMap((p) => [p, ...kids(p.id).filter((c) => !folded.has(p.id) || c.id === picked)])
    .filter((o) => filter === 'all' || ship.station(o.station)?.rail === filter);
  const shown = new Set(rows.map((o) => o.id));
  const allRead = rows.length > 0 && rows.every((o) => read.has(o.id));

  const flip = (set: typeof setRead, id: string) => set((f) => {
    const next = new Set(f);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <section className="panel panel-grow" aria-labelledby="flight-title">
      <div className="panel-head">
        <h2 className="panel-title" id="flight-title">In flight</h2>
        <span className="mono panel-meta" title={SPEEDS_NOTE}>{open.length} ORDERS · SPEED WORDS SET THE REASONING LEVEL</span>
        <button type="button" className="foldall" aria-expanded={allRead}
          onClick={() => setRead(allRead ? new Set() : new Set(rows.map((o) => o.id)))}>
          <Chevron />{allRead ? 'CLOSE ALL CARDS' : 'OPEN ALL CARDS'}
        </button>
      </div>
      <ol className="orders">
        {rows.length === 0 && <li className="empty">No orders in flight on this rail.</li>}
        {rows.map((o, i) => {
          const st = ship.station(o.station);
          const off = st ? ship.off(st) : null;
          const isChild = !!o.parent && shown.has(o.parent);
          const subs = isChild ? [] : kids(o.id);
          const isRead = read.has(o.id);
          const isFolded = folded.has(o.id);
          // Keeps the tree line running down to the next sub-order of the same parent.
          const moreSibs = isChild && rows[i + 1]?.parent === o.parent;
          return (
            <li key={o.id} style={{ '--c': railColor(st?.rail ?? 'mixed') } as React.CSSProperties}
              className={'ocard' + (isChild ? ' child' : '') + (moreSibs ? ' more-sibs' : '') + (isRead ? ' is-read' : '') + (picked === o.id ? ' picked' : '')}>
              {/* Clicking the card shows its station in the console; the title is the keyboard target. */}
              <div className="ocard-head" onClick={() => onOpen(o.station, o.id)}>
                <span className="idtag">{o.id}</span>
                <button type="button" className="ocard-title" aria-pressed={picked === o.id}
                  onClick={(e) => { e.stopPropagation(); onOpen(o.station, o.id); }}>{o.title}</button>
                <span className={`statepill ${off ? 'waiting' : o.state}`}>{off ? `WAITS · ${off.toUpperCase()}` : o.state.toUpperCase()}</span>
                <button type="button" className="fold" aria-expanded={isRead} aria-controls={isRead ? `body-${o.id}` : undefined}
                  aria-label={`${isRead ? 'Close' : 'Read'} the card ${o.id}`} title={isRead ? 'Close the card' : 'Read the full card'}
                  onClick={(e) => { e.stopPropagation(); flip(setRead, o.id); }}>
                  <Chevron />
                </button>
                <span className="ocard-sub">
                  {st?.short ?? o.station} · {o.speed ?? ''} · {age(ship.data.orders.asOf, o.updatedAt)}
                  {subs.length > 0 && (
                    <button type="button" className="subfold" aria-expanded={!isFolded}
                      onClick={(e) => { e.stopPropagation(); flip(setFolded, o.id); }}>
                      <Chevron />{subs.length} SUB-ORDERS
                    </button>
                  )}
                </span>
              </div>
              {isRead && (
                <div className="ocard-body" id={`body-${o.id}`}>
                  {o.body ? <CardBody text={o.body} /> : o.detail && <p className="cb-text">{o.detail}</p>}
                  <p className="cb-facts mono">
                    {(st?.name ?? o.station).toUpperCase()} · TIER {o.tier}
                    {o.parent && ` · PART OF ${o.parent}`}
                    {subs.length > 0 && ` · ${subs.length} SUB-ORDERS`}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// The card body as filed. "GOAL:", "CONTEXT:", "CONSTRAINTS:", "DONE WHEN:" and "START WITH:"
// start a section, and lines that start with "- " are list items.
const HEADS = /^(GOAL|CONTEXT|CONSTRAINTS|DONE WHEN|START WITH):\s*(.*)$/;
function CardBody({ text }: { text: string }) {
  const sections: { head?: string; lines: string[] }[] = [];
  for (const line of text.split('\n')) {
    const m = HEADS.exec(line);
    if (m) sections.push({ head: m[1], lines: m[2] ? [m[2]] : [] });
    else if (line.trim()) {
      if (sections.length === 0) sections.push({ lines: [] });
      sections[sections.length - 1].lines.push(line.trim());
    }
  }
  return (
    <dl className="cb">
      {sections.map((sec, i) => {
        const items = sec.lines.filter((l) => l.startsWith('- '));
        const prose = sec.lines.filter((l) => !l.startsWith('- '));
        return (
          <div className="cb-sec" key={i}>
            <dt className="cb-head mono">{sec.head ?? 'NOTE'}</dt>
            <dd className="cb-text">
              {prose.map((l, j) => <p key={j}>{l}</p>)}
              {items.length > 0 && <ul>{items.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

// The drop-down arrow: points down when shut, up when open (turned by CSS).
function Chevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="chev"><path d="M6 9l6 6 6-6" /></svg>
  );
}

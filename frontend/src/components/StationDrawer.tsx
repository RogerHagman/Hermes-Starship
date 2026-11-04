// Detail drawer for one station, and the order it is on (or the one you clicked).
import { useEffect, useRef } from 'react';
import { DECKS, DEPTS, RAIL, RANK, STATUS, railColor } from '../lib/lookups';
import { age } from '../lib/format';
import type { ShipView } from '../lib/ship';

interface Props { ship: ShipView; stationId: string; orderId?: string; onClose: () => void }

export function StationDrawer({ ship, stationId, orderId, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); back?.focus(); };
  }, [onClose]);

  const st = ship.station(stationId);
  if (!st) return null;
  const off = ship.off(st);
  const acting = ship.actingFor(st.id);
  const dept = DEPTS.find((d) => d.id === st.dept);
  const oid = orderId ?? st.activeOrder;
  const o = oid ? ship.data.orders.orders.find((x) => x.id === oid) : undefined;
  const facts: [string, string | undefined][] = [
    ['DUTY', st.duty], ['NOTE', st.note], ['MODEL', st.model], ['PROFILE', st.profile], ['ANSWERS TO', st.answersTo],
    ['NEEDS', (st.needs ?? []).map((r) => RAIL[r].legend).join(' and ')],
  ];
  const colour = st.kind === 'place' ? 'var(--border-strong)' : railColor(st.rail);

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" style={{ '--c': colour } as React.CSSProperties}>
        <div className="drawer-bar" />
        <div className="drawer-body">
          <div className="drawer-head">
            <div>
              <p className="deck-label mono">DECK {st.deck} · {DECKS[st.deck - 1].toUpperCase()}{dept ? ` · ${dept.name.toUpperCase()}` : ''}</p>
              <h2 className="drawer-title" id="drawer-title">{st.name}</h2>
              {st.aliases.length > 0 && <p className="mono drawer-handle">ALIASES · {st.aliases.join(' · ').toUpperCase()}</p>}
            </div>
            <button type="button" className="btn btn-ghost" ref={closeRef} onClick={onClose}>Close</button>
          </div>
          <div className="drawer-pills">
            <span className="railpill" style={{ '--c': railColor(st.rail) } as React.CSSProperties}>{RAIL[st.rail].label}</span>
            <span className="railpill" style={{ '--c': 'var(--text-label)', borderStyle: STATUS[st.status].line } as React.CSSProperties}>{STATUS[st.status].label}</span>
            <span className="railpill" style={{ '--c': 'var(--text-label)' } as React.CSSProperties}>{RANK[st.rank].label.toUpperCase()}</span>
            {off && <span className="railpill" style={{ '--c': 'var(--bad)' } as React.CSSProperties}>OFF DUTY · {off.toUpperCase()}</span>}
            {acting && <span className="railpill" style={{ '--c': 'var(--captain)' } as React.CSSProperties}>ACTING HEAD</span>}
          </div>
          <dl className="facts">
            {facts.filter(([, v]) => v).map(([k, v]) => [<dt key={k + 't'}>{k}</dt>, <dd key={k + 'd'}>{v}</dd>])}
          </dl>
          {o && (
            <div className="drawer-order" style={{ '--c': `var(--tier-${o.tier})` } as React.CSSProperties}>
              <span className="idtag">
                {o.id} · {off ? `WAITS, ${off.toUpperCase()}` : o.state.toUpperCase()} · TIER {o.tier}
                {o.speed ? ` · ${o.speed.toUpperCase()}` : ''} · {age(ship.data.orders.asOf, o.updatedAt).toUpperCase()}
              </span>
              <h3>{o.title}</h3>
              {o.detail && <p>{o.detail}</p>}
              {o.state === 'awaiting-captain' && (
                <div className="drawer-actions">
                  <button type="button" className="btn btn-ghost" disabled>Deny</button>
                  <button type="button" className="btn btn-gold" disabled>Approve</button>
                  <p className="help">Read-only for now. Orders arrive with the Captain's Quarters board.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

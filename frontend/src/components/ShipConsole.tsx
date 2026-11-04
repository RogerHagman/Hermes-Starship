// The console under the saucer. It shows whatever you picked, in place on the ship:
// a room on the plan, a card on the right, a name in the roster. With nothing picked
// it shows the watch: who is working right now. Esc or Back returns to the watch.
import { useEffect } from 'react';
import { DECKS, DEPTS, RAIL, RANK, STATUS, railColor } from '../lib/lookups';
import { age } from '../lib/format';
import { SHIP_MAP } from '../lib/shipmap';
import type { ShipView } from '../lib/ship';
import { Icon } from './Icon';

interface Props {
  ship: ShipView;
  pick: { station: string; order?: string } | null;
  onPick: (station: string, order?: string) => void;
  onBack: () => void;
}

const css = (vars: Record<string, string>) => vars as React.CSSProperties;

export function ShipConsole({ ship, pick, onPick, onBack }: Props) {
  useEffect(() => {
    if (!pick) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [pick, onBack]);

  const st = pick ? ship.station(pick.station) : undefined;
  if (!st) return <Watch ship={ship} onPick={onPick} />;

  const off = ship.off(st);
  const acting = ship.actingFor(st.id);
  const dept = DEPTS.find((d) => d.id === st.dept);
  const oid = pick?.order ?? st.activeOrder;
  const o = oid ? ship.data.orders.orders.find((x) => x.id === oid) : undefined;
  const colour = st.kind === 'place' ? 'var(--border-strong)' : railColor(st.rail);
  const icons = SHIP_MAP.icons as Record<string, string>;

  return (
    <section className="console" role="region" aria-label={`${st.name} console`} style={css({ '--c': colour })}>
      <div className="con-head">
        <span className="con-icon"><Icon path={icons[st.id]} /></span>
        <span className="con-titles">
          <span className="con-title">{st.name}</span>
          <span className="con-sub mono">DECK {st.deck} · {DECKS[st.deck - 1].toUpperCase()}{dept ? ` · ${dept.name.toUpperCase()}` : ''}</span>
        </span>
        <button type="button" className="con-back" onClick={onBack} title="Back to the watch (Esc)">‹ Watch</button>
      </div>
      <div className="con-pills">
        <span className="railpill" style={css({ '--c': railColor(st.rail) })}>{RAIL[st.rail].label}</span>
        <span className="railpill" style={css({ '--c': 'var(--text-label)', borderStyle: STATUS[st.status].line })}>{STATUS[st.status].label}</span>
        <span className="railpill" style={css({ '--c': 'var(--text-label)' })}>{RANK[st.rank].label.toUpperCase()}</span>
        {off && <span className="railpill" style={css({ '--c': 'var(--bad)' })}>OFF · {off.toUpperCase()}</span>}
        {acting && <span className="railpill" style={css({ '--c': 'var(--captain)' })}>ACTING HEAD</span>}
      </div>
      <div className="con-body">
        {o && (
          <div className="con-order" style={css({ '--c': `var(--tier-${o.tier})` })}>
            <span className="idtag">
              {o.id} · {off ? `WAITS, ${off.toUpperCase()}` : o.state.toUpperCase()} · TIER {o.tier}
              {o.speed ? ` · ${o.speed.toUpperCase()}` : ''} · {age(ship.data.orders.asOf, o.updatedAt).toUpperCase()}
            </span>
            <span className="con-order-title">{o.title}</span>
            {o.detail && <span className="con-text">{o.detail}</span>}
            {o.state === 'awaiting-captain' && (
              <span className="con-actions">
                <button type="button" className="btn btn-ghost" disabled>Deny</button>
                <button type="button" className="btn btn-gold" disabled>Approve</button>
                <span className="con-hint">Orders arrive in H4.</span>
              </span>
            )}
          </div>
        )}
        <dl className="con-facts">
          <dt>DUTY</dt><dd>{st.duty}</dd>
          {st.note && <><dt>NOTE</dt><dd>{st.note}</dd></>}
          {st.model && <><dt>MODEL</dt><dd>{st.model}</dd></>}
          {st.aliases.length > 0 && <><dt>ALIASES</dt><dd>{st.aliases.join(', ')}</dd></>}
          {st.answersTo && <><dt>ANSWERS TO</dt><dd>{st.answersTo}</dd></>}
        </dl>
      </div>
    </section>
  );
}

/** Nothing picked: who is working right now, each row opens that station. */
function Watch({ ship, onPick }: { ship: ShipView; onPick: (station: string, order?: string) => void }) {
  const working = ship.data.stations.stations.filter((s) => s.activeOrder);
  const offDuty = ship.data.stations.stations.filter((s) => ship.off(s));
  return (
    <section className="console" role="region" aria-label="The watch" style={css({ '--c': 'var(--captain)' })}>
      <div className="con-head">
        <span className="con-icon"><Icon path={(SHIP_MAP.icons as Record<string, string>).captain} /></span>
        <span className="con-titles">
          <span className="con-title">The watch</span>
          <span className="con-sub mono">{working.length} AT WORK · {offDuty.length} OFF DUTY · PICK A ROOM OR A CARD</span>
        </span>
      </div>
      <div className="con-body">
        <ul className="con-rows">
          {working.map((s) => {
            const o = ship.data.orders.orders.find((x) => x.id === s.activeOrder);
            const off = ship.off(s);
            return (
              <li key={s.id}>
                <button type="button" className={'con-row' + (off ? ' off' : '')} style={css({ '--c': railColor(s.rail) })} onClick={() => onPick(s.id)}>
                  <span className="dot" />
                  <span className="con-row-name">{s.short}</span>
                  <span className="con-row-text">{o?.title}</span>
                  <span className="idtag">{off ? 'WAITS' : s.activeOrder}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

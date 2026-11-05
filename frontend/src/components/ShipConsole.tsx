// The console under the saucer. It shows whatever you picked, in place on the ship:
// a room on the plan, a card on the right, a name in the roster. With nothing picked
// it shows the watch: who is working right now. Esc or Back returns to the watch.
// StationDetail is shared with the wall screen in the Captain's Quarters.
import { useCallback, useEffect, type ReactNode } from 'react';
import { DECKS, DEPTS, RAIL, RANK, STATUS, railColor } from '../lib/lookups';
import { age } from '../lib/format';
import { SHIP_MAP } from '../lib/shipmap';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';
import { CaptainsChair } from './CaptainsChair';
import { Icon } from './Icon';
import { StationScene, hasArt } from './StationArt';

interface Props {
  ship: ShipView;
  /** `from` names the station a card was opened from, so Back returns there (the Captain's chair). */
  pick: { station: string; order?: string; from?: string } | null;
  onPick: (station: string, order?: string, from?: string) => void;
  onBack: () => void;
  /** Opens the Captain's Quarters (from the Captain's chair). */
  onQuarters?: () => void;
}

const css = (vars: Record<string, string>) => vars as React.CSSProperties;
const ICONS = SHIP_MAP.icons as Record<string, string>;

/** Esc runs onBack while something is open. */
export function useEscape(active: boolean, onBack: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, onBack]);
}

export function ShipConsole({ ship, pick, onPick, onBack, onQuarters }: Props) {
  // A hail opened from the Captain's chair goes back to the chair, not to the watch.
  const from = pick?.from ? ship.station(pick.from) : undefined;
  const back = useCallback(() => (from ? onPick(from.id) : onBack()), [from, onPick, onBack]);
  useEscape(!!pick, back);
  const st = pick ? ship.station(pick.station) : undefined;
  if (!st) return <Watch ship={ship} onPick={onPick} />;
  if (st.id === 'captain') return <CaptainsChair ship={ship} onPick={onPick} onBack={onBack} onQuarters={onQuarters} />;
  const backLabel = from ? `‹ ${from.id === 'captain' ? 'Chair' : from.short}` : '‹ Watch';
  // A Bridge station with a picture gets two pages, like the Captain's chair. Keyed by
  // station, so picking another one starts again on page 1.
  if (hasArt(st.id)) return <StationScene key={st.id} ship={ship} st={st} orderId={pick?.order} back={backLabel} onBack={back} />;
  return (
    <section className="console" role="region" aria-label={`${st.name} console`} style={css({ '--c': stationColour(st) })}>
      <StationDetail ship={ship} st={st} orderId={pick?.order} back={backLabel} onBack={back} />
    </section>
  );
}

export function stationColour(st: Station): string {
  return st.kind === 'place' ? 'var(--border-strong)' : railColor(st.rail);
}

/** The title row of a console: icon, title, a small line under it, then any buttons. */
export function ConHead({ icon, title, sub, back, onBack, children }: {
  icon?: string; title: string; sub: string; back?: string; onBack?: () => void; children?: ReactNode;
}) {
  return (
    <div className="con-head">
      <span className="con-icon"><Icon path={icon} /></span>
      <span className="con-titles">
        <span className="con-title">{title}</span>
        <span className="con-sub mono">{sub}</span>
      </span>
      {children}
      {onBack && <button type="button" className="con-back" onClick={onBack} title="Back (Esc)">{back}</button>}
    </div>
  );
}

/** The small line under a station's title: deck, deck name, department. */
export function stationSub(st: Station): string {
  const dept = DEPTS.find((d) => d.id === st.dept);
  return `DECK ${st.deck} · ${DECKS[st.deck - 1].toUpperCase()}${dept ? ` · ${dept.name.toUpperCase()}` : ''}`;
}

/** The pills under the title: rail, status, rank, and off duty or acting head when they apply. */
export function StationPills({ ship, st }: { ship: ShipView; st: Station }) {
  const off = ship.off(st);
  return (
    <div className="con-pills">
      <span className="railpill" style={css({ '--c': railColor(st.rail) })}>{RAIL[st.rail].label}</span>
      <span className="railpill" style={css({ '--c': 'var(--text-label)', borderStyle: STATUS[st.status].line })}>{STATUS[st.status].label}</span>
      <span className="railpill" style={css({ '--c': 'var(--text-label)' })}>{RANK[st.rank].label.toUpperCase()}</span>
      {off && <span className="railpill" style={css({ '--c': 'var(--bad)' })}>OFF · {off.toUpperCase()}</span>}
      {ship.actingFor(st.id) && <span className="railpill" style={css({ '--c': 'var(--captain)' })}>ACTING HEAD</span>}
    </div>
  );
}

/** The order a station is working on (or the one picked), if there is one. */
export function OrderBox({ ship, st, orderId }: { ship: ShipView; st: Station; orderId?: string }) {
  const off = ship.off(st);
  const oid = orderId ?? st.activeOrder;
  const o = oid ? ship.data.orders.orders.find((x) => x.id === oid) : undefined;
  if (!o) return null;
  return (
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
  );
}

/**
 * The button to a station's own console, at the foot of its card. The Captain's opens the
 * Quarters (when `onQuarters` is given). Every other one waits until that station's board exists.
 */
export function ConsoleFoot({ st, onQuarters }: { st: Station; onQuarters?: () => void }) {
  return (
    <div className="con-foot">
      {st.id === 'captain'
        ? onQuarters && <button type="button" className="btn btn-gold" onClick={onQuarters}>To your Quarters</button>
        : <>
            <button type="button" className="btn btn-ghost" disabled>{st.short} console</button>
            <span className="con-hint">Not built yet.</span>
          </>}
    </div>
  );
}

/** One station's card: who it is, its order, its duty. `actions` adds buttons to the title row. */
export function StationDetail({ ship, st, orderId, back, onBack, actions, onQuarters }: {
  ship: ShipView; st: Station; orderId?: string; back: string; onBack: () => void; actions?: ReactNode; onQuarters?: () => void;
}) {
  return (
    <>
      <ConHead icon={ICONS[st.id]} title={st.name} back={back} onBack={onBack} sub={stationSub(st)}>
        {actions}
      </ConHead>
      <StationPills ship={ship} st={st} />
      <div className="con-body">
        <OrderBox ship={ship} st={st} orderId={orderId} />
        <dl className="con-facts">
          <dt>DUTY</dt><dd>{st.duty}</dd>
          {st.note && <><dt>NOTE</dt><dd>{st.note}</dd></>}
          {st.model && <><dt>MODEL</dt><dd>{st.model}</dd></>}
          {st.aliases.length > 0 && <><dt>ALIASES</dt><dd>{st.aliases.join(', ')}</dd></>}
          {st.answersTo && <><dt>ANSWERS TO</dt><dd>{st.answersTo}</dd></>}
        </dl>
      </div>
      <ConsoleFoot st={st} onQuarters={onQuarters} />
    </>
  );
}

/** Nothing picked: who is working right now, each row opens that station. */
function Watch({ ship, onPick }: { ship: ShipView; onPick: (station: string, order?: string) => void }) {
  const working = ship.data.stations.stations.filter((s) => s.activeOrder);
  const offDuty = ship.data.stations.stations.filter((s) => ship.off(s));
  return (
    <section className="console" role="region" aria-label="The watch" style={css({ '--c': 'var(--captain)' })}>
      <ConHead icon={ICONS.captain} title="The watch"
        sub={`${working.length} AT WORK · ${offDuty.length} OFF DUTY · PICK A ROOM OR A CARD`} />
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

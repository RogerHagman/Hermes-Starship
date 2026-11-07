// The console under the saucer. It shows whatever you picked, in place on the ship:
// a room on the plan, a card on the right, a name in the roster. With nothing picked
// it shows the watch: who is working right now. Esc or Back returns to the watch.
// StationDetail is shared with the wall screen in the Captain's Quarters.
import { OWN_BOARD, type BoardId } from '../lib/board';
import { useCallback, useEffect, type ReactNode } from 'react';
import { DECKS, DEPTS, RAIL, railColor, RANK, STATUS, speedText, tierText, tierVar } from '../lib/lookups';
import { age } from '../lib/format';
import { SHIP_MAP } from '../lib/shipmap';
import { canRelieve, type ShipView } from '../lib/ship';
import type { Order, Station } from '../types';
import { CaptainsChair } from './CaptainsChair';
import { ChainOfCommand } from './ChainOfCommand';
import { Icon } from './Icon';
import { hasArt } from './StationArt';
import { StationScene } from './StationScene';
import { Marked } from './Marked';
import { TaskClock } from './TaskClock';

/**
 * What the console shows: a station (and maybe one of its orders), or a department's chain
 * of command. `from` says where a station was opened from, so Back returns there: a station
 * id (the Captain's chair) or "dept:<id>" (a chain of command).
 */
export interface ConsolePick { station?: string; order?: string; from?: string; dept?: string }

interface Props {
  ship: ShipView;
  pick: ConsolePick | null;
  onPick: (station: string, order?: string, from?: string) => void;
  /** Opens a department's chain of command. */
  onDept?: (dept: string) => void;
  onBack: () => void;
  /** Opens the Captain's Quarters (from the Captain's chair). */
  onBoard?: (b: BoardId) => void;
  /** Relieves a station, or recalls it to its post (screen only, like a drill). */
  onRelieve?: (id: string) => void;
}

/** The Relieve button on a station card: whether it is relieved, and how to switch it. */
export type Relief = { on: boolean; toggle: () => void };

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

export function ShipConsole({ ship, pick, onPick, onDept, onBack, onBoard, onRelieve }: Props) {
  // A hail opened from the Captain's chair goes back to the chair, and a name picked in a
  // chain of command goes back to that chain, not to the watch.
  const fromDept = pick?.from?.startsWith('dept:') ? pick.from.slice(5) : undefined;
  const from = pick?.from && !fromDept ? ship.station(pick.from) : undefined;
  const back = useCallback(() => {
    if (fromDept && onDept) onDept(fromDept);
    else if (from) onPick(from.id);
    else onBack();
  }, [fromDept, from, onDept, onPick, onBack]);
  useEscape(!!pick, back);
  if (pick?.dept) return <ChainOfCommand ship={ship} dept={pick.dept} onBack={onBack} onPick={(id) => onPick(id, undefined, `dept:${pick.dept}`)} />;
  const st = pick?.station ? ship.station(pick.station) : undefined;
  if (!st) return <Watch ship={ship} onPick={onPick} />;
  if (st.id === 'captain') return <CaptainsChair ship={ship} onPick={onPick} onBack={onBack} onBoard={onBoard} />;
  const backLabel = fromDept ? '‹ Chain' : from ? `‹ ${from.id === 'captain' ? 'Chair' : from.short}` : '‹ Watch';
  // A station with a picture gets three pages (picture, card, service log), like the Captain's
  // chair. Keyed by station, so picking another one starts again on page 1.
  const relief: Relief | undefined = onRelieve && canRelieve(st)
    ? { on: ship.relieved.has(st.id), toggle: () => onRelieve(st.id) } : undefined;
  if (hasArt(st.id)) return <StationScene key={st.id} ship={ship} st={st} orderId={pick?.order} back={backLabel} onBack={back} onBoard={onBoard} relief={relief} />;
  return (
    <section className="console" role="region" aria-label={`${st.name} console`} style={css({ '--c': stationColour(st) })}>
      <StationDetail ship={ship} st={st} orderId={pick?.order} back={backLabel} onBack={back} relief={relief} />
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
        <span className="con-sub mono"><Marked>{sub}</Marked></span>
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

/**
 * The order a station is working on (or the one picked), if there is one. With `withReply`, the
 * newest thing that came back on it too (where the console has room for it).
 */
export function OrderBox({ ship, st, orderId, withReply }: { ship: ShipView; st: Station; orderId?: string; withReply?: boolean }) {
  const off = ship.off(st);
  const oid = orderId ?? st.activeOrder;
  const o = oid ? ship.data.orders.orders.find((x) => x.id === oid) : undefined;
  if (!o) return null;
  return (
    <div className="con-order" style={css({ '--c': tierVar(o.tier) })}>
      <span className="idtag">
        {o.id} · {off ? `WAITS, ${off.toUpperCase()}` : o.state.toUpperCase()} · {tierText(o.tier)}
         · {speedText(o.speed, ship.station(o.station)).toUpperCase()} · {age(ship.data.orders.asOf, o.updatedAt).toUpperCase()}
        <TaskClock ship={ship} order={o} />
      </span>
      <span className="con-order-title">{o.title}</span>
      {o.detail && <span className="con-text">{o.detail}</span>}
      {withReply && o.replies && <LatestReply reply={o.replies[o.replies.length - 1]} count={o.replies.length} ship={ship} />}
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


/** The newest thing that came back on an order, cut to a few lines; the order card has them all. */
function LatestReply({ ship, reply, count }: { ship: ShipView; reply: NonNullable<Order['replies']>[number]; count: number }) {
  return (
    <span className="con-reply">
      <span className="reply-meta mono">
        {count > 1 ? `NEWEST OF ${count} REPLIES` : 'REPLY'} · {(ship.station(reply.by)?.short ?? reply.by).toUpperCase()} · {age(ship.data.orders.asOf, reply.at).toUpperCase()}
      </span>
      <span className="reply-text clamped">{reply.text}</span>
    </span>
  );
}

/**
 * The button to a station's own console, at the foot of its card. The Captain's and the
 * Quarters station's open the Captain's Quarters board, the Holodeck's opens the Holodeck
 * (when `onBoard` is given). Every other one waits until that station's board exists.
 * With `relief`, a Relieve button sends the crew member to quarters, and Recall brings them back.
 */
export function ConsoleFoot({ st, onBoard, relief, here }: { st: Station; onBoard?: (b: BoardId) => void; relief?: Relief; here?: BoardId }) {
  const own = OWN_BOARD[st.id];
  if (own && own === here) return relief ? <div className="con-foot"><RelieveButton relief={relief} /></div> : null;
  return (
    <div className="con-foot">
      {relief && <RelieveButton relief={relief} />}
      {own && onBoard
        ? <button type="button" className="btn btn-gold" onClick={() => onBoard(own)}>
            {st.id === 'captain' ? 'To your Quarters' : `${st.short} console`}
          </button>
        : st.id === 'captain' ? null
        : <>
            <button type="button" className="btn btn-ghost" disabled>{st.short} console</button>
            <span className="con-hint">Not built yet.</span>
          </>}
    </div>
  );
}

function RelieveButton({ relief }: { relief: Relief }) {
  return (
    <button type="button" className="btn btn-ghost relieve" aria-pressed={relief.on} onClick={relief.toggle}
      title={relief.on ? 'Bring them back to their post. Screen only.' : 'Send them to quarters. Screen only.'}>
      {relief.on ? 'Recall to post' : 'Relieve'}
    </button>
  );
}

/** One station's card: who it is, its order, its duty. `actions` adds buttons to the title row. */
export function StationDetail({ ship, st, orderId, back, onBack, actions, onBoard, relief, here }: {
  ship: ShipView; st: Station; orderId?: string; back: string; onBack: () => void; actions?: ReactNode; onBoard?: (b: BoardId) => void;
  relief?: Relief; here?: BoardId;
}) {
  return (
    <>
      <ConHead icon={ICONS[st.id]} title={st.name} back={back} onBack={onBack} sub={stationSub(st)}>
        {actions}
      </ConHead>
      <StationPills ship={ship} st={st} />
      <div className="con-body">
        <OrderBox ship={ship} st={st} orderId={orderId} withReply />
        <dl className="con-facts">
          <dt>DUTY</dt><dd>{st.duty}</dd>
          {st.note && <><dt>NOTE</dt><dd>{st.note}</dd></>}
          {st.model && <><dt>MODEL</dt><dd>{st.model}</dd></>}
          {st.aliases.length > 0 && <><dt>ALIASES</dt><dd>{st.aliases.join(', ')}</dd></>}
          {st.answersTo && <><dt>ANSWERS TO</dt><dd>{st.answersTo}</dd></>}
        </dl>
      </div>
      <ConsoleFoot st={st} onBoard={onBoard} relief={relief} here={here} />
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

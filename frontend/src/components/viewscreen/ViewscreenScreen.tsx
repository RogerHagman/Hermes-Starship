// The Main Viewscreen's own screen. One view at a time, in place: what is on screen now (or the last
// session when it is off), the standing order, the Telegram relay, the actions waiting for your OK,
// the session log, one session, the orders, one order, the Captain's card and the Viewscreen's card.
import type { ReactNode } from 'react';
import { clockTime, dayLine } from '../../lib/format';
import { ordersOf } from '../../lib/post';
import type { ShipView } from '../../lib/ship';
import {
  DECISION_COLOUR, DECISION_WORD, KIND_WORD, STANDING, VS_ICONS, actions, current, length, sessions, tally, waiting, type Ask,
} from '../../lib/viewscreen';
import { SURFACE_WORD } from '../../lib/computer';
import type { AwaySession, ViewscreenFile } from '../../types';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';
import { OrderRow, OrderView, css, sourceWord, up } from '../post/Parts';

export type Screen =
  | { view: 'ease' } | { view: 'rules' } | { view: 'relay' } | { view: 'approve' } | { view: 'log' }
  | { view: 'session'; id: string; from?: Screen } | { view: 'orders' } | { view: 'order'; id: string; from?: Screen } | { view: 'station'; id: string };

interface Props { ship: ShipView; screen: Screen; onScreen: (s: Screen) => void }

export function ViewscreenScreen({ ship, screen, onScreen }: Props) {
  const f = ship.data.viewscreen;
  const back = () => onScreen({ view: 'ease' });
  const from = 'from' in screen ? screen.from : undefined;
  useEscape(screen.view !== 'ease', from ? () => onScreen(from) : back);
  const openSession = (here: Screen) => (id: string) => onScreen({ view: 'session', id, from: here });
  const openOrder = (here: Screen) => (id: string) => onScreen({ view: 'order', id, from: here });
  const backFn = () => onScreen(from ?? { view: 'ease' });
  let body: ReactNode;
  switch (screen.view) {
    case 'rules': body = <RulesView onBack={back} />; break;
    case 'relay': body = <RelayView f={f} onOpen={openSession(screen)} onBack={back} />; break;
    case 'approve': body = <ApproveView f={f} onOpen={openSession(screen)} onBack={back} />; break;
    case 'log': body = <LogView f={f} onOpen={openSession(screen)} onBack={back} />; break;
    case 'session': {
      const s = f.sessions.find((x) => x.id === screen.id);
      body = s
        ? <SessionView f={f} s={s} back={from ? '‹ Back' : '‹ On screen'} onBack={backFn} onOrder={openOrder(screen)} />
        : <ConHead icon={VS_ICONS.session} title={screen.id} sub="NO SUCH SESSION IN THE LOG" back="‹ Back" onBack={backFn} />;
      break;
    }
    case 'orders': body = <OrdersView ship={ship} onOpen={openOrder(screen)} onBack={back} />; break;
    case 'order': body = <OrderView ship={ship} id={screen.id} icon={VS_ICONS.orders} back={from ? '‹ Back' : '‹ On screen'} onBack={backFn} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ On screen" onBack={back} here="viewscreen" />;
      break;
    }
  }
  if (!body) {
    const now = current(f);
    body = now
      ? <SessionView f={f} s={now} live onOrder={openOrder({ view: 'ease' })} />
      : <OffView f={f} onOpen={openSession({ view: 'ease' })} />;
  }
  return (
    <section className="console wall post-screen" role="region" aria-label="The Viewscreen's screen" style={css({ '--c': 'var(--acc)' })}>
      {body}
    </section>
  );
}

const source = (f: ViewscreenFile) => sourceWord(f.synthetic, f.asOf).replace('SAMPLE', 'SAMPLE SESSIONS');
const surface = (s: AwaySession) => up(SURFACE_WORD[s.surface] ?? s.surface);

/** One action as a row on the session's tape. */
function ActionRow({ a, onSession }: { a: Ask; onSession?: (id: string) => void }) {
  const d = a.action.decision;
  return (
    <li className={'vact' + (d === 'waiting' ? ' asking' : '')} style={css({ '--pc': DECISION_COLOUR[d] })}>
      <time className="mono" dateTime={a.action.at}>{clockTime(a.action.at)}</time>
      <span className="va-kind mono">{up(KIND_WORD[a.action.kind])}</span>
      <span className="va-what">{a.action.what}</span>
      <span className="va-dec mono">{up(DECISION_WORD[d])}</span>
      {onSession && <button type="button" className="linkish mono va-sess" onClick={() => onSession(a.session.id)}>{a.session.id}</button>}
    </li>
  );
}

// ---------- on screen: one session ----------

function SessionView({ f, s, live, back, onBack, onOrder }: {
  f: ViewscreenFile; s: AwaySession; live?: boolean; back?: string; onBack?: () => void; onOrder: (id: string) => void;
}) {
  const t = tally(s);
  const tape = [...s.actions].sort((a, b) => a.at.localeCompare(b.at)).map((action) => ({ session: s, action }));
  return (
    <>
      <ConHead icon={VS_ICONS.ease} title={live ? `On screen · ${s.why}` : s.why} back={back} onBack={onBack}
        sub={`${s.id} · ${surface(s)} · ${s.end ? `${dayLine(s.start)} · ${clockTime(s.start)}–${clockTime(s.end)}` : `ON SINCE ${clockTime(s.start)}`} · ${length(s, f.asOf).toUpperCase()} · ${source(f)}`} />
      <div className="con-body pbody">
        <div className="vstate">
          <span className={'vs-lamp' + (s.end ? '' : ' on')} aria-hidden />
          <span className="vs-word">{s.end ? 'Off screen: this session has ended.' : 'On screen. Each step waits for your OK.'}</span>
          <span className="mono vs-n">{s.captures} CAPTURE{s.captures === 1 ? '' : 'S'} SENT TO TELEGRAM</span>
        </div>
        <ul className="pkpis" style={css({ '--n': 3 })}>
          <li className="tone-good"><span className="pk-n">{t.approved}</span><span className="pk-l mono">APPROVED</span></li>
          <li className={t.denied ? 'tone-bad' : undefined}><span className="pk-n">{t.denied}</span><span className="pk-l mono">DENIED</span></li>
          <li className={t.waiting ? 'tone-warn' : undefined}><span className="pk-n">{t.waiting}</span><span className="pk-l mono">WAITING FOR YOU</span></li>
        </ul>
        <div className="psec">
          <span className="cb-head mono">THE TAPE · EVERY ACTION, IN ORDER</span>
          <ol className="vtape">{tape.map((a) => <ActionRow key={a.action.at} a={a} />)}</ol>
        </div>
        {t.waiting > 0 && <p className="pnote">The waiting step goes nowhere until you answer it on {SURFACE_WORD[s.surface] ?? s.surface}. This board only reads.</p>}
        {s.sourceOrd && <p className="pnote">Opened on order <button type="button" className="linkish mono" onClick={() => onOrder(s.sourceOrd!)}>{s.sourceOrd}</button>.</p>}
      </div>
    </>
  );
}

// ---------- off screen ----------

function OffView({ f, onOpen }: { f: ViewscreenFile; onOpen: (id: string) => void }) {
  const last = sessions(f)[0];
  return (
    <>
      <ConHead icon={VS_ICONS.off} title="Off screen" sub={`NOTHING IS CAPTURED · SAY "ON SCREEN" TO START A SESSION · ${source(f)}`} />
      <div className="con-body pbody">
        <div className="vstate">
          <span className="vs-lamp" aria-hidden />
          <span className="vs-word">The Viewscreen is dark. Your desktop is not being captured.</span>
        </div>
        {last && (
          <ul className="prows">
            <li><button type="button" className="prow" style={css({ '--pc': 'var(--acc)' })} onClick={() => onOpen(last.id)}>
              <span className="pr-text">Last session · {last.why}</span>
              <span className="pr-when mono">{dayLine(last.start)} · {length(last, f.asOf).toUpperCase()}</span>
              <span className="pr-why">{last.actions.length} actions, {tally(last).denied} denied, {last.captures} captures sent to Telegram.</span>
            </button></li>
          </ul>
        )}
      </div>
    </>
  );
}

// ---------- the standing order ----------

function RulesView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <ConHead icon={VS_ICONS.rules} title="Standing order" back="‹ On screen" onBack={onBack} sub="EVERY CLICK NEEDS YOUR OK · NEVER YOLO" />
      <div className="con-body pbody">
        <ol className="prows">
          {STANDING.map((r) => (
            <li key={r.name}><div className="prow" style={css({ '--pc': 'var(--captain)' })}>
              <span className="pr-text">{r.name}</span>
              <span className="pr-why">{r.text}</span>
            </div></li>
          ))}
        </ol>
        <p className="pnote">Computer use is not fitted yet: these sessions are a sample. When it is, the log here will be the real one.</p>
      </div>
    </>
  );
}

// ---------- the Telegram relay ----------

function RelayView({ f, onOpen, onBack }: { f: ViewscreenFile; onOpen: (id: string) => void; onBack: () => void }) {
  const list = sessions(f);
  const total = list.reduce((n, s) => n + s.captures, 0);
  const most = Math.max(1, ...list.map((s) => s.captures));
  return (
    <>
      <ConHead icon={VS_ICONS.relay} title={`Telegram relay · ${total} captures`} back="‹ On screen" onBack={onBack}
        sub="EACH CAPTURE OF THE DESKTOP GOES TO YOU ON TELEGRAM · PER SESSION, NEWEST FIRST" />
      <div className="con-body pbody">
        <ul className="pbars">
          {list.map((s) => (
            <li key={s.id}>
              <button type="button" className="pbar-row" onClick={() => onOpen(s.id)}>
                <span className="pb-label">{s.why}</span>
                <span className="pb-track"><b style={{ width: `${(s.captures / most) * 100}%` }} /></span>
                <span className="pb-v mono">{s.captures} · {dayLine(s.start)} · {surface(s)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- approve ----------

function ApproveView({ f, onOpen, onBack }: { f: ViewscreenFile; onOpen: (id: string) => void; onBack: () => void }) {
  const wait = waiting(f);
  const denied = actions(f).filter((a) => a.action.decision === 'denied');
  return (
    <>
      <ConHead icon={VS_ICONS.approve} title={`Approve · ${wait.length} waiting`} back="‹ On screen" onBack={onBack}
        sub="ACTIONS WAITING FOR YOUR OK, AND WHAT YOU SAID NO TO" />
      <div className="con-body pbody">
        {wait.length === 0 && <p className="pnote">No action waits for you.</p>}
        {wait.length > 0 && <ol className="vtape">{wait.map((a) => <ActionRow key={a.action.at} a={a} onSession={onOpen} />)}</ol>}
        <div className="psec">
          <span className="cb-head mono">DENIED · {denied.length}</span>
          {denied.length === 0 ? <p className="pnote">You have not said no to anything.</p>
            : <ol className="vtape">{denied.map((a) => <ActionRow key={a.action.at} a={a} onSession={onOpen} />)}</ol>}
        </div>
        <p className="pnote">You answer on the surface that asked. This board only reads.</p>
      </div>
    </>
  );
}

// ---------- the session log ----------

function LogView({ f, onOpen, onBack }: { f: ViewscreenFile; onOpen: (id: string) => void; onBack: () => void }) {
  const list = sessions(f);
  return (
    <>
      <ConHead icon={VS_ICONS.log} title={`Session log · ${list.length}`} back="‹ On screen" onBack={onBack} sub={`NEWEST FIRST · ${source(f)}`} />
      <div className="con-body pbody">
        <ul className="prows">
          {list.map((s) => {
            const t = tally(s);
            return (
              <li key={s.id}>
                <button type="button" className={'prow' + (s.end ? '' : ' alert')} style={css({ '--pc': s.end ? 'var(--acc)' : 'var(--captain)' })} onClick={() => onOpen(s.id)}>
                  <span className="pr-text">{s.why}</span>
                  <span className="pr-when mono">{s.end ? '' : 'ON SCREEN · '}{dayLine(s.start)} · {clockTime(s.start)} · {length(s, f.asOf).toUpperCase()}</span>
                  <span className="pr-why">{s.id} · {SURFACE_WORD[s.surface] ?? s.surface} · {t.approved} approved, {t.denied} denied{t.waiting ? `, ${t.waiting} waiting` : ''} · {s.captures} captures</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- the Viewscreen's orders ----------

function OrdersView({ ship, onOpen, onBack }: { ship: ShipView; onOpen: (id: string) => void; onBack: () => void }) {
  const list = ordersOf(ship.data, ['screen']);
  return (
    <>
      <ConHead icon={VS_ICONS.orders} title={`On-screen orders · ${list.length}`} back="‹ On screen" onBack={onBack} sub="EVERY ORDER ON FILE FOR THE VIEWSCREEN · NEWEST FIRST" />
      <div className="con-body pbody">
        {list.length === 0 && <p className="pnote">No orders on file for the Viewscreen yet.</p>}
        <ol className="porders">{list.map((o) => <OrderRow key={o.id} ship={ship} o={o} onOpen={onOpen} extra={<span />} />)}</ol>
      </div>
    </>
  );
}

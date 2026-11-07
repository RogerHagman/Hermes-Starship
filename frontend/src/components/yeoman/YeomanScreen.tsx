// The Yeoman's wall screen. One view at a time, in place: the list in its four boxes with the reason
// each todo sits where it does, one box, one item, the next 48 hours, the reminders with the timer's
// proof, waiting for, the recurring rules, the done log, how to say things, and the Yeoman's card.
// Reading only: nothing here reaches Hermes. Ticking, snoozing and cancelling stay with the Yeoman.
import type { ReactNode } from 'react';
import { dayAndTime, dayLine } from '../../lib/format';
import type { ShipView } from '../../lib/ship';
import {
  BEAT_STALE_MIN, BOX, BOXES, HOW_WORD, KIND_WORD, PHRASES, URGENT_H, YEOMAN_ICONS, along, boxOf, findItem, heartbeat, late, matrix,
  moveHint, next48, nowOf, overdue, ruleWords, until, when, why, type Box, type Kind, type Mark,
} from '../../lib/yeoman';
import type { Closed, Todo } from '../../types';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';

export type Screen =
  | { view: 'ease' } | { view: 'box'; box: Box } | { view: 'item'; id: string; from?: Screen } | { view: 'next48' }
  | { view: 'reminders' } | { view: 'waiting' } | { view: 'recurring' } | { view: 'done' } | { view: 'say' }
  | { view: 'station'; id: string };

const up = (s: string) => s.toUpperCase();
const SO: Record<Box, string> = { first: 'urgent and important', schedule: 'important but not urgent',
  delegate: 'urgent but not important', drop: 'neither urgent nor important' };
const SURFACE: Record<string, string> = { telegram: 'Telegram', desktop: 'Desktop app', dashboard: 'Web dashboard', cli: 'Command line' };

/** Where the list came from, for the line under each title. */
export function sourceWord(ship: ShipView): string {
  const y = ship.data.yeoman;
  return y.synthetic ? 'SAMPLE LIST' : `LIVE · READ ${up(dayAndTime(y.asOf))}`;
}

interface Props {
  ship: ShipView;
  screen: Screen;
  onScreen: (s: Screen) => void;
}

export function YeomanScreen({ ship, screen, onScreen }: Props) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', screen.view === 'item' && screen.from ? () => onScreen(screen.from!) : back);
  const open = (id: string, from?: Screen) => onScreen({ view: 'item', id, from });
  let body: ReactNode;
  switch (screen.view) {
    case 'box': body = <BoxView ship={ship} box={screen.box} onOpen={(id) => open(id, screen)} onBack={back} />; break;
    case 'item': body = <ItemView ship={ship} id={screen.id} onScreen={onScreen}
      back={screen.from ? backWord(screen.from) : '‹ The list'} onBack={() => onScreen(screen.from ?? { view: 'ease' })} />; break;
    case 'next48': body = <Next48View ship={ship} onOpen={(id) => open(id, screen)} onBack={back} />; break;
    case 'reminders': body = <RemindersView ship={ship} onOpen={(id) => open(id, screen)} onBack={back} />; break;
    case 'waiting': body = <WaitingView ship={ship} onOpen={(id) => open(id, screen)} onBack={back} />; break;
    case 'recurring': body = <RecurringView ship={ship} onOpen={(id) => open(id, screen)} onBack={back} />; break;
    case 'done': body = <DoneView ship={ship} onOpen={(id) => open(id, screen)} onBack={back} />; break;
    case 'say': body = <SayView ship={ship} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ The list" onBack={back} here="yeoman" />;
      break;
    }
  }
  if (!body) body = <ListView ship={ship} onScreen={onScreen} onOpen={(id) => open(id)} />;
  return (
    <section className="console wall yeo-screen" role="region" aria-label="The Yeoman's screen" style={{ '--c': 'var(--yeo)' } as React.CSSProperties}>
      {body}
    </section>
  );
}

function backWord(s: Screen): string {
  switch (s.view) {
    case 'box': return `‹ ${BOX[s.box].name}`;
    case 'next48': return '‹ 48 hours';
    case 'reminders': return '‹ Reminders';
    case 'waiting': return '‹ Waiting for';
    case 'recurring': return '‹ Recurring';
    case 'done': return '‹ Done log';
    default: return '‹ The list';
  }
}

/** A small box pill: the box's colour and name. */
export function BoxPill({ box }: { box: Box }) {
  return <span className={`ypill yb-${box}`}>{up(BOX[box].name)}</span>;
}

/** A small kind pill: To do, Reminder, Waiting for, Recurring. */
export function KindPill({ kind }: { kind: Kind }) {
  return <span className={`ypill yk-${kind}`}>{up(KIND_WORD[kind])}</span>;
}

// ---------- the list: four boxes, each todo with its reason ----------

function ListView({ ship, onScreen, onOpen }: { ship: ShipView; onScreen: (s: Screen) => void; onOpen: (id: string) => void }) {
  const y = ship.data.yeoman;
  const now = nowOf(ship.data);
  const m = matrix(y, now);
  const late = overdue(y, now).length;
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.ease} title="The list · four boxes"
        sub={`${y.todos.length} TODOS${late ? ` · ${late} OVERDUE` : ''} · URGENT: DUE WITHIN ${URGENT_H} H · IMPORTANT: YOUR "!" · ${sourceWord(ship)}`} />
      <div className="ymatrix" role="group" aria-label="The four boxes">
        {BOXES.map((b) => (
          <div key={b} className={`yquad yb-${b}`}>
            <button type="button" className="yq-head" onClick={() => onScreen({ view: 'box', box: b })}>
              <span className="yq-name">{BOX[b].name}</span>
              <span className="yq-n">{m[b].length}</span>
              <span className="yq-rule mono">{BOX[b].rule}</span>
            </button>
            <ol className="yq-list">
              {m[b].length === 0 && <li className="yq-none">Nothing here.</li>}
              {m[b].map((t) => (
                <li key={t.id}>
                  <button type="button" className="yq-item" onClick={() => onOpen(t.id)}>
                    <span className="yq-text">{t.text}</span>
                    <span className="yq-why mono">{why(t, now)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- one box ----------

function BoxView({ ship, box, onOpen, onBack }: { ship: ShipView; box: Box; onOpen: (id: string) => void; onBack: () => void }) {
  const now = nowOf(ship.data);
  const list = matrix(ship.data.yeoman, now)[box];
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.box} title={`${BOX[box].name} · ${list.length}`} back="‹ The list" onBack={onBack}
        sub={`${BOX[box].rule} · ${up(BOX[box].help)}`} />
      <div className={`con-body ybox yb-${box}`}>
        <p className="yroute"><b className="mono">WHAT HAPPENS · </b>{BOX[box].route}</p>
        {list.length === 0 && <p className="ynote">Nothing in this box right now.</p>}
        <ol className="yrows">
          {list.map((t) => <TodoRow key={t.id} t={t} now={now} onOpen={onOpen} />)}
        </ol>
      </div>
    </>
  );
}

function TodoRow({ t, now, onOpen }: { t: Todo; now: number; onOpen: (id: string) => void }) {
  return (
    <li>
      <button type="button" className="yrow" onClick={() => onOpen(t.id)}>
        <span className="yr-text">{t.text}</span>
        <span className="yr-when mono">{t.due ? `DUE ${up(when(t.due))}` : 'NO DUE DATE'}</span>
        <span className="yr-why">{why(t, now)} {moveHint(t, now)}</span>
      </button>
    </li>
  );
}

// ---------- one item ----------

function ItemView({ ship, id, onScreen, back, onBack }: { ship: ShipView; id: string; onScreen: (s: Screen) => void; back: string; onBack: () => void }) {
  const y = ship.data.yeoman;
  const now = nowOf(ship.data);
  const found = findItem(y, id);
  if (!found) return <ConHead icon={YEOMAN_ICONS.item} title={id} sub="NOT ON THE LIST ANY MORE" back={back} onBack={onBack} />;
  const source = (ord?: string) => ord && <div><dt>FROM ORDER</dt><dd>{ord}</dd></div>;
  const surface = (s?: string) => s && <div><dt>CAME IN ON</dt><dd>{up(SURFACE[s] ?? s)}</dd></div>;
  let facts: ReactNode;
  let story: ReactNode;
  let sub: string;
  switch (found.kind) {
    case 'todo': {
      const t = found.item;
      const b = boxOf(t, now);
      sub = `TO DO · ${up(BOX[b].name)} · ADDED ${dayLine(t.addedAt)}`;
      facts = <>
        <div><dt>BOX</dt><dd><button type="button" className="linkish" onClick={() => onScreen({ view: 'box', box: b })}><BoxPill box={b} /></button></dd></div>
        <div><dt>DUE</dt><dd>{t.due ? `${up(when(t.due))} · ${up(until(t.due, now))}` : 'NO DUE DATE'}</dd></div>
        <div><dt>IMPORTANT</dt><dd>{t.important ? 'YES · MARKED "!"' : 'NO "!"'}</dd></div>
        <div><dt>ADDED</dt><dd>{up(when(t.addedAt))}</dd></div>
        {source(t.sourceOrd)}
      </>;
      story = <>
        <Story head="HOW IT GOT HERE">{why(t, now)} That makes it {SO[b]}, so it sits in {BOX[b].name}.</Story>
        <Story head="WHAT WOULD MOVE IT">{moveHint(t, now)}</Story>
        <Story head="WHAT HAPPENS">{BOX[b].route}</Story>
      </>;
      break;
    }
    case 'reminder': {
      const r = found.item;
      sub = `REMINDER · ${r.status === 'snoozed' ? 'SNOOZED' : 'SET'} · ${up(until(r.dueAt, now))}`;
      facts = <>
        <div><dt>FIRES</dt><dd>{up(when(r.dueAt))}</dd></div>
        <div><dt>STATE</dt><dd>{r.status === 'snoozed' ? 'SNOOZED' : 'SET'}</dd></div>
        {surface(r.surface)}
        {source(r.sourceOrd)}
      </>;
      story = <Story head="HOW IT FIRES">The Yeoman's timer fires it at that time and sends it to you. Code keeps the time; the model never decides when.</Story>;
      break;
    }
    case 'waiting': {
      const w = found.item;
      sub = `WAITING FOR${w.fromWhom ? ` · ${up(w.fromWhom)}` : ''} · SINCE ${dayLine(w.since)}`;
      facts = <>
        <div><dt>SINCE</dt><dd>{up(when(w.since))} · {up(until(w.since, now))}</dd></div>
        {w.fromWhom && <div><dt>FROM</dt><dd>{up(w.fromWhom)}</dd></div>}
        <div><dt>NUDGE</dt><dd>{w.nudgeAfter ? `${up(when(w.nudgeAfter))}${late(w, now) ? ' · LATE' : ''}` : 'NO NUDGE SET'}</dd></div>
        {source(w.sourceOrd)}
      </>;
      story = <Story head="WHAT HAPPENS">{w.nudgeAfter
        ? late(w, now) ? 'The nudge time has passed: the Yeoman nudges you once, then keeps it on the list until it arrives.' : 'When the nudge time comes, the Yeoman nudges you once.'
        : 'It stays on the list until you say it arrived. No nudge is set.'}</Story>;
      break;
    }
    case 'recurring': {
      const c = found.item;
      sub = `RECURRING · ${up(ruleWords(c.rule))}`;
      facts = <>
        <div><dt>RULE</dt><dd>{c.rule}</dd></div>
        <div><dt>NEXT</dt><dd>{c.nextDue ? `${up(when(c.nextDue))} · ${up(until(c.nextDue, now))}` : 'NOT SET'}</dd></div>
        {surface(c.surface)}
        {source(c.sourceOrd)}
      </>;
      story = <Story head="HOW IT REPEATS">{ruleWords(c.rule)}. It fires each time, then code sets the next date from the rule.</Story>;
      break;
    }
    default: {
      const d: Closed = found.item;
      sub = `${up(KIND_WORD[d.kind])} · ${HOW_WORD[d.how] ?? up(d.how)} ${dayLine(d.closedAt)}`;
      facts = <>
        <div><dt>CLOSED</dt><dd>{up(when(d.closedAt))}</dd></div>
        <div><dt>HOW</dt><dd>{HOW_WORD[d.how] ?? up(d.how)}</dd></div>
        <div><dt>WAS</dt><dd>{up(KIND_WORD[d.kind])}</dd></div>
        {source(d.sourceOrd)}
      </>;
      story = <Story head="ON FILE">The Yeoman's code wrote this line to the done log when it closed. Nothing on this board can reopen it.</Story>;
    }
  }
  const text = found.kind === 'waiting' ? found.item.what : found.item.text;
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.item} title={text} sub={sub} back={back} onBack={onBack} />
      <div className="con-body yitem">
        <dl className="yfacts mono"><div><dt>ID</dt><dd>{id}</dd></div>{facts}</dl>
        {story}
        {found.kind !== 'done' && <p className="ynote">To tick it off, snooze it or drop it, tell the Yeoman in chat and name {id}. This board only reads the list.</p>}
      </div>
    </>
  );
}

function Story({ head, children }: { head: string; children: ReactNode }) {
  return <div className="ystory"><span className="cb-head mono">{head}</span><p>{children}</p></div>;
}

// ---------- the next 48 hours ----------

/** A tick every 6 hours along the line, labelled with the ship's clock. */
const TICKS = [0, 6, 12, 18, 24, 30, 36, 42, 48];
const ABOVE: Kind[] = ['reminder', 'recurring', 'waiting'];

function Next48View({ ship, onOpen, onBack }: { ship: ShipView; onOpen: (id: string) => void; onBack: () => void }) {
  const y = ship.data.yeoman;
  const now = nowOf(ship.data);
  const marks = next48(y, now);
  const stamp = (h: number) => new Date(now + h * 3_600_000).toISOString();
  const dot = (k: Mark) => (
    <button key={k.kind + k.id} type="button" className={`ydot yk-${k.kind}${k.box ? ` yb-${k.box}` : ''}${k.snoozed ? ' snoozed' : ''}`}
      style={{ left: `${along(k.at, now) * 100}%` }} onClick={() => onOpen(k.id)}
      title={`${KIND_WORD[k.kind]} · ${when(k.at)} · ${k.text}`} aria-label={`${KIND_WORD[k.kind]}, ${until(k.at, now)}: ${k.text}`} />
  );
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.clock} title={`The next ${URGENT_H} hours · ${marks.length}`} back="‹ The list" onBack={onBack}
        sub={`FROM ${up(when(y.asOf))} · REMINDERS, RECURRING AND NUDGES ABOVE · TODO DUE DATES BELOW · ${sourceWord(ship)}`} />
      <div className="con-body y48">
        <div className="yline">
          <div className="yl-lane up">{marks.filter((k) => ABOVE.includes(k.kind)).map(dot)}</div>
          <div className="yl-axis" aria-hidden="true">
            {TICKS.map((h) => <b key={h} className={'yl-tick' + (h === 0 || h === 48 ? ' end' : '')} style={{ left: `${(h / 48) * 100}%` }} />)}
          </div>
          <div className="yl-lane down">{marks.filter((k) => !ABOVE.includes(k.kind)).map(dot)}</div>
          <div className="yl-labels" aria-hidden="true">
            {TICKS.map((h) => (
              <span key={h} className={'yl-when mono' + (h === 0 ? ' now' : h === 48 ? ' edge' : '')} style={{ left: `${(h / 48) * 100}%` }}>
                {h === 0 ? 'NOW' : h === 48 ? '48 H EDGE' : up(dayAndTime(stamp(h)))}
              </span>
            ))}
          </div>
        </div>
        {marks.length === 0 && <p className="ynote">Nothing falls due in the next {URGENT_H} hours.</p>}
        <ol className="ymarks">
          {marks.map((k) => (
            <li key={k.kind + k.id}>
              <button type="button" className="ymark" onClick={() => onOpen(k.id)}>
                <time className="mono" dateTime={k.at}>{up(dayAndTime(k.at))}</time>
                {k.box ? <BoxPill box={k.box} /> : <KindPill kind={k.kind} />}
                <span className="ym-text">{k.text}{k.snoozed ? ' · snoozed' : ''}</span>
                <span className="ym-until mono">{up(until(k.at, now))}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ---------- reminders, with the timer's proof ----------

function RemindersView({ ship, onOpen, onBack }: { ship: ShipView; onOpen: (id: string) => void; onBack: () => void }) {
  const y = ship.data.yeoman;
  const now = nowOf(ship.data);
  const list = [...y.reminders].sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const fired = y.done.filter((d) => d.kind === 'reminder' && d.how === 'fired');
  const beat = heartbeat(y);
  const snoozed = list.filter((r) => r.status === 'snoozed').length;
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.chime} title={`Reminders · ${list.length}`} back="‹ The list" onBack={onBack}
        sub={`${list.length - snoozed} SET · ${snoozed} SNOOZED · FIRED BY THE YEOMAN'S TIMER · ${sourceWord(ship)}`} />
      <div className="con-body">
        <Beat beat={beat} />
        <ol className="yrows">
          {list.length === 0 && <li className="ynote">No reminder is set.</li>}
          {list.map((r) => (
            <li key={r.id}>
              <button type="button" className={'yrow yk-reminder' + (r.status === 'snoozed' ? ' snoozed' : '')} onClick={() => onOpen(r.id)}>
                <span className="yr-text">{r.text}</span>
                <span className="yr-when mono">{up(when(r.dueAt))} · {up(until(r.dueAt, now))}{r.status === 'snoozed' ? ' · SNOOZED' : ''}</span>
                {r.surface && <span className="yr-why">Set from {SURFACE[r.surface] ?? r.surface}.</span>}
              </button>
            </li>
          ))}
        </ol>
        <div className="ysec">
          <span className="cb-head mono">FIRED · FROM THE DONE LOG · {fired.length}</span>
          {fired.length === 0 && <p className="ynote">No reminder has fired yet on this list.</p>}
          <ol className="ydone">{fired.slice(0, 6).map((d) => <DoneRow key={d.id} d={d} onOpen={onOpen} />)}</ol>
        </div>
      </div>
    </>
  );
}

/** The timer's heartbeat: proof that reminders can fire. */
export function Beat({ beat }: { beat: number | null }) {
  if (beat === null) return <p className="ybeat unknown mono">TIMER · NO HEARTBEAT ON FILE · THE LIST DOESN'T SAY WHEN THE TIMER LAST RAN</p>;
  const stale = beat > BEAT_STALE_MIN;
  return (
    <p className={'ybeat mono' + (stale ? ' stale' : '')}>
      <span className="yb-lamp" />TIMER · {stale
        ? `LAST BEAT ${beat} MIN BEFORE THE LIST WAS READ · REMINDERS MAY NOT FIRE · OPS CAN CHECK IT`
        : `BEATING · LAST BEAT ${beat < 1 ? 'UNDER A MINUTE' : `${beat} MIN`} BEFORE THE LIST WAS READ`}
    </p>
  );
}

// ---------- waiting for ----------

function WaitingView({ ship, onOpen, onBack }: { ship: ShipView; onOpen: (id: string) => void; onBack: () => void }) {
  const y = ship.data.yeoman;
  const now = nowOf(ship.data);
  const list = [...y.waiting].sort((a, b) => Number(late(b, now)) - Number(late(a, now)) || a.since.localeCompare(b.since));
  const n = list.filter((w) => late(w, now)).length;
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.waiting} title={`Waiting for · ${list.length}`} back="‹ The list" onBack={onBack}
        sub={`${n} PAST THE NUDGE · THE YEOMAN NUDGES YOU ONCE · ${sourceWord(ship)}`} />
      <div className="con-body">
        <ol className="yrows">
          {list.length === 0 && <li className="ynote">You're not waiting for anything.</li>}
          {list.map((w) => (
            <li key={w.id}>
              <button type="button" className={'yrow yk-waiting' + (late(w, now) ? ' late' : '')} onClick={() => onOpen(w.id)}>
                <span className="yr-text">{w.what}{late(w, now) && <span className="ylate mono">LATE</span>}</span>
                <span className="yr-when mono">SINCE {dayLine(w.since)} · {up(until(w.since, now))}</span>
                <span className="yr-why">{w.fromWhom ? `From ${w.fromWhom}. ` : ''}{w.nudgeAfter ? `Nudge ${when(w.nudgeAfter)}.` : 'No nudge set.'}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ---------- recurring ----------

function RecurringView({ ship, onOpen, onBack }: { ship: ShipView; onOpen: (id: string) => void; onBack: () => void }) {
  const y = ship.data.yeoman;
  const now = nowOf(ship.data);
  const list = [...y.recurring].sort((a, b) => (a.nextDue ?? '9').localeCompare(b.nextDue ?? '9'));
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.calendar} title={`Recurring · ${list.length}`} back="‹ The list" onBack={onBack}
        sub={`FIRES EACH TIME, THEN CODE SETS THE NEXT DATE · SOONEST FIRST · ${sourceWord(ship)}`} />
      <div className="con-body">
        <ol className="yrows">
          {list.length === 0 && <li className="ynote">Nothing repeats yet.</li>}
          {list.map((c) => (
            <li key={c.id}>
              <button type="button" className="yrow yk-recurring" onClick={() => onOpen(c.id)}>
                <span className="yr-text">{c.text}</span>
                <span className="yr-when mono">{c.nextDue ? `NEXT ${up(when(c.nextDue))} · ${up(until(c.nextDue, now))}` : 'NEXT DATE NOT SET'}</span>
                <span className="yr-why">{ruleWords(c.rule)}.</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ---------- the done log ----------

export function DoneRow({ d, onOpen }: { d: Closed; onOpen: (id: string) => void }) {
  return (
    <li>
      <button type="button" className={`yd-row yh-${d.how}`} onClick={() => onOpen(d.id)}>
        <time className="mono" dateTime={d.closedAt}>{up(dayAndTime(d.closedAt))}</time>
        <span className="yd-how mono">{HOW_WORD[d.how] ?? up(d.how)}</span>
        <span className="yd-text">{d.text}</span>
        <span className="yd-kind mono">{up(KIND_WORD[d.kind])}</span>
      </button>
    </li>
  );
}

function DoneView({ ship, onOpen, onBack }: { ship: ShipView; onOpen: (id: string) => void; onBack: () => void }) {
  const done = ship.data.yeoman.done;
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.done} title={`Done log · ${done.length}`} back="‹ The list" onBack={onBack}
        sub={`WRITTEN BY CODE WHEN SOMETHING CLOSES · NEWEST FIRST · ${sourceWord(ship)}`} />
      <div className="con-body">
        {done.length === 0 && <p className="ynote">Nothing has closed yet.</p>}
        <ol className="ydone">{done.map((d) => <DoneRow key={d.id} d={d} onOpen={onOpen} />)}</ol>
      </div>
    </>
  );
}

// ---------- the in-tray: how to say it ----------

function SayView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  return (
    <>
      <ConHead icon={YEOMAN_ICONS.intray} title="The in-tray · how to say it" back="‹ The list" onBack={onBack}
        sub={`THE FIRST WORDS THE YEOMAN'S CODE LISTENS FOR · ANY SURFACE · ${sourceWord(ship)}`} />
      <div className="con-body">
        <ul className="ysay">
          {PHRASES.map((p) => (
            <li key={p.kind}>
              <span className="ys-kind mono">{up(p.kind)}</span>
              <q className="ys-say mono">{p.say}</q>
              <span className="ys-gets">{p.gets}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

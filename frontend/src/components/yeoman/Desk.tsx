// The Yeoman board's hands: tick boxes, the "!" star, due dates, edit, cancel, reopen, snooze,
// arrived, a new todo, and dragging a todo to another box or place. Each change goes to the
// Yeoman's desk as one action (lib/desk.ts); the Yeoman's own code applies it within a minute.
// Until the desk is on (the Yeoman patch in, the yeoman-desk service running) the controls show
// but are switched off, and the board reads only.
import { createContext, useContext, useState, type ReactNode } from 'react';
import { DESK_WORD, actionWord, canWrite, reopenable, type Action, type DeskState } from '../../lib/desk';
import { fromInputTime, toInputTime } from '../../lib/format';
import {
  BOX, FATIGUE, FATIGUE_WORD, URGENT_H, dueFits, fatigue, type Box, type DropPlan,
} from '../../lib/yeoman';
import type { Closed, Reminder, Todo, WaitingFor } from '../../types';

export interface DeskCtx {
  state: DeskState;
  /** Item ids (and new todos' action ids) with a change still waiting for the Yeoman. */
  pending: Set<string>;
  /** The list's own clock (asOf). */
  now: number;
  act: (actions: Action[]) => void;
  /** A todo dropped on a box (and before another todo, or at the end). */
  drop: (id: string, to: Box, before: string | null) => void;
  dragging: string | null;
  setDragging: (id: string | null) => void;
}

const NONE: DeskCtx = {
  state: 'sample', pending: new Set(), now: 0, act: () => {}, drop: () => {}, dragging: null, setDragging: () => {},
};
export const Desk = createContext<DeskCtx>(NONE);
export const useDesk = () => useContext(Desk);

const offTitle = (s: DeskState) => (canWrite(s) ? undefined : DESK_WORD[s].toLowerCase());

/** The tick box in front of a todo on the list. */
export function TickBox({ t }: { t: Todo }) {
  const d = useDesk();
  const on = canWrite(d.state);
  return (
    <button type="button" className="ytick" disabled={!on} title={offTitle(d.state) ?? 'Tick it off'}
      aria-label={`Tick off: ${t.text}`} onClick={() => d.act([{ op: 'tick', item: t.id }])}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="13" height="13" rx="2" /><path className="ytick-mark" d="M4 8.5l3 3 5-6" /></svg>
    </button>
  );
}

/** The "!" star after a todo: important or not, in one press. */
export function StarToggle({ t }: { t: Todo }) {
  const d = useDesk();
  const on = canWrite(d.state);
  return (
    <button type="button" className={'ystar' + (t.important ? ' on' : '')} disabled={!on} aria-pressed={t.important}
      title={offTitle(d.state) ?? (t.important ? 'Important. Press to mark it not important' : 'Not important. Press to mark it important')}
      aria-label={`${t.important ? 'Important' : 'Not important'}: ${t.text}`}
      onClick={() => d.act([{ op: 'important', item: t.id, value: !t.important }])}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.6l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.2l-3.9 2.2.9-4.3-3.3-3 4.4-.5z" /></svg>
    </button>
  );
}

/** The tag on a row whose change hasn't reached the Yeoman yet. */
export function PendingTag({ id }: { id: string }) {
  return useDesk().pending.has(id) ? <span className="ypending mono">WITH THE YEOMAN</span> : null;
}

/** The word for how loaded a box is: Clear, Light, Steady, then Heavy (amber, over 4) and Fatigue (red, over 8). */
export function FatigueTag({ n }: { n: number }) {
  const f = fatigue(n);
  const why = f === 'heavy' ? ` · OVER ${FATIGUE.warn}` : f === 'fatigue' ? ` · OVER ${FATIGUE.flag}` : '';
  return <span className={`yfat yfat-${f} mono`}>{FATIGUE_WORD[f]}{why}</span>;
}

/** Drag handlers for a todo row, and for the row as a place to drop another todo before. */
export function useRowDrag(t: Todo, box: Box) {
  const d = useDesk();
  const on = canWrite(d.state);
  const [over, setOver] = useState(false);
  return {
    over,
    props: on ? {
      draggable: true,
      onDragStart: (e: React.DragEvent) => { e.dataTransfer.setData('text/plain', t.id); e.dataTransfer.effectAllowed = 'move'; d.setDragging(t.id); },
      onDragEnd: () => { d.setDragging(null); setOver(false); },
      onDragOver: (e: React.DragEvent) => { if (d.dragging && d.dragging !== t.id) { e.preventDefault(); setOver(true); } },
      onDragLeave: () => setOver(false),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setOver(false);
        const id = e.dataTransfer.getData('text/plain') || d.dragging;
        d.setDragging(null);
        if (id && id !== t.id) d.drop(id, box, t.id);
      },
    } : {},
  };
}

/** Drop handlers for a whole box: a todo dropped here goes to the end of it. */
export function useBoxDrop(box: Box) {
  const d = useDesk();
  const [over, setOver] = useState(false);
  if (!canWrite(d.state)) return { over: false, props: {} };
  return {
    over,
    props: {
      onDragOver: (e: React.DragEvent) => { if (d.dragging) { e.preventDefault(); setOver(true); } },
      onDragLeave: (e: React.DragEvent) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setOver(false); },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault(); setOver(false);
        const id = e.dataTransfer.getData('text/plain') || d.dragging;
        d.setDragging(null);
        if (id) d.drop(id, box, null);
      },
    },
  };
}

// ---------- the drop dialog: a move that needs a due date ----------

export function DropDialog({ t, plan, now, onMove, onClose }: {
  t: Todo; plan: DropPlan; now: number; onMove: (due: string | null) => void; onClose: () => void;
}) {
  const [when, setWhen] = useState(plan.offer ? toInputTime(plan.offer) : '');
  const [mode, setMode] = useState<'none' | 'later'>('none');
  const iso = plan.due === 'clear' && mode === 'none' ? null : fromInputTime(when);
  const fits = plan.due === 'clear' && mode === 'none' ? true : !!iso && dueFits(iso, plan.to, now);
  const what = [
    plan.important === true ? 'marks it important' : plan.important === false ? 'marks it not important' : null,
    plan.due === 'set' ? `needs a due date within ${URGENT_H} hours` : `takes the due date away, or moves it more than ${URGENT_H} hours out`,
  ].filter(Boolean).join(', and ');
  return (
    <div className="ydialog" role="dialog" aria-modal="true" aria-label={`Move to ${BOX[plan.to].name}`}>
      <div className={`ydialog-card yb-${plan.to}`}>
        <span className="cb-head mono">MOVE TO {BOX[plan.to].name.toUpperCase()}</span>
        <p className="yd-what"><b>{t.text}</b></p>
        <p>Moving it {what}.</p>
        {plan.due === 'clear' && (
          <div className="yd-choice">
            <label><input type="radio" name="ydue" checked={mode === 'none'} onChange={() => setMode('none')} /> No due date</label>
            <label><input type="radio" name="ydue" checked={mode === 'later'} onChange={() => setMode('later')} /> A later date</label>
          </div>
        )}
        {(plan.due === 'set' || mode === 'later') && (
          <label className="yd-when mono">DUE <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} aria-label="Due date" /></label>
        )}
        {!fits && <p className="yd-warn mono">{plan.due === 'set' ? `PICK A TIME WITHIN ${URGENT_H} H, OR IT WON'T LAND IN ${BOX[plan.to].name.toUpperCase()}` : `PICK A TIME MORE THAN ${URGENT_H} H OUT`}</p>}
        <div className="yd-buttons">
          <button type="button" className="ybtn primary" disabled={!fits} onClick={() => onMove(iso)}>Move it</button>
          <button type="button" className="ybtn" onClick={onClose}>Keep it where it is</button>
        </div>
      </div>
    </div>
  );
}

// ---------- adding a todo ----------

export function AddTodo() {
  const d = useDesk();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [important, setImportant] = useState(false);
  const [when, setWhen] = useState('');
  const on = canWrite(d.state);
  if (!open) return (
    <button type="button" className="ybtn yadd-open" disabled={!on} title={offTitle(d.state)} onClick={() => setOpen(true)}>+ Add a todo</button>
  );
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    d.act([{ op: 'add', item: '', value: { text: text.trim(), important, due: when ? fromInputTime(when) : null } }]);
    setText(''); setImportant(false); setWhen(''); setOpen(false);
  };
  return (
    <form className="yadd" onSubmit={submit} aria-label="Add a todo">
      <input className="yadd-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs doing" aria-label="Todo text" autoFocus maxLength={2000} />
      <label className="yadd-imp mono"><input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} /> Important</label>
      <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} aria-label="Due date (optional)" />
      <button type="submit" className="ybtn primary" disabled={!text.trim()}>Add</button>
      <button type="button" className="ybtn" onClick={() => setOpen(false)}>Close</button>
    </form>
  );
}

// ---------- the action bar on one item ----------

function Confirm({ label, ask, yes, onYes }: { label: string; ask: string; yes: string; onYes: () => void }) {
  const d = useDesk();
  const [asking, setAsking] = useState(false);
  if (!asking) return <button type="button" className="ybtn danger" disabled={!canWrite(d.state)} onClick={() => setAsking(true)}>{label}</button>;
  return (
    <span className="yconfirm">
      <span className="mono">{ask}</span>
      <button type="button" className="ybtn danger" onClick={() => { setAsking(false); onYes(); }}>{yes}</button>
      <button type="button" className="ybtn" onClick={() => setAsking(false)}>Keep it</button>
    </span>
  );
}

function Bar({ children }: { children: ReactNode }) {
  const d = useDesk();
  return (
    <div className="yactions" role="group" aria-label="Change it">
      {children}
      {!canWrite(d.state) && <p className="ynote mono">{DESK_WORD[d.state]}</p>}
    </div>
  );
}

export function TodoActions({ t }: { t: Todo }) {
  const d = useDesk();
  const on = canWrite(d.state);
  const [when, setWhen] = useState(t.due ? toInputTime(t.due) : '');
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(t.text);
  const due = fromInputTime(when);
  return (
    <Bar>
      <div className="ya-row">
        <button type="button" className="ybtn primary" disabled={!on} onClick={() => d.act([{ op: 'tick', item: t.id }])}>Tick it off</button>
        <button type="button" className="ybtn" disabled={!on} aria-pressed={t.important}
          onClick={() => d.act([{ op: 'important', item: t.id, value: !t.important }])}>{t.important ? 'Not important' : 'Mark important'}</button>
        <button type="button" className="ybtn" disabled={!on} onClick={() => { setText(t.text); setEditing(!editing); }}>Edit text</button>
        <Confirm label="Cancel it" ask="CANCEL THIS TODO?" yes="Yes, cancel" onYes={() => d.act([{ op: 'cancel', item: t.id }])} />
      </div>
      <div className="ya-row">
        <label className="ya-when mono">DUE <input type="datetime-local" value={when} disabled={!on} onChange={(e) => setWhen(e.target.value)} aria-label="Due date" /></label>
        <button type="button" className="ybtn" disabled={!on || !due || due === t.due} onClick={() => due && d.act([{ op: 'due', item: t.id, value: due }])}>Set due date</button>
        <button type="button" className="ybtn" disabled={!on || !t.due} onClick={() => { setWhen(''); d.act([{ op: 'due', item: t.id, value: null }]); }}>No due date</button>
      </div>
      {editing && (
        <form className="ya-edit" onSubmit={(e) => { e.preventDefault(); if (text.trim() && text.trim() !== t.text) d.act([{ op: 'edit', item: t.id, value: text.trim() }]); setEditing(false); }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={2000} aria-label="Todo text" autoFocus />
          <button type="submit" className="ybtn primary" disabled={!text.trim()}>Save text</button>
        </form>
      )}
    </Bar>
  );
}

export function ReminderActions({ r }: { r: Reminder }) {
  const d = useDesk();
  const on = canWrite(d.state);
  const [when, setWhen] = useState('');
  const from = Math.max(Date.now(), Date.parse(r.dueAt));
  const stamp = (ms: number) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const tomorrow8 = (() => { const day = toInputTime(Date.now() + 86_400_000).slice(0, 10); return fromInputTime(`${day}T08:00`)!; })();
  const picked = fromInputTime(when);
  const snooze = (value: string) => d.act([{ op: 'snooze', item: r.id, value }]);
  return (
    <Bar>
      <div className="ya-row">
        <span className="mono ya-lead">SNOOZE</span>
        <button type="button" className="ybtn" disabled={!on} onClick={() => snooze(stamp(from + 3_600_000))}>+1 hour</button>
        <button type="button" className="ybtn" disabled={!on} onClick={() => snooze(tomorrow8)}>Tomorrow 08:00</button>
        <input type="datetime-local" value={when} disabled={!on} onChange={(e) => setWhen(e.target.value)} aria-label="Snooze until" />
        <button type="button" className="ybtn" disabled={!on || !picked} onClick={() => picked && snooze(picked)}>Snooze until then</button>
      </div>
      <div className="ya-row"><Confirm label="Cancel it" ask="CANCEL THIS REMINDER?" yes="Yes, cancel" onYes={() => d.act([{ op: 'cancel', item: r.id }])} /></div>
    </Bar>
  );
}

export function WaitingActions({ w }: { w: WaitingFor }) {
  const d = useDesk();
  return (
    <Bar>
      <div className="ya-row">
        <button type="button" className="ybtn primary" disabled={!canWrite(d.state)} onClick={() => d.act([{ op: 'arrived', item: w.id }])}>It arrived</button>
        <Confirm label="Stop waiting" ask="STOP WAITING FOR IT?" yes="Yes, cancel" onYes={() => d.act([{ op: 'cancel', item: w.id }])} />
      </div>
    </Bar>
  );
}

export function RecurringActions({ id }: { id: string }) {
  const d = useDesk();
  return (
    <Bar>
      <div className="ya-row"><Confirm label="Stop repeating" ask="STOP THIS RULE?" yes="Yes, stop it" onYes={() => d.act([{ op: 'cancel', item: id }])} /></div>
    </Bar>
  );
}

export function DoneActions({ c }: { c: Closed }) {
  const d = useDesk();
  if (!reopenable(c)) return null;
  return (
    <Bar>
      <div className="ya-row">
        <button type="button" className="ybtn" disabled={!canWrite(d.state)} onClick={() => d.act([{ op: 'reopen', item: c.id }])}>Reopen it</button>
        <span className="ynote">Puts it back on its list, as it was before it closed.</span>
      </div>
    </Bar>
  );
}

export { actionWord };

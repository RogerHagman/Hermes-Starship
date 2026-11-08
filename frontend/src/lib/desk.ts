// The Yeoman's desk: how the Yeoman board changes the Captain's list. Each change is one action
// posted to /desk/action (the yeoman-desk service on the NAS), which drops it into the Yeoman's
// inbox. The Yeoman's own code applies it on its timer, within about a minute, and the ship probe
// then shows the new list. Until then the board shows the change as pending, laid over the list
// the probe last read, so a tick or a drag lands at once on screen.
import type { Closed, DeskAction, DeskResult, Todo, YeomanFile } from '../types';

export type Op = DeskAction['op'];
export interface Action { op: Op; item: string; value?: DeskAction['value'] }

/** sample: the board shows the sample list, so nothing is sent. offline: no desk answers.
 *  no-inbox: the desk runs but the Yeoman patch hasn't made its inbox yet. on: changes reach the Yeoman. */
export type DeskState = 'sample' | 'checking' | 'offline' | 'no-inbox' | 'on';

export const DESK_WORD: Record<DeskState, string> = {
  sample: 'SAMPLE LIST · READ ONLY',
  checking: 'CHECKING THE DESK',
  offline: 'DESK OFFLINE · READ ONLY',
  'no-inbox': 'DESK WAITING FOR THE YEOMAN PATCH · READ ONLY',
  on: 'DESK ON · CHANGES REACH THE YEOMAN WITHIN A MINUTE',
};

export const canWrite = (s: DeskState) => s === 'on';

export async function deskHealth(fetcher: typeof fetch = fetch): Promise<DeskState> {
  try {
    const res = await fetcher('desk/health', { cache: 'no-store' });
    if (!res.ok) return 'offline';
    const body = (await res.json()) as { inbox?: boolean };
    return body.inbox ? 'on' : 'no-inbox';
  } catch {
    return 'offline';
  }
}

export type Sent = { ok: true; action: DeskAction } | { ok: false; error: string };

/** Post one action. On success the action comes back with the id and time the desk gave it. */
export async function sendAction(a: Action, fetcher: typeof fetch = fetch): Promise<Sent> {
  try {
    const res = await fetcher('desk/action', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: null, ...a }),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; at?: string; error?: string };
    if (res.status === 202 && body.id && body.at) return { ok: true, action: { id: body.id, at: body.at, op: a.op, item: a.item, value: a.value ?? null } };
    return { ok: false, error: body.error ?? `the desk answered ${res.status}` };
  } catch {
    return { ok: false, error: 'the desk did not answer' };
  }
}

/** The actions still waiting for the Yeoman: the ones this page sent that have no result yet, and
 *  the ones the probe saw in the inbox (from another tab, say). Oldest first, each id once. */
export function outstanding(sent: DeskAction[], y: YeomanFile): DeskAction[] {
  const done = new Set((y.desk?.results ?? []).map((r) => r.id));
  const out = new Map<string, DeskAction>();
  for (const a of [...(y.desk?.pending ?? []), ...sent]) if (!done.has(a.id)) out.set(a.id, a);
  return [...out.values()].sort((a, b) => a.at.localeCompare(b.at));
}

/** The results for actions this page sent that the Yeoman refused. */
export function refused(sent: DeskAction[], y: YeomanFile): DeskResult[] {
  const mine = new Set(sent.map((a) => a.id));
  return (y.desk?.results ?? []).filter((r) => !r.ok && mine.has(r.id));
}

const isTime = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(v);

/** The list as it will be once the Yeoman has applied these actions. Ids touched are returned too,
 *  so the board can mark them pending. An action on an item that isn't there changes nothing. */
export function withPending(y: YeomanFile, actions: DeskAction[]): { list: YeomanFile; pending: Set<string> } {
  if (actions.length === 0) return { list: y, pending: new Set() };
  const list: YeomanFile = {
    ...y, todos: y.todos.map((t) => ({ ...t })), reminders: y.reminders.map((r) => ({ ...r })),
    waiting: [...y.waiting], recurring: [...y.recurring], done: [...y.done],
  };
  const pending = new Set<string>();
  const close = (id: string, at: string, how: string) => {
    const found = ([['todo', list.todos], ['reminder', list.reminders], ['waiting', list.waiting], ['recurring', list.recurring]] as const)
      .map(([kind, rows]) => ({ kind, rows: rows as { id: string; text?: string; what?: string }[] }))
      .find(({ rows }) => rows.some((r) => r.id === id));
    if (!found) return;
    const row = found.rows.find((r) => r.id === id)!;
    found.rows.splice(found.rows.indexOf(row), 1);
    list.done.unshift({ id, kind: found.kind, text: row.text ?? row.what ?? '', closedAt: at, how });
  };
  for (const a of actions) {
    const todo = list.todos.find((t) => t.id === a.item);
    pending.add(a.op === 'add' ? a.id : a.item);
    switch (a.op) {
      case 'tick': close(a.item, a.at, 'ticked'); break;
      case 'cancel': close(a.item, a.at, 'cancelled'); break;
      case 'arrived': close(a.item, a.at, 'arrived'); break;
      case 'reopen': {
        const d = list.done.find((x) => x.id === a.item);
        if (!d) break;
        list.done = list.done.filter((x) => x !== d);
        reopen(list, d);
        break;
      }
      case 'important': if (todo && typeof a.value === 'boolean') todo.important = a.value; break;
      case 'due':
        if (todo && isTime(a.value)) todo.due = a.value;
        else if (todo && a.value === null) delete todo.due;
        break;
      case 'edit': if (todo && typeof a.value === 'string') todo.text = a.value; break;
      case 'rank': if (todo && typeof a.value === 'number') todo.rank = a.value; break;
      case 'snooze': {
        const r = list.reminders.find((x) => x.id === a.item);
        if (r && isTime(a.value)) { r.dueAt = a.value; r.status = 'snoozed'; }
        break;
      }
      case 'add': {
        const v = a.value as { text?: string; important?: boolean; due?: string | null } | null;
        if (!v?.text) break;
        const t: Todo = { id: a.id, text: v.text, addedAt: a.at, important: !!v.important };
        if (isTime(v.due)) t.due = v.due;
        list.todos.push(t);
        break;
      }
    }
  }
  return { list, pending };
}

/** A closed item back on its own list, as near as the done log can tell. The Yeoman's code has the full row. */
function reopen(list: YeomanFile, d: Closed) {
  if (d.kind === 'todo') list.todos.push({ id: d.id, text: d.text, addedAt: d.closedAt, important: false });
  else if (d.kind === 'waiting') list.waiting.push({ id: d.id, what: d.text, since: d.closedAt });
  else if (d.kind === 'recurring') list.recurring.push({ id: d.id, text: d.text, rule: '' });
  else list.reminders.push({ id: d.id, text: d.text, dueAt: d.closedAt, status: 'open' });
}

/** What the Yeoman can reopen from the done log: anything but a reminder that already fired. */
export const reopenable = (d: Closed) => !(d.kind === 'reminder' && d.how === 'fired');

/** A short line for a toast or a pending tag: "Marked done", "Marked important", ... */
export function actionWord(a: { op: string; value?: unknown }): string {
  switch (a.op) {
    case 'tick': return 'Marked done';
    case 'cancel': return 'Cancelled';
    case 'reopen': return 'Reopened';
    case 'arrived': return 'Marked arrived';
    case 'important': return a.value ? 'Marked important' : 'Marked not important';
    case 'due': return a.value ? 'Due date set' : 'Due date cleared';
    case 'snooze': return 'Snoozed';
    case 'edit': return 'Text changed';
    case 'rank': return 'Moved in the box';
    case 'add': return 'Added';
    default: return a.op;
  }
}

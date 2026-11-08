// The Yeoman's post (Deck 2), by the Captain's door: where things are in the picture
// (assets/yeoman.svg, a 1600 x 740 box, drawn by tools/make_yeoman_svg.py), and the Yeoman's list
// worked out the way its code does it: urgent = due within 48 hours (or past), important = the
// Captain's "!". Every time is measured from the list's own asOf, so the page reads the same
// whenever it is opened. The list is live/yeoman.json from the ship probe, else the sample.
import { dayAndTime, dayKey, dayLine, fromInputTime } from './format';
import type { Closed, Fixtures, Recurring, Reminder, Todo, WaitingFor, YeomanFile } from '../types';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the wall screen. */
export type YeomanObject = 'bridge' | 'clock' | 'calendar' | 'waiting' | 'chime' | 'done' | 'door' | 'intray' | 'desk';

export const SPOTS: { id: YeomanObject; box: [number, number, number, number]; label: [number, number] }[] = [
  { id: 'bridge',   box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'clock',    box: [160, 50, 144, 144],  label: [232, 16] },
  { id: 'calendar', box: [166, 218, 156, 200], label: [244, 452] },
  { id: 'waiting',  box: [328, 118, 192, 316], label: [424, 476] },
  { id: 'chime',    box: [1272, 64, 116, 198], label: [1330, 40] },
  { id: 'done',     box: [1266, 294, 128, 272], label: [1330, 584] },
  { id: 'door',     box: [1400, 96, 188, 468], label: [1494, 500] },
  { id: 'intray',   box: [194, 580, 166, 130], label: [276, 566] },
  { id: 'desk',     box: [1056, 580, 196, 140], label: [1154, 566] },
];

/** The matrix on the desk top, where the page lays a count per box. */
export const TABLE = { x: 392, y: 600, w: 640, h: 100 };
/** The wall screen, where the page lays the views. */
export const SCREEN = { x: 536, y: 40, w: 716, h: 456 };

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

// ---------- the matrix ----------

export type Box = 'first' | 'schedule' | 'delegate' | 'drop';
export const BOXES: Box[] = ['first', 'schedule', 'delegate', 'drop'];
export const BOX: Record<Box, { name: string; rule: string; help: string; route: string }> = {
  first: { name: 'Do first', rule: 'URGENT · IMPORTANT', help: 'Only you can do these, and soon.',
    route: 'Stays with you. The Yeoman ticks it off when you say so.' },
  schedule: { name: 'Schedule', rule: 'IMPORTANT · NOT URGENT', help: 'Navigation finds a slot.',
    route: 'Navigation proposes a time from your free slots. Booking anything outside the ship waits for your OK.' },
  delegate: { name: 'Delegate', rule: 'URGENT · NOT IMPORTANT', help: 'Handed to the owning station.',
    route: 'Goes out as a card to the owning station, titled with its ORD. The Yeoman keeps only the reminder.' },
  drop: { name: "Don't do", rule: 'NEITHER', help: 'Suggested only. Nothing goes without your yes.',
    route: 'Nothing happens to it on its own. Drop it, or give it a due date or a "!" and it moves box.' },
};

/** Urgent: due within this many hours, or already past. */
export const URGENT_H = 48;
const HOUR = 3_600_000;

/** The moment the list was read: every "in 3 h" and "overdue" is measured from it. */
export const nowOf = (data: Fixtures) => Date.parse(data.yeoman.asOf);

export function urgent(t: Todo, now: number): boolean {
  return !!t.due && Date.parse(t.due) - now <= URGENT_H * HOUR;
}

export function boxOf(t: Todo, now: number): Box {
  const u = urgent(t, now);
  if (u && t.important) return 'first';
  if (t.important) return 'schedule';
  return u ? 'delegate' : 'drop';
}

/** How far a time is from now, short: in 40 min, in 5 h, in 3 days, 2 h ago. */
export function until(iso: string, now: number): string {
  const ms = Date.parse(iso) - now;
  const m = Math.round(Math.abs(ms) / 60_000);
  const span = m < 60 ? `${Math.max(1, m)} min` : m < 48 * 60 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} days`;
  return ms >= 0 ? `in ${span}` : `${span} ago`;
}

/** Why a todo sits in its box, in the Yeoman's own two questions. */
export function why(t: Todo, now: number): string {
  const due = !t.due ? 'No due date'
    : Date.parse(t.due) < now ? `Overdue since ${dayLine(t.due)}`
    : urgent(t, now) ? `Due ${until(t.due, now)}, within ${URGENT_H} h`
    : `Due ${dayLine(t.due)}, more than ${URGENT_H} h away`;
  return `${due}, ${t.important ? 'marked "!"' : 'no "!"'}.`;
}

/** What would move it to another box. */
export function moveHint(t: Todo, now: number): string {
  switch (boxOf(t, now)) {
    case 'drop': return 'A due date within 48 hours makes it Delegate. A "!" makes it Schedule. Both make it Do first.';
    case 'delegate': return 'A "!" makes it Do first.';
    case 'schedule': return 'It becomes Do first by itself once the due date is within 48 hours.';
    default: return 'It stays here until it is ticked off.';
  }
}

/** The open todos in each box: the Captain's own order first (rank, set by dragging), then the soonest due, then the oldest. */
export function matrix(y: YeomanFile, now: number): Record<Box, Todo[]> {
  const out: Record<Box, Todo[]> = { first: [], schedule: [], delegate: [], drop: [] };
  for (const t of y.todos) out[boxOf(t, now)].push(t);
  const rank = (t: Todo) => t.rank ?? Number.POSITIVE_INFINITY;
  for (const b of BOXES) out[b].sort((a, c) => (rank(a) - rank(c)) || (a.due ?? '9').localeCompare(c.due ?? '9') || a.addedAt.localeCompare(c.addedAt));
  return out;
}

// ---------- task fatigue ----------

/** Five words for how loaded a box (or the whole list) is. Heavy is amber, Fatigue red; the rest are calm. */
export type Fatigue = 'clear' | 'light' | 'steady' | 'heavy' | 'fatigue';
export const FATIGUE_WORD: Record<Fatigue, string> = { clear: 'CLEAR', light: 'LIGHT', steady: 'STEADY', heavy: 'HEAVY', fatigue: 'FATIGUE' };
/** A box: up to 2 is light, up to 4 steady, more than FATIGUE.warn heavy (amber), more than FATIGUE.flag fatigue (red). */
export const FATIGUE = { light: 2, warn: 4, flag: 8 };
export const flagged = (f: Fatigue) => f === 'heavy' || f === 'fatigue';

export function fatigue(n: number): Fatigue {
  return n === 0 ? 'clear' : n <= FATIGUE.light ? 'light' : n <= FATIGUE.warn ? 'steady' : n <= FATIGUE.flag ? 'heavy' : 'fatigue';
}

/** The weighted load of the whole list: each todo counts by its box, Do first the most, Don't do the least,
 *  and an overdue todo counts OVERDUE_WEIGHT whatever its box. The box weights average 1, so the score
 *  reads like a count of todos (four in every box, none overdue, is 16). */
export const LOAD_WEIGHT: Record<Box, number> = { first: 1.5, schedule: 1.25, delegate: 0.75, drop: 0.5 };
export const OVERDUE_WEIGHT = 2;
/** The whole list: 0 is clear, up to LOAD.light light, up to LOAD.warn steady, up to LOAD.flag heavy (amber), more is fatigue (red). */
export const LOAD = { light: 4, warn: 8, flag: 16 };

export interface Load { score: number; level: Fatigue; parts: { box: Box; n: number; weight: number }[]; overdue: number }

export function load(m: Record<Box, Todo[]>, now: number): Load {
  const late = (t: Todo) => !!t.due && Date.parse(t.due) < now;
  const parts = BOXES.map((box) => ({ box, n: m[box].filter((t) => !late(t)).length, weight: LOAD_WEIGHT[box] }));
  const overdue = BOXES.reduce((n, b) => n + m[b].filter(late).length, 0);
  const score = Math.round((parts.reduce((sum, p) => sum + p.n * p.weight, 0) + overdue * OVERDUE_WEIGHT) * 100) / 100;
  const level: Fatigue = score === 0 ? 'clear' : score <= LOAD.light ? 'light' : score <= LOAD.warn ? 'steady' : score <= LOAD.flag ? 'heavy' : 'fatigue';
  return { score, level, parts, overdue };
}

/** The boxes that are over the line, worst first. */
export function fatigued(m: Record<Box, Todo[]>): { box: Box; n: number; level: Fatigue }[] {
  return BOXES.map((box) => ({ box, n: m[box].length, level: fatigue(m[box].length) }))
    .filter((x) => flagged(x.level))
    .sort((a, b) => b.n - a.n);
}

// ---------- moving todos on the board ----------

export const URGENT_BOX: Record<Box, boolean> = { first: true, schedule: false, delegate: true, drop: false };
export const IMPORTANT_BOX: Record<Box, boolean> = { first: true, schedule: true, delegate: false, drop: false };

/** What a drop into another box changes. due: 'set' needs a date within 48 hours (one is offered),
 *  'clear' needs the date gone or moved past 48 hours (no date is offered), null leaves it. */
export interface DropPlan { to: Box; important: boolean | null; due: 'set' | 'clear' | null; offer: string | null }

export function dropPlan(t: Todo, to: Box, now: number): DropPlan | null {
  const from = boxOf(t, now);
  if (from === to) return null;
  const important = IMPORTANT_BOX[from] === IMPORTANT_BOX[to] ? null : IMPORTANT_BOX[to];
  const u = urgent(t, now);
  const due = URGENT_BOX[to] === u ? null : URGENT_BOX[to] ? 'set' : 'clear';
  return { to, important, due, offer: due === 'set' ? endOfTomorrow(now) : null };
}

/** The offered due date for something made urgent: tomorrow at 23:59, ship's time. Always within 48 hours. */
export function endOfTomorrow(now: number): string {
  const [y, m, d] = dayKey(new Date(now)).split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d + 1, 12)).toISOString().slice(0, 10);
  return fromInputTime(`${day}T23:59`)!;
}

/** Whether a due date picked in the drop dialog lands the todo in the box it was dropped on. */
export function dueFits(iso: string | null, to: Box, now: number): boolean {
  const u = !!iso && Date.parse(iso) - now <= URGENT_H * HOUR;
  return u === URGENT_BOX[to];
}

/** The new ranks for a box after a todo is placed before another one (or at the end): 10, 20, 30...
 *  Only the todos whose rank changes are returned. */
export function reorder(list: Todo[], moved: Todo, before: string | null): { id: string; rank: number }[] {
  const rest = list.filter((t) => t.id !== moved.id);
  const at = before === null ? rest.length : Math.max(0, rest.findIndex((t) => t.id === before));
  const order = [...rest.slice(0, at), moved, ...rest.slice(at)];
  return order.map((t, i) => ({ id: t.id, rank: (i + 1) * 10 })).filter((x, i) => order[i].rank !== x.rank);
}

// ---------- the next 48 hours ----------

export type Kind = 'todo' | 'reminder' | 'waiting' | 'recurring';
export const KIND_WORD: Record<Kind, string> = { todo: 'To do', reminder: 'Reminder', waiting: 'Waiting for', recurring: 'Recurring' };

export interface Mark { id: string; kind: Kind; at: string; text: string; box?: Box; snoozed?: boolean }

/** Everything that falls due in the next 48 hours, soonest first: reminders, todo dues, nudges, recurring dates. */
export function next48(y: YeomanFile, now: number): Mark[] {
  const end = now + URGENT_H * HOUR;
  const inside = (iso?: string) => !!iso && Date.parse(iso) >= now && Date.parse(iso) <= end;
  const marks: Mark[] = [
    ...y.reminders.filter((r) => inside(r.dueAt)).map((r) => ({ id: r.id, kind: 'reminder' as const, at: r.dueAt, text: r.text, snoozed: r.status === 'snoozed' })),
    ...y.todos.filter((t) => inside(t.due)).map((t) => ({ id: t.id, kind: 'todo' as const, at: t.due!, text: t.text, box: boxOf(t, now) })),
    ...y.waiting.filter((w) => inside(w.nudgeAfter)).map((w) => ({ id: w.id, kind: 'waiting' as const, at: w.nudgeAfter!, text: w.what })),
    ...y.recurring.filter((r) => inside(r.nextDue)).map((r) => ({ id: r.id, kind: 'recurring' as const, at: r.nextDue!, text: r.text })),
  ];
  return marks.sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
}

/** Where a time sits on the 48-hour line, 0 to 1. */
export const along = (iso: string, now: number) => Math.min(1, Math.max(0, (Date.parse(iso) - now) / (URGENT_H * HOUR)));

/** Todos already past their due date. */
export const overdue = (y: YeomanFile, now: number) => y.todos.filter((t) => t.due && Date.parse(t.due) < now);

// ---------- reminders, waiting, recurring, the done log ----------

/** A waiting-for is late once its nudge time has passed. */
export const late = (w: WaitingFor, now: number) => !!w.nudgeAfter && Date.parse(w.nudgeAfter) <= now;

/** A recurring rule in words: monthly:25 is "Every month on the 25th". */
export function ruleWords(rule: string): string {
  // The probe adds the local time after a space: "weekly:wed 10:00", "daily 07:30".
  const [head, time] = rule.trim().split(/\s+/);
  const [kind, arg = ''] = head.split(':');
  const at = time ? ` at ${time}` : '';
  const nth = (n: string) => { const v = Number(n); const s = v % 10 === 1 && v !== 11 ? 'st' : v % 10 === 2 && v !== 12 ? 'nd' : v % 10 === 3 && v !== 13 ? 'rd' : 'th'; return `${v}${s}`; };
  const DAYS: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (kind === 'daily' && !arg) return `Every day${at}`;
  if (kind === 'weekly' && DAYS[arg]) return `Every ${DAYS[arg]}${at}`;
  if (kind === 'monthly' && /^\d+$/.test(arg)) return `Every month on the ${nth(arg)}${at}`;
  if (kind === 'yearly' && /^\d\d-\d\d$/.test(arg)) { const [mm, dd] = arg.split('-'); return `Every year on ${Number(dd)} ${MONTHS[Number(mm) - 1] ?? mm}${at}`; }
  return rule;
}

export const HOW_WORD: Record<string, string> = { ticked: 'TICKED', fired: 'FIRED', arrived: 'ARRIVED', cancelled: 'CANCELLED', canceled: 'CANCELLED', done: 'DONE' };

/** How long ago the Yeoman's timer last beat, in minutes, or null when the list doesn't say. */
export function heartbeat(y: YeomanFile): number | null {
  return y.heartbeat ? Math.max(0, Math.round((Date.parse(y.asOf) - Date.parse(y.heartbeat)) / 60_000)) : null;
}

/** The timer beats about once a minute; older than this and reminders may not fire. */
export const BEAT_STALE_MIN = 5;

export interface Week { added: number; closed: number; how: Record<string, number>; days: { key: string; label: string; n: number }[] }

/** The last 7 ship's days: todos added, and what closed, and how. */
export function week(y: YeomanFile): Week {
  const [yy, mm, dd] = dayKey(y.asOf).split('-').map(Number);
  const days = Array.from({ length: 7 }, (_, i) => {
    const t = new Date(Date.UTC(yy, mm - 1, dd - 6 + i, 12));
    return { key: t.toISOString().slice(0, 10), n: 0,
      label: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(t).toUpperCase() };
  });
  const keys = new Set(days.map((d) => d.key));
  const out: Week = { added: 0, closed: 0, how: {}, days };
  for (const t of y.todos) if (keys.has(dayKey(t.addedAt))) out.added += 1;
  for (const d of y.done) {
    const k = dayKey(d.closedAt);
    if (!keys.has(k)) continue;
    out.closed += 1;
    out.how[d.how] = (out.how[d.how] ?? 0) + 1;
    days.find((x) => x.key === k)!.n += 1;
  }
  return out;
}

/** One line for any item on the list, wherever it lives. */
export type AnyItem = { kind: 'todo'; item: Todo } | { kind: 'reminder'; item: Reminder } | { kind: 'waiting'; item: WaitingFor }
  | { kind: 'recurring'; item: Recurring } | { kind: 'done'; item: Closed };

export function findItem(y: YeomanFile, id: string): AnyItem | undefined {
  const t = y.todos.find((x) => x.id === id); if (t) return { kind: 'todo', item: t };
  const r = y.reminders.find((x) => x.id === id); if (r) return { kind: 'reminder', item: r };
  const w = y.waiting.find((x) => x.id === id); if (w) return { kind: 'waiting', item: w };
  const c = y.recurring.find((x) => x.id === id); if (c) return { kind: 'recurring', item: c };
  const d = y.done.find((x) => x.id === id); if (d) return { kind: 'done', item: d };
  return undefined;
}

/** How to say it. "remind me…", "todo…" and "yeoman…" go straight to the Yeoman (patch P); a "!" after todo marks it important. */
export const PHRASES: { kind: string; say: string; gets: string }[] = [
  { kind: 'To do', say: 'todo book winter tires', gets: 'A todo with no date and no "!": it starts in Don\'t do until you give it one.' },
  { kind: 'Important', say: 'todo! pay the electricity bill by tonight', gets: 'The "!" marks it important. With a due date inside 48 hours it is Do first.' },
  { kind: 'Reminder', say: 'remind me tomorrow 07:30 to answer the housing association', gets: 'Code sets the time and fires it. The model never decides when.' },
  { kind: 'Waiting for', say: 'yeoman: waiting for the landlord to answer about the lease', gets: 'The word "yeoman" sends it straight to the Yeoman. It stays on the waiting list until you say it arrived, with one nudge if you set a day.' },
  { kind: 'Recurring', say: 'remind me every month on the 25th to pay the rent', gets: 'Fires each time, then code sets the next date.' },
  { kind: 'The list', say: "yeoman: what's on my list?", gets: 'The four boxes, waiting for and the next reminders, worked out by code.' },
];

export const when = (iso: string) => `${dayLine(iso)} · ${dayAndTime(iso).split(' ')[1]}`;

/** 24 x 24 line icons for the room's things. */
export const YEOMAN_ICONS: Record<YeomanObject | 'ease' | 'item' | 'box', string> = {
  ease: 'M8 4h8v3H8z M6 5H5v16h14V5h-1 M8 12l2 2 4-4 M8 17h8',
  item: 'M6 3h9l3 3v15H6z M9 9h6 M9 13h6 M9 17h4',
  box: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  calendar: 'M4 6h16v15H4z M4 10h16 M8 3v5 M16 3v5 M8 14h2 M12 14h2 M16 14h2 M8 17h2',
  waiting: 'M4 6h16v12H4z M4 7l8 6 8-6',
  chime: 'M6 17V11a6 6 0 0 1 12 0v6l2 2H4z M10 21h4',
  done: 'M5 4h14v5H5z M5 11h14v9H5z M10 6.5h4 M10 14h4',
  door: 'M5 21V4h14v17 M9 12h.01 M3 21h18',
  intray: 'M4 13l2-8h12l2 8v6H4z M4 13h5l1 2h4l1-2h5',
  desk: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  bridge: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M12 3v18',
};

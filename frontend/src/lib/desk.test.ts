// The Yeoman's desk: what the board sends, and the list as it will be once the Yeoman has applied it.
import { describe, expect, it, vi } from 'vitest';
import yeoman from '../../../fixtures/yeoman.json';
import type { DeskAction, YeomanFile } from '../types';
import { deskHealth, outstanding, refused, sendAction, withPending } from './desk';
import { fromInputTime, toInputTime } from './format';
import {
  FATIGUE, LOAD, boxOf, dropPlan, dueFits, endOfTomorrow, fatigue, fatigued, load, matrix, reorder,
} from './yeoman';

const y = yeoman as unknown as YeomanFile;
const now = Date.parse(y.asOf);   // 2026-11-04T19:30:00Z
const act = (id: string, op: DeskAction['op'], item: string, value: DeskAction['value'] = null, at = '2026-11-04T19:31:00Z'): DeskAction =>
  ({ id, at, op, item, value });
const todo = (id: string, l: YeomanFile = y) => l.todos.find((t) => t.id === id)!;

describe('the list with the pending changes laid over it', () => {
  it('a tick or a cancel moves the item to the done log at once', () => {
    const { list, pending } = withPending(y, [act('b-1', 'tick', 'todo-901'), act('b-2', 'cancel', 'todo-909')]);
    expect(list.todos.map((t) => t.id)).not.toContain('todo-901');
    expect(list.done.slice(0, 2).map((d) => [d.id, d.how])).toEqual([['todo-909', 'cancelled'], ['todo-901', 'ticked']]);
    expect([...pending]).toEqual(['todo-901', 'todo-909']);
    expect(y.todos.map((t) => t.id)).toContain('todo-901');   // the list the probe read is left alone
  });
  it('important, due, edit and rank change the todo, and move its box', () => {
    const before = boxOf(todo('todo-908'), now);
    const { list } = withPending(y, [
      act('b-1', 'important', 'todo-908', true), act('b-2', 'due', 'todo-908', '2026-11-05T12:00:00Z'),
      act('b-3', 'edit', 'todo-908', 'Write the cover letter'), act('b-4', 'rank', 'todo-908', 10),
      act('b-5', 'due', 'todo-901', null),
    ]);
    const t = todo('todo-908', list);
    expect([before, boxOf(t, now)]).toEqual(['drop', 'first']);
    expect([t.text, t.rank]).toEqual(['Write the cover letter', 10]);
    expect(todo('todo-901', list).due).toBeUndefined();
  });
  it('add makes a new todo under the action id; snooze, arrived and reopen work on their lists', () => {
    const r = y.reminders[0];
    const w = y.waiting[0];
    const d = y.done.find((x) => x.kind === 'todo')!;
    const { list, pending } = withPending(y, [
      act('b-9', 'add', '', { text: 'Buy coffee filters', important: true, due: null }),
      act('b-10', 'snooze', r.id, '2026-11-05T08:00:00Z'), act('b-11', 'arrived', w.id), act('b-12', 'reopen', d.id),
    ]);
    expect(todo('b-9', list)).toMatchObject({ text: 'Buy coffee filters', important: true, addedAt: '2026-11-04T19:31:00Z' });
    expect(list.reminders.find((x) => x.id === r.id)).toMatchObject({ dueAt: '2026-11-05T08:00:00Z', status: 'snoozed' });
    expect(list.waiting.find((x) => x.id === w.id)).toBeUndefined();
    expect(list.done.find((x) => x.id === w.id)?.how).toBe('arrived');
    expect(todo(d.id, list).text).toBe(d.text);
    expect(pending.has('b-9')).toBe(true);
  });
  it('an action on an item that is not there changes nothing', () => {
    const { list } = withPending(y, [act('b-1', 'tick', 'todo-000'), act('b-2', 'important', 'todo-000', true)]);
    expect(list.todos).toHaveLength(y.todos.length);
  });
});

describe('what is still with the Yeoman', () => {
  const desk = (pending: DeskAction[], results: { id: string; ok: boolean; error?: string }[]): YeomanFile =>
    ({ ...y, desk: { pending, results: results.map((r) => ({ op: 'tick', item: 'x', ...r })) } });
  it('sent and seen in the inbox count once; anything with a result is done', () => {
    const a = act('b-1', 'tick', 'todo-901', null, '2026-11-04T19:31:00Z');
    const b = act('b-2', 'tick', 'todo-902', null, '2026-11-04T19:30:30Z');
    const c = act('b-3', 'tick', 'todo-903');
    expect(outstanding([a, c], desk([a, b], [{ id: 'b-3', ok: true }])).map((x) => x.id)).toEqual(['b-2', 'b-1']);
  });
  it('refusals are only the ones this page sent', () => {
    const l = desk([], [{ id: 'b-1', ok: false, error: 'no such item' }, { id: 'b-7', ok: false, error: 'x' }, { id: 'b-2', ok: true }]);
    expect(refused([act('b-1', 'tick', 'x'), act('b-2', 'tick', 'y')], l).map((r) => r.error)).toEqual(['no such item']);
  });
});

describe('talking to the desk', () => {
  const answer = (status: number, body: unknown) => vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;
  it('health: on, waiting for the patch, or offline', async () => {
    expect(await deskHealth(answer(200, { inbox: true, pending: 0 }))).toBe('on');
    expect(await deskHealth(answer(200, { inbox: false }))).toBe('no-inbox');
    expect(await deskHealth(answer(502, {}))).toBe('offline');
    expect(await deskHealth((async () => { throw new Error('down'); }) as unknown as typeof fetch)).toBe('offline');
  });
  it('an action is posted as JSON and comes back with its id', async () => {
    const f = answer(202, { id: 'b-1', at: '2026-11-08T16:00:00Z' });
    const out = await sendAction({ op: 'important', item: 'todo-901', value: false }, f);
    expect(out).toEqual({ ok: true, action: { id: 'b-1', at: '2026-11-08T16:00:00Z', op: 'important', item: 'todo-901', value: false } });
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect([url, init.method, (init.headers as Record<string, string>)['Content-Type']]).toEqual(['desk/action', 'POST', 'application/json']);
    expect(JSON.parse(init.body as string)).toEqual({ op: 'important', item: 'todo-901', value: false });
    expect(await sendAction({ op: 'tick', item: 'x' }, answer(400, { error: 'bad item id' }))).toEqual({ ok: false, error: 'bad item id' });
  });
});

describe('task fatigue', () => {
  it('every box has a word: clear, light, steady, then heavy over 4 and fatigue over 8', () => {
    expect([0, 1, 2, 3, 4, 5, 8, 9].map(fatigue)).toEqual(['clear', 'light', 'light', 'steady', 'steady', 'heavy', 'heavy', 'fatigue']);
    expect(FATIGUE).toEqual({ light: 2, warn: 4, flag: 8 });
    expect(fatigued(matrix(y, now))).toEqual([]);   // nothing over 4 in the sample
  });
  it('the weighted load reads like a count: four in every box is 16, on the edge', () => {
    const m = matrix(y, now);
    expect(load(m, now)).toMatchObject({ score: 8.5, level: 'heavy', overdue: 0 });
    expect(load({ first: [], schedule: [], delegate: [], drop: [] }, now).level).toBe('clear');
    expect(load({ ...m, first: [], schedule: [], delegate: [] }, now)).toMatchObject({ score: 1.5, level: 'light' });   // 2 × 1.5 + 2 × 1.25 + 2 × 0.75 + 3 × 0.5
    const four = Object.fromEntries((['first', 'schedule', 'delegate', 'drop'] as const).map((b) => [b, y.todos.slice(0, 4)])) as typeof m;
    expect(load(four, now)).toMatchObject({ score: 16, level: 'heavy' });
    expect(LOAD).toEqual({ light: 4, warn: 8, flag: 16 });
    const heavy = { ...four, first: y.todos.slice(0, 9) };
    expect(load(heavy, now).level).toBe('fatigue');
    expect(fatigued(heavy)[0]).toEqual({ box: 'first', n: 9, level: 'fatigue' });
  });
  it('an overdue todo counts 2, whatever its box', () => {
    const late = { ...y, todos: y.todos.map((t) => (t.id === 'todo-906' ? { ...t, due: '2026-11-04T10:00:00Z' } : t)) };   // Delegate, 0.75 -> 2
    expect(load(matrix(late, now), now)).toMatchObject({ score: 9.75, overdue: 1 });
  });
});

describe('moving a todo on the board', () => {
  it('into an urgent box asks for a date within 48 hours, offering tomorrow at 23:59', () => {
    const plan = dropPlan(todo('todo-908'), 'first', now)!;   // Don't do -> Do first
    expect(plan).toEqual({ to: 'first', important: true, due: 'set', offer: endOfTomorrow(now) });
    expect(toInputTime(plan.offer!)).toBe('2026-11-05T23:59');
    expect(dueFits(plan.offer, 'first', now)).toBe(true);
  });
  it('out of an urgent box clears the date; no date at all fits', () => {
    const plan = dropPlan(todo('todo-906'), 'drop', now)!;   // Delegate -> Don't do
    expect(plan).toEqual({ to: 'drop', important: null, due: 'clear', offer: null });
    expect(dueFits(null, 'drop', now)).toBe(true);
    expect(dueFits('2026-11-05T09:00:00Z', 'drop', now)).toBe(false);
  });
  it('across the important line only flips the "!"; the same box needs nothing', () => {
    expect(dropPlan(todo('todo-907'), 'schedule', now)).toEqual({ to: 'schedule', important: true, due: null, offer: null });
    expect(dropPlan(todo('todo-907'), 'drop', now)).toBeNull();
  });
  it('placing a todo before another ranks the box 10, 20, 30, and only sends what changed', () => {
    const drop = matrix(y, now).drop;
    const last = drop[drop.length - 1];
    expect(reorder(drop, last, drop[0].id)).toEqual([
      { id: last.id, rank: 10 }, { id: drop[0].id, rank: 20 }, { id: drop[1].id, rank: 30 },
    ]);
    const ranked = drop.map((t, i) => ({ ...t, rank: (i + 1) * 10 }));
    expect(reorder(ranked, ranked[1], ranked[0].id)).toEqual([{ id: ranked[1].id, rank: 10 }, { id: ranked[0].id, rank: 20 }]);
  });
  it('ranked todos sit first in their box', () => {
    const l = { ...y, todos: y.todos.map((t) => (t.id === 'todo-909' ? { ...t, rank: 10 } : t)) };
    expect(matrix(l, now).drop[0].id).toBe('todo-909');
  });
});

describe('date inputs in ship time', () => {
  it('round-trips through Stockholm time, summer and winter', () => {
    expect(toInputTime('2026-11-08T16:00:00Z')).toBe('2026-11-08T17:00');
    expect(fromInputTime('2026-11-08T17:00')).toBe('2026-11-08T16:00:00Z');
    expect(fromInputTime('2026-07-01T09:30')).toBe('2026-07-01T07:30:00Z');
    expect(fromInputTime('nonsense')).toBeNull();
  });
});

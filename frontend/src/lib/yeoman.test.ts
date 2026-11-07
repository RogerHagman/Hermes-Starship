// The Yeoman's rules as the board works them out: the four boxes and why, the next 48 hours, late
// waiting-fors, recurring rules in words, the timer's heartbeat and the week.
import { describe, expect, it } from 'vitest';
import sample from '../../../fixtures/yeoman.json';
import type { Todo, YeomanFile } from '../types';
import { boxOf, heartbeat, late, matrix, moveHint, next48, overdue, ruleWords, until, week, why } from './yeoman';

const y = sample as unknown as YeomanFile;
const now = Date.parse(y.asOf);
const H = 3_600_000;
const todo = (t: Partial<Todo>): Todo => ({ id: 'todo-1', text: 'x', addedAt: y.asOf, important: false, ...t });
const at = (h: number) => new Date(now + h * H).toISOString().replace(/\.\d+Z$/, 'Z');

describe('the four boxes', () => {
  it('urgent is a due date within 48 hours or past; important is the "!"', () => {
    expect(boxOf(todo({ due: at(3), important: true }), now)).toBe('first');
    expect(boxOf(todo({ due: at(-5), important: true }), now)).toBe('first');      // overdue counts as urgent
    expect(boxOf(todo({ due: at(48), important: true }), now)).toBe('first');      // the edge is inside
    expect(boxOf(todo({ due: at(49), important: true }), now)).toBe('schedule');
    expect(boxOf(todo({ important: true }), now)).toBe('schedule');
    expect(boxOf(todo({ due: at(10) }), now)).toBe('delegate');
    expect(boxOf(todo({}), now)).toBe('drop');
  });
  it('the cover letter, with no due date and no "!", lands in Don\'t do and says why', () => {
    const letter = y.todos.find((t) => t.id === 'todo-908')!;
    expect(boxOf(letter, now)).toBe('drop');
    expect(why(letter, now)).toBe('No due date, no "!".');
    expect(moveHint(letter, now)).toContain('A "!" makes it Schedule');
  });
  it('every sample todo sits in exactly one box, the soonest due first', () => {
    const m = matrix(y, now);
    expect(Object.values(m).flat()).toHaveLength(y.todos.length);
    expect(m.first.map((t) => t.id)).toEqual(['todo-901', 'todo-902']);
    expect(m.drop.map((t) => t.id)).toEqual(['todo-907', 'todo-909', 'todo-908']);   // no due dates: the oldest first
    expect(why(m.first[0], now)).toBe('Due in 3 h, within 48 h, marked "!".');
  });
  it('overdue and far-off reasons name the day', () => {
    expect(why(todo({ due: '2026-11-03T10:00:00Z' }), now)).toBe('Overdue since TUE 3 NOV, no "!".');
    expect(why(todo({ due: '2026-11-09T12:00:00Z', important: true }), now)).toBe('Due MON 9 NOV, more than 48 h away, marked "!".');
    expect(overdue({ ...y, todos: [todo({ due: at(-1) }), todo({ due: at(1) })] }, now)).toHaveLength(1);
  });
});

describe('the next 48 hours', () => {
  it('holds reminders, todo dues, nudges and recurring dates inside the window, soonest first', () => {
    const marks = next48(y, now);
    expect(marks.every((k) => Date.parse(k.at) >= now && Date.parse(k.at) <= now + 48 * H)).toBe(true);
    expect(marks.map((k) => k.at)).toEqual([...marks.map((k) => k.at)].sort());
    expect(marks[0]).toMatchObject({ id: 'todo-901', kind: 'todo', box: 'first' });
    expect(marks.find((k) => k.id === 'rem-902')?.snoozed).toBe(true);
    expect(marks.some((k) => k.id === 'rem-904')).toBe(false);   // Saturday is outside
  });
  it('says how far away a time is', () => {
    expect(until(at(0.5), now)).toBe('in 30 min');
    expect(until(at(5), now)).toBe('in 5 h');
    expect(until(at(72), now)).toBe('in 3 days');
    expect(until(at(-2), now)).toBe('2 h ago');
  });
});

describe('waiting, recurring, the timer and the week', () => {
  it('a waiting-for is late once its nudge time has passed', () => {
    expect(y.waiting.filter((w) => late(w, now)).map((w) => w.id)).toEqual(['wait-901', 'wait-902']);
    expect(late({ id: 'w', what: 'x', since: y.asOf }, now)).toBe(false);   // no nudge, never late
  });
  it('recurring rules read as words', () => {
    expect(ruleWords('monthly:25')).toBe('Every month on the 25th');
    expect(ruleWords('weekly:sun')).toBe('Every Sunday');
    expect(ruleWords('weekly:wed 10:00')).toBe('Every Wednesday at 10:00');
    expect(ruleWords('yearly:11-01')).toBe('Every year on 1 November');
    expect(ruleWords('daily')).toBe('Every day');
    expect(ruleWords('daily 07:30')).toBe('Every day at 07:30');
    expect(ruleWords('fortnightly:mon')).toBe('fortnightly:mon');   // unknown rules stay as written
  });
  it('the heartbeat is minutes before the list was read, or null when the list does not say', () => {
    expect(heartbeat(y)).toBe(1);
    expect(heartbeat({ ...y, heartbeat: at(-0.25) })).toBe(15);
    expect(heartbeat({ ...y, heartbeat: undefined })).toBeNull();
  });
  it('the week counts todos added and what closed, per ship\'s day', () => {
    const w = week(y);
    expect(w.days).toHaveLength(7);
    expect(w.days[6].key).toBe('2026-11-04');
    expect(w.closed).toBe(w.days.reduce((n, d) => n + d.n, 0));
    expect(w.closed).toBe(y.done.filter((d) => d.closedAt >= '2026-10-28T23:00:00Z').length);
    expect(Object.values(w.how).reduce((a, b) => a + b, 0)).toBe(w.closed);
  });
});

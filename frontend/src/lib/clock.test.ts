import { describe, expect, it } from 'vitest';
import { clockNow, duration, taskClock } from './clock';
import type { Order } from '../types';

const base: Order = { id: 'ORD-1246', title: 'Add a todo', station: 'yeoman', state: 'done', updatedAt: '2026-11-07T20:00:34Z' };

describe('task clock', () => {
  it('reads to the second while short', () => {
    expect([duration(0), duration(34_000), duration(192_000), duration(3_900_000), duration(60 * 3_600_000)])
      .toEqual(['0 s', '34 s', '3 min 12 s', '1 h 05 min', '2 d 12 h']);
  });
  it('says what a done order took, and the worked time when it waited first', () => {
    const o = { ...base, openedAt: '2026-11-07T20:00:00Z', closedAt: '2026-11-07T20:00:34Z' };
    expect(taskClock(o, 0)?.text).toBe('took 34 s');
    expect(taskClock({ ...o, startedAt: '2026-11-07T20:00:20Z' }, 0)?.text).toBe('took 34 s · worked 14 s');
    expect(taskClock({ ...o, startedAt: '2026-11-07T20:00:02Z' }, 0)?.text).toBe('took 34 s');
    const split = taskClock({ ...o, startedAt: '2026-11-07T20:00:20Z' }, 0);
    expect([split?.main, split?.effective]).toEqual(['took 34 s', '14 s']);
    expect([taskClock(o, 0)?.effective, taskClock(o, 0)?.effectiveFrom]).toEqual(['34 s', 'whole']);
    expect(taskClock({ ...o, state: 'queued' }, Date.parse('2026-11-07T20:01:00Z'))?.effective).toBe('0 s');
  });
  it('ticks for an open order and says nothing without an opening time', () => {
    const now = Date.parse('2026-11-07T20:03:12Z');
    expect(taskClock({ ...base, state: 'running', openedAt: '2026-11-07T20:00:00Z' }, now)?.text).toBe('running 3 min 12 s');
    expect(taskClock({ ...base, state: 'queued', openedAt: '2026-11-07T20:00:00Z' }, now)?.text).toBe('open 3 min 12 s');
    expect(taskClock(base, now)).toBeNull();
  });
  it('measures samples from asOf and live files from the real clock', () => {
    expect(clockNow({ synthetic: true, asOf: '2026-11-04T12:00:00Z' }, 9e12)).toBe(Date.parse('2026-11-04T12:00:00Z'));
    expect(clockNow({ synthetic: false, asOf: '2026-11-04T12:00:00Z' }, 9e12)).toBe(9e12);
  });
});

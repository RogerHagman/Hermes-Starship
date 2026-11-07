import { describe, expect, it } from 'vitest';
import { noStartWord } from './TaskClock';
import type { Order } from '../types';

const o: Order = { id: 'ORD-1242', title: 'todo', station: 'yeoman', state: 'done', updatedAt: '2026-11-07T15:53:00Z' };

describe('effective without a start time', () => {
  it('says no card only when there was none', () => {
    expect(noStartWord({ ...o, cards: 0 })).toBe('no card');
    expect(noStartWord({ ...o, cards: 1 })).toBe('no start time');
    expect(noStartWord({ ...o, state: 'queued', cards: 1 })).toBe('not started');
    expect(noStartWord({ ...o, state: 'queued', cards: 0 })).toBe('not started');
  });
});

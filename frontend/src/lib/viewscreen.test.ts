// The Main Viewscreen: the session on screen, the tape of actions and what waits for the Captain.
import { describe, expect, it } from 'vitest';
import sample from '../../../fixtures/viewscreen.json';
import type { ViewscreenFile } from '../types';
import { actions, current, length, sessions, tally, waiting, weekOf } from './viewscreen';

const f = sample as unknown as ViewscreenFile;

describe('the Main Viewscreen', () => {
  it('the newest session with no end is on screen', () => {
    expect(current(f)?.id).toBe('vs-903');
    expect(length(current(f)!, f.asOf)).toBe('18 min');
    expect(current({ ...f, sessions: f.sessions.filter((s) => s.end) })).toBeUndefined();
    expect(sessions(f).map((s) => s.id)).toEqual(['vs-903', 'vs-902', 'vs-901']);
  });
  it('every action asks: approved, denied or waiting for you', () => {
    expect(waiting(f).map((a) => [a.session.id, a.action.what])).toEqual([['vs-903', 'Scroll to the follow-ups']]);
    expect(tally(f.sessions.find((s) => s.id === 'vs-902')!)).toEqual({ approved: 3, denied: 1, waiting: 0 });
    expect(actions(f)).toHaveLength(10);
    expect(actions(f)[0].action.decision).toBe('waiting');
  });
  it('the week counts sessions, actions and captures', () => {
    expect(weekOf(f)).toEqual({ sessions: 3, actions: 10, captures: 6, approved: 7, denied: 2 });
  });
});

import { describe, expect, it } from 'vitest';
import { boardFromHash } from './board';

describe('board from the address bar', () => {
  it('reads the built boards', () => {
    expect(boardFromHash('#/quarters')).toBe('quarters');
    expect(boardFromHash('#quarters')).toBe('quarters');
    expect(boardFromHash('#/bridge')).toBe('bridge');
    expect(boardFromHash('#/holodeck')).toBe('holodeck');
    expect(boardFromHash('#/engineering')).toBe('engineering');
    expect(boardFromHash('#/science')).toBe('science');
  });
  it('falls back to the Bridge for anything else', () => {
    expect(boardFromHash('')).toBe('bridge');
    expect(boardFromHash('#/conn')).toBe('bridge');
    expect(boardFromHash('#/../quarters')).toBe('bridge');
  });
});

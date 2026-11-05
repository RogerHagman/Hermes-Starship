import { describe, expect, it } from 'vitest';
import { fitBoard } from './fit';

describe('fitBoard', () => {
  it('shows the board 1:1 on a 2560 x 1440 screen', () => {
    expect(fitBoard(2560, 1440)).toEqual({ fit: true, scale: 1, left: 0, top: 0 });
  });
  it('scales down and centres in a browser window on that screen', () => {
    const f = fitBoard(2560, 1300);
    expect(f.fit).toBe(true);
    expect(f.scale).toBeCloseTo(1300 / 1440);
    expect(f.top).toBe(0);
    expect(f.left).toBe(Math.round((2560 - 2560 * f.scale) / 2));
  });
  it('fits a 1080p window', () => {
    expect(fitBoard(1920, 960).fit).toBe(true);
  });
  it('reflows when the board would get too small, or the window is portrait', () => {
    expect(fitBoard(1440, 800).fit).toBe(false);
    expect(fitBoard(600, 900).fit).toBe(false);
    expect(fitBoard(1600, 2400).fit).toBe(false);
  });
});

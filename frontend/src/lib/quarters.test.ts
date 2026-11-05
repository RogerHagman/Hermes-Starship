import { describe, expect, it } from 'vitest';
import { ROOM, SPOTS, WALL, greeting, nights, stardate } from './quarters';

describe('the Quarters picture', () => {
  it('every clickable thing sits inside the picture, and none covers the wall screen', () => {
    for (const s of SPOTS) {
      const [x, y, w, h] = s.box;
      expect(x >= 0 && y >= 0 && x + w <= ROOM.w && y + h <= ROOM.h).toBe(true);
      const overlapsWall = x < WALL.x + WALL.w && x + w > WALL.x && y < WALL.y + WALL.h && y + h > WALL.y;
      expect(overlapsWall, s.id).toBe(false);
    }
  });
});

describe('greeting', () => {
  it('follows the ship clock in Stockholm', () => {
    expect(greeting(new Date('2026-11-04T19:30:00Z'))).toBe('Good evening, Captain.');   // 20:30 there
    expect(greeting(new Date('2026-11-05T07:00:00Z'))).toBe('Good morning, Captain.');   // 08:00
    expect(greeting(new Date('2026-11-05T12:00:00Z'))).toBe('Good afternoon, Captain.'); // 13:00
    expect(greeting(new Date('2026-11-05T01:00:00Z'))).toBe('The late watch, Captain.'); // 02:00
  });
});

describe('stardate', () => {
  it('is the year and the thousandths of it gone by', () => {
    expect(stardate(new Date('2026-01-01T00:00:00Z'))).toBe('2026.000');
    expect(stardate(new Date('2026-07-02T12:00:00Z'))).toBe('2026.500');
    expect(stardate(new Date('2026-11-04T19:30:00Z'))).toBe('2026.843');
  });
});

describe('nights for the windows chart', () => {
  it('finds 22:00 to 07:00 Stockholm time in the next 24 hours', () => {
    const from = Date.parse('2026-11-04T19:30:00Z');           // Wed 20:30 in Stockholm
    const n = nights(from, from + 24 * 3600000);
    expect(n).toHaveLength(1);
    expect(new Date(n[0][0]).toISOString()).toBe('2026-11-04T21:00:00.000Z');   // 22:00 CET
    expect(new Date(n[0][1]).toISOString()).toBe('2026-11-05T06:00:00.000Z');   // 07:00 CET
  });
});

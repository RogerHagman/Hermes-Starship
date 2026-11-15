import { afterEach, describe, expect, it } from 'vitest';
import { clockTime, dayKey, setShipTimeZone, shipPlace, shipTimeZone } from './format';

describe('the ship time zone', () => {
  afterEach(() => { setShipTimeZone(null); });

  it('defaults to Europe/Stockholm', () => {
    expect(shipTimeZone()).toBe('Europe/Stockholm');
    expect(shipPlace()).toBe('STOCKHOLM');
  });

  it('follows ship.json, place and times included', () => {
    expect(setShipTimeZone('America/New_York')).toBe('America/New_York');
    expect(shipPlace()).toBe('NEW YORK');
    expect(clockTime('2026-11-15T13:00:00Z')).toBe('08:00');
    expect(dayKey('2026-11-15T03:00:00Z')).toBe('2026-11-14');
  });

  it('keeps the default for an unknown zone', () => {
    expect(setShipTimeZone('Mars/Olympus')).toBe('Europe/Stockholm');
  });
});

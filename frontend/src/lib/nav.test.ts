// Navigation: the next 7 days, holds, trips, free slots and the Yeoman's Schedule box.
import { describe, expect, it } from 'vitest';
import nav from '../../../fixtures/nav.json';
import yeoman from '../../../fixtures/yeoman.json';
import type { Fixtures, NavFile } from '../types';
import { bookings, coming, dayOf, freeSlots, held, holdLeft, nextDays, span, stops, trips, wanted } from './nav';

const f = nav as unknown as NavFile;

describe('Navigation', () => {
  it('the week starts today, in ship\'s time', () => {
    const d = nextDays(f.asOf);
    expect(d.map((x) => x.key)).toEqual(['2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10']);
    expect(d[1]).toMatchObject({ label: 'THU 5 NOV', short: 'THU' });
  });
  it('a day lists its events by start, in ship\'s time', () => {
    expect(dayOf(f, '2026-11-05').map((e) => [e.title, span(e)])).toEqual([['Dentist', '09:00–09:45'], ['Gym · intervals', '17:00–18:00']]);
    expect(coming(f)[0].id).toBe('ev-901');
  });
  it('held bookings come first, the hold running out soonest at the top', () => {
    expect(bookings(f).map((b) => b.id)).toEqual(['bk-901', 'bk-902', 'bk-903', 'bk-904']);
    expect(held(f).map((b) => [b.id, holdLeft(b, f.asOf)])).toEqual([['bk-902', 24], ['bk-901', 16]]);
  });
  it('trips: planned first by departure, then ideas; stops along the legs', () => {
    expect(trips(f).map((t) => t.id)).toEqual(['trip-902', 'trip-901', 'trip-903']);
    expect(stops(trips(f)[1])).toEqual(['Lidköping', 'Herrljunga', 'Göteborg']);
    expect(stops(trips(f)[2])).toEqual(['Lidköping', 'Smögen']);
  });
  it('offers free windows of an hour or more between 08:00 and 20:00', () => {
    const free = freeSlots(f);
    expect(free[0]).toMatchObject({ key: '2026-11-04', windows: [], over: true });
    expect(free[1].windows).toEqual([{ from: '08:00', to: '09:00' }, { from: '09:45', to: '17:00' }, { from: '18:00', to: '20:00' }]);
    expect(free[4].windows).toEqual([{ from: '08:00', to: '20:00' }]);
  });
  it("the slots wanted are the Yeoman's Schedule box", () => {
    expect(wanted({ yeoman } as unknown as Fixtures).map((t) => t.text)).toEqual(['Plan the November training block', 'Book winter tires']);
  });
});

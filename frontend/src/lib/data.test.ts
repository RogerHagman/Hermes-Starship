import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadLiveRails, railsSource } from './data';

const live = { asOf: '2026-11-05T09:00:00Z', synthetic: false, rails: [] };

describe('live rails', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('uses a real reading', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(live))));
    expect(await loadLiveRails()).toEqual(live);
  });

  it('keeps the sample when there is no file, a sample file or junk', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })));
    expect(await loadLiveRails()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ...live, synthetic: true }))));
    expect(await loadLiveRails()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not json')));
    expect(await loadLiveRails()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    expect(await loadLiveRails()).toBeNull();
  });

  it('says where the numbers come from', () => {
    const at = Date.parse(live.asOf);
    expect(railsSource({ ...live, synthetic: true }, at)).toBe('sample');
    expect(railsSource(live, at + 60_000)).toBe('live');
    expect(railsSource(live, at + 6 * 60_000)).toBe('stale');
  });
});

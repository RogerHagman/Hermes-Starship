// Loads the fixture files. Moving around never calls a model: these are local files only.
import type { Fixtures } from '../types';

const FILES = ['ship', 'stations', 'rails', 'orders', 'shiplog', 'quarters'] as const;

declare global {
  interface Window { FIXTURES?: Fixtures }   // set only in the single-file preview build
}

export async function loadFixtures(): Promise<Fixtures> {
  if (window.FIXTURES) return window.FIXTURES;
  const parts = await Promise.all(FILES.map(async (name) => {
    const res = await fetch(`fixtures/${name}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`fixtures/${name}.json: ${res.status}`);
    return [name, await res.json()] as const;
  }));
  return Object.fromEntries(parts) as unknown as Fixtures;
}

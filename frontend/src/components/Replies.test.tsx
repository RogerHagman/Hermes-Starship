// What came back on an order: the replies under its card on the Bridge.
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import quarters from '../../../fixtures/quarters.json';
import type { Fixtures } from '../types';
import { makeShipView } from '../lib/ship';
import { Replies } from './Panels';

const data = { ship, stations, rails, orders, shiplog, quarters } as unknown as Fixtures;
const view = makeShipView(data, {}, new Set());
const sweep = data.orders.orders.find((o) => o.id === 'ORD-9009')!;

describe('replies', () => {
  it('lists each reply with its station and kind, oldest first', () => {
    const c = render(<Replies ship={view} replies={sweep.replies!} />).container;
    const metas = [...c.querySelectorAll('.reply-meta')].map((m) => m.textContent);
    expect(metas).toHaveLength(2);
    expect(metas[0]).toMatch(/OPS · RUN$/);
    expect(metas[1]).toMatch(/OPS · RESULT$/);
    expect(c.querySelector('.cb-head')?.textContent).toBe('REPLIES · 2');
  });
  it('shows the newest in full, and an older one opens on a click', () => {
    const c = render(<Replies ship={view} replies={sweep.replies!} />).container;
    const older = c.querySelector('button.reply-text')!;
    expect(older.className).toContain('clamped');
    expect(c.querySelector('p.reply-text')?.textContent).toContain('All green.');
    fireEvent.click(older);
    expect(older.className).not.toContain('clamped');
    expect(older.getAttribute('aria-expanded')).toBe('true');
  });
});

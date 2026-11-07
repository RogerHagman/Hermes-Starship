// The Bridge's In flight: an order the Holodeck Officer has pushed work for shows its PR state.
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import quarters from '../../../fixtures/quarters.json';
import holo from '../../../fixtures/holo.json';
import type { Fixtures } from '../types';
import { makeShipView } from '../lib/ship';
import { OrdersPanel } from './Panels';

describe('In flight', () => {
  it("shows holo's PR state on the order's card, and nothing on the others", () => {
    // Point the sample's ready item at a running sample order.
    const items = holo.items.map((i) => (i.order === 'ORD-9020' ? { ...i, order: 'ORD-9011' } : i));
    const data = { ship, stations, rails, orders, shiplog, quarters, holo: { ...holo, items } } as unknown as Fixtures;
    const c = render(<OrdersPanel ship={makeShipView(data, {}, new Set())} filter="all" onOpen={() => {}} />).container;
    const chips = [...c.querySelectorAll('.ocard-pr')].map((e) => e.textContent);
    expect(chips).toEqual(['PR #931 · READY TO REVIEW']);
  });
});

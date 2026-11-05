// The Captain's chair on the Bridge: what the console under the saucer shows when you pick
// the Captain. The command chair faces the main viewscreen, with the hails beside it.
// Picking a hail opens it in the console, and Back returns to the chair. Approve and Deny
// open in H4, in the Quarters. Page 2 is the Captain's station card, the same card every
// other station has.
import { useMemo, useState } from 'react';
import art from '../assets/bridge-chair.svg?raw';
import { SHIP_MAP } from '../lib/shipmap';
import type { ShipView } from '../lib/ship';
import { ConHead, StationDetail } from './ShipConsole';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const ICONS = SHIP_MAP.icons as Record<string, string>;

/** The picture, inserted once. It is our own file, never fixture text. */
function Art() {
  return useMemo(() => <div className="cchair-svg" dangerouslySetInnerHTML={{ __html: art }} />, []);
}

export function CaptainsChair({ ship, onPick, onBack, onQuarters }: {
  ship: ShipView; onPick: (station: string, order?: string, from?: string) => void; onBack: () => void; onQuarters?: () => void;
}) {
  const [page, setPage] = useState(0);
  const captain = ship.station('captain');
  const hails = ship.data.orders.orders.filter((o) => o.state === 'awaiting-captain').sort((a, b) => b.tier - a.tier);
  const burning = ship.data.rails.rails.some((r) => r.burn?.active && ship.rail(r.id) !== 'out');
  // Same lights as the chair in the Quarters: a rail that is out dims its armrest light,
  // and warp streaks cross the viewscreen while the burn is on.
  const look = css({
    '--q-local': ship.rail('local') === 'out' ? 0.12 : 1,
    '--q-codex': ship.rail('codex') === 'out' ? 0.12 : 1,
    '--q-claude': ship.rail('claude') === 'out' ? 0.12 : 1,
    '--bc-burn': burning ? 1 : 0,
  });

  // Two pages: the chair, then the station card. Small dots, the current one lit; the name
  // of each page shows on hover.
  const pager = captain && (
    <span className="pager" role="group" aria-label="Pages">
      {['The chair', 'Station card'].map((label, i) => (
        <button key={label} type="button" className="pager-dot" aria-pressed={page === i} aria-label={`Page ${i + 1}: ${label}`}
          data-tip={label} onClick={() => setPage(i)} />
      ))}
    </span>
  );

  if (page === 1 && captain) {
    return (
      <section className="console cchair" role="region" aria-label="The Captain's station card" style={css({ '--c': 'var(--captain)' })}>
        <StationDetail ship={ship} st={captain} back="‹ Watch" onBack={onBack} actions={pager} />
      </section>
    );
  }

  return (
    <section className="console cchair" role="region" aria-label="The Captain's chair" style={css({ '--c': 'var(--captain)' })}>
      <ConHead icon={ICONS.captain} title="The Captain's chair" back="‹ Watch" onBack={onBack}
        sub={`BRIDGE · YOU HAVE THE CONN${burning ? ' · BURN ON' : ''}`}>
        {pager}
      </ConHead>
      <div className="cchair-body">
        <div className="cchair-art" style={look}><Art /></div>
        <div className="cchair-side">
          <span className="cchair-count mono">{hails.length ? `${hails.length} HAILS WAIT FOR YOU` : 'NOTHING WAITS FOR YOU'}</span>
          <ul className="cchair-hails">
            {hails.map((o) => (
              <li key={o.id}>
                <button type="button" className="cchair-hail" style={css({ '--c': `var(--tier-${o.tier})` })}
                  onClick={() => onPick(o.station, o.id, 'captain')} title={`${o.id} · ${o.title}`}>
                  <span className="tierpill">TIER {o.tier}</span>
                  <span className="cchair-hail-title">{o.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="cchair-foot">
            {onQuarters && <button type="button" className="btn btn-gold" onClick={onQuarters}>To your Quarters</button>}
            <span className="con-hint">Approve and Deny open in H4, in your Quarters.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Board title, condition lamp and the ship's clock.
import { useEffect, useState } from 'react';
import { clockTime, dateLine } from '../lib/format';
import type { ShipView } from '../lib/ship';
import { RAIL_IDS } from '../lib/ship';

export function Header({ ship, error }: { ship: ShipView | null; error: string | null }) {
  const anyOut = ship ? RAIL_IDS.some((r) => ship.rail(r) === 'out') : false;
  const level = anyOut ? 'yellow' : ship?.data.ship.condition ?? 'green';
  const name = ship ? `${ship.data.ship.name.toUpperCase()} · ${ship.data.ship.registry}` : 'HERMES';
  return (
    <div className="head">
      <div>
        <p className="deck-label mono">{name} · BRIDGE · SHIP STATUS</p>
        <h1 className="board-title">Bridge · all decks</h1>
        <p className="intro">
          {error
            ? `Could not load the fixtures (${error}). Run npm run dev, or serve the built page with /fixtures/ next to it.`
            : 'Who is at their post, where work is running and what waits for you.'}
        </p>
      </div>
      <div className="head-right">
        <div className={`condition ${level}`} title={anyOut ? 'A rail is out, so its crew are off duty' : 'All rails up'}>
          <span className="lamp" /><span className="mono">CONDITION {level.toUpperCase()}</span>
        </div>
        <Clock />
        <span className="pill pill-fixture mono" title="Synthetic data from fixtures/. Nothing on this screen calls a model.">FIXTURES · NO MODEL CALLS</span>
      </div>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="clock">
      <span className="clock-time">{clockTime(now)}</span>
      <span className="mono clock-sub">{dateLine(now)} · STOCKHOLM</span>
    </div>
  );
}

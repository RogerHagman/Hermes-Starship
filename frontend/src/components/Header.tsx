// Board title, condition lamp and the ship's clock.
import { useEffect, useState } from 'react';
import type { BoardId } from '../lib/board';
import { clockTime, dateLine } from '../lib/format';
import type { ShipView } from '../lib/ship';
import { RAIL_IDS } from '../lib/ship';

const BOARD_TEXT: Record<BoardId, { deck: string; title: string; intro: string }> = {
  bridge: {
    deck: 'BRIDGE · SHIP STATUS',
    title: 'Bridge · all decks',
    intro: 'Who is at their post, where work is running and what waits for you.',
  },
  quarters: {
    deck: "DECK 2 · CAPTAIN'S QUARTERS · PRIVATE",
    title: "Captain's Quarters",
    intro: 'Your hails, your campaigns and your own log. Pick something in the room to bring it up on the wall screen.',
  },
  holodeck: {
    deck: 'DECK 4 · HOLODECK & DESIGN',
    title: 'Holodeck',
    intro: 'The ship as a hologram: its rooms, its assets, and new sections spun up for the crew to build.',
  },
  sensors: {
    deck: 'DECK 3 · SCIENCES · SENSOR ARRAY',
    title: 'Sensor array',
    intro: 'Every watch Sensors keeps, what it found and where from, and the asks that came in word for word.',
  },
  engineering: {
    deck: 'DECK 7 · MAIN ENGINEERING',
    title: 'Main Engineering',
    intro: 'The warp core, every patch from brief to live, the patch bay and the commands you run on the NAS.',
  },
  ops: {
    deck: 'DECK 1 · OPS · BEHIND THE BRIDGE',
    title: 'Ops',
    intro: 'What Ops knows about the ship: the NAS, the network, the containers, the disks, the GPU, the schedule and the backups. Ops only reads.',
  },
  computer: {
    deck: 'DECK 3 · COMPUTER CORE',
    title: 'Computer core',
    intro: "Every order the ship has taken, in any state, on the core terminal. The Ship's Computer keeps the records; its memory banks stay sealed.",
  },
  science: {
    deck: 'DECK 3 · SCIENCES · SCIENCE LAB',
    title: 'Science lab',
    intro: 'The local models, how they score and serve, every number with its run log, and the study bench.',
  },
};

export function Header({ ship, board, error }: { ship: ShipView | null; board: BoardId; error: string | null }) {
  const anyOut = ship ? RAIL_IDS.some((r) => ship.rail(r) === 'out') : false;
  const level = anyOut ? 'yellow' : ship?.data.ship.condition ?? 'green';
  const name = ship ? `${ship.data.ship.name.toUpperCase()} · ${ship.data.ship.registry}` : 'HERMES';
  const text = BOARD_TEXT[board];
  const conn = ship?.data.ship.captain.conn === 'captain';
  return (
    <div className="head">
      <div>
        <p className="deck-label mono">{name} · {text.deck}</p>
        <h1 className="board-title">{text.title}</h1>
        <p className="intro">
          {error
            ? `Could not load the fixtures (${error}). Run npm run dev, or serve the built page with /fixtures/ next to it.`
            : text.intro}
        </p>
      </div>
      <div className="head-right">
        {board === 'quarters' && ship && (
          <span className={'pill pill-conn mono' + (conn ? '' : ' away')} title="The Conn handoff board arrives in H4.">
            {conn ? 'YOU HAVE THE CONN' : 'NUMBER ONE HAS THE CONN'}
          </span>
        )}
        <div className={`condition ${level}`} title={anyOut ? 'A rail is out, so its crew are off duty' : 'All rails up'}>
          <span className="lamp" /><span className="mono">CONDITION {level.toUpperCase()}</span>
        </div>
        <Clock />
        {ship && !ship.data.orders.synthetic
          ? <span className="pill pill-fixture live mono" title="Orders and the log are read from Hermes by the ship probe on the NAS. Nothing on this screen calls a model.">LIVE ORDERS · NO MODEL CALLS</span>
          : <span className="pill pill-fixture mono" title="Synthetic data from fixtures/. Nothing on this screen calls a model.">FIXTURES · NO MODEL CALLS</span>}
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

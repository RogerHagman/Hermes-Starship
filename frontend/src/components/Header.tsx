// Board title, condition lamp and the ship's clock.
import { useEffect, useState } from 'react';
import { mainAlert } from '../lib/review';
import type { BoardId } from '../lib/board';
import { clockTime, dateLine } from '../lib/format';
import type { ShipView } from '../lib/ship';
import { RAIL_IDS } from '../lib/ship';
import { boardSources } from '../lib/sources';

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
  xo: {
    deck: "DECK 1 · NUMBER ONE'S POST · BESIDE THE CAPTAIN'S CHAIR",
    title: "Number One's post",
    intro: 'Number One routes: every ask comes in here and goes out to one station. It never does the work itself.',
  },
  helm: {
    deck: 'DECK 1 · HELM · FLIGHT CONTROL',
    title: 'Helm',
    intro: 'The career course: every job ad and application from find to close, your gates, the follow-ups and the method. You send every application yourself.',
  },
  nav: {
    deck: 'DECK 1 · NAVIGATION · FLIGHT CONTROL',
    title: 'Navigation',
    intro: "The calendar, trips and bookings, and slots for the Yeoman's Schedule box. Every booking stops before Confirm for you.",
  },
  viewscreen: {
    deck: 'DECK 1 · MAIN VIEWSCREEN',
    title: 'Main Viewscreen',
    intro: 'Your desktop on the bridge: every on-screen session, and every click, key and line typed, with your OK or no. Never yolo.',
  },
  yeoman: {
    deck: "DECK 2 · YEOMAN'S POST · BY THE CAPTAIN'S DOOR",
    title: "Yeoman's post",
    intro: 'Your todos in four boxes and why each one is where it is, the next 48 hours, reminders with proof they fired, what you wait for and what got done. Code works it out, not a model.',
  },
  science: {
    deck: 'DECK 3 · SCIENCES · SCIENCE LAB',
    title: 'Science lab',
    intro: 'The local models, how they score and serve, every number with its run log, and the study bench.',
  },
};

export function Header({ ship, board, error }: { ship: ShipView | null; board: BoardId; error: string | null }) {
  const anyOut = ship ? RAIL_IDS.some((r) => ship.rail(r) === 'out') : false;
  // A commit on main without a merged PR outranks everything: GitHub doesn't enforce main's rules here.
  const alert = ship ? mainAlert(ship.data) : null;
  const level = alert ? 'red' : anyOut ? 'yellow' : ship?.data.ship.condition ?? 'green';
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
        <div className={`condition ${level}`} title={alert ?? (anyOut ? 'A rail is out, so its crew are off duty' : 'All rails up')}>
          <span className="lamp" /><span className="mono">CONDITION {level.toUpperCase()}{alert ? ' · MAIN' : ''}</span>
        </div>
        <Clock />
        {ship && <Sources board={board} ship={ship} />}
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

/**
 * What this board reads, one chip per part: solid green when it is live from a probe on the NAS,
 * dashed yellow when it is still the sample, so it is plain what still needs a live read.
 * Nothing on any board calls a model.
 */
function Sources({ board, ship }: { board: BoardId; ship: ShipView }) {
  const parts = boardSources(board, ship.data);
  const sample = parts.filter((p) => p.state === 'sample').length;
  const down = parts.filter((p) => p.state === 'stale').length;
  return (
    <div className="sources" aria-label="What this board reads">
      <span className="mono sources-label" title="Nothing on this screen calls a model.">
        {down ? `${down} DOWN · ` : ''}{sample ? `${sample} OF ${parts.length} SAMPLE` : down ? '' : 'ALL LIVE'}{sample || !down ? ' · ' : ''}NO MODEL CALLS
      </span>
      <span className="sources-chips">
        {parts.map((p) => (
          <span key={p.id} className={`src-chip mono src-${p.state}`} title={p.why}>
            {p.state === 'live' ? 'LIVE' : p.state === 'stale' ? 'DOWN' : 'SAMPLE'} · {p.label}
          </span>
        ))}
      </span>
    </div>
  );
}

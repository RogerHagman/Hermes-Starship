// The left LCARS rail: boards, the rail filter and the rail-out drill.
import type { BoardId } from '../lib/board';
import { BOARDS, RAIL } from '../lib/lookups';
import type { Drills } from '../lib/ship';
import { RAIL_IDS } from '../lib/ship';
import type { RailColour, RailId } from '../types';

export type RailFilter = 'all' | Exclude<RailColour, 'captain'>;

interface Props {
  registry: string;
  board: BoardId;
  onBoard: (b: BoardId) => void;
  filter: RailFilter;
  onFilter: (f: RailFilter) => void;
  drills: Drills;
  onDrill: (r: RailId) => void;
  onToast: (text: string) => void;
}

export function SideRail({ registry, board, onBoard, filter, onFilter, drills, onDrill, onToast }: Props) {
  const filters: RailFilter[] = ['all', 'local', 'codex', 'claude', 'mixed'];
  const here = BOARDS.find((b) => b.id === board);
  return (
    <nav className="siderail" aria-label="Boards">
      <div className="brand">
        <span className="brand-name">HERMES</span>
        <span className="brand-reg mono">{registry} · {board === 'quarters' ? 'QUARTERS' : 'BRIDGE'}</span>
      </div>

      <p className="rail-label mono">BOARDS</p>
      <ul className="boards">
        {BOARDS.map((b) => {
          const current = b.id === here?.id;
          return (
            <li key={b.id}>
              <button
                type="button"
                className={'board-btn' + (b.built ? '' : ' not-built') + (b.id === 'quarters' ? ' quarters' : '')}
                aria-current={current ? 'page' : undefined}
                onClick={() => {
                  if (!b.built) onToast(`${b.label} isn't built yet. It arrives in ${b.phase}.`);
                  else if (!current) onBoard(b.id as BoardId);
                }}
              >
                <span>{b.label}</span>
                <span className="tag">{current ? 'HERE' : b.built ? `DECK ${b.deck}` : b.phase}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="rail-label mono">SHOW RAIL</p>
      <div className="filters" role="group" aria-label="Show stations on a rail">
        {filters.map((r) => (
          <button key={r} type="button" className="chip" aria-pressed={filter === r}
            style={r === 'all' ? undefined : ({ '--c': RAIL[r].color } as React.CSSProperties)}
            onClick={() => onFilter(r)}>
            {r !== 'all' && <span className="dot" />}
            {r === 'all' ? 'All' : RAIL[r].legend}
          </button>
        ))}
      </div>

      <p className="rail-label mono">DRILL · RAIL OUT</p>
      <div className="filters" role="group" aria-label="Preview a rail going out">
        {RAIL_IDS.map((r) => (
          <button key={r} type="button" className="chip drill" aria-pressed={!!drills[r]}
            style={{ '--c': RAIL[r].color } as React.CSSProperties}
            onClick={() => onDrill(r)}>
            <span className="dot" />{RAIL[r].legend}
          </button>
        ))}
      </div>
      <p className="rail-help">A drill only changes this screen. Nothing on the ship is touched.</p>

    </nav>
  );
}

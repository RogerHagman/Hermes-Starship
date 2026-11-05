// The ship cutaway with a clickable tile on every room, and the crew standing at their posts
// (CrewTokens.tsx). The Labels control switches the tile text: role, rank, or off so the rooms show.
// The art is ship.svg (built from DeckPlanV4); rail state dims the nacelles and the warp core.
// To redraw the ship later, swap the SVG and the positions in lib/shipmap.ts; nothing else changes.
import type { BoardId } from '../lib/board';
import { memo, useEffect, useRef, useState } from 'react';
import shipSvg from '../assets/ship.svg?raw';
import { RAIL, RANK, STATUS, railColor } from '../lib/lookups';
import { SHIP_MAP } from '../lib/shipmap';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';
import { CrewTokens, crewed } from './CrewTokens';
import { Icon } from './Icon';
import { Pips } from './Roster';
import type { RailFilter } from './SideRail';
import { ShipConsole, type ConsolePick } from './ShipConsole';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  pick: ConsolePick | null;
  onPick: (station: string, order?: string, from?: string) => void;
  onDept: (dept: string) => void;
  onBack: () => void;
  onBoard?: (b: BoardId) => void;
  onRelieve?: (id: string) => void;
}

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** What the tiles say: their role (rail and order), their rank, or nothing so the rooms show. */
export type Labels = 'role' | 'rank' | 'off';
const LABELS: [Labels, string][] = [['role', 'Role'], ['rank', 'Rank'], ['off', 'Off']];
const LABELS_KEY = 'hermes.shipLabels';

// The choice is remembered in this browser only. Storage can be blocked, so never rely on it.
function useLabels(): [Labels, (l: Labels) => void] {
  const [labels, setLabels] = useState<Labels>(() => {
    try { const v = localStorage.getItem(LABELS_KEY); if (v === 'role' || v === 'rank' || v === 'off') return v; } catch { /* no storage */ }
    return 'role';
  });
  const set = (l: Labels) => { setLabels(l); try { localStorage.setItem(LABELS_KEY, l); } catch { /* no storage */ } };
  return [labels, set];
}

// The SVG is our own file, never fixture text, so it is safe to insert as markup.
// memo keeps React from re-inserting it on every redraw.
const ShipArt = memo(function ShipArt() {
  return <div className="ship-art-svg" dangerouslySetInnerHTML={{ __html: shipSvg }} />;
});

export function ShipPlan({ ship, filter, pick, onPick, onDept, onBack, onBoard, onRelieve }: Props) {
  const selected = pick?.station ?? null;
  const artRef = useRef<HTMLDivElement>(null);
  const codexUp = ship.rail('codex') !== 'out';
  const claudeUp = ship.rail('claude') !== 'out';
  const localUp = ship.rail('local') !== 'out';
  const [labels, setLabels] = useLabels();

  // Nacelle and warp-core labels live inside the SVG, so set their text directly.
  useEffect(() => {
    const el = artRef.current;
    if (!el) return;
    const set = (id: string, text: string) => { const t = el.querySelector('#' + id); if (t) t.textContent = text; };
    set('lbl-codex', codexUp ? 'CODEX · PORT NACELLE · CHIEF · SYSTEMS · DIAGNOSTICS' : 'CODEX · WINDOW OUT · CREW IN QUARTERS');
    set('lbl-claude', claudeUp ? 'CLAUDE · STARBOARD NACELLE' : 'CLAUDE · WINDOW OUT');
    set('lbl-core', localUp ? '◂ WARP CORE · LOCAL QWEN' : '◂ WARP CORE COLD · OLLAMA DOWN');
  }, [codexUp, claudeUp, localUp]);

  const artStyle = {
    '--codex-glow': codexUp ? 1 : 0.16, '--codex-text': codexUp ? '#1a1206' : '#f0a948',
    '--claude-glow': claudeUp ? 1 : 0.16, '--claude-text': claudeUp ? '#1a1206' : '#e889b6',
    '--core-glow': localUp ? 1 : 0.18, '--conduit': localUp ? 0.3 : 0.08, '--core-text': localUp ? '#9fb0cc' : '#f08a7a',
    '--table-glow': 1,
  } as React.CSSProperties;

  return (
    <section className="hero" aria-label="Ship plan">
      <div className="hero-top">
        <p className="mono hero-label">MASTER SYSTEMS DISPLAY · SIDE ELEVATION · PICK A ROOM</p>
        <div className="hero-tools">
          <div className="labels-ctl" role="group" aria-label="Labels on the rooms">
            <span className="mono">LABELS</span>
            {LABELS.map(([id, label]) => (
              <button key={id} type="button" className="chip" aria-pressed={labels === id} onClick={() => setLabels(id)}>{label}</button>
            ))}
          </div>
          <Legend />
        </div>
      </div>
      <div className="ship-wrap">
      <div className="ship">
        <div className="ship-art" ref={artRef} style={artStyle} aria-hidden="true"><ShipArt /></div>
        <div className={'ship-tiles' + (labels === 'off' ? ' bare' : '')}>
          {ship.data.stations.stations.map((st) => (
            <Tile key={st.id} st={st} ship={ship} filter={filter} labels={labels} selected={selected === st.id} onPick={onPick} />
          ))}
          <CrewTokens ship={ship} filter={filter} selected={selected} slots={labels !== 'off'} onPick={onPick} />
        </div>
      </div>
      <ShipConsole ship={ship} pick={pick} onPick={onPick} onDept={onDept} onBack={onBack} onBoard={onBoard} onRelieve={onRelieve} />
      </div>
    </section>
  );
}

function Tile({ st, ship, filter, labels, selected, onPick }: {
  st: Station; ship: ShipView; filter: RailFilter; labels: Labels; selected: boolean; onPick: (id: string) => void;
}) {
  const at = (SHIP_MAP.places as Record<string, { x: number; y: number; w: number }>)[st.id];
  if (!at) return null;
  const off = ship.off(st);
  const acting = ship.actingFor(st.id);
  const cls = ['tile'];
  if (st.kind === 'place') cls.push('place');
  if (st.id === 'crewq' || st.id === 'lounge') cls.push('space-wide');
  if (st.status === 'reserved') cls.push('reserved');
  if (off) cls.push('off');
  if (filter !== 'all' && st.rail !== filter && st.kind !== 'place') cls.push('dim');
  const role = off ? `OFF · ${off.toUpperCase()}`
    : acting ? 'ACTING HEAD'
    : st.kind === 'place' ? 'PLACE'
    : st.status === 'live' ? RAIL[st.rail].label + (st.activeOrder ? ` · ${st.activeOrder}` : '')
    : STATUS[st.status].label;
  const style = {
    left: pct(at.x, SHIP_MAP.width), top: pct(at.y, SHIP_MAP.height), width: pct(at.w, SHIP_MAP.width),
    '--c': st.kind === 'place' ? 'var(--border-strong)' : railColor(st.rail),
    '--ls': STATUS[st.status].line,
  } as React.CSSProperties;
  return (
    <button type="button" className={cls.join(' ')} style={style} aria-pressed={selected}
      aria-label={`${st.name}, ${role.toLowerCase()}`} onClick={() => onPick(st.id)}>
      {/* A crewed station's icon is its crew token (CrewTokens.tsx), so the tile leaves it out. */}
      {!crewed(st) && <Icon path={(SHIP_MAP.icons as Record<string, string>)[st.id]} className="ticon" />}
      <span className="t1">{st.short}</span>
      {labels === 'rank' && st.kind === 'station'
        ? <span className="t2 rank">{RANK[st.rank].officer && <Pips rank={st.rank} />}{RANK[st.rank].short.toUpperCase()}</span>
        : <span className="t2">{role}</span>}
      {st.activeOrder && !off && <span className="busy" title={`Working on ${st.activeOrder}`} />}
    </button>
  );
}

function Legend() {
  const rails = ['local', 'codex', 'claude', 'mixed', 'captain'] as const;
  const lines = [['solid', 'Live'], ['dashed', 'Approved or proposed'], ['dotted', 'Name reserved']] as const;
  return (
    <div className="legend">
      {rails.map((r) => <span key={r}><i style={{ '--c': RAIL[r].color } as React.CSSProperties} />{RAIL[r].legend}</span>)}
      {lines.map(([ls, label]) => <span key={ls}><i className="line" style={{ '--ls': ls } as React.CSSProperties} />{label}</span>)}
    </div>
  );
}

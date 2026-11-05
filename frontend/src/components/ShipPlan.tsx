// The ship cutaway with a clickable tile on every room.
// The art is ship.svg (built from DeckPlanV4); rail state dims the nacelles and the warp core.
// To redraw the ship later, swap the SVG and the positions in lib/shipmap.ts; nothing else changes.
import { memo, useEffect, useRef } from 'react';
import shipSvg from '../assets/ship.svg?raw';
import { RAIL, STATUS, railColor } from '../lib/lookups';
import { SHIP_MAP } from '../lib/shipmap';
import type { ShipView } from '../lib/ship';
import type { Station } from '../types';
import { Icon } from './Icon';
import type { RailFilter } from './SideRail';
import { ShipConsole } from './ShipConsole';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  pick: { station: string; order?: string; from?: string } | null;
  onPick: (station: string, order?: string, from?: string) => void;
  onBack: () => void;
  onQuarters?: () => void;
}

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

// The SVG is our own file, never fixture text, so it is safe to insert as markup.
// memo keeps React from re-inserting it on every redraw.
const ShipArt = memo(function ShipArt() {
  return <div className="ship-art-svg" dangerouslySetInnerHTML={{ __html: shipSvg }} />;
});

export function ShipPlan({ ship, filter, pick, onPick, onBack, onQuarters }: Props) {
  const selected = pick?.station ?? null;
  const artRef = useRef<HTMLDivElement>(null);
  const codexUp = ship.rail('codex') !== 'out';
  const claudeUp = ship.rail('claude') !== 'out';
  const localUp = ship.rail('local') !== 'out';

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
        <Legend />
      </div>
      <div className="ship-wrap">
      <div className="ship">
        <div className="ship-art" ref={artRef} style={artStyle} aria-hidden="true"><ShipArt /></div>
        <div className="ship-tiles">
          {ship.data.stations.stations.map((st) => (
            <Tile key={st.id} st={st} ship={ship} filter={filter} selected={selected === st.id} onPick={onPick} />
          ))}
        </div>
      </div>
      <ShipConsole ship={ship} pick={pick} onPick={onPick} onBack={onBack} onQuarters={onQuarters} />
      </div>
    </section>
  );
}

function Tile({ st, ship, filter, selected, onPick }: { st: Station; ship: ShipView; filter: RailFilter; selected: boolean; onPick: (id: string) => void }) {
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
  const line = off ? `OFF · ${off.toUpperCase()}`
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
      aria-label={`${st.name}, ${line.toLowerCase()}`} onClick={() => onPick(st.id)}>
      <Icon path={(SHIP_MAP.icons as Record<string, string>)[st.id]} className="ticon" />
      <span className="t1">{st.short}</span>
      <span className="t2">{line}</span>
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

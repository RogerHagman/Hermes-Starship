// The ship as a hologram over the Holodeck's emitter: the real ship plan (ship.svg), tinted
// blue, with a button on every room. Rooms not built yet show dotted, drafts spun up here
// show dashed. While a draft is being placed, a ghost follows the pointer and a click sets it.
import { memo, useState } from 'react';
import shipSvg from '../../assets/ship.svg?raw';
import { pct, deckAt, DECK_ROWS, overlaps, type Draft } from '../../lib/holodeck';
import { SHIP_MAP } from '../../lib/shipmap';
import type { ShipView } from '../../lib/ship';

const PLACES = SHIP_MAP.places as Record<string, { x: number; y: number; w: number }>;
const W = SHIP_MAP.width, H = SHIP_MAP.height, TH = SHIP_MAP.tileHeight;

// The SVG is our own file, never fixture text, so it is safe to insert as markup.
const Art = memo(function Art() {
  return <div className="holo-ship-svg" dangerouslySetInnerHTML={{ __html: shipSvg }} />;
});

/** Where a draft would go: its deck's row, centred on the pointer, kept on the plan. */
export type Ghost = Pick<Draft, 'x' | 'y' | 'w' | 'deck'>;

interface Props {
  ship: ShipView;
  drafts: Draft[];
  picked: string | null;                    // a station id or a draft id
  placing: { w: number; short: string; id?: string } | null;
  onPick: (id: string) => void;
  onPlace: (g: Ghost) => void;
}

export function Hologram({ ship, drafts, picked, placing, onPick, onPlace }: Props) {
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const box = (x: number, y: number, w: number) => ({ left: pct(x, W), top: pct(y, H), width: pct(w, W), height: pct(TH, H) });

  // The pointer's spot on the plan, snapped to the nearest deck's row.
  const at = (e: React.MouseEvent<HTMLDivElement>): Ghost | null => {
    if (!placing) return null;
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width) return null;
    const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
    const deck = deckAt(py);
    const x = Math.round(Math.min(W - placing.w - 20, Math.max(20, px - placing.w / 2)) / 2) * 2;
    return { x, y: DECK_ROWS[deck], w: placing.w, deck };
  };
  const taken = ghost ? overlaps(ghost, drafts, placing?.id) : false;

  return (
    <div className={'holo-ship' + (placing ? ' placing' : '')}
      onPointerMove={(e) => setGhost(at(e))} onPointerLeave={() => setGhost(null)}
      onClick={(e) => { const g = at(e); if (g) onPlace(g); }}>
      <div className="holo-art" aria-hidden="true"><Art /></div>
      <div className="holo-rooms" role="group" aria-label="Rooms on the hologram">
        {ship.data.stations.stations.filter((s) => PLACES[s.id]).map((s) => {
          const p = PLACES[s.id];
          const cls = ['holo-room', s.kind === 'place' ? 'place' : s.status];
          return (
            <button key={s.id} type="button" className={cls.join(' ')} style={box(p.x, p.y, p.w)} disabled={!!placing}
              aria-pressed={picked === s.id} aria-label={`${s.name}, deck ${s.deck}`} title={s.name}
              onClick={(e) => { e.stopPropagation(); onPick(s.id); }}>
              <span>{s.short}</span>
            </button>
          );
        })}
        {drafts.filter((d) => d.id !== placing?.id).map((d) => (
          <button key={d.id} type="button" className="holo-room draft" style={box(d.x, d.y, d.w)} disabled={!!placing}
            aria-pressed={picked === d.id} aria-label={`${d.name}, draft, deck ${d.deck}`} title={`${d.name} · ${d.id}`}
            onClick={(e) => { e.stopPropagation(); onPick(d.id); }}>
            <span>{d.short}</span>
          </button>
        ))}
        {placing && ghost && (
          <span className={'holo-room ghost' + (taken ? ' taken' : '')} style={box(ghost.x, ghost.y, ghost.w)} aria-hidden="true">
            <span>{placing.short} · DECK {ghost.deck}{taken ? ' · TAKEN' : ''}</span>
          </span>
        )}
      </div>
      <span className="holo-scan" aria-hidden="true" />
    </div>
  );
}

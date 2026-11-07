// The room of a Bridge post: the picture, the things you can pick in it (each one lights up and
// opens a view), anything laid on the desk top, and the wall screen with the view on it. Number
// One's post, Helm, Navigation and the Main Viewscreen all use it; each passes its own picture,
// things, labels and views.
import { memo, useState, type ReactNode } from 'react';
import { ROOM, SCREEN, pct, type Spot } from '../../lib/post';

// The SVG is our own file, never fixture text, so it is safe to insert as markup.
const Art = memo(function Art({ svg }: { svg: string }) {
  return <div className="room-art-svg" dangerouslySetInnerHTML={{ __html: svg }} />;
});

interface Props<T extends string> {
  /** The room's name, for screen readers. */
  name: string;
  /** The picture (assets/<post>.svg?raw) and the prefix its ids carry (x, h, n, v). */
  art: string;
  prefix: string;
  spots: Spot<T>[];
  labels: Record<T, { name: string; meta?: string }>;
  /** The thing whose view is on screen, if any. */
  on: T | null;
  onPick: (id: T) => void;
  /** The two lines above the picture. */
  hero: string;
  hint: string;
  /** Extra data-* attributes for the picture, to light or animate parts of it. */
  attrs?: Record<string, string>;
  /** What lies on the desk top. */
  desk?: ReactNode;
  /** The view on the wall screen. */
  children: ReactNode;
  /** Where the wall screen sits, when the room has its own (Number One's is wider). */
  screen?: { x: number; y: number; w: number; h: number };
}

export function PostRoom<T extends string>({ name, art, prefix, spots, labels, on, onPick, hero, hint, attrs, desk, children, screen = SCREEN }: Props<T>) {
  const [hot, setHot] = useState<T | null>(null);
  // Light the picked thing, and the one under the pointer brighter. The ids come from the picture.
  const light = spots.map(({ id }) =>
    `.${prefix}-pic[data-on="${id}"] #${prefix}-hl-${id}{opacity:.55}.${prefix}-pic[data-hot="${id}"] #${prefix}-hl-${id}{opacity:1}`).join('');
  const data = Object.fromEntries(Object.entries(attrs ?? {}).map(([k, v]) => [`data-${k}`, v]));
  return (
    <section className="room" aria-label={name}>
      <style>{light}</style>
      <div className="hero-top">
        <p className="mono hero-label">{hero}</p>
        <p className="mono hero-label room-hint">{hint}</p>
      </div>
      <div className="room-wrap">
        <div className={`room-pic post-pic ${prefix}-pic`} data-hot={hot ?? ''} data-on={on ?? ''} {...data}>
          <div className="room-art" aria-hidden="true"><Art svg={art} /></div>
          {spots.map(({ id, box: [x, y, w, h], label: [lx, ly] }) => (
            <button key={id} type="button" className={`spot ${prefix}spot-${id}`} aria-pressed={on === id}
              aria-label={labels[id].meta ? `${labels[id].name}, ${labels[id].meta}` : labels[id].name}
              style={{ left: pct(x, ROOM.w), top: pct(y, ROOM.h), width: pct(w, ROOM.w), height: pct(h, ROOM.h) }}
              onPointerEnter={() => setHot(id)} onPointerLeave={() => setHot(null)}
              onFocus={() => setHot(id)} onBlur={() => setHot(null)}
              onClick={() => onPick(id)}>
              <span className="spot-label" style={{ left: pct(lx - x, w), top: pct(ly - y, h) }}>
                <span className="spot-name">{labels[id].name}</span>
                {labels[id].meta && <span className="spot-meta mono">{labels[id].meta}</span>}
              </span>
            </button>
          ))}
          {desk}
        </div>
        <div className="wall-slot" style={{
          '--x': pct(screen.x, ROOM.w), '--y': pct(screen.y, ROOM.h), '--w': pct(screen.w, ROOM.w), '--h': pct(screen.h, ROOM.h),
        } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </section>
  );
}

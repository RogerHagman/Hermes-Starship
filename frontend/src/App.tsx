// The boards: loads the fixtures once, keeps what both boards share (the rail filter, drills,
// who is relieved, who the comm badge speaks to), and shows the Bridge or the Captain's Quarters.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadFixtures } from './lib/data';
import { useBoard } from './lib/board';
import { DEPTS, RAIL } from './lib/lookups';
import { makeShipView, type Drills, type Relieved } from './lib/ship';
import type { Fixtures, RailId } from './types';
import { BridgeBoard } from './components/BridgeBoard';
import { Frame } from './components/Frame';
import { Header } from './components/Header';
import { QuartersBoard } from './components/quarters/QuartersBoard';
import { SideRail, type RailFilter } from './components/SideRail';
import { useFit, useFullscreenKey } from './lib/fit';

export function App() {
  const [data, setData] = useState<Fixtures | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [board, goBoard] = useBoard();
  const [filter, setFilter] = useState<RailFilter>('all');
  const [drills, setDrills] = useState<Drills>({});
  const [relieved, setRelieved] = useState<Relieved>(new Set());
  const [target, setTarget] = useState<string | null>(null);   // who the comm badge speaks to
  const [toast, showToast] = useToast();
  const fit = useFit();   // scale the 2560 x 1440 board to the window (see lib/fit.ts)
  useFullscreenKey();

  useEffect(() => { loadFixtures().then(setData, (e: Error) => setError(e.message)); }, []);

  // Recompute who is on duty whenever the fixtures, a drill or a relief change.
  const ship = useMemo(() => (data ? makeShipView(data, drills, relieved) : null), [data, drills, relieved]);

  const drill = (r: RailId) => {
    const out = !drills[r];
    setDrills({ ...drills, [r]: out });
    showToast(out ? `Drill: ${RAIL[r].legend} out. Its crew go to quarters.` : `Drill over: ${RAIL[r].legend} back up.`);
  };

  // Relieve or recall a station (screen only), and say who acts for its department now.
  const relieve = (id: string) => {
    if (!data) return;
    const st = data.stations.stations.find((s) => s.id === id);
    if (!st) return;
    const next = new Set(relieved);
    const recall = next.delete(id);
    if (!recall) next.add(id);
    setRelieved(next);
    const dept = DEPTS.find((d) => d.id === st.dept);
    const acting = st.head && st.dept ? makeShipView(data, drills, next).acting[st.dept] : undefined;
    const who = acting === 'dark' ? `Nobody can act for ${dept?.name}: its orders queue.`
      : acting ? `${data.stations.stations.find((s) => s.id === acting)?.short} acts as head of ${dept?.name}.`
      : 'Their orders wait.';
    showToast(recall ? `${st.short} is back at their post.` : `${st.short} relieved. ${who} Screen only.`);
  };

  return (
    <>
      <div className={`stage board-${board}` + (fit.fit ? ' fit' : '')}
        style={fit.fit ? { transform: `scale(${fit.scale})`, left: fit.left, top: fit.top } : undefined}>
        <Frame ship={ship} board={board} side={
          <SideRail registry={data?.ship.registry ?? 'HX-01'} board={board} onBoard={goBoard}
            filter={filter} onFilter={setFilter} drills={drills} onDrill={drill} onToast={showToast} />
        }>
          <main className="main">
            <Header ship={ship} board={board} error={error} />
            {ship && board === 'bridge' && (
              <BridgeBoard ship={ship} filter={filter} drills={drills} target={target} onTarget={setTarget} onToast={showToast}
                onQuarters={() => goBoard('quarters')} />
            )}
            {ship && board === 'quarters' && (
              <QuartersBoard ship={ship} filter={filter} drills={drills} target={target} onTarget={setTarget}
                onRelieve={relieve} onBridge={() => goBoard('bridge')} onToast={showToast} />
            )}
          </main>
        </Frame>
      </div>
      <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">{toast}</div>
    </>
  );
}

/** A short message at the bottom of the screen that fades after a few seconds. */
function useToast(): [string, (text: string) => void] {
  const [text, setText] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = useCallback((t: string) => {
    setText(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setText(''), 3600);
  }, []);
  return [text, show];
}

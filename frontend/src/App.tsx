// The Bridge: loads the fixtures once, keeps the screen state, and lays out the board.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadFixtures } from './lib/data';
import { RAIL } from './lib/lookups';
import { makeShipView, type Drills } from './lib/ship';
import type { Fixtures, RailId } from './types';
import { Frame } from './components/Frame';
import { Header } from './components/Header';
import { HailsPanel, OrdersPanel, RailsPanel } from './components/Panels';
import { LogPanel, RosterPanel } from './components/Roster';
import { ShipPlan } from './components/ShipPlan';
import { SideRail, type RailFilter } from './components/SideRail';
import { CommBadge } from './components/CommBadge';
import { useFit, useFullscreenKey } from './lib/fit';

export function App() {
  const [data, setData] = useState<Fixtures | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RailFilter>('all');
  const [drills, setDrills] = useState<Drills>({});
  const [open, setOpen] = useState<{ station: string; order?: string } | null>(null);
  const [target, setTarget] = useState<string | null>(null);   // who the comm badge speaks to
  const [toast, showToast] = useToast();
  const fit = useFit();   // scale the 2560 x 1440 board to the window (see lib/fit.ts)
  useFullscreenKey();

  useEffect(() => { loadFixtures().then(setData, (e: Error) => setError(e.message)); }, []);

  // Recompute who is on duty whenever the fixtures or a drill change.
  const ship = useMemo(() => (data ? makeShipView(data, drills) : null), [data, drills]);

  const drill = (r: RailId) => {
    const out = !drills[r];
    setDrills({ ...drills, [r]: out });
    showToast(out ? `Drill: ${RAIL[r].legend} out. Its crew go to quarters.` : `Drill over: ${RAIL[r].legend} back up.`);
  };
  // Picking the same thing again puts the console back on the watch.
  const openStation = (station: string, order?: string) => {
    const same = open?.station === station && open?.order === order;
    setOpen(same ? null : { station, order });
    setTarget(station);
  };
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div className={'stage' + (fit.fit ? ' fit' : '')}
        style={fit.fit ? { transform: `scale(${fit.scale})`, left: fit.left, top: fit.top } : undefined}>
      <Frame ship={ship} side={
        <SideRail registry={data?.ship.registry ?? 'HX-01'} filter={filter} onFilter={setFilter}
          drills={drills} onDrill={drill} onToast={showToast} />
      }>
        <main className="main">
          <Header ship={ship} error={error} />
          {ship && (
            <div className="grid">
              <ShipPlan ship={ship} filter={filter} pick={open} onPick={openStation} onBack={close} />
              <aside className="side">
                <RailsPanel ship={ship} drills={drills} />
                <HailsPanel ship={ship} picked={open?.order} onOpen={openStation} />
                <OrdersPanel ship={ship} filter={filter} picked={open?.order} onOpen={openStation} />
              </aside>
              <RosterPanel ship={ship} filter={filter} picked={open?.station} onOpen={(id) => openStation(id)} />
              <LogPanel ship={ship} />
              <CommBadge ship={ship} target={target} onToast={showToast} />
            </div>
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
    timer.current = setTimeout(() => setText(''), 3200);
  }, []);
  return [text, show];
}

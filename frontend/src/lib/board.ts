// Which board is on screen. The address bar keeps it (#/quarters), so a reload or a
// bookmark lands on the same board, and the browser's Back button goes back a board.
import { useCallback, useEffect, useState } from 'react';

export type BoardId = 'bridge' | 'quarters' | 'holodeck' | 'sensors' | 'engineering' | 'science' | 'ops' | 'computer';
export const BUILT_BOARDS: BoardId[] = ['bridge', 'quarters', 'holodeck', 'sensors', 'engineering', 'science', 'ops', 'computer'];

/** The stations and places whose own board is built: their console button opens it. */
export const OWN_BOARD: Partial<Record<string, BoardId>> = {
  captain: 'quarters', quarters: 'quarters', holo: 'holodeck', sensors: 'sensors',
  eng: 'engineering', sys: 'engineering', diag: 'engineering', science: 'science', ops: 'ops', computer: 'computer',
};

/** '#/quarters' -> 'quarters'. Anything unknown is the Bridge. */
export function boardFromHash(hash: string): BoardId {
  const id = hash.replace(/^#\/?/, '');
  return (BUILT_BOARDS as string[]).includes(id) ? (id as BoardId) : 'bridge';
}

export function useBoard(): [BoardId, (b: BoardId) => void] {
  const [board, setBoard] = useState<BoardId>(() => boardFromHash(window.location.hash));
  useEffect(() => {
    const sync = () => setBoard(boardFromHash(window.location.hash));
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  const go = useCallback((b: BoardId) => {
    setBoard(b);
    window.scrollTo(0, 0);
    // Some previews (a sandboxed frame) don't allow history changes. The board still switches.
    try { window.history.pushState(null, '', `#/${b}`); } catch { /* stays on screen only */ }
  }, []);
  return [board, go];
}

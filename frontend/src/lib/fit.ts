// The Bridge is drawn at 2560 x 1440, like the design boards. In a desktop-sized window the
// whole board is scaled to fit (letterboxed, never cropped), so the layout never changes.
// Below MIN_SCALE the text gets too small to read, so phones, tablets and small laptops get
// the reflowing, scrolling layout instead (the @container rules in landing.css).
// A 32:9 screen (5120 x 1440) gets the wide board: the same parts on a 5120 x 1440 stage,
// laid out by styles/wide.css. A 21:9 screen stays on the 2560 board.
import { createContext, useContext, useEffect, useState } from 'react';

export const BOARD = { w: 2560, h: 1440 };
export const WIDE = { w: 5120, h: 1440 };
/** Window width / height from which the wide board is used (32:9 is 3.56, 21:9 is 2.39). */
export const WIDE_ASPECT = 3;
export const MIN_SCALE = 0.6;

export interface Fit { fit: boolean; wide: boolean; scale: number; left: number; top: number }

export function fitBoard(vw: number, vh: number): Fit {
  // The wide board when the window has its shape and it stays readable, else the 2560 board.
  const wideScale = Math.min(vw / WIDE.w, vh / WIDE.h);
  const wide = vw / vh >= WIDE_ASPECT && wideScale >= MIN_SCALE;
  const board = wide ? WIDE : BOARD;
  const scale = Math.min(vw / board.w, vh / board.h);
  if (scale < MIN_SCALE || vw < vh) return { fit: false, wide: false, scale: 1, left: 0, top: 0 };
  return { fit: true, wide, scale, left: Math.round((vw - board.w * scale) / 2), top: Math.round((vh - board.h * scale) / 2) };
}

/** The fit for the current window, updated when the window is resized. */
export function useFit(): Fit {
  const measure = () => fitBoard(window.innerWidth, window.innerHeight);
  const [fit, setFit] = useState(measure);
  useEffect(() => {
    const onResize = () => setFit(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return fit;
}

/** F toggles full screen, as on the design boards (ignored while typing). */
export function useFullscreenKey() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.key !== 'f' && e.key !== 'F') return;
      if (e.ctrlKey || e.metaKey || e.altKey || el?.closest('input, textarea, select, [contenteditable]')) return;
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen?.().catch(() => undefined);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

/** True on the wide board (5120 x 1440). App.tsx sets it; a part that has wide art asks with useWide(). */
export const WideContext = createContext(false);
export const useWide = () => useContext(WideContext);

// The Bridge is drawn at 2560 x 1440, like the design boards. In a desktop-sized window the
// whole board is scaled to fit (letterboxed, never cropped), so the layout never changes.
// Below MIN_SCALE the text gets too small to read, so phones, tablets and small laptops get
// the reflowing, scrolling layout instead (the @container rules in landing.css).
import { useEffect, useState } from 'react';

export const BOARD = { w: 2560, h: 1440 };
export const MIN_SCALE = 0.6;

export interface Fit { fit: boolean; scale: number; left: number; top: number }

export function fitBoard(vw: number, vh: number): Fit {
  const scale = Math.min(vw / BOARD.w, vh / BOARD.h);
  if (scale < MIN_SCALE || vw < vh) return { fit: false, scale: 1, left: 0, top: 0 };
  return { fit: true, scale, left: Math.round((vw - BOARD.w * scale) / 2), top: Math.round((vh - BOARD.h * scale) / 2) };
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

// A 24 x 24 line icon from one SVG path.
export function Icon({ path, className }: { path?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d={path ?? 'M12 12h.01'} />
    </svg>
  );
}

// Quiet page dots for a console with more than one page: small hollow circles, the current
// one lit, each page's name on hover. Used by the Captain's chair and the Bridge stations.
export function Pager({ pages, page, onPage }: { pages: string[]; page: number; onPage: (i: number) => void }) {
  return (
    <span className="pager" role="group" aria-label="Pages">
      {pages.map((label, i) => (
        <button key={label} type="button" className="pager-dot" aria-pressed={page === i} aria-label={`Page ${i + 1}: ${label}`}
          data-tip={label} onClick={() => onPage(i)} />
      ))}
    </span>
  );
}

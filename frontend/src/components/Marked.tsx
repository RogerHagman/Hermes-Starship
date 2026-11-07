// Marks every SAMPLE word in a line of text, so sample data stands out on every board.
// Wrap a line in <Marked>…</Marked>: strings inside are split, anything else passes through.
import { Children, Fragment, type ReactNode } from 'react';
import { splitSample } from '../lib/sources';

function mark(text: string, key: string | number): ReactNode {
  const parts = splitSample(text);
  if (!parts.some((p) => p.sample)) return text;
  return (
    <Fragment key={key}>
      {parts.map((p, i) => (p.sample ? <span key={i} className="sample-tag">{p.text}</span> : p.text))}
    </Fragment>
  );
}

export function Marked({ children }: { children?: ReactNode }) {
  return <>{Children.map(children, (c, i) => (typeof c === 'string' ? mark(c, i) : c))}</>;
}

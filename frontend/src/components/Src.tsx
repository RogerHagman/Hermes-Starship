// Marks one panel by what it reads: nothing when live, a yellow SAMPLE (or PART SAMPLE) tag and frame
// when it shows the sample, and a red DOWN tag and frame when its live feed has stopped writing.
// Put <Src ids={[...]} /> inside the panel's .panel-head; the frame follows from the tag (CSS :has).
import { createContext, useContext } from 'react';
import type { Fixtures } from '../types';
import { panelSource, type SourceId } from '../lib/sources';

export const SrcData = createContext<Fixtures | null>(null);

const TEXT = { sample: 'SAMPLE', mixed: 'PART SAMPLE', stale: 'DOWN' } as const;

export function Src({ ids }: { ids: SourceId[] }) {
  const data = useContext(SrcData);
  if (!data) return null;
  const { state, why } = panelSource(ids, data);
  if (state === 'live') return null;
  return <span className={`mono src-tag src-tag-${state}`} title={why}>{TEXT[state]}</span>;
}

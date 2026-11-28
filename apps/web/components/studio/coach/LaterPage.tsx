'use client';

import { useStudio } from '../StudioContext';
import { ComingLater } from '../StudioStates';
import { PageHead } from '../PageHead';
import { getLaterContent, type LaterKey } from './later.content';

export function LaterPage({ which }: { which: LaterKey }) {
  const { locale } = useStudio();
  const t = getLaterContent(locale)[which];
  return (
    <>
      <PageHead title={t.title} />
      <ComingLater title={t.title} body={t.body} points={t.points} />
    </>
  );
}

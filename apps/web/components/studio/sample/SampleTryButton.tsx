'use client';

import { FlaskConical } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useSampleStore, type SampleEntry } from '@/lib/sample/sampleMode';
import { useStudio } from '../StudioContext';
import { getSampleContent } from './sample.content';

// "Try it with sample data", shown where Studio has no export yet.
export function SampleTryButton({ entry, primary = false }: { entry: SampleEntry; primary?: boolean }) {
  const { locale } = useStudio();
  const enter = useSampleStore((s) => s.enter);
  const router = useRouter();
  const go = () => { enter(entry); router.push('/app/results'); };
  return (
    <button type="button" className={primary ? 's-btn' : 's-btn sec'} onClick={go}>
      <FlaskConical size={14} />{getSampleContent(locale).tryIt}
    </button>
  );
}

import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

// Where "who joined and who left" will show once there is an earlier export to
// compare with. A dashed tile with a tiny timeline (this export, the next one)
// instead of greyed "+?" / "-?" numbers, which read like a bug.
export function NextExportState({ text, now, next, cta, href = '/' }: {
  text: string;
  now: string;
  next: string;
  cta: string;
  href?: string;
}) {
  return (
    <div className="s-next">
      <div className="s-next-line" aria-hidden="true">
        <span className="s-next-dot on" />
        <span className="s-next-track" />
        <span className="s-next-dot" />
      </div>
      <div className="s-next-labs" aria-hidden="true"><span>{now}</span><span>{next}</span></div>
      <p className="s-next-t">{text}</p>
      <Link href={href} className="s-lnk s-next-cta">{cta}<ArrowRight size={13} /></Link>
    </div>
  );
}

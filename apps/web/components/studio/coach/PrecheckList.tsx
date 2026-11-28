'use client';

import { CircleAlert, CircleCheck, CircleX, ListChecks } from 'lucide-react';
import type { PrecheckItem } from '@/lib/ai/precheck';
import { useStudio } from '../StudioContext';
import { getPrecheckContent } from './precheck.content';

const LV = { pass: 'good', warn: 'warn', fail: 'bad' } as const;
const Icon = ({ s }: { s: PrecheckItem['state'] }) => (s === 'pass' ? <CircleCheck size={17} /> : s === 'fail' ? <CircleX size={17} /> : <CircleAlert size={17} />);

// Check's rules counted in code, shown as the draft changes. Free for everyone:
// no model call.
export function PrecheckList({ items, free }: { items: PrecheckItem[]; free: boolean }) {
  const { locale } = useStudio();
  const t = getPrecheckContent(locale);
  return (
    <section className="s-card">
      <div className="s-hd"><h3 className="s-h3 s-row" style={{ gap: 6 }}><ListChecks size={15} />{t.title}</h3>{free && <span className="s-badge good">{t.free}</span>}</div>
      <p className="s-sub-t s-pad" style={{ margin: 0, paddingTop: 0, fontSize: 12.5 }}>{t.sub}</p>
      {items.map((x) => {
        const r = t.rules[x.id];
        const line = x.id === 'posting_day' && x.state === 'warn' ? t.nextDay(t.days[Number(x.params.next)] ?? '') : r[x.state](x.params);
        return (
          <div key={x.id} className="s-find">
            <span className={`s-si ${LV[x.state]}`}><Icon s={x.state} /></span>
            <div><h3 className="s-h3">{r.title}</h3><p>{line}</p></div>
            <span className="s-badge" style={{ fontSize: 11 }}>{t.sources[x.source]}</span>
          </div>
        );
      })}
    </section>
  );
}

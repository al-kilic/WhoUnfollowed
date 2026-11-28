import { Ic } from '@/components/home/icons';
import type { PricingContent } from './content';

// Under the plans: the privacy promise, then the FAQ (the same answers the
// FAQPage structured data in page.tsx is built from).
export function PricingPrivacy({ c }: { c: PricingContent }) {
  return (
    <section className="pr-priv">
      <div className="wrap">
        <div className="pr-priv-c gl">
          <span className="pr-priv-i"><Ic n="lock" s={18} /></span>
          <div>
            <b>{c.privacyTitle}</b>
            <ul>{c.privacy.map((l) => <li key={l}><Ic n="check" s={14} />{l}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingFaq({ title, faq }: { title: string; faq: { q: string; a: string }[] }) {
  return (
    <section className="sec qa pr-faq" id="faq">
      <div className="wrap">
        <div className="qa-h"><h2>{title}</h2></div>
        <div>
          {faq.map(({ q, a }, i) => (
            <details key={q} open={i === 0}>
              <summary>{q}<span className="pm" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

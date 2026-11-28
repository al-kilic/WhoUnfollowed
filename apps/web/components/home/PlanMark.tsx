// Shared by the home page pricing section and /pricing, so both read as one
// family: a small geometric mark per plan and a price set in clear numerals.

export type PlanKind = 'free' | 'pro' | 'life';

// One dot for Free, a small constellation for Pro AI, a closed ring for Lifetime.
export function PlanMark({ kind }: { kind: PlanKind }) {
  return (
    <svg className={`pm pm-${kind}`} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      {kind === 'free' && (<><circle cx="14" cy="14" r="12.5" fill="none" stroke="currentColor" strokeOpacity=".28" /><circle cx="14" cy="14" r="3.5" fill="currentColor" /></>)}
      {kind === 'pro' && (
        <>
          <path d="M7 19 L13 9 L21 13 L17 21 Z" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="7" cy="19" r="2.4" fill="currentColor" /><circle cx="13" cy="9" r="2.4" fill="currentColor" />
          <circle cx="21" cy="13" r="2.4" fill="currentColor" /><circle cx="17" cy="21" r="1.7" fill="currentColor" fillOpacity=".7" />
        </>
      )}
      {kind === 'life' && (<><circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="14" cy="14" r="5.5" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.2" /></>)}
    </svg>
  );
}

// "$9.99" as a small currency sign, big whole number and small cents.
export function PriceNum({ n }: { n: number }) {
  const [int, dec] = n.toFixed(2).split('.');
  const cents = dec && dec !== '00' ? `.${dec}` : '';
  return <span className="pn"><span className="pn-c">$</span>{int}{cents && <span className="pn-d">{cents}</span>}</span>;
}

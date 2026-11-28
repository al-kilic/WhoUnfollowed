'use client';

import { useEffect, useState } from 'react';

// Phones only: once the plan cards are out of view, a slim bar keeps the Pro AI
// price and button at hand. No timer, no close button needed, it just stays
// out of the way of the content above it.
export function PricingSticky({ label, price, note, disabled, onBuy }: { label: string; price: string; note: string; disabled: boolean; onBuy: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const cards = document.getElementById('plans');
    const faq = document.getElementById('faq');
    if (!cards || typeof IntersectionObserver === 'undefined') return;
    let cardsVisible = true, faqVisible = false;
    const update = () => setShow(!cardsVisible && !faqVisible && cards.getBoundingClientRect().top < 0);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === cards) cardsVisible = e.isIntersecting;
        if (e.target === faq) faqVisible = e.isIntersecting;
      }
      update();
    });
    io.observe(cards);
    if (faq) io.observe(faq);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`pr-sticky${show ? ' on' : ''}`} aria-hidden={!show}>
      <div><b>{price}</b><span>{note}</span></div>
      <button type="button" className="btn pbtn pri2" tabIndex={show ? 0 : -1} disabled={disabled} onClick={onBuy}>{label}</button>
    </div>
  );
}

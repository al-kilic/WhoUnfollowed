/**
 * Pricing page FAQ.
 *
 * Lives in its own module (not inside PricingClient) so the server component in
 * page.tsx can emit FAQPage JSON-LD from the exact same source. Schema.org
 * markup must match the visible on-page text, and sharing one array is the only
 * way to guarantee the two never drift apart.
 */
export interface PricingFaqItem {
  q: string;
  a: string;
}

export const PRICING_FAQ: PricingFaqItem[] = [
  {
    q: 'Is it really free?',
    a: 'Yes. The core app (see who unfollowed you, who doesn\'t follow back, CSV export) is free forever and needs no account. Pro is optional and adds history, cloud sync, and trends.',
  },
  {
    q: 'Does Pro auto-renew?',
    a: 'No. It\'s a one-time payment that unlocks Pro for 30 or 365 days. When it runs out, buy again if you want to keep going. No recurring charge, ever.',
  },
  {
    q: 'Why charge for Pro at all?',
    a: 'To keep the lights on. Pro covers servers and storage so the free app stays free, fast, and independent. No ads, no investors, no selling your data.',
  },
  {
    q: 'Do I need to give you my Instagram password?',
    a: 'Never. You download your own data from Instagram and upload the ZIP here. We have no connection to Instagram whatsoever.',
  },
  {
    q: 'Is my Instagram data safe?',
    a: 'Yes. ZIP parsing happens entirely in your browser, so nothing is sent to us. Cloud-synced snapshots are encrypted in your browser before leaving your device. We store only blobs we cannot read.',
  },
];

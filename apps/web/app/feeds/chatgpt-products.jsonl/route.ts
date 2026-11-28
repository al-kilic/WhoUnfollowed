import { PRO_AI_PRICE_USD, TOPUP_PRICE_USD, TOPUP_VALID_MONTHS } from '@/lib/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// Product feed for ChatGPT's Business Hub ("Use a hosted URL"), in OpenAI's
// JSONL product schema. Built from lib/pricing.ts so a price change (like the
// Jan 1 launch-price end) reaches ChatGPT on its next fetch, no re-upload.
// $0 items are rejected by the spec, so the free plan is only mentioned.
// Copy rules: say "the coach", never name the engine.
const base = {
  brand: 'WhoUnfollowed',
  seller_name: 'WhoUnfollowed',
  seller_url: SITE_URL,
  url: `${SITE_URL}/instagram-coach`,
  image_url: `${SITE_URL}/logo.png`,
  availability: 'in_stock',
  condition: 'new',
  product_category: 'Software > Computer Software > Business & Productivity Software',
  target_countries: ['US'],
  store_country: 'US',
  is_eligible_search: true,
};

const COACH = 'A coach that remembers your Instagram account, drafts captions, carousels and Reel scripts in your voice, checks a post before you share it and plans your weeks with posting-day reminders. Includes who unfollowed you by name, every export kept, Radar and encrypted cloud sync. Works from the data export you download from Instagram, so you never share your password; your export is read in your browser. Seeing who doesn\'t follow you back stays free with no account.';

const money = (n: number) => `${n.toFixed(2)} USD`;

export function GET(): Response {
  const items = [
    { ...base, item_id: 'WU-PRO-AI-MONTHLY', title: 'WhoUnfollowed Pro AI, monthly plan', price: money(PRO_AI_PRICE_USD.monthly), description: `${COACH} Billed monthly, cancel any time.` },
    { ...base, item_id: 'WU-PRO-AI-YEARLY', title: 'WhoUnfollowed Pro AI, yearly plan', price: money(PRO_AI_PRICE_USD.yearly), description: `${COACH} Billed yearly, about $${(PRO_AI_PRICE_USD.yearly / 12).toFixed(2)} a month. Cancel any time.` },
    { ...base, item_id: 'WU-PRO-AI-REFILL', title: 'WhoUnfollowed Pro AI refill, one extra month of coach use', url: `${SITE_URL}/pricing`, price: money(TOPUP_PRICE_USD), description: `One more month of coach use for members on a paid plan who used up this month's allowance. One-time purchase, valid for ${TOPUP_VALID_MONTHS} months. Requires an active WhoUnfollowed paid plan.` },
  ];
  return new Response(items.map((i) => JSON.stringify(i)).join('\n') + '\n', {
    headers: { 'Content-Type': 'application/jsonl; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

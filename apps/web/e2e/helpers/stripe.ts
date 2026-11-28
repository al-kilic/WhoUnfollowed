import Stripe from 'stripe';
import type { APIRequestContext } from '@playwright/test';
import { E2E_WEBHOOK_SECRET, e2eEnv } from '../env';
import type { TestUser } from './db';

// Stripe events, signed exactly like Stripe signs them, posted to the app's
// own webhook. Nothing here talks to Stripe.
const stripe = new Stripe('sk_test_e2e_placeholder');
const now = () => Math.floor(Date.now() / 1000);
const DAY = 86_400;

export async function sendEvent(request: APIRequestContext, type: string, object: Record<string, unknown>): Promise<number> {
  const payload = JSON.stringify({ id: `evt_e2e_${Math.random().toString(36).slice(2)}`, object: 'event', type, api_version: '2026-05-27.dahlia', created: now(), data: { object }, livemode: false, pending_webhooks: 1, request: { id: null, idempotency_key: null } });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret: E2E_WEBHOOK_SECRET });
  const res = await request.post('/api/webhooks/stripe', { data: payload, headers: { 'stripe-signature': header, 'content-type': 'application/json' } });
  return res.status();
}

export interface SubOptions { interval?: 'month' | 'year'; status?: string; cancelAtPeriodEnd?: boolean }

export function subscription(user: TestUser, o: SubOptions = {}): Record<string, unknown> {
  const end = now() + (o.interval === 'year' ? 365 : 30) * DAY;
  return {
    id: user.subscriptionId,
    object: 'subscription',
    customer: user.customerId,
    status: o.status ?? 'active',
    start_date: now() - DAY,
    cancel_at_period_end: !!o.cancelAtPeriodEnd,
    cancel_at: o.cancelAtPeriodEnd ? end : null,
    metadata: { userId: user.id, type: 'pro_ai', interval: o.interval === 'year' ? 'yearly' : 'monthly', locale: 'en' },
    items: { object: 'list', data: [{ id: 'si_e2e', object: 'subscription_item', current_period_start: now() - DAY, current_period_end: end, price: { id: (o.interval === 'year' ? e2eEnv().STRIPE_PRICE_PRO_AI_YEARLY : e2eEnv().STRIPE_PRICE_PRO_AI_MONTHLY) ?? 'price_e2e', object: 'price', unit_amount: 999, currency: 'usd', recurring: { interval: o.interval ?? 'month', interval_count: 1 } } }] },
  };
}

export function topupSession(user: TestUser, id = `cs_e2e_${Math.random().toString(36).slice(2)}`): Record<string, unknown> {
  return {
    id,
    object: 'checkout.session',
    mode: 'payment',
    payment_status: 'paid',
    status: 'complete',
    amount_total: 499,
    currency: 'usd',
    customer: user.customerId,
    customer_email: user.email,
    customer_details: { email: user.email },
    metadata: { type: 'topup', userId: user.id, locale: 'en' },
  };
}

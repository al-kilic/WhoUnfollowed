export function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Where a message goes. One Telegram chat got too busy to read, so each kind
// can go somewhere of its own:
//   alerts  – something is broken or paused (AI spend cap, email limits, uptime)
//   sales   – money in or out (purchases, subscriptions, top-ups, cancellations)
//   inbox   – people writing to us (contact form, feedback)
//   reports – scheduled summaries (daily email report, analytics, upload health)
// Set TELEGRAM_CHAT_ALERTS / _SALES / _INBOX / _REPORTS to a chat id, or to
// "chatId:topicId" for a topic in a forum group. Anything unset falls back to
// TELEGRAM_CHAT_ID, so nothing changes until the new variables exist.
export type TelegramKind = 'alerts' | 'sales' | 'inbox' | 'reports';

const ENV_FOR: Record<TelegramKind, string> = {
  alerts: 'TELEGRAM_CHAT_ALERTS',
  sales: 'TELEGRAM_CHAT_SALES',
  inbox: 'TELEGRAM_CHAT_INBOX',
  reports: 'TELEGRAM_CHAT_REPORTS',
};

export function telegramTarget(kind: TelegramKind, env: Record<string, string | undefined> = process.env): { chatId: string; threadId?: number } | null {
  const raw = (env[ENV_FOR[kind]] || env.TELEGRAM_CHAT_ID || '').trim();
  if (!raw) return null;
  // Chat ids can be negative ("-100123"), so split on the last colon only.
  const i = raw.lastIndexOf(':');
  if (i > 0) {
    const thread = Number(raw.slice(i + 1));
    if (Number.isInteger(thread) && thread > 0) return { chatId: raw.slice(0, i), threadId: thread };
  }
  return { chatId: raw };
}

export async function sendTelegramMessage(text: string, kind: TelegramKind = 'alerts'): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const target = telegramTarget(kind);
  if (!token || !target) {
    return { ok: false, error: 'Telegram not configured' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: target.chatId,
        ...(target.threadId ? { message_thread_id: target.threadId } : {}),
        text,
        parse_mode: 'HTML',
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Telegram API responded ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

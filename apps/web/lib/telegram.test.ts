import { describe, expect, it } from 'vitest';
import { telegramTarget } from './telegram';

describe('telegramTarget', () => {
  it('falls back to the main chat when a kind has no chat of its own', () => {
    expect(telegramTarget('sales', { TELEGRAM_CHAT_ID: '-1001' })).toEqual({ chatId: '-1001' });
  });
  it('uses the chat set for that kind', () => {
    expect(telegramTarget('sales', { TELEGRAM_CHAT_ID: '-1001', TELEGRAM_CHAT_SALES: '-2002' })).toEqual({ chatId: '-2002' });
  });
  it('reads a forum topic after the last colon, keeping negative ids', () => {
    expect(telegramTarget('inbox', { TELEGRAM_CHAT_INBOX: '-100555:7' })).toEqual({ chatId: '-100555', threadId: 7 });
  });
  it('ignores a topic that is not a positive number', () => {
    expect(telegramTarget('alerts', { TELEGRAM_CHAT_ALERTS: '-100555:x' })).toEqual({ chatId: '-100555:x' });
  });
  it('returns null when nothing is configured', () => {
    expect(telegramTarget('reports', {})).toBeNull();
  });
});

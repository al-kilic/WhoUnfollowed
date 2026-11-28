import type { AiChatTurn } from '@ig-tracker/core';
import type { ChatTurn } from './provider';

// The chat as real turns: everything before the latest question, starting
// with the member (a leading coach greeting is dropped). Coach turns are sent
// in the same JSON shape the coach answers in, and every past turn renders the
// same way each time, so the cached prefix holds.
export function chatTurns(messages: readonly AiChatTurn[]): { history: ChatTurn[]; latest: string; first: string } {
  const latest = messages[messages.length - 1]!.text;
  let past = messages.slice(0, -1);
  while (past[0]?.role === 'coach') past = past.slice(1);
  const history = past.map((m): ChatTurn => (m.role === 'user' ? { role: 'user', text: m.text } : { role: 'assistant', text: JSON.stringify({ answer: m.text }) }));
  return { history, latest, first: past[0]?.text ?? latest };
}

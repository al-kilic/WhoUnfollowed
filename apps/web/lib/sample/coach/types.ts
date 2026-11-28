import type { AiChat, AiCheck, AiIdeas, AiInsights, AiPlan, AiRead, aiPostFormats } from '@ig-tracker/core';

type AiPostFormat = (typeof aiPostFormats)[number];

// Pre-written coach output for the sample account, in one language. Every
// fact traces back to something a real member's coach would have: the three
// exports (followers, follow dates, who came and went), the posts she logged
// with their results, her settings (posting days, time, tone) and her goal.
// The numbers come from lib/sample/sampleSnapshot.ts.
export interface SampleCoach {
  read: AiRead;
  // Ask: example conversations that lean on memory and the exports.
  chats: { title: string; turns: { q: string; a: AiChat }[] }[];
  // The answer to any new question typed in sample mode.
  sampleReply: AiChat;
  draft: { topic: string; options: { text: string; why: string }[] };
  check: { format: AiPostFormat; hook: string; caption: string; result: AiCheck };
  ideas: { theme: string; ideas: AiIdeas['ideas'] };
  plan: AiPlan;
  posted: { format: AiPostFormat; title: string; postedAt: string; score: number | null; results: { likes: number; saves: number; newFollowers: number } }[];
  insights: AiInsights;
  goalNote: string;
  memory: string;
}

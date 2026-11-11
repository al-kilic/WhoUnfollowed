import { NextResponse } from 'next/server';
import { summarizeCspReport } from '@/lib/security/csp';

// Receives Content-Security-Policy violation reports (report-only for now) and
// writes one short line per report to the container log. Nothing is stored:
// only the directive, the blocked origin and the page path, never a full URL.
// Read them with: docker logs ig-tracker-web-1 2>&1 | grep '\[csp\]'
export const dynamic = 'force-dynamic';

const MAX_BODY = 8_000;
const MAX_LINES_PER_HOUR = 300;
let windowStart = Date.now();
let linesThisWindow = 0;

export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return new NextResponse(null, { status: 204 });
    const summary = summarizeCspReport(JSON.parse(text));
    if (summary) {
      if (Date.now() - windowStart > 3_600_000) { windowStart = Date.now(); linesThisWindow = 0; }
      if (linesThisWindow < MAX_LINES_PER_HOUR) {
        linesThisWindow += 1;
        console.log(`[csp] ${summary.directive} blocked=${summary.blocked} page=${summary.page}`);
      }
    }
  } catch {
    // Malformed report: ignore.
  }
  return new NextResponse(null, { status: 204 });
}

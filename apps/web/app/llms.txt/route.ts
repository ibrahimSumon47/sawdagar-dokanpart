import { llmsText } from '../../lib/llmsText';

export const dynamic = 'force-static';

/** Serves the AI-readable repository summary as plain text at `/llms.txt`. */
export function GET() {
  return new Response(llmsText, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

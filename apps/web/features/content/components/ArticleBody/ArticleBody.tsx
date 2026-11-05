import { sanitizeRichText } from '../../richText';

export interface ArticleBodyProps {
  /** Stored text: plain paragraphs, or editor HTML for Journal posts. */
  body: string;
  /** plain splits blank lines into paragraphs; rich renders sanitised editor HTML. */
  format?: 'plain' | 'rich';
}

const richClasses =
  'text-base leading-relaxed text-ink [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 ' +
  '[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic ' +
  '[&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:leading-snug ' +
  '[&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:leading-snug ' +
  '[&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:overflow-x-auto ' +
  '[&_pre]:rounded-sm [&_pre]:bg-surface-muted [&_pre]:p-4 [&_pre]:text-sm ' +
  '[&_ul]:list-disc [&_ul]:pl-6';

/** Renders stored article text as readable paragraphs, or editor HTML for Journal posts. */
export function ArticleBody({ body, format = 'plain' }: ArticleBodyProps) {
  if (format === 'rich') {
    // Sanitised on save; run again here so a row edited outside the CMS cannot inject markup.
    return (
      <div className={richClasses} dangerouslySetInnerHTML={{ __html: sanitizeRichText(body) }} />
    );
  }

  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-base leading-relaxed text-ink">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  );
}

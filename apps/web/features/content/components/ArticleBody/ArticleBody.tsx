export interface ArticleBodyProps {
  /** Plain text with blank lines between paragraphs. */
  body: string;
}

/** Renders stored article text as readable paragraphs. */
export function ArticleBody({ body }: ArticleBodyProps) {
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

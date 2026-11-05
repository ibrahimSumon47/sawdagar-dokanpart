import { describe, expect, it } from 'vitest';
import { hasRichTextContent, sanitizeRichText } from './richText';

describe('sanitizeRichText', () => {
  it('keeps the tags the editor can create', () => {
    const html =
      '<h2>Weaving</h2><p>Jamdani is <strong>hand woven</strong>.</p><ul><li>Fine</li></ul>';
    expect(sanitizeRichText(html)).toBe(html);
  });

  it('drops scripts, styles and event handlers', () => {
    const html = '<p onclick="steal()">Hi</p><script>alert(1)</script><style>p{}</style>';
    expect(sanitizeRichText(html)).toBe('<p>Hi</p>');
  });

  it('turns a pasted first level heading into a section heading', () => {
    expect(sanitizeRichText('<h1>Title</h1>')).toBe('<h2>Title</h2>');
  });

  it('keeps https links and adds rel', () => {
    expect(sanitizeRichText('<p><a href="https://example.com">Read</a></p>')).toBe(
      '<p><a href="https://example.com" rel="noopener noreferrer">Read</a></p>',
    );
  });

  it('drops javascript links', () => {
    expect(sanitizeRichText('<p><a href="javascript:alert(1)">x</a></p>')).toBe(
      '<p><a rel="noopener noreferrer">x</a></p>',
    );
  });

  it('drops images', () => {
    expect(sanitizeRichText('<p><img src="https://example.com/a.jpg" /></p>')).toBe('<p></p>');
  });
});

describe('hasRichTextContent', () => {
  it('is false for markup without text', () => {
    expect(hasRichTextContent('<p></p><p>   </p>')).toBe(false);
  });

  it('is true when words remain', () => {
    expect(hasRichTextContent('<p>Jamdani</p>')).toBe(true);
  });
});

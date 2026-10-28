import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('identifies the demo and presents English and Bangla content', () => {
    const html = renderToStaticMarkup(<Welcome />);
    expect(html).toContain('Demo store, sandbox payments');
    expect(html).toContain('Every dokan, one marketplace.');
    expect(html).toContain('lang="bn"');
    expect(html).toContain('সওদাগর দোকানপাট');
    expect(html).toContain('https://github.com/ibrahimSumon47/sawdagar-dokanpart');
  });
});

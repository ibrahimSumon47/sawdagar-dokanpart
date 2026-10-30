import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { llmsText } from './llmsText';

const rootFile = path.join(process.cwd(), '..', '..', 'llms.txt');

describe('llms.txt', () => {
  it('matches the copy committed at the repository root', () => {
    const rootCopy = readFileSync(rootFile, 'utf8').replace(/\r\n/g, '\n');
    expect(rootCopy).toBe(llmsText);
  });

  it('names the live site, repository and a demo account', () => {
    expect(llmsText).toContain('https://sawdagar-dokanpart.vercel.app');
    expect(llmsText).toContain('https://github.com/ibrahimSumon47/sawdagar-dokanpart');
    expect(llmsText).toContain('buyer@demo.sawdagar.test');
  });
});

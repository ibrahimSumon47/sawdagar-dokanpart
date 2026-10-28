import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(fileURLToPath(new URL('./theme.css', import.meta.url)), 'utf8');

function declarations(block: string): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const match of block.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6});/gi)) {
    tokens.set(match[1], match[2].toLowerCase());
  }
  return tokens;
}

const themeBlock = /@theme \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? '';
const darkBlock = /\[data-theme='dark'\] \{([\s\S]*?)\n {2}\}/.exec(css)?.[1] ?? '';

const light = declarations(themeBlock);
const dark = declarations(darkBlock);

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const red = channel(Number.parseInt(value.slice(0, 2), 16));
  const green = channel(Number.parseInt(value.slice(2, 4), 16));
  const blue = channel(Number.parseInt(value.slice(4, 6), 16));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: string, background: string): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const textPairs = [
  ['ink', 'background'],
  ['ink', 'surface'],
  ['ink-muted', 'background'],
  ['accent', 'background'],
  ['accent-contrast', 'accent'],
] as const;

describe('design tokens', () => {
  it('defines every light token in the dark theme too', () => {
    expect(light.size).toBeGreaterThan(10);
    for (const name of light.keys()) {
      expect(dark.has(name), `dark theme is missing --color-${name}`).toBe(true);
    }
  });

  it('keeps text and interactive colours at WCAG AA contrast in light mode', () => {
    for (const [foreground, background] of textPairs) {
      const ratio = contrast(light.get(foreground)!, light.get(background)!);
      expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps text and interactive colours at WCAG AA contrast in dark mode', () => {
    for (const [foreground, background] of textPairs) {
      const ratio = contrast(dark.get(foreground)!, dark.get(background)!);
      expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('defaults the document to the light theme', () => {
    expect(/color-scheme: light/.test(css)).toBe(true);
    expect(themeBlock).toContain('--color-background: #faf7f2');
  });
});

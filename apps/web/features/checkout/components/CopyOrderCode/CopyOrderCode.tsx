'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export interface CopyOrderCodeProps {
  code: string;
  copyLabel: string;
  copiedLabel: string;
}

/** Copies the order code to the clipboard and confirms it for a few seconds. */
export function CopyOrderCode({ code, copyLabel, copiedLabel }: CopyOrderCodeProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line bg-background px-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

'use client';

import { Button } from '@sd/ui';
import { useState } from 'react';
import type { SiteLink } from '../../../content/settingsTypes';
import { control, hint, label } from '../SettingsForm/fieldStyles';

/** Strings the link editor needs, kept plain so they cross to the client. */
export interface SettingsLinksEditorCopy {
  title: string;
  description: string;
  empty: string;
  add: string;
  remove: string;
  labelEn: string;
  labelBn: string;
  href: string;
}

export interface SettingsLinksEditorProps {
  /** Form field that carries the list, either "navigation" or "footerLinks". */
  name: 'navigation' | 'footerLinks';
  initialLinks: readonly SiteLink[];
  /** Most links this menu accepts. */
  max: number;
  copy: SettingsLinksEditorCopy;
}

const emptyLink: SiteLink = { labelEn: '', labelBn: '', href: '' };

/**
 * Adds, edits and removes one menu's links. The finished list travels to the
 * server as JSON in a hidden field, so a save is still a single form post.
 */
export function SettingsLinksEditor({ name, initialLinks, max, copy }: SettingsLinksEditorProps) {
  const [links, setLinks] = useState<SiteLink[]>(initialLinks.map((link) => ({ ...link })));

  const update = (index: number, field: keyof SiteLink, value: string) => {
    setLinks((current) =>
      current.map((link, position) => (position === index ? { ...link, [field]: value } : link)),
    );
  };

  return (
    <section className="rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-lg text-ink">{copy.title}</h2>
      <p className={hint}>{copy.description}</p>
      <input type="hidden" name={name} value={JSON.stringify(links)} />

      {links.length === 0 ? <p className="mt-3 text-sm text-ink-muted">{copy.empty}</p> : null}

      <ol className="mt-3 space-y-3">
        {links.map((link, index) => (
          <li key={index} className="grid gap-3 rounded-sm border border-line p-3 sm:grid-cols-3">
            <label className={label}>
              {copy.labelEn}
              <input
                type="text"
                maxLength={60}
                value={link.labelEn}
                onChange={(event) => update(index, 'labelEn', event.target.value)}
                className={control}
              />
            </label>
            <label className={label}>
              {copy.labelBn}
              <input
                type="text"
                maxLength={60}
                value={link.labelBn}
                onChange={(event) => update(index, 'labelBn', event.target.value)}
                className={control}
              />
            </label>
            <label className={label}>
              {copy.href}
              <input
                type="text"
                maxLength={300}
                value={link.href}
                onChange={(event) => update(index, 'href', event.target.value)}
                className={control}
              />
            </label>
            <div className="sm:col-span-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setLinks((current) => current.filter((_, at) => at !== index))}
              >
                {copy.remove}
              </Button>
            </div>
          </li>
        ))}
      </ol>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-3"
        disabled={links.length >= max}
        onClick={() => setLinks((current) => [...current, { ...emptyLink }])}
      >
        {copy.add}
      </Button>
    </section>
  );
}

'use client';

import { Badge, Button } from '@sd/ui';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Dictionary, Locale } from '../../../../i18n';
import { reorderSectionsAction } from '../../../content/sectionActions';
import type { CmsSectionRecord } from '../../../content/sectionQueries';

export interface CmsSectionOrderProps {
  /** Sections in their saved display order. */
  sections: readonly CmsSectionRecord[];
  copy: Dictionary['admin'];
  locale: Locale;
}

const tone = {
  draft: 'neutral',
  scheduled: 'warning',
  published: 'success',
  archived: 'neutral',
} as const;

/**
 * Homepage section list with drag and keyboard reordering. The list updates
 * immediately and is written back through a server action; on failure the
 * previous order is restored so the screen never lies about what is saved.
 */
export function CmsSectionOrder({ sections, copy, locale }: CmsSectionOrderProps) {
  const [order, setOrder] = useState(() => sections.map((section) => section.id));
  const [dragged, setDragged] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const byId = new Map(sections.map((section) => [section.id, section]));

  function commit(next: string[], previous: string[]) {
    setOrder(next);
    setError(null);
    startTransition(async () => {
      const result = await reorderSectionsAction(next);
      if (!result.ok) {
        setOrder(previous);
        setError(result.error === 'invalid' ? copy.sectionOrderInvalid : copy.sectionOrderFailed);
      }
    });
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next, order);
  }

  function drop(targetId: string) {
    if (!dragged || dragged === targetId) return;
    const next = order.filter((id) => id !== dragged);
    next.splice(order.indexOf(targetId), 0, dragged);
    commit(next, order);
    setDragged(null);
  }

  const statusLabel = {
    draft: copy.statusDraft,
    scheduled: copy.statusScheduled,
    published: copy.statusPublished,
    archived: copy.statusArchived,
  };
  const kindLabel = {
    hero: copy.kindHero,
    collections: copy.kindCollections,
    banner: copy.kindBanner,
  };

  return (
    <div>
      {error ? (
        <p
          role="status"
          className="mb-3 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-ink"
        >
          {error}
        </p>
      ) : null}
      <ol aria-busy={pending} className="space-y-2">
        {order.map((id, index) => {
          const section = byId.get(id);
          if (!section) return null;
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragged(id)}
              onDragEnd={() => setDragged(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => drop(id)}
              className="flex flex-wrap items-center gap-3 rounded-sm border border-line bg-surface px-3 py-2"
            >
              <span aria-hidden="true" className="cursor-grab text-ink-muted">
                ⠿
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ink">
                  {locale === 'bn' ? section.titleBn : section.titleEn}
                </span>
                <span className="text-xs text-ink-muted">{kindLabel[section.kind]}</span>
              </span>
              <Badge tone={tone[section.status]}>{statusLabel[section.status]}</Badge>
              <span className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || pending}
                  aria-label={`${copy.moveUp}: ${section.titleEn}`}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1 || pending}
                  aria-label={`${copy.moveDown}: ${section.titleEn}`}
                >
                  ↓
                </Button>
              </span>
              <Link
                href={`/admin/cms/sections/${id}`}
                className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                {copy.editContent}
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-ink-muted">{copy.sectionDragHint}</p>
    </div>
  );
}

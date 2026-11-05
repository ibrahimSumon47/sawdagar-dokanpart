import type { Dictionary } from '../../i18n';

/**
 * The plain strings the client-side homepage section list needs. A client
 * component cannot receive the whole admin dictionary because it carries
 * builder functions React cannot serialise.
 */
export type SectionOrderCopy = Pick<
  Dictionary['admin'],
  | 'editContent'
  | 'kindBanner'
  | 'kindCollections'
  | 'kindHero'
  | 'moveDown'
  | 'moveUp'
  | 'sectionDragHint'
  | 'sectionOrderFailed'
  | 'sectionOrderInvalid'
  | 'statusArchived'
  | 'statusDraft'
  | 'statusPublished'
  | 'statusScheduled'
>;

/** Copies only the strings the section list renders, in a serialisable shape. */
export function sectionOrderCopy(copy: Dictionary['admin']): SectionOrderCopy {
  return {
    editContent: copy.editContent,
    kindBanner: copy.kindBanner,
    kindCollections: copy.kindCollections,
    kindHero: copy.kindHero,
    moveDown: copy.moveDown,
    moveUp: copy.moveUp,
    sectionDragHint: copy.sectionDragHint,
    sectionOrderFailed: copy.sectionOrderFailed,
    sectionOrderInvalid: copy.sectionOrderInvalid,
    statusArchived: copy.statusArchived,
    statusDraft: copy.statusDraft,
    statusPublished: copy.statusPublished,
    statusScheduled: copy.statusScheduled,
  };
}

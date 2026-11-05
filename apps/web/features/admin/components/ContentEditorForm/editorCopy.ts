import type { Dictionary } from '../../../../i18n';

/**
 * The editor's copy, flattened to plain strings. The full admin dictionary contains functions,
 * which cannot cross into a client component, so the server form passes only what the fields show.
 */
export interface CmsEditorCopy {
  kindLabel: string;
  kindPage: string;
  kindHelp: string;
  kindJournal: string;
  slugLabel: string;
  helpCategoryLabel: string;
  helpCategoryNone: string;
  helpCategoryHint: string;
  titleEnLabel: string;
  titleBnLabel: string;
  excerptEnLabel: string;
  excerptBnLabel: string;
  bodyEnLabel: string;
  bodyBnLabel: string;
  richTextHint: string;
  coverImageLabel: string;
  coverImageHint: string;
  coverUpload: string;
  coverUploading: string;
  coverUploadFailed: string;
  coverUploadMissing: string;
  coverImageAltEnLabel: string;
  coverImageAltBnLabel: string;
  coverImageAltHint: string;
  tagsLabel: string;
  tagsHint: string;
  seoTitleLabel: string;
  seoDescriptionLabel: string;
  statusLabel: string;
  statusDraft: string;
  statusScheduled: string;
  statusPublished: string;
  publishDateLabel: string;
}

/** Picks the editor strings out of the admin dictionary. */
export function toEditorCopy(copy: Dictionary['admin']): CmsEditorCopy {
  return {
    kindLabel: copy.kindLabel,
    kindPage: copy.kindPage,
    kindHelp: copy.kindHelp,
    kindJournal: copy.kindJournal,
    slugLabel: copy.slugLabel,
    helpCategoryLabel: copy.helpCategoryLabel,
    helpCategoryNone: copy.helpCategoryNone,
    helpCategoryHint: copy.helpCategoryHint,
    titleEnLabel: copy.titleEnLabel,
    titleBnLabel: copy.titleBnLabel,
    excerptEnLabel: copy.excerptEnLabel,
    excerptBnLabel: copy.excerptBnLabel,
    bodyEnLabel: copy.bodyEnLabel,
    bodyBnLabel: copy.bodyBnLabel,
    richTextHint: copy.richTextHint,
    coverImageLabel: copy.coverImageLabel,
    coverImageHint: copy.coverImageHint,
    coverUpload: copy.coverUpload,
    coverUploading: copy.coverUploading,
    coverUploadFailed: copy.coverUploadFailed,
    coverUploadMissing: copy.coverUploadMissing,
    coverImageAltEnLabel: copy.coverImageAltEnLabel,
    coverImageAltBnLabel: copy.coverImageAltBnLabel,
    coverImageAltHint: copy.coverImageAltHint,
    tagsLabel: copy.tagsLabel,
    tagsHint: copy.tagsHint,
    seoTitleLabel: copy.seoTitleLabel,
    seoDescriptionLabel: copy.seoDescriptionLabel,
    statusLabel: copy.statusLabel,
    statusDraft: copy.statusDraft,
    statusScheduled: copy.statusScheduled,
    statusPublished: copy.statusPublished,
    publishDateLabel: copy.publishDateLabel,
  };
}

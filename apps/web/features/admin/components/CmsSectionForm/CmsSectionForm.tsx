import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { saveSectionAction } from '../../../content/sectionActions';
import type { CmsSectionRecord } from '../../../content/sectionQueries';
import { CmsSectionFields } from './CmsSectionFields';

export interface CmsSectionFormProps {
  /** Existing section to edit, or null to create one. */
  section: CmsSectionRecord | null;
  copy: Dictionary['admin'];
}

/** Editor form that creates or updates one homepage section. */
export function CmsSectionForm({ section, copy }: CmsSectionFormProps) {
  return (
    <form action={saveSectionAction} className="space-y-6">
      {section ? <input type="hidden" name="id" value={section.id} /> : null}
      <CmsSectionFields section={section} copy={copy} />
      <Button type="submit">{copy.saveSection}</Button>
    </form>
  );
}

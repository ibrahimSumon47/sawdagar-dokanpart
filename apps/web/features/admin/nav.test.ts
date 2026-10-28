import { describe, expect, it } from 'vitest';
import { en } from '../../i18n/messages/en';
import { adminNavItems } from './nav';

const keys = (role: Parameters<typeof adminNavItems>[1]) =>
  adminNavItems(en.admin, role).map((item) => item.key);

describe('adminNavItems', () => {
  it('shows every section to a super admin', () => {
    expect(keys('super_admin')).toEqual([
      'overview',
      'stores',
      'reviews',
      'content',
      'analytics',
      'flags',
      'audit',
      'finance',
    ]);
  });

  it('keeps a content editor out of stores and finance', () => {
    const items = keys('content_editor');
    expect(items).toContain('content');
    expect(items).not.toContain('stores');
    expect(items).not.toContain('finance');
    expect(items).not.toContain('flags');
  });

  it('gives a moderator the moderation queues but not the CMS', () => {
    const items = keys('moderator');
    expect(items).toEqual(['overview', 'stores', 'reviews', 'analytics']);
  });

  it('shows only the overview and analytics to support', () => {
    expect(keys('support')).toEqual(['overview', 'analytics']);
  });
});

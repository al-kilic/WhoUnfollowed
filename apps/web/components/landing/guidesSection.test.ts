import { describe, it, expect } from 'vitest';
import { BLOG_POSTS } from '@/app/blog/posts';
import { routing } from '@/i18n/routing';
import { HOME_GUIDE_SLUGS, getGuidesSectionContent } from './guidesSection.content';

describe('homepage guides', () => {
  const slugs = new Set(BLOG_POSTS.map((p) => p.slug));

  it('only links to posts that exist', () => {
    for (const slug of HOME_GUIDE_SLUGS) expect(slugs.has(slug), slug).toBe(true);
  });

  it('has a label for every guide in every locale, with no em dashes', () => {
    for (const locale of routing.locales) {
      const c = getGuidesSectionContent(locale);
      for (const slug of HOME_GUIDE_SLUGS) expect(c.titles[slug], `${locale} ${slug}`).toBeTruthy();
      expect(JSON.stringify(c)).not.toContain('—');
    }
  });
});

import { describe, expect, it } from 'vitest';
import { announcementTarget, getAnnouncementBarContent } from './announcementBar.content';

describe('announcementTarget', () => {
  it.each([
    ['/', 'en', '/waitlist'],
    ['/pricing', 'en', '/waitlist'],
    ['/blog/some-post', 'en', '/waitlist'],
    ['/es', 'es', '/es/waitlist'],
    ['/pt/pricing', 'pt', '/pt/waitlist'],
    ['/espanol-guide', 'en', '/waitlist'],
  ])('shows on %s in %s, linking to %s', (path, locale, href) => {
    expect(announcementTarget(path)).toEqual({ locale, href });
  });

  it.each(['/waitlist', '/login', '/signup', '/verify-email', '/forgot-password', '/reset-password/abc', '/unsubscribe', '/welcome', '/es/waitlist', '/pt/login'])(
    'stays hidden on %s',
    (path) => {
      expect(announcementTarget(path)).toBeNull();
    },
  );

  it('does not hide pages that only start with a hidden word', () => {
    expect(announcementTarget('/signups-guide')).not.toBeNull();
  });
});

describe('announcement copy', () => {
  it('has no em dashes in any language', () => {
    for (const l of ['en', 'es', 'pt'] as const) {
      expect(JSON.stringify(getAnnouncementBarContent(l))).not.toContain('—');
    }
  });
});

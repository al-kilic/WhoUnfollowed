import { HOME_GUIDE_SLUGS } from '@/components/landing/guidesSection.content';

// Where the header and footer links go. Meta's own export page opens in a new tab.
export const META_EXPORT = 'https://accountscenter.instagram.com/info_and_permissions/dyi/';
export const GITHUB = 'https://github.com/al-kilic/WhoUnfollowed';
export const SECURITY = `${GITHUB}/security/policy`;
export const LEARN_PATHS = ['/instagram', '/threads', '/tiktok', '/instagram-coach', '/instagram-updates', '/compare', '/what-is-whounfollowed', '/privacy'] as const;
// The header's top guides: the first four homepage guides.
export const TOP_GUIDES = HOME_GUIDE_SLUGS.slice(0, 4);
export const blogHref = (slug: string) => `/blog/${slug}`;

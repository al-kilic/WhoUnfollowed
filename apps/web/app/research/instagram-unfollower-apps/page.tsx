import type { Metadata } from 'next';
import { STUDY_DATE } from './data';
import { studyStats } from './stats';
import { studyContent } from './content';
import { StudyView } from './StudyView';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';
const URL = `${SITE_URL}/research/instagram-unfollower-apps`;

const s = studyStats();
const c = studyContent(s);

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: URL },
  openGraph: { type: 'article', title: c.meta.title, description: c.meta.description, url: URL, publishedTime: STUDY_DATE, images: [{ url: '/og/study/en', width: 1200, height: 630, alt: c.meta.title }] },
  twitter: { title: c.meta.title, description: c.meta.description, images: ['/og/study/en'] },
};

// Original data (an App Store study) is what journalists, forums and AI
// answer engines cite, so the page ships Article + Dataset + FAQPage markup
// built from the same numbers it renders.
export default function StudyPage() {
  const author = { '@type': 'Person', '@id': `${SITE_URL}/author/alan-kilic#person`, name: 'Alan Kilic', url: `${SITE_URL}/author/alan-kilic` };
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: c.meta.title, description: c.meta.description,
      datePublished: STUDY_DATE, dateModified: STUDY_DATE, author, publisher: { '@id': `${SITE_URL}/#organization` },
      mainEntityOfPage: URL, image: `${SITE_URL}/og/study/en`, inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org', '@type': 'Dataset', name: 'Instagram unfollower apps on the App Store: how they get your data (November 2026)',
      description: `The ${s.n} most-rated Instagram unfollower apps on the US App Store, with ratings, last update, listed prices and how each listing says it gets your data, plus the apps that read Instagram's official export.`,
      url: URL, creator: author, datePublished: STUDY_DATE, temporalCoverage: STUDY_DATE, spatialCoverage: 'United States',
      license: 'https://creativecommons.org/licenses/by/4.0/', isAccessibleForFree: true,
      keywords: ['Instagram', 'unfollower apps', 'App Store', 'privacy', 'password', 'data export'],
      variableMeasured: ['App Store ratings', 'Average stars', 'Last update', 'Access method', 'Listed prices'],
      distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${URL}/data.csv` }],
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'WhoUnfollowed', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: c.meta.title, item: URL },
      ],
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StudyView c={c} s={s} />
    </>
  );
}

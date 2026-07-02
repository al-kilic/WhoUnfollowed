import type { Metadata } from 'next';
import { HowToExportContent } from './HowToExportContent';

export const metadata: Metadata = {
  title: 'How to Export Instagram Followers & Following Data - Step-by-Step Guide (2026)',
  description: 'Step-by-step guide to downloading your Instagram followers and following list as a ZIP. Takes under 5 minutes. No third-party app, no password needed.',
  alternates: {
    canonical: 'https://whounfollowed.co/how-to-export',
  },
  openGraph: {
    title: 'How to Export Instagram Followers & Following Data - Step-by-Step Guide (2026)',
    description: 'Step-by-step guide to downloading your Instagram followers and following list as a ZIP. Takes under 5 minutes. No third-party app, no password needed.',
    url: 'https://whounfollowed.co/how-to-export',
  },
};

const faqItems = [
  {
    question: 'Does requesting an Instagram data export notify my followers?',
    answer: 'No. The export is completely private. Your followers have no way of knowing you requested or downloaded your data.',
  },
  {
    question: 'How often can I request an Instagram data export?',
    answer: 'Instagram allows one export request approximately every 14 days per account.',
  },
  {
    question: 'Is it safe to request my Instagram data export?',
    answer: 'Yes. It is an official Instagram feature required under GDPR. No third-party app is involved at any point.',
  },
  {
    question: 'What format should I choose - JSON or HTML?',
    answer: 'Always choose JSON. It includes timestamps showing when each person followed you, and it\'s the format our parser is built for. HTML is only for human reading and contains less data.',
  },
  {
    question: 'Can I request an Instagram data export on desktop?',
    answer: 'Yes. Go to accountscenter.instagram.com → Your information and permissions → Export your information. The process is identical to mobile.',
  },
  {
    question: 'Why do I only need the Followers and Following export, not my full archive?',
    answer: 'The full Instagram archive can be several gigabytes and takes much longer. Followers and Following is a small, focused export - usually under 1MB - and ready in minutes.',
  },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

// HowTo mirrors the visible "Download to device" step flow so search and AI
// engines can surface the export steps directly.
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to export your Instagram followers and following data',
  description:
    'Download your Instagram followers and following list as a ZIP using Instagram\'s official data export. No third-party app and no password needed.',
  totalTime: 'PT5M',
  tool: [{ '@type': 'HowToTool', name: 'Instagram Accounts Center' }],
  step: [
    { '@type': 'HowToStep', name: 'Go to Instagram Accounts Center', text: 'Open accountscenter.instagram.com, or navigate from your profile to Settings and privacy, then Accounts Center.', url: `${SITE_URL}/how-to-export#step1` },
    { '@type': 'HowToStep', name: 'Open Your information and permissions', text: 'Inside Accounts Center, tap Your information and permissions.', url: `${SITE_URL}/how-to-export#step2` },
    { '@type': 'HowToStep', name: 'Go to Export your information', text: 'Tap Export your information, then choose Export to device.', url: `${SITE_URL}/how-to-export#step3` },
    { '@type': 'HowToStep', name: 'Select only Followers and Following', text: 'Under Customize information, deselect everything and check only Followers and Following. Set the date range to All time.', url: `${SITE_URL}/how-to-export#step4` },
    { '@type': 'HowToStep', name: 'Choose JSON format and start the export', text: 'Choose JSON, not HTML, then tap Start export. JSON includes follow timestamps.', url: `${SITE_URL}/how-to-export#step5` },
    { '@type': 'HowToStep', name: 'Download the ZIP from your email', text: 'Within a few minutes Instagram emails a download link. Download the ZIP to your device. The link expires in 4 days.', url: `${SITE_URL}/how-to-export#step6` },
  ],
};

export default function HowToExportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <HowToExportContent />
    </>
  );
}

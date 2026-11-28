import type { ReactNode } from 'react';
import '@/styles/legal.css';
import { Link } from '@/i18n/navigation';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import type { AppLocale } from '@/i18n/routing';

// The shared layout for the legal and policy pages: the new look, the same
// reading column as blog articles, and a short "On this page" list on long
// documents. Each section gets a stable anchor (#section-1, #section-2...).

export interface LegalSection { title: string; body: ReactNode }

const TOC_LABEL: Record<AppLocale, string> = { en: 'On this page', es: 'En esta página', pt: 'Nesta página' };
// Long documents get the "On this page" list.
const TOC_FROM = 6;

export const sectionId = (i: number) => `section-${i + 1}`;

export function LegalDoc({ locale, eyebrow, title, dates, intro, sections, backLabel }: {
  locale: AppLocale;
  eyebrow: string;
  title: string;
  dates: string;
  intro?: ReactNode;
  sections: LegalSection[];
  backLabel: string;
}) {
  return (
    <StudioFrame>
      <div className="lg">
        <SiteHeader />
        <main className="lg-main">
          <header>
            <p className="lg-eyebrow">{eyebrow}</p>
            <h1 className="lg-title">{title}</h1>
            <p className="lg-dates">{dates}</p>
          </header>

          {intro}

          {sections.length >= TOC_FROM && (
            <nav className="lg-toc" aria-label={TOC_LABEL[locale]}>
              <p className="lg-eyebrow">{TOC_LABEL[locale]}</p>
              <ul>
                {sections.map((s, i) => <li key={sectionId(i)}><a href={`#${sectionId(i)}`}>{s.title}</a></li>)}
              </ul>
            </nav>
          )}

          <div className="lg-prose">
            {sections.map((s, i) => (
              <section key={sectionId(i)} className="lg-sec" aria-labelledby={sectionId(i)}>
                <h2 id={sectionId(i)}>{s.title}</h2>
                <div>{s.body}</div>
              </section>
            ))}
          </div>

          <div className="lg-back">
            <Link href="/">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {backLabel}
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    </StudioFrame>
  );
}

export const MailLink = () => <a href="mailto:hello@whounfollowed.co">hello@whounfollowed.co</a>;

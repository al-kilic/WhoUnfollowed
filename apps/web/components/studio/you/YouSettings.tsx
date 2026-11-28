import { ArrowRight, Bell, Brain, CalendarDays, Check, CreditCard, Database, Lock, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import type { AccountSummary } from '@/lib/account/accountSummary';
import { YouName } from './YouName';
import { ChangePassword } from '@/app/[locale]/account/ChangePassword';
import { SyncSetup } from '@/app/[locale]/account/SyncSetup';
import { MarketingConsent } from '@/app/[locale]/account/MarketingConsent';
import { ReminderToggle } from '@/app/[locale]/account/ReminderToggle';
import { getAccountContent } from '@/app/[locale]/account/content';
import { getStudioContent } from '../studio.content';
import { getStudioCoachContent } from '../coach/studioCoach.content';
import { PageHead } from '../PageHead';
import { getYouContent } from './you.content';
import { SetRow, YouAccounts, YouLanguage } from './YouParts';
import { YouBilling } from './YouBilling';
import { YouHashScroll } from './YouHashScroll';
import { proAiPricesAt, TOPUP_PRICE_USD } from '@/lib/pricing';
import { BriefToggle, CoachPrefs, SaveNote } from './YouPrefs';
import { PlanReminders } from '../coach/PlanReminders';
import { HoldToDelete } from './HoldToDelete';
import { AvatarPicker } from './YouAvatar';
import { MemorySummary } from './MemoryViews';

// Studio > You > Settings, laid out like the prototype: a section list on the
// left, one card per section. Everything that was on /account lives here too.

const SECTIONS = [['profile', UserRound], ['coach', Sparkles], ['memory', Brain], ['billing', CreditCard], ['notifications', Bell], ['calendar', CalendarDays], ['privacy', ShieldCheck]] as const;

export function YouSettings({ locale, a }: { locale: AppLocale; a: AccountSummary | null }) {
  const t = getYouContent(locale);
  const sc = getStudioContent(locale);
  const k = getStudioCoachContent(locale).you;
  const ac = getAccountContent(locale);
  const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : '');

  if (!a) {
    return (
      <>
        <PageHead title={sc.nav.you} />
        <section className="s-card s-pad s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span className="s-sub-t" style={{ fontSize: 14 }}>{t.signedOut}</span>
          <Link href="/login" className="s-btn">{sc.signIn}</Link>
        </section>
      </>
    );
  }
  const { enabledOn, ...syncCopy } = ac.syncSetup;
  const value = (v: string | null) => (v ? <span>{v}</span> : <span className="s-sub-t">{t.notSet}</span>);

  return (
    <>
      <PageHead title={sc.nav.you} />
      <YouHashScroll />
      <div className="s-ylay">
        <nav className="s-ynav" aria-label={sc.nav.settings}>
          {SECTIONS.map(([id, Ic]) => <a key={id} href={`#${id}`}><Ic size={15} />{t.sections[id]}</a>)}
        </nav>
        <div className="s-col" style={{ gap: 16, minWidth: 0 }}>
          <section className="s-card" id="profile">
            <div className="s-hd"><h3 className="s-h3">{t.sections.profile}</h3></div>
            <div className="s-pad s-row" style={{ gap: 18, flexWrap: 'wrap' }}>
              <AvatarPicker />
              <div className="s-col" style={{ gap: 3, minWidth: 0 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, wordBreak: 'break-all' }}>{a.email}</h2>
                <span className="s-sub-t" style={{ fontSize: 13 }}>{a.isInsider ? t.lifetime : a.hasProAi ? sc.plan.proAi : a.isPro ? sc.plan.pro : t.free}{a.memberSince ? ` · ${t.memberSince} ${date(a.memberSince)}` : ''}</span>
              </div>
            </div>
            <div className="s-pad" style={{ borderTop: '1px solid var(--line)' }}><YouName initial={a.displayName} locale={locale} /></div>
            <SetRow title={t.accounts} body={t.accountsBody}><YouAccounts /></SetRow>
            <SetRow title={t.language} body={t.languageBody}><YouLanguage /></SetRow>
          </section>

          <section className="s-card" id="coach">
            <div className="s-hd"><h3 className="s-h3">{t.sections.coach}</h3>{a.hasProAi ? <SaveNote /> : <span className="s-sub-t">{t.coachSub}</span>}</div>
            {a.hasProAi ? (
              <>
                <SetRow title={t.accountType}>{value(a.coach?.accountType ? (t.types[a.coach.accountType] ?? a.coach.accountType) : null)}</SetRow>
                <SetRow title={t.niche}>{value(a.coach?.niche ?? null)}</SetRow>
                <SetRow title={t.goal} body={t.coachEdit}>{value(a.coach?.goal ?? null)}</SetRow>
                <CoachPrefs />
                <SetRow title={t.goalRow} body={t.goalBody}><Link href="/app/plan/goals" className="s-lnk">{t.openGoal}<ArrowRight size={13} /></Link></SetRow>
                <SetRow title={t.planRow} body={t.planBody}><Link href="/app/plan" className="s-lnk">{t.openPlan}<ArrowRight size={13} /></Link></SetRow>
              </>
            ) : <p className="s-pad s-sub-t" style={{ margin: 0 }}><Lock size={13} style={{ verticalAlign: -2 }} /> {k.memoryBody}</p>}
          </section>

          <section className="s-card" id="memory">
            <div className="s-hd"><h3 className="s-h3">{t.sections.memory}</h3><span className="s-sub-t">{k.memoryBody}</span></div>
            {a.hasProAi ? <MemorySummary /> : <p className="s-pad s-sub-t" style={{ margin: 0 }}><Lock size={13} style={{ verticalAlign: -2 }} /> {sc.plan.proAi}</p>}
          </section>

          <section className="s-card" id="billing">
            <div className="s-hd"><h3 className="s-h3">{t.sections.billing}</h3>{a.status === 'grace' && a.graceEndsAt && <span className="s-pace warn">{ac.graceWarning(date(a.graceEndsAt))}</span>}</div>
            <YouBilling b={{ plan: a.plan, isSubscriber: a.isSubscriber, periodEnd: a.periodEnd, cancelAt: a.cancelAt, proUntil: a.proUntil, isInsider: a.isInsider, prices: proAiPricesAt(), refillPrice: TOPUP_PRICE_USD }} />
          </section>

          <section className="s-card" id="notifications">
            <div className="s-hd"><h3 className="s-h3">{t.sections.notifications}</h3><span className="s-sub-t">{t.notifSub}</span></div>
            <SetRow title={ac.reminders.title}><ReminderToggle nextAt={a.reminderNextAt} locale={locale} c={ac.reminders} /></SetRow>
            {a.hasProAi && <BriefToggle />}
            {a.hasProAi && <SetRow title={t.checkins} body={t.checkinsBody}><Link href="/app/plan/goals" className="s-lnk">{t.openGoal}<ArrowRight size={13} /></Link></SetRow>}
            {a.isInsider && <SetRow title={t.news}><MarketingConsent optedIn={a.marketingOptIn} c={ac.marketingConsent} /></SetRow>}
          </section>

          {a.hasProAi && (
            <section className="s-card" id="calendar">
              <div className="s-hd"><h3 className="s-h3">{t.sections.calendar}</h3></div>
              <div className="s-pad"><PlanReminders manage /></div>
            </section>
          )}

          <section className="s-card" id="privacy">
            <div className="s-hd"><h3 className="s-h3">{t.sections.privacy}</h3></div>
            <div className="s-pad s-priv">
              <div className="s-col" style={{ gap: 9 }}><span className="s-lab s-row" style={{ gap: 6 }}><Database size={13} />{t.saved}</span>{t.savedList.map((x) => <span key={x} className="s-row s-pli"><Check size={14} />{x}</span>)}</div>
              <div className="s-col" style={{ gap: 9 }}><span className="s-lab s-row" style={{ gap: 6 }}><ShieldCheck size={13} />{t.never}</span>{t.neverList.map((x) => <span key={x} className="s-row s-pli no"><X size={14} />{x}</span>)}</div>
            </div>
            <SetRow title={t.sync}><SyncSetup hasSyncSetup={a.sync.on} passphraseSetAt={a.sync.since ? new Date(a.sync.since) : null} isPro={a.isPro} enabledOnText={a.sync.since ? enabledOn(date(a.sync.since)) : ''} c={syncCopy} /></SetRow>
            <SetRow title={t.security} body={ac.securityDesc}><ChangePassword c={ac.changePassword} /></SetRow>
            <SetRow title={t.danger} body={ac.dangerDesc}><HoldToDelete errorText={ac.deleteAccount.errorMessage} /></SetRow>
          </section>
        </div>
      </div>
    </>
  );
}

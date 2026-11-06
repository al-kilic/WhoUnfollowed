import { z } from 'zod';

declare const followersFileSchema: z.ZodArray<z.ZodObject<{
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    media_list_data: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    string_list_data: z.ZodDefault<z.ZodArray<z.ZodObject<{
        href: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        value: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        timestamp: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
declare const followingFileSchema: z.ZodObject<{
    relationships_following: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        media_list_data: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
        string_list_data: z.ZodDefault<z.ZodArray<z.ZodObject<{
            href: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            value: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            timestamp: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const platforms: readonly ["instagram", "threads", "tiktok"];
declare const platformSchema: z.ZodEnum<{
    instagram: "instagram";
    threads: "threads";
    tiktok: "tiktok";
}>;
declare const accountSchema: z.ZodObject<{
    username: z.ZodString;
    href: z.ZodString;
    followedAt: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
declare const parsedSnapshotSchema: z.ZodObject<{
    exportedAt: z.ZodNumber;
    followers: z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        href: z.ZodString;
        followedAt: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    following: z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        href: z.ZodString;
        followedAt: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    pendingRequests: z.ZodOptional<z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        href: z.ZodString;
        followedAt: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>>;
    recentlyUnfollowed: z.ZodOptional<z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        href: z.ZodString;
        followedAt: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>>;
    format: z.ZodOptional<z.ZodEnum<{
        json: "json";
        html: "html";
    }>>;
    platform: z.ZodOptional<z.ZodEnum<{
        instagram: "instagram";
        threads: "threads";
        tiktok: "tiktok";
    }>>;
}, z.core.$strip>;
declare function snapshotPlatform(snapshot: Pick<ParsedSnapshot, 'platform'>): Platform;
declare const feedbackSentiments: readonly ["angry", "sad", "neutral", "happy", "delighted"];
declare const feedbackSchema: z.ZodObject<{
    sentiment: z.ZodEnum<{
        angry: "angry";
        sad: "sad";
        neutral: "neutral";
        happy: "happy";
        delighted: "delighted";
    }>;
    reason: z.ZodOptional<z.ZodString>;
    comment: z.ZodOptional<z.ZodString>;
    page: z.ZodString;
}, z.core.$strip>;
type FeedbackSentiment = (typeof feedbackSentiments)[number];
type FeedbackInput = z.infer<typeof feedbackSchema>;
declare const contactSources: readonly ["contact_page", "homepage_widget"];
declare const contactMessageSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    topic: z.ZodOptional<z.ZodString>;
    source: z.ZodEnum<{
        contact_page: "contact_page";
        homepage_widget: "homepage_widget";
    }>;
    page: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ContactSource = (typeof contactSources)[number];
type ContactMessageInput = z.infer<typeof contactMessageSchema>;
declare const emailOptInSources: readonly ["results", "snapshot-limit", "reveal", "welcome", "creator-ai-waitlist"];
declare const emailOptInSchema: z.ZodObject<{
    email: z.ZodString;
    source: z.ZodEnum<{
        results: "results";
        "snapshot-limit": "snapshot-limit";
        reveal: "reveal";
        welcome: "welcome";
        "creator-ai-waitlist": "creator-ai-waitlist";
    }>;
    locale: z.ZodOptional<z.ZodEnum<{
        en: "en";
        es: "es";
        pt: "pt";
    }>>;
    consent: z.ZodLiteral<true>;
}, z.core.$strip>;
type EmailOptInSource = (typeof emailOptInSources)[number];
type EmailOptInInput = z.infer<typeof emailOptInSchema>;
declare const plannerCadences: readonly ["weekly", "daily", "off"];
declare const plannerSyncSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        instagram: "instagram";
        threads: "threads";
        tiktok: "tiktok";
    }>;
    total: z.ZodNumber;
    done: z.ZodNumber;
    perDay: z.ZodNumber;
    cadence: z.ZodEnum<{
        weekly: "weekly";
        daily: "daily";
        off: "off";
    }>;
    locale: z.ZodOptional<z.ZodEnum<{
        en: "en";
        es: "es";
        pt: "pt";
    }>>;
}, z.core.$strip>;
type PlannerSyncInput = z.infer<typeof plannerSyncSchema>;
type FollowersFile = z.infer<typeof followersFileSchema>;
type FollowingFile = z.infer<typeof followingFileSchema>;
type Account = z.infer<typeof accountSchema>;
type ParsedSnapshot = z.infer<typeof parsedSnapshotSchema>;
type Platform = z.infer<typeof platformSchema>;

interface ParseExportResult {
    snapshot: ParsedSnapshot;
    skippedPlatforms: Platform[];
}
declare function parseInstagramZip(zipFile: File | Blob | ArrayBuffer): Promise<ParsedSnapshot>;
declare function parseExportZip(zipFile: File | Blob | ArrayBuffer): Promise<ParseExportResult>;

type DeltaReason = 'small_counts' | 'all_recent_timestamps' | 'massive_count_drop' | 'limited_date_range';
interface DeltaDetectionResult {
    isDelta: boolean;
    reasons: DeltaReason[];
}
declare function detectDeltaExport(snapshot: ParsedSnapshot, previousSnapshot?: ParsedSnapshot): DeltaDetectionResult;

interface SingleSnapshotAnalysis {
    nonFollowers: Account[];
    fans: Account[];
    mutuals: Account[];
    totalFollowers: number;
    totalFollowing: number;
    ratio: number;
}
interface SnapshotComparison {
    newFollowers: Account[];
    lostFollowers: Account[];
    newFollowing: Account[];
    unfollowed: Account[];
    periodDays: number;
}
declare function analyzeSnapshot(snapshot: ParsedSnapshot): SingleSnapshotAnalysis;
declare function compareSnapshots(old: ParsedSnapshot, current: ParsedSnapshot): SnapshotComparison;
declare function findGhostFollowers(snapshot: ParsedSnapshot, options?: {
    minTenureDays?: number;
}): Account[];

declare class FileReadError extends Error {
    readonly code: "FILE_READ";
    constructor(cause?: unknown);
}
declare class InvalidZipError extends Error {
    readonly code: "INVALID_ZIP";
    constructor(cause?: unknown);
}
interface ZipShape {
    fileCount: number;
    hasConnectionsFolder: boolean;
    hasMediaFolder: boolean;
    hasThreadsFolder: boolean;
    hasHtmlFiles: boolean;
    hasTikTokFiles?: boolean;
}
type ExportPlatform = 'instagram' | 'threads' | 'tiktok';
declare class MissingFilesError extends Error {
    readonly code: "MISSING_FILES";
    readonly platform: ExportPlatform;
    shape?: ZipShape;
    constructor(missing: string[], platform?: ExportPlatform);
}
declare class MixedFormatError extends Error {
    readonly code: "MIXED_FORMAT";
    constructor();
}
declare class SchemaValidationError extends Error {
    readonly code: "SCHEMA_VALIDATION";
    readonly reason: 'not_json' | 'shape_mismatch';
    constructor(filename: string, detail: string);
}

declare function tiktokHref(username: string): string;
declare const TIKTOK_LIST_CAP = 10000;
declare function tiktokListNearCap(snapshot: Pick<ParsedSnapshot, 'followers' | 'following'>): boolean;

type HealthCheckId = 'stale_pending' | 'follow_back_gap_year' | 'old_one_way' | 'sudden_drop' | 'mutuals_lost' | 'follow_burst' | 'fans_unanswered' | 'ratio_imbalance' | 'following_limit' | 'second_export';
interface HealthFinding {
    id: HealthCheckId;
    impact: number;
    params: Record<string, number | string>;
    accounts: Account[];
}
interface HealthInput {
    current: ParsedSnapshot;
    previous?: ParsedSnapshot | undefined;
    now?: number;
}
declare function runHealthChecks({ current, previous, now }: HealthInput): HealthFinding[];

interface TimelineMonth {
    month: string;
    followers: number;
    following: number;
}
interface GrowthTimeline {
    months: TimelineMonth[];
    best: TimelineMonth | null;
    dated: number;
    undated: number;
    lastYearShare: number;
}
declare function growthTimeline(snapshot: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>): GrowthTimeline;

type CuriosityId = 'since_last' | 'best_month' | 'arrival_weekday' | 'first_follower' | 'longest_wait' | 'recent_share' | 'follow_spree' | 'fans';
interface Curiosity {
    id: CuriosityId;
    params: Record<string, number | string>;
    series?: number[];
    highlight?: number;
}
interface CuriosityInput {
    current: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>;
    previous?: Pick<ParsedSnapshot, 'followers'> | undefined;
    timeZone?: string;
}
declare function curiosities({ current, previous, timeZone }: CuriosityInput): Curiosity[];

declare const WRAP_MONTHS = 3;
declare const WRAP_REPLAY_DAYS = 80;
interface QuarterWrap {
    start: number;
    end: number;
    arrived: number;
    arrivedBefore: number;
    arrivedMutual: number;
    weeks: number[];
    bestWeek: {
        start: string;
        count: number;
    } | null;
    followsMade: number;
    followsBack: number;
    spree: {
        date: string;
        count: number;
    } | null;
    sincePrevious?: {
        date: string;
        gained: number;
        lost: number;
    } | undefined;
}
interface QuarterWrapInput {
    current: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>;
    previous?: Pick<ParsedSnapshot, 'followers' | 'exportedAt'> | undefined;
    timeZone?: string;
}
declare function monthsBefore(ts: number, months: number): number;
declare function shouldAutoPlayWrap(seenExportedAt: number | null, exportedAt: number): boolean;
declare function quarterWrap({ current, previous, timeZone }: QuarterWrapInput): QuarterWrap | null;

type ArchetypeId = 'loyal_magnet' | 'main_character' | 'quiet_icon' | 'fair_trader' | 'generous_giver' | 'hopeful_romantic' | 'ghost_collector' | 'tiny_circle' | 'open_house' | 'selective' | 'rising' | 'og' | 'mutual_maximalist' | 'fan_club' | 'collector' | 'drama_magnet' | 'untouchable' | 'comeback' | 'balanced' | 'steady';
interface VerdictStats {
    followers: number;
    following: number;
    mutuals: number;
    oneWay: number;
    fans: number;
    followBackPct: number;
    ratio: number;
    lastYearShare: number;
    lost?: number | undefined;
    gained?: number | undefined;
}
declare const ARCHETYPE_IDS: ArchetypeId[];
declare function verdictStats(current: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>, previous?: Pick<ParsedSnapshot, 'followers'>): VerdictStats;
declare function eligibleArchetypes(stats: VerdictStats): ArchetypeId[];
declare function hashSeed(...parts: (string | number)[]): number;
interface Verdict {
    archetype: ArchetypeId;
    lineSeed: number;
    stats: VerdictStats;
}
declare function pickVerdict(stats: VerdictStats, exportedAt: number, spin?: number): Verdict;

type Pace = 'gentle' | 'steady' | 'quick';
declare const PACE_PER_DAY: Record<Pace, number>;
declare const SUB_BATCH = 10;
interface PlanOptions {
    accounts: Account[];
    pace: Pace;
    starred?: ReadonlySet<string> | undefined;
    order?: 'oldest' | 'az' | undefined;
}
interface UnfollowPlan {
    pace: Pace;
    perDay: number;
    batches: string[][];
    total: number;
    skippedStarred: number;
}
declare function buildPlan({ accounts, pace, starred, order }: PlanOptions): UnfollowPlan;
interface PlanProgress {
    done: number;
    left: number;
    daysLeft: number;
    currentBatch: number;
    currentBatchLeft: number;
    pct: number;
}
declare function planProgress(plan: Pick<UnfollowPlan, 'batches' | 'perDay' | 'total'>, done: ReadonlySet<string>): PlanProgress;
declare function daysAtEachPace(total: number): Record<Pace, number>;

export { ARCHETYPE_IDS, type Account, type ArchetypeId, type ContactMessageInput, type ContactSource, type Curiosity, type CuriosityId, type CuriosityInput, type DeltaDetectionResult, type DeltaReason, type EmailOptInInput, type EmailOptInSource, type ExportPlatform, type FeedbackInput, type FeedbackSentiment, FileReadError, type FollowersFile, type FollowingFile, type GrowthTimeline, type HealthCheckId, type HealthFinding, type HealthInput, InvalidZipError, MissingFilesError, MixedFormatError, PACE_PER_DAY, type Pace, type ParseExportResult, type ParsedSnapshot, type PlanOptions, type PlanProgress, type PlannerSyncInput, type Platform, type QuarterWrap, type QuarterWrapInput, SUB_BATCH, SchemaValidationError, type SingleSnapshotAnalysis, type SnapshotComparison, TIKTOK_LIST_CAP, type TimelineMonth, type UnfollowPlan, type Verdict, type VerdictStats, WRAP_MONTHS, WRAP_REPLAY_DAYS, type ZipShape, analyzeSnapshot, buildPlan, compareSnapshots, contactMessageSchema, contactSources, curiosities, daysAtEachPace, detectDeltaExport, eligibleArchetypes, emailOptInSchema, emailOptInSources, feedbackSchema, feedbackSentiments, findGhostFollowers, growthTimeline, hashSeed, monthsBefore, parseExportZip, parseInstagramZip, pickVerdict, planProgress, plannerCadences, plannerSyncSchema, platformSchema, platforms, quarterWrap, runHealthChecks, shouldAutoPlayWrap, snapshotPlatform, tiktokHref, tiktokListNearCap, verdictStats };

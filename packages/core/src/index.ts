// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export { parseInstagramZip, parseExportZip, parseExportFiles } from './parser.js';
export type { LooseFile, ParseExportResult } from './parser.js';
export { detectDeltaExport } from './delta.js';
export type { DeltaDetectionResult, DeltaReason } from './delta.js';
export { analyzeSnapshot, compareSnapshots, findGhostFollowers } from './diff.js';
export { FileReadError, InvalidZipError, MissingFilesError, MixedFormatError, SchemaValidationError } from './errors.js';
export type { ZipShape } from './errors.js';
export type {
  Account,
  ParsedSnapshot,
  Platform,
  FollowersFile,
  FollowingFile,
  FeedbackInput,
  FeedbackSentiment,
  ContactMessageInput,
  ContactSource,
  EmailOptInInput,
  EmailOptInSource,
} from './schemas.js';
export { feedbackSchema, feedbackSentiments, platformSchema, platforms, snapshotPlatform } from './schemas.js';
export { contactMessageSchema, contactSources, siteFeedbackSchema, siteFeedbackTypes } from './schemas.js';
export type { SiteFeedbackInput, SiteFeedbackType } from './schemas.js';
export { emailOptInSchema, emailOptInSources, plannerCadences, plannerSyncSchema } from './schemas.js';
export type { PlannerSyncInput } from './schemas.js';
export type { SingleSnapshotAnalysis, SnapshotComparison } from './diff.js';
// TikTok export helpers.
export { TIKTOK_LIST_CAP, tiktokHref, tiktokListNearCap } from './tiktok.js';
export type { ExportPlatform } from './errors.js';

// Tools: all run in the browser on the user's own export.
export { runHealthChecks } from './tools/healthChecks.js';
export type { HealthCheckId, HealthFinding, HealthInput } from './tools/healthChecks.js';
export { growthTimeline } from './tools/growthTimeline.js';
export { curiosities } from './tools/curiosities.js';
export { WRAP_MIN_ACTIVITY, WRAP_MONTHS, WRAP_REPLAY_DAYS, monthsBefore, quarterWrap, shouldAutoPlayWrap } from './tools/quarterWrap.js';
export type { QuarterWrap, QuarterWrapInput, WrapSeen } from './tools/quarterWrap.js';
export type { Curiosity, CuriosityId, CuriosityInput } from './tools/curiosities.js';
export type { GrowthTimeline, TimelineMonth } from './tools/growthTimeline.js';
export { ARCHETYPE_IDS, eligibleArchetypes, hashSeed, pickVerdict, verdictStats } from './tools/verdict.js';
export type { ArchetypeId, Verdict, VerdictStats } from './tools/verdict.js';
export { PACE_PER_DAY, SUB_BATCH, buildPlan, daysAtEachPace, planProgress } from './tools/unfollowPlanner.js';
export type { Pace, PlanOptions, PlanProgress, UnfollowPlan } from './tools/unfollowPlanner.js';
export {
  aiOnboardingSchema, aiAccountTypes, exportStatsSchema, aiDraftKinds, aiPostFormats, aiDraftTones, aiDraftLengths,
  aiDraftRequestSchema, aiCheckRequestSchema, aiPlanRequestSchema, aiPlanPhotoStates, aiPlanTimes, aiIdeasRequestSchema, aiGoalRequestSchema, aiPrefsSchema, displayNameSchema, aiCheckinCadences, aiGoalTypes, aiPlanCalendarSchema, aiPlanCalendarItemSchema,
  aiReadSchema, aiDraftSchema, aiCheckSchema, aiCheckCriteria, aiPlanSchema, aiIdeasSchema, aiChatSchema, aiChatRequestSchema, aiChatTurnSchema, aiChatAttachmentsSchema, aiChatContextKinds, AI_CHAT_LIMITS, aiInsightsSchema, aiInsightsRequestSchema, aiInsightsPostSchema, aiPhotoStyleSchema, aiPhotoStyleRequestSchema,
  aiSignalSchema, aiSignalRequestSchema, aiThumbChips, aiSignalActions,
  aiMemoryOpsSchema, aiNoteTypes, EMPTY_MEMORY_OPS,
} from './aiSchemas.js';
export type { AiOnboardingInput, ExportStats, AiRead, AiDraft, AiCheck, AiPlan, AiIdeas, AiPlanCalendarItem, AiChat, AiChatTurn, AiChatAttachments, AiInsights, AiInsightsPost, AiPhotoStyle, AiPlanRequest, AiPrefs, DisplayNameInput, AiSignal, AiMemoryOps, AiNoteType } from './aiSchemas.js';
export { exportStats } from './tools/exportStats.js';
export { radarFacts, RADAR_FACT_VALUE } from './tools/radarFacts.js';
export type { RadarFact } from './tools/radarFacts.js';
export { fixMetaText, openExportPosts, postsFromJson } from './exportPosts.js';
export type { ExportPost, ExportPosts } from './exportPosts.js';
export { textDiff } from './coach/textDiff.js';
export type { TextDiff } from './coach/textDiff.js';
// Coach memory: what the member posts, how they write, and the moments the
// exports show. All worked out in the browser; numbers and dates only, except
// voice exemplars, which the member reviews before sharing.
export { CONTENT_FORMATS, contentFromJson, contentFromLabelPosts, contentSourceOf, isLabelPostsFile, mergeContent, readExportContent } from './exportContent.js';
export { EMPTY_INSIGHTS, hasInsights, insightNumber, insightShares, insightsFileOf, insightsFromFiles } from './exportInsights.js';
export type { ExportInsights, InsightsAccount, InsightsFile, InsightsPost, InsightsStory, PlaceShare } from './exportInsights.js';
export { readFullExport } from './exportFull.js';
export { openLazyZip, openZipReader } from './lazyZip.js';
export { canReadLazily } from './zipSupport.js';
export type { ZipReader } from './lazyZip.js';
export type { FullExport } from './exportFull.js';
export { insightsStats } from './coach/insightsStats.js';
export type { CaptionDrift, InsightsStats, InsightsPostRow, InsightsFormatRow, InsightsStoriesSummary, InsightsAccountSummary } from './coach/insightsStats.js';
export type { ContentFormat, ContentSource, ExportContentItem } from './exportContent.js';
export { contentStats } from './coach/contentStats.js';
export type { ContentMonth, ContentStats, FormatMix } from './coach/contentStats.js';
export { pickVoiceExemplars, scrubCaption, voiceStats } from './coach/voiceStats.js';
export type { VoiceSource, VoiceStats } from './coach/voiceStats.js';
export { MOMENT_RULES, exportContentMoments, exportMoments } from './coach/moments.js';
export type { Moment, MomentKind } from './coach/moments.js';
export { captionBody, countEmoji, countHashtags, hasCta, isQuestion } from './coach/captionSignals.js';
export { aiInsightsStatsSchema, aiNoteOpSchema, aiLearnedSeenSchema, aiVoiceStatsSchema, aiVoiceUploadSchema, aiContentStatsSchema, aiMomentSchema, aiContentUploadSchema, aiBlindspotStateSchema, aiDigestSchema } from './memorySchemas.js';
export type { AiInsightsStats, AiNoteOp, AiVoiceUpload, AiContentUpload, AiBlindspotState, AiDigest } from './memorySchemas.js';
// Platform updates ledger (what changed on Instagram, Threads and TikTok, with status and last check).
export { UPDATE_RULES, currentUpdates, platformUpdateSchema, platformUpdateStatuses, platformUpdatesFileSchema, updateLines } from './platformUpdates.js';
export type { CurrentUpdate, PlatformUpdate, PlatformUpdateStatus } from './platformUpdates.js';

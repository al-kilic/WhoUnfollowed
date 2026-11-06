// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export { parseInstagramZip, parseExportZip } from './parser.js';
export type { ParseExportResult } from './parser.js';
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
export { contactMessageSchema, contactSources } from './schemas.js';
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

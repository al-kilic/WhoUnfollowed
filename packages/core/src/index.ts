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
} from './schemas.js';
export { feedbackSchema, feedbackSentiments, platforms, snapshotPlatform } from './schemas.js';
export { contactMessageSchema, contactSources } from './schemas.js';
export type { SingleSnapshotAnalysis, SnapshotComparison } from './diff.js';
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export { parseInstagramZip } from './parser.js';
export { detectDeltaExport } from './delta.js';
export type { DeltaDetectionResult, DeltaReason } from './delta.js';
export { analyzeSnapshot, compareSnapshots, findGhostFollowers } from './diff.js';
export { InvalidZipError, MissingFilesError, MixedFormatError, SchemaValidationError } from './errors.js';
export type {
  Account,
  ParsedSnapshot,
  FollowersFile,
  FollowingFile,
  FeedbackInput,
  FeedbackSentiment,
} from './schemas.js';
export { feedbackSchema, feedbackSentiments } from './schemas.js';
export type { SingleSnapshotAnalysis, SnapshotComparison } from './diff.js';
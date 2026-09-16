// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export class FileReadError extends Error {
  readonly code = 'FILE_READ' as const;
  constructor(cause?: unknown) {
    super(
      'Your browser could not read this file. If it is synced via iCloud, Google Drive, or ' +
        'another cloud service, make sure it has fully downloaded to your device, then try again.',
    );
    this.name = 'FileReadError';
    if (cause instanceof Error) this.cause = cause;
  }
}

export class InvalidZipError extends Error {
  readonly code = 'INVALID_ZIP' as const;
  constructor(cause?: unknown) {
    super('The file you uploaded is not a valid ZIP archive. Please try downloading it again from Instagram.');
    this.name = 'InvalidZipError';
    if (cause instanceof Error) this.cause = cause;
  }
}

export class MissingFilesError extends Error {
  readonly code = 'MISSING_FILES' as const;
  constructor(missing: string[]) {
    super(
      `Your Instagram export is missing required files: ${missing.join(', ')}. ` +
        'Make sure you selected "Followers and Following" when requesting your data, ' +
        'and that you chose JSON format.',
    );
    this.name = 'MissingFilesError';
  }
}

export class MixedFormatError extends Error {
  readonly code = 'MIXED_FORMAT' as const;
  constructor() {
    super(
      'Your export contains a mix of JSON and HTML files. ' +
        'Please re-download your Instagram data and choose a single format (JSON recommended).',
    );
    this.name = 'MixedFormatError';
  }
}

export class SchemaValidationError extends Error {
  readonly code = 'SCHEMA_VALIDATION' as const;
  constructor(filename: string, detail: string) {
    super(
      `The file "${filename}" in your export has an unexpected format. ` +
        `Instagram may have changed their export structure. Detail: ${detail}`,
    );
    this.name = 'SchemaValidationError';
  }
}
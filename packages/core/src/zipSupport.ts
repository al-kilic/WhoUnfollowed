// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

// Whether this browser can read a ZIP piece by piece (see lazyZip.ts). Kept
// apart from the ZIP reader so a page can ask before loading it.
export function canReadLazily(): boolean {
  return typeof DecompressionStream === 'function' && typeof Blob !== 'undefined' && typeof Blob.prototype.stream === 'function';
}

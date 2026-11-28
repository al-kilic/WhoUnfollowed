// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

// Kept apart from exportContent.ts, which reads ZIPs: the coach stats need
// only this list, and importing it from there pulled the ZIP reader into
// every page that shows them.
export type ContentFormat = 'photo' | 'carousel' | 'reel' | 'video';
export const CONTENT_FORMATS: readonly ContentFormat[] = ['photo', 'carousel', 'reel', 'video'];

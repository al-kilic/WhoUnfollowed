'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useLocale } from 'next-intl';
import {
  canReadLazily, snapshotPlatform, detectDeltaExport, compareSnapshots,
  FileReadError, InvalidZipError, MissingFilesError, SchemaValidationError, MixedFormatError,
  type LooseFile, type ParseExportResult, type ParsedSnapshot, type DeltaReason, type SnapshotComparison,
} from '@ig-tracker/core';
import { useRouter } from '@/i18n/navigation';
import { filesFromDrop, isRelationshipFile, looseFromFiles } from '@/lib/looseExport';
import type { AppLocale } from '@/i18n/routing';
import { useSnapshotStore } from '@/lib/store';
import { useSampleStore } from '@/lib/sample/sampleMode';
import { useSnapshotList, saveSnapshot, deleteSnapshot, freeSnapshotLimit } from '@/hooks/useSnapshots';
import { isSameExport } from '@/lib/sameExport';
import { useAuth } from '@/components/AuthProvider';
import { Events, track, trackFunnel } from '@/lib/analytics';
import { recordParse as recordParseAction } from '@/app/actions/stats';
import { errorName, fileExt, isLikelyMobile, largeFileThreshold, shapeProps, sizeBucket } from '@/lib/uploadDiagnostics';
import type { HomeContent } from '@/app/[locale]/homeContent';

// The homepage upload: read the ZIP in the browser, run the post-parse checks
// (same export, delta warning, free snapshot limit, second-export reveal) and
// open Results. Moved out of the old HeroSection unchanged in behaviour.

export type UploadPhase = 'idle' | 'dragging' | 'parsing' | 'error';

// Allowlisted, fixed error categories for analytics. Never the raw error message.
type ErrorKind = 'missing_data' | 'invalid_zip' | 'unsupported_format' | 'unzipped_file' | 'html_export' | 'file_read' | 'schema_changed' | 'unknown';
type FailProps = Omit<Parameters<typeof trackFunnel<'Analysis Failed'>>[1], 'error_type'>;
export interface UploadError { message: string; kind: ErrorKind; showGuideCta: boolean }
type Errors = HomeContent['hero']['errors'];

function classifyError(err: unknown, e: Errors): UploadError & { props?: FailProps } {
  if (err instanceof MissingFilesError) {
    return {
      message: err.platform === 'threads' ? e.missingThreadsData : err.platform === 'tiktok' ? e.missingTikTokData
        : err.shape?.missingList === 'followers' && err.shape.hasConnectionsFolder ? e.missingFollowers : e.missingData,
      kind: 'missing_data', showGuideCta: true,
      props: { platform: err.platform, ...(err.shape ? shapeProps(err.shape) : {}) },
    };
  }
  if (err instanceof MixedFormatError) return { message: e.mixedFormat, kind: 'unsupported_format', showGuideCta: true };
  if (err instanceof InvalidZipError) return { message: e.invalidZip, kind: 'invalid_zip', showGuideCta: false };
  if (err instanceof SchemaValidationError) return { message: e.schemaChanged, kind: 'schema_changed', showGuideCta: false, props: { schema_reason: err.reason } };
  if (err instanceof FileReadError) return { message: e.fileRead, kind: 'file_read', showGuideCta: false };
  return { message: e.unknown, kind: 'unknown', showGuideCta: false, props: { error_name: errorName(err) } };
}

// The parser chunk starts loading as soon as a file is dragged over the box or
// the picker opens, so it is usually there before the file is.
let parser: Promise<typeof import('@/lib/parseExport')> | null = null;
function loadParser(): Promise<typeof import('@/lib/parseExport')> {
  // A failed load (offline) is retried on the next try, not kept.
  parser ??= import('@/lib/parseExport').catch((err: unknown) => { parser = null; throw err; });
  return parser;
}
const preloadParser = () => { void loadParser().catch(() => {}); };

export interface Reveal { snap: ParsedSnapshot; comparison: SnapshotComparison; oldId: number; newId: number; sinceLabel: string }

export function useExportUpload({ isPro, errors }: { isPro: boolean; errors: Errors }) {
  const router = useRouter();
  const { userId } = useAuth();
  const locale = useLocale() as AppLocale;
  const setSnapshot = useSnapshotStore((s) => s.setSnapshot);
  const snapshots = useSnapshotList(userId);
  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [errInfo, setErrInfo] = useState<UploadError | null>(null);
  const [pending, setPending] = useState<ParsedSnapshot | null>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [deltaWarning, setDeltaWarning] = useState<{ snapshot: ParsedSnapshot; reasons: DeltaReason[] } | null>(null);
  const [combinedNotice, setCombinedNotice] = useState<ParsedSnapshot | null>(null);
  const [largeFile, setLargeFile] = useState<File | null>(null);

  // Compile Results ahead of the upload.
  useEffect(() => { router.prefetch('/app/results'); }, [router]);

  const recordParse = useCallback((snap: ParsedSnapshot) => {
    const followerSet = new Set(snap.followers.map((f) => f.username));
    // Server Action (not a /api/stats fetch) so content blockers can't drop it.
    void recordParseAction(snap.following.filter((f) => !followerSet.has(f.username)).length);
  }, []);

  // Instagram and Threads in one ZIP: the Threads part is kept here and saved
  // only after the main (Instagram) export, so it never counts against the
  // free snapshot limit before the main one is in (one ZIP is one export).
  const extrasRef = useRef<ParsedSnapshot[]>([]);
  const saveExtras = useCallback(() => {
    const extras = extrasRef.current;
    extrasRef.current = [];
    for (const extra of extras) {
      saveSnapshot(extra, userId)
        .then(() => track(Events.zipUpload, { platform: snapshotPlatform(extra) }))
        .catch(() => {});
    }
  }, [userId]);

  const commit = useCallback(async (snap: ParsedSnapshot) => {
    setSnapshot(snap);
    track(Events.zipUpload, { platform: snapshotPlatform(snap) });
    trackFunnel('Analysis Completed', { analysis_type: 'non_followers', platform: snapshotPlatform(snap) });
    router.push('/app/results');
    saveSnapshot(snap, userId).then(() => { trackFunnel('Snapshot Saved', { storage: 'local' }); saveExtras(); }).catch(() => {});
  }, [router, setSnapshot, userId, saveExtras]);

  const showUnzipped = (ext: 'json' | 'html' | 'folder') => {
    setErrInfo({ message: errors.unzippedFile, kind: 'unzipped_file', showGuideCta: true });
    setPhase('error');
    trackFunnel('Analysis Failed', { error_type: 'unzipped_file', file_ext: ext });
  };

  // A newer export of the same platform than the saved one: show what changed.
  const tryReveal = async (snap: ParsedSnapshot): Promise<boolean> => {
    const platform = snapshotPlatform(snap);
    const previous = snapshots.find((s) => snapshotPlatform(s.data) === platform);
    if (!previous?.id || snap.exportedAt <= previous.exportedAt) return false;
    try {
      const newId = await saveSnapshot(snap, userId);
      saveExtras();
      const sinceLabel = new Date(previous.exportedAt * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
      setReveal({ snap, comparison: compareSnapshots(previous.data, snap), oldId: previous.id, newId, sinceLabel });
      trackFunnel('Analysis Completed', { analysis_type: 'comparison', platform });
      return true;
    } catch {
      return false;
    }
  };

  const continueAfterParse = async (snap: ParsedSnapshot) => {
    // The same export again: reopen its results, no warnings, no duplicate.
    if (snapshots.some((s) => isSameExport(s.data, snap))) {
      setPhase('idle');
      track(Events.sameExportReopened, { platform: snapshotPlatform(snap), pro: isPro });
      saveExtras();
      setSnapshot(snap);
      router.push('/app/results');
      return;
    }
    const platform = snapshotPlatform(snap);
    const latestSaved = snapshots.find((s) => snapshotPlatform(s.data) === platform);
    const detection = detectDeltaExport(snap, latestSaved?.data);
    if (detection.isDelta) {
      setPhase('idle');
      setDeltaWarning({ snapshot: snap, reasons: detection.reasons });
      trackFunnel('Export Warning Shown', { reason: detection.reasons.length === 1 ? detection.reasons[0]! : 'multiple' });
      return;
    }
    if (!isPro && snapshots.length >= freeSnapshotLimit(!!userId)) {
      setPhase('idle');
      if (await tryReveal(snap)) return;
      setPending(snap);
    } else {
      await commit(snap);
    }
  };

  const processFile = async (file: File, { skipSizeCheck = false } = {}) => {
    const size = sizeBucket(file.size);
    const ext = fileExt(file.name);
    // TikTok's JSON download can arrive as a bare user_data_tiktok.json.
    const isTikTokJson = ext === 'json' && /user_data/i.test(file.name);
    if (!isTikTokJson && !file.name.toLowerCase().endsWith('.zip') && file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
      // A single JSON/HTML file is almost always from an unzipped export.
      if (ext === 'json' || ext === 'html') { showUnzipped(ext); return; }
      setErrInfo({ message: errors.unsupportedFormat, kind: 'unsupported_format', showGuideCta: false });
      setPhase('error');
      trackFunnel('Analysis Failed', { error_type: 'unsupported_format', file_ext: ext, size });
      return;
    }
    const mobile = isLikelyMobile();
    if (!skipSizeCheck && file.size > largeFileThreshold(mobile, canReadLazily())) {
      setPhase('idle');
      setLargeFile(file);
      trackFunnel('Large File Warning', { size, device: mobile ? 'mobile' : 'desktop' });
      return;
    }
    await runParse(async () => (await loadParser()).parseExportZip(file), size, isTikTokJson ? 'tiktok' : 'unknown');
  };

  // An export that was already unzipped: the picked files, or a dropped folder.
  const processLoose = async (files: LooseFile[]) => {
    if (!files.some((f) => isRelationshipFile(f.path))) { showUnzipped(files.some((f) => /\.html?$/i.test(f.path)) ? 'html' : 'json'); return; }
    await runParse(async () => (await loadParser()).parseExportFiles(files), sizeBucket(0), 'unknown', true);
  };

  const runParse = async (parse: () => Promise<ParseExportResult>, size: ReturnType<typeof sizeBucket>, platform: 'tiktok' | 'unknown', loose = false) => {
    trackFunnel('Upload Started', { size });
    // A real export ends sample mode, so it saves and shows normally. Always
    // clear it: on the homepage the flag is in sessionStorage but not loaded.
    useSampleStore.getState().exit();
    setPhase('parsing');
    setProgress(0);
    let tick = 0;
    const iv = setInterval(() => { tick += 1; setProgress(Math.min(85, tick * 3)); }, 80);
    try {
      const { snapshot: snap, skippedPlatforms, extraSnapshots = [] } = await parse();
      clearInterval(iv);
      setProgress(100);
      recordParse(snap);
      // Instagram and Threads in one ZIP: keep the Threads results too, so the
      // platform switcher on Results shows both from one upload. Saved in the
      // browser only, after the main export (see saveExtras); the same export
      // is never saved twice.
      extrasRef.current = extraSnapshots.filter((extra) => !snapshots.some((s) => isSameExport(s.data, extra)));
      await new Promise((r) => setTimeout(r, 300));
      // Only when the Threads part could not be read: say so, show Instagram.
      if (skippedPlatforms.includes('threads')) { setPhase('idle'); setCombinedNotice(snap); return; }
      await continueAfterParse(snap);
    } catch (err) {
      clearInterval(iv);
      const classified = classifyError(err, errors);
      // Loose files: say exactly which two files to pick.
      const info = loose && classified.kind === 'missing_data' ? { ...classified, message: errors.pickBoth } : classified;
      setErrInfo(info);
      setPhase('error');
      trackFunnel('Analysis Failed', { error_type: info.kind, size, platform, ...info.props });
    }
  };

  const drop = {
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      if (phase === 'parsing') return;
      const entry = e.dataTransfer.items?.[0]?.webkitGetAsEntry?.();
      if (entry?.isDirectory || e.dataTransfer.files.length > 1) {
        // A folder (Safari on Mac unzips downloads) or several files: read
        // the follower and following files from it, as from the ZIP.
        void filesFromDrop(e.dataTransfer).then((files) => (files.length ? processLoose(files) : showUnzipped('folder')));
        return;
      }
      const file = e.dataTransfer.files[0];
      if (file) void processFile(file); else setPhase('idle');
    },
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      preloadParser();
      if (phase === 'idle' || phase === 'error') setPhase('dragging');
    },
    onDragLeave: (e: DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setPhase((p) => (p === 'dragging' ? 'idle' : p));
    },
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = [...(e.target.files ?? [])];
    e.target.value = '';
    // Several files, or one follower/following file: an unzipped export.
    if (list.length > 1 || (list[0] && isRelationshipFile(list[0].name))) { void processLoose(looseFromFiles(list)); return; }
    if (list[0]) void processFile(list[0]);
  };

  const oldest = [...snapshots].sort((a, b) => a.savedAt - b.savedAt)[0];

  return {
    phase, progress, errInfo, inputRef, drop, onFileChange, hasHistory: snapshots.length > 0,
    choose: () => { if (phase !== 'parsing') { preloadParser(); inputRef.current?.click(); } },
    reset: () => { setPhase('idle'); setErrInfo(null); },
    dialogs: {
      largeFile, combinedNotice, deltaWarning, reveal, pending, oldestLabel: oldest?.label ?? null,
      closeLarge: () => setLargeFile(null),
      continueLarge: (f: File) => { setLargeFile(null); void processFile(f, { skipSizeCheck: true }); },
      continueCombined: () => { const s = combinedNotice; setCombinedNotice(null); if (s) void continueAfterParse(s); },
      closeDelta: () => setDeltaWarning(null),
      proceedDelta: async () => {
        const snap = deltaWarning?.snapshot;
        setDeltaWarning(null);
        if (!snap) return;
        if (!isPro && snapshots.length >= freeSnapshotLimit(!!userId)) setPending(snap); else await commit(snap);
      },
      closeReveal: () => setReveal(null),
      revealContinueFree: async () => {
        if (!reveal) return;
        await deleteSnapshot(reveal.oldId, userId);
        setSnapshot(reveal.snap);
        setReveal(null);
        router.push('/app/results');
      },
      closePending: () => setPending(null),
      deleteOldest: async () => {
        if (!pending) return;
        if (oldest?.id != null) await deleteSnapshot(oldest.id, userId);
        await commit(pending);
        setPending(null);
      },
      upgrade: () => router.push('/pricing'),
    },
  };
}

export type ExportUpload = ReturnType<typeof useExportUpload>;

'use client';

import { useState, useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ExternalLink, Download, Search, ArrowUpDown, Calendar, CaseSensitive, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import type { Account } from '@ig-tracker/core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCsvExport } from '@/hooks/useCsvExport';
import { EN_LIST_TOOLBAR, type ListToolbarContent } from '@/components/listToolbar.content';

interface AccountListProps {
  accounts: Account[];
  csvFilename: string;
  emptyMessage?: string;
  // Defaults to English so the unmigrated /diff page (which doesn't pass
  // this) keeps working unchanged.
  content?: ListToolbarContent;
}

const ROW_HEIGHT = 56;

export function AccountList({
  accounts,
  csvFilename,
  emptyMessage = 'No accounts here.',
  content: c = EN_LIST_TOOLBAR,
}: AccountListProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'username' | 'date'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const { requestExport, modal } = useCsvExport(csvFilename);
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const searched = q ? accounts.filter((a) => a.username.toLowerCase().includes(q)) : [...accounts];
    const cmp = sortField === 'username'
      ? (a: Account, b: Account) => a.username.localeCompare(b.username)
      : (a: Account, b: Account) => (a.followedAt ?? 0) - (b.followedAt ?? 0);
    searched.sort(sortDir === 'asc' ? cmp : (a, b) => -cmp(a, b));
    return searched;
  }, [accounts, search, sortField, sortDir]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const listHeight = Math.min(560, Math.max(120, filtered.length * ROW_HEIGHT));

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40 pointer-events-none" />
          <input
            type="search"
            placeholder={c.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-foreground/15 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/40 transition-colors"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortField((f) => (f === 'username' ? 'date' : 'username'))}
          title={sortField === 'username' ? c.sortingByNameTooltip : c.sortingByDateTooltip}
        >
          {sortField === 'username' ? <CaseSensitive className="size-4" /> : <Calendar className="size-4" />}
          {sortField === 'username' ? c.nameLabel : c.dateLabel}
          <ChevronDown className="size-3 -ml-0.5 opacity-50" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          title={
            sortField === 'username'
              ? (sortDir === 'asc' ? c.aToZTooltip : c.zToATooltip)
              : (sortDir === 'asc' ? c.oldestFirstTooltip : c.newestFirstTooltip)
          }
        >
          <ArrowUpDown className="size-4" />
          {sortField === 'username'
            ? (sortDir === 'asc' ? c.aToZ : c.zToA)
            : (sortDir === 'asc' ? c.oldest : c.newest)}
          <ChevronDown className="size-3 -ml-0.5 opacity-50" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => requestExport(filtered)}
          disabled={filtered.length === 0}
        >
          <Download className="size-4" />
          {c.exportCsv}
        </Button>
        {modal}
      </div>

      {/* Count */}
      <p className="text-xs text-foreground/40">
        {filtered.length === accounts.length
          ? c.accountsCount(accounts.length.toLocaleString())
          : c.ofTotal(filtered.length.toLocaleString(), accounts.length.toLocaleString())}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-foreground/10 py-16 text-sm text-foreground/40">
          {search.trim() ? c.noResultsFor(search) : emptyMessage}
        </div>
      ) : (
        <div
          ref={parentRef}
          className="overflow-auto rounded-xl border border-foreground/10"
          style={{ height: listHeight }}
        >
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map((item) => {
              const account = filtered[item.index]!;
              return (
                <div
                  key={account.username}
                  style={{ position: 'absolute', top: item.start, left: 0, right: 0, height: ROW_HEIGHT }}
                  className={cn(
                    'flex items-center gap-3 px-4 border-b border-foreground/[0.06] last:border-0',
                    item.index % 2 === 0 ? 'bg-background' : 'bg-foreground/[0.015]',
                  )}
                >
                  {/* Avatar */}
                  <div
                    aria-hidden="true"
                    className="size-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-xs font-semibold text-primary"
                  >
                    {account.username[0]?.toUpperCase() ?? '?'}
                  </div>

                  {/* Username + date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">@{account.username}</p>
                    {account.followedAt ? (
                      <p className="text-xs text-foreground/40">
                        {format(new Date(account.followedAt * 1000), 'MMM d, yyyy')}
                      </p>
                    ) : null}
                  </div>

                  {/* Open on Instagram */}
                  <a
                    href={account.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open @${account.username} on Instagram`}
                    className="shrink-0 rounded-lg p-1.5 text-foreground/30 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

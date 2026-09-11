"use client";

import React from "react";
import { X, Flame, Sparkles, Star } from "lucide-react";

interface FeedFiltersProps {
  sortBy: "trending" | "latest" | "top";
  onSortChange: (sort: "trending" | "latest" | "top") => void;
  activeTopic?: string;
  onClearTopic?: () => void;
  totalCount: number;
  currentRange: string;
}

export function FeedFilters({
  sortBy,
  onSortChange,
  activeTopic,
  onClearTopic,
  totalCount,
  currentRange,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Navigation Pills */}
        <div className="inline-flex p-1 rounded-full bg-surface-low border border-border/70 shadow-sm">
          <button
            type="button"
            onClick={() => onSortChange("trending")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold transition-all ${
              sortBy === "trending"
                ? "bg-surface-lowest text-ink shadow-sm"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-brand-container" />
            <span>Trending</span>
          </button>
          <button
            type="button"
            onClick={() => onSortChange("latest")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold transition-all ${
              sortBy === "latest"
                ? "bg-surface-lowest text-ink shadow-sm"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>Latest</span>
          </button>
          <button
            type="button"
            onClick={() => onSortChange("top")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold transition-all ${
              sortBy === "top"
                ? "bg-surface-lowest text-ink shadow-sm"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-brand" />
            <span>Top Voted</span>
          </button>
        </div>

        {/* Active Topic Filter Pill */}
        {activeTopic && (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-fixed text-brand-on-fixed font-mono text-[11px] shadow-sm animate-in fade-in">
            <span className="opacity-70">Topic:</span>
            <span className="font-semibold">{activeTopic}</span>
            <button
              type="button"
              onClick={onClearTopic}
              className="hover:text-ink transition-colors ml-1 p-0.5 rounded-full hover:bg-brand-fixed/50"
              aria-label="Clear topic filter"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Discussion Counter */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
        <span className="tabular-nums">
          Showing {currentRange} of {totalCount} discussions
        </span>
      </div>
    </div>
  );
}

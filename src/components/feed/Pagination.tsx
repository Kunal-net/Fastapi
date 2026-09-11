"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  hasMore: boolean;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export function Pagination({ page, hasMore, onPageChange, isLoading }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-6 pb-4">
      <button
        type="button"
        disabled={page <= 1 || isLoading}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-low hover:bg-surface-container active:scale-[0.98] text-ink font-sans text-xs font-medium border border-border transition-all disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Previous</span>
      </button>

      <span className="font-mono text-xs text-ink-muted px-2 select-none">
        Page <strong className="text-ink font-semibold">{page}</strong>
      </span>

      <button
        type="button"
        disabled={!hasMore || isLoading}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-low hover:bg-surface-container active:scale-[0.98] text-ink font-sans text-xs font-medium border border-border transition-all disabled:opacity-40 disabled:pointer-events-none"
      >
        <span>Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowDown, Share2, Bookmark, BookmarkCheck, Edit3, Trash2 } from "lucide-react";
import { useVote } from "@/hooks/useVote";
import { useToast } from "@/components/ui/Toast";

interface StickyActionBarProps {
  postId: number;
  votes: number;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function StickyActionBar({
  postId,
  votes,
  isAuthor,
  onEdit,
  onDelete,
}: StickyActionBarProps) {
  const { hasVoted, toggleVote, isVoting } = useVote(postId, votes);
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        toast("Manuscript link copied to clipboard", "success");
      }
    } catch {
      toast("Failed to copy link", "error");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast(isBookmarked ? "Removed from reading list" : "Saved to reading list", "info");
  };

  return (
    <div className="sticky top-20 z-40 flex justify-center w-full pointer-events-none my-6">
      <div className="pointer-events-auto bg-surface-lowest/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-elevated border border-border flex items-center gap-2">
        {/* Upvote & Dismiss Capsule */}
        <div className="inline-flex items-center rounded-full bg-surface-low p-0.5 border border-border/60">
          <button
            type="button"
            onClick={toggleVote}
            disabled={isVoting}
            className={`group flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold transition-all active:scale-[0.98] ${
              hasVoted
                ? "bg-brand text-surface-bright shadow-sm"
                : "text-ink hover:bg-brand-fixed hover:text-brand-on-fixed"
            }`}
            title={hasVoted ? "Withdraw vote" : "Upvote discussion"}
          >
            <ArrowUp
              className={`w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 ${
                hasVoted ? "stroke-[2.5]" : ""
              }`}
            />
            <span className="tabular-nums">{votes}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (hasVoted) toggleVote();
              toast("Dismissed / Neutral rating marked", "info");
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full text-ink-muted hover:text-ink transition-colors ml-0.5"
            title="Neutral dismiss"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-0.5" />

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-ink-secondary hover:text-ink hover:bg-surface-low font-sans text-xs font-medium transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmark}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            isBookmarked
              ? "text-brand bg-brand-light"
              : "text-ink-secondary hover:text-ink hover:bg-surface-low"
          }`}
          title={isBookmarked ? "Saved" : "Save for later"}
        >
          {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Author Actions */}
        {isAuthor && (
          <>
            <div className="w-px h-4 bg-border mx-0.5" />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onEdit}
                className="px-3 py-1 rounded-full bg-surface-low hover:bg-surface-container text-ink font-sans text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-1 rounded-full text-error hover:bg-error-container/50 font-sans text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

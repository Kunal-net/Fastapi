"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, Clock, MessageSquare, Bookmark, BookmarkCheck, Edit3, Trash2 } from "lucide-react";
import { PostOut } from "@/lib/types";
import { formatRelativeTime, estimateReadingTime, extractInitials, extractTags } from "@/lib/utils";
import { useVote } from "@/hooks/useVote";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";

interface PostCardProps {
  postData: PostOut;
  onEdit?: (post: PostOut) => void;
  onDelete?: (post: PostOut) => void;
  onSelectTag?: (tag: string) => void;
}

export function PostCard({ postData, onEdit, onDelete, onSelectTag }: PostCardProps) {
  const { Post: post, votes } = postData;
  const { user } = useAuth();
  const { hasVoted, toggleVote, isVoting } = useVote(post.id, votes);
  const { toast } = useToast();

  const [isSaved, setIsSaved] = useState(false);

  const isAuthor = user ? user.id === post.user_id : false;
  const readingTime = estimateReadingTime(post.content);
  const initials = extractInitials(post.user?.email || "Pulse Author");
  const tags = extractTags(post.content, post.title);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast(isSaved ? "Removed from reading list" : "Saved to reading list", "info");
  };

  // Strip markdown formatting for preview snippet
  const cleanSnippet = post.content
    ? post.content
        .replace(/#+\s/g, "")
        .replace(/\*\*|__/g, "")
        .replace(/`{1,3}[^`]*`{1,3}/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim()
    : "No manuscript content preview available.";

  return (
    <article className="group relative rounded-2xl bg-surface-lowest p-5 sm:p-6 border border-border shadow-ambient hover:shadow-elevated transition-all duration-200">
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Upvote Capsule Pill */}
        <div className="shrink-0 flex flex-col items-center">
          <button
            type="button"
            onClick={toggleVote}
            disabled={isVoting}
            className={`group/btn flex flex-col items-center justify-center w-11 sm:w-12 py-2 sm:py-2.5 rounded-full border transition-all active:scale-[0.98] ${
              hasVoted
                ? "bg-brand text-surface-bright border-brand shadow-sm"
                : "bg-surface-low text-ink border-border hover:bg-brand-fixed hover:text-brand-on-fixed hover:border-brand-border"
            }`}
            aria-label={hasVoted ? "Withdraw vote" : "Upvote discussion"}
          >
            <ArrowUp
              className={`w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5 ${
                hasVoted ? "stroke-[2.5]" : "text-ink-muted"
              }`}
            />
            <span className="font-mono text-xs font-semibold tabular-nums tracking-tight">
              {votes}
            </span>
          </button>
          <span className="font-mono text-[9px] sm:text-[10px] text-ink-muted mt-1 uppercase tracking-wider select-none">
            {hasVoted ? "Voted" : "Vote"}
          </span>
        </div>

        {/* Post Content Zone */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Metadata */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              {/* Avatar Initials */}
              <div className="w-6 h-6 rounded-full bg-ink text-surface-bright font-mono text-[10px] flex items-center justify-center font-bold shrink-0 border border-border">
                {initials}
              </div>
              <span className="font-sans text-xs font-semibold text-ink truncate max-w-[140px] sm:max-w-[200px]">
                {post.user?.email || "anonymous@fastapi.dev"}
              </span>

              {isAuthor && (
                <span className="px-1.5 py-0.5 rounded-full bg-ink text-surface-bright font-mono text-[9px] uppercase font-semibold tracking-wider">
                  You
                </span>
              )}

              <span className="text-ink-muted text-xs">•</span>
              <span className="font-mono text-[11px] text-ink-muted shrink-0">
                {formatRelativeTime(post.user?.created_at)}
              </span>
            </div>

            {/* Author Direct Management Controls */}
            {isAuthor && (
              <div className="flex items-center gap-1 bg-surface-low px-2 py-0.5 rounded-full border border-border/60">
                <button
                  type="button"
                  onClick={() => onEdit?.(postData)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] text-ink-secondary hover:text-ink hover:bg-surface-lowest transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(postData)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] text-error hover:bg-error-container/50 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/posts/${post.id}`} className="block group/title">
            <h2 className="font-serif text-lg sm:text-xl font-medium text-ink leading-snug group-hover/title:text-brand transition-colors">
              {post.title}
            </h2>
          </Link>

          {/* Content Snippet */}
          <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed line-clamp-2">
            {cleanSnippet}
          </p>

          {/* Tags and Metadata Footer */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag?.(tag)}
                className="px-2 py-0.5 rounded-full bg-surface-low hover:bg-surface-container text-ink-secondary font-mono text-[10px] border border-border/50 transition-colors"
              >
                {tag}
              </button>
            ))}

            <span className="px-2 py-0.5 rounded-full bg-surface-container text-ink-muted font-mono text-[10px] inline-flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{readingTime.minutes} min read</span>
            </span>

            {/* Trailing interactions */}
            <div className="ml-auto flex items-center gap-2 text-ink-muted font-mono text-[11px]">
              <Link
                href={`/posts/${post.id}`}
                className="inline-flex items-center gap-1 hover:text-ink transition-colors p-1"
                title="View discussion thread"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Read</span>
              </Link>

              <button
                type="button"
                onClick={handleToggleBookmark}
                className="inline-flex items-center gap-1 hover:text-ink transition-colors p-1"
                title={isSaved ? "Saved" : "Save discussion"}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-3.5 h-3.5 text-brand" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

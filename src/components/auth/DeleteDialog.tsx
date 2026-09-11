"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Trash2, AlertTriangle, MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  post: {
    id: number;
    title: string;
    votes: number;
    created_at?: string;
  } | null;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  post,
}: DeleteDialogProps) {
  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="relative p-6 sm:p-7 overflow-hidden bg-surface-lowest">
        {/* Red Subtle Accent Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-error-container/40 blur-xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="rounded-2xl bg-error-container text-error p-3 w-12 h-12 flex items-center justify-center mb-4 shadow-sm border border-error/20">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Heading */}
        <h3 className="font-serif text-xl text-ink font-medium tracking-tight mb-1.5">
          Delete this discussion?
        </h3>

        {/* Body Copy */}
        <p className="font-sans text-xs text-ink-secondary leading-relaxed mb-5">
          This action is permanent and cannot be undone. The manuscript{" "}
          <span className="font-semibold text-ink">“{post.title}”</span> and all{" "}
          <span className="font-mono">{post.votes}</span> associated upvotes will be permanently
          deleted from the database.
        </p>

        {/* Post Metadata Preview Card */}
        <div className="bg-surface-low rounded-xl p-3.5 mb-6 flex flex-col gap-2 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <span className="font-mono text-[11px] text-ink font-semibold">sys/manuscript</span>
            </div>
            <span className="font-mono text-[11px] text-ink-muted">id: post_{post.id}</span>
          </div>
          <p className="font-sans text-xs text-ink truncate font-medium">{post.title}</p>
          <div className="flex items-center gap-4 text-ink-muted font-mono text-[11px] pt-1">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-brand" />
              {post.votes}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatRelativeTime(post.created_at)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="bg-surface-container hover:bg-surface-high active:scale-[0.98] text-ink rounded-full px-4 py-2 font-sans text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-error hover:bg-error-hover active:scale-[0.98] text-surface-bright rounded-full px-5 py-2 font-sans text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? "Deleting..." : "Delete Post"}</span>
          </button>
        </div>

        {/* Backend Contract Tag */}
        <div className="mt-6 pt-3 -mx-7 -mb-7 px-7 py-2.5 bg-surface-low border-t border-border flex items-center justify-between">
          <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
            FastAPI Contract
          </span>
          <span className="font-mono text-[10px] text-error bg-surface-container px-2 py-0.5 rounded-full border border-border/40">
            DELETE /posts/{post.id} (204 No Content)
          </span>
        </div>
      </div>
    </Modal>
  );
}

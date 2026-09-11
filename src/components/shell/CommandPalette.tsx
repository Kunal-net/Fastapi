"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Search, Hash, Plus, FileText, ArrowRight } from "lucide-react";
import { PostOut } from "@/lib/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostOut[];
  onSelectTopic: (topic: string) => void;
  onOpenCompose: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  posts,
  onSelectTopic,
  onOpenCompose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredPosts = posts.filter(
    (p) =>
      p.Post.title.toLowerCase().includes(query.toLowerCase()) ||
      p.Post.content.toLowerCase().includes(query.toLowerCase())
  );

  const topics = ["fastapi", "python", "architecture", "concurrency", "design-systems"];
  const filteredTopics = topics.filter((t) => t.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" showCloseButton={false}>
      <div className="bg-surface-lowest">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search discussions, topics, commands... (Esc to close)"
            className="w-full bg-transparent font-sans text-xs sm:text-sm text-ink outline-none placeholder:text-ink-muted"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-surface-low border border-border font-mono text-[10px] text-ink-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          <div className="space-y-1">
            <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Quick Actions
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCompose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-surface-low text-xs text-ink transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-brand" />
                <span className="font-semibold">Start a New Discussion</span>
              </div>
              <ArrowRight className="w-3 h-3 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Topics */}
          {filteredTopics.length > 0 && (
            <div className="space-y-1">
              <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Topics
              </p>
              <div className="flex flex-wrap gap-1.5 px-2">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      onSelectTopic(topic);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-low hover:bg-surface-container font-mono text-[11px] text-ink border border-border/60 transition-colors"
                  >
                    <Hash className="w-3 h-3 text-brand" />
                    <span>{topic}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Discussions */}
          <div className="space-y-1">
            <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Discussions
            </p>
            {filteredPosts.length === 0 ? (
              <p className="px-3 py-3 text-xs text-ink-muted font-sans text-center">
                No matching discussions found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              filteredPosts.slice(0, 6).map((item) => (
                <button
                  key={item.Post.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/posts/${item.Post.id}`);
                  }}
                  className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-surface-low transition-colors group"
                >
                  <FileText className="w-3.5 h-3.5 text-ink-muted shrink-0 mt-0.5 group-hover:text-brand transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xs sm:text-sm font-medium text-ink truncate">
                      {item.Post.title}
                    </p>
                    <p className="font-mono text-[10px] text-ink-muted mt-0.5">
                      {item.votes} votes • by {item.Post.user?.email || "author"}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

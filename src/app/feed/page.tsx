"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/shell/Navbar";
import { Sidebar } from "@/components/shell/Sidebar";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { PostCard } from "@/components/feed/PostCard";
import { Pagination } from "@/components/feed/Pagination";
import { PostEditorModal } from "@/components/post/PostEditorModal";
import { DeleteDialog } from "@/components/auth/DeleteDialog";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/usePosts";
import { PostOut } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { BookOpen, Plus, Loader2 } from "lucide-react";

export default function FeedPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState<"trending" | "latest" | "top">("trending");
  const [activeTopic, setActiveTopic] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostOut | null>(null);
  const [deletingPost, setDeletingPost] = useState<PostOut | null>(null);

  const { toast } = useToast();

  const skip = (page - 1) * limit;
  const { data: posts, isLoading, isError } = usePosts({
    limit,
    skip,
    search: searchQuery,
    sortBy,
  });

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  // Filter by topic if selected
  const displayPosts = (posts || []).filter((item) => {
    if (!activeTopic) return true;
    const combined = `${item.Post.title} ${item.Post.content}`.toLowerCase();
    const cleanTopic = activeTopic.replace("#", "").toLowerCase();
    return combined.includes(cleanTopic);
  });

  const totalCount = posts?.length || 0;
  const currentRange = totalCount > 0 ? `${skip + 1}–${skip + displayPosts.length}` : "0";

  const handleCreatePost = async (title: string, content: string) => {
    await createPostMutation.mutateAsync({ title, content, published: true });
    toast("Manuscript published to community salon", "success");
  };

  const handleUpdatePost = async (title: string, content: string) => {
    if (!editingPost) return;
    await updatePostMutation.mutateAsync({
      id: editingPost.Post.id,
      payload: { title, content, published: true },
    });
    toast("Manuscript revisions saved", "success");
    setEditingPost(null);
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;
    await deletePostMutation.mutateAsync(deletingPost.Post.id);
    toast("Discussion deleted from database", "info");
    setDeletingPost(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-fixed selection:text-brand-on-fixed">
      {/* Sticky Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCompose={() => setIsComposeOpen(true)}
      />

      {/* Main Content Layout */}
      <main className="w-full flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Main Stream */}
            <div className="flex-1 w-full space-y-6">
              {/* Feed Filters & Controls Bar */}
              <FeedFilters
                sortBy={sortBy}
                onSortChange={setSortBy}
                activeTopic={activeTopic}
                onClearTopic={() => setActiveTopic("")}
                totalCount={totalCount}
                currentRange={currentRange}
              />

              {/* Feed Cards Stream */}
              <div className="space-y-4">
                {isLoading ? (
                  // Skeleton state
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-surface-lowest p-6 border border-border/60 animate-pulse space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container" />
                          <div className="h-3 w-32 bg-surface-container rounded-full" />
                        </div>
                        <div className="h-5 w-3/4 bg-surface-container rounded-md" />
                        <div className="h-3 w-full bg-surface-container rounded-md" />
                        <div className="h-3 w-2/3 bg-surface-container rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  <div className="rounded-2xl bg-surface-lowest p-8 border border-border text-center space-y-3 shadow-ambient">
                    <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-ink">
                      Unable to reach FastAPI backend
                    </h3>
                    <p className="font-sans text-xs text-ink-secondary max-w-md mx-auto">
                      Verify that your FastAPI backend is active at{" "}
                      <code className="bg-surface-low px-1.5 py-0.5 rounded font-mono">
                        http://localhost:8000
                      </code>
                      .
                    </p>
                  </div>
                ) : displayPosts.length === 0 ? (
                  <div className="rounded-2xl bg-surface-lowest p-10 border border-border text-center space-y-4 shadow-ambient">
                    <div className="w-12 h-12 rounded-full bg-surface-container text-ink-muted flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-medium text-ink">
                        No manuscripts in this salon yet
                      </h3>
                      <p className="font-sans text-xs text-ink-secondary max-w-sm mx-auto mt-1">
                        {activeTopic
                          ? `No discussions found under ${activeTopic}. Try clearing your topic filter.`
                          : "Be the first thinker to contribute a thesis or technical discourse to the peer cohort."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsComposeOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink text-surface-bright font-sans text-xs font-semibold hover:bg-ink/90 active:scale-[0.98] transition-all shadow-sm mx-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Start a Discussion</span>
                    </button>
                  </div>
                ) : (
                  displayPosts.map((item) => (
                    <PostCard
                      key={item.Post.id}
                      postData={item}
                      onEdit={(post) => setEditingPost(post)}
                      onDelete={(post) => setDeletingPost(post)}
                      onSelectTag={(tag) => setActiveTopic(tag)}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalCount > 0 && (
                <Pagination
                  page={page}
                  hasMore={displayPosts.length >= limit}
                  onPageChange={setPage}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* Right Contextual Sidebar */}
            <Sidebar
              activeTopic={activeTopic}
              onSelectTopic={(topic) => setActiveTopic(topic)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-low border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-ink flex items-center justify-center p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="16" height="16" fill="none">
                  <path
                    d="M8 20.5H13L16 12L20 28L24 16L27 20.5H32"
                    stroke="#F9F6F0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="20" r="1.5" fill="#C25E00" />
                </svg>
              </div>
              <span className="font-serif text-lg text-ink font-medium">Pulse</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-ink-secondary">
              <a href="#" className="hover:text-ink transition-colors">Manifesto</a>
              <a href="#" className="hover:text-ink transition-colors">Guidelines</a>
              <a href="#" className="hover:text-ink transition-colors">Archive</a>
              <a href="#" className="hover:text-ink transition-colors">Privacy</a>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[11px] text-ink-muted">
            <p>© 2025 Pulse Editorial Consortium. Built for contemplative discourse.</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-container animate-pulse" />
              <span>Network Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Compose Manuscript Modal */}
      <PostEditorModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Edit Manuscript Modal */}
      {editingPost && (
        <PostEditorModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSubmit={handleUpdatePost}
          initialTitle={editingPost.Post.title}
          initialContent={editingPost.Post.content}
          isEditing
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <DeleteDialog
          isOpen={!!deletingPost}
          onClose={() => setDeletingPost(null)}
          onConfirm={handleDeletePost}
          isDeleting={deletePostMutation.isPending}
          post={{
            id: deletingPost.Post.id,
            title: deletingPost.Post.title,
            votes: deletingPost.votes,
            created_at: deletingPost.Post.user?.created_at,
          }}
        />
      )}

      {/* ⌘K Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts || []}
        onSelectTopic={(t) => setActiveTopic(t)}
        onOpenCompose={() => setIsComposeOpen(true)}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/shell/Navbar";
import { StickyActionBar } from "@/components/post/StickyActionBar";
import { MarkdownReader } from "@/components/post/MarkdownReader";
import { PostEditorModal } from "@/components/post/PostEditorModal";
import { DeleteDialog } from "@/components/auth/DeleteDialog";
import { usePost, useUpdatePost, useDeletePost } from "@/hooks/usePosts";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  BadgeCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  formatRelativeTime,
  estimateReadingTime,
  extractInitials,
  extractTags,
} from "@/lib/utils";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: postData, isLoading, isError } = usePost(id);
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-16 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
          <p className="font-mono text-xs text-ink-muted">Retrieving manuscript...</p>
        </div>
      </div>
    );
  }

  if (isError || !postData || !postData.Post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl text-ink">Manuscript Not Found</h2>
          <p className="font-sans text-xs text-ink-secondary max-w-sm mx-auto">
            The discussion you are looking for does not exist or may have been deleted.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink text-surface-bright font-sans text-xs font-semibold hover:bg-ink/90 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  const { Post: post, votes } = postData;
  const isAuthor = user ? user.id === post.user_id : false;
  const readingStats = estimateReadingTime(post.content);
  const initials = extractInitials(post.user?.email || "Pulse Author");
  const tags = extractTags(post.content, post.title);

  const handleUpdate = async (title: string, content: string) => {
    await updatePostMutation.mutateAsync({
      id: post.id,
      payload: { title, content, published: true },
    });
    toast("Manuscript updated", "success");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deletePostMutation.mutateAsync(post.id);
    toast("Discussion deleted", "info");
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-fixed selection:text-brand-on-fixed">
      <Navbar />

      <main className="w-full flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Breadcrumb Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/feed"
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-low hover:bg-surface-container text-ink-secondary hover:text-ink transition-all font-sans text-xs shadow-sm border border-border"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Discussions</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-mono text-[11px] text-ink-secondary border border-border/50">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-container" />
                <span>Engineering &amp; Architecture</span>
              </span>
            </div>
          </div>

          {/* Manuscript Header Elevation Card */}
          <header className="bg-surface-lowest rounded-2xl p-6 sm:p-8 border border-border shadow-ambient space-y-5 relative overflow-hidden">
            {/* Ambient Background Blur Glow */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-container/5 blur-3xl pointer-events-none" />

            {/* Tags & Issue Number */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-muted">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full bg-surface-low text-ink-secondary border border-border/60"
                >
                  {t}
                </span>
              ))}
              <span className="ml-auto font-mono text-[11px] text-ink-muted">
                Issue #{post.id}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl text-ink font-normal tracking-tight leading-snug">
              {post.title}
            </h1>

            {/* Author Byline & Verification Row */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ink text-surface-bright font-mono text-xs flex items-center justify-center font-bold shadow-sm border border-border">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-xs sm:text-sm font-semibold text-ink">
                      {post.user?.email || "anonymous@fastapi.dev"}
                    </span>
                    {isAuthor && (
                      <span className="px-1.5 py-0.5 rounded-full bg-ink text-surface-bright font-mono text-[9px] uppercase font-semibold tracking-wider">
                        Author
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-ink-muted flex items-center gap-2 mt-0.5">
                    <span>{formatRelativeTime(post.user?.created_at)}</span>
                    <span>•</span>
                    <span>{readingStats.minutes} min read</span>
                    <span>•</span>
                    <span className="tabular-nums">{readingStats.words} words</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted bg-surface-low px-3 py-1.5 rounded-full border border-border self-start sm:self-auto">
                <BadgeCheck className="w-3.5 h-3.5 text-brand" />
                <span>Peer Reviewed in Core WG</span>
              </div>
            </div>
          </header>

          {/* Floating Sticky Action Bar */}
          <StickyActionBar
            postId={post.id}
            votes={votes}
            isAuthor={isAuthor}
            onEdit={() => setIsEditing(true)}
            onDelete={() => setIsDeleting(true)}
          />

          {/* Manuscript Body Section */}
          <article className="bg-surface-lowest rounded-2xl p-6 sm:p-10 border border-border shadow-ambient space-y-6">
            <MarkdownReader content={post.content} />
          </article>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <PostEditorModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmit={handleUpdate}
          initialTitle={post.title}
          initialContent={post.content}
          isEditing
        />
      )}

      {/* Delete Modal */}
      {isDeleting && (
        <DeleteDialog
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          onConfirm={handleDelete}
          isDeleting={deletePostMutation.isPending}
          post={{
            id: post.id,
            title: post.title,
            votes: votes,
            created_at: post.user?.created_at,
          }}
        />
      )}
    </div>
  );
}

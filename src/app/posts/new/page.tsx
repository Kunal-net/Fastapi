"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shell/Navbar";
import { MarkdownReader } from "@/components/post/MarkdownReader";
import { useCreatePost } from "@/hooks/usePosts";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import {
  ArrowLeft,
  Bold,
  Italic,
  Quote,
  Code,
  Link as LinkIcon,
  List,
  Edit3,
  Eye,
  Plus,
  Send,
  Lock,
} from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { toast } = useToast();
  const createPostMutation = useCreatePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>(["#fastapi", "#python", "#architecture"]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selected = previousText.substring(start, end);

    const replacement = `${before}${selected || "text"}${after}`;
    const newContent =
      previousText.substring(0, start) + replacement + previousText.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected.length || 4));
    }, 0);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const formatted = tagInput.startsWith("#") ? tagInput.trim() : `#${tagInput.trim()}`;
      if (!tags.includes(formatted)) {
        setTags([...tags, formatted]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Please provide both a manuscript title and body content.");
      return;
    }

    setErrorMsg(null);

    try {
      await createPostMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        published: true,
      });
      toast("Manuscript published successfully!", "success");
      router.push("/feed");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Failed to publish manuscript. Verify FastAPI connection.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-fixed selection:text-brand-on-fixed">
      <Navbar />

      <main className="w-full flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Breadcrumb Context & System Sync Banner */}
          <div className="flex items-center justify-between bg-surface-low px-4 py-2.5 rounded-full border border-border text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-container animate-pulse shrink-0" />
              <span className="text-ink-muted truncate">
                Publishing to <strong className="text-ink font-semibold">Community Discussions</strong>{" "}
                • <code className="text-ink-secondary">FastAPI: /posts/</code>
              </span>
            </div>
            <Link
              href="/feed"
              className="inline-flex items-center gap-1 text-ink-secondary hover:text-ink font-sans text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Cancel</span>
            </Link>
          </div>

          {/* Main Card */}
          <div className="bg-surface-lowest rounded-2xl border border-border shadow-ambient overflow-hidden">
            {/* Top Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-container via-brand to-ink" />

            {/* Header */}
            <div className="p-6 sm:p-8 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand font-semibold">
                  New Manuscript
                </span>
                <span className="text-border">•</span>
                <span className="font-mono text-[10px] text-ink-muted">Markdown Enabled</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
                Start a Discussion
              </h1>
              <p className="font-sans text-xs text-ink-secondary mt-1">
                Contribute a thesis, architecture teardown, or technical essay to the peer cohort.
              </p>
            </div>

            {/* Unauthenticated Alert */}
            {!isAuthenticated && (
              <div className="mx-6 sm:mx-8 mb-4 p-3.5 bg-brand-light rounded-xl border border-brand-border flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-brand-on-fixed">
                  <Lock className="w-4 h-4 text-brand" />
                  <span>You must be signed in to publish manuscripts to the community.</span>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="px-3 py-1 rounded-full bg-ink text-surface-bright font-sans text-xs font-semibold hover:bg-ink/90 shrink-0"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Mode Selector Tabs */}
            <div className="px-6 sm:px-8 py-2 flex items-center justify-between border-y border-border/50">
              <div className="inline-flex p-1 rounded-full bg-surface-low border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-semibold transition-all ${
                    activeTab === "write"
                      ? "bg-surface-lowest text-ink shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-semibold transition-all ${
                    activeTab === "preview"
                      ? "bg-surface-lowest text-ink shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                <span className="tabular-nums">{wordCount} words</span>
                <span>•</span>
                <span className="tabular-nums">{charCount} chars</span>
              </div>
            </div>

            {/* Editor Body */}
            <div className="p-6 sm:p-8 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-error-container/50 border border-error/20 rounded-xl text-xs font-sans text-error">
                  {errorMsg}
                </div>
              )}

              {activeTab === "write" ? (
                <>
                  {/* Title Input */}
                  <div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title of your thesis or enquiry..."
                      className="w-full bg-transparent font-serif text-xl sm:text-2xl text-ink placeholder:text-ink-muted/50 outline-none pb-2 border-b border-border focus:border-ink transition-colors"
                    />
                  </div>

                  {/* Micro toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-surface-low rounded-xl border border-border">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => insertMarkdown("**", "**")}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container text-ink flex items-center justify-center transition-colors"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("*", "*")}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container text-ink flex items-center justify-center transition-colors"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("\n> ", "")}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container text-ink flex items-center justify-center transition-colors"
                        title="Quote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-4 bg-border mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown("\n```python\n", "\n```\n")}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container text-ink flex items-center justify-center transition-colors"
                        title="Code Block"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("[", "](https://)")}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container text-ink flex items-center justify-center transition-colors"
                        title="Link"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("\n- ", "")}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container text-ink flex items-center justify-center transition-colors"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-ink-muted uppercase tracking-wider block">
                      Index Tags
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-surface-low border border-border min-h-[42px]">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-high text-ink font-mono text-[11px]"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-ink-muted hover:text-ink text-xs ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <div className="inline-flex items-center gap-1 text-ink-muted px-1">
                        <Plus className="w-3 h-3" />
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="Add tag + Enter..."
                          className="bg-transparent font-mono text-[11px] text-ink placeholder:text-ink-muted outline-none min-w-[120px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Body Textarea */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-ink-muted uppercase tracking-wider block">
                      Manuscript Body (Markdown)
                    </label>
                    <div className="relative rounded-xl bg-surface-low p-3.5 border border-border">
                      <textarea
                        ref={textareaRef}
                        rows={14}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your long-form discourse, architectural proofs, or technical enquiry..."
                        className="w-full bg-transparent font-mono text-xs text-ink outline-none resize-y leading-relaxed min-h-[260px]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Preview */
                <div className="space-y-4 py-2">
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
                    {title || "Untitled Manuscript"}
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] text-ink-secondary bg-surface-container px-2.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-border">
                    <MarkdownReader content={content || "*No content entered yet.*"} />
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="px-6 sm:px-8 py-4 bg-surface-low border-t border-border flex items-center justify-between">
              <Link
                href="/feed"
                className="px-4 py-2 rounded-full font-sans text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-container transition-colors"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createPostMutation.isPending}
                className="bg-ink hover:bg-ink/90 active:scale-[0.98] text-surface-bright rounded-full px-6 py-2.5 font-sans text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {createPostMutation.isPending ? "Submitting..." : "Publish Manuscript"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

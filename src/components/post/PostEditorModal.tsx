"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  Bold,
  Italic,
  Quote,
  Code,
  Link as LinkIcon,
  List,
  CheckCircle2,
  Edit3,
  Eye,
  Plus,
  X,
  Send,
} from "lucide-react";
import { MarkdownReader } from "./MarkdownReader";

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
}

export function PostEditorModal({
  isOpen,
  onClose,
  onSubmit,
  initialTitle = "",
  initialContent = "",
  isEditing = false,
}: PostEditorModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(["#fastapi", "#python", "#architecture"]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setContent(initialContent);
      setActiveTab("write");
      setErrorMsg(null);
    }
  }, [isOpen, initialTitle, initialContent]);

  // Word & character counts
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
    if (!title.trim() || !content.trim()) {
      setErrorMsg("Please provide both a manuscript title and body content.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSubmit(title.trim(), content.trim());
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Failed to publish manuscript. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl">
      <div className="flex flex-col max-h-[90vh] bg-surface-lowest overflow-hidden">
        {/* Accent Baseline Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-container via-brand to-ink" />

        {/* System Sync Banner */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-surface-low border-b border-border/70 text-xs font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-brand-container animate-pulse shrink-0" />
            <span className="text-ink-muted truncate">
              Publishing to <strong className="text-ink font-semibold">Community Discussions</strong>{" "}
              • <code className="text-ink-secondary">FastAPI: /posts/</code>
            </span>
          </div>
          <span className="hidden sm:inline-block text-ink-muted text-[11px]">
            Markdown Supported
          </span>
        </div>

        {/* Header Section */}
        <div className="px-6 sm:px-8 pt-5 pb-3 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand font-semibold">
                {isEditing ? "Revise Manuscript" : "New Manuscript"}
              </span>
              <span className="text-border-strong">•</span>
              <span className="font-mono text-[10px] text-ink-muted">Peer Salons</span>
            </div>
            <h2 className="font-serif text-2xl text-ink font-medium tracking-tight">
              {isEditing ? "Edit Discussion" : "Start a Discussion"}
            </h2>
            <p className="font-sans text-xs text-ink-secondary mt-0.5">
              Contribute a thesis, architecture teardown, or technical essay to the peer cohort.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs & Counters */}
        <div className="px-6 sm:px-8 py-2 flex items-center justify-between border-b border-border/50">
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

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-4 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-error-container/50 border border-error/20 rounded-xl text-xs font-sans text-error">
              {errorMsg}
            </div>
          )}

          {activeTab === "write" ? (
            <>
              {/* Title Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title of your thesis or enquiry..."
                  className="w-full bg-transparent font-serif text-xl sm:text-2xl text-ink placeholder:text-ink-muted/50 outline-none pb-2 border-b border-border focus:border-ink transition-colors"
                />
              </div>

              {/* Formatting Micro-Toolbar */}
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

                <div className="flex items-center gap-1 font-mono text-[10px] text-ink-muted px-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                  <span>Draft Ready</span>
                </div>
              </div>

              {/* Tags Selector */}
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

              {/* Markdown Textarea */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-ink-muted uppercase tracking-wider block">
                  Manuscript Body (Markdown)
                </label>
                <div className="relative rounded-xl bg-surface-low p-3.5 border border-border">
                  <textarea
                    ref={textareaRef}
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your long-form discourse, architectural proofs, or technical enquiry..."
                    className="w-full bg-transparent font-mono text-xs text-ink outline-none resize-y leading-relaxed min-h-[220px]"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="space-y-4 py-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
                {title || "Untitled Manuscript"}
              </h1>
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

        {/* Modal Action Footer */}
        <div className="px-6 sm:px-8 py-3.5 bg-surface-low border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-sans text-xs font-semibold text-ink-secondary hover:text-ink hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-ink hover:bg-ink/90 active:scale-[0.98] text-surface-bright rounded-full px-6 py-2.5 font-sans text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {isSubmitting
                ? "Submitting..."
                : isEditing
                ? "Save Changes"
                : "Publish Manuscript"}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

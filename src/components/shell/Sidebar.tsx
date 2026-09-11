"use client";

import React from "react";
import { Hash, BookOpen, Activity, ShieldCheck } from "lucide-react";

interface SidebarProps {
  activeTopic?: string;
  onSelectTopic: (topic: string) => void;
}

const TOPICS = [
  { name: "fastapi", tag: "#fastapi", count: 18 },
  { name: "python", tag: "#python", count: 24 },
  { name: "architecture", tag: "#architecture", count: 12 },
  { name: "concurrency", tag: "#concurrency", count: 9 },
  { name: "design-systems", tag: "#design-systems", count: 15 },
  { name: "postgresql", tag: "#postgresql", count: 11 },
];

export function Sidebar({ activeTopic, onSelectTopic }: SidebarProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Topics Taxonomy Module */}
      <div className="bg-surface-lowest rounded-2xl p-5 border border-border shadow-ambient space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <Hash className="w-3.5 h-3.5 text-brand" />
          <span>Curated Topics</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {TOPICS.map((item) => {
            const isSelected = activeTopic === item.name || activeTopic === item.tag;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onSelectTopic(isSelected ? "" : item.name)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[11px] transition-all active:scale-[0.98] ${
                  isSelected
                    ? "bg-ink text-surface-bright shadow-sm"
                    : "bg-surface-low hover:bg-surface-container text-ink-secondary hover:text-ink border border-border/60"
                }`}
              >
                <span>{item.tag}</span>
                <span className="opacity-60 text-[10px]">({item.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Salon Manifesto Card */}
      <div className="bg-surface-lowest rounded-2xl p-5 border border-border shadow-ambient space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <BookOpen className="w-3.5 h-3.5 text-brand" />
          <span>The Pulse Salon Manifesto</span>
        </div>
        <p className="font-sans text-xs text-ink-secondary leading-relaxed">
          An intellectual salon for long-form dialogue, critical essays, and mindful community discourse. We prioritize technical gravity over fleeting hot takes.
        </p>
        <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-ink-muted font-mono text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-container" />
          <span>Peer-reviewed contributions</span>
        </div>
      </div>

      {/* System Status Pill Card */}
      <div className="bg-surface-low rounded-2xl p-4 border border-border text-xs space-y-2">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-ink font-semibold">FastAPI Connected</span>
          </div>
          <span className="text-ink-muted">v2.4-stable</span>
        </div>
        <p className="font-mono text-[10px] text-ink-muted">
          Endpoint: <code className="text-ink-secondary">http://localhost:8000</code>
        </p>
      </div>

      {/* Footer Meta */}
      <footer className="px-1 text-[11px] font-sans text-ink-muted space-y-1">
        <p>© 2025 Pulse Editorial Consortium.</p>
        <p className="text-[10px]">Parchment aesthetic • Newsreader &amp; Geist</p>
      </footer>
    </aside>
  );
}

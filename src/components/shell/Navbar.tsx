"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Plus, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { extractInitials } from "@/lib/utils";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenCompose?: () => void;
}

export function Navbar({ onOpenSearch, onOpenCompose }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = extractInitials(user?.email || "PL");

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border shadow-ambient transition-all">
      <div className="h-16 max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/feed" className="flex items-center gap-2.5 group">
            {/* Pulse SVG Logo */}
            <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center p-1 shadow-sm transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="24" height="24" fill="none">
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
            <span className="font-serif text-xl sm:text-2xl text-ink font-medium tracking-tight group-hover:opacity-90 transition-opacity">
              Pulse
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container font-mono text-[10px] text-ink-muted border border-border uppercase tracking-wider">
            Community
          </span>
        </div>

        {/* Search Bar Input / Trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-surface-low border border-border text-xs text-ink hover:border-ink/40 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2 text-ink-muted flex-1 text-left">
              <Search className="w-3.5 h-3.5" />
              <span className="font-sans text-xs">Search discussions, essays, tags...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-lowest border border-border font-mono text-[10px] text-ink-muted uppercase">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4">
          <Link
            href="/feed"
            className={`font-sans text-xs font-semibold transition-colors ${
              pathname === "/feed" || pathname === "/"
                ? "text-ink"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            Discussions
          </Link>
          <Link
            href="/feed?filter=essays"
            className="font-sans text-xs text-ink-secondary hover:text-ink transition-colors"
          >
            Essays
          </Link>
          <Link
            href="/feed?filter=topics"
            className="font-sans text-xs text-ink-secondary hover:text-ink transition-colors"
          >
            Topics
          </Link>
        </nav>

        {/* Actions & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* New Discussion Button */}
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal("signin");
              } else {
                onOpenCompose?.();
              }
            }}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-ink text-surface-bright font-sans text-xs font-semibold hover:bg-ink/90 active:scale-[0.98] transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Discussion</span>
          </button>

          {/* User Profile Pill or Sign In Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 pl-1 py-1 pr-2.5 rounded-full bg-surface-low border border-border hover:bg-surface-container active:scale-[0.98] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-ink text-surface-bright font-mono text-[10px] flex items-center justify-center font-bold">
                  {initials}
                </div>
                <span className="hidden sm:inline font-mono text-[11px] text-ink max-w-[100px] truncate">
                  {user.email}
                </span>
                <ChevronDown className="w-3 h-3 text-ink-muted" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-surface-lowest rounded-2xl shadow-elevated border border-border py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-border/60">
                    <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                      Author Account
                    </p>
                    <p className="font-sans text-xs font-semibold text-ink truncate mt-0.5">
                      {user.email}
                    </p>
                    <p className="font-mono text-[10px] text-ink-muted mt-0.5">
                      User ID: #{user.id}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/posts/new"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-ink hover:bg-surface-low transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-brand" />
                      <span>Create Manuscript</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-error hover:bg-error-container/40 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-low hover:bg-surface-container text-ink font-sans text-xs font-semibold border border-border transition-all active:scale-[0.98]"
            >
              <User className="w-3.5 h-3.5 text-ink-muted" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

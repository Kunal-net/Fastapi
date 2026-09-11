"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Modal } from "@/components/ui/Modal";
import { AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

export function AuthDialog() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (authModalTab === "signin") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (detail) {
        if (typeof detail === "string") {
          setErrorMsg(detail);
        } else if (Array.isArray(detail)) {
          setErrorMsg(detail[0]?.msg || "Validation error");
        } else {
          setErrorMsg("Authentication failed. Check credentials.");
        }
      } else if (err.response?.status === 403) {
        setErrorMsg("HTTP 403: Invalid email or password.");
      } else if (err.response?.status === 409) {
        setErrorMsg("An account with this email already exists.");
      } else {
        setErrorMsg("Unable to connect to FastAPI backend at http://localhost:8000.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="md">
      <div className="relative p-7 sm:p-8 overflow-hidden bg-surface-lowest">
        {/* Top Subtle Warm Ambient Accent Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-brand-container/10 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center p-2 mb-3 shadow-sm border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="32" height="32" fill="none">
              <rect width="40" height="40" rx="8" fill="#1C1917" />
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
          <h2 className="font-serif text-2xl text-ink font-medium tracking-tight mb-1">
            {authModalTab === "signin" ? "Welcome back to Pulse" : "Join the Pulse Salon"}
          </h2>
          <p className="font-sans text-xs text-ink-secondary max-w-xs">
            {authModalTab === "signin"
              ? "Join the discussion or sign in to vote and post manuscripts."
              : "Create an author profile to contribute essays and engage in discussions."}
          </p>
        </div>

        {/* Pill Tab Switcher */}
        <div className="bg-surface-container p-1 rounded-full flex items-center mb-5 border border-border/50">
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              openAuthModal("signin");
            }}
            className={`flex-1 py-1.5 text-center rounded-full font-sans text-xs font-semibold transition-all duration-200 ${
              authModalTab === "signin"
                ? "bg-ink text-surface-bright shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              openAuthModal("register");
            }}
            className={`flex-1 py-1.5 text-center rounded-full font-sans text-xs font-semibold transition-all duration-200 ${
              authModalTab === "register"
                ? "bg-ink text-surface-bright shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error State Banner */}
        {errorMsg && (
          <div className="mb-4 bg-error-container/50 border border-error/20 p-3 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-sans text-xs font-semibold text-error">Authentication Notice</p>
              <p className="font-sans text-xs text-ink-secondary mt-0.5">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-ink-secondary hover:text-ink text-xs font-mono"
            >
              ×
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="font-sans text-xs font-semibold text-ink" htmlFor="auth-email">
                Email address
              </label>
              <span className="font-mono text-[10px] text-ink-muted">OAuth2 spec</span>
            </div>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@fastapi.dev"
              className="w-full bg-surface-low rounded-xl px-3.5 py-2.5 font-sans text-xs text-ink border border-border focus:outline-none focus:border-ink focus:bg-surface-lowest shadow-sm placeholder:text-ink-muted transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="font-sans text-xs font-semibold text-ink" htmlFor="auth-password">
                Password
              </label>
              {authModalTab === "signin" && (
                <span className="font-mono text-[10px] text-brand hover:underline cursor-pointer">
                  Forgot password?
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-low rounded-xl px-3.5 py-2.5 pr-10 font-sans text-xs text-ink border border-border focus:outline-none focus:border-ink focus:bg-surface-lowest shadow-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-ink hover:bg-ink/90 active:scale-[0.98] text-surface-bright rounded-full py-2.5 font-sans text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? "Verifying..."
                  : authModalTab === "signin"
                  ? "Sign In"
                  : "Create Account"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Integration Contract Footnote */}
        <div className="mt-6 pt-3.5 border-t border-border/60 -mx-8 -mb-8 px-8 py-3 bg-surface-low flex items-center justify-between">
          <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
            FastAPI Contract
          </span>
          <span className="font-mono text-[10px] text-ink-secondary bg-surface-container px-2 py-0.5 rounded-full border border-border/40">
            {authModalTab === "signin"
              ? "POST /login (x-www-form-urlencoded)"
              : "POST /user/ (application/json)"}
          </span>
        </div>
      </div>
    </Modal>
  );
}

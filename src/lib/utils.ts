import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return "recently";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "recently";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "recently";
  }
}

export function estimateReadingTime(content: string = ""): { minutes: number; words: number } {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { minutes, words };
}

export function extractInitials(email: string = ""): string {
  if (!email) return "PL";
  const namePart = email.split("@")[0] || "";
  const parts = namePart.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return namePart.slice(0, 2).toUpperCase() || "PL";
}

export function extractTags(content: string = "", title: string = ""): string[] {
  const combined = `${title} ${content}`.toLowerCase();
  const keywords: { [key: string]: string } = {
    fastapi: "#fastapi",
    python: "#python",
    async: "#concurrency",
    database: "#postgresql",
    sql: "#sqlalchemy",
    redis: "#redis",
    design: "#design-systems",
    architecture: "#architecture",
    performance: "#performance",
    security: "#security",
  };

  const found = new Set<string>();
  for (const [key, tag] of Object.entries(keywords)) {
    if (combined.includes(key)) {
      found.add(tag);
    }
  }

  // Also check for explicit hashtags in content like #topic
  const hashtagMatches = content.match(/#[a-zA-Z0-9_-]+/g);
  if (hashtagMatches) {
    hashtagMatches.slice(0, 3).forEach((t) => found.add(t.toLowerCase()));
  }

  if (found.size === 0) {
    found.add("#discussions");
    found.add("#engineering");
  }

  return Array.from(found).slice(0, 4);
}

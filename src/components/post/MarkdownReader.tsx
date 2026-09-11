"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownReaderProps {
  content: string;
}

export function MarkdownReader({ content }: MarkdownReaderProps) {
  return (
    <div className="editorial-prose text-ink font-sans leading-[1.7] space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight mt-6 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-xl sm:text-2xl text-ink font-medium tracking-tight mt-5 mb-2.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-lg text-ink font-semibold mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-ink-secondary text-sm sm:text-base leading-[1.7] mb-4">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-brand bg-surface-low/80 py-3 px-4 rounded-r-xl shadow-sm italic text-ink font-serif text-base">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-1.5 text-sm sm:text-base text-ink-secondary mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-1.5 text-sm sm:text-base text-ink-secondary mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline font-medium transition-colors"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-5 rounded-xl border border-border">
              <table className="min-w-full divide-y divide-border text-left font-sans text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-low font-semibold text-ink">{children}</thead>
          ),
          th: ({ children }) => <th className="px-4 py-2.5">{children}</th>,
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-ink-secondary border-t border-border/50">
              {children}
            </td>
          ),
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");

            if (!inline) {
              return <CodeBlock language={language} code={codeString} />;
            }

            return (
              <code
                className="font-mono text-xs bg-surface-low text-ink px-1.5 py-0.5 rounded-md border border-border/60"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden bg-[#1E1B19] text-[#FAF7F2] border border-[#2D2825] shadow-card font-mono text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161413] border-b border-[#2D2825] select-none">
        <span className="text-[11px] font-mono text-[#A8A29E] uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-[#A8A29E] hover:text-white transition-colors"
          title="Copy code"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-container" />
              <span className="text-brand-container font-mono">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

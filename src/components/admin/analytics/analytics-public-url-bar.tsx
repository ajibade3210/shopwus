import { Check, Copy, ExternalLink, Globe } from "lucide-react";
import { useState } from "react";
import type { AnalyticsPublicUrlBarProps } from "@/types";

export function AnalyticsPublicUrlBar({ slug, onNotify }: AnalyticsPublicUrlBarProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : "https://shopwus.com"}/${slug}`;

  const copyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      onNotify?.("Public shop URL copied to clipboard!");
    }
  };

  return (
    <div className="bg-card border border-border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-card">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-border-hairline flex items-center justify-center shrink-0 text-primary">
          <Globe size={15} />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
            Public Shop URL
          </span>
          <span className="text-xs text-on-surface-variant font-mono block truncate max-w-xs sm:max-w-md">
            {publicUrl}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
        <button
          type="button"
          onClick={copyUrl}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-4 h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          {copied ? (
            <>
              <Check size={13} className="text-tertiary" />
              <span className="text-tertiary">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy Link</span>
            </>
          )}
        </button>
        <a
          href={`/${slug}?from=analytics`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <span>View Live</span>
          <ExternalLink size={12} className="text-white" />
        </a>
      </div>
    </div>
  );
}

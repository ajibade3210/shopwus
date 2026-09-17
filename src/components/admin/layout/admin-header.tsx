"use client";

import { ArrowRight, Bell, Eye, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCurrentStudio } from "@/hooks/use-current-studio";
import { publishChanges } from "@/lib/api";
import type { AdminHeaderProps } from "@/types";

export function AdminHeader({ onMenu, onToast, path }: AdminHeaderProps) {
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();
  const currentPath = path || pathname || "";
  const isSettingsPage =
    currentPath === "/vendor/settings" || currentPath === "/vendor/preferences";

  const { slug } = useCurrentStudio();

  return (
    <header className="h-[76px] max-[750px]:h-[65px] px-3.5 sm:px-8 lg:px-10 flex items-center justify-between border-b border-transparent">
      <button
        className="hidden max-[750px]:grid place-items-center bg-transparent border-0 text-muted hover:text-on-surface cursor-pointer p-1.5 rounded-md hover:bg-surface-high transition-colors"
        onClick={onMenu}
        type="button"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="h-10 px-3 flex items-center gap-2.5 w-[280px] max-[750px]:flex-1 max-[750px]:min-w-0 max-[750px]:max-w-[170px] sm:max-w-[280px] max-[750px]:ml-2 bg-surface border border-border-hairline rounded-lg text-muted focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <Search size={15} className="shrink-0 text-muted" />
        <input
          aria-label="Search"
          placeholder="Search..."
          className="border-0 bg-transparent py-1.5 text-xs text-on-surface focus:outline-none w-full placeholder:text-muted truncate"
        />
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted bg-surface-high rounded border border-border-hairline select-none pointer-events-none">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isSettingsPage && (
          <>
            <a
              href={`/${slug}?from=settings`}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-2.5 sm:px-3.5 inline-flex items-center justify-center gap-1.5 rounded-md border border-border-hairline bg-card hover:bg-surface text-on-surface text-xs font-semibold transition-colors shrink-0 whitespace-nowrap shadow-2xs"
              title="View Online Store"
            >
              <Eye size={14} className="text-on-surface shrink-0" />
              <span>View Store</span>
            </a>
            <button
              type="button"
              className="h-9 px-3 sm:px-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors shrink-0 whitespace-nowrap shadow-2xs cursor-pointer disabled:opacity-60"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await publishChanges();
                setBusy(false);
                onToast("Changes published successfully");
              }}
            >
              {busy ? (
                <span>Publishing…</span>
              ) : (
                <>
                  <span>
                    Publish<span className="hidden sm:inline"> changes</span>
                  </span>
                  <ArrowRight size={13} className="shrink-0" />
                </>
              )}
            </button>
          </>
        )}
        <button
          className="hidden sm:grid place-items-center w-9 h-9 rounded-md bg-surface-low hover:bg-surface-high text-muted hover:text-on-surface transition-colors cursor-pointer border-0"
          aria-label="Notifications"
          title="Notifications"
          type="button"
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}

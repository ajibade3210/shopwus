"use client";

import { Loader2, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clearSession } from "@/lib/api";
import type { LogoutConfirmModalProps } from "@/types";

export function LogoutConfirmModal({ isOpen, onClose }: LogoutConfirmModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoggingOut) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoggingOut, onClose]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await clearSession();
    } finally {
      window.location.replace("/login");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => !isLoggingOut && onClose()}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-popover font-sans text-on-surface animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-error-container/60 text-error flex items-center justify-center">
            <LogOut size={18} />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="text-muted hover:text-on-surface p-1 rounded-lg hover:bg-surface-high transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-on-surface tracking-tight">Log out?</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onClose}
            className="bg-surface-low hover:bg-surface-high text-on-surface border border-border-hairline px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="bg-error hover:bg-error-hover text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Logging out…</span>
              </>
            ) : (
              <span>Log out</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

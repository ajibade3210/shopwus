"use client";

import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import type { ConfirmModalProps } from "@/types";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Remove",
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-popover font-sans text-on-surface animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface tracking-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-muted hover:text-on-surface p-1 rounded-lg hover:bg-surface-high transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed">{description}</p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="bg-surface-low hover:bg-surface-high text-on-surface border border-border-hairline px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="bg-error hover:bg-error-hover text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>{confirmLabel}…</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

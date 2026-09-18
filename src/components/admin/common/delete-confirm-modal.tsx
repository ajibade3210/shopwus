"use client";

import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import type { DeleteConfirmModalProps } from "@/types";

export function DeleteConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDeleting = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl shadow-popover p-6 max-w-sm w-full space-y-4 font-sans text-on-surface"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-on-surface">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-outline hover:text-on-surface p-1 cursor-pointer transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed">{description}</p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex items-center justify-center bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-1.5 bg-error hover:bg-error-hover text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            {isDeleting && <Loader2 size={13} className="animate-spin" />}
            <span>{isDeleting ? "Deleting..." : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

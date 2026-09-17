"use client";

import { Loader2 } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={() => !isLoggingOut && onClose()}
    >
      <div
        className="bg-white border border-[#eee7dc] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1f1d1a]">Log out?</h3>
          <p className="text-xs text-[#665e57] mt-1 leading-relaxed">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onClose}
            className="bg-white hover:bg-[#f8f4ed] text-[#2a1d15] border border-[#ded5c8] hover:border-[#c59a78] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="bg-[#191c1d] hover:bg-black !text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
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

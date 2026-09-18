"use client";

import { Check, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { AdminToastContextType, AdminToastProviderProps, ToastProps } from "@/types";

export const AdminToastContext = createContext<AdminToastContextType>({
  showToast: () => {},
});

export function useAdminToast() {
  return useContext(AdminToastContext);
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#191c1d] text-white px-4 py-3 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Check size={15} className="text-[#4ade80] shrink-0" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-[#9ca3af] hover:text-white transition-colors cursor-pointer ml-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function AdminToastProvider({ children }: AdminToastProviderProps) {
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </AdminToastContext.Provider>
  );
}

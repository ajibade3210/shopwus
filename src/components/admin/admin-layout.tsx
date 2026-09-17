"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminLayoutProps } from "@/types";
import { AdminHeader } from "./layout/admin-header";
import { AdminSidebar } from "./layout/admin-sidebar";
import { AdminToastProvider, useAdminToast } from "./layout/admin-toast-provider";

export { BrandLogo as Brand } from "@/components/shared/brand-logo";
export { formatDate, formatMoney, formatStatusLabel } from "@/utils";
export { Metric, MetricsGrid } from "./common/metric-card";
export { PageTitle } from "./common/page-header";
export { AdminHeader as Header } from "./layout/admin-header";
export { AdminSidebar as Sidebar } from "./layout/admin-sidebar";
export { AdminToastProvider, Toast, useAdminToast } from "./layout/admin-toast-provider";
export { LogoutConfirmModal } from "./layout/logout-modal";

function AdminLayoutInner({ children, path, onToast }: AdminLayoutProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = path || pathname || "/";
  const { showToast } = useAdminToast();

  const handleToast = (msg: string) => {
    showToast(msg);
    if (onToast) onToast(msg);
  };

  // Automatically close sidebar whenever user switches routes
  useEffect(() => {
    if (currentPath) {
      setOpen(false);
    }
  }, [currentPath]);

  // Swipe right to open sidebar, swipe left to close on mobile and tablet
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let isTracking = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || window.innerWidth > 1024) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest("input, textarea, select, [role='slider'], .no-swipe")) {
        return;
      }
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTracking = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTracking || e.changedTouches.length !== 1) return;
      isTracking = false;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);

      if (diffY > 80 || Math.abs(diffX) < diffY * 1.4) return;

      if (diffX > 50 && touchStartX < window.innerWidth * 0.5) {
        setOpen(true);
      } else if (diffX < -50 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [open]);

  return (
    <div className="flex min-h-screen w-full max-w-full bg-surface overflow-x-hidden">
      {/* Mobile backdrop overlay to dismiss sidebar */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-45 cursor-pointer max-[750px]:block hidden animate-in fade-in duration-200 border-0 p-0"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <AdminSidebar path={currentPath} open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 ml-[240px] max-[750px]:ml-0 w-[calc(100%-240px)] max-[750px]:w-full max-w-[calc(100%-240px)] max-[750px]:max-w-full overflow-x-hidden min-h-screen flex flex-col">
        <AdminHeader onMenu={() => setOpen(true)} onToast={handleToast} path={currentPath} />
        <main className="flex-1 max-w-[1180px] w-full mx-auto px-3.5 sm:px-8 lg:px-10 py-5 sm:py-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <AdminToastProvider>
      <AdminLayoutInner {...props} />
    </AdminToastProvider>
  );
}

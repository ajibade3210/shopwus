"use client";

import {
  ArrowLeftRight,
  Eye,
  FileText,
  LogOut,
  Package,
  Receipt,
  ShoppingBag,
  Store,
  TrendingUp,
  UserSearch,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useLeadsSummaryQuery, useOrderSummaryQuery } from "@/hooks/queries";
import { useCurrentStudio } from "@/hooks/use-current-studio";
import { useUnseenBadge } from "@/hooks/use-unseen-badge";
import type { AdminSidebarProps } from "@/types";
import { LogoutConfirmModal } from "./logout-modal";

export function AdminSidebar({ path, open, onClose }: AdminSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isPreferencesActive = path === "/vendor/settings" || path === "/vendor/preferences";
  const [onlineStoreExpanded, setOnlineStoreExpanded] = useState<boolean>(
    () => isPreferencesActive
  );

  const { slug, userName, userRole, initials } = useCurrentStudio();
  const { data: leadsSummary } = useLeadsSummaryQuery();
  const { data: orderSummary } = useOrderSummaryQuery();

  const unseenLeads = useUnseenBadge("leads_badge", leadsSummary?.total ?? null);
  const unseenOrders = useUnseenBadge("orders_badge", orderSummary?.totalOrders ?? null);

  // Close sidebar on click outside or Escape key when open
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement | null;
        if (target?.closest(".mobile-menu")) return;
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    setOnlineStoreExpanded(isPreferencesActive);
  }, [isPreferencesActive]);

  const navLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 text-[13px] font-sans rounded-lg transition-all w-full cursor-pointer text-decoration-none ${
      isActive
        ? "bg-card text-primary font-semibold shadow-xs border border-border-hairline/60"
        : "text-muted hover:text-on-surface hover:bg-surface-high font-medium"
    }`;

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 h-screen max-h-screen w-[240px] flex flex-col bg-surface-low border-r border-border-hairline p-[28px_18px_22px] z-40 transition-transform duration-200 font-sans max-[750px]:w-[280px] max-[750px]:z-50 max-[750px]:-translate-x-full ${
          open ? "max-[750px]:!translate-x-0 max-[750px]:shadow-[10px_0_30px_rgba(0,0,0,0.12)]" : ""
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center shrink-0">
          <BrandLogo className="brand" href="/" />
          <button
            className="hidden max-[750px]:grid place-items-center bg-transparent border-0 text-muted hover:text-on-surface cursor-pointer p-1 rounded-md font-sans"
            onClick={onClose}
            type="button"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto no-scrollbar overscroll-contain flex flex-col gap-1 mt-6 sm:mt-8 pb-3 font-sans">
          <Link
            className={navLinkClass(
              path === "/vendor/analytics" || path === "/vendor/overview" || path === "/vendor"
            )}
            href="/vendor/analytics"
            onClick={onClose}
          >
            <TrendingUp size={16} /> Analytics
          </Link>
          <Link
            className={navLinkClass(path?.startsWith("/vendor/orders"))}
            href="/vendor/orders"
            onClick={onClose}
          >
            <ShoppingBag size={16} /> Orders{" "}
            {unseenOrders > 0 && (
              <span className="ml-auto text-[11px] font-mono bg-surface-high text-on-surface-variant px-1.5 py-0.5 rounded">
                {unseenOrders}
              </span>
            )}
          </Link>
          <Link
            className={navLinkClass(path?.startsWith("/vendor/products"))}
            href="/vendor/products"
            onClick={onClose}
          >
            <Package size={16} /> Products
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/leads")}
            href="/vendor/leads"
            onClick={onClose}
          >
            <UserSearch size={16} /> Leads{" "}
            {unseenLeads > 0 && (
              <span className="ml-auto text-[11px] font-mono bg-surface-high text-on-surface-variant px-1.5 py-0.5 rounded">
                {unseenLeads}
              </span>
            )}
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/customers")}
            href="/vendor/customers"
            onClick={onClose}
          >
            <Users size={16} /> Customers
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/invoices")}
            href="/vendor/invoices"
            onClick={onClose}
          >
            <FileText size={16} /> Invoices
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/expenses")}
            href="/vendor/expenses"
            onClick={onClose}
          >
            <Receipt size={16} /> Expenses
          </Link>
          <Link
            className={navLinkClass(path?.startsWith("/vendor/transactions"))}
            href="/vendor/transactions"
            onClick={onClose}
          >
            <ArrowLeftRight size={16} /> Transactions
          </Link>

          {/* Collapsible Online Store Section */}
          <div className="pt-2">
            <button
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium font-sans rounded-lg transition-all cursor-pointer ${
                onlineStoreExpanded
                  ? "text-on-surface hover:bg-surface-high"
                  : "text-muted hover:text-on-surface hover:bg-surface-high"
              }`}
              onClick={() => setOnlineStoreExpanded(prev => !prev)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Store size={16} className="shrink-0" />
                <span className="truncate text-[13px] font-medium font-sans">Online Store</span>
              </div>

              <a
                href={`/${slug}?from=settings`}
                target="_blank"
                rel="noreferrer"
                onClick={e => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1 text-muted hover:text-on-surface transition-colors shrink-0 ml-auto flex items-center justify-center rounded"
                title="View Online Store"
                aria-label="View Online Store"
              >
                <Eye size={16} />
              </a>
            </button>

            {onlineStoreExpanded && (
              <div className="relative flex flex-col mt-1 pl-8">
                {/* Curved branch line connecting parent to child */}
                <div
                  aria-hidden="true"
                  className="absolute left-[20px] -top-2.5 h-[27px] w-3.5 border-l-2 border-b-2 border-border-hairline rounded-bl-lg pointer-events-none"
                />
                <Link
                  href="/vendor/settings"
                  className={navLinkClass(isPreferencesActive)}
                  onClick={onClose}
                >
                  Preferences
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="mt-auto shrink-0 pt-3 border-t border-border-hairline bg-surface-low z-20 relative">
          <div
            className={`group relative flex items-center justify-between p-2 rounded-xl transition-all ${
              path === "/vendor/profile"
                ? "bg-card text-on-surface shadow-2xs border border-border-hairline"
                : "hover:bg-card/90 hover:shadow-2xs border border-transparent hover:border-border-hairline/80"
            }`}
          >
            <Link
              className="flex items-center gap-2.5 min-w-0 flex-1 text-decoration-none"
              href="/vendor/profile"
              aria-label="Open director profile and studio equity"
              title="Director Profile & Studio Equity"
              onClick={onClose}
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center font-sans text-xs font-bold shadow-2xs">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-tertiary ring-2 ring-white" />
              </div>
              <div className="min-w-0 flex-1">
                <b className="text-xs font-semibold text-on-surface block leading-tight truncate capitalize">
                  {userName}
                </b>
                <span className="text-[10px] text-muted block leading-tight mt-0.5 truncate">
                  {userRole}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-error hover:bg-error-container/40 transition-all shrink-0 cursor-pointer ml-1"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <LogoutConfirmModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  );
}

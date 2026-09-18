import type { ReactNode } from "react";

// Common shared utility types
export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";
export type ButtonRadiusType = "Square" | "Subtle" | "Rounded" | "Pill";

export type StatusVariant =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "completed"
  | "active"
  | "paid"
  | "closed"
  | "lost"
  | "overdue"
  | "draft"
  | "pending"
  | "sent"
  | string;

export interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
  showGlyph?: boolean;
}

export interface FormatMoneyOptions {
  decimals?: number;
}

export interface BrandLogoProps {
  monogram?: string;
  name?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light" | "custom";
  href?: string;
  className?: string;
  monogramClassName?: string;
  textClassName?: string;
}

export interface CardProps {
  number?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export interface ToggleProps {
  on: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

export interface AdminToastContextType {
  showToast: (message: string) => void;
}

export interface ToastProps {
  message: string;
  onClose: () => void;
}

export interface AdminLayoutProps {
  children: ReactNode;
  path?: string;
  onToast?: (s: string) => void;
}

export interface AdminSidebarProps {
  path: string;
  open: boolean;
  onClose: () => void;
}

export interface AdminHeaderProps {
  onMenu: () => void;
  onToast: (s: string) => void;
  path?: string;
}

export interface AnalyticsPageProps {
  onToast?: (message: string) => void;
}

export interface LeadsPageProps {
  onToast?: (s: string) => void;
}

export interface CustomersPageProps {
  onToast?: (message: string) => void;
}

export interface EnhancedSettingsPageProps {
  onToast?: (s: string) => void;
}

export interface ProfileSettingsPageProps {
  onToast?: (message: string) => void;
}

export interface IconProps {
  className?: string;
}

export interface MetricProps {
  label: string;
  value: string;
  detail?: string;
  isLoading?: boolean;
}

export interface ExtendedMetricProps extends MetricProps {
  className?: string;
  variant?: "standard" | "hero-radial";
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  percentage?: number;
  icon?: ReactNode;
}

export interface MetricsGridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

export interface PageTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export interface UseSettingsFormOptions {
  notify: (msg: string) => void;
}

export interface TableEmptyStateProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  colSpan?: number;
  className?: string;
}

export interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export interface SettingsSaveBarProps {
  saving: boolean;
  slug: string;
  slugStatus?: "checking" | "available" | "taken" | "idle";
  onSave: () => void;
  bottomBarRef: import("react").RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
}

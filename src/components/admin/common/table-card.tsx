import type { ReactNode } from "react";

export function TableCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-border-hairline bg-card rounded-2xl overflow-hidden shadow-card flex flex-col min-h-[clamp(540px,65vh,850px)] ${className}`}
    >
      {children}
    </div>
  );
}

export function TableHead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between border-b border-border-hairline p-4 sm:p-[16px_22px] bg-card ${className}`}
    >
      {children}
    </div>
  );
}

export function TableWrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`overflow-x-auto flex-1 min-h-0 ${className}`}>{children}</div>;
}

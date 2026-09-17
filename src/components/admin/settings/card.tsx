import { Info } from "lucide-react";
import type { CardProps } from "@/types";

export function Card({ title, description, action, children }: CardProps) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading flex items-center justify-between gap-3">
        <div className="flex items-center min-w-0">
          <h2>{title}</h2>
          {description && (
            <div className="relative group/info hidden lg:inline-flex items-center ml-1.5 self-center shrink-0">
              <button
                type="button"
                aria-label={description}
                className="text-outline hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-high cursor-pointer"
              >
                <Info size={15} />
              </button>
              {/* Tooltip on hover */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover/info:block z-30 pointer-events-none">
                <div className="bg-inverse-surface text-inverse-on-surface text-[11px] font-normal leading-relaxed rounded-md py-1.5 px-3 whitespace-nowrap shadow-popover border border-outline/20 relative">
                  {description}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-inverse-surface rotate-45 border-b border-l border-outline/20" />
                </div>
              </div>
            </div>
          )}
        </div>
        {action && <div className="shrink-0 whitespace-nowrap">{action}</div>}
      </div>
      {children}
    </section>
  );
}

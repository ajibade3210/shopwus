import type { ExtendedMetricProps } from "@/types";

export function Metric({
  label,
  value,
  detail,
  isLoading = false,
  className = "",
  variant = "standard",
  trend,
  percentage,
  icon,
}: ExtendedMetricProps) {
  const isLong = typeof value === "string" && value.length > 12;

  if (variant === "hero-radial") {
    const validPercent = Math.min(100, Math.max(0, percentage ?? 75));
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (validPercent / 100) * circumference;

    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#012030] to-[#13678a] text-white rounded-xl p-5 sm:p-6 shadow-hero border border-white/10 flex flex-col justify-between min-h-[170px] ${className}`}
      >
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-medium tracking-wide uppercase text-white/80">{label}</span>
          {icon && (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between my-2 z-10">
          <div className="flex flex-col">
            <strong className="text-3xl font-bold tracking-tight font-sans text-white tabular-nums">
              {value}
            </strong>
            {detail && <span className="text-xs text-white/70 mt-1">{detail}</span>}
          </div>

          <div className="relative w-[78px] h-[78px] flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-white/15"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-[#45b69c] transition-all duration-1000 ease-out"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-sans font-bold text-xs text-white tabular-nums">
              {validPercent}%
            </span>
          </div>
        </div>

        {trend && (
          <div className="z-10 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                trend.isPositive !== false
                  ? "bg-[#45b69c]/20 text-[#89f6d9]"
                  : "bg-red-500/20 text-red-200"
              }`}
            >
              {trend.isPositive !== false ? "↗" : "↘"} {trend.value}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-between bg-card border border-border-hairline rounded-xl p-5 sm:p-[20px_22px] shadow-card hover:border-border-subtle hover:shadow-md transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-muted block font-sans">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center text-muted shrink-0">
            {icon}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-1">
          <div className="h-7 w-28 bg-surface-high animate-pulse rounded-md my-0.5" />
          <div className="h-3.5 w-36 bg-surface-high/70 animate-pulse rounded-md mt-2" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-2">
            <strong
              className={`font-bold font-sans tabular-nums text-on-surface tracking-tight leading-tight ${
                isLong
                  ? "!text-lg sm:!text-xl !leading-snug !font-semibold truncate"
                  : "text-2xl sm:text-[26px]"
              }`}
            >
              {value}
            </strong>
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  trend.isPositive !== false
                    ? "bg-[#ebf8f2] text-[#2d8a74]"
                    : "bg-[#feefef] text-[#d9383a]"
                }`}
              >
                {trend.isPositive !== false ? "↗" : "↘"} {trend.value}
              </span>
            )}
          </div>
          {detail && <small className="text-muted text-xs mt-1.5 block font-sans">{detail}</small>}
        </>
      )}
    </div>
  );
}

export function MetricsGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-7 ${className}`}>
      {children}
    </div>
  );
}

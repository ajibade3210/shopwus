import type { AnalyticsChartProps } from "@/types";

const CHART_THEME = {
  primary: "#13678a",
  secondary: "#012030",
  grid: "var(--border-hairline)",
  text: "var(--text-muted)",
};

export function AnalyticsChart({ data, onSeeAll }: AnalyticsChartProps) {
  return (
    <div className="lg:col-span-7 bg-card border border-border-hairline rounded-xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
        <div>
          <h2 className="text-sm sm:text-base font-sans font-bold text-on-surface">
            Sales &amp; Cashflow Telemetry
          </h2>
          <span className="text-[11px] text-muted block mt-0.5 font-sans">
            Volume trends and client transaction flow
          </span>
        </div>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer font-sans"
          >
            See all
          </button>
        )}
      </div>

      {/* SVG Smooth Curve Area Chart */}
      <div className="relative w-full overflow-x-auto pt-4 pb-1">
        <div className="min-w-[480px]">
          <svg viewBox="0 0 840 260" className="w-full h-56 overflow-visible">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_THEME.primary} stopOpacity="0.22" />
                <stop offset="70%" stopColor={CHART_THEME.primary} stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Dotted Grid Lines */}
            {[40, 80, 120, 160, 200, 240].map((y, idx) => (
              <g key={y}>
                <text
                  x="0"
                  y={y + 4}
                  fill={CHART_THEME.text}
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="500"
                >
                  {data.chart.yLabels[idx]}
                </text>
                <line
                  x1="35"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke={CHART_THEME.grid}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Filled Area Gradient */}
            <path d={data.chart.areaPath} fill="url(#curveGradient)" />

            {/* Main Stroke Curve */}
            <path
              d={data.chart.linePath}
              fill="none"
              stroke={CHART_THEME.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Peak Indicator Callout */}
            <g>
              <circle
                cx={data.chart.peakCoord.cx}
                cy={data.chart.peakCoord.cy}
                r="4.5"
                fill={CHART_THEME.primary}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <rect
                x={data.chart.peakCoord.cx - 22}
                y={data.chart.peakCoord.cy - 30}
                width="44"
                height="20"
                rx="6"
                fill={CHART_THEME.secondary}
              />
              <text
                x={data.chart.peakCoord.cx}
                y={data.chart.peakCoord.cy - 16}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {data.chart.peakValue}
              </text>
            </g>
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between pl-9 pr-4 pt-2 text-[10px] font-medium text-muted font-sans">
            {data.chart.xLabels.map(lbl => (
              <span key={lbl}>{lbl}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

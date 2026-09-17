"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCurrentStudio } from "@/hooks/use-current-studio";
import { getAnalytics } from "@/lib/api";
import type { AnalyticsOverview, AnalyticsPageProps, Timeframe } from "@/types";
import { useAdminToast } from "./admin-layout";
import { AnalyticsChart } from "./analytics/analytics-chart";
import { AnalyticsExpensesBreakdown } from "./analytics/analytics-expenses-breakdown";
import { AnalyticsPublicUrlBar } from "./analytics/analytics-public-url-bar";
import { AnalyticsStatCards } from "./analytics/analytics-stat-cards";

export function AnalyticsPage({ onToast }: AnalyticsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const { slug, studioName } = useCurrentStudio();

  useEffect(() => {
    getAnalytics(timeframe)
      .then(res => {
        setData(res);
      })
      .catch(() => {});
  }, [timeframe]);

  const displayStudioName = studioName.trim().toLowerCase().endsWith("studio")
    ? studioName.trim()
    : `${studioName.trim()} Studio`;

  if (!data) {
    return (
      <section className="content max-w-6xl mx-auto py-16 flex justify-center items-center">
        <div className="text-xs text-text-muted font-medium animate-pulse">
          Loading studio telemetry &amp; financial records...
        </div>
      </section>
    );
  }

  return (
    <section className="content max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header & Timeframe Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="shrink-0 pointer-events-none select-none -mr-1 sm:-mr-1.5">
            <Image
              src="/images/welcome-penguin.png"
              alt="Welcome illustration"
              width={160}
              height={160}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-on-surface tracking-[-0.015em]">
            Welcome to {displayStudioName}
          </h1>
        </div>

        {/* Timeframe Filter Switch */}
        <div className="inline-flex items-center p-1 rounded-xl bg-surface-container-low border border-border-hairline">
          {(
            [
              ["daily", "Daily"],
              ["monthly", "Monthly"],
              ["yearly", "Yearly"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeframe(key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-sans ${
                timeframe === key
                  ? "bg-card text-on-surface shadow-2xs font-semibold"
                  : "text-text-muted hover:text-on-surface font-medium"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Public Shop URL Bar */}
      <AnalyticsPublicUrlBar slug={slug} onNotify={notify} />

      {/* 5 Financial & Growth Metric Cards */}
      <AnalyticsStatCards data={data} />

      {/* Main Section: Sales Curve Chart + Spending Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AnalyticsChart
          data={data}
          onSeeAll={() => notify("Detailed telemetry report generated.")}
        />
        <AnalyticsExpensesBreakdown data={data} />
      </div>
    </section>
  );
}

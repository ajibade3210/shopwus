"use client";

import { useEffect, useState } from "react";
import type { BadgeSnapshot } from "@/types";

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function readSnapshot(key: string): BadgeSnapshot | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as BadgeSnapshot;
  } catch {
    return null;
  }
}

export function markRegisterViewed(key: string, currentCount: number): void {
  try {
    const snapshot: BadgeSnapshot = { count: currentCount, viewedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function useUnseenBadge(key: string, currentCount: number | null): number {
  const [badge, setBadge] = useState(0);

  useEffect(() => {
    if (currentCount === null) return;

    const snapshot = readSnapshot(key);
    if (!snapshot) {
      setBadge(0);
      return;
    }

    const isWithin24h = Date.now() - snapshot.viewedAt < TTL_MS;
    setBadge(isWithin24h ? Math.max(0, currentCount - snapshot.count) : 0);
  }, [key, currentCount]);

  return badge;
}

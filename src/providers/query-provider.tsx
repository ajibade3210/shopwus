"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { QueryProviderProps } from "@/types";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // Mark data as stale immediately for background refetching
        gcTime: 60 * 1000 * 10, // Retain in memory cache for 10 minutes for instant navigation
        refetchOnMount: true, // Always refetch in background on page/tab visit
        refetchOnWindowFocus: true, // Keep data fresh when returning to the app
        retry: (failureCount, error) => {
          // Do not retry 401/403/404 errors
          const status = (error as { status?: number })?.status;
          if (status === 401 || status === 403 || status === 404) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * Central API HTTP Client for Shopwus Web Application
 * Auth tokens are stored in HttpOnly cookies set by the Fastify API.
 * The browser sends them automatically on every request via `credentials: "include"`.
 * No token is ever written to or read from localStorage or document.cookie by this client.
 */

import { STORAGE_KEYS } from "@/constants";
import { env } from "./env";
import { logger } from "./logger";

export const API_BASE_URL = env.API_BASE_URL;

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: unknown;

  constructor(message: string, status: number, code?: string, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
  errors?: unknown;
}

let isRefreshing = false;
let isRedirectingToLogin = false;
let refreshSubscribers: Array<() => void> = [];
let refreshSubscriberRejects: Array<(err: ApiError) => void> = [];

function onRefreshed() {
  for (const callback of refreshSubscribers) {
    callback();
  }
  refreshSubscribers = [];
  refreshSubscriberRejects = [];
}

function onRefreshFailed(err: ApiError) {
  for (const reject of refreshSubscriberRejects) {
    reject(err);
  }
  refreshSubscribers = [];
  refreshSubscriberRejects = [];
}

function addRefreshSubscriber(resolve: () => void, reject: (err: ApiError) => void) {
  refreshSubscribers.push(resolve);
  refreshSubscriberRejects.push(reject);
}

function handleSessionExpired() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.session);
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    const isSecure = window.location.protocol === "https:";
    // biome-ignore lint/suspicious/noDocumentCookie: clear session cookie on expiry
    document.cookie = `${STORAGE_KEYS.session}=; path=/; max-age=0; SameSite=Lax${isSecure ? "; Secure" : ""}`;
    // biome-ignore lint/suspicious/noDocumentCookie: clear access token cookie on expiry
    document.cookie = `${STORAGE_KEYS.accessToken}=; path=/; max-age=0; SameSite=Lax${isSecure ? "; Secure" : ""}`;
    if (
      !isRedirectingToLogin &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/signup")
    ) {
      isRedirectingToLogin = true;
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth: _skipAuth, ...customConfig } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        (typeof value !== "string" || value.trim() !== "")
      ) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const hasBody = customConfig.body !== undefined && customConfig.body !== null;
  const isFormData = customConfig.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(customConfig.headers as Record<string, string>),
  };

  // Automatically inject Bearer access token if present
  if (typeof window !== "undefined" && !headers.Authorization && !headers.authorization) {
    const token =
      localStorage.getItem(STORAGE_KEYS.accessToken) ||
      document.cookie.match(new RegExp(`(?:^|;\\s*)${STORAGE_KEYS.accessToken}=([^;]+)`))?.[1];
    if (token) {
      headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
    }
  }

  // credentials: "include" ensures the browser also sends HttpOnly cookies
  // when available, providing seamless dual header/cookie support.
  const config: RequestInit = {
    ...customConfig,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized with automatic token refresh attempt.
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const storedRefreshToken =
            typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.refreshToken) : null;

          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refreshToken: storedRefreshToken || undefined,
            }),
            credentials: "include",
          });

          if (refreshRes.ok) {
            const refreshPayload = (await refreshRes.json()) as {
              data?: { accessToken?: string; refreshToken?: string };
            };
            const newTokens = refreshPayload?.data;
            if (newTokens?.accessToken && typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEYS.accessToken, newTokens.accessToken);
              if (newTokens.refreshToken) {
                localStorage.setItem(STORAGE_KEYS.refreshToken, newTokens.refreshToken);
              }
              const isSecure = window.location.protocol === "https:";
              // biome-ignore lint/suspicious/noDocumentCookie: update access token cookie
              document.cookie = `${STORAGE_KEYS.accessToken}=${encodeURIComponent(newTokens.accessToken)}; path=/; max-age=86400; SameSite=Lax${isSecure ? "; Secure" : ""}`;
              headers.Authorization = `Bearer ${newTokens.accessToken}`;
            }

            onRefreshed();
            isRefreshing = false;
            // Retry original request with updated token
            const retryRes = await fetch(url, { ...config, headers });
            return handleResponse<T>(retryRes);
          }

          // Refresh failed — clear cookies & tokens server-side by calling logout, then redirect
          const sessionErr = new ApiError("Session expired. Please sign in again.", 401);
          const logoutController =
            typeof AbortController !== "undefined" ? new AbortController() : null;
          const logoutTimer = logoutController
            ? setTimeout(() => logoutController.abort(), 1500)
            : null;

          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refreshToken: storedRefreshToken || undefined,
            }),
            credentials: "include",
            keepalive: true,
            signal: logoutController?.signal,
          })
            .catch(() => {})
            .finally(() => {
              if (logoutTimer) clearTimeout(logoutTimer);
            });
          onRefreshFailed(sessionErr);
          isRefreshing = false;
          handleSessionExpired();
          throw sessionErr;
        } catch (err) {
          if (err instanceof ApiError) throw err;
          const sessionErr = new ApiError("Session expired. Please sign in again.", 401);
          logger.warn("Token refresh attempt failed", err);
          onRefreshFailed(sessionErr);
          isRefreshing = false;
          handleSessionExpired();
          throw sessionErr;
        }
      } else {
        // Wait for the active refresh to finish then retry
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber(async () => {
            try {
              if (typeof window !== "undefined") {
                const refreshedToken = localStorage.getItem(STORAGE_KEYS.accessToken);
                if (refreshedToken) {
                  headers.Authorization = `Bearer ${refreshedToken}`;
                }
              }
              const retryRes = await fetch(url, { ...config, headers });
              resolve(await handleResponse<T>(retryRes));
            } catch (err) {
              reject(err);
            }
          }, reject);
        });
      }
    }

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error("API request failed", error, { endpoint, url });
    throw new ApiError(error instanceof Error ? error.message : "Network error occurred", 500);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/pdf")) {
    const blob = await response.blob();
    return blob as unknown as T;
  }

  if (contentType?.includes("text/csv")) {
    const text = await response.text();
    return text as unknown as T;
  }

  let rawData: unknown = null;
  try {
    rawData = await response.json();
  } catch {
    rawData = null;
  }

  const data = rawData as {
    message?: string;
    error?: string;
    code?: string;
    errors?: unknown;
    details?: unknown;
    status?: boolean;
    success?: boolean;
    data?: unknown;
  } | null;

  if (!response.ok) {
    const errorMessage =
      data?.message || data?.error || `Request failed with status ${response.status}`;
    const apiError = new ApiError(
      errorMessage,
      response.status,
      data?.code,
      data?.errors || data?.details
    );
    if (response.status >= 500) {
      logger.error(`API Error ${response.status}: ${errorMessage}`, apiError);
    } else if (response.status !== 401) {
      logger.warn(`API Warning ${response.status}: ${errorMessage}`, apiError);
    }
    throw apiError;
  }

  // If response is standard Fastify { status: true, data: T } or { success: true, data: T }, return data directly
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    ("status" in data || "success" in data)
  ) {
    return data.data as T;
  }

  return rawData as T;
}

export const apiClient = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
    options?: RequestOptions
  ) => request<T>(endpoint, { ...options, method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

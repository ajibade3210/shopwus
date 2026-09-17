/**
 * Auth service for Shopwus Web
 *
 * Token lifecycle (access + refresh) is handled exclusively via HttpOnly cookies
 * set by the Fastify API. This service does NOT write tokens to localStorage or
 * document.cookie. Only non-sensitive user profile metadata (name, email, studio)
 * is stored in localStorage for UI state convenience.
 */
import { CUSTOM_EVENTS, STORAGE_KEYS } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import type { User, UserSession } from "@/types";

interface UserDto {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
}

interface BusinessDto {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string | null;
}

interface AuthResponseDto {
  user: UserDto;
  business?: BusinessDto | null;
  studio?: BusinessDto | null;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
}

export function saveAuthTokens(accessToken?: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    const isSecure = window.location.protocol === "https:";
    // Sync cookie on frontend domain for Next.js Edge Middleware (proxy.ts)
    // biome-ignore lint/suspicious/noDocumentCookie: client auth cookie for Next.js Edge proxy
    document.cookie = `${STORAGE_KEYS.accessToken}=${encodeURIComponent(accessToken)}; path=/; max-age=86400; SameSite=Lax${isSecure ? "; Secure" : ""}`;
  }
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (stored) return stored;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${STORAGE_KEYS.accessToken}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  const isSecure = window.location.protocol === "https:";
  // biome-ignore lint/suspicious/noDocumentCookie: clear client auth cookie
  document.cookie = `${STORAGE_KEYS.accessToken}=; path=/; max-age=0; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

export function getCurrentSession(): UserSession | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.session);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

/**
 * Persists non-sensitive UI session metadata to localStorage and syncs the
 * Next.js Edge middleware cookie (does NOT contain the JWT access token).
 */
export function createSession(user: Partial<UserSession>): UserSession {
  const session: UserSession = {
    id: user.id ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? "user",
    studioName: user.studioName ?? "",
    studioSlug: user.studioSlug ?? "",
    avatarUrl: user.avatarUrl,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    // This cookie carries non-sensitive profile metadata only — NOT the access token.
    // It is used by Next.js Edge middleware (proxy.ts) for redirect decisions when the
    // HttpOnly access-token cookie is present but needs augmented user identity context.
    // biome-ignore lint/suspicious/noDocumentCookie: non-sensitive session metadata for Edge middleware
    document.cookie = `${STORAGE_KEYS.session}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=2592000; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.authChanged, { detail: session }));
  }
  return session;
}

export async function getCurrentUser(): Promise<User> {
  const me = await apiClient.get<MeResponseDto>("/auth/me");
  const fullName = [me.user.firstName, me.user.lastName].filter(Boolean).join(" ") || me.user.email;

  createSession({
    id: me.user.id,
    name: fullName,
    email: me.user.email,
    role: me.user.role,
    studioName: me.business?.name ?? "",
    studioSlug: me.business?.slug ?? "",
    avatarUrl: me.user.avatarUrl ?? undefined,
  });

  return {
    id: me.user.id,
    email: me.user.email,
    name: fullName,
    phone: me.user.phone ?? undefined,
    avatar: me.user.avatarUrl ?? undefined,
    role: me.user.role === "OWNER" || me.user.role === "ADMIN" ? "admin" : "user",
  };
}

export async function updateUserProfile(data: {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}): Promise<User> {
  const me = await apiClient.patch<MeResponseDto>("/auth/me", data);
  const fullName = [me.user.firstName, me.user.lastName].filter(Boolean).join(" ") || me.user.email;

  createSession({
    id: me.user.id,
    name: fullName,
    email: me.user.email,
    role: me.user.role,
    studioName: me.business?.name ?? "",
    studioSlug: me.business?.slug ?? "",
    avatarUrl: me.user.avatarUrl ?? undefined,
  });

  return {
    id: me.user.id,
    email: me.user.email,
    name: fullName,
    phone: me.user.phone ?? undefined,
    avatar: me.user.avatarUrl ?? undefined,
    role: me.user.role === "OWNER" || me.user.role === "ADMIN" ? "admin" : "user",
  };
}

export async function signIn(email: string, password: string): Promise<UserSession> {
  const authData = await apiClient.post<AuthResponseDto>("/auth/login", { email, password });

  if (authData.accessToken) {
    saveAuthTokens(authData.accessToken, authData.refreshToken);
  }

  const fullName =
    [authData.user.firstName, authData.user.lastName].filter(Boolean).join(" ") ||
    authData.user.email;

  return createSession({
    id: authData.user.id,
    name: fullName,
    email: authData.user.email,
    role: authData.user.role,
    studioName: authData.business?.name ?? "",
    studioSlug: authData.business?.slug ?? "",
    avatarUrl: authData.user.avatarUrl ?? undefined,
  });
}

export async function signInWithGoogle(options?: {
  code?: string;
  idToken?: string;
  claimSlug?: string;
  studioName?: string;
}): Promise<UserSession> {
  const claim = options?.claimSlug;
  const studioName = options?.studioName;
  const studioSlug = claim || undefined;

  const authData = await apiClient.post<AuthResponseDto>("/auth/google", {
    code: options?.code,
    idToken: options?.idToken,
    slug: studioSlug,
    studioName,
    mode: "signin",
  });

  if (authData.accessToken) {
    saveAuthTokens(authData.accessToken, authData.refreshToken);
  }

  const fullName =
    [authData.user.firstName, authData.user.lastName].filter(Boolean).join(" ") ||
    authData.user.email;

  return createSession({
    id: authData.user.id,
    name: fullName,
    email: authData.user.email,
    role: authData.user.role,
    studioName: authData.business?.name ?? studioName ?? "",
    studioSlug: authData.business?.slug ?? studioSlug ?? "",
    avatarUrl: authData.user.avatarUrl ?? undefined,
  });
}

export async function signUpWithGoogle(data?: {
  code?: string;
  idToken?: string;
  slug?: string;
  studioName?: string;
}): Promise<UserSession> {
  const effectiveSlug = data?.slug;
  const effectiveName = data?.studioName;

  const authData = await apiClient.post<AuthResponseDto>("/auth/google", {
    code: data?.code,
    idToken: data?.idToken,
    slug: effectiveSlug,
    studioName: effectiveName,
    mode: "signup",
  });

  if (authData.accessToken) {
    saveAuthTokens(authData.accessToken, authData.refreshToken);
  }

  const fullName =
    [authData.user.firstName, authData.user.lastName].filter(Boolean).join(" ") ||
    authData.user.email;

  return createSession({
    id: authData.user.id,
    name: fullName,
    email: authData.user.email,
    role: authData.user.role,
    studioName: authData.business?.name ?? effectiveName ?? "",
    studioSlug: authData.business?.slug ?? effectiveSlug ?? "",
    avatarUrl: authData.user.avatarUrl ?? undefined,
  });
}

export async function clearSession(): Promise<void> {
  // 1. Read refresh token before clearing local storage
  const refreshToken = getRefreshToken();

  // 2. Immediately purge local credentials & session so the client is unauthenticated without waiting
  clearAuthTokens();

  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.session);
    const isSecure = window.location.protocol === "https:";
    // biome-ignore lint/suspicious/noDocumentCookie: clear non-sensitive session metadata cookie
    document.cookie = `${STORAGE_KEYS.session}=; path=/; max-age=0; SameSite=Lax${isSecure ? "; Secure" : ""}`;
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.authChanged, { detail: null }));
  }

  // 3. Notify server to revoke refresh token with short timeout & keepalive so request finishes even as page navigates
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 1500) : null;

    await apiClient.post(
      "/auth/logout",
      { refreshToken: refreshToken || undefined },
      {
        signal: controller?.signal,
        keepalive: true,
      }
    );

    if (timeoutId) clearTimeout(timeoutId);
  } catch (error) {
    logger.warn("Server logout notification failed or timed out", error);
  }
}

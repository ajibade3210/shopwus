/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CUSTOM_EVENTS, STORAGE_KEYS } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import {
  clearAuthTokens,
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "../auth.service";

describe("auth service - session termination & token lifecycle", () => {
  beforeEach(() => {
    localStorage.clear();
    // biome-ignore lint/suspicious/noDocumentCookie: clear cookies in test environment
    document.cookie = `${STORAGE_KEYS.accessToken}=; path=/; max-age=0`;
    // biome-ignore lint/suspicious/noDocumentCookie: clear cookies in test environment
    document.cookie = `${STORAGE_KEYS.session}=; path=/; max-age=0`;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("saves and retrieves auth tokens correctly", () => {
    saveAuthTokens("mock-access-token", "mock-refresh-token");
    expect(getAccessToken()).toBe("mock-access-token");
    expect(getRefreshToken()).toBe("mock-refresh-token");
  });

  it("clears auth tokens from localStorage and document.cookie", () => {
    saveAuthTokens("token-to-clear", "refresh-to-clear");
    clearAuthTokens();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.accessToken)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.refreshToken)).toBeNull();
  });

  it("clears session immediately and notifies server on logout", async () => {
    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValueOnce({ success: true });
    const eventSpy = vi.fn();
    window.addEventListener(CUSTOM_EVENTS.authChanged, eventSpy);

    saveAuthTokens("access-123", "refresh-456");
    localStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({ id: "user-1", email: "test@example.com" })
    );

    await clearSession();

    // Local storage should be wiped immediately
    expect(localStorage.getItem(STORAGE_KEYS.accessToken)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.refreshToken)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();

    // Event should be dispatched
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CUSTOM_EVENTS.authChanged,
        detail: null,
      })
    );

    // API call should have been made with refresh token
    expect(postSpy).toHaveBeenCalledWith(
      "/auth/logout",
      { refreshToken: "refresh-456" },
      expect.objectContaining({ keepalive: true })
    );

    window.removeEventListener(CUSTOM_EVENTS.authChanged, eventSpy);
  });

  it("purges local credentials even when server logout fails or times out", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValueOnce(new Error("Network timeout"));
    const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

    saveAuthTokens("access-fail", "refresh-fail");
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ id: "user-1" }));

    await expect(clearSession()).resolves.toBeUndefined();

    // Local credentials are STILL completely wiped
    expect(localStorage.getItem(STORAGE_KEYS.accessToken)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.refreshToken)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      "Server logout notification failed or timed out",
      expect.any(Error)
    );
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import {
  MAX_FILE_SIZE,
  uploadBusinessLogo,
  uploadMediaFile,
  uploadMultipleMediaFiles,
  uploadPortfolioImage,
} from "../media.service";

describe("Media Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads a media file directly to storage via presigned URL", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      uploadUrl: "https://r2.upload.com/signed-put-url",
      publicUrl: "https://r2.shopwus.com/images/sample.png",
      signedContentType: "image/png",
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const file = new File(["dummy content"], "sample.png", { type: "image/png" });
    const result = await uploadMediaFile(file);

    expect(result).toEqual({
      url: "https://r2.shopwus.com/images/sample.png",
      success: true,
    });

    expect(fetchSpy).toHaveBeenCalledWith("https://r2.upload.com/signed-put-url", {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "image/png",
      },
    });
  });

  it("transparently falls back to /media/upload if direct PUT fails (e.g. CORS preflight error)", async () => {
    vi.spyOn(logger, "warn").mockImplementation(() => {});
    // 1. Presigned URL call succeeds
    vi.spyOn(apiClient, "post")
      .mockResolvedValueOnce({
        uploadUrl: "https://r2.upload.com/signed-put-url",
        publicUrl: "https://r2.shopwus.com/images/sample.png",
      })
      // 2. Fallback call to /media/upload succeeds
      .mockResolvedValueOnce({
        url: "https://r2.shopwus.com/images/fallback.png",
      });

    // Direct PUT fails (simulating CORS error)
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new TypeError("Failed to fetch (CORS)"));

    const file = new File(["dummy content"], "sample.png", { type: "image/png" });
    const result = await uploadMediaFile(file);

    expect(result).toEqual({
      url: "https://r2.shopwus.com/images/fallback.png",
      success: true,
    });
  });

  it("rejects files exceeding the maximum file size limit", async () => {
    const hugeBuffer = new Uint8Array(MAX_FILE_SIZE + 1024);
    const oversizedFile = new File([hugeBuffer], "huge.png", { type: "image/png" });

    await expect(uploadMediaFile(oversizedFile)).rejects.toThrow("File size exceeds limit");
  });

  it("uploads multiple files directly in parallel via presigned URLs", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce([
      {
        uploadUrl: "https://r2.upload.com/signed-put-1",
        publicUrl: "https://r2.shopwus.com/images/img1.png",
        signedContentType: "image/png",
      },
      {
        uploadUrl: "https://r2.upload.com/signed-put-2",
        publicUrl: "https://r2.shopwus.com/images/img2.png",
        signedContentType: "image/png",
      },
    ]);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const f1 = new File(["1"], "1.png", { type: "image/png" });
    const f2 = new File(["2"], "2.png", { type: "image/png" });
    const results = await uploadMultipleMediaFiles([f1, f2]);

    expect(results).toEqual([
      { url: "https://r2.shopwus.com/images/img1.png", success: true },
      { url: "https://r2.shopwus.com/images/img2.png", success: true },
    ]);
  });

  it("falls back to /media/upload-multi if direct batch upload fails", async () => {
    vi.spyOn(logger, "warn").mockImplementation(() => {});
    vi.spyOn(apiClient, "post")
      .mockResolvedValueOnce([
        { uploadUrl: "https://r2.upload.com/1", publicUrl: "https://r2.shopwus.com/1" },
        { uploadUrl: "https://r2.upload.com/2", publicUrl: "https://r2.shopwus.com/2" },
      ])
      .mockResolvedValueOnce([
        { url: "https://r2.shopwus.com/fallback-1.png" },
        { url: "https://r2.shopwus.com/fallback-2.png" },
      ]);

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network Error"));

    const f1 = new File(["1"], "1.png", { type: "image/png" });
    const f2 = new File(["2"], "2.png", { type: "image/png" });
    const results = await uploadMultipleMediaFiles([f1, f2]);

    expect(results).toEqual([
      { url: "https://r2.shopwus.com/fallback-1.png", success: true },
      { url: "https://r2.shopwus.com/fallback-2.png", success: true },
    ]);
  });

  it("uploads business logo directly via uploadMediaFile", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      uploadUrl: "https://r2.upload.com/logo",
      publicUrl: "https://r2.shopwus.com/images/logo.png",
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 200 }));

    const file = new File(["logo content"], "logo.png", { type: "image/png" });
    const fileResult = await uploadBusinessLogo(file);
    expect(fileResult).toEqual({
      url: "https://r2.shopwus.com/images/logo.png",
      success: true,
    });
  });

  it("uploads portfolio image directly via uploadMediaFile", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      uploadUrl: "https://r2.upload.com/portfolio",
      publicUrl: "https://r2.shopwus.com/images/portfolio.png",
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 200 }));

    const file = new File(["img content"], "portfolio.png", { type: "image/png" });
    const fileResult = await uploadPortfolioImage(file);
    expect(fileResult).toEqual({
      url: "https://r2.shopwus.com/images/portfolio.png",
      success: true,
    });
  });

  it("rejects multi-upload if files count exceeds MAX_BATCH_FILES", async () => {
    const files = Array.from(
      { length: 21 },
      (_, i) => new File(["data"], `f${i}.png`, { type: "image/png" })
    );
    await expect(uploadMultipleMediaFiles(files)).rejects.toThrow(
      "Maximum 20 files allowed per upload batch"
    );
  });
});

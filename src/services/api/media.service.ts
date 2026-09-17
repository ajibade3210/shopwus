import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  signedContentType?: string;
}

/**
 * Fallback to standard multipart API upload if direct cloud storage upload fails
 */
async function uploadMediaFileFallback(file: File): Promise<{ url: string; success: boolean }> {
  logger.info(`Uploading via server route: "${file.name}"`);
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient.post<{ url: string }>("/media/upload", formData);

  if (!result?.url) {
    throw new Error("Failed to upload media file: No URL returned from server");
  }

  logger.info(`Server upload completed: "${file.name}"`);
  return {
    url: result.url,
    success: true,
  };
}

/**
 * Fallback to standard multipart API batch upload if direct cloud storage upload fails
 */
async function uploadMultipleMediaFilesFallback(
  files: File[]
): Promise<Array<{ url: string; success: boolean }>> {
  logger.info(`Batch uploading ${files.length} files via server route`);
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const results = await apiClient.post<Array<{ url: string }>>("/media/upload-multi", formData);
  logger.info(`Server batch upload completed: ${results.length} files`);

  return results.map(r => ({
    url: r.url,
    success: true,
  }));
}

/**
 * Uploads a single media file directly to Cloudflare R2 via presigned URL,
 * with automatic fallback to server multipart upload on network or CORS errors.
 */
export async function uploadMediaFile(file: File): Promise<{ url: string; success: boolean }> {
  const maxSize = file.type.startsWith("video/") ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
  if (file.size > maxSize) {
    throw new Error(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
  }

  logger.info(`Uploading media file: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);

  try {
    const result = await apiClient.post<PresignedUrlResponse>("/media/presigned-url", {
      filename: file.name,
      mimetype: file.type || "application/octet-stream",
      size: file.size,
    });

    if (!result?.uploadUrl || !result?.publicUrl) {
      throw new Error("Invalid presigned upload URL response from server");
    }

    const uploadResponse = await fetch(result.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": result.signedContentType || file.type || "application/octet-stream",
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Direct storage upload returned status ${uploadResponse.status}`);
    }

    logger.info(`Direct upload completed: "${file.name}"`);
    return {
      url: result.publicUrl,
      success: true,
    };
  } catch (directError) {
    logger.warn(
      `Direct storage upload failed for "${file.name}", using server fallback`,
      directError
    );
    return uploadMediaFileFallback(file);
  }
}

export const MAX_BATCH_FILES = 20;

/**
 * Uploads multiple media files in parallel directly to Cloudflare R2 via presigned URLs,
 * with automatic fallback to server multipart upload on network or CORS errors.
 */
export async function uploadMultipleMediaFiles(
  files: File[]
): Promise<Array<{ url: string; success: boolean }>> {
  if (!files || files.length === 0) return [];

  if (files.length > MAX_BATCH_FILES) {
    throw new Error(`Maximum ${MAX_BATCH_FILES} files allowed per upload batch`);
  }

  for (const file of files) {
    const maxSize = file.type.startsWith("video/") ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
    if (file.size > maxSize) {
      throw new Error(`File "${file.name}" exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }
  }

  logger.info(`Starting batch upload of ${files.length} files`);

  try {
    const items = await apiClient.post<PresignedUrlResponse[]>("/media/presigned-urls", {
      files: files.map(f => ({
        filename: f.name,
        mimetype: f.type || "application/octet-stream",
        size: f.size,
      })),
    });

    if (!items || !Array.isArray(items) || items.length !== files.length) {
      throw new Error("Invalid presigned URLs response from server");
    }

    // Upload all files directly to Cloudflare R2 concurrently in parallel
    await Promise.all(
      files.map(async (file, index) => {
        const item = items[index];
        const res = await fetch(item.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": item.signedContentType || file.type || "application/octet-stream",
          },
        });

        if (!res.ok) {
          throw new Error(`Direct upload failed for "${file.name}" with status ${res.status}`);
        }

        logger.info(`[${index + 1}/${files.length}] Uploaded "${file.name}"`);
      })
    );

    logger.info(`Direct batch upload completed: ${files.length} files`);
    return items.map(item => ({
      url: item.publicUrl,
      success: true,
    }));
  } catch (directError) {
    logger.warn("Direct batch upload failed, using server fallback", directError);
    return uploadMultipleMediaFilesFallback(files);
  }
}

export async function uploadBusinessLogo(file: File): Promise<{ url: string; success: boolean }> {
  return uploadMediaFile(file);
}

export async function uploadPortfolioImage(file: File): Promise<{ url: string; success: boolean }> {
  return uploadMediaFile(file);
}

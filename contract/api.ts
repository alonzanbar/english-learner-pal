/**
 * API contract: shared types and endpoint spec for the word-list backend.
 * Single source of truth for client (apps/web) and server (apps/backend).
 * Do not duplicate these types elsewhere.
 */

// -----------------------------------------------------------------------------
// Shared types
// -----------------------------------------------------------------------------

/** A single word with optional translation and sublist. */
export interface Word {
  english: string;
  hebrew: string;
  sublist: number;
}

/** Metadata for an uploaded word-list file (no GCS path exposed to client). */
export interface FileMeta {
  id: string;
  name: string;
  createdAt?: string; // ISO 8601
}

/** Response for GET /api/files */
export type ListFilesResponse = FileMeta[];

/** Response for GET /api/files/:id/words */
export type GetWordsResponse = Word[];

/** Success response for POST /api/files */
export interface UploadFileResponse {
  id: string;
  name: string;
  createdAt?: string;
}

/** Error response (e.g. 400, 404, 500) */
export interface ApiError {
  error: string;
  message?: string;
}

// -----------------------------------------------------------------------------
// Endpoint spec (method, path, request, response)
// -----------------------------------------------------------------------------

/**
 * GET /api/files
 * Response: ListFilesResponse (FileMeta[])
 */
export const ENDPOINT_LIST_FILES = { method: 'GET' as const, path: '/api/files' };

/**
 * GET /api/files/:id/words
 * Params: id (path)
 * Response: GetWordsResponse (Word[])
 */
export const ENDPOINT_GET_WORDS = { method: 'GET' as const, path: '/api/files/:id/words' };

/**
 * POST /api/files
 * Request: multipart/form-data { file: File (CSV), name: string }
 * Response: UploadFileResponse on 201, ApiError on 4xx/5xx
 */
export const ENDPOINT_UPLOAD_FILE = { method: 'POST' as const, path: '/api/files' };

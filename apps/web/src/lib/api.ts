/**
 * API client for word-list backend. Types from contract.
 */
import type {
  FileMeta,
  GetWordsResponse,
  ListFilesResponse,
  UploadFileResponse,
  Word,
} from "../../../../contract/api";

const getBase = () => (import.meta.env.VITE_API_URL as string) || "";

export async function listFiles(): Promise<FileMeta[]> {
  const base = getBase();
  const url = base ? `${base}/api/files` : "/api/files";
  const res = await fetch(url);
  if (!res.ok) {
    const hint = res.status === 404
      ? " Backend not reachable? If using staging, set VITE_API_URL to your backend URL (e.g. https://xxx.run.app). If running locally, start the backend first: cd apps/backend && PORT=3001 npm run dev"
      : "";
    throw new Error(`listFiles: ${res.status}${hint}`);
  }
  const data: ListFilesResponse = await res.json();
  return data;
}

export type { FileMeta };

export async function getWords(fileId: string): Promise<Word[]> {
  const base = getBase();
  const url = base
    ? `${base}/api/files/${encodeURIComponent(fileId)}/words`
    : `/api/files/${encodeURIComponent(fileId)}/words`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`getWords: ${res.status}`);
  const data: GetWordsResponse = await res.json();
  return data;
}

/** POST /api/files – multipart form-data { file, name }. Accepts CSV, Excel (.xlsx, .xls). */
export async function uploadFile(file: File, name: string): Promise<UploadFileResponse> {
  const base = getBase();
  const url = base ? `${base}/api/files` : "/api/files";
  const form = new FormData();
  form.append("file", file);
  form.append("name", name.trim() || file.name || "Uploaded");
  const res = await fetch(url, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Upload failed: ${res.status}`);
  }
  const data: UploadFileResponse = await res.json();
  return data;
}

/**
 * API client for word-list backend. Types from contract.
 */
import type { FileMeta, GetWordsResponse, ListFilesResponse, Word } from "../../../../contract/api";

const getBase = () => (import.meta.env.VITE_API_URL as string) || "";

export async function listFiles(): Promise<FileMeta[]> {
  const res = await fetch(`${getBase()}/api/files`);
  if (!res.ok) throw new Error(`listFiles: ${res.status}`);
  const data: ListFilesResponse = await res.json();
  return data;
}

export async function getWords(fileId: string): Promise<Word[]> {
  const res = await fetch(`${getBase()}/api/files/${encodeURIComponent(fileId)}/words`);
  if (!res.ok) throw new Error(`getWords: ${res.status}`);
  const data: GetWordsResponse = await res.json();
  return data;
}

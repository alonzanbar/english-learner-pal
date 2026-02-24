const STORAGE_KEY = "selected-word-list-id";

export function getSelectedWordListId(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const id = raw?.trim();
    return id ? id : null;
  } catch {
    return null;
  }
}

export function setSelectedWordListId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Ignore storage failures (e.g. privacy mode)
  }
}

export function clearSelectedWordListId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures (e.g. privacy mode)
  }
}


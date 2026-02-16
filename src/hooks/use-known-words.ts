import { useState, useCallback } from "react";

const STORAGE_KEY = "known-words";

function loadKnownWords(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveKnownWords(words: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...words]));
}

export function useKnownWords() {
  const [knownWords, setKnownWords] = useState<Set<string>>(loadKnownWords);

  const toggleKnown = useCallback((english: string) => {
    setKnownWords((prev) => {
      const next = new Set(prev);
      if (next.has(english)) {
        next.delete(english);
      } else {
        next.add(english);
      }
      saveKnownWords(next);
      return next;
    });
  }, []);

  const resetKnown = useCallback(() => {
    const empty = new Set<string>();
    saveKnownWords(empty);
    setKnownWords(empty);
  }, []);

  const isKnown = useCallback((english: string) => knownWords.has(english), [knownWords]);

  return { knownWords, toggleKnown, resetKnown, isKnown, knownCount: knownWords.size };
}

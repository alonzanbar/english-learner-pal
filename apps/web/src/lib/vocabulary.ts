import { listFiles, getWords } from "@/lib/api";

export interface Word {
  english: string;
  hebrew: string;
  sublist: number;
}

let _words: Word[] | null = null;
let _loadPromise: Promise<Word[]> | null = null;

/** Fetch /api/files, take first file, load its words, cache and return. */
export function ensureWordsLoaded(): Promise<Word[]> {
  if (_words) return Promise.resolve(_words);
  if (_loadPromise) return _loadPromise;
  _loadPromise = (async () => {
    const files = await listFiles();
    const first = files[0];
    if (!first) return [];
    const words = await getWords(first.id);
    _words = words;
    return words;
  })();
  return _loadPromise;
}

export function getAllWords(): Word[] {
  return _words ?? [];
}

export function getWordsBySublist(sublist: number): Word[] {
  return getAllWords().filter(w => w.sublist === sublist);
}

export function getSublists(): number[] {
  const all = getAllWords();
  return [...new Set(all.map(w => w.sublist))].sort((a, b) => a - b);
}

export function getRandomOptions(correctWord: Word, count: number = 4): Word[] {
  const all = getAllWords().filter(w => w.english !== correctWord.english);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, count - 1);
  const insertIndex = Math.floor(Math.random() * count);
  options.splice(insertIndex, 0, correctWord);
  return options;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

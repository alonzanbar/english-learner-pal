/**
 * Parse CSV buffer/string to Word[] (contract shape).
 * Supports: optional header; columns word/english and translation/hebrew; single column = english only.
 * BOM stripped. sublist = Math.floor(index / WORDS_PER_SUBLIST) + 1.
 */
const WORDS_PER_SUBLIST = 60;

function parseCSVToWords(raw) {
  const text = (typeof raw === 'string' ? raw : raw.toString('utf-8')).replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const first = lines[0].toLowerCase();
  const hasHeader = first.includes('english') || first.includes('word') || first.includes('translation') || first.includes('hebrew');
  const startIndex = hasHeader ? 1 : 0;
  const words = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const parts = splitCSVLine(line);
    const english = (parts[0] || '').trim();
    if (!english) continue;
    const hebrew = (parts[1] || '').trim();
    words.push({
      english,
      hebrew: hebrew || '',
      sublist: Math.floor((i - startIndex) / WORDS_PER_SUBLIST) + 1,
    });
  }
  return words;
}

/** Split one CSV line by comma (no quoted field handling for simplicity). */
function splitCSVLine(line) {
  const idx = line.indexOf(',');
  if (idx < 0) return [line];
  return [line.slice(0, idx), line.slice(idx + 1)];
}

/** Validate that CSV has at least one data row (and optionally a header). Returns true if valid. */
function validateCSVHasRows(raw) {
  const text = (typeof raw === 'string' ? raw : raw.toString('utf-8')).replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return false;
  const first = lines[0].toLowerCase();
  const isHeader = first.includes('english') || first.includes('word') || first.includes('translation') || first.includes('hebrew');
  const dataRows = isHeader ? lines.length - 1 : lines.length;
  return dataRows >= 1;
}

module.exports = { parseCSVToWords, validateCSVHasRows, WORDS_PER_SUBLIST };

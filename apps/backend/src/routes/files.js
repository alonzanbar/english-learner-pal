const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const DEFAULT_FILE_ID = 'default';
const DEFAULT_FILE_NAME = 'Default (AWL)';
const WORDS_PER_SUBLIST = 60;

/** Resolve path to vocabulary.csv (in data/ next to app or from env). */
function getDefaultVocabPath() {
  if (process.env.DEFAULT_VOCAB_PATH) {
    return process.env.DEFAULT_VOCAB_PATH;
  }
  return path.join(__dirname, '..', 'data', 'vocabulary.csv');
}

let cachedWords = null;

/**
 * Parse CSV with header "English,Hebrew". Returns array of { english, hebrew, sublist }.
 * Contract shape: Word[]
 */
function parseVocabularyCSV(csvPath) {
  if (cachedWords) return cachedWords;
  const raw = fs.readFileSync(csvPath, 'utf-8').replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    cachedWords = [];
    return cachedWords;
  }
  const header = lines[0].toLowerCase();
  const skipHeader = header.includes('english') || header.includes('word');
  const startIndex = skipHeader ? 1 : 0;
  const words = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const idx = line.indexOf(',');
    const english = (idx >= 0 ? line.slice(0, idx) : line).trim();
    const hebrew = (idx >= 0 ? line.slice(idx + 1) : '').trim();
    if (!english) continue;
    words.push({
      english,
      hebrew: hebrew || '',
      sublist: Math.floor((i - startIndex) / WORDS_PER_SUBLIST) + 1,
    });
  }
  cachedWords = words;
  return words;
}

/** GET /api/files - ListFilesResponse: one default file. */
router.get('/', (req, res) => {
  res.json([
    {
      id: DEFAULT_FILE_ID,
      name: DEFAULT_FILE_NAME,
      createdAt: new Date().toISOString(),
    },
  ]);
});

/** GET /api/files/:id/words - GetWordsResponse: parsed vocabulary.csv for any id. */
router.get('/:id/words', (req, res) => {
  const csvPath = getDefaultVocabPath();
  if (!fs.existsSync(csvPath)) {
    return res.status(500).json({ error: 'InternalServerError', message: 'Default vocabulary file not found' });
  }
  try {
    const words = parseVocabularyCSV(csvPath);
    res.json(words);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
});

/** POST /api/files - accept multipart; return 201 UploadFileResponse, no persistence. */
router.post('/', upload.single('file'), (req, res) => {
  const name = (req.body && req.body.name) ? String(req.body.name).trim() : 'Uploaded';
  res.status(201).json({
    id: DEFAULT_FILE_ID,
    name: name || 'Uploaded',
    createdAt: new Date().toISOString(),
  });
});

module.exports = router;

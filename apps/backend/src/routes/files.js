const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const { parseCSVToWords, validateCSVHasRows } = require('../lib/csv.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const DEFAULT_FILE_ID = 'default';
const DEFAULT_FILE_NAME = 'Default (AWL)';
const FIRESTORE_COLLECTION = 'wordlist_files';
const GCS_PREFIX = 'wordlists';

/** Resolve path to vocabulary.csv (in data/ at app root, or from env). */
function getDefaultVocabPath() {
  if (process.env.DEFAULT_VOCAB_PATH) {
    return process.env.DEFAULT_VOCAB_PATH;
  }
  return path.join(__dirname, '..', '..', 'data', 'vocabulary.csv');
}

/** Lazy GCS bucket client; null if GCS_BUCKET not set. */
let _storage = null;
let _bucketName = null;
function getBucket() {
  const name = process.env.GCS_BUCKET;
  if (!name) return { bucket: null, bucketName: null };
  if (!_storage) _storage = new Storage();
  _bucketName = name;
  return { bucket: _storage.bucket(name), bucketName: name };
}

/** Lazy Firestore client. Uses FIRESTORE_DATABASE_ID when set (Terraform); else default. */
let _firestore = null;
function getFirestore() {
  if (!_firestore) {
    const databaseId = process.env.FIRESTORE_DATABASE_ID || '(default)';
    _firestore = new Firestore({ databaseId });
  }
  return _firestore;
}

/** GET /api/files - ListFilesResponse: default file + all from Firestore when GCS_BUCKET set. */
router.get('/', async (req, res) => {
  const { bucket } = getBucket();
  const list = [
    { id: DEFAULT_FILE_ID, name: DEFAULT_FILE_NAME, createdAt: new Date().toISOString() },
  ];
  if (bucket) {
    try {
      const db = getFirestore();
      const snap = await db.collection(FIRESTORE_COLLECTION).orderBy('createdAt', 'desc').get();
      snap.docs.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: doc.id,
          name: d.name || 'Unnamed',
          createdAt: d.createdAt,
        });
      });
    } catch (err) {
      console.error('Firestore list error:', err.message);
      // still return default
    }
  }
  res.json(list);
});

/** GET /api/files/:id/words - GetWordsResponse: from default file or GCS. */
router.get('/:id/words', async (req, res) => {
  const id = req.params.id;
  if (id === DEFAULT_FILE_ID) {
    const csvPath = getDefaultVocabPath();
    if (!fs.existsSync(csvPath)) {
      return res.status(500).json({ error: 'InternalServerError', message: 'Default vocabulary file not found' });
    }
    try {
      const raw = fs.readFileSync(csvPath, 'utf-8');
      const words = parseCSVToWords(raw);
      return res.json(words);
    } catch (err) {
      return res.status(500).json({ error: 'InternalServerError', message: err.message });
    }
  }

  const { bucket } = getBucket();
  if (!bucket) {
    return res.status(404).json({ error: 'NotFound', message: 'File not found' });
  }
  try {
    const db = getFirestore();
    const doc = await db.collection(FIRESTORE_COLLECTION).doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'NotFound', message: 'File not found' });
    }
    const gcsPath = doc.data().gcsPath;
    if (!gcsPath) {
      return res.status(500).json({ error: 'InternalServerError', message: 'Missing gcsPath' });
    }
    const [contents] = await bucket.file(gcsPath).download();
    const words = parseCSVToWords(contents);
    return res.json(words);
  } catch (err) {
    console.error('Get words error:', err.message);
    return res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
});

/** POST /api/files - multipart file + name; validate CSV, upload to GCS, write Firestore. */
router.post('/', upload.single('file'), async (req, res) => {
  const name = (req.body && req.body.name) ? String(req.body.name).trim() : 'Uploaded';
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'BadRequest', message: 'Missing file' });
  }
  if (!validateCSVHasRows(req.file.buffer)) {
    return res.status(400).json({ error: 'BadRequest', message: 'CSV must have at least one data row' });
  }

  const { bucket } = getBucket();
  if (!bucket) {
    return res.status(201).json({
      id: DEFAULT_FILE_ID,
      name: name || 'Uploaded',
      createdAt: new Date().toISOString(),
    });
  }

  const id = require('crypto').randomUUID();
  const gcsPath = `${GCS_PREFIX}/${id}.csv`;
  const createdAt = new Date().toISOString();

  try {
    const file = bucket.file(gcsPath);
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype || 'text/csv',
      metadata: { contentType: req.file.mimetype || 'text/csv' },
    });
    const db = getFirestore();
    await db.collection(FIRESTORE_COLLECTION).doc(id).set({
      id,
      name: name || 'Uploaded',
      gcsPath,
      createdAt,
    });
    return res.status(201).json({ id, name: name || 'Uploaded', createdAt });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
});

module.exports = router;

# Word-list API

Implements the [contract](../../contract/api.ts): default file (vocabulary.csv) plus **uploaded files** stored in GCS with metadata in Firestore when `GCS_BUCKET` is set.

- **GET /api/files** – list default file + all uploaded files (from Firestore when `GCS_BUCKET` set)
- **GET /api/files/:id/words** – words from default file or from GCS (by id)
- **POST /api/files** – multipart `file` (CSV) + `name`; validate CSV, upload to GCS, write Firestore doc `{ id, name, gcsPath, createdAt }`; returns 201 with `{ id, name, createdAt }`

When `GCS_BUCKET` is **not** set (e.g. local dev without GCP), list and words use only the default file, and POST returns 201 with no persistence.

## Run locally

The server defaults to **port 3001**. Optional: point at the web app’s CSV.

```bash
cd apps/backend
npm install
export DEFAULT_VOCAB_PATH="$(pwd)/../web/public/data/vocabulary.csv"
npm run dev
```

To test upload/list/words with storage, set `GCS_BUCKET` and use Application Default Credentials (`gcloud auth application-default login`):

```bash
export GCS_BUCKET=your-project-wordlists-staging
npm run dev
```

## Docker (build from repo root)

```bash
docker build -f apps/backend/Dockerfile -t wordlist-backend .
docker run -p 8080:8080 -e GCS_BUCKET=your-bucket wordlist-backend
```

The image includes vocabulary.csv for the default file. On Cloud Run, Terraform sets `GCS_BUCKET` and the service account has Storage + Firestore access.

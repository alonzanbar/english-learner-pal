# Word-list API

Implements the [contract](../../contract/api.ts): **uploaded files only**, stored in GCS with metadata in Firestore when `GCS_BUCKET` is set.

- **GET /api/files** – list uploaded files (from Firestore when `GCS_BUCKET` set); returns `[]` when not set
- **GET /api/files/:id/words** – words from GCS (by id via Firestore); 404 when bucket not set
- **POST /api/files** – multipart `file` (CSV) + `name`; validate CSV, upload to GCS, write Firestore doc `{ id, name, gcsPath, createdAt }`; returns 201 with `{ id, name, createdAt }`. When `GCS_BUCKET` is not set, returns 503 Service Unavailable.

## Run locally

The server defaults to **port 3001**. To test upload/list/words, set `GCS_BUCKET` and use Application Default Credentials (`gcloud auth application-default login`):

```bash
cd apps/backend
npm install
export GCS_BUCKET=your-project-wordlists-staging
npm run dev
```

Without `GCS_BUCKET`, GET /api/files returns `[]` and POST returns 503.

## Docker (build from repo root)

```bash
docker build -f apps/backend/Dockerfile -t wordlist-backend .
docker run -p 8080:8080 -e GCS_BUCKET=your-bucket wordlist-backend
```

On Cloud Run, Terraform sets `GCS_BUCKET` and the service account has Storage + Firestore access.

---
name: GCP backend CSV word lists
overview: Add a simple GCP backend (Cloud Run + Express in Docker) that accepts CSV uploads with an optional name, stores them in GCS with metadata in Firestore, and exposes list/get-words APIs. All infra is provisioned with Terraform; build and deploy run in GitHub Actions. Localhost frontend can talk to the staging backend. The frontend gets a file dropdown and runs all existing modes using the selected file's words.
---

# GCP backend for CSV word lists and file-based app behavior

## Principles

1. **Localhost works with staging**: Frontend running locally (`npm run dev`) uses the **staging** backend URL so dev does not require running the backend locally. Backend CORS allows `http://localhost:*` (e.g. 5173).
2. **Backend is Express**: Node 20 + Express only (no other framework).
3. **Everything is Docker**: Backend is containerized (Dockerfile); local backend runs via Docker (e.g. `docker compose up backend`). Cloud Run runs the same image. Optionally frontend build can be Docker-based for CI.
4. **All infra with Terraform**: GCS bucket, Cloud Run service, IAM bindings (and Firestore collection if needed) are defined in Terraform; no one-off `gcloud` or console for these resources.
5. **Build and deploy in GitHub Actions**: Backend image build and deploy to Cloud Run (staging/prod) are done in GitHub Actions. Terraform apply can run in CI (e.g. on infra changes) or be applied separately; deploy workflow uses the Terraform-defined Cloud Run service.

## Current state

- **Words**: Single in-memory source in `apps/web/src/lib/vocabulary.ts`: `Word { english, hebrew, sublist }`, parsed from hardcoded `CSV_DATA`. `getAllWords()`, `getWordsBySublist()`, `getSublists()` drive the UI.
- **UI**: `apps/web/src/pages/Index.tsx` uses that vocabulary for flashcards, quiz, sentences, list. No backend or file selection.
- **Backend**: No `apps/backend` yet; `scripts/deploy-backend.sh` is a placeholder for Cloud Run.

## Target behavior

1. **Backend**: Accept CSV uploads (words; translations optional) plus a **name** per file; store files and names; expose list of files and words per file.
2. **Frontend**: Dropdown of all files; on select, app uses that file's words for all existing functionality (flashcards, quiz, list; sentences only where the static sentence set overlaps).

## Architecture

- **Frontend** (dropdown, upload form) → **Backend** (POST /api/files, GET /api/files, GET /api/files/:id/words) → **GCS** (CSV files) + **Firestore** (metadata).

## Contract (client–server API)

A **single contract** in `contract/api.ts` defines the API between client and server. Backend and frontend import from it; no duplicate API types.

## 1. Backend (new: `apps/backend`)

- **Runtime**: Node 20 + **Express** only.
- **Endpoints** (shapes defined in **contract**; server implements to the contract):
  - `POST /api/files`: multipart form with `file` (CSV), `name` (string). Validate CSV (at least one column), upload to GCS, write to Firestore. Respond with contract upload response type.
  - `GET /api/files`: return list of file metadata (contract `ListFilesResponse`).
  - `GET /api/files/:id/words`: load CSV from GCS, parse to `Word[]` (sublist e.g. `Math.floor(index/60)+1`), return contract `GetWordsResponse`.
- **CSV format**: Header optional. Support columns like `word`/`english` and `translation`/`hebrew`; if only one column, use as `english` and set `hebrew` to empty or same. Normalize to `{ english, hebrew, sublist }`.
- **Storage**: One GCS bucket; one Firestore collection `wordlist_files` with documents `{ id, name, gcsPath, createdAt }`. Bucket and service account permissions are created by **Terraform**.
- **CORS**: Allow staging and production frontend origins **and** `http://localhost:*` (e.g. 5173).
- **Docker**: Single Dockerfile in `apps/backend`; same image for local run and Cloud Run.

## 2. Frontend changes

- **API client**: `apps/web/src/lib/api.ts` – `listFiles()`, `getWords(id)`, `uploadFile(file, name)`. Base URL from `VITE_API_URL`. All types **import from contract**.
- **Word source**: React context (e.g. `WordListContext`) – default AWL or file-based words; file dropdown; optional upload form.
- **Known-words**: Scope by file (e.g. `known-words-${fileId || 'default'}` in localStorage).

## 3. Infrastructure (Terraform only)

- **Resources** (e.g. `terraform/` or `infra/`): GCS bucket, Cloud Run service, service account + IAM for bucket and Firestore. Remote state (e.g. GCS). Variables: project, region, env.

## 4. Build and deploy (GitHub Actions)

- **Backend**: Workflow builds Docker image, pushes to Artifact Registry, deploys to Cloud Run (staging on push to main, prod on release). GCP auth via secret (e.g. `GCP_SA_KEY`).
- **Frontend**: Existing deploy workflow; `VITE_API_URL` set per environment. Local dev uses staging backend URL.

## 5. Files to add/change

| Area | Action |
|------|--------|
| `contract/` | API contract – shared types and endpoint spec. Server and client import from here. |
| `apps/backend/` | Express app (3 routes), Dockerfile, CORS. Use contract types for responses. |
| `terraform/` | GCS bucket, Cloud Run, IAM. |
| `.github/workflows/` | Build backend image, deploy to Cloud Run. |
| `apps/web/src/lib/api.ts` | listFiles, getWords, uploadFile; types from contract. |
| `apps/web/src/context/WordListContext.tsx` | File list + current words; default vs file selection. |
| `apps/web/src/pages/Index.tsx` | File dropdown, optional upload. |
| `apps/web/src/hooks/use-known-words.ts` | Scope by fileId. |
| `apps/web/.env.example` | VITE_API_URL (staging for local dev). |

## 6. CSV format (backend parsing)

- Header optional; columns `word`/`english` and `translation`/`hebrew`. One column = english only. Normalize to `{ english, hebrew, sublist }`.

## Summary

- **Principles**: Localhost → staging backend; Express; Docker; Terraform; GitHub Actions.
- **Contract**: Single source of truth in `contract/`; backend and frontend import from it.
- **Backend**: Express in Docker, 3 endpoints, GCS + Firestore, deploy via GitHub Actions.
- **Frontend**: File dropdown + upload; WordList context; known-words scoped by file.

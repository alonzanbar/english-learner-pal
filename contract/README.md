# API contract

Shared types and endpoint spec for the word-list backend. **Single source of truth** for client (`apps/web`) and server (`apps/backend`).

- **`api.ts`** – TypeScript types (`Word`, `FileMeta`, `ListFilesResponse`, `GetWordsResponse`, `UploadFileResponse`, `ApiError`) and endpoint constants (method + path). Import from here; do not redefine API shapes in app code.

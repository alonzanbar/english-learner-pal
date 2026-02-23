# Word-list API (dummy)

Implements the [contract](../contract/api.ts) with a single default file: [apps/web/public/data/vocabulary.csv](../web/public/data/vocabulary.csv).

- **GET /api/files** – returns one file: `{ id: 'default', name: 'Default (AWL)' }`
- **GET /api/files/:id/words** – returns parsed words from vocabulary.csv (any id)
- **POST /api/files** – accepts multipart (file + name), returns 201 with no persistence

## Run locally

```bash
cd apps/backend
npm install
# Point at the web app's CSV (from repo root):
export DEFAULT_VOCAB_PATH="$(pwd)/../web/public/data/vocabulary.csv"
npm run dev
```

Then open http://localhost:8080/api/files and http://localhost:8080/api/files/default/words .

## Docker (build from repo root)

```bash
docker build -f apps/backend/Dockerfile -t wordlist-backend .
docker run -p 8080:8080 wordlist-backend
```

The image includes vocabulary.csv; no env needed for the default file.

# Web client

Serves the client app. The app loads word lists from the backend API.

## Run locally (client only, use staging API)

1. Create `.env` with your staging backend URL (from repo root: `terraform -chdir=terraform output -raw backend_url`):
   ```
   VITE_API_URL=https://your-staging-backend.run.app
   ```

2. Install and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:8080. The landing page is `index.html`; the app is served at `/`.

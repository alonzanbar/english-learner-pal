# __DISPLAY_NAME__

Monorepo: `apps/web` (Vite + React + TypeScript), Firebase Hosting, optional `apps/backend` later.

## Quick start

```sh
git clone https://github.com/YOUR_USERNAME/__PROJECT_ID__.git
cd __PROJECT_ID__
cd apps/web && npm i && cd ../..
make dev
```

## Commands (from repo root)

| Command | Description |
|--------|-------------|
| `make dev` | Run the web dev server |
| `make deploy-staging` | Build and deploy to Firebase (staging) |
| `make deploy-prod` | Build and deploy to Firebase (prod) |

## One-time: GCP + Firebase

1. Install: `npm install -g firebase-tools` and [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Sign in: `firebase login` and `gcloud auth login` (same Google account).
3. From repo root:
   ```bash
   ./scripts/setup-firebase-project.sh __PROJECT_ID__ "__DISPLAY_NAME__"
   ```
4. Deploy: `firebase use staging && make deploy-staging`.

**If `addFirebase` returns 403:** Add Firebase once in the [Firebase console](https://console.firebase.google.com/) (Add project → Add Firebase to an existing Google Cloud project), then deploy from the repo.

## Backend (Phase 1)

When you add `apps/backend`: `DEPLOY_BACKEND=1 make deploy-staging`.

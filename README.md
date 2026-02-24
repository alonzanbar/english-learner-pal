# Welcome to your Lovable project

## Bootstrap a new app (one command)

From this repo root, you can create a **new** GitHub repo and full project (Vite + React + TS, Firebase scripts, Makefile) in one go:

```bash
./scripts/bootstrap-new-app.sh <project_id> ["Display Name"]
```

Example: `./scripts/bootstrap-new-app.sh my-cool-app "My Cool App"`. Requires [GitHub CLI](https://cli.github.com/) (`gh auth login`). The new project is created in a sibling directory and pushed to GitHub. Then in the new repo run `./scripts/setup-firebase-project.sh <project_id> "Display Name"` once for GCP/Firebase.

**Bootstrap from an existing repo:** Clone an existing GitHub repo, reshape it to this monorepo layout (apps/web + Makefile + scripts), create a **new** GitHub repo, and push:

```bash
./scripts/bootstrap-from-repo.sh <SOURCE_REPO> <NEW_PROJECT_ID> ["Display Name"]
```

Example: `./scripts/bootstrap-from-repo.sh https://github.com/foo/old-app my-new-app "My New App"`. SOURCE_REPO can be a URL or `owner/repo`. The source repo is not modified.

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies (run from project root).
cd apps/web && npm i && cd ../..

# Step 4: Start the development server (from project root).
make dev
```

**Run locally using the staging API (no local backend)**

If the backend is already deployed to staging (e.g. Cloud Run), run only the frontend and set `VITE_API_URL` to your staging backend URL (no trailing slash):

```sh
cd apps/web && npm i
VITE_API_URL=https://wordlist-backend-staging-XXXXX.run.app npm run dev
```

Get the URL from Terraform: `terraform -chdir=terraform output -raw backend_url`. Then open http://localhost:8080. Ensure the staging backend allows CORS from `http://localhost:8080` (e.g. `ALLOWED_ORIGINS` in Cloud Run).

**Run locally with a local backend (two terminals)**

Start the backend first (it defaults to port 3001 so the web app can use 8080), then start the web app. The web app proxies `/api` to the backend when `VITE_API_URL` is not set.

```sh
# Terminal 1 – backend (default port 3001)
cd apps/backend && npm i
export DEFAULT_VOCAB_PATH="$(pwd)/../web/public/data/vocabulary.csv"
npm run dev

# Terminal 2 – web app
cd apps/web && npm run dev
```

Then open http://localhost:8080.

**Still getting 404 on http://localhost:8080?**

1. **Using the staging API:** Create `apps/web/.env` with one line (use your real staging URL):
   ```bash
   echo "VITE_API_URL=https://YOUR-STAGING-URL.run.app" > apps/web/.env
   ```
   Then run `make dev` from the repo root. Get the URL with `terraform -chdir=terraform output -raw backend_url`.

2. **Nothing on 8080:** If the backend was previously using port 8080, stop it. Only the web app should use 8080. The backend now defaults to 3001.

3. **Page loads but shows "Failed to load word list":** The API request failed. With staging, set `VITE_API_URL` in `apps/web/.env` as above. With a local backend, start the backend first (Terminal 1), then run `make dev` (Terminal 2).

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment (Firebase Hosting)

Static hosting is on Firebase (GCP, HTTPS, CDN). Two environments: **staging** and **prod**.

### One-time setup (all from command line; browser only for sign-in)

The only time a browser opens is for sign-in. Everything else is CLI.

1. Install tools:
   ```bash
   npm install -g firebase-tools
   brew install google-cloud-sdk   # or https://cloud.google.com/sdk/docs/install
   ```
2. Sign in (browser opens once per tool):
   ```bash
   firebase login
   gcloud auth login
   ```
   Use the same Google account for both.
3. Create the Firebase project and add Firebase from the repo root:
   ```bash
   ./scripts/setup-firebase-project.sh lexicon-learner-pal "Lexicon Learner"
   ```
   This creates the GCP project, enables the Firebase Management API (so `addFirebase` doesn’t 403), adds Firebase, and writes `.firebaserc`. Project ID must be **lowercase** with only letters, numbers, and hyphens.
4. Deploy:
   ```bash
   firebase use staging
   make deploy-staging
   ```

**Reusing an existing project:** Run `firebase projects:list`, pick an ID, then:
`gcloud services enable firebase.googleapis.com --project=YOUR_ID` and `firebase projects:addfirebase YOUR_ID`. Edit `.firebaserc` so `default`/`staging`/`prod` point to that ID.

**If `addFirebase` still returns 403:** Add Firebase once in the [Firebase console](https://console.firebase.google.com/) (Add project → Add Firebase to an existing Google Cloud project → select your project). Then deploy from the repo as above.

### Deploy commands (from repo root)

| Command | Description |
|--------|-------------|
| `make dev` | Run the web dev server (`apps/web`) |
| `make deploy-staging` | Build and deploy web to Firebase Hosting (staging) |
| `make deploy-prod` | Build and deploy web to Firebase Hosting (prod) |

Or run the script directly: `./scripts/deploy-all.sh staging` or `./scripts/deploy-all.sh prod`.

### GitHub Actions

**Web (Firebase Hosting)** – `.github/workflows/deploy.yml`:

- **Push to `main`** → deploy to **staging**
- **Actions → Deploy to Firebase Hosting → Run workflow** → choose **staging** or **prod**
- **Publish a release** → deploy to **prod**

**Backend (Cloud Run)** – `.github/workflows/deploy-backend.yml`:

- **Push to `main`** when `apps/backend/**` changes → build Docker image, push to Artifact Registry, deploy to **staging** Cloud Run
- **Actions → Deploy Backend (Cloud Run) → Run workflow** → choose **staging** or **prod**

**One-time setup (web):** Add a repo secret `FIREBASE_TOKEN` and **variables** so the deployed app calls the backend:

1. **FIREBASE_TOKEN** (secret): Run `npx firebase login:ci`, then **Settings → Secrets and variables → Actions → New repository secret** → name `FIREBASE_TOKEN`, value = the token.
2. **BACKEND_URL_STAGING** (variable): Set in GitHub **Settings → Secrets and variables → Actions → Variables**, or let **Terraform** manage it: run `terraform apply -var="github_repository=owner/repo"` with `GITHUB_TOKEN` set (see [terraform/README.md](terraform/README.md)). Terraform will set `BACKEND_URL_STAGING` (or `BACKEND_URL_PROD`) to the Cloud Run URL.
3. **BACKEND_URL_PROD** (variable): Same, for prod; or run Terraform with `environment=prod` to set it.

Without these variables, the web deploy workflow will fail so the app is never deployed without an API URL (which would cause /api/files to return HTML from Firebase).

**One-time setup (backend):** Create a GCP service account with roles **Artifact Registry Writer** and **Cloud Run Admin**, download a JSON key, then add repo secret `GCP_SA_KEY` with the JSON contents. Optional: set variables `GCP_PROJECT_ID` and `GCP_REGION` (defaults: `lexicon-learner-pal`, `us-central1`). Ensure Terraform has been applied so the Artifact Registry repo and Cloud Run service exist.

### Enabling the backend later (Phase 1)

When you add `apps/backend` and want to deploy it (e.g. Cloud Run + Django):

```sh
DEPLOY_BACKEND=1 make deploy-staging
# or
DEPLOY_BACKEND=1 ./scripts/deploy-all.sh prod
```

Without `DEPLOY_BACKEND=1`, only the static web app is deployed.

---

## How can I deploy this project? (Lovable)

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

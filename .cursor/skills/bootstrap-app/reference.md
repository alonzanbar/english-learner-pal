# Bootstrap Application — Full reference

Use this when applying the bootstrap-app skill.

- **New app:** Input **project_id** (required), **display_name** (optional).
- **From existing repo:** Input **source_repo** (required), **project_id** (required, name for new repo), **display_name** (optional).

---

## 0a. New app — one command (full bootstrap: GitHub repo + project)

The **scripts and template are embedded in this skill**: same directory as SKILL.md has `scripts/bootstrap-new-app.sh`, `scripts/bootstrap-from-repo.sh`, and `scripts/bootstrap-template/`. If the workspace does not have them, copy from the skill into the workspace, then from workspace root:

```bash
./scripts/bootstrap-new-app.sh <project_id> ["Display Name"]
```

- Creates a new directory `../<project_id>/` with full layout (template + apps/web via Vite).
- Substitutes `__PROJECT_ID__` and `__DISPLAY_NAME__` in template files.
- Runs `git init`, `gh repo create <project_id> --public --source=. --remote=origin --push`.
- **Prereq**: `gh` CLI installed and authenticated (`gh auth login`).
- **After**: In the new repo, one-time GCP/Firebase: `./scripts/setup-firebase-project.sh <project_id> ["Display Name"]`.

No extra steps for repo creation or file generation.

---

## 0b. From existing repo — one command (clone, transform, new repo, push)

When the user provides an **existing GitHub repo** and wants it reshaped into the monorepo layout and pushed to a **new** repo:

```bash
./scripts/bootstrap-from-repo.sh <SOURCE_REPO> <NEW_PROJECT_ID> [DISPLAY_NAME]
```

- **SOURCE_REPO**: GitHub URL (`https://github.com/owner/repo`) or `owner/repo`.
- **NEW_PROJECT_ID**: Name for the new repo (lowercase, letters, numbers, hyphens).
- **DISPLAY_NAME**: Optional; defaults to NEW_PROJECT_ID.

Steps performed by the script:
1. Clone SOURCE_REPO into `../<NEW_PROJECT_ID>/` (sibling of workspace).
2. Remove existing `.git`.
3. Transform layout: if repo has no `apps/web` but has root app (package.json + vite/index.html), move app into `apps/web`; if already `apps/web`, keep it; else create minimal `apps/web` with Vite.
4. Copy template root (Makefile, firebase.json, .firebaserc, .gitignore) and `scripts/*.sh`, overwriting as needed; replace template README.
5. Substitute `__PROJECT_ID__`, `__DISPLAY_NAME__`, and `YOUR_USERNAME` in README and .firebaserc.
6. `git init`, first commit, `gh repo create <NEW_PROJECT_ID> --public --source=. --remote=origin --push`.

The **source repo is not modified**. The new repo is under the user’s GitHub (gh auth). **Prereq**: `gh` CLI installed and authenticated. **After**: In the new repo, one-time GCP/Firebase: `./scripts/setup-firebase-project.sh <NEW_PROJECT_ID> ["Display Name"]`.

---

## 1. GitHub repository structure

### Root

- **README.md**: Project title and short description. "How to edit": clone, install deps (`cd apps/web && npm i && cd ../..`), run dev (`make dev`). "Deployment": one-time setup and deploy commands. Optional: Lovable/IDE/CodeSpaces.
- **Makefile**: `dev` → `cd apps/web && npm run dev`; `deploy-staging` → `./scripts/deploy-all.sh staging`; `deploy-prod` → `./scripts/deploy-all.sh prod`. All from repo root.
- **firebase.json**: Hosting `public: "apps/web/dist"`, `ignore`: `firebase.json`, `**/.*`, `**/node_modules/**`. Rewrites: `[ { "source": "**", "destination": "/index.html" } ]`.
- **.firebaserc**: `projects`: `default`, `staging`, `prod` all set to **project_id**.
- **.gitignore**: `node_modules`, `dist`, `dist-ssr`, `*.local`, `*.log`, `firebase-debug.log`, `.vscode/*`, `.idea`, `.DS_Store`, etc.

### scripts/

- **setup-firebase-project.sh**
  - Args: `PROJECT_ID` (required), `DISPLAY_NAME` (optional).
  - Validate PROJECT_ID: `^[a-z0-9-]+$`.
  - Steps: (1) `firebase projects:create "$PROJECT_ID" --display-name "$DISPLAY_NAME"` (|| true), (2) `gcloud services enable firebase.googleapis.com --project="$PROJECT_ID"`, (3) `gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:$(gcloud config get-value account)" --role="roles/firebase.admin"`, (4) `firebase projects:addfirebase "$PROJECT_ID"`, (5) write `.firebaserc` with default/staging/prod = PROJECT_ID.
  - Prereqs: `firebase login`, `gcloud auth login`. Usage: `./scripts/setup-firebase-project.sh <project_id> ["Display Name"]`.

- **deploy-all.sh**: Arg `staging` or `prod`. Run `deploy-web.sh` with that env. If `DEPLOY_BACKEND=1` and `apps/backend` exists, run `deploy-backend.sh`.

- **deploy-web.sh**: Arg `staging` or `prod`. From repo root: `cd apps/web`, `npm ci`, `npm run build`; then `firebase use <ENV>`, `firebase deploy --only hosting`.

- **deploy-backend.sh**: Arg `staging` or `prod`. If no `apps/backend`, exit 0 with message. Else placeholder for Phase 1 (Cloud Run + Django). README: `DEPLOY_BACKEND=1 make deploy-staging`.

All scripts: `#!/usr/bin/env bash`, `set -euo pipefail`, `SCRIPT_DIR`/`REPO_ROOT` from script path.

### apps/web

- Vite + React + TypeScript: `package.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/pages/Index.tsx`, Tailwind + shadcn. Build → `apps/web/dist`. No root `package.json`; commands via Makefile/scripts.

### Optional

- **apps/backend**: Omitted at bootstrap; add for Phase 1.

---

## 2. GCP

Done by **setup-firebase-project.sh**: create project, enable Firebase Management API, grant Firebase Admin to user, addFirebase, write `.firebaserc`. Document: if addFirebase 403, add Firebase once in Console then re-run. Reuse: `firebase projects:list`, enable API, `firebase projects:addfirebase <ID>`, set .firebaserc.

---

## 3. Commands (repo root)

- **One-time**: `./scripts/setup-firebase-project.sh <project_id> ["Display Name"]`
- **Dev**: `make dev`
- **Deploy**: `make deploy-staging` | `make deploy-prod`; with backend: `DEPLOY_BACKEND=1 make deploy-staging`

---

## 4. Prompt block (fill project_id and display_name)

```
Bootstrap a new application with:
- project_id: "<project_id>"
- display_name: "<display_name>"   # optional; default "<project_id>"

Deliverables:
1. GitHub repo: Root (README, Makefile, firebase.json, .firebaserc, .gitignore), scripts/ (setup-firebase-project.sh, deploy-all.sh, deploy-web.sh, deploy-backend.sh), apps/web (Vite+React+TS+Tailwind+shadcn, dist).
2. GCP: setup-firebase-project.sh creates project, enables API, grants roles, addFirebase. Document firebase login + gcloud auth login.
3. Commands: setup script, make dev, make deploy-staging | deploy-prod, optional DEPLOY_BACKEND=1.
README: one-time setup, deploy commands, backend phase.
```

---

## 5. Validation checklist

- [ ] README, Makefile, firebase.json, .gitignore, scripts/*.sh, apps/web present.
- [ ] `./scripts/setup-firebase-project.sh <project_id> "Display Name"` runs and writes .firebaserc.
- [ ] `make dev` starts web app.
- [ ] `make deploy-staging` builds and deploys (after setup).
- [ ] project_id lowercase, alphanumeric + hyphens only.

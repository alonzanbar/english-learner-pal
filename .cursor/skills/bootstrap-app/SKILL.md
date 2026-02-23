---
name: bootstrap-app
description: Bootstraps a new application from a project_id or from an existing GitHub repo: GitHub repo (Makefile, Firebase, scripts), GCP project with Firebase, and command surface for creation, deployment, and maintenance. Use when the user says bootstrap, scaffold, or create a new app from a project ID; when they provide an existing repo to clone and reshape into the monorepo layout; when they want Firebase Hosting and GCP; or when they ask for the standard monorepo (apps/web + scripts) layout.
---

# Bootstrap Application

Bootstrap a new application from a single **project_id**. Produces a GitHub repo with generic structure, GCP/Firebase wiring, and Makefile/scripts for dev, deploy-staging, and deploy-prod.

## When to use

- User provides a **project_id** (and optionally **display_name**) and wants a new app scaffold.
- User provides an **existing GitHub repo** (URL or owner/repo) and wants it cloned, reshaped to the monorepo layout (apps/web + scripts), then pushed to a **new** GitHub repo.
- User asks to "bootstrap" or "scaffold" an app with Firebase, GCP, or the same structure as this repo (lexicon-learner-pal).

## Input

**New app (no existing repo):**
- **project_id** (required): Lowercase; letters, numbers, hyphens only (e.g. `my-app-name`). Used for GCP project ID and naming.
- **display_name** (optional): Human-readable name. Defaults to `project_id`.

**From existing repo:**
- **source_repo** (required): Existing GitHub repo URL (e.g. `https://github.com/owner/repo`) or `owner/repo`.
- **project_id** (required): Name for the **new** repo (same rules as above).
- **display_name** (optional): Human-readable name for the new project.

If the user does not give the required inputs, ask for them before proceeding.

## What to do

1. **Embedded scripts and template:** This skill contains `scripts/bootstrap-new-app.sh`, `scripts/bootstrap-from-repo.sh`, and `scripts/bootstrap-template/` (same directory as this SKILL.md). If the **workspace** does not already have these, copy them from the skill directory into the workspace. Skill path: `.cursor/skills/bootstrap-app/` (project) or `~/.cursor/skills/bootstrap-app/` (personal).

2. **New app (no existing repo):** Tell the user to run from the **workspace root**:
   ```bash
   ./scripts/bootstrap-new-app.sh <project_id> ["Display Name"]
   ```
   That creates a new project (sibling directory), GitHub repo, and pushes. Prereq: **gh CLI** installed and authenticated (`gh auth login`).

3. **From existing repo:** When the user provides an existing GitHub repo (source_repo) and a new project_id, tell them to run from the **workspace root**:
   ```bash
   ./scripts/bootstrap-from-repo.sh <SOURCE_REPO> <project_id> ["Display Name"]
   ```
   Example: `./scripts/bootstrap-from-repo.sh https://github.com/foo/old-app my-new-app "My New App"`. This clones the source repo, transforms it to the monorepo layout (root app → apps/web if needed, adds Makefile, firebase.json, scripts), creates a **new** GitHub repo with the given project_id, and pushes. The source repo is not modified.

4. **If you cannot copy from the skill** (e.g. path unknown): Read [reference.md](reference.md) and generate the repo structure and script content in the workspace so the user has both bootstrap scripts and `scripts/bootstrap-template/`, then instruct them to run the appropriate command above.

5. **Validation:** After bootstrap, the new repo has README, Makefile, firebase.json, .firebaserc, .gitignore, scripts/*.sh, apps/web (Vite+React+TS or migrated app). GCP one-time: from the new repo run `./scripts/setup-firebase-project.sh <project_id> ["Display Name"]`.

## Quick reference

- **Embedded in this skill:** `scripts/bootstrap-new-app.sh`, `scripts/bootstrap-from-repo.sh`, and `scripts/bootstrap-template/` (full tree). Copy into workspace if missing, then run the chosen script from workspace root.
- **New app:** `./scripts/bootstrap-new-app.sh <project_id> ["Display Name"]` — creates GitHub repo + project (sibling dir). Prereq: `gh auth login`.
- **From existing repo:** `./scripts/bootstrap-from-repo.sh <SOURCE_REPO> <project_id> ["Display Name"]` — clones SOURCE_REPO, reshapes to monorepo (apps/web + scripts), creates new GitHub repo, pushes. SOURCE_REPO can be URL or `owner/repo`. Prereq: `gh auth login`.
- **New repo:** README, Makefile, firebase.json, .firebaserc, .gitignore, scripts/*.sh, apps/web (Vite+React+TS or migrated app). Then `./scripts/setup-firebase-project.sh ...`, `make dev`, `make deploy-staging`.

## Using this skill in other projects

This skill lives in the repo under `.cursor/skills/bootstrap-app/`. To use it from **any** project:

- Copy the entire `bootstrap-app` folder to your **personal** skills directory:  
  `~/.cursor/skills/bootstrap-app/`  
  (so it appears in Cursor’s skill list across workspaces.)

Then in any project, ask: e.g. “Bootstrap a new app with project_id **my-cool-app**” and the agent will apply this skill.

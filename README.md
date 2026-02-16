# Welcome to your Lovable project

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

# Step 3: Install the necessary dependencies.
cd apps/web && npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
make dev
```

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

### One-time setup (CLI only; browser only for sign-in)

The only time a browser opens is for `firebase login` (Google OAuth). Everything else is command line.

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Sign in (opens browser once): `firebase login`
3. Create a project (or reuse an existing one):
   ```bash
   firebase projects:create YOUR_PROJECT_ID --display-name "Lexicon Learner"
   ```
   Project ID must be **lowercase**, with only letters, numbers, and **hyphens** (no underscores). Example: `lexicon-learner-pal`. To use an existing project, run `firebase projects:list` and pick an ID.
4. Point this repo at the project: edit `.firebaserc` and replace `replace-with-your-project-id` with your project ID (e.g. the one from step 3; same ID for `default`, `staging`, and `prod` is fine).

### Deploy commands (from repo root)

| Command | Description |
|--------|-------------|
| `make dev` | Run the web dev server (`apps/web`) |
| `make deploy-staging` | Build and deploy web to Firebase Hosting (staging) |
| `make deploy-prod` | Build and deploy web to Firebase Hosting (prod) |

Or run the script directly: `./scripts/deploy-all.sh staging` or `./scripts/deploy-all.sh prod`.

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

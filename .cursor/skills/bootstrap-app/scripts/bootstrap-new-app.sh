#!/usr/bin/env bash
set -euo pipefail

# One command: create project dir, copy template, create Vite app, init git, create GitHub repo, push.
# Usage: scripts/bootstrap-new-app.sh <PROJECT_ID> [DISPLAY_NAME]
# Prereqs: gh CLI installed and authenticated (gh auth login). Run from repo root.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/bootstrap-template"
PROJECT_ID="${1:-}"
DISPLAY_NAME="${2:-$PROJECT_ID}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <PROJECT_ID> [DISPLAY_NAME]"
  echo "Example: $0 my-cool-app \"My Cool App\""
  echo ""
  echo "Creates a new app: project directory, GitHub repo, Vite+React+TS in apps/web, Makefile and deploy scripts."
  echo "Prereq: gh CLI installed and logged in (gh auth login)."
  exit 1
fi

if [[ ! "$PROJECT_ID" =~ ^[a-z0-9-]+$ ]]; then
  echo "Error: PROJECT_ID must be lowercase letters, numbers, and hyphens only."
  exit 1
fi

if [[ ! -d "$TEMPLATE_DIR" ]]; then
  echo "Error: Template not found at $TEMPLATE_DIR"
  exit 1
fi

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI not found. Install: https://cli.github.com/ (e.g. brew install gh)"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  echo "Error: gh not authenticated. Run: gh auth login"
  exit 1
fi

# Target directory: parent of current repo
TARGET_DIR="$(cd "$REPO_ROOT/.." && pwd)/$PROJECT_ID"
if [[ -e "$TARGET_DIR" ]]; then
  echo "Error: Directory already exists: $TARGET_DIR"
  exit 1
fi

echo "=== 1/6 Creating project directory ==="
mkdir -p "$TARGET_DIR"

echo "=== 2/6 Copying template ==="
cp -R "$TEMPLATE_DIR/." "$TARGET_DIR/"

echo "=== 3/6 Substituting __PROJECT_ID__ and __DISPLAY_NAME__ ==="
if sed --version &>/dev/null; then
  SED_INPLACE=(sed -i)
else
  SED_INPLACE=(sed -i '')
fi
for f in "$TARGET_DIR/README.md" "$TARGET_DIR/.firebaserc" "$TARGET_DIR/scripts/setup-firebase-project.sh"; do
  [[ -f "$f" ]] || continue
  "${SED_INPLACE[@]}" "s/__PROJECT_ID__/$PROJECT_ID/g" "$f"
  "${SED_INPLACE[@]}" "s/__DISPLAY_NAME__/$DISPLAY_NAME/g" "$f"
done
GH_USER="$(gh api user -q .login)"
"${SED_INPLACE[@]}" "s/YOUR_USERNAME/$GH_USER/g" "$TARGET_DIR/README.md"

echo "=== 4/6 Creating apps/web (Vite + React + TypeScript) ==="
cd "$TARGET_DIR"
npm create vite@latest apps/web -- --template react-ts
chmod +x scripts/*.sh

echo "=== 5/6 Git init and first commit ==="
git init -b main
git add .
git commit -m "Bootstrap: monorepo with apps/web (Vite+React+TS), Firebase Hosting, deploy scripts"

echo "=== 6/6 Creating GitHub repo and pushing ==="
gh repo create "$PROJECT_ID" --public --source=. --remote=origin --push --description "$DISPLAY_NAME"

echo ""
echo "Done. Repo: $(gh repo view "$PROJECT_ID" --json url -q .url)"
echo "Local: $TARGET_DIR"
echo ""
echo "Next (one-time per project): cd $TARGET_DIR && ./scripts/setup-firebase-project.sh $PROJECT_ID \"$DISPLAY_NAME\""
echo "Then: make dev  or  make deploy-staging"

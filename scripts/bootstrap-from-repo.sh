#!/usr/bin/env bash
set -euo pipefail

# Bootstrap from an existing GitHub repo: clone, transform to monorepo layout, create new repo, push.
# Usage: scripts/bootstrap-from-repo.sh <SOURCE_REPO> <NEW_PROJECT_ID> [DISPLAY_NAME]
#   SOURCE_REPO: GitHub URL (https://github.com/owner/repo) or owner/repo
#   NEW_PROJECT_ID: ID for the new repo (lowercase, letters, numbers, hyphens)
# Prereqs: gh CLI installed and authenticated. Run from a repo that has scripts/bootstrap-template/.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/bootstrap-template"
SOURCE_REPO="${1:-}"
PROJECT_ID="${2:-}"
DISPLAY_NAME="${3:-$PROJECT_ID}"

if [[ -z "$SOURCE_REPO" || -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <SOURCE_REPO> <NEW_PROJECT_ID> [DISPLAY_NAME]"
  echo "  SOURCE_REPO: https://github.com/owner/repo or owner/repo"
  echo "  NEW_PROJECT_ID: name for the new GitHub repo (lowercase, letters, numbers, hyphens)"
  echo ""
  echo "Example: $0 https://github.com/foo/old-app my-new-app \"My New App\""
  echo ""
  echo "Clones SOURCE_REPO, transforms to monorepo (apps/web + Makefile + scripts), creates new repo NEW_PROJECT_ID, pushes."
  exit 1
fi

if [[ ! "$PROJECT_ID" =~ ^[a-z0-9-]+$ ]]; then
  echo "Error: NEW_PROJECT_ID must be lowercase letters, numbers, and hyphens only."
  exit 1
fi

if [[ ! -d "$TEMPLATE_DIR" ]]; then
  echo "Error: Template not found at $TEMPLATE_DIR"
  exit 1
fi

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI not found. Install: https://cli.github.com/"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  echo "Error: gh not authenticated. Run: gh auth login"
  exit 1
fi

# Normalize SOURCE_REPO to URL for clone
if [[ "$SOURCE_REPO" =~ ^https://github\.com/ ]]; then
  CLONE_URL="$SOURCE_REPO"
elif [[ "$SOURCE_REPO" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
  CLONE_URL="https://github.com/$SOURCE_REPO.git"
else
  echo "Error: SOURCE_REPO must be a GitHub URL or owner/repo"
  exit 1
fi

TARGET_DIR="$(cd "$REPO_ROOT/.." && pwd)/$PROJECT_ID"
if [[ -e "$TARGET_DIR" ]]; then
  echo "Error: Directory already exists: $TARGET_DIR"
  exit 1
fi

echo "=== 1/6 Cloning source repo ==="
git clone --depth 1 "$CLONE_URL" "$TARGET_DIR"
cd "$TARGET_DIR"
rm -rf .git

echo "=== 2/6 Transforming to monorepo layout ==="
if [[ -d "apps/web" ]]; then
  echo "  apps/web already exists, keeping it."
else
  if [[ -f "package.json" ]] && { [[ -f "vite.config.ts" ]] || [[ -f "vite.config.js" ]] || [[ -f "index.html" ]]; }; then
    echo "  Moving root app into apps/web"
    mkdir -p apps
    mv package.json apps/web 2>/dev/null || true
    mv package-lock.json apps/web 2>/dev/null || true
    mv yarn.lock apps/web 2>/dev/null || true
    mv pnpm-lock.yaml apps/web 2>/dev/null || true
    mv index.html apps/web 2>/dev/null || true
    for f in vite.config.ts vite.config.js vite.config.mts vite.config.mjs tsconfig.json tsconfig.node.json tsconfig.app.json; do
      [[ -f "$f" ]] && mv "$f" apps/web/ 2>/dev/null || true
    done
    [[ -d "src" ]] && mv src apps/web/
    [[ -d "public" ]] && mv public apps/web/
  else
    echo "  No apps/web and no obvious root app; creating minimal apps/web with Vite"
    mkdir -p apps
    npm create vite@latest apps/web -- --template react-ts
  fi
fi

echo "=== 3/6 Adding root and scripts from template ==="
cp "$TEMPLATE_DIR/Makefile" .
cp "$TEMPLATE_DIR/firebase.json" .
cp "$TEMPLATE_DIR/.firebaserc" .
cp "$TEMPLATE_DIR/.gitignore" .
mkdir -p scripts
cp "$TEMPLATE_DIR/scripts/"*.sh scripts/
chmod +x scripts/*.sh
# Replace template README so structure is documented
cp "$TEMPLATE_DIR/README.md" .

echo "=== 4/6 Substituting __PROJECT_ID__ and __DISPLAY_NAME__ ==="
sub_file() {
  local f="$1"
  [[ -f "$f" ]] || return
  if sed --version &>/dev/null 2>&1; then
    sed -i "s|__PROJECT_ID__|$PROJECT_ID|g; s|__DISPLAY_NAME__|$DISPLAY_NAME|g" "$f"
  else
    sed -i '' "s|__PROJECT_ID__|$PROJECT_ID|g; s|__DISPLAY_NAME__|$DISPLAY_NAME|g" "$f"
  fi
}
sub_file README.md
sub_file .firebaserc
GH_USER="$(gh api user -q .login)"
if sed --version &>/dev/null 2>&1; then
  sed -i "s|YOUR_USERNAME|$GH_USER|g" README.md
else
  sed -i '' "s|YOUR_USERNAME|$GH_USER|g" README.md
fi

echo "=== 5/6 Git init and first commit ==="
git init -b main
git add .
git commit -m "Bootstrap from existing repo: monorepo layout, Firebase Hosting, deploy scripts" || true

echo "=== 6/6 Creating new GitHub repo and pushing ==="
gh repo create "$PROJECT_ID" --public --source=. --remote=origin --push --description "$DISPLAY_NAME"

echo ""
echo "Done. New repo: $(gh repo view "$PROJECT_ID" --json url -q .url)"
echo "Local: $TARGET_DIR"
echo ""
echo "Next (one-time): cd $TARGET_DIR && ./scripts/setup-firebase-project.sh $PROJECT_ID \"$DISPLAY_NAME\""
echo "Then: make dev  or  make deploy-staging"

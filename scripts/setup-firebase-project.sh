#!/usr/bin/env bash
set -euo pipefail

# One-shot: create GCP project, enable Firebase API, add Firebase. All from CLI.
# Usage: scripts/setup-firebase-project.sh <PROJECT_ID> [DISPLAY_NAME]
# Prereqs: firebase login, gcloud auth login (same Google account), gcloud installed.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ID="${1:-}"
DISPLAY_NAME="${2:-$PROJECT_ID}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <PROJECT_ID> [DISPLAY_NAME]"
  echo "Example: $0 lexicon-learner-pal \"Lexicon Learner\""
  exit 1
fi

# Must be lowercase, letters/numbers/hyphens only
if [[ ! "$PROJECT_ID" =~ ^[a-z0-9-]+$ ]]; then
  echo "Error: PROJECT_ID must be lowercase letters, numbers, and hyphens only."
  exit 1
fi

echo "=== 1/4 Creating GCP project (Firebase add may fail once) ==="
firebase projects:create "$PROJECT_ID" --display-name "$DISPLAY_NAME" || true

echo ""
echo "=== 2/5 Enabling Firebase Management API ==="
if ! command -v gcloud &>/dev/null; then
  echo "Error: gcloud CLI not found. Install: https://cloud.google.com/sdk/docs/install (e.g. brew install google-cloud-sdk)"
  exit 1
fi
gcloud services enable firebase.googleapis.com --project="$PROJECT_ID"

echo ""
echo "=== 3/5 Granting Firebase Admin to current user (fixes addFirebase 403) ==="
USER_EMAIL="$(gcloud config get-value account 2>/dev/null || true)"
if [[ -z "$USER_EMAIL" ]]; then
  echo "Error: gcloud account not set. Run: gcloud auth login"
  exit 1
fi
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="user:${USER_EMAIL}" \
  --role="roles/firebase.admin" \
  --quiet

echo ""
echo "=== 4/5 Adding Firebase to project ==="
firebase projects:addfirebase "$PROJECT_ID"

echo ""
echo "=== 5/5 Updating .firebaserc ==="
cat > "$REPO_ROOT/.firebaserc" << EOF
{
  "projects": {
    "default": "$PROJECT_ID",
    "staging": "$PROJECT_ID",
    "prod": "$PROJECT_ID"
  }
}
EOF
echo "Wrote $PROJECT_ID to .firebaserc (default, staging, prod)."

echo ""
echo "Done. Deploy with: firebase use staging && make deploy-staging"

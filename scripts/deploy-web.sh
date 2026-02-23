#!/usr/bin/env bash
set -euo pipefail

# Deploy static web app to Firebase Hosting.
# Usage: scripts/deploy-web.sh <staging|prod>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV="${1:-}"

if [[ "$ENV" != "staging" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 <staging|prod>"
  exit 1
fi

# Set API base URL so the built app calls the backend (not same-origin → HTML).
# Prefer Terraform output; otherwise use BACKEND_URL env if set.
if [[ -z "${VITE_API_URL:-}" ]]; then
  if [[ -n "${BACKEND_URL:-}" ]]; then
    export VITE_API_URL="$BACKEND_URL"
  else
    BACKEND_URL="$(terraform -chdir="$REPO_ROOT/terraform" output -raw backend_url 2>/dev/null)" && export VITE_API_URL="$BACKEND_URL" || true
  fi
fi
if [[ -n "${VITE_API_URL:-}" ]]; then
  echo "Building with VITE_API_URL=$VITE_API_URL"
fi

cd "$REPO_ROOT/apps/web"
npm ci
npm run build

cd "$REPO_ROOT"
firebase use "$ENV"
firebase deploy --only hosting

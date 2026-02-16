#!/usr/bin/env bash
set -euo pipefail

# Placeholder for backend deployment (Phase 1).
# Usage: scripts/deploy-backend.sh <staging|prod>
# When DEPLOY_BACKEND=1 and apps/backend exists, this will deploy to Cloud Run (Django).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ ! -d "$REPO_ROOT/apps/backend" ]]; then
  echo "Backend not enabled yet. Add apps/backend to enable Phase 1 deployment."
  exit 0
fi

# TODO Phase 1: Cloud Run + Django deploy
echo "Backend deployment not implemented yet."
exit 0

#!/usr/bin/env bash
set -euo pipefail

# Placeholder for backend deployment (Phase 1).
# Usage: scripts/deploy-backend.sh <staging|prod>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ ! -d "$REPO_ROOT/apps/backend" ]]; then
  echo "Backend not enabled yet. Add apps/backend to enable Phase 1 deployment."
  exit 0
fi

echo "Backend deployment not implemented yet."
exit 0

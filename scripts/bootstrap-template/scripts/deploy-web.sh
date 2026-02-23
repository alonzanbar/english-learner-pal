#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/deploy-web.sh <staging|prod>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV="${1:-}"

if [[ "$ENV" != "staging" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 <staging|prod>"
  exit 1
fi

cd "$REPO_ROOT/apps/web"
npm ci
npm run build

cd "$REPO_ROOT"
firebase use "$ENV"
firebase deploy --only hosting

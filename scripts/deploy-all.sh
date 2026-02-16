#!/usr/bin/env bash
set -euo pipefail

# Deploy web (always) and optionally backend.
# Usage: scripts/deploy-all.sh <staging|prod>
# Set DEPLOY_BACKEND=1 to also run deploy-backend.sh.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="${1:-}"

if [[ -z "$ENV" ]]; then
  echo "Usage: $0 <staging|prod>"
  exit 1
fi

"$SCRIPT_DIR/deploy-web.sh" "$ENV"

if [[ "${DEPLOY_BACKEND:-0}" == "1" ]]; then
  "$SCRIPT_DIR/deploy-backend.sh" "$ENV"
fi

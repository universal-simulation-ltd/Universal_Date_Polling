#!/usr/bin/env bash
# Launch a local preview of Universal Date Polling.
# Runs the dev server in the foreground — press Ctrl-C to stop.
# macOS/Linux equivalent of preview.ps1.
#
#   Usage:  ./scripts/preview.sh [port]      (default 5178)
#
# 5178 is this app's port in the registry (Docs_UNI_SIM/dev-preview.md).
# --strictPort means a port clash fails loudly instead of silently serving
# this app on another app's port.
# First run installs deps if node_modules is missing.

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PORT="${1:-5178}"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies (first run)…"
  npm install
fi

if [[ ! -f .env.local && ! -f .env ]]; then
  echo "WARNING: no .env.local — VITE_PLATFORM_SUPABASE_* will be undefined, so"
  echo "         the Supabase-backed features won't work. Copy .env.example to .env.local."
fi

echo "Universal Date Polling → http://localhost:$PORT"
exec npm run dev -- --port "$PORT" --strictPort

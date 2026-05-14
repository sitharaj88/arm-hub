#!/usr/bin/env bash
# Serve the production build at http://localhost:8080
set -e
PORT="${1:-8080}"
cd "$(dirname "$0")/.."
if [ ! -d "out" ]; then
  echo "out/ not found — run 'npm run build' first"
  exit 1
fi
echo "Serving out/ at http://localhost:$PORT"
echo "Open: http://localhost:$PORT/  (NOT file://)"
python3 -m http.server "$PORT" --directory out

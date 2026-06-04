#!/usr/bin/env bash
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$here/.tmp"
if [ ! -d "$here/node_modules/npm" ]; then
  npm install --no-audit --no-fund --silent
fi
SERVER_LOG="$here/.tmp/server.log"
nohup npx serve . --no-clipboard --listen 3000 > "$SERVER_LOG" 2>&1 &
echo "Server started in background."
echo "Container URL: http://localhost:3000/container.html"
echo "Logs: $SERVER_LOG"

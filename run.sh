#!/usr/bin/env bash
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
SERVER_LOG="$here/.tmp/server.log"
mkdir -p "$here/.tmp"
# Kill any previous instance on 8080 to avoid duplicate servers
if lsof -ti tcp:8080 >/dev/null 2>&1; then
  kill $(lsof -ti tcp:8080) >/dev/null 2>&1 || true
  sleep 1
fi
nohup python3 -m http.server 8080 --directory "$here" > "$SERVER_LOG" 2>&1 &
echo "Server started in background."
echo "Container URL: http://localhost:8080/container"
echo "Logs: $SERVER_LOG"

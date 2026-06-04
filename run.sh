#!/usr/bin/env bash
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$here/.tmp"
SERVER_LOG="$here/.tmp/server.log"
nohup python3 -m http.server 8080 --directory "$here" > "$SERVER_LOG" 2>&1 &
echo "Server started in background."
echo "Container URL: http://localhost:8080/container"
echo "Logs: $SERVER_LOG"

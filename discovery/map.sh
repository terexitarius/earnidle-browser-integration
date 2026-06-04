#!/usr/bin/env bash
set -euo pipefail
cd "$(cd "$(dirname "$0")" && pwd)/.."
printf '\nResource types:\n'
for f in docs/resources/*.md; do
  [ -f "$f" ] || continue
  echo "- $(basename "$f" .md)"
done
printf '\nWorker configs:\n'
find src/resources -maxdepth 2 -name '*.js' -o -name '*.ts' | sed 's|^|  - |'
printf '\nRoutes:\n'
sed -n '1,160p' src/resources/index.js 2>/dev/null | sed -n 's|\(app\.\(get\|post\|use\)\|router\.\(get\|post\)\).*|\0|p'

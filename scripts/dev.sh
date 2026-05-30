#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/tmp/astro-dev.log"

echo "=== Neon Auth Astro Demo — Dev Server ==="
echo "Logs: tail -f $LOG_FILE"
echo ""

npx astro dev 2>&1 | tee "$LOG_FILE"

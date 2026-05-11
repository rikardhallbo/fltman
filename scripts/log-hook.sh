#!/usr/bin/env bash
# Lit Workspace hook: forward hook payload to local server.
#
# Failsafe principles (from skeptic review):
# - Hard timeout on stdin read and POST (total < 800ms)
# - Always exit 0 (never block Claude Code)
# - Errors swallowed silently
#
# Install: add to .claude/settings.local.json with "async": true.
# Configure via env vars:
#   LIT_WORKSPACE_URL   — default http://127.0.0.1:7777
#   LIT_WORKSPACE_LOG   — optional file path to also append events to
set +e

EVENT_NAME="${1:-unknown}"
SERVER_URL="${LIT_WORKSPACE_URL:-http://127.0.0.1:7777}"
LOG_FILE="${LIT_WORKSPACE_LOG:-}"

PAYLOAD=$(timeout 0.3 cat 2>/dev/null)
[ -z "$PAYLOAD" ] && PAYLOAD='{}'

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ 2>/dev/null || date -u +%Y-%m-%dT%H:%M:%SZ)

ENVELOPE=$(printf '{"hook":"%s","ts":"%s","cwd":"%s","payload":%s}' \
  "$EVENT_NAME" "$TIMESTAMP" "${PWD//\"/\\\"}" "$PAYLOAD")

if [ -n "$LOG_FILE" ]; then
  mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null
  printf '%s\n' "$ENVELOPE" >> "$LOG_FILE" 2>/dev/null
fi

timeout 0.4 curl --silent --output /dev/null \
  --max-time 0.4 \
  -X POST "$SERVER_URL/events" \
  -H 'Content-Type: application/json' \
  --data-raw "$ENVELOPE" 2>/dev/null &

exit 0

#!/usr/bin/env bash
# Spike hook: log full hook payload to JSONL for analysis.
#
# Failsafe principles (from skeptic review):
# - 500ms hard timeout on stdin read
# - Always exit 0 (never block Claude Code)
# - Errors swallowed silently to /dev/null
#
# Usage in settings.json:
#   "command": "/abs/path/to/log-hook.sh <EVENT_NAME>"

set +e

EVENT_NAME="${1:-unknown}"
LOGDIR="${SPIKE_LOG_DIR:-$HOME/.claude/spike-logs}"
mkdir -p "$LOGDIR" 2>/dev/null

LOGFILE="$LOGDIR/$(date +%Y%m%d).jsonl"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ 2>/dev/null || date -u +%Y-%m-%dT%H:%M:%SZ)

# Read stdin with timeout — Claude Code passes the hook payload as JSON on stdin.
# If it takes too long or stdin is empty, we still log a stub line so we know the hook fired.
PAYLOAD=$(timeout 0.4 cat 2>/dev/null)
if [ -z "$PAYLOAD" ]; then
  PAYLOAD='{"_note":"empty or timed-out stdin"}'
fi

# Emit one JSONL line. The outer envelope is our own; payload is whatever Claude Code sent.
printf '{"_ts":"%s","_hook":"%s","_pid":%d,"_args":%s,"payload":%s}\n' \
  "$TIMESTAMP" \
  "$EVENT_NAME" \
  "$$" \
  "$(printf '%s' "$*" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))' 2>/dev/null || echo '"unknown"')" \
  "$PAYLOAD" \
  >> "$LOGFILE" 2>/dev/null

exit 0

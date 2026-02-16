#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/playwright-login.sh \
    --url https://example.com/login \
    --username user@example.com \
    --password 'secret' \
    --user-ref e1 \
    --pass-ref e2 \
    --submit-ref e3 \
    [--session login-flow] \
    [--headed]

Description:
  Runs a login workflow with Playwright CLI wrapper:
  1) open page
  2) snapshot
  3) fill username
  4) fill password
  5) click submit
  6) snapshot
EOF
}

URL=""
USERNAME=""
PASSWORD=""
USER_REF=""
PASS_REF=""
SUBMIT_REF=""
SESSION="login-flow"
HEADED="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url)
      URL="${2:-}"
      shift 2
      ;;
    --username)
      USERNAME="${2:-}"
      shift 2
      ;;
    --password)
      PASSWORD="${2:-}"
      shift 2
      ;;
    --user-ref)
      USER_REF="${2:-}"
      shift 2
      ;;
    --pass-ref)
      PASS_REF="${2:-}"
      shift 2
      ;;
    --submit-ref)
      SUBMIT_REF="${2:-}"
      shift 2
      ;;
    --session)
      SESSION="${2:-}"
      shift 2
      ;;
    --headed)
      HEADED="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

required=("$URL" "$USERNAME" "$PASSWORD" "$USER_REF" "$PASS_REF" "$SUBMIT_REF")
for value in "${required[@]}"; do
  if [[ -z "$value" ]]; then
    echo "Missing required args. Run with --help." >&2
    exit 1
  fi
done

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is required but not found on PATH." >&2
  exit 1
fi

CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
PWCLI="${PWCLI:-$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh}"

if [[ ! -x "$PWCLI" ]]; then
  echo "Error: Playwright wrapper not found/executable at: $PWCLI" >&2
  exit 1
fi

run_pwcli() {
  "$PWCLI" --session "$SESSION" "$@"
}

echo "Opening login page..."
if [[ "$HEADED" == "true" ]]; then
  run_pwcli open "$URL" --headed
else
  run_pwcli open "$URL"
fi

echo "Taking initial snapshot (use this output to verify refs)..."
run_pwcli snapshot

echo "Filling username..."
run_pwcli fill "$USER_REF" "$USERNAME"

echo "Filling password..."
run_pwcli fill "$PASS_REF" "$PASSWORD" >/dev/null

echo "Submitting login form..."
run_pwcli click "$SUBMIT_REF"

echo "Taking post-login snapshot..."
run_pwcli snapshot

echo "Done. Session: $SESSION"

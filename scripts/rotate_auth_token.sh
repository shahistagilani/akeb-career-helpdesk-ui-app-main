#!/usr/bin/env bash
#
# rotate_token.sh
#
# Fetches a fresh auth token from the MetroLeads token API (returned as a
# raw string, not JSON), builds the Basic-auth header value (base64 of
# "username:token"), and exposes it via GITHUB_OUTPUT for a downstream
# workflow step to store as a secret.
#
# Required environment variables:
#   AUTH_PROVIDER_USERNAME  - MetroLeads username
#   AUTH_PROVIDER_PASSWORD  - current password/token used to authenticate
#                             the token-issuing call itself
#
# Output (via $GITHUB_OUTPUT):
#   basic_auth_value        - base64("username:new_token"), ready to use
#                              as `Authorization: Basic <value>`
#
set -euo pipefail

readonly AUTH_ENDPOINT="https://api.metroleads.com/auth/issue_token"

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------

fail() {
  echo "::error::$1"
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command '$1' is not installed on this runner."
}

require_env() {
  local var_name="$1"
  if [[ -z "${!var_name:-}" ]]; then
    fail "Required environment variable '$var_name' is not set."
  fi
}

require_command curl
require_command base64

require_env AUTH_PROVIDER_USERNAME
require_env AUTH_PROVIDER_PASSWORD

if [[ -z "${GITHUB_OUTPUT:-}" ]]; then
  fail "GITHUB_OUTPUT is not set — this script must run inside a GitHub Actions step."
fi

# ---------------------------------------------------------------------------
# Step 1: Request a new token
# ---------------------------------------------------------------------------

http_status=$(curl -sS --get "$AUTH_ENDPOINT" \
  --data-urlencode "username=${AUTH_PROVIDER_USERNAME}" \
  --data-urlencode "password=${AUTH_PROVIDER_PASSWORD}" \
  --max-time 15 \
  --retry 2 \
  --retry-delay 3 \
  -o /tmp/token_response.txt \
  -w '%{http_code}') || fail "curl request to MetroLeads token API failed to complete."

if [[ "$http_status" != "200" ]]; then
  rm -f /tmp/token_response.txt
  fail "MetroLeads token API returned HTTP $http_status (expected 200). Check credentials and endpoint."
fi

# The API returns the token as a raw string body — strip any trailing
# newline/whitespace curl may have captured, but otherwise use it as-is.
new_token="$(tr -d '[:space:]' < /tmp/token_response.txt)"
rm -f /tmp/token_response.txt

if [[ -z "$new_token" ]]; then
  fail "MetroLeads token API returned an empty response body."
fi

# Mask the raw token immediately so it never appears unredacted in logs,
# even before we've built the final header value.
echo "::add-mask::${new_token}"

# ---------------------------------------------------------------------------
# Step 2: Build the Basic auth header value
# ---------------------------------------------------------------------------

basic_auth_value="$(printf '%s:%s' "${AUTH_PROVIDER_USERNAME}" "${new_token}" | base64 -w 0)"

if [[ -z "$basic_auth_value" ]]; then
  fail "Failed to construct base64-encoded Basic auth value."
fi

echo "::add-mask::${basic_auth_value}"

# ---------------------------------------------------------------------------
# Step 3: Emit output for the workflow
# ---------------------------------------------------------------------------

echo "basic_auth_value=${basic_auth_value}" >> "$GITHUB_OUTPUT"
echo "Token rotation succeeded."

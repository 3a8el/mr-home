#!/usr/bin/env bash
# Deploy changed production files to Hostinger over SSH.
# Usage: ./deploy.sh  (requires deploy.conf — copy deploy.conf.example and fill in)
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f deploy.conf ]; then
  echo "Missing deploy.conf — copy deploy.conf.example to deploy.conf and fill in your values." >&2
  exit 1
fi
source deploy.conf

MARKER=.last-deploy
PROD_PATHS=(index.html robots.txt sitemap.xml css js pages assets data)

SSH="ssh -i $SSH_KEY -p $SSH_PORT $SSH_HOST"

if [ ! -f "$MARKER" ]; then
  echo "No deploy marker found — doing a full sync of tracked production files."
  CHANGED=$(git ls-files "${PROD_PATHS[@]}")
  DELETED=""
else
  LAST=$(cat "$MARKER")
  CHANGED=$(git diff --name-only --diff-filter=ACMR "$LAST" HEAD -- "${PROD_PATHS[@]}")
  DELETED=$(git diff --name-only --diff-filter=D "$LAST" HEAD -- "${PROD_PATHS[@]}")
fi

if [ -z "$CHANGED" ] && [ -z "$DELETED" ]; then
  echo "Nothing to deploy — already up to date."
  exit 0
fi

if [ -n "$CHANGED" ]; then
  echo "Uploading:"
  echo "$CHANGED" | sed 's/^/  /'
  echo "$CHANGED" | tar -czf - -T - | $SSH "mkdir -p $REMOTE_ROOT && tar -xzf - -C $REMOTE_ROOT"
fi

if [ -n "$DELETED" ]; then
  echo "Removing from server:"
  echo "$DELETED" | sed 's/^/  /'
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    $SSH "rm -f '$REMOTE_ROOT/$f'"
  done <<< "$DELETED"
fi

git rev-parse HEAD > "$MARKER"
echo "Deployed. Marker updated to $(cat "$MARKER")"

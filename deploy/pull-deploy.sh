#!/bin/bash
#
# Pull-based deploy for the rcpedia site.
#
# The GitHub Actions workflow (.github/workflows/pipeline.yml) builds the site and
# force-pushes it to a per-environment branch: QA -> deploy-qa, main -> deploy-main.
# This script runs from cron on the `rcpediaq` cPanel account, fetches those branches
# over outbound HTTPS (the Stanford firewall blocks the old inbound SSH deploy), and
# rsyncs them into the docroots. See deploy/README.md for setup.
#
set -euo pipefail
REPO="https://github.com/gsbdarc/rcpedia.git"

deploy() {
  local branch="$1"
  local docroot="$2"
  local src="$HOME/deploy/src-$branch"
  local marker="$HOME/deploy/.deployed-$branch"

  [ -d "$docroot" ] || { echo "SKIP: docroot $docroot missing"; return 0; }

  # Skip cleanly if the deploy branch doesn't exist yet (e.g. before prod rollout).
  if ! git ls-remote --exit-code --heads "$REPO" "$branch" >/dev/null 2>&1; then
    echo "SKIP: remote branch $branch not found"; return 0
  fi

  if [ ! -d "$src/.git" ]; then
    git clone --branch "$branch" --single-branch --depth 1 "$REPO" "$src"
  fi
  cd "$src"
  git fetch --depth 1 origin "$branch"
  git reset --hard FETCH_HEAD >/dev/null
  local sha
  sha="$(git rev-parse HEAD)"

  # Deploy when this commit hasn't been deployed yet (marker missing or stale) —
  # a marker (not HEAD-vs-remote) is required so the FIRST run after a fresh clone,
  # where HEAD already equals the tip, still deploys.
  if [ -f "$marker" ] && [ "$(cat "$marker")" = "$sha" ]; then
    return 0
  fi

  # One-generation backup of the live docroot for instant rollback.
  if [ -n "$(ls -A "$docroot" 2>/dev/null)" ]; then
    rm -rf "$HOME/deploy/prev-$branch"
    cp -a "$docroot" "$HOME/deploy/prev-$branch"
  fi
  # --delay-updates: stage new files, flip them in together at the end (near-atomic)
  # --delete-after: remove stale files AFTER transfers, never before their replacement
  #                 (--delete-after works on older rsync; --delete-delayed needs rsync 3.0+)
  rsync -a --delay-updates --delete-after --exclude='.git' "$src/" "$docroot/"
  echo "$sha" > "$marker"
  echo "$(date) deployed $branch@$sha -> $docroot"
}

deploy deploy-qa   "$HOME/rcpedia-dev.stanford.edu"
deploy deploy-main "$HOME/rcpedia.stanford.edu"

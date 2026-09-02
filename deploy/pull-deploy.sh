#!/bin/bash
#
# Pull-based deploy for the rcpedia site.
#
# The GitHub Actions workflow (.github/workflows/pipeline.yml) builds the site and
# force-pushes it to a per-environment branch: QA -> deploy-qa, main -> deploy-main.
# This script runs from cron on the `rcpediaq` cPanel account and syncs those branches
# into the docroots. See deploy/README.md for setup.
#
# It fetches tarballs from codeload.github.com instead of using git, because this host
# cannot reach github.com or api.github.com -- outbound connections to the GitHub IP
# ranges those resolve to time out, while codeload.github.com stays reachable. The old
# git-based version reported that outage as "remote branch not found" and exited 0, so
# the site silently stopped updating. See issue #268.
#
set -euo pipefail

CODELOAD="https://codeload.github.com/gsbdarc/rcpedia/tar.gz/refs/heads"

# A file every build produces. Checked before syncing, because --delete-after means
# syncing a truncated or unexpected extract would strip the live docroot.
SENTINEL="index.html"

# curl budgets are deliberately tight. Cron runs this every 5 minutes under `flock -n`,
# which exits silently when the lock is held -- so a run that outlives its interval makes
# every later run a silent no-op. Worst case here is ~25s per branch for the HEAD and
# ~245s for a failing download, and the cron line wraps the script in `timeout` as a
# backstop. Do not raise these without re-checking that total against the interval.

# Every line this script emits is timestamped. External stderr (curl, tar, rsync) is
# captured and reported through err() rather than allowed to land in the log bare --
# an untimestamped failure is nearly useless when you are trying to work out when the
# pulls started failing.
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*"; }
err() { log "ERROR: $*" >&2; }

deploy() {
  local branch="$1"
  local docroot="$2"
  local marker="$HOME/deploy/.deployed-$branch"
  local work="$HOME/deploy/work-$branch"
  local tarball="$work/site.tar.gz"
  local extract="$work/extract"

  [ -d "$docroot" ] || { err "docroot $docroot missing"; return 1; }

  # Change detection: a HEAD returns the archive's ETag (a content hash) and no body,
  # so this costs one small request per branch regardless of how big the site is.
  # api.github.com would be the obvious way to read the branch SHA, but it is blocked.
  local hdrs errf code etag
  hdrs="$work/head.txt"
  errf="$work/curl.err"
  mkdir -p "$work"
  code="$(curl -sS --location --max-time 10 --retry 1 --retry-delay 3 \
            --head --dump-header "$hdrs" --output /dev/null \
            --write-out '%{http_code}' "$CODELOAD/$branch" 2>"$errf" || echo 000)"
  # --retry makes curl emit --write-out once per attempt, so three failures arrive
  # concatenated as "000000000". Keep the last attempt's code.
  code="${code: -3}"

  case "$code" in
    200) ;;
    404)
      # Benign: the branch does not exist yet (e.g. before a prod rollout).
      log "skip: branch $branch does not exist"
      return 0
      ;;
    000)
      err "cannot reach codeload.github.com for $branch -- network failure, not a missing branch: $(tr '\n' ' ' < "$errf")"
      return 1
      ;;
    *)
      err "unexpected HTTP $code from codeload for $branch"
      return 1
      ;;
  esac

  etag="$(awk 'tolower($1) == "etag:" { gsub(/[\r"]/, "", $2); print $2 }' "$hdrs" | tail -1)"
  [ -n "$etag" ] || { err "no ETag in codeload response for $branch"; return 1; }

  if [ -f "$marker" ] && [ "$(cat "$marker")" = "$etag" ]; then
    return 0
  fi

  log "deploying $branch ($etag)"
  rm -rf "$extract" "$tarball"
  mkdir -p "$extract"

  curl -sS --fail --location --max-time 120 --retry 1 --retry-delay 3 \
       --output "$tarball" "$CODELOAD/$branch" 2>"$errf" \
    || { err "download failed for $branch: $(tr '\n' ' ' < "$errf")"; return 1; }
  tar -xzf "$tarball" -C "$extract" --strip-components=1 2>"$errf" \
    || { err "could not extract the $branch tarball: $(tr '\n' ' ' < "$errf")"; return 1; }

  [ -f "$extract/$SENTINEL" ] \
    || { err "$branch extract has no $SENTINEL -- refusing to sync it into $docroot"; return 1; }

  # One-generation backup of the live docroot for instant rollback.
  if [ -n "$(ls -A "$docroot" 2>/dev/null)" ]; then
    rm -rf "$HOME/deploy/prev-$branch"
    cp -a "$docroot" "$HOME/deploy/prev-$branch"
  fi
  # --delay-updates: stage new files, flip them in together at the end (near-atomic)
  # --delete-after: remove stale files AFTER transfers, never before their replacement
  #                 (--delete-after works on older rsync; --delete-delayed needs rsync 3.0+)
  rsync -a --delay-updates --delete-after --exclude='.git' "$extract/" "$docroot/" 2>"$errf" \
    || { err "rsync into $docroot failed: $(tr '\n' ' ' < "$errf")"; return 1; }

  echo "$etag" > "$marker"
  log "deployed $branch ($etag) -> $docroot"
  rm -rf "$tarball" "$extract" "$errf"
}

# Run both environments even if one fails, but exit non-zero if either did, so a real
# outage shows up as a failed cron job instead of passing silently.
status=0
deploy deploy-qa   "$HOME/rcpedia-dev.stanford.edu" || status=1
deploy deploy-main "$HOME/rcpedia.stanford.edu"     || status=1
exit "$status"

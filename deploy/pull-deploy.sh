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

# This host has no working route to Azure IP space, and GitHub's newer ranges live
# there: 172.182.0.0/16 and 20.29.128.0/17 time out 100% of the time, while GitHub's
# own ASN ranges below route fine. codeload.github.com resolves into all three
# depending on which resolver answers, so plain DNS reaches it only about one attempt
# in three -- which is what made deploys take hours. See README for the measurements.
REACHABLE_PREFIXES="140.82. 185.199."
CODELOAD_FALLBACK_IPS="140.82.116.10 140.82.116.9 140.82.114.10 140.82.112.10"

# Set by pick_codeload(): either empty (use DNS) or a --resolve argument.
RESOLVE=""

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

# Codeload addresses this host can actually route to. The DoH lookup is opportunistic:
# it often returns an Azure address that gets filtered out here, so in practice the
# static list carries it -- but the lookup means a newly rotated 140.82/185.199 address
# is picked up without editing this file. If every candidate stops working, GitHub has
# moved codeload off its own ASN and CODELOAD_FALLBACK_IPS needs updating; the error
# from pick_codeload() says so.
codeload_candidates() {
  local ips out="" ip pfx
  ips="$(curl -sS --connect-timeout 5 --max-time 8 \
          'https://dns.google/resolve?name=codeload.github.com&type=A' 2>/dev/null \
          | tr ',' '\n' | sed -n 's/.*"data":"\([0-9.]*\)".*/\1/p')"
  for ip in $ips $CODELOAD_FALLBACK_IPS; do
    for pfx in $REACHABLE_PREFIXES; do
      case "$ip" in "$pfx"*) out="$out $ip" ;; esac
    done
  done
  echo $out | tr ' ' '\n' | awk 'NF && !seen[$0]++'
}

# Choose a codeload endpoint this host can reach, and pin to it.
#
# Pinning comes FIRST and a plain-DNS probe is only the last resort. That ordering is
# load-bearing: codeload returns a different address on every lookup, rotating across
# GitHub's own ASN and two Azure ranges this host cannot route to. So a plain probe
# proves nothing -- it can succeed, leave the requests unpinned, and then every actual
# request draws a fresh address with a ~2/3 chance of being unroutable. That is exactly
# how the first version of this passed its own check and then failed both deploys.
pick_codeload() {
  local ip
  for ip in $(codeload_candidates); do
    if curl -sS -o /dev/null --connect-timeout 5 --max-time 5 \
         --resolve "codeload.github.com:443:$ip" https://codeload.github.com/ 2>/dev/null; then
      RESOLVE="--resolve codeload.github.com:443:$ip"
      log "codeload: pinned to $ip"
      return 0
    fi
  done

  # No candidate reachable. Unpinned is a gamble on DNS returning a routable address,
  # but it is better than not trying, and it is the path that keeps working if GitHub
  # moves codeload off the addresses listed above.
  if curl -sS -o /dev/null --connect-timeout 5 --max-time 5 \
       https://codeload.github.com/ 2>/dev/null; then
    RESOLVE=""
    log "codeload: no candidate IP reachable, falling back to unpinned DNS (may be flaky)"
    return 0
  fi

  err "codeload.github.com unreachable by every candidate IP and by DNS"
  return 1
}

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
            --write-out '%{http_code}' $RESOLVE "$CODELOAD/$branch" 2>"$errf" || echo 000)"
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
       --output "$tarball" $RESOLVE "$CODELOAD/$branch" 2>"$errf" \
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
pick_codeload || exit 1
deploy deploy-qa   "$HOME/rcpedia-dev.stanford.edu" || status=1
deploy deploy-main "$HOME/rcpedia.stanford.edu"     || status=1
exit "$status"

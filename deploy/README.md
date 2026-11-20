# Deployment (pull-based)

The rcpedia site is **pulled** onto the Stanford host, not pushed.

## Why

The old pipeline pushed the built site **inbound over SSH/rsync (port 22)** from GitHub's
cloud runners to the host. A Stanford firewall change now blocks inbound SSH from GitHub's
runner IP ranges, and the provider won't allowlist. So we invert the flow: GitHub publishes
the built site to a branch, and the host pulls it.

## Why tarballs and not git

This host has **no working route to Azure IP space**, and GitHub's newer address ranges
live there. Measured from `stanford01` on 2026-09-02:

| Target | Range | Result |
|---|---|---|
| `github.com` → 172.182.252.133 | `172.182.0.0/16` (Azure) | times out, 100% |
| `api.github.com` → 172.182.252.137 | `172.182.0.0/16` (Azure) | times out, 100% |
| pinned 20.29.134.23 | `20.29.128.0/17` (Azure) | times out |
| pinned 140.82.121.4 | `140.82.112.0/20` (GitHub ASN) | **200** |
| `raw.githubusercontent.com` → 185.199.111.133 | `185.199.108.0/22` (GitHub ASN) | **works** |
| `login.microsoftonline.com` → 20.190.190.193 | Azure | times out |
| `management.azure.com` → 4.150.240.10 | Azure | times out |
| `www.microsoft.com` → 23.45.137.206 | Akamai CDN | **200** |
| `example.com`, `pypi.org`, `www.stanford.edu` | — | **all fine** |

So general outbound HTTPS is healthy, Microsoft properties on CDNs are fine, and only
Azure-hosted addresses fail. This is not GitHub-specific; GitHub is collateral damage.

`codeload.github.com` resolves into all three ranges depending on which resolver answers
(1.1.1.1 → 172.182.x, 8.8.8.8 → 140.82.x, 9.9.9.9 → 20.29.x), so plain DNS reaches it
only about one attempt in three. That is why deploys appeared to hang for hours and then
suddenly succeed — the 2026-09-02 QA deploy took roughly two hours of failed cron runs
before one drew a routable address.

Two consequences for this script:

1. **Tarballs, not git.** `git` needs `github.com`, which is unreachable. `codeload` serves
   branch archives and lives (sometimes) in a routable range. Change detection uses the
   archive `ETag` from a `HEAD` request, because reading the branch SHA from
   `api.github.com` is not possible from here.
2. **Pin to a routable address.** `pick_codeload()` tries plain DNS first, so nothing is
   pinned on a healthy network and the script self-heals if the routing is ever fixed. If
   that fails it pins to a candidate in `140.82.112.0/20` via `curl --resolve`, logging
   `codeload: DNS address unreachable, pinned to <ip>`.

Reclaim is not expected to change this, so the pinning is the durable fix rather than a
stopgap. If GitHub ever moves codeload off its own ASN entirely, every candidate will fail
and `pick_codeload()` will say so; `CODELOAD_FALLBACK_IPS` then needs new addresses.

The git-based predecessor reported all of this as `SKIP: remote branch not found` and
exited 0, so cron stayed green while the site silently went stale. See issue #268.

## How it works

1. `.github/workflows/pipeline.yml` builds the site on every push to `main`/`QA`, then
   force-pushes the built `site/` to a per-environment branch with `ghp-import`:
   - `QA`  → `deploy-qa`
   - `main` → `deploy-main`
2. A cron job on the **`rcpediaq`** cPanel account runs [`pull-deploy.sh`](pull-deploy.sh),
   which downloads the deploy branch as a tarball from `codeload.github.com` (public repo, no
   token) and rsyncs it into the docroot, keeping a one-generation backup for rollback:
   - `deploy-qa`   → `~/rcpedia-dev.stanford.edu`  → https://rcpedia-dev.stanford.edu
   - `deploy-main` → `~/rcpedia.stanford.edu`      → https://rcpedia.stanford.edu

This file is the source of truth for the script. It lives under `deploy/` (outside `docs/`),
so it is never built into the site or included in the `deploy-*` branches.

## One-time server setup (as `rcpediaq`, in cPanel Terminal)

```bash
mkdir -p ~/deploy
# copy pull-deploy.sh from this repo to ~/deploy/pull-deploy.sh, then:
chmod +x ~/deploy/pull-deploy.sh
bash ~/deploy/pull-deploy.sh    # first run: clones the deploy branches and populates docroots
```

Add a cron job in **cPanel → Cron Jobs** (every 5 minutes):

```
*/5 * * * * flock -n $HOME/deploy/.lock -c "timeout 270 /bin/bash $HOME/deploy/pull-deploy.sh" >> $HOME/deploy/deploy.log 2>&1
```

`flock -n` prevents overlapping runs, and `timeout 270` guarantees a run cannot outlive its
5-minute interval. Both matter: `flock -n` exits **silently** when the lock is held, so a run
that hangs past 5 minutes turns every subsequent run into a no-op that logs nothing. The old
git-based script had no timeouts at all and could wedge the lock indefinitely. If deploys stop
happening and the log is quiet, check for a stuck process first:

```bash
ps -u rcpediaq -o pid,etime,cmd | grep -E 'pull-deploy|curl' | grep -v grep
``` For an immediate deploy (e.g. right after a merge),
run `bash ~/deploy/pull-deploy.sh` manually — it is idempotent.

## Updating the script

The repo copy is canonical. When it changes, copy it to `~/deploy/pull-deploy.sh` on the
`rcpediaq` account. (The script changes rarely, so this manual sync is intentional; it can
be automated later with a self-updating server clone if needed.)

## What the log should look like

`~/deploy/deploy.log` gets one line per deploy and nothing on a no-op run:

```
2026-09-02 15:09:35 deploying deploy-qa (4c6abf62...)
2026-09-02 15:09:37 deployed deploy-qa (4c6abf62...) -> /home/rcpediaq/rcpedia-dev.stanford.edu
```

Failures are loud and exit non-zero, so a broken deploy shows up as a failed cron job:

- `ERROR: cannot reach codeload.github.com for <branch> -- network failure, not a missing branch`
- `ERROR: <branch> extract has no index.html -- refusing to sync it into <docroot>`
- `ERROR: docroot <path> missing`

A genuinely absent branch is the one benign case and stays quiet: `skip: branch <b> does not exist`.

The marker files `~/deploy/.deployed-<branch>` hold the archive **ETag**, not a commit SHA.
The first run after upgrading from the git-based script will therefore redeploy both
environments once, because the old markers contain SHAs that match no ETag. That is
harmless — it is the same full rsync as any other deploy. The old `~/deploy/src-*` git
clones are no longer used and can be deleted.

## Rollback

The live site is static files, so a bad build/cron never takes it down — only stops updates.

1. **Freeze:** disable the cron job in cPanel. The current docroot keeps serving.
2. **Instant undo (no rebuild):** restore the previous docroot from the backup the script keeps:
   ```bash
   rsync -a --delay-updates --delete-after ~/deploy/prev-deploy-qa/ ~/rcpedia-dev.stanford.edu/
   # (use prev-deploy-main / rcpedia.stanford.edu for prod)
   ```
3. **Forward-fix (normal path):** `git revert <bad-commit>` on `QA`/`main` and push; the
   pipeline rebuilds and republishes, and cron pulls it within ~5 min.

## Host constraints (for reference)

- **Inbound SSH is firewall-blocked** (a separate Stanford-side issue, #248), and outbound
  routing to Azure IP space is broken, which takes out `github.com` and `api.github.com`
  (see "Why tarballs and not git"). Note this also means Microsoft SSO endpoints such as
  `login.microsoftonline.com` are unreachable from this host.
- Long-lived processes are reaped on this shared host, so a persistent self-hosted runner is
  not viable — hence cron.
- Both docroots live on the single `rcpediaq` account (not a personal account like `astorers`).

# Deployment (pull-based)

The rcpedia site is **pulled** onto the Stanford host, not pushed.

## Why

The old pipeline pushed the built site **inbound over SSH/rsync (port 22)** from GitHub's
cloud runners to the host. A Stanford firewall change now blocks inbound SSH from GitHub's
runner IP ranges, and the provider won't allowlist. So we invert the flow: GitHub publishes
the built site to a branch, and the host pulls it.

## Why tarballs and not git

The host cannot reach `github.com` or `api.github.com` — outbound connections to the GitHub
IP ranges those resolve to time out. General outbound HTTPS is fine (`example.com` returns
200) and `codeload.github.com` is reachable, so specific GitHub ranges are being dropped,
not GitHub as a whole. Confirmed 2026-09-02 from `stanford01`:

| Host | Result |
|---|---|
| `example.com` | 200 |
| `github.com` (172.182.252.133, a published GitHub `/32`) | connection timed out |
| `api.github.com` | connection timed out |
| `codeload.github.com` | reachable |

`pull-deploy.sh` therefore fetches a branch tarball from `codeload.github.com` instead of
using `git clone`/`git fetch`. Change detection uses the archive's `ETag` from a `HEAD`
request — a content hash, stable per commit, and free of any body transfer — because reading
the branch SHA from `api.github.com` is not possible from this host.

The git-based version reported this outage as `SKIP: remote branch not found` and exited 0,
so cron stayed green while the site silently stopped updating. See issue #268. If the range
block is ever lifted, git would work again, but the tarball path needs no git on the host and
has fewer moving parts.

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
*/5 * * * * flock -n $HOME/deploy/.lock -c "/bin/bash $HOME/deploy/pull-deploy.sh" >> $HOME/deploy/deploy.log 2>&1
```

`flock -n` prevents overlapping runs. For an immediate deploy (e.g. right after a merge),
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

- **Inbound SSH is firewall-blocked**, and outbound HTTPS reaches `codeload.github.com` but
  not `github.com` / `api.github.com` (see "Why tarballs and not git").
- Long-lived processes are reaped on this shared host, so a persistent self-hosted runner is
  not viable — hence cron.
- Both docroots live on the single `rcpediaq` account (not a personal account like `astorers`).

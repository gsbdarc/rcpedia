# Deployment (pull-based)

The rcpedia site is **pulled** onto the Stanford host, not pushed.

## Why

The old pipeline pushed the built site **inbound over SSH/rsync (port 22)** from GitHub's
cloud runners to the host. A Stanford firewall change now blocks inbound SSH from GitHub's
runner IP ranges, and the provider won't allowlist. Outbound HTTPS from the host to GitHub
still works, so we invert the flow: GitHub publishes the built site to a branch, and the
host pulls it.

## How it works

1. `.github/workflows/pipeline.yml` builds the site on every push to `main`/`QA`, then
   force-pushes the built `site/` to a per-environment branch with `ghp-import`:
   - `QA`  → `deploy-qa`
   - `main` → `deploy-main`
2. A cron job on the **`rcpediaq`** cPanel account runs [`pull-deploy.sh`](pull-deploy.sh),
   which fetches the deploy branch over HTTPS (public repo, no token) and rsyncs it into the
   docroot, keeping a one-generation backup for rollback:
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

- Outbound HTTPS to GitHub works; **inbound SSH is firewall-blocked**.
- Long-lived processes are reaped on this shared host, so a persistent self-hosted runner is
  not viable — hence cron.
- Both docroots live on the single `rcpediaq` account (not a personal account like `astorers`).

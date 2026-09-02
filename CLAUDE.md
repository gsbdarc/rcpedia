# RCpedia

Documentation for the Yen research computing cluster at Stanford GSB, built with MkDocs
Material from Markdown in `docs/`. Published at https://rcpedia.stanford.edu.

Local setup, the build/serve commands, and the branch workflow are in `README.md` — read it
rather than guessing. In short: branch off `QA`, PR into `QA`, verify on
https://rcpedia-dev.stanford.edu, then `QA` → `main` for production.

## llms.txt

The site publishes [`/llms.txt`](https://llmstxt.org/) and `/llms-full.txt` so AI coding
agents read our actual current guidance instead of whatever they scraped at training time.
Researchers on the Yens work through these agents constantly, so a wrong or missing entry
turns into a support ticket.

**Both files are generated at build time** by the `mkdocs-llmstxt` plugin. Never hand-edit
anything under `site/` — it is regenerated on every build and is gitignored. The one place
to change is the `llmstxt:` block in `mkdocs.yml`.

### The rule

`llms.txt` is built from an explicit, hand-maintained list of pages under
`plugins → llmstxt → sections` in `mkdocs.yml`. It is **not** derived from `nav` and **not**
derived from the contents of `docs/`.

So: **any time you add, rename, or delete a page in `docs/`, make the matching change in that
`sections` list in the same commit.** A new blog post needs a line there too.

This is the "drift" the CI guard exists to catch — see below.

### Writing a description

Each entry is `path.md: description`. The description is not decoration: it is the only thing
a model reads when deciding which page to open, so a vague one causes a wrong answer.

- Say what the page *answers*, not what it is named. `_policies/security.md` is described as
  "Stanford data risk levels and whether high risk data (PHI, HIPAA, PII) may go on the Yens"
  because that is the question people actually arrive with.
- Include the terms someone would search for — machine names (`yen1-yen5`, `yen-slurm`), tool
  names, and real numbers (home is 80 GB, project space 1 TB faculty / 200 GB student).
- Don't restate the page title; the title is already the link text.
- Don't bake in facts that go stale faster than the description will be updated. Node counts
  are the usual trap.
- Blog posts get a `"YYYY-MM-DD - short gloss"` prefix, quoted so YAML doesn't parse the bare
  date as a date object. Blog content is useful but ages, and the date is how a model judges
  it. Where a title could misroute, say so — the Colab post is annotated "off-cluster, not the
  Yen GPUs" for exactly that reason.

Sections follow the *subgroups* in `nav`, not its four top-level tabs, so no single section is
long enough to be hard to scan. Pages may be listed in two sections when that genuinely helps
(`status.md` appears under both Getting Started and Troubleshooting).

### The CI guard

The plugin alone does not protect against drift: a renamed page produces only a warning (the
build still succeeds and the page silently disappears from `llms.txt`), and a page that was
never listed produces no message at all.

The **"Check llms.txt sections match docs/"** step in `.github/workflows/pipeline.yml` compares
the `sections` list against `docs/**/*.md` and fails the build if they disagree in either
direction. Passing prints `ok: all N pages are listed`. Failing names the offending files.

If it fails, fix the list — do not silence the check. The only deliberate exclusion is
`docs/index.md` (a `template: home.html` shell with no prose), and that is named in the script
with its reason. Add to `EXCLUDE` only for a page with genuinely nothing to serve.

Note the guard runs on pushes to `QA` and `main`, **not** on pull requests, so an unlisted page
will not be caught until the branch merges. Check the list yourself before opening a PR.

### Verifying a change

```bash
mkdocs build --clean          # site/llms.txt and site/llms-full.txt
mkdocs serve                  # then read http://localhost:8000/llms.txt
```

Worth doing after a substantive edit: hand the generated `llms.txt` to an agent with no other
context, ask it a few real Yens questions, and check where it routes. That is the actual
acceptance test — it caught several misleading descriptions that read fine in isolation.

## Deploying

Two things about the pipeline that are easy to get wrong:

- **`workflow_dispatch` on a feature branch publishes to PRODUCTION.** The publish step keys
  off `ref == refs/heads/QA ? deploy-qa : deploy-main`, so dispatching on anything that is not
  `QA` force-pushes that build to the live site. Never use it to test a branch.
- **CI does not run on pull requests** (`on: push` covers only `main` and `QA`), so workflow
  and dependency changes are first exercised after they merge to `QA`.

Deploy itself is pull-based: CI pushes the built site to a `deploy-qa` / `deploy-main` branch
and a cPanel cron rsyncs it into the docroot every ~5 min. See `deploy/README.md`.

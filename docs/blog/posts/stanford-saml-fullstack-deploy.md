---
date:
  created: 2026-07-30
categories:
    - SAML
    - Cloud
    - Deployment
    - Software
authors:
    - irina694
---

# Deploying a Full-Stack App with Stanford SSO

[**saml-fullstack-stanford**](https://github.com/gsbdarc/saml-fullstack-stanford){target="_blank"}
is a full-stack app template (Next.js frontend, FastAPI backend, SQLite)
with Stanford SSO (Single Sign-On) and workgroup-based access control
already built in. Instead of implementing SAML yourself, you could clone
the repo, deploy it as-is to get a working Stanford-authenticated app, then
swap in your own frontend/backend/database code — the auth layer comes
along for free. This blog walks through the full deployment process,
including Stanford SSO and Workgroup configuration, using the repo's
[GCP deployment guide](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md){target="_blank"}
as the example — an equivalent
[AWS deployment guide](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-aws.md){target="_blank"}
exists if that's the preferred cloud instead.

Stanford login on a custom app normally means implementing SAML (Security
Assertion Markup Language) — the standard protocol universities and
companies use to let one login work across many separate applications.
Implementing it means standing up a Service Provider (SP) that exchanges
signed assertions with Stanford's Identity Provider (IdP, the system behind
Stanford login), then layering Stanford's workgroup-based authorization
model on top to control who's actually allowed to use the app.

!!! info "Who This Is For"
    Anyone who wants to deploy a full-stack app behind Stanford login,
    restricted to "Stanford members of workgroup X," on Stanford-affiliated
    AWS or GCP infrastructure. You should be comfortable with the terminal
    and git — no prior experience with SAML, Shibboleth, or Stanford's IdP
    is assumed; this guide introduces each piece as it comes up.

<!-- more -->

## What's Included

- **Authentication** through the Stanford Identity Provider (IdP) —
  the deployed app authenticates people via Stanford SSO itself; local
  development uses a mock identity so testing doesn't require a real
  Stanford login
- **Authorization** scoped to a [Workgroup](https://workgroup.stanford.edu){target="_blank"}
  — access can be restricted to a specific group of Stanford users, not
  just anyone with a valid Stanford login
- **A Next.js frontend and FastAPI backend**, meant to be replaced with
  app-specific logic while the auth layer stays intact
- **SQLite as the persistent database** — a simple default, wired up via
  SQLAlchemy so it can be swapped for another database (e.g. Postgres) as
  the app's needs grow (see Step 5)
- **[Terraform](https://developer.hashicorp.com/terraform){target="_blank"}** — a tool that
  creates cloud infrastructure from a text file instead of clicking through
  a cloud console — for a single-VM deployment (AWS or GCP), with TLS via
  Let's Encrypt

![Architecture diagram: browser sends HTTPS traffic through Stanford login to a Shibboleth sidecar (Apache + mod_shib) that terminates Stanford SAML, enforces the workgroup at the proxy, and injects trusted identity headers, routing / to the Next.js frontend and /api to the FastAPI backend, which persists to SQLite](/assets/images/saml-fullstack-architecture.jpg)

[Shibboleth](https://www.shibboleth.net/){target="_blank"} is the standard open-source
software for speaking SAML as a Service Provider; `mod_shib` is its Apache
module. It runs here as a sidecar container in front of the app: it's the
only thing that talks to Stanford's IdP, and the only thing that can set the
identity headers (`X-Remote-User`, `X-Entitlement`) the app trusts — Apache
strips any copies of those headers a client tries to send itself. The
app's own code never has to speak SAML; it just reads a header it knows is
authentic.

!!! note "Template, Not a Hosted Service"
    There's no shared Stanford instance. Each deployment is a separate clone,
    deployed to its own AWS/GCP project, registered as its own SAML Service
    Provider.

## Prerequisites

1. **A terminal and git**, both on your local computer — this guide is
   entirely command-line driven: cloning the repo, running Terraform, and
   SSHing into the deployed server all happen from a terminal.
2. **A Stanford Workgroup** — [workgroup.stanford.edu](https://workgroup.stanford.edu){target="_blank"}
   is Stanford's tool for managing named groups of SUNet IDs. Create one (or
   use an existing one) to define who's allowed to use the app. It must be
   non-personal — owned by a department or team stem, not created under your
   own SUNet ID — SPDB (Step 4) rejects personal workgroups.
3. **AWS or GCP credentials**, plus
   [Terraform](https://developer.hashicorp.com/terraform){target="_blank"} ≥ 1.5 installed
   locally — this provisions the cloud VM. This guide assumes the AWS or
   GCP account is a Stanford-affiliated one obtained through
   [Cardinal Cloud](https://uit.stanford.edu/cardinal-cloud#section_810){target="_blank"},
   Stanford's supported path to cloud accounts.
4. **A DNS name** you control, to point at the deployed VM
   (e.g. `myapp.stanford.edu`).
5. **Docker**, for local development.

## Result

Here's what you'll have running by the end of this guide: a live,
Stanford-authenticated app enforcing workgroup access.

| Route | Access |
|-------|--------|
| `/` | Any authenticated Stanford user |
| `/api/me` | Any authenticated Stanford user (own identity) |
| `/api/hello` | Members of the configured workgroup only (403 otherwise) |

A member of the configured workgroup logs in through Stanford SSO (including
Duo) and sees their identity and workgroup membership reflected back, with
access to the workgroup-protected endpoint:

![Stanford SAML Hello World app, showing a logged-in user's identity, workgroup membership, and access to the workgroup-protected endpoint](/assets/images/saml-fullstack-workgroup-hello.png){ width="500" }

Non-members who have a Stanford login can still authenticate and see their
own identity — the Stanford login wall applies to everyone — but the
workgroup-protected endpoint returns a 403 with an unauthorized message
instead of the protected content:

![Stanford SAML Hello World app, showing a logged-in user who is authenticated but not a member of the required workgroup, denied access to the workgroup-protected endpoint with a 403](/assets/images/saml-fullstack-non-member-denied.png){ width="500" }

## Step 1 — Run It Locally

Everything in this step happens on your local computer — no cloud
resources exist yet. No Stanford credentials are needed either: a dev
nginx container mocks the identity headers the real Shibboleth proxy
sends, exercising the actual auth/authorization code against a fake
identity:

```title="Terminal Command"
git clone https://github.com/gsbdarc/saml-fullstack-stanford.git
cd saml-fullstack-stanford
cp .env.example .env
docker compose -f docker-compose.dev.yml up --build
# Then visit http://localhost:8080 in your browser
```

This shows a mock user, their mock workgroups, and a visit counter backed
by SQLite. To see the rejected-user path, restart with a mismatched
workgroup:

```title="Terminal Command"
DEV_ENTITLEMENT="stanford:not-my-group" \
  docker compose -f docker-compose.dev.yml up --build
```

Confirming which routes require login vs. workgroup membership here — before
DNS, TLS, or Stanford's IdP are involved — is faster to iterate on.

## Step 2 — Get a Hostname You Control

No terminal needed for this step — it's done in a web dashboard. The app
needs a hostname with a plain DNS **A record** pointing directly at a
server you control — not a platform that fronts your content for you,
since the app itself must answer the Stanford SSO handshake.
[Stanford Domains](https://domains.stanford.edu){target="_blank"} issues `[name].su.domains`
names and, via its **Zone Editor**, gives real A-record control over that
subdomain — that's the easiest option if you don't already have a hostname
to use. Whatever you pick becomes `APP_HOSTNAME` everywhere downstream: the
certificate, the SAML identity, the URL people type. (The A record itself
gets pointed at the server's IP in Step 3, once that IP exists.)

## Step 3 — Deploy to GCP

The full walkthrough — with exact commands, expected output, and
troubleshooting — lives in
[docs/deployment-guide-gcp.md](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#deploying-to-gcp){target="_blank"}.
(An equivalent
[AWS guide](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-aws.md){target="_blank"}
exists if that's the preferred cloud instead.) What follows is what each of
its 8 steps accomplishes and where it runs — everything happens on your
local terminal unless noted otherwise; Terraform talks to GCP's API
remotely, and the server it creates never has Terraform installed on it.
Cost is small: roughly $15–17/month for an always-on `e2-small` VM plus a
persistent disk.

- [**Guide Step 1 — GCP credentials**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-1--gcp-credentials-for-terraform){target="_blank"} —
  authenticate the `gcloud` CLI for console access, and separately grant
  Terraform its own credentials to talk to the GCP project.
- [**Guide Step 2 — SSH keys**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-2--ssh-keys-for-the-team){target="_blank"} —
  each person deploying generates their own keypair; the public half gets
  baked into the VM so they can log in later.
- [**Guide Step 3 — Deploy key**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-3--deploy-key-private-repos-only){target="_blank"}
  *(private repos only)* — a read-only GitHub key, registered on the
  GitHub website, so the VM can clone the repo at boot.
- [**Guide Step 4 — Configure**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-4--configure){target="_blank"} —
  copy `terraform.tfvars.example` to `terraform.tfvars` and fill in the
  project, hostname (a placeholder is fine for now), SSH key(s), and
  Let's Encrypt email. TLS and the workgroup requirement stay off until
  later steps.
- [**Guide Step 5 — Create the server**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-5--create-the-server){target="_blank"} —
  `terraform apply` provisions the VM. Note the `public_ip` output and
  confirm the app answers over HTTPS with a self-signed cert.
- [**Guide Step 6 — Point DNS at the server**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-6--point-dns-at-the-server){target="_blank"}
  *(DNS provider's web dashboard, e.g. Stanford Domains' Zone Editor from
  Step 2)* — create the A record for the hostname and wait for it to
  resolve to `public_ip`.
- [**Guide Step 7 — Get a real TLS certificate**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-7--get-a-real-tls-certificate){target="_blank"} —
  flip `enable_letsencrypt` on and re-apply; this recreates the VM (the
  data disk and static IP persist) with a real Let's Encrypt certificate.
- [**Guide Step 8 — Connect Stanford SSO**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/deployment-guide-gcp.md#step-8--connect-stanford-sso){target="_blank"} —
  covered next, in Step 4 below.

!!! note "SQLite Is Single-Writer By Design"
    One VM, database on a persistent disk — no horizontal scaling out of the
    box. That's fine for a small hello-world app like this one; a real
    application may outgrow it and need a different database.

## Step 4 — Register With Stanford and Set the Workgroup

So far the app can serve traffic and speak SAML, but Stanford's IdP doesn't
know it exists yet, and won't send it anyone's identity until it does.
[SPDB](https://spdb.stanford.edu){target="_blank"} is Stanford's registry of Service
Providers — this step tells Stanford to trust this specific SP, and to
release workgroup membership to it as an attribute (`eduPersonEntitlement`)
it can check. The full walkthrough, including the non-personal-workgroup
requirement, is
[docs/stanford-saml-registration.md](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/stanford-saml-registration.md){target="_blank"};
here's what each of its steps does:

- [**Guide Step 1 — Create/choose a Workgroup**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/stanford-saml-registration.md#step-1--createchoose-a-workgroup){target="_blank"} —
  already covered in the Prerequisites above.
- [**Guide Step 2 — Deploy to get a stable hostname + SP metadata**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/stanford-saml-registration.md#step-2--deploy-to-get-a-stable-hostname--sp-metadata){target="_blank"} —
  already done in Step 3; confirm from your local terminal that metadata
  is being served before continuing:
  `curl https://<APP_HOSTNAME>/Shibboleth.sso/Metadata`.
- [**Guide Step 3 — Register the SP in SPDB**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/stanford-saml-registration.md#step-3--register-the-sp-in-spdb-and-release-the-entitlement-in-the-same-form){target="_blank"}
  *(SPDB website)* — submit that metadata, a contact email, and the
  workgroup as the owning group.
- [**Guide Step 4 — Release the workgroup as `eduPersonEntitlement`**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/stanford-saml-registration.md#step-4--release-your-workgroup-as-edupersonentitlement){target="_blank"} —
  handled by the same SPDB submission as Guide Step 3, not a separate
  form.
- [**Guide Step 5 — Capture the exact entitlement value and configure the app**](https://github.com/gsbdarc/saml-fullstack-stanford/blob/main/docs/stanford-saml-registration.md#step-5--capture-the-exact-entitlement-value-and-configure-the-app){target="_blank"}
  *(browser, then SSH into the VM — the only step in this guide that
  touches the server itself)* — after propagation (~15 min), log in once
  to see the exact string Stanford released for the workgroup, then set
  it as `REQUIRED_WORKGROUP` in the VM's `.env` and restart the stack.

!!! warning "Blank REQUIRED_WORKGROUP Means Any Authenticated Stanford User"
    That's not open access — the Stanford login wall still applies. Set it
    once the target workgroup is known.

## Step 5 — Replace the App Logic

At this point there's a live, Stanford-authenticated app running at the
target hostname — everything from here is about turning it into the app
that was actually needed. Auth and authorization plumbing lives in
`shibboleth/` and `backend/app/auth.py` and shouldn't need changes.
Everything else is app-specific:

- `frontend/` — Next.js app; replace the page content
- `backend/app/` — FastAPI routes; add endpoints alongside (or instead of)
  `/api/hello`. New routes read identity the same way `/api/hello` does —
  via `request.state.user`, populated from the trusted `X-Remote-User` /
  `X-Entitlement` headers
- The database — SQLite by default; the backend uses SQLAlchemy, so the
  schema in `backend/app/models.py` and the queries in `backend/app/db.py`
  can be extended or swapped out (e.g. for Postgres) as the app needs

Edit and commit these changes locally, in the clone from Step 1, then push
them to the repo. To pick them up, SSH into the VM:

```title="Terminal Command"
ssh -i ~/.ssh/your-app-name ubuntu@<public_ip>
```

Then, from `/opt/app/src`, pull the latest code and rebuild:

```title="Terminal Command"
sudo git pull
sudo docker compose up -d --build
```

Only re-run `terraform apply` from your local terminal if a
`terraform/gcp` file itself changed (e.g. `app_hostname`).

## Getting Help

If something in the template itself is broken, or a step in this guide
doesn't match what you see,
[open an issue](https://github.com/gsbdarc/saml-fullstack-stanford/issues/new){target="_blank"}
on the repo. Include:

1. Which step you're on
2. The command you ran and its full output (or a screenshot of the error)

For any other questions, reach out to DARC: **[gsb_darcresearch@stanford.edu](mailto:gsb_darcresearch@stanford.edu)**.

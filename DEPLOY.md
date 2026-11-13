# Deploy

How the site gets from a commit to production. The repository is public, so this
document describes the mechanism only: no host names, paths, accounts or keys.

## Overview

The site is static (`dist/`). Every push to `main` builds it in GitHub Actions
and copies the result to the web server over SSH. Nothing is built or edited on
the server.

```
push to main ──▶ GitHub Actions ──▶ npm ci + npm run build ──▶ rsync dist/ over SSH ──▶ web server
```

The workflow is [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## When it runs

- Automatically on every push to `main` (including a merged pull request).
- Manually: GitHub → Actions → Deploy → Run workflow (`workflow_dispatch`). Use
  it to redeploy the current `main` without a new commit.
- Runs never overlap: the `deploy` concurrency group queues a new run until the
  current one has finished, and an upload in progress is never cancelled.

Branches other than `main` and pull requests do not deploy. To check a branch
before merging, build it locally (see below).

## What the workflow does

1. Checks out the repository and installs Node.js 22 with the npm cache.
2. `npm ci`: clean install from `package-lock.json`.
3. `npm run build`: `vite build`, then `metatags/prerender-meta.mjs`, which
   writes a copy of `index.html` with the right meta tags for every case. Details
   in [CLAUDE.md](CLAUDE.md#build-and-deploy).
4. Writes the SSH key and the pinned host key from secrets to the runner.
5. `rsync -az --delete dist/` to the target directory on the server. Host key
   checking is strict: the connection fails if the server does not match the
   stored host key.

`--delete` makes the target directory an exact mirror of `dist/`. Any file on the
server that is not in the build is removed on the next deploy, so do not keep
manual uploads there.

## Repository secrets

Set in GitHub → Settings → Secrets and variables → Actions. The values are never
stored in the repository.

| Secret | Purpose |
|---|---|
| `SSH_KEY` | Private key of a deploy-only account |
| `SSH_KNOWN_HOSTS` | The server's host key line, so the runner can verify it |
| `SSH_HOST` | Server address |
| `SSH_USER` | Deploy account name |
| `SSH_PORT` | Optional, defaults to `22` |
| `SSH_PATH` | Directory on the server that serves the site |

Recommendations: use a separate key that is valid only for this deploy account,
restrict that account to the site directory, and rotate the key if it may have
leaked.

## What the server needs

- Serve the files from the target directory as a static site.
- Fall back to `index.html` for unknown paths, so a direct visit to `/cases`,
  `/experience` or `/skills` works. The repo ships an Apache `.htaccess` with this
  rule (`vite.config.js` copies it into `dist/`). On another server, configure the
  equivalent rewrite.
- Case pages (`/cases/<slug>/`) have their own prerendered `index.html`, so they
  work even without the fallback and give link previews the right title and image.

## Checking a build locally

```bash
npm run build
```

```bash
npm run preview
```

The preview serves `dist/` at http://localhost:4173, the same files the workflow
uploads.

## Rolling back

Revert the bad commit on `main` (`git revert <sha>`) and push. The workflow
deploys the reverted state. There is no separate rollback mechanism and no
previous builds are kept on the server.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Build step fails | Same error as locally with `npm run build`; fix it and push again |
| `Host key verification failed` | `SSH_KNOWN_HOSTS` does not match the server (for example after the server was rebuilt); update the secret |
| `Permission denied (publickey)` | `SSH_KEY` is wrong, or its public half is not authorised for `SSH_USER` |
| Deploy is green but the site is unchanged | `SSH_PATH` points to a different directory than the one being served, or a cache is in front of the site |
| A direct link to a page returns 404 | The server is not falling back to `index.html` |
| `/cases` returns 403 | `dist/cases/index.html` is missing: the build must run `metatags/prerender-meta.mjs` (it is part of `npm run build`) |

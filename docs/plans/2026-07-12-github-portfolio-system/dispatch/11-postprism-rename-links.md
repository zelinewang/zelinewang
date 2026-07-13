# DISPATCH: 11-postprism-rename-links

> Status: accepted
> Channel: agent-opus
> Dispatched: 2026-07-12 18:37 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-postprism`

## Context

The repository was concurrently renamed from `postprism-12e78c39` to
`postprism`, and accepted PR #2 is now on the default branch. A fresh live
inventory found two old clone URLs still present in the default-branch README.
GitHub redirects them, but the canonical public documentation should use the
current repository name. The hosted Lovable page still has generic metadata;
that deployment is outside this narrow documentation fix and must remain an
explicit limitation.

## Task

From current `origin/main`, replace every tracked public-facing old repository
URL/name that is intended as the current clone path with `zelinewang/postprism`.
Open a narrow follow-up PR. Do not change compatibility/historical evidence
that deliberately names the old repository unless it is an active instruction.

## Constraints

- Use `apply_patch`; no rename, default-branch commit, force push, Lovable
  mutation, provider call, account login, or dependency change.
- Use GitHub no-reply commit identity and leave the PR unmerged.
- Do not claim the hosted metadata is fixed.

## Acceptance Criteria

- [ ] Active clone/install/link instructions contain no `postprism-12e78c39`.
- [ ] Canonical current URLs use `https://github.com/zelinewang/postprism`.
- [ ] Frozen Bun install and build remain reproducible.
- [ ] Public sweep has zero Layer 1-4 blockers and `git diff --check` passes.
- [ ] Narrow PR is open from current `origin/main`; PR body records the live-host metadata limitation.

## Verify

```bash
git fetch origin --prune
! rg -n 'postprism-12e78c39' README.md SETUP_GUIDE.md FREE_DEPLOYMENT_GUIDE.md
bun install --frozen-lockfile
bun run build
git diff --check origin/main...HEAD
bash $HOME/.claude/scripts/pre-public-sweep.sh .
```

## Evidence to Return

Return exact diff, install/build/sweep output, commit/PR/checks, deviations, and
remaining live-host limitation. Persist below.

## Returned Evidence 1

### Live baseline and scope

The existing worktree initially pointed to the pre-rename remote and the
already-merged PR #2 branch. Before editing, `origin` was updated locally to
`https://github.com/zelinewang/postprism.git`, fetched with prune, and a new
branch was created from current:

```text
origin/main=2c51b2502b674fa193ecb3c916eb65edd532d516
branch=fix/canonical-repository-links
```

Current `main` contained nine active old-name references, not only the two clone
URLs in the original inventory: two README clone/cd blocks, the architecture
root, two runtime configuration URLs, and two landing-page resource URLs. None
was historical evidence; all were current user-facing instructions or links.

### Acceptance checklist

- [x] No `postprism-12e78c39` reference remains in any tracked file, including
  `README.md`, `SETUP_GUIDE.md`, and `FREE_DEPLOYMENT_GUIDE.md`.
- [x] Both clone instructions use
  `https://github.com/zelinewang/postprism.git` and `cd postprism`.
- [x] Runtime and landing links use
  `https://github.com/zelinewang/postprism`; setup links point to the existing
  `README.md#setup` heading instead of the stale nonexistent anchor.
- [x] Frozen Bun install and production build pass.
- [x] Public sweep has zero Layer 1-4 blockers; range diff check passes.
- [x] Narrow follow-up PR is open from current `origin/main`, records the live
  Lovable metadata limitation, and remains unmerged.

### Exact diff

```diff
 README.md
-git clone https://github.com/zelinewang/postprism-12e78c39.git
-cd postprism-12e78c39
+git clone https://github.com/zelinewang/postprism.git
+cd postprism
-postprism-12e78c39/
+postprism/

 src/config/api.ts
-githubURL: 'https://github.com/zelinewang/postprism-12e78c39'
-documentationURL: 'https://github.com/zelinewang/postprism-12e78c39/blob/main/README.md#%EF%B8%8F-complete-setup-guide'
+githubURL: 'https://github.com/zelinewang/postprism'
+documentationURL: 'https://github.com/zelinewang/postprism/blob/main/README.md#setup'

 src/pages/Landing.tsx
-https://github.com/zelinewang/postprism-12e78c39/blob/main/README.md#%EF%B8%8F-complete-setup-guide
+https://github.com/zelinewang/postprism/blob/main/README.md#setup
-https://github.com/zelinewang/postprism-12e78c39
+https://github.com/zelinewang/postprism
```

The README clone/cd replacement occurs in both Quick start and Installation &
launch. Aggregate stat:

```text
 README.md             | 10 +++++-----
 src/config/api.ts     |  4 ++--
 src/pages/Landing.tsx |  4 ++--
 3 files changed, 9 insertions(+), 9 deletions(-)
```

### Install, build, and public sweep

```text
$ bun install --frozen-lockfile
bun install v1.3.11 (af24e281)
Checked 454 installs across 488 packages (no changes)

$ bun run build
vite v5.4.6 building for production...
✓ 1769 modules transformed.
dist/index.html                   1.47 kB | gzip:   0.59 kB
dist/assets/index-WtSVT-Ta.css   98.83 kB | gzip:  16.48 kB
dist/assets/index-D-syfVnw.js   705.04 kB | gzip: 199.07 kB
✓ built in 18.10s

$ git diff --check origin/main...HEAD
exit 0

$ bash $HOME/.claude/scripts/pre-public-sweep.sh .
Blockers (Layer 1-4): 0
Warnings (Layer 5-6): 4
Public-ready with caveats.
```

The build retained existing caniuse-lite freshness and >500 kB chunk-size
warnings. The link-only patch changed no dependency or bundle configuration.
The four public-sweep warnings are historical author emails, no README
copyright notice, and optional missing `CHANGELOG.md` / `CONTRIBUTING.md`; no
personal email exists in tracked content.

GitHub API verified the canonical repository and README paths, and GitHub's
Markdown API rendered the README successfully.

### Commit, PR, and checks

```text
commit=f83cf33b26e41f47a5c5e7dd59823f7e675df329
subject=docs: use canonical PostPrism repository links
identity=Zane Wang <89945709+zelinewang@users.noreply.github.com>

url=https://github.com/zelinewang/postprism/pull/4
baseRefOid=2c51b2502b674fa193ecb3c916eb65edd532d516
headRefOid=f83cf33b26e41f47a5c5e7dd59823f7e675df329
state=OPEN
mergeable=MERGEABLE
mergeStateStatus=CLEAN
```

```text
Analyze (actions)                pass  35s
Analyze (javascript-typescript)  pass  57s
Analyze (python)                 pass  48s
CodeQL                           pass   1s
Security Analysis               pass  15s
```

Local and remote branch heads match; the worktree is clean. The PR was not
merged.

### Remaining live-host limitation and deviations

The specialized Defuddle extraction path returned `No content could be
extracted` for the Lovable SPA, so live metadata was checked through a read-only
HTML fallback. The current deployed metadata remains generic:

```text
title / og:title: prism-stream-publish
description / og:description: Lovable Generated Project
```

No Lovable mutation, provider call, account login, dependency update,
repository rename, or default-branch write was performed. PR #4 explicitly
records that hosted metadata is not fixed. There are no remaining code, build,
CI, public-sweep, or PR mergeability blockers for this narrow link correction.

## Adjudication

Accepted by the brain on 2026-07-12 18:44 PT. Independent review inspected all
nine canonical-name replacements, confirmed the live README anchor and no-reply
commit, reran the repository-wide stale-name search, frozen Bun install,
production build, and diff check, and observed all five GitHub checks green.
The generic Lovable metadata remains explicitly unverified/unfixed and is not
used as GitHub homepage evidence. PR #4 is accepted for merge.

# DISPATCH: 10-firesight-pages-ci-rework

> Status: accepted
> Channel: agent-opus
> Dispatched: 2026-07-12 18:28 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-firesight`

## Context

FireSight follow-up PR #2 was accepted and merged as `157155e`. Post-ship
observation immediately showed that every default-branch push still triggers
`.github/workflows/deploy.yml`, an obsolete GitHub Pages deployment. The prior
run `29216718603` failed at `actions/configure-pages` because Pages is not
enabled; the canonical and verified deployment is Netlify.

## Task

Remove or otherwise retire the obsolete GitHub Pages workflow through a new
feature/fix branch and PR based on the current `origin/main`. Prefer the
simplest truthful change: if Netlify is the only supported deployment, delete
the misleading workflow instead of adding configuration for a second host.

## Constraints

- Use `apply_patch`; no default-branch commit, force push, Pages enablement, or
  Netlify setting mutation.
- Preserve the accepted NASA/runtime correction and Netlify configuration.
- Use GitHub no-reply commit identity.
- Do not merge the follow-up PR.

## Acceptance Criteria

- [x] No default-branch push workflow attempts an unconfigured GitHub Pages deployment.
- [x] README and deployment metadata consistently identify Netlify as the supported host.
- [x] Netlify configuration and accepted FireSight source remain unchanged.
- [x] Public sweep has zero Layer 1-4 blockers and `git diff --check` passes.
- [x] A narrow PR is open from a current `origin/main` fix branch with no-reply commits.

## Verify

```bash
git fetch origin --prune
git diff --check origin/main...HEAD
rg -n -i 'github pages|github-pages|deploy-pages|configure-pages' README.md .github netlify.toml
bash $HOME/.claude/scripts/pre-public-sweep.sh .
gh pr view --repo zelinewang/FireSight --json url,headRefOid,mergeable,mergeStateStatus,body
```

## Evidence to Return

Return live failed-run evidence, exact diff, sweep/diff output, commit, PR, and
remaining blockers. Persist below.

## Returned Evidence 1

### Live failed-run evidence

- PR #2 was confirmed merged at
  `157155eddf6e8a58623502b39f5978de9f988c96`.
- The prior run from PR #1's merge,
  `https://github.com/zelinewang/FireSight/actions/runs/29216718603`,
  failed on `main` at head `34caf3d`.
- The immediately repeated run from PR #2's merge,
  `https://github.com/zelinewang/FireSight/actions/runs/29217444610`,
  also failed on `main` at head `157155e`.
- Both logs show the same deterministic failure in
  `actions/configure-pages@v4`:

```text
enablement: false
Get Pages site failed. Please verify that the repository has Pages enabled
HttpError: Not Found
```

- Repository inspection found one tracked custom workflow before the change:
  `.github/workflows/deploy.yml`. It triggered on every push to `main` and had
  `pages: write`, `id-token: write`, `actions/configure-pages@v4`, and
  `actions/deploy-pages@v4`.
- README and `netlify.toml` already identify Netlify as the supported host, so
  enabling a second deployment target would have contradicted the accepted
  runtime and public documentation.

### Change and red-first discovery

- Branch:
  `fix/retire-github-pages-workflow`, created from current `origin/main`
  `157155eddf6e8a58623502b39f5978de9f988c96`.
- Commit `e80fcaa6bffcc1c84259e436b483edc6a50bb03a` deleted the
  obsolete 37-line Pages deployment workflow.
- The first PR head correctly removed all Actions source. GitHub's repository
  CodeQL default setup still had `actions` enabled, so run `29217628836`
  failed `Analyze (actions)` with:

```text
No JavaScript or TypeScript code found.
CodeQL could not process any code written in GitHub Actions.
Exit code was 32.
```

- This disproved the assumption that deletion alone would leave the required
  checks green. No Pages or Netlify setting was mutated.
- Commit `0f123a56715aba3bdf9d6d831f47587fd030d200` added a truthful
  `.github/workflows/ci.yml` named `Validate static app`. It runs on pull
  requests and `main` pushes with `contents: read` only, and performs:

```text
node --check src/app.js
python3 -m py_compile scripts/*.py
```

- It contains no credentials, deploy action, environment, Pages permission,
  or publishing step. Netlify remains the sole supported deployment target.

### Exact final diff

```text
A  .github/workflows/ci.yml
D  .github/workflows/deploy.yml

2 files changed, 22 insertions(+), 37 deletions(-)
```

### Local verification

```text
$ node --check src/app.js
(exit 0)

$ python3 -m py_compile scripts/*.py
(exit 0)

$ ruby -e "require 'yaml'; YAML.load_file('.github/workflows/ci.yml')"
workflow yaml parsed

$ git diff --check origin/main...HEAD
(exit 0)

$ rg -n -i 'github pages|github-pages|deploy-pages|configure-pages' README.md .github netlify.toml
(no matches)
```

- `actionlint` was not installed locally; GitHub Actions executed the workflow
  successfully, providing the authoritative syntax/runtime check.
- Pre-public sweep: `0` Layer 1-4 blockers; `4` warnings (historical author
  emails, no README copyright notice, optional CHANGELOG/CONTRIBUTING).
- Accepted configuration/runtime hashes remained unchanged:

```text
netlify.toml  9a5268cc2922ff4f29dd8aca809be87a33186727f3952b4b2af43ac24ade684d
src/app.js    937ae88ee72035d52ad7e4a1c314ce15126e8b5112fd2b033ceb5a3b6c1cae97
```

### GitHub delivery and green rerun

- PR: `https://github.com/zelinewang/FireSight/pull/3`
- Final head:
  `0f123a56715aba3bdf9d6d831f47587fd030d200`
- Commit author for both commits:
  `Zane Wang <89945709+zelinewang@users.noreply.github.com>`
- PR state: `OPEN`, `MERGEABLE`, merge state `CLEAN`; not merged.
- Final checks: `8` successful, `1` skipped, `0` failing/pending:
  - CodeQL Analyze (actions): pass
  - CodeQL Analyze (javascript-typescript): pass
  - CodeQL Analyze (python): pass
  - CodeQL aggregate: pass
  - replacement `validate`: pass in 5 seconds
  - Netlify header rules: pass
  - Netlify redirect rules: pass
  - Netlify deploy preview: pass
  - Netlify pages-changed optimization: skipped
- The PR body records both failed Pages runs, the initial CodeQL red discovery,
  the final exact diff, unchanged hashes, local checks, final green matrix, and
  rollback path.

## Adjudication

Accepted by the brain on 2026-07-12 18:38 PT. Independent review confirmed both
deterministic Pages failures, inspected the delete-plus-replacement-workflow
diff, reran the JavaScript/Python/diff checks, verified the accepted runtime and
Netlify hashes were unchanged, and observed the final green GitHub/Netlify
matrix. The red-first CodeQL discovery is retained as evidence rather than
hidden. PR #3 is accepted for merge.

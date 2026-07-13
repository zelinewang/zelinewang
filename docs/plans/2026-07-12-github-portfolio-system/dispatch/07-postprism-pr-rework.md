# DISPATCH: 07-postprism-pr-rework

> Status: accepted
> Channel: agent-opus
> Dispatched: 2026-07-12 18:05 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-postprism`

## Context

PR `zelinewang/postprism-12e78c39#2` removes fabricated business metrics and
personal oversharing. Review dispatch 03 still found a stale Bun lockfile,
README code blocks naming nonexistent classes/methods, unqualified publishing
success despite source paths that assume success, generic Lovable page metadata,
and concrete project UUIDs that make the public sweep fail.

## Task

Correct PR #2 in place. Restore frozen-install reproducibility, replace invented
implementation examples with real source-grounded architecture, disclose the
demo's success-assumption boundary, scrub concrete deployment identifiers from
guides, and make page metadata identify PostPrism accurately.

## Constraints

- Use `apply_patch`; no provider calls, account logins, real publishing, or paid tests.
- Do not invent a verification mechanism for posting; document the unverified boundary.
- Do not rename the repository in this PR.
- No new dependency unless required to make the existing lockfile honest.
- Do not merge; use no-reply commit identity.

## Acceptance Criteria

- [x] `bun install --frozen-lockfile` and `bun run build` pass from the corrected tree.
- [x] README implementation names/snippets map to actual tracked source or are explicitly labeled pseudocode.
- [x] README does not claim a confirmed post when the controller can assume success.
- [x] Concrete Lovable/deployment project UUIDs are absent from tracked guides; sweep has zero blockers.
- [x] Built page metadata names PostPrism and uses an accurate non-hype description.
- [x] Current GitHub checks remain green; PR body matches final evidence.
- [x] Correction is committed and pushed to the existing PR branch.

## Verify (run these; paste real output)

```bash
bun install --frozen-lockfile
bun run build
rg -n 'ProductionOptimizations|LiveAIObservatory|assume success|Assume success' README.md backend
bash $HOME/.claude/scripts/pre-public-sweep.sh .
git diff --check
gh pr checks 2 --repo zelinewang/postprism-12e78c39
gh pr view 2 --repo zelinewang/postprism-12e78c39 --json url,headRefOid,mergeable,body
```

## Evidence to Return

Return checklist, frozen install/build/sweep output, diff stat + commit, deviations, blockers. Persist below.

## Returned Evidence 1

Completed on existing branch `feat/readme-refresh`; no merge or provider/account
operation was performed.

### Checklist

- [x] Regenerated `bun.lockb` with Bun 1.3.11; frozen install reports no changes.
- [x] Production build passes with 1,769 modules transformed.
- [x] Replaced nonexistent `ProductionOptimizations` and `LiveAIObservatory`
  examples with source-grounded descriptions of `PostPrismApp`,
  `OptimizedAgentManager`, and `VideoStreamer`.
- [x] README distinguishes the hosted front-end simulation from the credentialed
  experimental backend and documents heuristic `success=True` plus placeholder
  `post_url` behavior.
- [x] Removed concrete Lovable project UUIDs, renamed the UUID-shaped logo asset,
  and updated all consumers.
- [x] Updated title, description, author, Open Graph, and Twitter metadata; built
  `dist/index.html` contains the new values.
- [x] Public sweep: zero Layer 1-4 blockers.
- [x] Commit uses no-reply identity and is pushed to PR #2.
- [x] PR body contains final evidence and boundaries.
- [x] All GitHub checks pass; PR is mergeable.

### Commit and diff

```text
acf721dc0e48a21a530301e0601df43c31b50513
docs: align PostPrism claims with verified behavior
Author: Zane Wang <89945709+zelinewang@users.noreply.github.com>

10 files changed, 86 insertions(+), 96 deletions(-)
bun.lockb: 198,351 -> 209,103 bytes
logo asset renamed to public/postprism-logo.png
```

### Decisive verification output

```text
$ bun install --frozen-lockfile
Checked 454 installs across 488 packages (no changes)

$ bun run build
vite v5.4.6 building for production...
✓ 1769 modules transformed.
dist/index.html                   1.47 kB | gzip: 0.59 kB
dist/assets/index-WtSVT-Ta.css  98.83 kB | gzip: 16.48 kB
dist/assets/index-TbBcZEJr.js  705.12 kB | gzip: 199.13 kB
✓ built in 1.50s

$ local dist smoke
page HTTP 200; /postprism-logo.png HTTP 200

$ rg 'ProductionOptimizations|LiveAIObservatory' README.md backend
no matches

$ rg '<UUID regex>' . --glob '!.git/**'
0 matching files

$ bash ~/.claude/scripts/pre-public-sweep.sh .
Blockers (Layer 1-4): 0
Warnings (Layer 5-6): 4
Public-ready with caveats.

$ git diff --check origin/feat/readme-refresh...HEAD
exit 0
```

### GitHub state

```text
PR: https://github.com/zelinewang/postprism-12e78c39/pull/2
headRefOid: acf721dc0e48a21a530301e0601df43c31b50513
mergeable: MERGEABLE
Analyze (actions): pass
Analyze (javascript-typescript): pass
Analyze (python): pass
CodeQL: pass
Security Analysis: pass
```

### Deviations and remaining non-blockers

- No real ORGO/OpenAI/provider call, account login, paid test, or social post was
  run. This was prohibited by the dispatch and is now disclosed by the README.
- `bun run lint` reports the existing baseline of 17 errors and 11 warnings in
  unrelated application code. The four changed TSX files only replace the logo
  path string, and the production build passes.
- The sweep exits with its warning status because commit history contains old
  personal author emails and the repo lacks optional copyright/CHANGELOG/
  CONTRIBUTING material. It reports zero Layer 1-4 blockers.
- Vite reports existing caniuse-lite and >500 kB chunk warnings; neither was
  introduced or expanded by this correction.

### Blockers

None for this dispatch. PR #2 was not merged.

## Adjudication

Accepted by the brain on 2026-07-12 17:52 PT. Independent review inspected the
source-grounded README and page-metadata changes, verified the no-reply commit
and live PR head, reran the frozen Bun install, production build, and diff
check, and confirmed all GitHub checks remain green. The remaining lint and
bundle-size findings are pre-existing non-blocking application debt; the PR no
longer overstates live publishing or exposes deployment UUIDs. PR #2 remains
unmerged pending the portfolio publish gate.

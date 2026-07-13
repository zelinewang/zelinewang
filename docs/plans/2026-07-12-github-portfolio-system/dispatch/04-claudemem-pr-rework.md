# DISPATCH: 04-claudemem-pr-rework

> Status: complete
> Channel: agent-opus
> Dispatched: 2026-07-12 18:05 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-claudemem`

## Context

PR `zelinewang/claudemem#8` has green build, unit, E2E, and feature evidence.
Review dispatch 02 found three documentation contradictions: the displayed
install command installs five skills rather than only claudemem; CI is not run
on every PR; and the README describes `govulncheck` as a tracked release gate
without repository automation that proves it.

## Task

Correct PR #8 in place. Verify the exact single-skill install command in an
isolated HOME, narrow CI/security wording to tracked reality, update the PR body,
commit, and push to the existing `feat/readme-refresh` branch.

## Constraints

- Use `apply_patch` for edits; preserve the verified architecture and test data.
- Prefer correcting claims over adding new CI/release machinery.
- Do not merge the PR or change repository metadata.
- Use a GitHub no-reply author email for the new commit.

## Acceptance Criteria

- [ ] The primary install command installs only the claudemem skill, or the README explicitly and prominently discloses the full five-skill behavior.
- [ ] CI wording exactly matches workflow triggers; no “every PR” claim remains unless proven.
- [ ] `govulncheck` is described as manual/recommended unless a tracked gate exists.
- [ ] Go build, unit tests, E2E 23/23, and feature 82/82 still pass.
- [ ] Public sweep has zero Layer 1-4 blockers; PR body matches the final diff.
- [ ] The correction is committed and pushed to PR #8's existing branch.

## Verify (run these; paste real output)

```bash
npx skills add --help
go build ./...
go test ./...
make e2e-test
make feature-test
bash $HOME/.claude/scripts/pre-public-sweep.sh .
git diff --check
gh pr view 8 --repo zelinewang/claudemem --json url,headRefOid,mergeable,body
```

## Evidence to Return

Return checklist, decisive install/test/sweep output, diff stat + commit, deviations, blockers. Append it below before returning.

## Returned Evidence 1

Workspace: `/Users/zane/worktrees/portfolio-claudemem`

### Checklist

- [x] Primary install command selects only `claudemem` and installs at global
  user scope.
- [x] CI wording matches the tracked pull-request path filters; "every PR" was
  removed.
- [x] README and `SECURITY.md` both describe `govulncheck ./...` as a
  recommended manual pre-release check, not an automated gate.
- [x] Go build/unit, E2E 23/23, and feature 82/82 pass.
- [x] Public sweep reports zero Layer 1-4 blockers.
- [x] PR body matches the final three-file PR diff.
- [x] Rework commit uses the GitHub no-reply author and is pushed to the
  existing `feat/readme-refresh` branch.

### Decisive evidence

Install command documented and tested:

```text
npx skills add zelinewang/claudemem --skill claudemem --global
Found 5 skills
Selected 1 skill: claudemem
Installed 1 skill
unique_skill_count=1
```

The installer additionally reported that its PromptScript adapter does not
support global installation. The selected `claudemem` global skill installed
successfully for the supported detected agents, and the command exited 0.
`npx skills update claudemem --global` was also run under the isolated HOME and
reported all global skills up to date.

Verification:

```text
go build ./...       PASS
go test ./...        PASS (7 test-bearing packages; 2 packages have no tests)
make e2e-test        23 passed, 0 failed
make feature-test    82 passed, 0 failed, 0 skipped
GitHub GFM render    PASS (1 h1, 14 h2, 5 tables, 8 code blocks)
relative links       PASS
git diff --check     PASS
pre-public sweep     0 Layer 1-4 blockers, 3 warnings, exit 2
```

Sweep warnings are the pre-existing personal author email in history and the
optional absence of `CHANGELOG.md` / `CONTRIBUTING.md`; tracked content contains
no personal email, token, home path, private-repository URL, or internal URL.

### Diff, commit, and remote state

- Rework commit: `f252bfc1ab01c7759d21047fdd88691a3cfd0ac9`
- Author: `Zane Wang <89945709+zelinewang@users.noreply.github.com>`
- Rework diff: `README.md`, `SECURITY.md`; `+16/-9`
- Full PR files: `LICENSE`, `README.md`, `SECURITY.md`
- Push: `d74afcd..f252bfc  feat/readme-refresh -> feat/readme-refresh`
- PR: <https://github.com/zelinewang/claudemem/pull/8>
- Live state after push: `OPEN`, `MERGEABLE`, head `f252bfc1...`
- PR checks: none, expected because README/SECURITY are outside the tracked CI
  pull-request path filter.
- PR body was replaced with the corrected scope, exact test/install evidence,
  public-sweep caveats, and no claim that docs-only PRs run CI.

### Deviation

The dispatch requested `npx skills add --help`. With the live `skills@1.5.16`
CLI, that exact invocation exits with "Missing required argument: source"
instead of printing help. `npx skills --help` was used to verify `--skill` and
`--global`; the final source-qualified command was then verified by a real
isolated install. A source-qualified `... add <source> --help` was not used as
help evidence because this CLI interprets it as an install.

## Adjudication

Rework complete. All three review findings are corrected with no application,
test, workflow, release-automation, metadata, or merge change. PR #8 is ready
for a narrow independent re-review; this dispatch did not merge it.

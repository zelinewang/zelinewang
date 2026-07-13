# DISPATCH: 05-dev-orchestrator-pr-rework

> Status: accepted
> Channel: agent-opus
> Dispatched: 2026-07-12 18:13 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-dev-orchestrator`

## Context

PR `zelinewang/dev-orchestrator#2` correctly fixes inventory drift and PII, but
review dispatch 02 found that its manual install fails in a fresh HOME, it
claims hook-registration JSON snippets that do not exist, and its displayed
zero-warning verification output does not come from the command/context shown.

## Task

Correct PR #2 in place: make the manual install executable in a fresh HOME,
remove or replace nonexistent registration-snippet claims, and attach every
verification transcript to the exact fixture and command that produced it.

## Constraints

- Use `apply_patch`; preserve verified hook/rule/flag counts and PII redaction.
- Do not add a new installer framework merely to rescue the README.
- Do not merge or change metadata.
- Use GitHub no-reply commit identity.

## Acceptance Criteria

- [ ] README manual install succeeds under an isolated HOME with no pre-created directories.
- [ ] No claim points to missing JSON snippets or files.
- [ ] The verification sample names the exact sample-repo context and reproduces its displayed warning/failure count.
- [ ] `scripts/verify-dev.sh` remains behaviorally unchanged unless a real bug is independently proven.
- [ ] Public sweep has zero Layer 1-4 blockers; PR body is updated.
- [ ] Correction is committed and pushed to the existing PR branch.

## Verify (run these; paste real output)

```bash
bash scripts/verify-dev.sh .
bash $HOME/.claude/scripts/pre-public-sweep.sh .
git diff --check
gh pr view 2 --repo zelinewang/dev-orchestrator --json url,headRefOid,mergeable,mergeStateStatus,body
```

## Evidence to Return

Return checklist, isolated-HOME and verify output, diff stat + commit, deviations, blockers. Persist below.

## Returned Evidence 1

### Acceptance checklist

- [x] README manual install succeeds under an isolated HOME with no pre-created directories.
- [x] The nonexistent `hooks/` JSON-snippet claim is removed; the README now separates file copying from host-specific hook registration and links to the official reference.
- [x] The displayed zero-warning result is tied to committed fixture `examples/verify-clean-go` and exact command `bash scripts/verify-dev.sh examples/verify-clean-go`.
- [x] `scripts/verify-dev.sh` is unchanged (`git diff HEAD^ HEAD -- scripts/verify-dev.sh` produced no output).
- [x] Public sweep reports zero Layer 1-4 blockers and the PR body records both verification contexts.
- [x] Commit `0ed006b8ae49834d6e98ca4d82dfa97a3f747a54` is pushed to the existing `feat/readme-refresh` PR branch using `89945709+zelinewang@users.noreply.github.com`.

### Isolated-HOME install

The README's exact manual block was executed with `HOME` set to a new directory
created by `mktemp`; no `.claude` directories existed before the run.

```text
installed_files=14
hook_files=5
executable_hooks=5
script_files=3
executable_scripts=3
fresh_home_install=PASS
```

### Verification output

Committed clean fixture, after push:

```text
$ bash scripts/verify-dev.sh examples/verify-clean-go
Running: go test ./... -count=1
✓ Tests passed
New source files: 0
New test files:   0
VERIFIED ✓ — 0 failures, 0 warnings
```

Plugin checkout, after push:

```text
$ bash scripts/verify-dev.sh .
⚠ No test command detected (no Makefile/package.json/pyproject.toml/go.mod/Cargo.toml)
New source files: 0
New test files:   0
PROCEED WITH CAUTION — 1 warning(s)
```

The checkout warning is explicitly documented in the README and is no longer
presented as the clean fixture result. The GitHub Markdown API rendered the
updated README successfully, and `git diff --check` passed.

```text
$ bash $HOME/.claude/scripts/pre-public-sweep.sh .
Blockers (Layer 1-4): 0
Warnings (Layer 5-6): 3
Public-ready with caveats.
```

The sweep exits 2 for the three warnings: a historical author email and the
optional absence of `CHANGELOG.md` and `CONTRIBUTING.md`. Tracked content has no
personal email, raw UUID, token pattern, personal home path, or private URL.

### Diff and commit

```text
0ed006b docs: make install and verification reproducible
 README.md                               | 56 ++++++++++++++++++++-------------
 examples/verify-clean-go/go.mod         |  3 ++
 examples/verify-clean-go/verify_test.go |  7 +++++
 3 files changed, 44 insertions(+), 22 deletions(-)
```

PR: `https://github.com/zelinewang/dev-orchestrator/pull/2`

```text
headRefOid=0ed006b8ae49834d6e98ca4d82dfa97a3f747a54
mergeable=MERGEABLE
mergeStateStatus=BLOCKED
```

The PR body was updated in place. No title, labels, metadata, merge, or verifier
behavior changed.

### Deviations and blockers

- Added one minimal committed Go fixture because the original zero-warning
  transcript had no reproducible repository context. No installer framework or
  production code was added.
- PR merge state remains `BLOCKED`; `gh pr checks` reports no checks on the
  branch. This pre-existing publication gate was not bypassed, and the PR was
  not merged per dispatch constraints.

## Adjudication

Accepted by the brain on 2026-07-12 18:04 PT. Independent review inspected the
README and committed fixture, verified the no-reply commit and live PR head,
reran the clean-fixture and repository-root verification commands, reran the
diff check, and reproduced the manual install under a fresh HOME (14 files,
five executable hooks, three executable scripts). The PR is technically
mergeable but correctly remains blocked by the live one-review ruleset; no
attempt was made to bypass that gate.

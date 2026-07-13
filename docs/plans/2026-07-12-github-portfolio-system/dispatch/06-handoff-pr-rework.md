# DISPATCH: 06-handoff-pr-rework

> Status: complete
> Channel: agent-opus
> Dispatched: 2026-07-12 17:50 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-handoff`

## Context

PR `zelinewang/handoff#1` preserves the real evaluation and passes 34 tests.
Review dispatch 02 found two overstatements: the repository cannot reproduce the
full evaluation without uncommitted source transcripts, and “Every hand uses a
DISPATCH file” contradicts the skill's below-threshold tactical and read-only
consultation exceptions.

## Task

Correct PR #1 in place. State the exact reproducibility boundary and qualify the
DISPATCH-file rule to ceremony-scale/state-mutating work without weakening the
measured evaluation or its failure directions.

## Constraints

- Use `apply_patch`; do not fabricate or publish private transcripts.
- Preserve evaluation numbers, caveats, erratum, and “when not to use” guidance.
- Do not merge or change metadata; use no-reply commit identity.

## Acceptance Criteria

- [x] README distinguishes inspectable committed artifacts from transcript-dependent accounting.
- [x] Routing copy preserves tactical inline and read-only exceptions.
- [x] Both skill suites remain 23/23 and 11/11.
- [x] Public sweep has zero Layer 1-4 blockers; PR body is updated.
- [x] Correction is committed and pushed to the existing PR branch.

## Verify (run these; paste real output)

```bash
bash skill/tests/adjudicate.test.sh
bash skill/tests/dispatch-gate.test.sh
bash $HOME/.claude/scripts/pre-public-sweep.sh .
git diff --check
gh pr view 1 --repo zelinewang/handoff --json url,headRefOid,mergeable,body
```

## Evidence to Return

Return checklist, decisive tests/sweep, diff stat + commit, deviations, blockers. Persist below.

## Returned Evidence 1

Completed in `$HOME/worktrees/portfolio-handoff` on the existing
`feat/readme-refresh` branch.

### Corrections

- Qualified the DISPATCH-file claim to the full ceremony boundary: measured
  above-threshold work, handoff-bound work, multi-dispatch work, and parallel
  mutation. The README now preserves the documented below-threshold tactical
  inline and read-only consultation exceptions.
- Replaced the unsupported full-reproducibility claim. The README now says the
  committed `eval/` artifacts make the locked protocol, derived results,
  caveats, and worked examples inspectable, while raw token accounting still
  requires a private/source session transcript. It identifies
  `skill/scripts/token-report.sh` as the regeneration path when a transcript is
  supplied.
- Preserved every published result and limitation, including small-task
  `+4.4%` FAIL direction, large-task `-68.6%`, E2 `9/10`, total-token increase,
  `n=2` caveat, measurement erratum, and “When NOT to use” guidance.

### Verification

```text
$ bash skill/tests/adjudicate.test.sh
TOTAL: 23  PASS: 23  FAIL: 0

$ bash skill/tests/dispatch-gate.test.sh
TOTAL: 11  PASS: 11  FAIL: 0

$ HOME=<isolated-temp-home> bash install.sh
PASS: expected skill tree and manifest installed

$ GitHub Markdown render check
PASS: bytes=17206, h1=1, h2=6, h3=3, tables=1, code_blocks=4

$ relative-link check
PASS: eval/, eval/worked-examples/, docs/porting.md

$ git diff --check
PASS

$ bash $HOME/.claude/scripts/pre-public-sweep.sh .
0 Layer 1-4 blockers
2 advisory warnings; exit 2
  - pre-existing personal email in commit history
  - optional CONTRIBUTING.md is absent
```

The tracked-content scan found no email, token, home path, private repository,
or internal URL in the reworked content. The public sweep was repeated after
the commit with the same zero-blocker result.

### Change and publication evidence

- Rework scope: `README.md` only, `11 insertions(+), 6 deletions(-)` relative
  to the original PR head.
- Commit: `81bf9ee670559146862a8aa9dcb8a63a65ab47b5`
  (`docs: clarify handoff evidence boundaries`).
- Author: `Zane Wang <89945709+zelinewang@users.noreply.github.com>`.
- Pushed existing branch: `feat/readme-refresh`.
- PR: <https://github.com/zelinewang/handoff/pull/1>.
- Live PR verification: `OPEN`, `MERGEABLE`, head
  `81bf9ee670559146862a8aa9dcb8a63a65ab47b5`, no reported checks.
- PR body updated with the exact evidence boundary, preserved claims, test
  results, sweep result, and README-only scope.

### Deviations and blockers

- Deviations: none.
- Blockers: none. The two sweep warnings are advisory and pre-existing or
  optional; no Layer 1-4 blocker remains.
- Merge and repository metadata were intentionally left untouched.

## Adjudication

Pass. Both review findings are corrected in place, the complete published
evaluation remains intact, and the existing PR branch is ready for final human
review without a merge action from this dispatch.

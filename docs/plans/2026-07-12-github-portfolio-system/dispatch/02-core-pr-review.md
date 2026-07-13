# DISPATCH: 02-core-pr-review

> Status: running
> Channel: agent-opus
> Dispatched: 2026-07-12 17:28 PT | Spec: `docs/plans/2026-07-12-github-portfolio-system/plan.md`
> Workspace: read-only temporary clones; durable evidence belongs in this file

## Context

Three existing public PRs refresh the core agent-infrastructure repositories: `zelinewang/claudemem#8`, `zelinewang/dev-orchestrator#2`, and `zelinewang/handoff#1`. They were created before this dispatch. Do not duplicate or modify them. Their PR bodies claim verified test counts, architecture corrections, license state, and public/privacy sweeps; those are claims until independently re-run.

## Task

Perform an independent, read-only review of the three PRs. Check every load-bearing README claim against the PR tree and executable source, run the relevant tests, inspect the rendered Markdown structure, and return a merge verdict for each PR.

## Constraints

- Do not modify local source, push, comment, approve, merge, or update metadata.
- Use fresh temporary clones or `gh` API/CLI data.
- Treat README numbers and PR-body verification as untrusted until reproduced.
- Separate PR defects from pre-existing repository issues.
- Do not weaken an honest failure result or caveat for marketing polish.

## Acceptance Criteria

- [ ] `claudemem#8`: license, release, installation, architecture, test counts, and coverage claims match the PR tree and fresh commands.
- [ ] `dev-orchestrator#2`: hook/rule inventory, line counts, install path, flags, optional progress-state statement, and PII redaction match the PR tree.
- [ ] `handoff#1`: routing diagram, ceremony thresholds, evaluation caveats, and 34-test claim match the repository evidence.
- [ ] Each PR receives `accept`, `rework`, or `blocked` with exact evidence and no aesthetic-only veto.
- [ ] Public/privacy sweep results are recorded for all three checkouts.

## Verify (run these; paste real output)

```bash
set -euo pipefail
root="$(mktemp -d /tmp/github-portfolio-core-review.XXXXXX)"
gh repo clone zelinewang/claudemem "$root/claudemem"
gh repo clone zelinewang/dev-orchestrator "$root/dev-orchestrator"
gh repo clone zelinewang/handoff "$root/handoff"
cd "$root/claudemem" && gh pr checkout 8 && go build ./... && go test ./... -cover && make e2e-test && make feature-test && bash /Users/zane/.claude/scripts/pre-public-sweep.sh .
cd "$root/dev-orchestrator" && gh pr checkout 2 && bash scripts/verify-dev.sh . && bash /Users/zane/.claude/scripts/pre-public-sweep.sh .
cd "$root/handoff" && gh pr checkout 1 && bash skill/tests/adjudicate.test.sh && bash skill/tests/dispatch-gate.test.sh && bash /Users/zane/.claude/scripts/pre-public-sweep.sh .
gh pr checks 8 --repo zelinewang/claudemem
gh pr checks 2 --repo zelinewang/dev-orchestrator
gh pr checks 1 --repo zelinewang/handoff
```

## Evidence to Return

Return exactly: per-PR verdict and checklist; decisive command output; diff stats/commit IDs reviewed; deviations; blockers. Persist the concise evidence below before returning.

## Returned Evidence 1

Pending.

## Adjudication

Pending.

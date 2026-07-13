# DISPATCH: 03-product-pr-review

> Status: running
> Channel: agent-opus
> Dispatched: 2026-07-12 17:28 PT | Spec: `docs/plans/2026-07-12-github-portfolio-system/plan.md`
> Workspace: read-only temporary clones; durable evidence belongs in this file

## Context

Three existing public PRs refresh product/demo repositories: `zelinewang/postprism-12e78c39#2`, `zelinewang/FireSight#1`, and `zelinewang/dipole#1`. PostPrism previously contained unsupported benchmark/ROI claims and personal reimbursement/job-search copy. FireSight claimed production/live behavior that the source did not implement. Dipole contained broken install paths and committed generated deployment artifacts. The new PRs claim to correct these issues and delete redundant/generated content.

## Task

Perform an independent, read-only review. Re-run build/serve paths, verify public demos at a basic smoke level, check README claims against source, and determine whether large deletions are safe and complete. Return a merge verdict per PR.

## Constraints

- Do not modify, push, comment, approve, merge, rename, or update metadata.
- Use fresh temporary clones or GitHub API/CLI data.
- A successful HTTP 200 proves reachability only, not product correctness.
- Unsupported marketing numbers, invented benchmarks, production-readiness claims, or unqualified AI behavior are blockers.
- Distinguish generated/vendor cleanup from deletion of source or required fixtures.

## Acceptance Criteria

- [ ] `postprism#2`: build succeeds; clone/install path is real; live site is reachable; unsupported metrics and personal oversharing are absent; remaining capability claims map to source.
- [ ] `FireSight#1`: static quickstart serves; NASA/Open-Meteo claims match source; duplicate submission directory and zip deletion does not remove the canonical app; license and limitations are accurate.
- [ ] `dipole#1`: documented run path exists; generated `.netlify`/vendor deletions do not remove required fixtures or consumers; mock/validation path still works; limitations are explicit.
- [ ] Each PR receives `accept`, `rework`, or `blocked` with evidence.
- [ ] Existing GitHub checks and public/privacy sweep results are recorded.

## Verify (run these; paste real output)

```bash
set -euo pipefail
root="$(mktemp -d /tmp/github-portfolio-product-review.XXXXXX)"
gh repo clone zelinewang/postprism-12e78c39 "$root/postprism"
gh repo clone zelinewang/FireSight "$root/FireSight"
gh repo clone zelinewang/dipole "$root/dipole"
cd "$root/postprism" && gh pr checkout 2 && bun install --frozen-lockfile && bun run build && bash /Users/zane/.claude/scripts/pre-public-sweep.sh .
cd "$root/FireSight" && gh pr checkout 1 && test -f src/index.html && test -f src/app.js && bash /Users/zane/.claude/scripts/pre-public-sweep.sh .
cd "$root/dipole" && gh pr checkout 1 && test -f demo/streamlit_app.py && test -f validation/run_validation.sh && bash validation/run_validation.sh && bash /Users/zane/.claude/scripts/pre-public-sweep.sh .
curl -L --fail --silent --show-error --output /dev/null https://postprism.lovable.app/
curl -L --fail --silent --show-error --output /dev/null https://dipoler.netlify.app/
gh pr checks 2 --repo zelinewang/postprism-12e78c39
gh pr checks 1 --repo zelinewang/FireSight
gh pr checks 1 --repo zelinewang/dipole
```

## Evidence to Return

Return exactly: per-PR verdict and checklist; decisive command output; diff stats/commit IDs reviewed; deviations; blockers. Persist the concise evidence below before returning.

## Returned Evidence 1

Pending.

## Adjudication

Pending.

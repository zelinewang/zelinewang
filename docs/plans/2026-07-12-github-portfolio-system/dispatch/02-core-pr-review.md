# DISPATCH: 02-core-pr-review

> Status: rework-1
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
cd "$root/claudemem" && gh pr checkout 8 && go build ./... && go test ./... -cover && make e2e-test && make feature-test && bash "$HOME/.claude/scripts/pre-public-sweep.sh" .
cd "$root/dev-orchestrator" && gh pr checkout 2 && bash scripts/verify-dev.sh . && bash "$HOME/.claude/scripts/pre-public-sweep.sh" .
cd "$root/handoff" && gh pr checkout 1 && bash skill/tests/adjudicate.test.sh && bash skill/tests/dispatch-gate.test.sh && bash "$HOME/.claude/scripts/pre-public-sweep.sh" .
gh pr checks 8 --repo zelinewang/claudemem
gh pr checks 2 --repo zelinewang/dev-orchestrator
gh pr checks 1 --repo zelinewang/handoff
```

## Evidence to Return

Return exactly: per-PR verdict and checklist; decisive command output; diff stats/commit IDs reviewed; deviations; blockers. Persist the concise evidence below before returning.

## Returned Evidence 1

Review root: `/tmp/github-portfolio-core-review.Z8opFt` (fresh clones; no target
repository write, comment, approval, or merge).

### `zelinewang/claudemem#8` — REWORK

- Reviewed head `d74afcd32dac8fc2ff1cfe0a175e3119d304c0b1`; 1 commit,
  2 files, `+174/-136` (`LICENSE`, `README.md`).
- PASS: MIT text/copyright is present; latest GitHub release is `v3.0.12`;
  Markdown-authoritative/SQLite-regenerable-cache architecture matches the
  write/reindex implementation; GFM rendering succeeds and all relative links
  resolve.
- PASS, fresh: `go build ./...`; `go test ./... -cover` (7 test-bearing
  packages pass; `models 94.7%`, `storage 81.4%`, `hooks 79.2%`);
  `make test` smoke; E2E `23/23`; feature `82/82`; exactly 364 `func Test*`
  functions; 12,798 non-test Go LOC and 9,279 Go test LOC.
- FAIL (`README.md:49-52`): the advertised
  `npx skills add zelinewang/claudemem` was run under an isolated HOME. The
  live installer found and installed **5 skills**, including four unintended
  `openspec-*` skills. The one-skill command must select `--skill claudemem`
  (and its intended local/global scope must be stated).
- FAIL (`README.md:227-228` vs `.github/workflows/ci.yml:3-15`): README says
  `make test-all` runs on **every** pull request, but path filters exclude
  docs/LICENSE-only PRs; this PR has no checks. Say "code-changing PRs" or
  remove the path filter.
- UNVERIFIED (`README.md:247-248`): `govulncheck` is claimed before every
  release, but no tracked workflow/script invokes it; `release.yml` only runs
  GoReleaser. Add an enforced step or weaken the claim to a documented manual
  practice.
- Public sweep: exit 2, **0 blockers**, 3 warnings (personal author email in
  history; no CHANGELOG; no CONTRIBUTING); tracked content contains no personal
  email. `gh pr checks 8`: no checks reported.

### `zelinewang/dev-orchestrator#2` — REWORK

- Reviewed heads `33b4b4e66b2c716d22791270b48b515f34356627` and
  `96d4d66d76310ca6a1a566991a68f55a703e4033`; 2 commits, 2 files,
  `+145/-143` (`README.md`, one comment-only PII redaction).
- PASS: five-hook inventory; four rule files and exact line counts
  `101/34/19/62`; skill length 791; six documented flags exist in command/skill;
  progress JSON is accurately described as optional while git + claudemem are
  ground truth; tracked-content PII search and public sweep confirm the two
  personal addresses were removed. GFM rendering and relative links pass.
- FAIL (`README.md:185-198`): exact manual install on a fresh HOME fails on the
  first command because `~/.claude/hooks/` does not exist. The block also omits
  creation of `~/.claude/scripts/` and `~/.claude/commands/`.
- FAIL (`README.md:186`): it says hook-registration JSON snippets are in
  `hooks/`, but that directory contains only five `.sh` files; no registration
  JSON/snippet exists. The plugin manifest exposes skills/commands, not these
  host hooks, so copying alone does not make all hooks "fire automatically."
- FAIL (`README.md:34-60`): the shown `bash scripts/verify-dev.sh .` result is
  `0 warnings` from a sample Go repo, but running that exact command in the
  checkout returns `PROCEED WITH CAUTION — 1 warning` (no test command
  detected). Label the sample working directory/output instead of presenting it
  as the checkout command.
- Public sweep: exit 2, **0 blockers**, 3 warnings (personal author email in
  history; no CHANGELOG; no CONTRIBUTING); tracked content contains no personal
  email. `gh pr checks 2`: no checks reported.

### `zelinewang/handoff#1` — REWORK

- Reviewed head `c0e0d0e61be81f547e5194528ec7bd2fec04ed3b`; 1 commit,
  1 file, `+54/-0` (`README.md`).
- PASS: routing thresholds and all reported E1/E2/E3 numbers match
  `EVAL_PROTOCOL.md`, `EVAL_RESULTS.md`, and `EVAL_REPORT.md`; the small-n,
  total-token-increase, asymmetry, and measurement-erratum caveats remain
  intact. GFM rendering and relative links pass.
- PASS, fresh: `adjudicate.test.sh` = `23/23`; `dispatch-gate.test.sh` =
  `11/11`; installer succeeds under an isolated HOME and installs the expected
  skill tree.
- FAIL (`README.md:182-184`): the newly added statement that the full evaluation
  is "reproducible from eval/" is not true from the public tree alone. No raw
  transcript/JSONL input is present, while `token-report.sh` requires an
  external session id or transcript path. Say the protocol/results are
  inspectable and that accounting is regenerable **when the source transcript
  is supplied**, or publish a privacy-safe fixture.
- FAIL (`README.md:57-59` vs `skill/SKILL.md:27-35,51-54`): "Every hand ...
  works from the DISPATCH file alone" erases two documented exceptions:
  below-threshold tactical spawns may use inline prompts, and read-only
  consultations may omit a DISPATCH file. Qualify this as "Every ceremony-scale
  hand" or retain the exceptions.
- Public sweep: exit 2, **0 blockers**, 2 warnings (personal author email in
  history; no CONTRIBUTING); tracked content contains no personal email.
  `gh pr checks 1`: no checks reported.

### Decisive command summary

```text
claudemem: go build PASS; go test PASS; smoke PASS; E2E 23/23;
           feature 82/82; pre-public 0 blockers / 3 warnings (exit 2)
dev:       verify-dev PROCEED WITH CAUTION / 1 warning;
           fresh-HOME manual install FAIL; pre-public 0 blockers / 3 warnings
handoff:   adjudicate 23/23; dispatch-gate 11/11; isolated install PASS;
           pre-public 0 blockers / 2 warnings (exit 2)
GitHub:    all three PRs OPEN + MERGEABLE; no PR checks reported
```

## Adjudication

- 2026-07-12 18:05 PT — verdict: rework — evidence accepted; all executable
  product/test claims that could be reproduced passed, but each README retains
  at least one load-bearing contradiction. Corrections are dispatched in
  `04-claudemem-pr-rework.md`, `05-dev-orchestrator-pr-rework.md`, and
  `06-handoff-pr-rework.md`.

Do not merge any of the three heads yet. All executable product/test claims
that could be reproduced passed; the rework verdicts are limited to concrete,
load-bearing README contradictions. Re-review only the corrected lines plus a
fresh public sweep/check status; no source-code redesign is requested.

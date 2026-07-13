# DISPATCH: 03-product-pr-review

> Status: rework-1
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
cd "$root/postprism" && gh pr checkout 2 && bun install --frozen-lockfile && bun run build && bash "$HOME/.claude/scripts/pre-public-sweep.sh" .
cd "$root/FireSight" && gh pr checkout 1 && test -f src/index.html && test -f src/app.js && bash "$HOME/.claude/scripts/pre-public-sweep.sh" .
cd "$root/dipole" && gh pr checkout 1 && test -f demo/streamlit_app.py && test -f validation/run_validation.sh && bash validation/run_validation.sh && bash "$HOME/.claude/scripts/pre-public-sweep.sh" .
curl -L --fail --silent --show-error --output /dev/null https://postprism.lovable.app/
curl -L --fail --silent --show-error --output /dev/null https://dipoler.netlify.app/
gh pr checks 2 --repo zelinewang/postprism-12e78c39
gh pr checks 1 --repo zelinewang/FireSight
gh pr checks 1 --repo zelinewang/dipole
```

## Evidence to Return

Return exactly: per-PR verdict and checklist; decisive command output; diff stats/commit IDs reviewed; deviations; blockers. Persist the concise evidence below before returning.

## Returned Evidence 1

Audit completed read-only against fresh clones on 2026-07-12 PT. No PR,
repository, comment, approval, merge, or metadata was modified.

### Verdicts

| PR | Verdict | Head reviewed | Diff |
|---|---|---|---|
| `zelinewang/postprism-12e78c39#2` | **rework** | `4be5fb10851fef5ca25941d15c6f140e4212994a` | 2 files, +145/-410 |
| `zelinewang/FireSight#1` | **rework** | `ec16b1515f729067b035cea346a5c9293efbb4f7` | 28 files, +92/-5,483 |
| `zelinewang/dipole#1` | **rework** | `2a6e7e370b357672dd92b2932abdcad8c1ad9033` | 213 files, +63/-77,275 |

### `postprism#2` — rework

Checklist:

- [x] Fresh clone and exact PR head verified.
- [ ] Reproducible locked install/build. `bun install --frozen-lockfile` failed
  because `bun.lockb` changes under Bun 1.3.11; the subsequent build failed with
  `vite: command not found`.
- [x] Diagnostic non-frozen install/build succeeded: 1,769 modules transformed,
  `vite v5.4.6`, built in 1.51s. This modified only the temporary clone's
  `bun.lockb` (198,351 -> 209,103 bytes), proving the app builds but the committed
  lockfile is stale.
- [x] Public URL is reachable: `https://postprism.lovable.app/` returned HTTP 200,
  1,776 bytes. This proves reachability only. Its HTML metadata still says
  `prism-stream-publish` / `Lovable Generated Project`.
- [x] Unsupported benchmark/ROI/success-rate/market-size figures and personal
  reimbursement/job-search copy were removed from `README.md`.
- [ ] Remaining README claims map faithfully to source.
- [ ] Public/privacy sweep is blocker-free.
- [x] All current GitHub checks pass: CodeQL actions, JavaScript/TypeScript,
  Python, aggregate CodeQL, and Security Analysis.

Decisive evidence:

```text
$ bun install --frozen-lockfile
error: lockfile had changes, but lockfile is frozen

$ bun run build
/bin/bash: vite: command not found
error: script "build" exited with code 127

$ bun install && bun run build   # diagnostic only, temporary clone
417 packages installed
✓ 1769 modules transformed.
✓ built in 1.51s
M bun.lockb
```

Blockers:

1. `README.md:29` calls the build verified, and `README.md:366` says everything
   remaining is reproducible, but the frozen install required by this review is
   not reproducible. Commit the regenerated lockfile or change the supported
   package-manager contract and re-run from a clean clone.
2. `README.md:222-246` presents a `ProductionOptimizations` implementation and
   `README.md:252-271` presents `LiveAIObservatory`; every named class/method in
   those blocks has zero source matches. The real implementation is
   `OptimizedAgentManager` and `VideoStreamer`. Label genuine pseudocode as such
   or replace it with actual source excerpts.
3. The core "publishes" claim needs qualification. In
   `backend/agent_s2_controller/optimized_agent_manager.py:447-462`, two repeated
   actions return `success=True` without proving a post occurred; lines 489-510
   do the same on the first detected edit and explicitly "assume success". The
   README currently presents successful posting as a verified outcome.
4. The pre-public sweep reports one Layer 2 blocker. Most UUID hits are a local
   image asset name, but `FREE_DEPLOYMENT_GUIDE.md:82` and `SETUP_GUIDE.md:67`
   expose a concrete Lovable project UUID. The sweep result was: `Blockers: 1`,
   `Warnings: 4`, `NOT public-ready`.

### `FireSight#1` — rework

Checklist:

- [x] Fresh clone and exact PR head verified.
- [x] Exact documented static quickstart served `/src/` successfully; title was
  `FireSight - Real-Time Wildfire Intelligence`, 4,352 bytes.
- [x] Production URL and PR deploy preview are reachable: both returned HTTP
  200. This proves reachability only.
- [ ] Both NASA feed claims work against the current live primary source.
- [x] Open-Meteo is accurately described in the new README as designed/not wired;
  `src/app.js:444-468` uses brightness, confidence, and random variation.
- [x] Duplicate directory and zip deletion keeps the canonical app.
- [x] MIT license and new README limitations are accurate.
- [ ] Misleading production/live claims are completely removed from the public
  repository.
- [x] Pre-public sweep has no Layer 1-4 blocker; it reports four caveats
  (historical author emails, README copyright notice, optional CHANGELOG and
  CONTRIBUTING).
- [x] CodeQL checks and Netlify deploy-preview check pass; two Netlify
  configuration checks are skipped/neutral, not failures.

Decisive evidence:

```text
$ python3 -m http.server 18800   # repository root
$ curl -fsS http://127.0.0.1:18800/src/
serve_exit=0 bytes=4352 title=<title>FireSight - Real-Time Wildfire Intelligence

$ curl .../MODIS_C6_1_Global_24h.csv
latitude,longitude,brightness,...
curl_exit=0

$ curl .../VNP14IMGTDL_NRT_Global_24h.csv
curl: (56) The requested URL returned error: 404
curl_exit=56

$ curl https://deploy-preview-1--firesight.netlify.app/
preview status=200 bytes=4572
```

Deletion audit:

- The deleted `FireSight_Hackathon_Submission/` contains 22 files whose Git blob
  IDs exactly match retained root files. Its separate README differs and its
  `HACKATHON_README.md` has no root counterpart, but neither is source or a
  required fixture.
- Sampled canonical app, data helper, and deploy config files are byte-identical:
  `src/index.html`, `src/app.js`, `src/styles.css`,
  `scripts/fetch_firms_data.py`, and `netlify.toml`.
- Both deleted zip files contain the same submission packaging, including a
  generated Python `__pycache__`; the canonical root app remains intact.

Blockers:

1. `README.md:3`, `README.md:11`, and `README.md:15-18` promise working MODIS
   and VIIRS 24-hour feeds. The exact VIIRS URL in `src/app.js:11` currently
   returns 404 from NASA, so proxy fallback cannot make that origin path valid.
   Fix the endpoint or qualify the feature as MODIS-only/currently degraded and
   test the corrected browser path.
2. The README was corrected, but contradictory public docs remain. Examples:
   `DEPLOYMENT_GUIDE.md:10` says real-time NASA integration is working;
   `docs/testing/TESTING_REPORT.md:225` says Open-Meteo wind integration is
   working; the same report concludes production readiness. Source
   `src/app.js:444` explicitly says there is no external wind API. Move these
   documents to a clearly labeled historical archive or correct them.

### `dipole#1` — rework

Checklist:

- [x] Fresh clone and exact PR head verified.
- [x] `demo/streamlit_app.py` and the individual validation programs remain.
- [ ] Required aggregate run path `validation/run_validation.sh` exists.
- [x] All remaining fixture/analyzer/JSON/mock validations pass independently.
- [x] `demo/streamlit_app.py` compiles with Python.
- [x] All 210 deleted files are generated fixture `.netlify` output; no source
  consumer references those paths, and `.gitignore` now excludes `.netlify` and
  `node_modules`.
- [x] Public landing URL is reachable: HTTP 200, 17,585 bytes. This proves
  reachability only.
- [x] README limitations clearly call the project local, a demo, and not
  production hardened.
- [x] Pre-public sweep has no Layer 1-4 blocker; it reports the same four
  caveats as FireSight.
- [x] Current `json_only` GitHub check passes.

Decisive evidence:

```text
$ test -f validation/run_validation.sh
false
$ bash validation/run_validation.sh
bash: validation/run_validation.sh: No such file or directory

$ node validation/run_tests.js
All validation fixtures detected correctly.
$ node validation/test_analyzer.js
All analyzer tests passed.
$ node validation/check_json_only.js
All JSON-only checks passed.
$ node validation/mock_deploy_test.js
All mock deploy tests passed.
$ python3 -m py_compile demo/streamlit_app.py
exit 0
```

Blockers:

1. Add the required `validation/run_validation.sh` aggregator (or update the
   acceptance contract and CI to a documented equivalent) so a fresh reviewer
   has one real validation command. The current README claims a validation
   harness but documents no command for it.
2. Minor honesty correction: `README.md:47` says the landing page only points
   users to launch locally, but `index.html:353-354` and `index.html:504` also
   link `https://dipoler.streamlit.app/`. That URL currently redirects to a
   login-gated page, not a public hosted service. State that explicitly or
   remove the stale hosted-app CTA.

### Deviations and boundaries

- PostPrism's non-frozen install was run only after the required frozen command
  failed, to isolate stale-lockfile failure from application build failure. It
  changed only the disposable clone.
- Dipole's aggregate script was absent, so its component validations were run
  separately rather than treating the missing file as proof that all validation
  was broken.
- No real provider deployment, ORGO/OpenAI publishing, account login, or
  destructive deploy path was exercised. Those require credentials and could
  create external state. Claims relying on those paths were checked against
  source and explicitly remain not end-to-end verified.
- HTTP 200 results are recorded only as reachability; none are treated as proof
  of product correctness.

## Adjudication

- 2026-07-12 18:05 PT — verdict: rework — evidence accepted; all three PRs
  retain concrete build, live-source, validation, or public-sweep defects.
  Corrections are dispatched in `07-postprism-pr-rework.md`,
  `08-firesight-pr-rework.md`, and `09-dipole-pr-rework.md`.

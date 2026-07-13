# DISPATCH: 08-firesight-pr-rework

> Status: accepted
> Channel: agent-opus
> Dispatched: 2026-07-12 17:52 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-firesight`

## Context

PR `zelinewang/FireSight#1` safely removes duplicate submission artifacts and
adds an honest README/license. Review dispatch 03 found that the hard-coded
VIIRS NASA URL returns 404 while the README promises both feeds, and older
public docs still claim Open-Meteo integration and production readiness despite
source code explicitly using no external wind API.

## Task

Correct PR #1 in place. Verify a current official NASA endpoint before changing
code. If no stable public endpoint is proven, degrade the product and README to
the working MODIS feed with an explicit limitation. Correct or clearly archive
contradictory public docs.

## Constraints

- Use official NASA sources/live responses for feed claims.
- Use `apply_patch`; no API keys, provider accounts, or invented sample success.
- Keep the duplicate-removal commit; do not rewrite history or merge.
- Use no-reply commit identity.

## Acceptance Criteria

- [x] Every advertised live feed returns a valid response or is clearly marked unavailable/degraded.
- [x] UI/source and README fail gracefully when a secondary feed is unavailable.
- [x] Open-Meteo and production-readiness claims are consistent across README and public docs.
- [x] Static quickstart and Netlify preview remain reachable.
- [x] Public sweep has zero Layer 1-4 blockers; checks remain green; PR body is updated.
- [x] Correction is committed and pushed. PR #1 had already merged, so the correction is in narrow follow-up PR #2 rather than a rewritten or force-pushed branch.

## Verify (run these; paste real output)

```bash
python3 -m py_compile scripts/*.py
rg -n -i 'VIIRS|Open-Meteo|production.ready|real.time' README.md DEPLOYMENT_GUIDE.md docs src
bash $HOME/.claude/scripts/pre-public-sweep.sh .
git diff --check
gh pr checks 1 --repo zelinewang/FireSight
gh pr view 1 --repo zelinewang/FireSight --json url,headRefOid,mergeable,body
```

## Evidence to Return

Return checklist, official/live feed probes, static smoke/checks/sweep, diff stat + commit, deviations, blockers. Persist below.

## Returned Evidence 1

### Live-state discrepancy

- At execution time, `gh pr view 1` reported `state=MERGED`,
  `mergedAt=2026-07-13T01:06:37Z`, merge commit
  `34caf3dc852af73f741a71c93045fbde17e428b2`.
- The requested in-place update was therefore no longer safe or possible.
  Work stopped on the deleted old head branch and resumed from current
  `origin/main` on `fix/public-portfolio-feed-claims`.
- No history was rewritten, no force-push was used, and neither PR was merged
  by this dispatch.

### Official NASA feed evidence

- Official catalog:
  `https://firms.modaps.eosdis.nasa.gov/api/active_fire_files/all?format=json`
- Catalog values verified live:
  - `.csv.modis.World[0]` =
    `/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_24h.csv`
  - `.csv.noaa20.World[0]` =
    `/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_24h.csv`
- Direct MODIS range probe: HTTP `206`, `content-type: text/csv`,
  total size `1,476,129` bytes, valid MODIS header and data rows.
- Direct NOAA-20 VIIRS range probe: HTTP `206`, valid VIIRS header and
  data rows; HEAD reported `content-length: 7,603,726` bytes.
- The catalog's S-NPP 24-hour file returned HTTP `200` but only a 112-byte
  header at probe time; NOAA-20 was selected because it had current rows.
- The former browser URL
  `viirs-i/csv/VNP14IMGTDL_NRT_Global_24h.csv` had returned HTTP `404`.

### Implementation

- Replaced the retired browser/helper VIIRS path with the catalog-backed
  NOAA-20 C2 file.
- Added a Netlify same-origin `/firms/*` rewrite to the official NASA host.
  The live-broken `corsproxy.io` route (HTTP `403`, paid-plan response) and
  `cors-anywhere` route were removed; AllOrigins/direct remain clearly labeled
  best-effort local fallbacks.
- MODIS and VIIRS fetch independently. Per-feed state is recorded as loaded,
  empty, or unavailable; a secondary failure no longer blocks healthy data and
  is surfaced in the page status.
- FIRMS parsing now maps columns by header, supporting MODIS `brightness` and
  VIIRS `bright_ti4`, and normalizes numeric/text confidence values.
- README/title/package metadata now say near-real-time and distinguish the
  deployed browser from the optional Python Open-Meteo helper.
- Legacy deployment, testing, presentation, project-summary, and development
  documents carry a top-of-file historical warning that explicitly retracts
  current production-readiness/Open-Meteo-browser claims. The legacy concept
  architecture diagram was also relabeled and corrected.

### Verification output

```text
$ node --check src/app.js
(exit 0)

$ python3 -m py_compile scripts/*.py
(exit 0)

$ git diff --check
(exit 0)
```

- Parser assertions passed for:
  - MODIS numeric confidence `88` -> `high`
  - VIIRS `bright_ti4=333.4` -> brightness `333.4`
  - VIIRS confidence `nominal` -> `nominal`
- Local static smoke:
  - `/src/`: HTTP `200`
  - title: `FireSight - Near-Real-Time Wildfire Detections`
  - `/src/app.js`: HTTP `200`, 29,910 bytes at probe time
- Deploy preview:
  `https://deploy-preview-2--firesight.netlify.app/`
  - root: HTTP `200`
  - MODIS `/firms/*`: HTTP `206`, valid CSV header and rows
  - NOAA-20 VIIRS `/firms/*`: HTTP `206`, valid CSV header and rows
- Browser E2E on the preview:
  - clicked the unique `Update` button
  - status became `Updated from MODIS + VIIRS`
  - 71 `.fire-marker` elements rendered for the default California region
  - error banner not visible; browser error log empty
  - runtime log confirmed both feeds used route 1, the Netlify same-origin
    proxy, and both returned HTTP `200` to the browser
- Public sweep: `0` Layer 1-4 blockers; `4` warnings (two historical author
  emails, no README copyright notice, optional CHANGELOG/CONTRIBUTING).

### GitHub delivery

- Commit:
  `d55f7bdef09af967d869c8340ffcb90c8e320888`
- Author:
  `Zane Wang <89945709+zelinewang@users.noreply.github.com>`
- Follow-up PR:
  `https://github.com/zelinewang/FireSight/pull/2`
- PR state: `OPEN`, `MERGEABLE`; head OID matches the commit above.
- Checks: `7` successful, `1` skipped, `0` failing/pending. CodeQL actions,
  JavaScript/TypeScript, and Python passed; Netlify header/redirect/deploy
  preview checks passed.
- PR body was updated with the official catalog, live probes, local/static
  checks, deployed proxy probes, browser E2E result, sweep result, and scope.

### Diff

```text
22 files changed, 240 insertions(+), 110 deletions(-)
```

The file count is mostly one explicit historical-status banner across public
legacy documents; the runtime change is narrow to `src/app.js`,
`src/test-fetch.html`, `scripts/fetch_firms_data.py`, and `netlify.toml`.

## Adjudication

Accepted by the brain on 2026-07-12 18:23 PT. Independent review inspected the
22-file correction and parser/runtime changes; reran Python compile and diff
checks; confirmed both filenames in NASA's live official catalog; fetched real
MODIS and NOAA-20 CSV rows directly and through the Netlify preview rewrite;
and reproduced the browser completion state with `Updated from MODIS + VIIRS`,
71 markers, and no error banner. The brain's cold browser run took roughly
100 seconds to download and parse both global feeds, so cold-load latency is a
known product limitation rather than an unreported correctness failure. All
live PR checks are green and follow-up PR #2 is accepted for merge.

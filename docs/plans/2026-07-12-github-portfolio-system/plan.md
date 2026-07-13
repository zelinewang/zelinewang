# GitHub Portfolio System Plan

Date: 2026-07-12 PT  
Branch: `feat/public-profile-portfolio-system`  
Baseline: `origin/main@467f430`  
Audience: recruiters, executive search, engineering leaders, and CTOs

## Outcome

The public profile must communicate Zane's positioning in under 30 seconds and let a technical evaluator validate ownership, architecture, and evidence within five minutes. Visual identity should make the profile memorable, but no load-bearing claim may depend on an image, animation, vanity metric, private repository, or third-party widget.

## Verified Starting Point

- The current canonical profile is a `1200x2740` Console mega-SVG. Its project table contains a private repository, two implementation-empty repositories, and hard-coded star counts that conflict with the live GitHub API.
- The account has 36 public owned repositories: 24 originals and 12 forks. Only two repositories are pinned.
- Six flagship polish PRs already exist and must be reviewed, not duplicated:
  - `zelinewang/claudemem#8`
  - `zelinewang/dev-orchestrator#2`
  - `zelinewang/handoff#1`
  - `zelinewang/FireSight#1`
  - `zelinewang/dipole#1`
  - `zelinewang/postprism-12e78c39#2`
- Two unmerged profile design branches already exist: `feat/professional-v1` and `feat/console-v2`. Their final states are useful references, but their intermediate public commit history contains copy that must not be brought into this branch.
- GitHub officially supports semantic Markdown, `<picture>` theme switching, and `<details>`. SVG animation is not a guaranteed capability and may only be progressive enhancement.

## Design Options Considered

### A. Keep Console as canonical

Memorable to engineers, but rejected as the primary surface. The long image does not reflow, core text is inaccessible to screen readers and resume screeners, mobile type becomes unreadable, and the current pseudo-dashboard encourages low-signal statistics.

### B. Publish a multi-design chooser as the profile

Useful for design exploration, but rejected as the canonical experience. A profile should show judgment, not ask a recruiter to choose the author's identity.

### C. Evidence Ledger canonical plus design studies

Selected. Use a compact, theme-aware editorial hero and native Markdown for positioning, work, evidence, operating principles, and contact. Preserve Console, Constellation, and Field Notes as complete, truthful design studies in a gallery.

## Information Architecture

1. Theme-aware hero: name, category, one memorable thesis.
2. Native Markdown positioning: AI systems builder focused on agent memory, delegation, development workflows, and product experiments.
3. Selected work, grouped by outcome rather than language:
   - Agent infrastructure: `claudemem`, `handoff`, `dev-orchestrator`
   - Product experiments: `postprism`, `FireSight`, `dipole`
4. Evidence-based operating principles.
5. One primary contact path plus low-noise social links.
6. Optional AI sidekick as a footer detail, not the main call to action.
7. One link to the design study gallery.

## Work Plan

### Task 01: Canonical profile and gallery

Dispatch: `dispatch/01-profile-integration.md`

- Port the best final-state ideas from `feat/professional-v1` without merging or cherry-picking its history.
- Refine the hero into an Evidence Ledger / editorial system.
- Keep all load-bearing content as native Markdown.
- Replace private, empty, or stale projects with the six evidence-backed public repositories.
- Synchronize the sidekick's public project whitelist and persona.
- Publish Console, Constellation, and Field Notes as complete design studies with truthful project data and no fake stars.

### Task 02: Core infrastructure PR review

Dispatch: `dispatch/02-core-pr-review.md`

- Independently verify `claudemem#8`, `dev-orchestrator#2`, and `handoff#1` against their source code and executable checks.
- Reject drifted test counts, architecture claims, install commands, licenses, or privacy statements.

### Task 03: Product PR review

Dispatch: `dispatch/03-product-pr-review.md`

- Independently verify `postprism#2`, `FireSight#1`, and `dipole#1`.
- Re-run build/serve paths, verify live links, inspect large deletions, and ensure the README distinguishes product evidence from hackathon/demo claims.

### Task 04: Account and repository metadata

- Replace the current bio/status with author-centered professional positioning.
- Add truthful descriptions, homepages, and topics to the six flagship repositories.
- Pin the six flagship repositories only after their evidence gates pass. If GitHub exposes no supported API mutation, use the authenticated UI; otherwise record the exact manual action.

### Task 05: Publish and observe

- Re-run profile tests, SVG validation, GitHub Markdown rendering, link checks, and the pre-public sweep.
- Commit one logical unit at a time.
- Push feature branches and use PRs; never commit directly to a default branch.
- Merge an existing flagship PR only after independent verification, green checks where available, and a clean public/privacy sweep.
- Do not change visibility, delete repositories, rewrite history, or rename `postprism-12e78c39` in this change. Those actions have integration and provenance consequences and remain a separate reviewed queue.

## Acceptance Criteria

- The canonical profile contains no private repository link, fake star count, empty showcase repository, employer/product name, fragile third-party stats widget, or load-bearing image-only text.
- The first screen contains a clear identity, positioning statement, at least one proof point, and a contact path.
- All six selected repositories are public and anonymously reachable.
- Console, Constellation, and Field Notes are complete, discoverable design studies with a canonical backlink.
- Every numerical claim is traceable to a test, release, GitHub API response, or reproducible evaluation.
- Profile-side scripts/tests pass; SVG and Markdown render cleanly; public sweep reports no blocker.
- Existing flagship PRs have independent evidence-based verdicts before merge.
- Visibility-changing actions remain explicitly unperformed and documented.

## Unverified Until Execution

- Final mobile and dark/light rendering on GitHub, not only QuickLook.
- Sidekick end-to-end behavior on a new public issue.
- Whether the authenticated GitHub UI is available for pin ordering.
- Full interaction quality of the three live product demos.


# GitHub Portfolio System Plan

Date: 2026-07-12 PT  
Branch: `feat/public-profile-portfolio-system`  
Baseline: `origin/main@467f430`  
Audience: recruiters, executive search, engineering leaders, and CTOs

## Outcome

The public profile must communicate Zane's positioning in under 30 seconds and let a technical evaluator validate ownership, architecture, and evidence within five minutes. Visual identity should make the profile memorable, but no load-bearing claim may depend on an image, animation, vanity metric, private repository, or third-party widget.

## Verified Starting Point

- The current canonical profile is a `1200x2740` Console mega-SVG. Its project table contains a private repository, two implementation-empty repositories, and hard-coded star counts that conflict with the live GitHub API.
- At initial audit, the account had 36 public owned repositories: 24 originals and 12 forks. Only two repositories were pinned.
- Six flagship polish PRs already exist and must be reviewed, not duplicated:
  - `zelinewang/claudemem#8`
  - `zelinewang/dev-orchestrator#2`
  - `zelinewang/handoff#1`
  - `zelinewang/FireSight#1`
  - `zelinewang/dipole#1`
  - `zelinewang/postprism-12e78c39#2`
- Two unmerged profile design branches already exist: `feat/professional-v1` and `feat/console-v2`. Their final states are useful references, but their intermediate public commit history contains copy that must not be brought into this branch.
- GitHub officially supports semantic Markdown, `<picture>` theme switching, and `<details>`. SVG animation is not a guaranteed capability and may only be progressive enhancement.

### Live drift discovered during execution

- A concurrent account-level visibility batch reduced the public surface to 21 repositories: 9 originals and 12 forks. This branch did not change visibility.
- `postprism-12e78c39` was concurrently renamed to `postprism`; GitHub redirects the old URL, but canonical links must use the current name.
- The six original flagship PRs were merged in one concurrent batch. Four contained their accepted rework heads; FireSight and Dipole were merged before dispatches 08-09 completed and therefore require narrow follow-up PRs.
- Profile `origin/main` was force-updated from the PR-merge topology to an equivalent squash-based Console v2 line plus dependency updates. Final integration must rebase against that current live base.

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
- Pin the six selected repositories only after their evidence gates pass. GitHub exposes no supported pin mutation in its public API, so use the authenticated UI and verify the resulting GraphQL selection.

### Task 05: Publish and observe

- Re-run profile tests, SVG validation, GitHub Markdown rendering, link checks, and the pre-public sweep.
- Commit one logical unit at a time.
- Push feature branches and use PRs; never commit directly to a default branch.
- Merge an existing flagship PR only after independent verification, green checks where available, and a clean public/privacy sweep.
- Do not change visibility, delete repositories, rewrite history, or rename repositories in this change. Those actions have integration and provenance consequences and remain a separate reviewed queue. Concurrent account mutations are recorded as live facts, not attributed to this branch.

## Acceptance Criteria

- The canonical profile contains no private repository link, fake star count, empty showcase repository, employer/product name, fragile third-party stats widget, or load-bearing image-only text.
- The first screen contains a clear identity, positioning statement, at least one proof point, and a contact path.
- All six selected repositories are public and anonymously reachable.
- Console, Constellation, and Field Notes are complete, discoverable design studies with a canonical backlink.
- Every numerical claim is traceable to a test, release, GitHub API response, or reproducible evaluation.
- Profile-side scripts/tests pass; SVG and Markdown render cleanly; public sweep reports no blocker.
- Existing flagship PRs and required follow-up PRs have independent evidence-based verdicts before merge.
- Visibility-changing actions remain unperformed by this branch; concurrent external changes are explicitly documented and re-audited.

## Remaining limits after execution

- Live GitHub branch rendering passes at desktop and 375x812 with no horizontal overflow; both light and dark hero assets render from the pushed branch. The public profile surface awaits PR #29 merge.
- Sidekick end-to-end behavior on a new public issue remains outside this publishing unit because it creates a public artifact and was not needed to validate the profile copy.
- GitHub UI accepted the six-pin selection, but rejected rapid move-button reorder actions; the selected evidence set is verified even though its order remains GitHub's saved order.
- FireSight and Dipole received real browser checks. PostPrism's source/build and simulation boundary are verified, but its Lovable deployment still has generic metadata and is not used as homepage evidence.

## Resume alignment addendum

A user-provided private resume was verified with both text extraction and page
rendering. It supports a past production background in multimodal evaluation,
high-volume data systems, workflow automation, and enterprise agents. The most
recent listed role ends in March 2026, so the profile must not infer a current
employer or extend that role into the present.

The current public focus is independently supported by live GitHub activity:
agent memory, bounded delegation, evidence-driven development workflows, and
the three public product experiments. The canonical profile and all three
design studies now express this production-to-public through-line. The raw
resume is not part of the public repository because it contains private contact
details.

## Account-level cleanup queue (explicit approval required)

The current public surface is 9 originals plus 12 archived forks. No destructive
action is part of profile PR #29.

- Three archived course/prework forks have no unique default commit, fork-only
  ahead branch, tag, issue, PR, or release and are the lowest-risk deletion
  candidates: `17514-f23-lab03-zelinwan`, `f2023-17514-lab08`, and
  `web102_prework`. Deletion still requires explicit approval.
- Three archived forks have unique default-branch history and must not be
  deleted without export: `f23-lab02-zelinwan` (14 ahead), `k8s-mastery`
  (8 ahead), and `Video-WatermarkRemover-Enhancer` (1 ahead).
- Six archived forks have no default divergence but do have fork-only branch
  tips and require a bare mirror/export before any deletion: `autoresearch`,
  `bragi-canvas`, `claude-hud`, `everything-claude-code`, `spectrum-ts`, and
  `tuichat`.
- `FutureOfUsWeb` is archived but current GitHub contributor/package evidence
  does not establish Zane's authorship of its 755-commit history. Confirm the
  real role/provenance before deciding private vs delete.
- `personalWebpage` is a valid historical archive, but it contains an outdated
  student bio and old resume/social links. Decide whether that history should
  remain public; do not delete it by inference.

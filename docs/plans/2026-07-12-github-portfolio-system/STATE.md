# STATE: GitHub Portfolio System

> Updated: 2026-07-12 19:28 PT by Codex root | Phase: /dev P10, resume-aligned review handoff

## Goal

Turn Zane's public GitHub surface into a credible, distinctive portfolio that a recruiter can understand in 30 seconds and a CTO can validate in five minutes, with a text-first canonical profile, complete visual alternatives, and evidence-backed flagship repository presentation.

## Now

All flagship corrections and follow-up fixes have passed brain re-review and
are on their default branches. FireSight now has a real static validation
workflow instead of a deterministically failing Pages deploy; Dipole has an
honest local-demo boundary plus verified mobile overflow fix; PostPrism uses
its canonical renamed repository links. Account bio/status, repository
descriptions/topics, trusted homepages, and the six-pin selection are live.
Profile PR #29 remains open. Its prior head passed all three CodeQL checks and
GitHub rendering at desktop and 375x812
(`scrollWidth=clientWidth=375`); the dark hero asset also rendered correctly.
After the first handoff, `origin/main` advanced to `39d4706` with a present-tense
startup-work line. The user-provided resume supports the production experience
as past work through March 2026, not a current July 2026 employment claim. The
feature branch has been rebased onto that live main and now separates
resume-confirmed production background from GitHub-verified current public
focus. The updated copy, sidekick guardrail, three design sources, generated
studies, and tests pass locally; the rebased head still needs publication and
fresh remote CI/rendering verification.

## Done

- [x] Verified the live profile repository baseline at `origin/main@467f430`.
- [x] Verified that historical profile PRs #6 and #7 are merged, not drafts.
- [x] Rendered the current Console profile and the two newer candidate branches locally.
- [x] Confirmed that the current canonical profile links a private repository and presents stale project evidence.
- [x] Created isolated integration worktree `$HOME/worktrees/zelinewang-public-profile` on `feat/public-profile-portfolio-system`.
- [x] Audited the initial 36-public-repository surface and classified flagship, coursework, fork, empty, and retirement candidates.
- [x] Re-audited the live account after a concurrent visibility batch reduced the surface to 21 public repositories (9 originals, 12 forks); this branch performed no visibility mutation.
- [x] Verified six pre-existing flagship polish PRs so duplicate implementation can be avoided.
- [x] Benchmarked ten live profile READMEs and GitHub's official rendering/pinning constraints.
- [x] Selected the Evidence Ledger / Professional canonical architecture with three complete design studies.
- [x] 03-profile-implementation — implemented and verified in commits `3b41552` and `9252fac`.
- [x] 04-core-pr-review — all three verdicts `rework-1`; evidence in dispatch 02.
- [x] 05-product-pr-review — all three verdicts `rework-1`; evidence in dispatch 03.
- [x] 06-flagship-rework — dispatches 04-11 accepted and their PRs published.
- [x] 07-github-surface — professional bio/status, six repository metadata/topic sets, trusted FireSight/Dipole homepages, and six pins published.
- [x] 08-resume-alignment — verified the private resume with text extraction and page rendering, added a past-production/current-public bridge, and prevented technical focus from implying current employment.

## Todo (roadmap order)

- [x] 01-account-audit — adjudicated the public repository inventory and flagship set.
- [x] 02-profile-architecture — specified the recruiter/CTO information architecture and three complete design directions.
- [x] 03-profile-implementation — integrated the canonical text-first profile and design gallery.
- [x] 04-profile-verification — profile tests, SVG/XML safety, anonymous links, GFM rendering, and branch-wide privacy sweep pass; live GitHub rendering follows the push.
- [x] 05-flagship-repositories — dispatches 04-11 accepted; original and corrective follow-up PRs published with post-merge observation.
- [x] 06-github-surface — safe metadata, topics, homepages, professional bio/status, and six-pin selection updated through live API/UI.
- [ ] 07-ship — rebased branch requires a force-with-lease update and fresh CI; merge and post-merge observation still await the required independent review.

## Blockers / Problems

- `dev-progress-update.sh` cannot run on this macOS host because it requires the unavailable `flock` binary. This ledger is the continuity fallback; the global helper is out of scope for this public-profile change.
- Destructive cleanup of remaining public forks is a separate account-level decision. Several forks have no unique commits, while others are ahead of upstream; deletion must be based on the refreshed compare inventory and explicit approval.
- The profile branch was successfully rebased from the obsolete merge topology at `611110a` onto current `origin/main@afea95f`; no old Console merge history is being republished.
- PostPrism's Lovable deployment still exposes generic `prism-stream-publish` / `Lovable Generated Project` metadata. The GitHub repository is honest and canonical, but the Lovable URL is deliberately not used as repository homepage evidence.
- Before this rebase, profile PR #29 was `CONFLICTING` because `origin/main` had advanced. The rebased head must be pushed and re-checked; the required-review rule still applies, with no owner bypass or self-approval.
- Account cleanup still needs explicit decisions for the three no-unique-code course forks, nine fork exports/provenance cases, `FutureOfUsWeb`, and `personalWebpage`; see `plan.md`.

## Decisions Log

- 2026-07-12 — Treat `origin/main`, live GitHub API responses, rendered assets, and GitHub Actions as source of truth; local `main` and May memory notes are stale snapshots.
- 2026-07-12 — Preserve the no-employer-affiliation requirement across profile copy, AI persona sources, and repository selection.
- 2026-07-12 — Prefer a text-first canonical profile because recruiter scanning, accessibility, indexing, and mobile legibility are load-bearing; keep visually richer Console, Constellation, and Field Notes directions as a gallery unless evidence overturns this.
- 2026-07-12 — Remove private, empty, unsupported, or stale projects from the canonical evidence path; visual polish cannot compensate for broken proof.
- 2026-07-12 — Do not use low-signal vanity statistics or hard-coded star counts in the canonical profile.
- 2026-07-12 — Reuse and independently verify the six existing flagship polish PRs instead of recreating their work.
- 2026-07-12 — Keep repository visibility, deletion, history rewrite, and rename actions out of this publishing unit; they require a separate account-level decision because redirects, academic policy, and provenance may be affected.
- 2026-07-12 — The current collaboration agent API has no model selector; use the available same-capability agents and preserve Handoff's dispatch/ledger/evidence contract even though explicit model tier routing cannot be expressed on this surface.
- 2026-07-12 — Reject all six pre-existing flagship PR heads pending evidence-specific rework; green product tests do not make contradicted README claims acceptable.
- 2026-07-12 — Treat the 36-to-21 public-repository change, PostPrism rename, profile-main force update, and six-PR merge batch as concurrent live mutations. Re-derive every affected link, count, branch base, and PR state instead of attributing or silently adapting them.
- 2026-07-12 — Four merged PRs contain their accepted correction heads. FireSight and Dipole were merged at their rejected heads, so their corrections must ship through new follow-up PRs rather than rewritten history.
- 2026-07-12 — FireSight post-merge Pages failure is part of completion, not a separate cosmetic issue. Replace the obsolete deployment with a read-only static validation workflow and require the final default-branch run to go green.
- 2026-07-12 — Pin the evidence hierarchy rather than star count: `claudemem`, `dev-orchestrator`, `handoff`, `dipole`, `FireSight`, and `postprism`. GitHub accepted the six-item set; rapid move-button reorder requests were rejected, so no unsupported ordering workaround was used.
- 2026-07-12 — Set homepages only for the verified FireSight and Dipole Netlify sites. Do not promote PostPrism's Lovable URL while its live metadata remains generic.
- 2026-07-12 — Treat production background and current public focus as separate claims. A technical focus does not establish current employment; do not extend a role beyond the resume date or infer an employer from project activity.
- 2026-07-12 — Do not publish the user-provided resume PDF because it contains private contact details. A downloadable resume requires a separately reviewed public-safe artifact.

## Next Session Entry Point

First: verify the rebased resume-alignment head and fresh CI on
<https://github.com/zelinewang/zelinewang/pull/29>, then obtain an independent
approval, re-check that the base has not moved, merge without bypass, and
observe the main-branch CodeQL/profile render. Do not perform destructive
fork/history cleanup or publish the private resume PDF without the explicit
decisions listed in the final handoff.

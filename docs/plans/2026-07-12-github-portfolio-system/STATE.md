# STATE: GitHub Portfolio System

> Updated: 2026-07-12 18:48 PT by Codex root | Phase: /dev P8, final profile verification

## Goal

Turn Zane's public GitHub surface into a credible, distinctive portfolio that a recruiter can understand in 30 seconds and a CTO can validate in five minutes, with a text-first canonical profile, complete visual alternatives, and evidence-backed flagship repository presentation.

## Now

All flagship corrections and follow-up fixes have passed brain re-review and
are on their default branches. FireSight now has a real static validation
workflow instead of a deterministically failing Pages deploy; Dipole has an
honest local-demo boundary plus verified mobile overflow fix; PostPrism uses
its canonical renamed repository links. Account bio/status, repository
descriptions/topics, trusted homepages, and the six-pin selection are live.
The remaining publishing unit is the profile branch: freeze evidence, rebase
onto current `origin/main`, run final multi-viewport/privacy verification, push,
and open its PR.

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

## Todo (roadmap order)

- [x] 01-account-audit — adjudicated the public repository inventory and flagship set.
- [x] 02-profile-architecture — specified the recruiter/CTO information architecture and three complete design directions.
- [x] 03-profile-implementation — integrated the canonical text-first profile and design gallery.
- [ ] 04-profile-verification — run final branch-wide privacy sweep and live multi-viewport checks after dispatch evidence paths are sanitized.
- [x] 05-flagship-repositories — dispatches 04-11 accepted; original and corrective follow-up PRs published with post-merge observation.
- [x] 06-github-surface — safe metadata, topics, homepages, professional bio/status, and six-pin selection updated through live API/UI.
- [ ] 07-ship — push cohesive branches, open PRs, inspect CI, and publish a durable handoff.

## Blockers / Problems

- `dev-progress-update.sh` cannot run on this macOS host because it requires the unavailable `flock` binary. This ledger is the continuity fallback; the global helper is out of scope for this public-profile change.
- Destructive cleanup of remaining public forks is a separate account-level decision. Several forks have no unique commits, while others are ahead of upstream; deletion must be based on the refreshed compare inventory and explicit approval.
- `origin/main` for the profile was force-updated from merge commit `611110a` to a squash-based line ending at `3aaba8e` while this branch was active. Rebase only after all shared dispatch evidence is stable.
- PostPrism's Lovable deployment still exposes generic `prism-stream-publish` / `Lovable Generated Project` metadata. The GitHub repository is honest and canonical, but the Lovable URL is deliberately not used as repository homepage evidence.

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

## Next Session Entry Point

First: freeze the accepted dispatch evidence, commit the live-drift/profile
alignment, rebase onto current `origin/main`, and run final profile tests,
pre-public sweep, link checks, and GitHub branch rendering before opening the
profile PR.

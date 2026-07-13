# STATE: GitHub Portfolio System

> Updated: 2026-07-12 17:28 PT by Codex root | Phase: /dev P5, dispatch wave ready

## Goal

Turn Zane's public GitHub surface into a credible, distinctive portfolio that a recruiter can understand in 30 seconds and a CTO can validate in five minutes, with a text-first canonical profile, complete visual alternatives, and evidence-backed flagship repository presentation.

## Now

The live account, profile artifact, and external benchmark audits are complete. Three evidence-backed dispatches are running: profile integration, core infrastructure PR review, and product PR review. No production or repository metadata has been mutated.

## Done

- [x] Verified the live profile repository baseline at `origin/main@467f430`.
- [x] Verified that historical profile PRs #6 and #7 are merged, not drafts.
- [x] Rendered the current Console profile and the two newer candidate branches locally.
- [x] Confirmed that the current canonical profile links a private repository and presents stale project evidence.
- [x] Created isolated integration worktree `/Users/zane/worktrees/zelinewang-public-profile` on `feat/public-profile-portfolio-system`.
- [x] Audited all 36 public repositories and classified flagship, coursework, fork, empty, and retirement candidates.
- [x] Verified six pre-existing flagship polish PRs so duplicate implementation can be avoided.
- [x] Benchmarked ten live profile READMEs and GitHub's official rendering/pinning constraints.
- [x] Selected the Evidence Ledger / Professional canonical architecture with three complete design studies.

## Todo (roadmap order)

- [x] 01-account-audit — adjudicated the public repository inventory and flagship set.
- [x] 02-profile-architecture — specified the recruiter/CTO information architecture and three complete design directions.
- [ ] 03-profile-implementation — integrate the canonical text-first profile and design gallery.
- [ ] 04-profile-verification — run content, SVG, workflow, accessibility, privacy, and live-render checks.
- [ ] 05-flagship-repositories — prepare isolated improvements for the selected flagship repositories.
- [ ] 06-github-surface — update safe metadata and document any visibility or pinning action that requires account UI access.
- [ ] 07-ship — push cohesive branches, open PRs, inspect CI, and publish a durable handoff.

## Blockers / Problems

- `dev-progress-update.sh` cannot run on this macOS host because it requires the unavailable `flock` binary. This ledger is the continuity fallback; the global helper is out of scope for this public-profile change.
- Archiving or changing visibility of old coursework repositories is a separate account-level publishing decision and will not be performed without an evidence-backed inventory and an explicit reversible action list.

## Decisions Log

- 2026-07-12 — Treat `origin/main`, live GitHub API responses, rendered assets, and GitHub Actions as source of truth; local `main` and May memory notes are stale snapshots.
- 2026-07-12 — Preserve the no-employer-affiliation requirement across profile copy, AI persona sources, and repository selection.
- 2026-07-12 — Prefer a text-first canonical profile because recruiter scanning, accessibility, indexing, and mobile legibility are load-bearing; keep visually richer Console, Constellation, and Field Notes directions as a gallery unless evidence overturns this.
- 2026-07-12 — Remove private, empty, unsupported, or stale projects from the canonical evidence path; visual polish cannot compensate for broken proof.
- 2026-07-12 — Do not use low-signal vanity statistics or hard-coded star counts in the canonical profile.
- 2026-07-12 — Reuse and independently verify the six existing flagship polish PRs instead of recreating their work.
- 2026-07-12 — Keep repository visibility, deletion, history rewrite, and rename actions out of this publishing unit; they require a separate account-level decision because redirects, academic policy, and provenance may be affected.
- 2026-07-12 — The current collaboration agent API has no model selector; use the available same-capability agents and preserve Handoff's dispatch/ledger/evidence contract even though explicit model tier routing cannot be expressed on this surface.

## Next Session Entry Point

First: read this file, `plan.md`, and all non-accepted dispatch files. Then: execute dispatches 01-03 in parallel and adjudicate their persisted evidence before any merge or metadata write.

# DISPATCH: 01-profile-integration

> Status: accepted
> Channel: agent-opus
> Dispatched: 2026-07-12 17:28 PT | Spec: `docs/plans/2026-07-12-github-portfolio-system/plan.md`
> Workspace: `<profile-worktree>`

## Context

This repository is the public `zelinewang/zelinewang` GitHub profile. The current baseline is `origin/main@467f430` on isolated branch `feat/public-profile-portfolio-system`. The current canonical profile is a long Console mega-SVG with inaccessible mobile text, a private `constellix` link, empty `PulseConnect`/`santorini` projects, and hard-coded fake star counts.

Two newer public branches exist: `origin/feat/professional-v1@f4befa2` and `origin/feat/console-v2@6153ec9`. Use their final trees as references only. Do not merge or cherry-pick either branch: intermediate commits contain employer/product naming that the user explicitly requires us to avoid.

The confirmed design context is in the ignored `.impeccable.md` of the older local checkout and summarized in the plan: professional, elegant, sharp, playful, and evidence-first; no employer affiliations, widget walls, generic AI gradients, or fragile stats. The canonical direction is Evidence Ledger / Professional: a compact light/dark editorial hero plus semantic Markdown. Console, Constellation, and Field Notes remain complete design studies.

## Task

Implement the canonical profile and design gallery in this worktree. Port and refine the best final-state ideas from the two candidate branches, synchronize the public AI persona/guardrails, and make the three design studies truthful and discoverable.

## Constraints

- Use `apply_patch` for file edits.
- Do not merge or cherry-pick the candidate branches.
- Do not mention employer names, private product names, private repositories, compensation, or internal work.
- Do not add dependencies or external runtime services.
- Keep load-bearing text, project descriptions, links, and contact paths in semantic Markdown.
- SVG animation is optional progressive enhancement only.
- Do not hard-code stars, followers, visitor counts, contribution streaks, or unsupported product metrics.
- Use only these six public project targets: `claudemem`, `handoff`, `dev-orchestrator`, `postprism-12e78c39`, `FireSight`, and `dipole`.
- Preserve the security boundary in `AGENTS.md`, `SECURITY.md`, and `ZANE_PERSONA.md`.
- Do not push, open a PR, merge, trigger the sidekick, or modify GitHub metadata.

## Acceptance Criteria

- [ ] `README.md` uses a theme-aware hero plus native Markdown for identity, positioning, selected work, working principles, contact, sidekick, and gallery link.
- [ ] The first screen contains Zane's identity, a clear AI-systems positioning line, at least one public proof point, and a contact path.
- [ ] All six selected projects are linked and accurately described; `constellix`, `PulseConnect`, and `santorini` are absent from the canonical evidence path.
- [ ] No fake stars, private claims, employer/product names, or unsupported precise metrics remain in the canonical README or gallery assets.
- [ ] `previews/README.md` presents complete Console, Constellation, and Field Notes studies; each study has its own README, rendered visual, design rationale, and canonical backlink.
- [ ] Gallery visuals contain the current six-project set or are explicitly dated truthful studies; they do not imply that image rows are clickable.
- [ ] `AGENTS.md` and `ZANE_PERSONA.md` whitelist the same public project set as the canonical README.
- [ ] Every tracked SVG is well-formed XML, under 2 MB, and contains no `<script>`, `<foreignObject>`, `javascript:`, or inline event handlers.
- [ ] Existing sidekick tests and the renderer pass without new dependencies.
- [ ] The diff contains only profile, gallery, automation, test, and handoff-plan files required by this change.

## Verify (run these; paste real output)

```bash
cd <profile-worktree>
node --test .github/scripts/sidekick.test.mjs
node .github/scripts/render-profile.mjs
find . -type f -name '*.svg' -not -path './.git/*' -print0 | xargs -0 -n1 xmllint --noout
test -z "$(find . -type f -name '*.svg' -not -path './.git/*' -size +2M -print)"
! rg -n -i 'constellix|PulseConnect|santorini|★[0-9]|world.s first|revolutionary|visitor count' README.md previews .github/templates AGENTS.md ZANE_PERSONA.md
! rg -n -i '<script|<foreignObject|javascript:|on(click|load|error)=' --glob '*.svg' .
git diff --check
bash "$HOME/.claude/scripts/pre-public-sweep.sh" .
git status --short
git diff --stat
```

## Evidence to Return

Your final message MUST contain exactly, in order:

1. Acceptance checklist with pass/fail per item
2. Decisive verify output, verbatim
3. `git diff --stat` and commit hash if committed
4. Deviations and discoveries
5. Blockers

Persist evidence below before returning. Do not return full files or long logs.

## Returned Evidence 1

### 1. Acceptance checklist

- [x] Theme-aware hero plus semantic Markdown for identity, positioning, selected work, principles, contact, sidekick, and gallery.
- [x] First screen includes identity, AI-systems positioning, linked public proof, and LinkedIn/GitHub contact paths.
- [x] All six selected public projects are linked and described from their public README evidence.
- [x] Canonical and gallery contain no stale private project, fake star, employer/product name, or unsupported vanity metric.
- [x] `previews/README.md` presents complete Console, Constellation, and Field Notes studies with rationale and canonical backlinks.
- [x] Gallery visuals use the six-project public set, state that image rows are inert, and carry dated public GitHub data.
- [x] `AGENTS.md` and `ZANE_PERSONA.md` use the same six-project whitelist as the canonical README.
- [x] All tracked SVGs are well-formed, below 2 MB, and contain none of the prohibited active-content patterns.
- [x] Sidekick tests, profile-content tests, and renderer pass without new dependencies.
- [x] Implementation commit contains only profile, gallery, automation, and test files.

### 2. Decisive verify output

```text
✔ canonical profile keeps load-bearing content in semantic Markdown
✔ public profile surfaces exclude stale projects and unsupported vanity copy
✔ renderer writes all studies into the discoverable gallery
14 passed, 0 failed
ℹ tests 4
ℹ pass 4
ℹ fail 0

Fetching live GitHub stats...
Stats fetched: 22 tokens
Fetching daily snake...
Snake content: 91642 chars
Rendered <profile-worktree>/previews/console/assets/01-profile.svg (111324 chars)
Rendered <profile-worktree>/previews/constellation/assets/01-profile.svg (120750 chars)
Rendered <profile-worktree>/previews/field-notes/assets/01-profile.svg (117881 chars)
All 3 mega-SVGs rendered.

<themed-picture data-catalyst-inline="true"><picture>
<h2 dir="auto">Selected work</h2>
<h2 dir="auto">How I work</h2>
<h2 dir="auto">Design studies</h2>
<h2 dir="auto">Contact</h2>
<details>

claudemem anonymous_http=200
handoff anonymous_http=200
dev-orchestrator anonymous_http=200
postprism-12e78c39 anonymous_http=200
FireSight anonymous_http=200
dipole anonymous_http=200
```

`xmllint --noout`, SVG size gate, forbidden-copy gate, active-content gate,
and `git diff --check` all exited 0 with no output.

### 3. Diff stat and commit

Commit: `3b41552 feat(profile): publish evidence-ledger profile and design gallery`

```text
24 files changed, 1279 insertions(+), 796 deletions(-)
```

The implementation adds one profile-content test, rewrites the canonical
README, updates all three templates and the renderer workflow, removes the
obsolete root mega-SVG/draft archive, and publishes three complete study
READMEs plus rendered SVGs.

### 4. Deviations and discoveries

- Live `origin/main` advanced from `467f430` to `611110a` through merged
  PR #28 during execution. The integration branch was rebased before
  implementation; the original plan commit `0351630` was preserved as
  rebased commit `aeb3e27`.
- PR #28 supplied the truthful Console-v2 project structure. The canonical
  still moved to the Professional/Evidence Ledger direction because its
  theme-aware hero and semantic Markdown satisfy mobile, accessibility, and
  recruiter-screening requirements.
- The renderer now publishes gallery studies under `stats-output/studies/`;
  the tracked renders remain branch-reviewable snapshots.
- GitHub's Markdown API retained the theme-aware `<picture>` as
  `<themed-picture>` and retained the `<details>` sidekick disclosure.

### 5. Blockers

- The profile implementation has no code or content blocker.
- The repository-wide pre-public sweep still reports one Layer 3 blocker from
  absolute personal paths in the shared portfolio plan/STATE and sibling
  dispatch files. Those are orchestration artifacts outside this implementation
  commit and must be normalized before the parent branch is pushed.
- Sidekick end-to-end behavior was intentionally not triggered because the
  dispatch forbids creating a public issue or other GitHub write.

## Adjudication

- 2026-07-12 18:12 PT — verdict: accepted — root re-ran the combined profile
  and sidekick tests (`18/18` effective assertions, zero failures),
  `git diff --check`, and the repository-wide public sweep after path
  normalization. Layer 1-4 blockers are zero. Visual spot-checks covered both
  hero themes and all three rendered design studies. Commit `3b41552` is
  accepted; evidence commit `9252fac` records the full implementation run.

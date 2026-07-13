# DISPATCH: 01-profile-integration

> Status: running
> Channel: agent-opus
> Dispatched: 2026-07-12 17:28 PT | Spec: `docs/plans/2026-07-12-github-portfolio-system/plan.md`
> Workspace: `/Users/zane/worktrees/zelinewang-public-profile`

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
cd /Users/zane/worktrees/zelinewang-public-profile
node --test .github/scripts/sidekick.test.mjs
node .github/scripts/render-profile.mjs
find . -type f -name '*.svg' -not -path './.git/*' -print0 | xargs -0 -n1 xmllint --noout
test -z "$(find . -type f -name '*.svg' -not -path './.git/*' -size +2M -print)"
! rg -n -i 'constellix|PulseConnect|santorini|★[0-9]|world.s first|revolutionary|visitor count' README.md previews .github/templates AGENTS.md ZANE_PERSONA.md
! rg -n -i '<script|<foreignObject|javascript:|on(click|load|error)=' --glob '*.svg' .
git diff --check
bash /Users/zane/.claude/scripts/pre-public-sweep.sh .
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

Pending.

## Adjudication

Pending.

# DISPATCH: 09-dipole-pr-rework

> Status: accepted
> Channel: agent-opus
> Dispatched: 2026-07-12 18:04 PT | Spec: `../plan.md`
> Workspace: `$HOME/worktrees/portfolio-dipole`

## Context

PR `zelinewang/dipole#1` safely removes 210 generated `.netlify` fixture files
and its four component validations pass. Review dispatch 03 found that there is
no documented one-command validation aggregator and the public landing page
still links to a login-gated Streamlit deployment while the README implies it
only directs users to a local launch.

## Task

Correct PR #1 in place. Add a small fail-fast validation aggregator over the
four existing scripts, document it, and remove or honestly label the gated
hosted-app CTA in both README and landing page.

## Constraints

- Use `apply_patch`; keep the generated-artifact cleanup.
- Do not add a framework or new test dependency for a four-command shell wrapper.
- Do not claim the gated Streamlit page is a public demo.
- Do not merge; use no-reply commit identity.

## Acceptance Criteria

- [ ] `validation/run_validation.sh` exists, is executable, fail-fast, and runs all four component validations.
- [ ] README documents the aggregator and the local/demo boundary.
- [ ] Landing-page CTA does not present a login-gated URL as a public live product.
- [ ] Python compile and all validations pass; current JSON-only check remains green.
- [ ] Public sweep has zero Layer 1-4 blockers; PR body is updated.
- [ ] Correction is committed and pushed to the existing PR branch.

## Verify (run these; paste real output)

```bash
bash -n validation/run_validation.sh
bash validation/run_validation.sh
python3 -m py_compile demo/streamlit_app.py
! rg -n 'dipoler\.streamlit\.app' README.md index.html
bash $HOME/.claude/scripts/pre-public-sweep.sh .
git diff --check
gh pr checks 1 --repo zelinewang/dipole
gh pr view 1 --repo zelinewang/dipole --json url,headRefOid,mergeable,body
```

## Evidence to Return

Return checklist, validation/sweep output, diff stat + commit, deviations, blockers. Persist below.

## Returned Evidence 1

### Live-state discrepancy

PR #1 merged while this rework was in progress, before any correction commit or
push was made:

```text
state=MERGED
mergedAt=2026-07-13T01:06:43Z
mergeCommit=db3f35eef61665bc67e42347504dbf40c5351483
headRefOid=2a6e7e370b357672dd92b2932abdcad8c1ad9033
```

The old remote feature branch was deleted. Per the safety correction from the
root orchestrator, the uncommitted rework was moved without conflict onto
`fix/public-portfolio-validation`, based on current
`origin/master@db3f35eef61665bc67e42347504dbf40c5351483`. PR #1 and `master`
were not rewritten or directly modified.

Follow-up PR: `https://github.com/zelinewang/dipole/pull/2`

### Acceptance checklist

- [x] `validation/run_validation.sh` exists with mode `100755`, uses
  `set -euo pipefail`, and runs all four existing validation programs.
- [x] README documents the single validation command, its four covered areas,
  first-failure behavior, and the no-live-provider boundary.
- [x] Landing page no longer links or presents the login-gated Streamlit URL as
  a public product; hero/footer CTAs now point to local setup and GitHub source.
- [x] Python compile, all four component validations, and the JSON-only check
  pass locally.
- [x] Public sweep reports zero Layer 1-4 blockers, and the follow-up PR body
  records the real validation boundary.
- [x] Correction is committed with GitHub no-reply identity, pushed to the new
  follow-up branch, and left unmerged.

### Validation output

```text
$ bash -n validation/run_validation.sh
exit 0

$ bash validation/run_validation.sh
All validation fixtures detected correctly.
All analyzer tests passed.
All JSON-only checks passed.
All mock deploy tests passed.
All validations passed.

$ python3 -m py_compile demo/streamlit_app.py
exit 0

$ ! rg -n 'dipoler\.streamlit\.app' README.md index.html
exit 0

$ git diff --check
exit 0
```

A controlled `node` shim returned non-zero on the first component. The wrapper
exited 1 after printing only `validation/run_tests.js`; none of
`test_analyzer.js`, `check_json_only.js`, or `mock_deploy_test.js` was invoked:

```text
exit_status=1
fail_fast=PASS
```

The README also rendered successfully through GitHub's Markdown API.

### Public sweep and CI

```text
$ bash $HOME/.claude/scripts/pre-public-sweep.sh .
Blockers (Layer 1-4): 0
Warnings (Layer 5-6): 4
Public-ready with caveats.

$ gh pr checks 2 --repo zelinewang/dipole
json_only  pass  11s
```

The four sweep warnings are historical author emails, no README copyright
notice, and optional missing `CHANGELOG.md` / `CONTRIBUTING.md`. No personal
email remains in tracked content.

### Diff and commit

```text
7b3e5b890da60c92bd421fa16070d1a23b294538
fix: make validation and demo boundary explicit

 README.md                    | 14 +++++++++++++-
 index.html                   | 13 +++++--------
 validation/run_validation.sh | 20 ++++++++++++++++++++
 3 files changed, 38 insertions(+), 9 deletions(-)
 create mode 100755 validation/run_validation.sh
```

Commit identity:
`Zane Wang <89945709+zelinewang@users.noreply.github.com>`.

Final PR state:

```text
url=https://github.com/zelinewang/dipole/pull/2
baseRefOid=db3f35eef61665bc67e42347504dbf40c5351483
headRefOid=7b3e5b890da60c92bd421fa16070d1a23b294538
state=OPEN
mergeable=MERGEABLE
mergeStateStatus=CLEAN
```

### Deviations and blockers

- Dispatch originally required updating PR #1 in place, but live GitHub state
  proved it had already merged. A narrow follow-up PR was required to preserve
  branch protection and avoid rewriting published history.
- No real provider deployment was run because it requires credentials and
  creates external state.
- Browser-backed visual review could not run: the desktop browser runtime
  reported no available backend after the prescribed troubleshooting check.
  CTA targets, the `#setup` anchor, absence of the gated URL, HTML source, and
  unchanged button styling were verified directly. No screenshot-level claim
  is made.
- `shellcheck` was unavailable; `bash -n`, the complete real run, and the
  controlled fail-fast test cover the wrapper acceptance behavior.
- No remaining code, CI, public-sweep, or PR mergeability blocker. PR #2 was
  intentionally left open and unmerged.

## Adjudication

Rework-2 issued by the brain on 2026-07-12 18:16 PT. Source and CI acceptance
passed, but the brain's real 375x812 browser check found a mobile horizontal
overflow: `document.scrollingElement.scrollWidth=587` while `clientWidth=375`,
and `window.scrollTo(999, 0)` reached `scrollX=212.5`. The ordinary viewport
render is readable, but the full-page render visibly shifts/repeats content.

Fix the overflow in the same PR without hiding legitimate content. Re-run the
existing verification, then use the available in-app browser if possible (or
return source evidence for brain-side browsing) to prove at 375px that
`scrollWidth <= clientWidth`, `scrollX` remains zero after a positive scroll
attempt, both revised CTAs remain visible, and the setup section remains
reachable. Push a new no-reply commit to PR #2 and append Returned Evidence 2.

## Returned Evidence 2

### Root cause and non-masking fix

The browser's exact overflow distance identifies the decorative hero
pseudo-element as the cause:

```text
viewport width:                    375px
.hero::before fixed width:         800px
centered overflow on each side:   (800 - 375) / 2 = 212.5px
brain-observed maximum scrollX:    212.5px
```

The element used `left: 50%` plus `translateX(-50%)`, so this is an exact
mechanical match rather than a CSS guess. Existing `body { overflow-x: hidden }`
did not prevent root scrolling and was not expanded or used as the fix.

Applied source change:

```diff
-            width: 800px;
-            height: 800px;
+            width: min(800px, 100%);
+            aspect-ratio: 1;
```

This preserves the complete square radial decoration at desktop size and scales
it to the containing hero width on narrow viewports. It does not crop or hide
legitimate content.

Source evidence confirms both revised CTAs and the setup destination remain:

```text
351: 🚀 Set Up Locally
354: View Source on GitHub
404: <section id="setup" class="setup">
```

### Commit, push, and PR

```text
f442e7d94f52278c7a34d2231c121dc4f287cc14
fix: constrain mobile hero decoration

 index.html | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```

Commit identity:
`Zane Wang <89945709+zelinewang@users.noreply.github.com>`.

The commit was pushed to the existing follow-up PR #2. Its body now records the
mobile root-cause math, non-masking fix, and outstanding independent browser
assertions.

### Re-verification

```text
$ bash -n validation/run_validation.sh
exit 0

$ bash validation/run_validation.sh
All validation fixtures detected correctly.
All analyzer tests passed.
All JSON-only checks passed.
All mock deploy tests passed.
All validations passed.

$ python3 -m py_compile demo/streamlit_app.py
exit 0

$ ! rg -n 'dipoler\.streamlit\.app' README.md index.html
exit 0

$ git diff --check
exit 0

$ bash $HOME/.claude/scripts/pre-public-sweep.sh .
Blockers (Layer 1-4): 0
Warnings (Layer 5-6): 4

$ gh pr checks 2 --repo zelinewang/dipole
json_only  pass  8s
```

PR head is now `f442e7d94f52278c7a34d2231c121dc4f287cc14`; it remains open and
unmerged.

### Browser boundary

The in-app Browser runtime was retried through its prescribed setup and
troubleshooting flow, but `agent.browsers.list()` returned no available
backend. No local screenshot or runtime-metric claim was fabricated. The exact
source cause/fix and post-push head were returned to the root orchestrator, whose
brain-side browser recheck on exact head `f442e7d` passed at 375x812:

```text
scrollWidth=375
clientWidth=375
scrollX after positive scroll attempt=0
Set Up Locally display=flex, width=208px
View Source on GitHub display=flex, width=262px
#setup present=true
viewport screenshot=visually clean
```

The requested runtime assertions are therefore fully satisfied. PR #2 remains
open and unmerged.

### Final brain adjudication

Accepted on 2026-07-12 18:18 PT. The brain inspected both commits, reran the
full validation aggregator, Python compile, gated-URL check, and diff check,
confirmed the green live `json_only` check, and reproduced the 375x812 browser
acceptance on exact head `f442e7d`. The follow-up PR corrects both the honest
demo boundary and the newly discovered mobile overflow without bypassing or
rewriting the already published PR #1 history.

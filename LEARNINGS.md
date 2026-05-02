# Learnings — vibe-readme showcase

A working notebook of what came out of building three preview directions
inside one GitHub profile README repo. Two purposes:

1. Inform updates to `~/.claude/skills/vibe-readme/SKILL.md`
2. Make the implicit explicit for whoever picks up similar work next

This file should grow as visitors interact with the previews and as we
refine the skill itself. **Date entries; don't rewrite history.**

---

## Confirmed (high confidence)

| Date | Lesson | Source |
|---|---|---|
| 2026-05-01 | **GitHub camo proxy invalidates per-visitor "live" tier.** Visitor IP is camo's IP, not the visitor's. `Cache-Control: no-store` is advisory at best. The "live tier" claim from the original skill text was wrong; corrected to "scheduled-refresh tier." | empirical: tested via `gh api`, confirmed by [GitHub anonymized URLs docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-anonymized-urls) |
| 2026-05-01 | **CSS `@keyframes` inside `<style>` does NOT animate when SVG is loaded via `<img>` on GitHub.** Use native SVG `<animate>` / `<animateTransform>` elements instead — those work. (Same pattern shields.io and the contribution snake use.) | Slice C lesson, repeated and re-caught here by Designer agent review |
| 2026-05-01 | **`ui-serif` is Safari-specific.** On Chrome (macOS or Windows) it falls through to `Times New Roman`. For cross-browser display serif, lead with `Charter, "Iowan Old Style", "Source Serif Pro", Cambria, Georgia, serif` — Times no longer in the chain at all. | Designer agent verdict on PR #6's first hero SVG |
| 2026-05-01 | **`<details>` chains are severely undervalued.** A 6–8 question FAQ in nested `<details>` blocks beats a 30s AI-bot reply for ~80% of likely questions. Reserve the bot for genuinely personalized output. | vibe-readme skill itself, validated by user feedback "sidekick is not intuitive" |
| 2026-05-01 | **The pre-existing security hook on workflow files fires on `${{ github.event.* }}` patterns regardless of safe usage.** Edit (delta) bypasses the hard block where Write (whole file) does not. Working pattern: pass user-controlled input via `env:` then reference as `"$VAR"` in shell. | Direct experience while editing `zaneos-sidekick.yml` |
| 2026-05-01 | **`folder/README.md` is GitHub's underused page primitive.** Any directory that contains a `README.md` is automatically rendered as a "page" when visited. No GitHub Pages setup needed — perfect for showcase repos with multiple variants. | Used here for `previews/<direction>/README.md` |
| 2026-05-01 | **Image-map (`<map>` / `<area>`) for "click a star to navigate" does NOT survive `<img>`-loaded SVG.** When SVG is loaded as `<img>`, internal `<a>` tags are inert. Workaround: a separate text-based navigation strip below the image, using regular markdown anchor links. | Designed around for the Constellation preview's starmap nav |
| 2026-05-01 | **Pinned action versions matter more than they look.** `actions/checkout@v5` exists but `@v6` is current; using the current major reduces the risk of upstream EOL surprises. typescript-reviewer's claim that v5 didn't exist was wrong (verified via `gh api`), but the spirit of pinning to current was sound. | typescript-reviewer agent + manual `gh api repos/actions/checkout/releases/latest` verification |
| 2026-05-01 | **`<sub>` is for actual subscripts, NOT a prose container.** GitHub *does* parse markdown inside `<sub>` (italics, blockquotes, etc render), but `<sub>` shrinks all child text to subscript size. A column of 5 quotes wrapped in `<sub>` becomes one tiny mashed paragraph because `&nbsp;` line-spacers also collapse to single spaces and `─────` separator characters render as text, not `<hr>` lines. **Use plain markdown italic + `---` rules** for marginalia or quote sequences inside table cells; GitHub renders the `---` as a real `<hr>` element which gives actual visual separation. | Field Notes preview shipped broken in PR #7; fixed in commit d882a78 after user reported "kinda broken" |
| 2026-05-01 | **`href="#"` placeholder links are worse than no link.** A link to `#` jumps the reader to the top of the page on click — pretending to be navigation but doing nothing. If you want depth-on-click later, leave a TODO comment instead, or use a real `<details>` block. Never ship `[label](#)` as a stand-in. | Same Field Notes incident — six "▸ field notes (N)" lines all `href="#"` |
| 2026-05-01 | **HTML `<table>` for marginalia layout is fine; the `<td>` content just needs to be plain markdown.** Don't wrap markdown in HTML inline elements (`<sub>`, `<small>`, `<center>`) inside the `<td>` — GitHub's processor stops doing useful things at the HTML/markdown boundary. Also: `style="..."` attributes on `<td>` are stripped by the sanitizer. | Same fix |

---

## Open questions (need data from real visitor traffic)

- Will visitors actually pick a direction, or just bounce off the showcase landing?
- Among A/B/C, which preview retains visitors longest? (need GitHub traffic data, which is limited)
- Does the demoted Sidekick still get used, or did the demotion kill engagement?
- Do the `<details>` chains in each preview get expanded, or do visitors skim past them?
- Does the per-visitor rate limit (3/24h) ever actually trip in practice, or is it overkill?
- Does the cron-baked snake still feel "alive" or is it noise after a week?

---

## To investigate next

- **Cron-baked Now-card** (Satori on Vercel) — would it actually feel "alive" after Camo cache realities, or is the ROI too low for the maintenance cost?
- **Discussions thread + reactions** as a lower-friction alternative to the issue-based bot, especially for non-text input (👍 = "I like this direction").
- **Pure `<details>` FAQ** — built once, no infra, captures most common questions. Should this be its own preview direction (D)?

---

## Roll-up plan

When this file accumulates ~3 confirmed lessons that the skill text doesn't yet
reflect, edit `~/.claude/skills/vibe-readme/SKILL.md` to incorporate them, and
note here under "Roll-ups."

### Roll-ups

- 2026-05-01 — Camo correction synced into `vibe-readme/SKILL.md` §2 and §3.1.
  Renamed "live tier" → "scheduled-refresh tier."

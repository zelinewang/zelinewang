<!--
  Zane Wang's GitHub profile, as a single integrated mega-SVG.
  All design lives in assets/profile.svg (one composition, eight sections):
  §01 whoami · §02 projects · §03 how I work · §04 stats · §05 contribution
  heatmap · §06 stack · §07 philosophy · §08 sidekick. Stats (§04) and the
  snake (§05) refresh nightly via .github/workflows/refresh-stats.yml.

  BRANCH PREVIEW (feat/console-v2): the <img> below points at THIS branch's
  committed assets/profile.svg, so the branch page renders the real new design
  (locally pre-rendered with live stats + snake via render-profile.mjs).

  AT MERGE TO MAIN — two required steps, do NOT skip:
    1. Repoint the <img src> back to the stats-output branch:
       https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg
    2. Run .github/workflows/refresh-stats.yml once (workflow_dispatch) so the
       nightly-rendered SVG republishes to stats-output with fresh stats+snake.
  Leaving the feat/console-v2 raw URL on main would freeze the SVG (that path
  is not refreshed by the cron). Template/script output paths are unchanged, so
  the cron coupling is intact — only the <img src> pointer needs the swap.

  Why no <map>/<area> image-map? GitHub re-renders the <img> at container width
  while <area coords> are pixel-absolute — coords drift and break on mobile.
  So nav lives in the plain-text strips below as real markdown links; the SVG
  rows are inert (it is an <img>), and these links are the clickable layer.

  Two earlier directions (Field Notes, Constellation) are kept under
  previews/_drafts/ — same content, different aesthetic, not currently promoted.
-->

<p>
  <img src="https://raw.githubusercontent.com/zelinewang/zelinewang/feat/console-v2/assets/profile.svg" alt="Zane Wang — ships AI products (building StoryVerse, an AI video generation product, at VisPie) and builds open-source agent infrastructure (claudemem, handoff, dev-orchestrator), rendered as a continuous terminal session" width="100%" />
</p>

**Zane Wang** — ships AI products · builds open-source agent infrastructure  
Currently building **StoryVerse** (AI video generation) at **VisPie** · based in San Francisco  
Open-source agent infrastructure: **[claudemem](https://github.com/zelinewang/claudemem)** · **[handoff](https://github.com/zelinewang/handoff)** · **[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)**  
[GitHub](https://github.com/zelinewang) · [LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [X](https://x.com/zanewang102)

<sub>

`§ 02 projects:`&nbsp;
[claudemem](https://github.com/zelinewang/claudemem) ·
[postprism](https://github.com/zelinewang/postprism-12e78c39) ·
[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator) ·
[FireSight](https://github.com/zelinewang/FireSight) ·
[handoff](https://github.com/zelinewang/handoff) ·
[dipole](https://github.com/zelinewang/dipole)

`§ 03 how i work:`&nbsp;
[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator) — investigate → plan → execute → verify → ship
&nbsp;·&nbsp;
[handoff](https://github.com/zelinewang/handoff) — one brain plans and adjudicates, cheaper hands execute

`§ 04 stats:`&nbsp;
live counts refreshed nightly via [refresh-stats.yml](./.github/workflows/refresh-stats.yml)
&nbsp;·&nbsp; [render-profile.mjs](./.github/scripts/render-profile.mjs)
&nbsp;·&nbsp; [console.svg.template](./.github/templates/console.svg.template)

`§ 05 trajectory:`&nbsp;
365-day contribution snake from [Platane/snk](https://github.com/Platane/snk), regenerated daily

`§ 08 sidekick:`&nbsp;
[ask the bot →](https://github.com/zelinewang/zelinewang/issues/new?title=ZaneOS%20ask%3A%20your%20question%20here&body=Replace%20the%20question%20in%20the%20title.%20A%20workflow%20with%20Zane%27s%20AI%20will%20reply%20in%20this%20issue%20in%20about%2030%20seconds%20and%20close%20it.)

</sub>

---

<sub>

[github](https://github.com/zelinewang) &nbsp;·&nbsp;
[linkedin](https://www.linkedin.com/in/zane-wang7/) &nbsp;·&nbsp;
[x](https://x.com/zanewang102)

</sub>

<sub>

Built with the `vibe-readme` skill (a personal Claude Code skill, not yet
public). The empirical lessons it grew from are open in
[`LEARNINGS.md`](./LEARNINGS.md). Two earlier design directions are
parked under [`previews/_drafts/`](./previews/_drafts/) — same content,
different aesthetic. Single dark theme is intentional: the terminal
metaphor only reads correctly on a dark background, so no
`<picture>` / light variant.

</sub>

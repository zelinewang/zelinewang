<!--
  Zane Wang's GitHub profile, as a single integrated mega-SVG.
  All design lives in assets/profile.svg (one composition, eight sections),
  rendered nightly by .github/workflows/refresh-stats.yml.

  The rendered SVG is published to the `stats-output` branch (not main) so
  the cron bot doesn't touch main's branch-protection ruleset. The README
  references it via raw.githubusercontent — same pattern Platane snake uses.
  Snake itself is fetched from the `output` branch and spliced into §05.

  Why no <map>/<area> image-map? GitHub re-renders the <img> at container width
  while <area coords> are pixel-absolute — coords drift on different viewports
  and break entirely on mobile. So nav lives in the strip below as plain links.

  Two earlier directions (Field Notes, Constellation) are kept under
  previews/_drafts/ — same content, different aesthetic, not currently promoted.
-->

<p>
  <img src="https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg" alt="Zane Wang's profile as a continuous terminal session" width="100%" />
</p>

<sub>

`§ 02 projects:`&nbsp;
[constellix](https://github.com/zelinewang/constellix) ·
[claudemem](https://github.com/zelinewang/claudemem) ·
[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator) ·
[FireSight](https://github.com/zelinewang/FireSight) ·
[PulseConnect](https://github.com/zelinewang/PulseConnect) ·
[santorini](https://github.com/zelinewang/santorini)

`§ 03 fleet:`&nbsp;
[orchestrator overview](https://github.com/zelinewang/dev-orchestrator) — the same five agents the panel above lists, in real code

`§ 04 stats:`&nbsp;
live counts refreshed nightly via [refresh-stats.yml](./.github/workflows/refresh-stats.yml)
&nbsp;·&nbsp; [render-profile.mjs](./.github/scripts/render-profile.mjs)
&nbsp;·&nbsp; [console.svg.template](./.github/templates/console.svg.template)

`§ 05 trajectory:`&nbsp;
365-day contribution snake from [Platane/snk](https://github.com/Platane/snk), regenerated daily

`§ 08 sidekick:`&nbsp;
[ask the bot →](https://github.com/zelinewang/zelinewang/issues/new?title=ZaneOS%20ask%3A%20your%20question%20here&body=Replace%20the%20question%20in%20the%20title.%20A%20workflow%20with%20Zane%27s%20AI%20will%20reply%20in%20this%20issue%20in%20about%2030%20seconds%20and%20close%20it.)

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

</sub>

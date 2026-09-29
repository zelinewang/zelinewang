<!--
  Zane Wang's GitHub profile.

  HERO = one integrated mega-SVG (assets/profile.svg): a single composition in eight
  sections — §01 whoami · §02 projects · §03 how I work · §04 stats · §05 contribution
  heatmap · §06 stack · §07 philosophy · §08 sidekick. Stats (§04) and the snake (§05)
  refresh nightly via .github/workflows/refresh-stats.yml, which renders the SVG and
  publishes it to the stats-output branch — the <img> below points at that fresh copy.

  Why no <map>/<area> image-map? GitHub re-renders the <img> at container width while
  <area coords> are pixel-absolute, so coords drift and break on mobile. The SVG rows
  are therefore inert; the clickable, searchable layer is the "Full profile" <details>
  below, where every load-bearing claim, project link, principle, and contact path
  stays semantic Markdown for mobile readers, assistive technology, search, and
  resume-screening tools.

  Single dark theme is intentional: the terminal metaphor only reads on a dark
  background, so the hero is one theme-aware <img>, not a <picture> light/dark pair.
-->

<p>
  <img src="https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg" alt="Zane Wang — AI systems builder focused on evaluation, agent infrastructure, and evidence-driven workflows; a terminal-style profile in eight sections: whoami, projects, how I work, stats, contribution heatmap, stack, philosophy, and an AI sidekick" width="100%" />
</p>

[GitHub](https://github.com/zelinewang) · [LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [X](https://x.com/zanewang102)

<details>
<summary>▸ Full profile — searchable: focus · selected work · open-source contributions · how I work · contact</summary>

**AI systems builder based in San Francisco.** My production background spans multimodal evaluation, high-volume data systems, workflow automation, and enterprise agents. My current public focus is the infrastructure underneath reliable agents: memory, delegation, and evidence-driven development.

[Explore the work ↓](#selected-work) · [LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [GitHub](https://github.com/zelinewang)

## Current focus

I turn lessons from production AI systems into smaller, public, inspectable tools. The current thread is reliable agent execution across sessions and teams: durable context, bounded delegation, and workflows that keep evidence close to decisions.

**Current public proof:** [claudemem](https://github.com/zelinewang/claudemem) preserves context across coding-agent sessions, [handoff](https://github.com/zelinewang/handoff) measures when delegated execution helps and when coordination cost outweighs the benefit, and [dev-orchestrator](https://github.com/zelinewang/dev-orchestrator) keeps investigation, tests, verification, and shipping in one resumable workflow.

The product experiments below apply the same standard to computer use, real-time data, and deployment without presenting prototypes as production systems.

<a id="selected-work"></a>
## Selected work

### Agent infrastructure

- **[claudemem](https://github.com/zelinewang/claudemem)** — persistent memory for coding agents, using portable Markdown records plus searchable indexing across sessions.
- **[handoff](https://github.com/zelinewang/handoff)** — a spec-and-ledger protocol for token-tiered delegation, published with its pre-registered evaluation and failure direction.
- **[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)** — an end-to-end development workflow that connects investigation, planning, tests, verification, shipping, hooks, and file-backed state.

### Product experiments

- **[PostPrism](https://github.com/zelinewang/postprism)** — a hackathon prototype with a front-end simulation and an experimental backend for parallel computer-use agents.
- **[FireSight](https://github.com/zelinewang/FireSight)** — a client-side wildfire map built around NASA FIRMS feeds and Leaflet.
- **[Dipole](https://github.com/zelinewang/dipole)** — a conversational deployment assistant for Netlify and Vercel with streamed progress and diagnostics.

## Open source contributions

Upstream work in other people's repositories:

- **[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)** — three merged PRs in the 26k-star Claude Code HUD: configurable model display ([#354](https://github.com/jarrodwatts/claude-hud/pull/354)), effort-level display in the model bracket ([#471](https://github.com/jarrodwatts/claude-hud/pull/471)), and a schema-compatibility fix for newer Claude Code releases ([#491](https://github.com/jarrodwatts/claude-hud/pull/491)).
- **[modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)** — a reproducible bug report on v2 declaration source maps ([#2491](https://github.com/modelcontextprotocol/typescript-sdk/issues/2491)), built from published-tarball forensics.
- **[letta-ai/letta](https://github.com/letta-ai/letta)** — three tested fixes staged on [a public fork](https://github.com/zelinewang/letta) and linked from issues [#3310](https://github.com/letta-ai/letta/issues/3310), [#3399](https://github.com/letta-ai/letta/issues/3399), and [#3390](https://github.com/letta-ai/letta/issues/3390): provider rate-limit attribution, slash-label routing with route-shadow regression tests, and a missing client timeout.
- **[bhimamalbhage/lightup](https://github.com/bhimamalbhage/lightup)** — merged multi-chain agent design work ([#3](https://github.com/bhimamalbhage/lightup/pull/3), [#4](https://github.com/bhimamalbhage/lightup/pull/4)).
- **[nextbound/bragi-canvas](https://github.com/nextbound/bragi-canvas)** — an Obsidian canvas plugin; merged upstream bugfix ([#26](https://github.com/nextbound/bragi-canvas/pull/26)).

## How I work

- **Prove before arguing.** A small experiment should be able to overturn the plan.
- **Fix the bottleneck.** Solve the constraint that changes the outcome; defer adjacent cleanup.
- **Keep evidence close to the claim.** Tests, source, logs, and failure cases beat polished confidence.
- **Leave leverage behind.** A delivery should make the next run easier to verify, resume, or reuse.

## Design studies

The **Console** design renders live as the hero above. Two more complete visual interpretations live in the [profile design gallery](./previews/): **Constellation** and **Field Notes** — the same content in a different aesthetic, not alternate claims.

## Contact

[LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [GitHub](https://github.com/zelinewang) · [X](https://x.com/zanewang102)

</details>

<details>
<summary><strong>Ask Zane's AI about the public work</strong></summary>

The sidekick answers from this README, the public persona, the six flagship repositories, and the open source contributions above. It replies in a public GitHub issue and does not speak on Zane's behalf.

[Open a public question →](https://github.com/zelinewang/zelinewang/issues/new?title=ZaneOS%20ask%3A%20your%20question%20here&body=Replace%20the%20question%20in%20the%20title.%20Zane%27s%20AI%20will%20reply%20from%20the%20public%20profile%20context.)
</details>

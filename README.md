<!--
  Zane Wang's GitHub profile.

  HERO = one integrated SVG (assets/profile.svg): a single terminal composition in four
  sections — §01 whoami · §02 projects · §03 merged upstream fixes · §04 how I work.
  Every line in it is static, verifiable content. It is rendered from
  .github/templates/console.svg.template by .github/workflows/refresh-stats.yml and
  published to the stats-output branch; the <img> below points at that copy.

  Why no live stats or contribution snake in the hero? The Action's token only sees
  public activity, so they showed "0 recent pushes" and a near-empty grid while
  GitHub's own graph below the README counts every contribution. The native graph
  is the honest activity signal; the hero carries identity and evidence.

  Why no <map>/<area> image-map? GitHub re-renders the <img> at container width while
  <area coords> are pixel-absolute, so coords drift and break on mobile. The SVG rows
  are therefore inert; the clickable layer is the Markdown directly below the artwork
  (visible on phones, where the SVG text is too small to read) and the "Full profile"
  <details>, where every load-bearing claim, project link, principle, and contact path
  stays semantic Markdown for assistive technology, search, and resume-screening tools.

  Single dark theme is intentional: the terminal metaphor only reads on a dark
  background, so the hero is one <img>, not a <picture> light/dark pair.
-->

<p>
  <img src="https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg" alt="Zane Wang — builds open-source infrastructure for coding agents (claudemem, handoff, dev-orchestrator), with fixes merged upstream in zod, TanStack Query, fastify, axum, SQLx, goose, anyio, tenacity, feast, and claude-hud. A terminal-style profile in four sections: whoami, projects, merged upstream fixes, and how I work." width="100%" />
</p>

**Open source:** [claudemem](https://github.com/zelinewang/claudemem) · [handoff](https://github.com/zelinewang/handoff) · [dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)<br>
**Merged upstream:** [zod](https://github.com/colinhacks/zod/pull/6192) · [TanStack Query](https://github.com/TanStack/query/pull/11065) · [fastify](https://github.com/fastify/fastify/pull/6846) · [axum](https://github.com/tokio-rs/axum/pull/3836) · [SQLx](https://github.com/transact-rs/sqlx/pull/4340) · [goose](https://github.com/aaif-goose/goose/pull/10438) · [anyio](https://github.com/agronholm/anyio/pull/1223) · [tenacity](https://github.com/jd/tenacity/pull/656) · [feast](https://github.com/feast-dev/feast/pull/6604) · [claude-hud](https://github.com/jarrodwatts/claude-hud/pulls?q=is%3Apr+author%3Azelinewang+is%3Amerged)<br>
**Elsewhere:** [LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [X](https://x.com/zanewang102)

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
- **[handoff](https://github.com/zelinewang/handoff)** — a spec-and-ledger protocol for token-tiered delegation, published with its evaluation protocol, results, and failure cases.
- **[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)** — an end-to-end development workflow that connects investigation, planning, tests, verification, shipping, hooks, and file-backed state.

### Product experiments

- **[PostPrism](https://github.com/zelinewang/postprism)** — a hackathon prototype with a front-end simulation and an experimental backend for parallel computer-use agents.
- **[FireSight](https://github.com/zelinewang/FireSight)** — a client-side wildfire map built around NASA FIRMS feeds and Leaflet.
- **[Dipole](https://github.com/zelinewang/dipole)** — a conversational deployment assistant for Netlify and Vercel with streamed progress and diagnostics.

## Open source contributions

Small, tested fixes in widely used libraries, each accepted and merged by the project's maintainers:

| Project | What the fix does | PR |
| --- | --- | --- |
| [zod](https://github.com/colinhacks/zod) | `.catch()` callbacks receive the original input instead of the coerced value, as documented | [#6192](https://github.com/colinhacks/zod/pull/6192) |
| [TanStack Query](https://github.com/TanStack/query) | `combine` results that are falsy (`0`, `false`, `""`, `null`) are memoized instead of recomputed | [#11065](https://github.com/TanStack/query/pull/11065) |
| [fastify](https://github.com/fastify/fastify) | content-type parsers registered with a global or sticky RegExp no longer miss matches because of a stale `lastIndex` | [#6846](https://github.com/fastify/fastify/pull/6846) |
| [axum](https://github.com/tokio-rs/axum) | merging `MethodRouter` instances no longer repeats methods in the `Allow` header (`GET,HEAD,HEAD`) | [#3836](https://github.com/tokio-rs/axum/pull/3836) |
| [SQLx](https://github.com/transact-rs/sqlx) | SQLite `REAL` datetimes before 1970 decode to the correct sub-second value | [#4340](https://github.com/transact-rs/sqlx/pull/4340) |
| [goose](https://github.com/aaif-goose/goose) | a custom model that is not in the provider's list can be saved as the default for a new chat | [#10438](https://github.com/aaif-goose/goose/pull/10438) |
| [anyio](https://github.com/agronholm/anyio) | the asyncio `CapacityLimiter` stops over-granting tokens when `total_tokens` is raised while over-subscribed | [#1223](https://github.com/agronholm/anyio/pull/1223) |
| [tenacity](https://github.com/jd/tenacity) | `wait_exponential` returns a wait time instead of raising in a narrow floating-point underflow case | [#656](https://github.com/jd/tenacity/pull/656) |
| [feast](https://github.com/feast-dev/feast) | `feast[flink]` becomes installable again by fixing contradictory PyArrow constraints | [#6604](https://github.com/feast-dev/feast/pull/6604) |
| [claude-hud](https://github.com/jarrodwatts/claude-hud) | configurable model display, effort-level display, and a schema fix for newer Claude Code releases | [#354](https://github.com/jarrodwatts/claude-hud/pull/354), [#471](https://github.com/jarrodwatts/claude-hud/pull/471), [#491](https://github.com/jarrodwatts/claude-hud/pull/491) |

Also: a reproducible bug report on the MCP TypeScript SDK's v2 declaration source maps ([modelcontextprotocol/typescript-sdk#2491](https://github.com/modelcontextprotocol/typescript-sdk/issues/2491)), built from published-tarball forensics.

## How I work

- **Prove before arguing.** A small experiment should be able to overturn the plan.
- **Fix the bottleneck.** Solve the constraint that changes the outcome; defer adjacent cleanup.
- **Keep evidence close to the claim.** Tests, source, logs, and failure cases beat polished confidence.
- **Leave leverage behind.** A delivery should make the next run easier to verify, resume, or reuse.

## Design studies

The **Console** design is the hero above. Two more complete visual interpretations live in the [profile design gallery](./previews/): **Constellation** and **Field Notes** — the same content in a different aesthetic, not alternate claims.

## Contact

[LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [GitHub](https://github.com/zelinewang) · [X](https://x.com/zanewang102)

</details>

<details>
<summary><strong>Ask Zane's AI about the public work</strong></summary>

The sidekick answers from this README, the public persona, the six flagship repositories, and the open source contributions above. It replies in a public GitHub issue and does not speak on Zane's behalf.

[Open a public question →](https://github.com/zelinewang/zelinewang/issues/new?title=ZaneOS%20ask%3A%20your%20question%20here&body=Replace%20the%20question%20in%20the%20title.%20Zane%27s%20AI%20will%20reply%20from%20the%20public%20profile%20context.)
</details>

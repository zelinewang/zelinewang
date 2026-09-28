<!--
  Zane Wang's GitHub profile.

  HERO = one integrated SVG (assets/profile.svg): a single terminal composition in three
  sections — §01 whoami · §02 merged upstream · §03 tools. Every line in it is static,
  verifiable content. It is rendered from .github/templates/console.svg.template by
  .github/workflows/refresh-stats.yml and published to the stats-output branch; the
  <img> below points at that copy.

  Why no live stats or contribution snake in the hero? The Action's token only sees
  public activity, so they showed "0 recent pushes" and a near-empty grid while
  GitHub's own graph below the README counts every contribution. The native graph
  is the honest activity signal; the hero carries identity and evidence.

  Why is the evidence repeated as Markdown under the artwork? GitHub re-renders the
  <img> at container width, so the SVG text is unreadable on phones and inert
  everywhere (no <map>/<area>: coords are pixel-absolute and drift). The list below
  is the clickable, searchable layer: every claim links to the merged PR, so it works
  for mobile readers, assistive technology, search, and resume-screening tools.

  Single dark theme is intentional: the terminal metaphor only reads on a dark
  background, so the hero is one <img>, not a <picture> light/dark pair.
-->

<p>
  <img src="https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg" alt="Zane Wang — builds open-source infrastructure for coding agents (claudemem, handoff, dev-orchestrator), with bug fixes merged upstream in zod, TanStack Query, fastify, axum, SQLx, goose, anyio, tenacity, feast, and claude-hud. A terminal-style profile in three sections: whoami, merged upstream, tools." width="100%" />
</p>

**Merged upstream:** [zod](https://github.com/colinhacks/zod/pull/6192) · [TanStack Query](https://github.com/TanStack/query/pull/11065) · [fastify](https://github.com/fastify/fastify/pull/6846) · [axum](https://github.com/tokio-rs/axum/pull/3836) · [SQLx](https://github.com/transact-rs/sqlx/pull/4340) · [goose](https://github.com/aaif-goose/goose/pull/10438) · [anyio](https://github.com/agronholm/anyio/pull/1223) · [tenacity](https://github.com/jd/tenacity/pull/656) · [feast](https://github.com/feast-dev/feast/pull/6604) · [claude-hud](https://github.com/jarrodwatts/claude-hud/pulls?q=is%3Apr+author%3Azelinewang+is%3Amerged)<br>
**Open-source tools:** [claudemem](https://github.com/zelinewang/claudemem) · [handoff](https://github.com/zelinewang/handoff) · [dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)<br>
**Elsewhere:** [LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [X](https://x.com/zanewang102)

## Merged upstream

Bug fixes in libraries other people depend on, each reviewed and merged by that project's maintainers. No issue existed for seven of the nine library fixes: the bug was found by reading the code, then fixed with a regression test.

- **[zod](https://github.com/colinhacks/zod)** [#6192](https://github.com/colinhacks/zod/pull/6192) — `.catch()` callbacks receive the original input instead of the coerced value, as documented. *TypeScript*
- **[TanStack Query](https://github.com/TanStack/query)** [#11065](https://github.com/TanStack/query/pull/11065) — `combine` results that are falsy (`0`, `false`, `""`, `null`) are memoized instead of recomputed. *TypeScript*
- **[fastify](https://github.com/fastify/fastify)** [#6846](https://github.com/fastify/fastify/pull/6846) — content-type parsers registered with a global or sticky RegExp no longer miss matches because of a stale `lastIndex`. *JavaScript*
- **[axum](https://github.com/tokio-rs/axum)** [#3836](https://github.com/tokio-rs/axum/pull/3836) — merging `MethodRouter` instances no longer repeats methods in the `Allow` header (`GET,HEAD,HEAD`). *Rust*
- **[SQLx](https://github.com/transact-rs/sqlx)** [#4340](https://github.com/transact-rs/sqlx/pull/4340) — SQLite `REAL` datetimes before 1970 decode to the correct sub-second value. *Rust*
- **[goose](https://github.com/aaif-goose/goose)** [#10438](https://github.com/aaif-goose/goose/pull/10438) — a custom model that is not in the provider's list can be saved as the default for a new chat; closes a bug three users reported. *Rust*
- **[anyio](https://github.com/agronholm/anyio)** [#1223](https://github.com/agronholm/anyio/pull/1223) — the asyncio `CapacityLimiter` stops over-granting tokens when `total_tokens` is raised while over-subscribed. *Python*
- **[tenacity](https://github.com/jd/tenacity)** [#656](https://github.com/jd/tenacity/pull/656) — `wait_exponential` returns a wait time instead of raising in a narrow floating-point underflow case. *Python*
- **[feast](https://github.com/feast-dev/feast)** [#6604](https://github.com/feast-dev/feast/pull/6604) — `feast[flink]` becomes installable again by fixing contradictory PyArrow constraints; closes a reported issue. *Python*
- **[claude-hud](https://github.com/jarrodwatts/claude-hud)** [#354](https://github.com/jarrodwatts/claude-hud/pull/354), [#471](https://github.com/jarrodwatts/claude-hud/pull/471), [#491](https://github.com/jarrodwatts/claude-hud/pull/491) — configurable model display, effort-level display, and a schema fix for newer Claude Code releases. *TypeScript*

Also: a reproducible bug report on the MCP TypeScript SDK's v2 declaration source maps ([modelcontextprotocol/typescript-sdk#2491](https://github.com/modelcontextprotocol/typescript-sdk/issues/2491)), built from published-tarball forensics.

## Open-source tools

The infrastructure I use to find, test, and ship work like the fixes above:

- **[claudemem](https://github.com/zelinewang/claudemem)** (Go) — persistent memory for coding agents: portable Markdown records plus full-text and semantic search across sessions.
- **[handoff](https://github.com/zelinewang/handoff)** — a spec-and-ledger protocol for token-tiered delegation, published with its evaluation protocol, results, and failure cases.
- **[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)** — an end-to-end development workflow that connects investigation, planning, tests, verification, shipping, hooks, and file-backed state.

<details>
<summary>▸ More — background · how I work · earlier experiments · contact</summary>

## Background

**AI systems builder based in San Francisco.** My production background spans multimodal evaluation, high-volume data systems, workflow automation, and enterprise agents. My current public focus is the infrastructure underneath reliable agents: memory, delegation, and evidence-driven development — turning lessons from production AI systems into smaller, public, inspectable tools.

## How I work

- **Prove before arguing.** A small experiment should be able to overturn the plan.
- **Fix the bottleneck.** Solve the constraint that changes the outcome; defer adjacent cleanup.
- **Keep evidence close to the claim.** Tests, source, logs, and failure cases beat polished confidence.
- **Leave leverage behind.** A delivery should make the next run easier to verify, resume, or reuse.

## Earlier experiments

Hackathon-scale builds, kept public and labelled as such: [FireSight](https://github.com/zelinewang/FireSight) (a client-side wildfire map on NASA FIRMS feeds), [Dipole](https://github.com/zelinewang/dipole) (a conversational deployment assistant for Netlify and Vercel), and [PostPrism](https://github.com/zelinewang/postprism) (a computer-use prototype whose hosted front end is a simulation).

## Contact

[LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [GitHub](https://github.com/zelinewang) · [X](https://x.com/zanewang102)

</details>

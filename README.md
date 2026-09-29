<!--
  Zane Wang's GitHub profile.

  HERO = one integrated SVG. The current designs carry the same content: Dusk (a
  pixel-art sunset over a city drawn from the contribution calendar, with the upstream
  pull requests beneath it), Console (a terminal session) and Sunset (the terminal
  session opened by a sunset banner). ACTIVE_DESIGN in .github/scripts/render-profile.mjs
  picks the live one. .github/workflows/refresh-stats.yml renders every design nightly
  with fresh activity numbers and publishes the live one to the stats-output branch as
  profile.svg, plus its phone layout as profile-phone.svg (the desktop render again when
  a design has none), and every design to stats-output/studies/ for the gallery in
  previews/. The <picture> below serves the phone layout under 600 px.

  Why no <map>/<area> image-map? GitHub re-renders the <img> at container width while
  <area coords> are pixel-absolute, so coords drift and break on mobile. The SVG rows
  are therefore inert; the clickable, searchable layer is the "Full profile" <details>
  below, where every load-bearing claim, pull request, project link, and contact path
  stays semantic Markdown for mobile readers, assistive technology, search, and
  resume-screening tools.

  Single dark theme is intentional: the dusk and terminal pictures only read on a dark
  background, so the <picture> switches on width, not on light/dark theme.
-->

<p>
  <picture>
    <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile-phone.svg">
    <img src="https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg" alt="Zane Wang — building tools that make AI coding agents more reliable. A terminal-style profile: 12 pull requests merged into 10 upstream projects (axum, SQLx, AnyIO, goose, Fastify, Zod, TanStack Query, Tenacity, Feast, Claude HUD), the tools he maintains (claudemem, handoff, dev-orchestrator), how he works, and activity from his GitHub contribution calendar. Every link is in the text below." width="100%" />
  </picture>
</p>

<details>
<summary>Full profile: every merged pull request with its link, the tools I maintain, current focus, how I work, contact</summary>

**AI systems builder based in San Francisco.** My production background spans multimodal evaluation, high-volume data systems, workflow automation, and enterprise agents. My current public focus is the infrastructure underneath reliable coding agents: memory, delegation, and evidence-driven development.

## Merged upstream

Ten bug fixes and two small features in projects other people depend on, each merged by that project's maintainers. I use AI coding agents to find candidates and draft fixes, then reproduce each bug, verify the fix and its regression test locally, and see the pull request through review.

- **[axum](https://github.com/tokio-rs/axum)** (Rust web framework): the `Allow` header no longer lists `HEAD` twice after a `get` route is merged with a separate `head` route; four review comments addressed the same day. [#3836](https://github.com/tokio-rs/axum/pull/3836)
- **[SQLx](https://github.com/transact-rs/sqlx)** (Rust SQL toolkit): pre-1970 datetimes stored as SQLite `REAL` (Julian day) values no longer decode up to two seconds off. [#4340](https://github.com/transact-rs/sqlx/pull/4340)
- **[AnyIO](https://github.com/agronholm/anyio)** (Python async I/O): the asyncio `CapacityLimiter` no longer grants more tokens than it has when `total_tokens` is raised while it is over-subscribed. [#1223](https://github.com/agronholm/anyio/pull/1223)
- **[goose](https://github.com/aaif-goose/goose)** (open-source AI agent): saving a custom model that is not in the provider's list as the default for a new chat no longer fails with `Invalid params`, a regression three users reported. [#10438](https://github.com/aaif-goose/goose/pull/10438)
- **[Fastify](https://github.com/fastify/fastify)** (Node.js web framework): content-type parsers registered with a global or sticky RegExp no longer miss matches because of a stale `lastIndex`; approved by two maintainers. [#6846](https://github.com/fastify/fastify/pull/6846)
- **[Zod](https://github.com/colinhacks/zod)** (TypeScript schema validation): `.catch()` callbacks receive the original input instead of the coerced value, as the documentation describes. [#6192](https://github.com/colinhacks/zod/pull/6192)
- **[TanStack Query](https://github.com/TanStack/query)** (data fetching): `combine` results that are falsy (`0`, `false`, `""`, `null`) are memoized instead of being recomputed. [#11065](https://github.com/TanStack/query/pull/11065)

Also merged: a narrow floating-point edge case in [Tenacity](https://github.com/jd/tenacity)'s `wait_exponential` ([#656](https://github.com/jd/tenacity/pull/656)); the maintainers' proposed fix for contradictory PyArrow constraints that made `feast[flink]` uninstallable in [Feast](https://github.com/feast-dev/feast) ([#6604](https://github.com/feast-dev/feast/pull/6604)); and in [Claude HUD](https://github.com/jarrodwatts/claude-hud), two display features ([#354](https://github.com/jarrodwatts/claude-hud/pull/354), [#471](https://github.com/jarrodwatts/claude-hud/pull/471)) and a fix for a crash my #471 caused once Claude Code started sending `effort` as an object ([#491](https://github.com/jarrodwatts/claude-hud/pull/491)).

## Tools I maintain

- **[claudemem](https://github.com/zelinewang/claudemem)** (Go): local-first memory for coding agents. Markdown files are the record; a SQLite full-text and vector index is a rebuildable cache over them. About 11,000 lines of Go code, not counting blank lines and comments, with nearly as much test code, CI, and release binaries for macOS, Linux, and Windows.
- **[handoff](https://github.com/zelinewang/handoff)**: a protocol for handing work from a lead model to cheaper models, with resumable spec files and a published small-sample evaluation that includes the run where delegation lost.
- **[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)**: a Claude Code plugin that takes a task from investigation through tests and verification to a pull request.

## Current focus

I turn lessons from production AI systems into smaller, public, inspectable tools. The current thread is reliable agent execution across sessions and teams: durable context, bounded delegation, and workflows that keep evidence close to decisions.

## Earlier experiments

Small demos and hackathon builds, labeled as such in their READMEs: [FireSight](https://github.com/zelinewang/FireSight) (a client-side wildfire map on NASA FIRMS feeds), [Dipole](https://github.com/zelinewang/dipole) (a demo agent that deploys a web project to Netlify or Vercel from a chat prompt), and [PostPrism](https://github.com/zelinewang/postprism) (a computer-use prototype whose hosted front end is a simulation).

## How I work

- **Prove before arguing.** A small experiment should be able to overturn the plan.
- **Fix the bottleneck.** Solve the constraint that changes the outcome; defer adjacent cleanup.
- **Keep evidence close to the claim.** Tests, source, logs, and failure cases beat polished confidence.
- **Leave leverage behind.** A delivery should make the next run easier to verify, resume, or reuse.

## Contact

[LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [X](https://x.com/zanewang102)

</details>

<details>
<summary><strong>Ask Zane's AI about the public work</strong></summary>

The sidekick answers from this README, the public persona, the six public repositories named above, and the merged pull requests listed above. It replies in a public GitHub issue and does not speak on Zane's behalf.

[Open a public question →](https://github.com/zelinewang/zelinewang/issues/new?title=ZaneOS%20ask%3A%20your%20question%20here&body=Replace%20the%20question%20in%20the%20title.%20Zane%27s%20AI%20will%20reply%20from%20the%20public%20profile%20context.)
</details>

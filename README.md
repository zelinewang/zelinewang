<!--
  Zane Wang's GitHub profile.

  HERO = one SVG card (assets/profile.svg): the claim, the ten upstream projects with
  their PR numbers, and the three own tools. It is rendered from
  .github/templates/console.svg.template by .github/workflows/refresh-stats.yml and
  published to the stats-output branch; the <img> below points at that copy and links
  to the list it summarizes. Every line is static and verifiable: no live stats (the
  Action's token only sees public activity) and no animation.

  The Markdown below the card repeats nothing the card already says in full: the card
  names the projects, the list says what each PR changed and links it. Phones and
  screen-reading tools rely on the list, because the card's text is too small there.

  Single dark card on purpose: GitHub's dark palette with a 1 px border and 6 px
  radius reads as a native card in both light and dark mode.
-->

<p><a href="#merged-upstream"><img src="https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg" alt="Zane Wang: 12 pull requests merged into 10 upstream projects (axum, SQLx, AnyIO, goose, Fastify, Zod, TanStack Query, Tenacity, Feast, Claude HUD) and his own tools claudemem, handoff, and dev-orchestrator. The same content follows as text." width="100%"></a></p>

## Merged upstream

Bug fixes in libraries other people depend on, each merged by that project's maintainers. I use AI coding agents to find candidates and draft fixes, then reproduce each bug, verify the fix and its regression test locally, and see the pull request through review.

- **[axum](https://github.com/tokio-rs/axum)** (Rust web framework): the `Allow` header no longer lists `HEAD` twice after a `get` route is merged with a separate `head` route; four review comments addressed the same day. [#3836](https://github.com/tokio-rs/axum/pull/3836)
- **[SQLx](https://github.com/transact-rs/sqlx)** (Rust SQL toolkit): pre-1970 datetimes stored as SQLite `REAL` (Julian day) values no longer decode up to two seconds off. [#4340](https://github.com/transact-rs/sqlx/pull/4340)
- **[AnyIO](https://github.com/agronholm/anyio)** (Python async I/O): the asyncio `CapacityLimiter` no longer grants more tokens than it has when `total_tokens` is raised while it is over-subscribed. [#1223](https://github.com/agronholm/anyio/pull/1223)
- **[goose](https://github.com/aaif-goose/goose)** (open-source AI agent): saving a custom model that is not in the provider's list as the default for a new chat no longer fails with `Invalid params`, a regression three users reported. [#10438](https://github.com/aaif-goose/goose/pull/10438)
- **[Fastify](https://github.com/fastify/fastify)** (Node.js web framework): content-type parsers registered with a global or sticky RegExp no longer miss matches because of a stale `lastIndex`; approved by two maintainers. [#6846](https://github.com/fastify/fastify/pull/6846)
- **[Zod](https://github.com/colinhacks/zod)** (TypeScript schema validation): `.catch()` callbacks receive the original input instead of the coerced value, as the documentation describes. [#6192](https://github.com/colinhacks/zod/pull/6192)
- **[TanStack Query](https://github.com/TanStack/query)** (data fetching): `combine` results that are falsy (`0`, `false`, `""`, `null`) are memoized instead of being recomputed. [#11065](https://github.com/TanStack/query/pull/11065)

Also merged: a narrow floating-point edge case in [Tenacity](https://github.com/jd/tenacity)'s `wait_exponential` ([#656](https://github.com/jd/tenacity/pull/656)); the maintainers' proposed fix for contradictory PyArrow constraints that made `feast[flink]` uninstallable in [Feast](https://github.com/feast-dev/feast) ([#6604](https://github.com/feast-dev/feast/pull/6604)); and in [Claude HUD](https://github.com/jarrodwatts/claude-hud), two display features ([#354](https://github.com/jarrodwatts/claude-hud/pull/354), [#471](https://github.com/jarrodwatts/claude-hud/pull/471)) and a fix for a crash my #471 caused once Claude Code started sending `effort` as an object ([#491](https://github.com/jarrodwatts/claude-hud/pull/491)).

## Tools I maintain

- **[claudemem](https://github.com/zelinewang/claudemem)** (Go): local-first memory for coding agents. Markdown files are the record; a SQLite full-text and vector index is a rebuildable cache over them. About 14,500 lines of Go with nearly as much test code, CI, and release binaries for macOS, Linux, and Windows.
- **[handoff](https://github.com/zelinewang/handoff)**: a protocol for handing work from a lead model to cheaper models, with resumable spec files and a published small-sample evaluation that includes the run where delegation lost.
- **[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)**: a Claude Code plugin that takes a task from investigation through tests and verification to a pull request.

<details>
<summary>More: background, how I work, earlier experiments, contact</summary>

### Background

**AI systems engineer in San Francisco.** My production background covers multimodal evaluation, high-volume data systems, workflow automation, and enterprise agents. My current public focus is what reliable coding agents need underneath: memory, delegation, and evidence-driven workflows, built as small tools anyone can inspect.

### How I work

- **Prove before arguing.** A small experiment should be able to overturn the plan.
- **Fix the bottleneck.** Solve the constraint that changes the outcome; defer adjacent cleanup.
- **Keep evidence close to the claim.** Tests, source, logs, and failure cases beat polished confidence.
- **Leave the next person less work.** Every delivery should make the next change easier to verify, resume, or reuse.

### Earlier experiments

Small demos and hackathon builds, labeled as such in their READMEs: [FireSight](https://github.com/zelinewang/FireSight) (a client-side wildfire map on NASA FIRMS feeds), [Dipole](https://github.com/zelinewang/dipole) (a demo agent that deploys a web project to Netlify or Vercel from a chat prompt), and [PostPrism](https://github.com/zelinewang/postprism) (a computer-use prototype whose hosted front end is a simulation).

### Contact

[LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [X](https://x.com/zanewang102)

</details>

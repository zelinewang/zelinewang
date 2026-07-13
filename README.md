<!--
  Zane Wang — GitHub profile README (Professional direction).
  Fully static and text-first: every load-bearing line is real markdown, so
  recruiters and AI resume screeners read it directly (not from pixels).

  The single visual is an editorial hero card (assets/hero-signal{,-dark}.svg),
  theme-switched with <picture> + prefers-color-scheme (officially supported by
  GitHub). Asset paths are relative, so they resolve on any branch and survive a
  merge to main untouched. This README is fully static and pulls nothing from the
  nightly cron branches — it does not depend on the scheduled profile render.
-->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-signal-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-signal.svg">
  <img src="assets/hero-signal.svg" alt="Zane Wang — building AI video-generation products and open-source infrastructure for AI agents" width="100%">
</picture>

**Zane Wang** — building AI video-generation products, and open-source infrastructure for AI agents.

I ship AI products and the open-source tooling that makes coding agents reliable: durable
memory, token-tiered delegation, and a one-command development lifecycle. Based in San Francisco.

> **Now** · building `claudemem`, `handoff`, and `dev-orchestrator` in public · shipping AI video-generation products · San Francisco

## Projects

**AI products**

- **[postprism](https://github.com/zelinewang/postprism-12e78c39)** · TypeScript — full-stack AI automation app; watch agents finish real tasks. React + Bun + Supabase, deploy-ready.
- **[FireSight](https://github.com/zelinewang/FireSight)** · Python — real-time wildfire intelligence on NASA satellite data, with live risk mapping.
- **[dipole](https://github.com/zelinewang/dipole)** · JavaScript — AI-agent demo for faster deploys: an autonomous loop validates and ships changes.

**Agent infrastructure**

- **[claudemem](https://github.com/zelinewang/claudemem)** · Go — agent memory for Claude Code: notes and session summaries, FTS5 + semantic search, zero-network CLI.
- **[dev-orchestrator](https://github.com/zelinewang/dev-orchestrator)** · Shell — one-command AI dev lifecycle: investigation-first tiering, TDD, seven-rule verification.
- **[handoff](https://github.com/zelinewang/handoff)** · Shell — token-tiered delegation for agent harnesses: the lead model designs and adjudicates, cheaper executors run it.

## How I work

- **Prove before arguing.** A twenty-line spike settles a design debate faster than a meeting.
- **Fix the actual bottleneck, defer the rest.** One root cause per change, not a refactor-everything PR.
- **Let measurements overturn my assumptions.** When a load test contradicts my "optimized" query, I revert instead of rationalizing.
- **Keep it simple enough to hand off.** Code a new teammate reads in thirty seconds beats a clever abstraction only I understand.
- **Leave leverage behind.** Every delivery drops something reusable — a utility, a runbook, a lesson written down — so the next task is cheaper.

## Contact

[GitHub](https://github.com/zelinewang) · [LinkedIn](https://www.linkedin.com/in/zane-wang7/) · [X](https://x.com/zanewang102)

---

_Curious how I think? [Ask my AI sidekick anything &rarr;](https://github.com/zelinewang/zelinewang/issues/new?title=ZaneOS%20ask%3A%20your%20question%20here&body=Replace%20the%20question%20in%20the%20title.%20A%20workflow%20with%20Zane%27s%20AI%20will%20reply%20in%20this%20issue%20in%20about%2030%20seconds%20and%20close%20it.) — it opens a GitHub issue, replies in about 30 seconds, and closes it._

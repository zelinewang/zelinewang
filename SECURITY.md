# SECURITY.md — threat model for ZaneOS Sidekick

This profile runs an AI sidekick (`.github/scripts/sidekick.mjs`,
triggered by issues with `ZaneOS …` titles). This file documents what
the bot is and isn't designed to defend against, so curious readers
and serious adversaries both know where the surface is small and
where it's accepted-risk.

If you find a real vulnerability not described here, use GitHub's
private vulnerability reporting flow for this repository. If that is
unavailable, open an issue with title `Security:` and a brief
description. Do **not** include exploit details in the title or body.

## Trust boundary

The bot has access to **only** these inputs at runtime:

| Source | What's in it | Sensitivity |
|---|---|---|
| `ZANE_PERSONA.md` | Voice, four modes, public-project ground truth | Public |
| `AGENTS.md` | Hard guardrails (privacy, anti-impersonation, anti-injection) | Public |
| Issue title + body + author handle | Submitted by the asker | Untrusted |
| `DEEPSEEK_API_KEY` | API credential, GitHub Actions repo secret | Secret |

That's the full list. The bot does **not** read:

- Email, calendar, messaging, or any other personal account
- Any private repository
- Any file on Zane's machines
- Any webhook from elsewhere
- Issue comments (the workflow only fires on `issues: opened`, not
  `issue_comment`, so comment bodies never enter the prompt)

If a clever prompt extracts the entire system prompt verbatim, the
worst-case data leak is the contents of `ZANE_PERSONA.md` + `AGENTS.md`
— both of which are already public in this repo. The
**publishability of the prompt is not the security boundary**; the
absence of private data in the bot's input set is.

## Workflow trigger surface

`.github/workflows/zaneos-sidekick.yml`:

```yaml
on:
  issues:
    types:
      - opened
```

This is the **load-bearing security property**. It means:

- Pull requests do **not** trigger the workflow → fork-PR cannot
  exfiltrate secrets via injected workflow code
- Issue comments do **not** trigger the workflow → comment threads
  cannot drive the bot at all
- Only freshly-opened issues trigger one run, with the script version
  living on `main` at trigger time

`pull_request_target` (the trigger that DOES grant secrets to fork PRs)
is not used anywhere in this repo — verified by grep on every workflow
file. Adding it would be a critical change requiring this section to
be re-evaluated.

## Cost / abuse caps

Per-issue path before any model call:

```
issue opened → workflow run → rate-limit gate → (pass) → model call
                                              → (limit hit) → refusal comment, no model call
```

Rate-limit gate (in the workflow YAML, not the model script — fails
closed):

| Knob | Value | Effect |
|---|---|---|
| `PER_USER_DAILY_LIMIT` | 3 | Same author → max 3 ZaneOS issues / 24h |
| `GLOBAL_DAILY_LIMIT` | 50 | All authors combined → max 50 / 24h |
| `AUTHOR_ALLOWLIST` | `zelinewang` | Owner bypasses per-user (still subject to global) |

Worst-case daily spend by a sock-puppet attacker (50 fresh GitHub
accounts, each opens 1 issue): 50 model calls. At DeepSeek V4 Flash
pricing this rounds to single-digit US cents per day. Acceptable.

## Prompt-injection posture

`AGENTS.md` declares the bot's response to common injection patterns
(`ignore previous instructions`, fake `system:` markers, "you are now
…", "as Zane I authorize…"). The instruction is to **silently ignore
the injection and answer the apparent intent**.

**Honest disclosure**: this is a soft defense. No LLM is provably
injection-proof. The hard defense is what the previous section says —
the bot has no private data to leak even when injection succeeds.

## Accepted risks (NOT mitigated)

These are real but small enough that mitigating them costs more than
the risk:

1. **Sock-puppet rate-limit bypass**. An attacker with N GitHub
   accounts can spend up to N model calls/day until the global cap.
   Cap is what bounds damage; identity per-user is best-effort.
2. **Bot voice imitation in comments**. Anyone can post a comment
   under a ZaneOS issue impersonating the bot's voice. Only replies
   from `github-actions[bot]` are real bot output.
3. **Slow model latency**. DeepSeek can take >30s. Workflow timeout
   is 5 minutes. Concurrent issue spam may cause queueing.
4. **Public AGENTS.md telegraphs which attacks we anticipate**. Net
   judged neutral — most attackers probe regardless, and honest
   readers benefit from seeing the discipline.

## Procedural risk (operator's responsibility)

The architecture above assumes:

- **Branch protection on `main` stays enabled.** Deletion / non-fast-
  forward / direct push are blocked at the GitHub ruleset layer; PRs
  need 1 review. Maintainer admin-bypass is allowed only after
  reading the diff.
- **PRs from external contributors are diff-reviewed before merge,
  every time.** A merged PR can change the workflow file or the
  scripts that read secrets. `--admin` merge bypasses GitHub's
  enforcement; the discipline must come from the operator.
- **Repository secrets are set via `gh secret set` with stdin pipe**,
  not `--body` and not in shell history. Real secret values never
  appear in committed files (verified by 4-layer audit on
  2026-05-02 against the live `DEEPSEEK_API_KEY`).
- **`AGENTS.md` and `ZANE_PERSONA.md` changes are diff-reviewed too.**
  A weakened guardrail file is a security degradation even though
  the change looks like docs.

## Reporting a vulnerability

Use the repository's private vulnerability reporting flow. If you
must use a public issue, use title `Security:` followed by a one-line
summary of the surface (e.g. `Security: trigger discovery`). Do not
include exploit details in the public title or body. Zane will move
the conversation to a private channel and follow up.

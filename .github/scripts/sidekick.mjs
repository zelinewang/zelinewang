// .github/scripts/sidekick.mjs
//
// ZaneOS Sidekick — replies to GitHub issues with a real Claude Haiku model.
//
// Invoked from .github/workflows/zaneos-sidekick.yml when an issue is opened
// whose title starts with "ZaneOS ".
//
// Inputs (env):
//   ANTHROPIC_API_KEY   — required, set as a repo secret
//   ZANEOS_DEBUG        — optional, "1" prints the rendered prompt instead of calling the API
//
// Inputs (CLI args, JSON-encoded):
//   { issueTitle, issueBody, issueNumber, issueAuthor, repoOwner, repoName }
//
// Output (stdout): the reply markdown body. The workflow takes this and posts it.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// SDK is lazy-imported inside generateReply so DEBUG mode and unit tests can run
// without the @anthropic-ai/sdk package installed.

const MODEL = "claude-haiku-4-5-20251001"; // small, fast, cheap; matches "fast responses with great latency" brief

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

// ── Mode detection ────────────────────────────────────────────────────────────

const MODE_PATTERNS = [
  { name: "ask",   re: /^ZaneOS\s+ask[:\s]/i },
  { name: "match", re: /^ZaneOS\s+match[:\s]/i },
  { name: "boop",  re: /^ZaneOS\s+boop[:\s]/i },
  { name: "quest", re: /^ZaneOS\s+quest[:\s]/i },
];

export function detectMode(title) {
  for (const { name, re } of MODE_PATTERNS) {
    if (re.test(title)) return name;
  }
  return "ask"; // fallback: treat unknown ZaneOS-prefixed titles as ask
}

// ── Prompt construction ───────────────────────────────────────────────────────

const MODE_INSTRUCTIONS = {
  ask: `The asker has used ASK mode. Answer their question about Zane's work, stack, or thinking. Reference public projects when relevant. Stay grounded in the persona file.`,
  match: `The asker has used MATCH mode. Their GitHub handle should appear in the title (look for an @-mention). Generate a thoughtful, specific overlap analysis: shared territories, complementary skills, one collaboration angle. Score between 35-90% — never 100, never below 30. Be earnest, not horoscope-vague.`,
  boop: `The asker has used BOOP mode. Take the ingredients (topics) from the title and propose ONE small prototype idea that combines them with a useful-strange angle. The angle is the point. Keep it under 80 words. End with a one-line "what would be hard about it" honesty note.`,
  quest: `The asker has used QUEST mode. Generate a "side quest card" — a small, well-shaped technical challenge in the topic area. Include: the quest, the hidden lesson, the time-box, and one stretch goal. Keep it tight. Around 120 words.`,
};

export async function buildPrompt({ issueTitle, issueBody, issueAuthor }) {
  const persona = await readFile(resolve(repoRoot, "ZANE_PERSONA.md"), "utf8");
  const mode = detectMode(issueTitle);
  const modeInstruction = MODE_INSTRUCTIONS[mode];

  const system = `${persona}

---

## Current invocation

Mode detected: ${mode.toUpperCase()}

${modeInstruction}

Respond ONLY with the reply markdown body. Do not include any meta-commentary
about the prompt, the mode, or yourself as a language model. Start the reply
with content that is useful to the asker.`;

  const userMessage = [
    `Issue title: ${issueTitle}`,
    issueBody?.trim() ? `Issue body:\n${issueBody.trim()}` : "(no body)",
    `Asker GitHub handle: @${issueAuthor}`,
  ].join("\n\n");

  return { system, userMessage, mode };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export async function generateReply(payload) {
  const { system, userMessage, mode } = await buildPrompt(payload);

  if (process.env.ZANEOS_DEBUG === "1") {
    return {
      mode,
      reply: `[DEBUG MODE — would have called ${MODEL}]\n\n--- SYSTEM ---\n${system}\n\n--- USER ---\n${userMessage}`,
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set. Configure as a repo secret.");
  }

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Model returned empty content");
  }

  return { mode, reply: text };
}

// ── CLI entrypoint (workflow calls this) ──────────────────────────────────────

const isCli = import.meta.url === `file://${process.argv[1]}`;

if (isCli) {
  const rawPayload = process.argv[2];
  if (!rawPayload) {
    console.error("usage: node sidekick.mjs '<json-payload>'");
    process.exit(2);
  }

  try {
    const payload = JSON.parse(rawPayload);
    const { mode, reply } = await generateReply(payload);

    // Workflow consumes BOTH stdout (the reply body) and a marker line on stderr (the mode).
    process.stderr.write(`MODE=${mode}\n`);
    process.stdout.write(reply);
  } catch (err) {
    console.error(`Sidekick error: ${err.message}`);
    process.exit(1);
  }
}

// .github/scripts/sidekick.test.mjs
//
// Lightweight unit tests for the sidekick — runs without an Anthropic API key.
// Verifies mode detection and prompt construction are correct before the workflow
// pays for a real model call.
//
// Run: node .github/scripts/sidekick.test.mjs

import assert from "node:assert/strict";
import { detectMode, buildPrompt } from "./sidekick.mjs";

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

// ── Mode detection ────────────────────────────────────────────────────────────

test("detectMode: ask", () => {
  assert.equal(detectMode("ZaneOS ask: what is your stack?"), "ask");
});

test("detectMode: match (with @mention)", () => {
  assert.equal(detectMode("ZaneOS match: @octocat"), "match");
});

test("detectMode: boop", () => {
  assert.equal(detectMode("ZaneOS boop: maps + agents + hardware"), "boop");
});

test("detectMode: quest", () => {
  assert.equal(detectMode("ZaneOS quest: agent memory"), "quest");
});

test("detectMode: unknown ZaneOS prefix → falls back to ask", () => {
  assert.equal(detectMode("ZaneOS hello world"), "ask");
});

test("detectMode: case-insensitive", () => {
  assert.equal(detectMode("ZANEOS ASK: shouting"), "ask");
});

// ── Prompt construction ───────────────────────────────────────────────────────

test("buildPrompt: includes persona content as system prompt", async () => {
  const { system } = await buildPrompt({
    issueTitle: "ZaneOS ask: what's your stack?",
    issueBody: "",
    issueAuthor: "octocat",
  });
  assert.ok(system.includes("ZaneOS Sidekick"), "system prompt must include persona identity");
  assert.ok(system.includes("Mode detected: ASK"), "system prompt must surface the detected mode");
});

test("buildPrompt: mode instruction varies by detected mode", async () => {
  const ask = await buildPrompt({ issueTitle: "ZaneOS ask: x", issueBody: "", issueAuthor: "u" });
  const match = await buildPrompt({ issueTitle: "ZaneOS match: @u", issueBody: "", issueAuthor: "u" });
  const boop = await buildPrompt({ issueTitle: "ZaneOS boop: a + b", issueBody: "", issueAuthor: "u" });
  const quest = await buildPrompt({ issueTitle: "ZaneOS quest: x", issueBody: "", issueAuthor: "u" });

  assert.notEqual(ask.system, match.system);
  assert.notEqual(match.system, boop.system);
  assert.notEqual(boop.system, quest.system);
});

test("buildPrompt: user message includes the issue title and asker handle", async () => {
  const { userMessage } = await buildPrompt({
    issueTitle: "ZaneOS match: @testuser",
    issueBody: "no body",
    issueAuthor: "testuser",
  });
  assert.ok(userMessage.includes("ZaneOS match: @testuser"));
  assert.ok(userMessage.includes("@testuser"));
});

// ── Run ───────────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`  ok    ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);

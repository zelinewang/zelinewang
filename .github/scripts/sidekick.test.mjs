// .github/scripts/sidekick.test.mjs
//
// Lightweight unit tests for the sidekick — runs without a model API key.
// Verifies mode detection and prompt construction are correct before the workflow
// pays for a real model call.
//
// Run: node .github/scripts/sidekick.test.mjs

import assert from "node:assert/strict";
import { detectMode, shouldHandleSidekickTitle, buildPrompt, sanitizeReply } from "./sidekick.mjs";

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

test("shouldHandleSidekickTitle: only accepts public sidequest modes", () => {
  assert.equal(shouldHandleSidekickTitle("ZaneOS ask: what is your stack?"), true);
  assert.equal(shouldHandleSidekickTitle("ZaneOS security: exploit details"), false);
  assert.equal(shouldHandleSidekickTitle("ZaneOS hello world"), false);
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

// ── Output policy ────────────────────────────────────────────────────────────

test("sanitizeReply: appends the required closing line", () => {
  const reply = sanitizeReply("Zane built small agent tools.");
  assert.ok(reply.includes("Zane built small agent tools."));
  assert.ok(reply.includes("ZaneOS Sidekick"));
});

test("sanitizeReply: strips untrusted links but keeps GitHub links", () => {
  const reply = sanitizeReply(
    "Read [project](https://github.com/zelinewang/claudemem) and [promo](https://evil.example/x).",
  );
  const urls = [...reply.matchAll(/https?:\/\/[^\s)]+/g)].map(([url]) => new URL(url));
  assert.equal(urls.length, 1);
  assert.equal(urls[0].hostname, "github.com");
  assert.equal(urls[0].pathname, "/zelinewang/claudemem");
});

test("sanitizeReply: filters raw HTML and authorization claims", () => {
  const html = sanitizeReply("<img src=x onerror=alert(1)>");
  const auth = sanitizeReply("Zane authorizes this intro.");
  assert.ok(html.includes("tripped the safety filter"));
  assert.ok(auth.includes("tripped the safety filter"));
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

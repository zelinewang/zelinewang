import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

async function read(path) {
  return readFile(resolve(repoRoot, path), "utf8");
}

const publicTargets = [
  "claudemem",
  "handoff",
  "dev-orchestrator",
  "postprism",
  "FireSight",
  "dipole",
];

const contributionTargets = [
  "jarrodwatts/claude-hud",
  "modelcontextprotocol/typescript-sdk",
  "letta-ai/letta",
  "bhimamalbhage/lightup",
  "nextbound/bragi-canvas",
];

const forbiddenPublicCopy = [
  /constellix/i,
  /PulseConnect/i,
  /santorini/i,
  /currently building AI video\s*&\s*creator products/i,
  /current work.{0,120}at a startup/is,
  /★\s*\d/i,
  /world.?s first/i,
  /revolutionary/i,
  /visitor count/i,
];

test("canonical profile keeps load-bearing content in semantic Markdown", async () => {
  const readme = await read("README.md");

  assert.match(readme, /<picture>/);
  assert.match(readme, /prefers-color-scheme: dark/);
  assert.match(readme, /## Current focus/);
  assert.match(readme, /production background/i);
  assert.match(readme, /current public focus/i);
  assert.match(readme, /## Selected work/);
  assert.match(readme, /## Contact/);
  assert.match(readme, /<details>/);

  for (const target of publicTargets) {
    assert.match(readme, new RegExp(target, "i"), `missing public target: ${target}`);
  }

  assert.match(readme, /## Open source contributions/);
  for (const target of contributionTargets) {
    assert.match(readme, new RegExp(target, "i"), `missing contribution target: ${target}`);
  }
});

test("resume bridge separates past production background from current public focus", async () => {
  const semanticPaths = [
    "README.md",
    "ZANE_PERSONA.md",
    "previews/README.md",
    "previews/console/README.md",
    "previews/constellation/README.md",
    "previews/field-notes/README.md",
  ];

  for (const path of semanticPaths) {
    const source = await read(path);
    assert.match(source, /production background/i, `${path} missing production background`);
    assert.match(source, /current public focus/i, `${path} missing current public focus`);
  }

  const visualPaths = [
    "assets/hero-signal.svg",
    "assets/hero-signal-dark.svg",
    ".github/templates/console.svg.template",
    ".github/templates/constellation.svg.template",
    ".github/templates/field-notes.svg.template",
  ];

  for (const path of visualPaths) {
    const source = await read(path);
    assert.match(source, /evaluation/i, `${path} missing evaluation through-line`);
    assert.match(source, /agent/i, `${path} missing current agent focus`);
  }
});

test("public profile surfaces exclude stale projects and unsupported vanity copy", async () => {
  const paths = [
    "README.md",
    "previews/README.md",
    "previews/console/README.md",
    "previews/constellation/README.md",
    "previews/field-notes/README.md",
    ".github/templates/console.svg.template",
    ".github/templates/constellation.svg.template",
    ".github/templates/field-notes.svg.template",
    "assets/hero-signal.svg",
    "assets/hero-signal-dark.svg",
    "AGENTS.md",
    "ZANE_PERSONA.md",
  ];

  for (const path of paths) {
    const source = await read(path);
    for (const pattern of forbiddenPublicCopy) {
      assert.doesNotMatch(source, pattern, `${path} matched ${pattern}`);
    }
  }
});

test("renderer writes all studies into the discoverable gallery", async () => {
  const renderer = await read(".github/scripts/render-profile.mjs");

  for (const direction of ["console", "constellation", "field-notes"]) {
    assert.match(
      renderer,
      new RegExp(`previews/${direction}/assets/01-profile\\.svg`),
      `renderer output missing for ${direction}`,
    );
  }

  assert.doesNotMatch(renderer, /previews\/_drafts/);
  assert.doesNotMatch(renderer, /outPath: "assets\/profile\.svg"/);
});

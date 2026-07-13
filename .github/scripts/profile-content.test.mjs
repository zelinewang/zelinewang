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
  "postprism-12e78c39",
  "FireSight",
  "dipole",
];

const forbiddenPublicCopy = [
  /constellix/i,
  /PulseConnect/i,
  /santorini/i,
  /★\s*\d/i,
  /world.?s first/i,
  /revolutionary/i,
  /visitor count/i,
];

test("canonical profile keeps load-bearing content in semantic Markdown", async () => {
  const readme = await read("README.md");

  assert.match(readme, /<picture>/);
  assert.match(readme, /prefers-color-scheme: dark/);
  assert.match(readme, /## Selected work/);
  assert.match(readme, /## Contact/);
  assert.match(readme, /<details>/);

  for (const target of publicTargets) {
    assert.match(readme, new RegExp(target, "i"), `missing public target: ${target}`);
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

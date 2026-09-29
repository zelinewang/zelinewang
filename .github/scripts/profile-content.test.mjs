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

// Every PR the hero counts ("12 PRs merged into 10 upstream projects") must stay
// linked in the searchable Markdown layer.
const contributionTargets = [
  "tokio-rs/axum/pull/3836",
  "transact-rs/sqlx/pull/4340",
  "agronholm/anyio/pull/1223",
  "aaif-goose/goose/pull/10438",
  "fastify/fastify/pull/6846",
  "colinhacks/zod/pull/6192",
  "TanStack/query/pull/11065",
  "jd/tenacity/pull/656",
  "feast-dev/feast/pull/6604",
  "jarrodwatts/claude-hud/pull/354",
  "jarrodwatts/claude-hud/pull/471",
  "jarrodwatts/claude-hud/pull/491",
];

const upstreamProjects = [
  "axum", "SQLx", "AnyIO", "goose", "Fastify",
  "Zod", "TanStack Query", "Tenacity", "Feast", "Claude HUD",
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
  // Claims an independent review could not verify or found contradicted.
  /pre-registered/i,
  /found by reading the code/i,
  /--author=@me/i,
];

test("canonical profile keeps load-bearing content in semantic Markdown", async () => {
  const readme = await read("README.md");

  // Hero = the Console-v2 mega-SVG served fresh from the stats-output branch
  // (one theme-aware <img>, not a <picture> pair). The scannable/searchable
  // layer is the "Full profile" <details> block (asserted below).
  assert.match(readme, /raw\.githubusercontent\.com\/zelinewang\/zelinewang\/stats-output\/profile\.svg/);
  assert.match(readme, /## Current focus/);
  assert.match(readme, /production background/i);
  assert.match(readme, /current public focus/i);
  assert.match(readme, /## Tools I maintain/);
  assert.match(readme, /## Contact/);
  assert.match(readme, /<details>/);

  for (const target of publicTargets) {
    assert.match(readme, new RegExp(target, "i"), `missing public target: ${target}`);
  }

  assert.match(readme, /## Merged upstream/);
  for (const target of contributionTargets) {
    assert.ok(readme.includes(`https://github.com/${target}`), `missing merged PR link: ${target}`);
  }
});

// Both current designs carry the same evidence; only the art differs.
const heroes = [
  { path: ".github/templates/console.svg.template", tokens: ["CONTRIB_TOTAL", "ACTIVE_DAYS", "LONGEST_STREAK", "SPARKLINE", "FONT_FACES"] },
  { path: ".github/templates/sunset.svg.template", tokens: ["CONTRIB_TOTAL", "ACTIVE_DAYS", "LONGEST_STREAK", "SCENE", "SCENE_DEFS", "FONT_FACES"] },
];

for (const { path, tokens } of heroes) {
  test(`${path} shows calendar activity and the same upstream projects as the README`, async () => {
    const hero = await read(path);

    // The public events feed misses private work, so its counters contradicted the
    // contribution graph on the same page. The heroes read the calendar instead.
    for (const token of tokens) {
      assert.ok(hero.includes(`{{${token}}}`), `hero missing {{${token}}}`);
    }
    assert.doesNotMatch(hero, /\{\{(PUSH|PR|CREATE|DELETE|COMMENT|WATCH|REPO)_(COUNT|BAR|BAR_LABEL_X)\}\}/);

    assert.match(hero, /12<\/tspan> PRs merged into <tspan[^>]*>10<\/tspan> upstream projects/);
    assert.match(hero, /10 bug fixes and 2 small features/);
    for (const project of upstreamProjects) {
      assert.ok(hero.includes(project), `hero missing upstream project: ${project}`);
    }
  });
}

for (const path of [".github/templates/console.svg.template", ".github/templates/sunset.svg.template"]) {
  test(`${path} falls back to a monospace font if an embedded font does not load`, async () => {
    // Fonts travel inside the SVG as data URIs. If a browser skips them, a bare
    // family name falls back to the default serif and breaks the terminal columns.
    const hero = await read(path);
    const families = [...hero.matchAll(/font-family(?:="|:\s*)([^";}]*)/g)].map((match) => match[1].trim());
    assert.ok(families.length > 0, "template declares no font-family");
    for (const family of families) {
      assert.match(family, /,\s*monospace$/, `font-family without a monospace fallback: ${family}`);
    }
  });
}

test("each rendered hero embeds exactly the fonts it uses", async () => {
  // A missing face silently falls back to a system font; an unused one only adds bytes.
  for (const design of ["console", "sunset"]) {
    const svg = await read(`previews/${design}/assets/01-profile.svg`);
    const embedded = [...svg.matchAll(/@font-face\{font-family:'([\w-]+)'/g)].map((m) => m[1]).sort();
    const rest = svg.replace(/@font-face\{[^}]*\}/g, "");
    const used = [...new Set([...rest.matchAll(/\b(zw-[\w-]+?)(?=[,;'"\s}])/g)].map((m) => m[1]))].sort();
    assert.ok(used.length > 0, `${design} names no embedded font`);
    assert.deepEqual(embedded, used, `${design} embeds [${embedded}] but uses [${used}]`);
  }
});

// WCAG relative luminance and contrast ratio for #rrggbb colours.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const panels = [
  { name: "Console", path: ".github/templates/console.svg.template", panel: "#10161c" },
  { name: "Sunset", path: ".github/templates/sunset.svg.template", panel: "#1e1523" },
];

for (const { name, path, panel } of panels) {
  test(`${name} text stays legible at GitHub's desktop width`, async () => {
    // Desktop shows the 1200-unit viewBox at 846 px (0.705x): 15 units is 10.6 px.
    const hero = await read(path);
    const sizes = [...hero.matchAll(/font-size="([\d.]+)"/g)].map((m) => Number(m[1]));
    for (const size of sizes) assert.ok(size >= 15, `font-size ${size} renders below 10.6 px on desktop`);

    // aria-hidden copies (Sunset's name shadow) are decoration, not text to read.
    const textFills = [...hero.matchAll(/<(?:text|tspan|g)\b[^>]*\bfill="(#[0-9a-f]{6})"[^>]*>/gi)]
      .filter((m) => !/aria-hidden="true"/.test(m[0]))
      .filter((m) => /<(text|tspan)\b/.test(m[0]) || /font-size|letter-spacing|font-weight|text-anchor/.test(m[0]))
      .map((m) => m[1].toLowerCase());
    assert.ok(textFills.length > 20, "expected to find the text colours");
    for (const fill of new Set(textFills)) {
      assert.ok(contrast(fill, panel) >= 4.5, `text colour ${fill} is ${contrast(fill, panel).toFixed(2)}:1 on the panel`);
    }
  });
}

test("resume bridge separates past production background from current public focus", async () => {
  const semanticPaths = [
    "README.md",
    "ZANE_PERSONA.md",
    "previews/README.md",
    "previews/console/README.md",
    "previews/constellation/README.md",
    "previews/field-notes/README.md",
    "previews/sunset/README.md",
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
    ".github/templates/sunset.svg.template",
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
    "previews/sunset/README.md",
    ".github/templates/console.svg.template",
    ".github/templates/sunset.svg.template",
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

test("renderer wires console to the active hero and studies to the gallery", async () => {
  const renderer = await read(".github/scripts/render-profile.mjs");

  // Every design renders into the gallery; ACTIVE_DESIGN is copied to the hero path,
  // which refresh-stats.yml publishes to the stats-output branch nightly.
  assert.match(renderer, /const ACTIVE_DESIGN = "(console|sunset)";/);
  assert.match(renderer, /copyFile\(resolve\(repoRoot, active\.outPath\), resolve\(repoRoot, "assets\/profile\.svg"\)\)/);

  for (const direction of ["console", "sunset", "constellation", "field-notes"]) {
    assert.match(
      renderer,
      new RegExp(`previews/${direction}/assets/01-profile\\.svg`),
      `renderer output missing for ${direction}`,
    );
  }

  assert.doesNotMatch(renderer, /previews\/_drafts/);

  // Activity numbers, the Console chart and the Sunset skyline come from the contribution calendar.
  assert.match(renderer, /contributionCalendar/);
  assert.match(renderer, /sparkline\(calendar\.weeks/);
  assert.match(renderer, /summarizeCalendar/);
});

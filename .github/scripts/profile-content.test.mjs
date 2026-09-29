import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { DESKTOP, INK, PHONE, SKY, WATER } from "./dusk-scene.mjs";
import { UPSTREAM_PRS, mergedRange } from "./upstream-prs.mjs";

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

// Every PR the heroes count ("12 PRs merged into 10 upstream projects") must stay
// linked in the searchable Markdown layer. upstream-prs.mjs is the one list.
const contributionTargets = UPSTREAM_PRS.map((pr) => `${pr.repo}/pull/${pr.number}`);
const upstreamProjects = [...new Set(UPSTREAM_PRS.map((pr) => pr.project))];

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

test("the upstream list matches the numbers the heroes print", () => {
  // The heroes say 12 PRs in 10 projects; a new row here must update that copy too.
  assert.equal(UPSTREAM_PRS.length, 12);
  assert.equal(upstreamProjects.length, 10);
  for (const pr of UPSTREAM_PRS) assert.match(pr.merged, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(mergedRange(), "Apr – Aug 2026");
  assert.equal(mergedRange([{ merged: "2025-11-02" }, { merged: "2026-08-25" }]), "Nov 2025 – Aug 2026");
  assert.equal(mergedRange([{ merged: "2026-08-02" }]), "Aug 2026");
});

test("canonical profile keeps load-bearing content in semantic Markdown", async () => {
  const readme = await read("README.md");

  // Hero = one mega-SVG served fresh from the stats-output branch, with a phone
  // layout for narrow screens. The scannable/searchable layer is the "Full
  // profile" <details> block (asserted below).
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

// The words a reader sees: no <title>, <desc>, styles, comments or tags.
function visibleText(svg) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(title|desc|style)\b[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/\s+/g, " ");
}

// The current designs make the same claim about the same projects; only the art
// differs. Each also shows what kind of work it was: Console and Sunset count the
// fixes and features, Dusk shows two of the fixes with their pull request numbers.
const duskExamples = [/SQLx #4340/, /AnyIO #1223/];
const workSummary = [/10 bug fixes and 2 small features/];
const heroes = [
  { path: ".github/templates/dusk.svg.template", tokens: ["ACTIVE_DAYS", "RANGE_LABEL", "MERGED_RANGE", "DUSK_DEFS", "DUSK_SCENE", "FONT_FACES"], work: duskExamples },
  { path: ".github/templates/dusk-phone.svg.template", tokens: ["ACTIVE_DAYS", "RANGE_LABEL", "MERGED_RANGE", "DUSK_PHONE_DEFS", "DUSK_PHONE_SCENE", "FONT_FACES"], work: duskExamples },
  { path: ".github/templates/console.svg.template", tokens: ["CONTRIB_TOTAL", "ACTIVE_DAYS", "LONGEST_STREAK", "SPARKLINE", "FONT_FACES"], work: workSummary },
  { path: ".github/templates/sunset.svg.template", tokens: ["CONTRIB_TOTAL", "ACTIVE_DAYS", "LONGEST_STREAK", "SCENE", "SCENE_DEFS", "FONT_FACES"], work: workSummary },
];

for (const { path, tokens, work } of heroes) {
  test(`${path} shows calendar activity and the same upstream projects as the README`, async () => {
    const hero = await read(path);

    // The public events feed misses private work, so its counters contradicted the
    // contribution graph on the same page. The heroes read the calendar instead.
    for (const token of tokens) {
      assert.ok(hero.includes(`{{${token}}}`), `hero missing {{${token}}}`);
    }
    assert.doesNotMatch(hero, /\{\{(PUSH|PR|CREATE|DELETE|COMMENT|WATCH|REPO)_(COUNT|BAR|BAR_LABEL_X)\}\}/);

    const text = visibleText(hero);
    assert.match(text, /12 PRs merged into 10 upstream projects/);
    for (const pattern of work) assert.match(text, pattern);
    for (const project of upstreamProjects) {
      assert.ok(text.includes(project), `hero missing upstream project: ${project}`);
    }
  });
}

test("Dusk's two examples cite pull requests from the merged-upstream data", () => {
  for (const [project, number] of [["SQLx", 4340], ["AnyIO", 1223]]) {
    assert.ok(UPSTREAM_PRS.some((pr) => pr.project === project && pr.number === number), `${project} #${number} is not in UPSTREAM_PRS`);
  }
});

const fontPaths = heroes.map((h) => h.path);
for (const path of fontPaths) {
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
  const renders = ["dusk/assets/01-profile", "dusk/assets/01-profile-phone", "console/assets/01-profile", "sunset/assets/01-profile"];
  for (const render of renders) {
    const svg = await read(`previews/${render}.svg`);
    const embedded = [...svg.matchAll(/@font-face\{font-family:'([\w-]+)'/g)].map((m) => m[1]).sort();
    const rest = svg.replace(/@font-face\{[^}]*\}/g, "");
    const used = [...new Set([...rest.matchAll(/\b(zw-[\w-]+?)(?=[,;'"\s}])/g)].map((m) => m[1]))].sort();
    assert.ok(used.length > 0, `${render} names no embedded font`);
    assert.deepEqual(embedded, used, `${render} embeds [${embedded}] but uses [${used}]`);
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

// Smallest type in viewBox units that still renders at 10.5 CSS px where GitHub
// shows the image: 846 px on desktop, about 308 px on a 390-px phone.
const minSize = (viewBoxWidth, shownWidth) => (10.5 * viewBoxWidth) / shownWidth;

const panels = [
  { name: "Console", path: ".github/templates/console.svg.template", panel: "#10161c", min: minSize(1200, 846) },
  { name: "Sunset", path: ".github/templates/sunset.svg.template", panel: "#1e1523", min: minSize(1200, 846) },
];

for (const { name, path, panel, min } of panels) {
  test(`${name} text stays legible at GitHub's desktop width`, async () => {
    // Desktop shows the 1200-unit viewBox at 846 px (0.705x): 15 units is 10.6 px.
    const hero = await read(path);
    const sizes = [...hero.matchAll(/font-size="([\d.]+)"/g)].map((m) => Number(m[1]));
    for (const size of sizes) assert.ok(size >= min, `font-size ${size} renders below 10.5 px on desktop`);

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

// Dusk's text sits on the sky, the water or the ground below them. Each line is
// checked against every band its ink crosses, dither included, so no line relies
// on the darker of two neighbouring bands.
function bandsAt(L, top, bottom) {
  const layers = [
    ...L.skyPx.map((h, i) => ({ h, color: SKY[i] })),
    ...L.waterPx.map((h, i) => ({ h, color: WATER[i] })),
  ];
  const colors = new Set();
  let y = 0;
  for (const { h, color } of layers) {
    const y1 = y + L.P * h;
    if (bottom > y && top < y1) colors.add(color);
    y = y1;
  }
  if (bottom > L.WATER_B) colors.add(INK);
  return [...colors];
}

const duskLayouts = [
  { name: "Dusk", path: ".github/templates/dusk.svg.template", L: DESKTOP, shown: 846 },
  { name: "Dusk phone", path: ".github/templates/dusk-phone.svg.template", L: PHONE, shown: 308 },
];

for (const { name, path, L, shown } of duskLayouts) {
  test(`${name} text is legible and clears 4.5:1 against whatever is behind it`, async () => {
    const hero = await read(path);
    const min = minSize(L.W, shown);
    const sizes = [...hero.matchAll(/font-size="([\d.]+)"/g)].map((m) => Number(m[1]));
    for (const size of sizes) assert.ok(size >= min, `font-size ${size} renders below 10.5 px`);

    // Each <text>, with the size and fill it inherits from its <g>, and each tspan fill inside it.
    let checked = 0;
    const body = hero.replace(/<(title|desc|style)\b[\s\S]*?<\/\1>/g, "");
    for (const group of body.matchAll(/<g\b([^>]*)>((?:(?!<\/?g\b)[\s\S])*)<\/g>|<text\b[^>]*>[\s\S]*?<\/text>/g)) {
      const groupAttrs = group[1] || "";
      if (/aria-hidden="true"/.test(groupAttrs)) continue;
      const texts = group[2] !== undefined ? [...group[2].matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map((m) => m[0]) : [group[0]];
      for (const t of texts) {
        const attr = (k, from) => (from.match(new RegExp(`\\b${k}="([^"]+)"`)) || [])[1];
        const open = t.match(/<text\b[^>]*>/)[0];
        const y = Number(attr("y", open));
        const size = Number(attr("font-size", open) || attr("font-size", groupAttrs));
        const fills = [attr("fill", open) || attr("fill", groupAttrs), ...[...t.matchAll(/<tspan\b[^>]*\bfill="(#[0-9a-f]{6})"/gi)].map((m) => m[1])];
        assert.ok(Number.isFinite(y) && size > 0 && fills[0], `could not read ${open}`);
        for (const back of bandsAt(L, y - 0.75 * size, y + 0.22 * size)) {
          for (const fill of fills) {
            const ratio = contrast(fill.toLowerCase(), back);
            assert.ok(ratio >= 4.5, `${fill} on ${back} is ${ratio.toFixed(2)}:1 in ${t.slice(0, 90)}`);
            checked++;
          }
        }
      }
    }
    assert.ok(checked >= 15, `expected to check the text colours, checked ${checked}`);
  });
}

// Monospace faces make line widths predictable, as long as each glyph's advance is
// a whole number of units: some browsers round a fractional advance to a whole
// pixel, which widened an 11-unit Plex Mono line by 17 units in a phone render.
const ADVANCE = { px: 7 / 11, bd: 0.6, md: 0.6 };

function duskLines(svg) {
  const body = svg.replace(/<(title|desc|style)\b[\s\S]*?<\/\1>/g, "");
  const lines = [];
  for (const m of body.matchAll(/<g\b([^>]*)>((?:(?!<\/?g\b)[\s\S])*)<\/g>|<text\b[^>]*>[\s\S]*?<\/text>/g)) {
    const g = m[1] || "";
    if (/aria-hidden="true"/.test(g)) continue;
    const texts = m[2] !== undefined ? [...m[2].matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map((t) => t[0]) : [m[0]];
    for (const t of texts) {
      const open = t.match(/<text\b[^>]*>/)[0];
      const attr = (k, from) => (from.match(new RegExp(`\\b${k}="([^"]+)"`)) || [])[1];
      const face = ((attr("class", open) || "") + " " + (attr("class", g) || "")).match(/\b(px|bd|md)\b/)[1];
      const size = Number(attr("font-size", open) || attr("font-size", g));
      const spacing = Number(attr("letter-spacing", open) || attr("letter-spacing", g) || 0);
      // Tokens measured at their widest plausible values.
      const shown = t.replace(/<[^>]+>/g, "").replace(/&#?\w+;/g, "x").replace("{{ACTIVE_DAYS}}", "366")
        .replace("{{RANGE_LABEL}}", "Sep 2025");
      const chars = [...shown].length;
      lines.push({ face, size, x: Number(attr("x", open)), y: Number(attr("y", open)), end: /text-anchor="end"/.test(open), middle: /text-anchor="middle"/.test(open),
        width: chars * (ADVANCE[face] * size + spacing), text: t.replace(/<[^>]+>/g, "") });
    }
  }
  return lines;
}

for (const { name, path, L } of duskLayouts) {
  test(`${name} type sizes give whole-unit advances`, async () => {
    for (const { face, size, text } of duskLines(await read(path))) {
      const advance = ADVANCE[face] * size;
      assert.ok(Math.abs(advance - Math.round(advance)) < 0.01, `${face} ${size} advances ${advance.toFixed(3)} units: "${text}"`);
    }
  });

  test(`${name} lines stay inside the card and clear their neighbours on the same baseline`, async () => {
    const lines = duskLines(await read(path)).map((l) => {
      const [left, right] = l.end ? [l.x - l.width, l.x] : l.middle ? [l.x - l.width / 2, l.x + l.width / 2] : [l.x, l.x + l.width];
      return { ...l, left, right };
    });
    assert.ok(lines.length >= 12, `expected the text lines, found ${lines.length}`);
    for (const { left, right, text } of lines) {
      assert.ok(left >= 6 && right <= L.W - 6, `"${text}" runs ${left.toFixed(0)}–${right.toFixed(0)}, outside the card`);
    }
    // Pieces set on one baseline (axis labels and caption, a PR label and its
    // description) keep at least two characters of space between them.
    const rows = Map.groupBy(lines, (l) => l.y);
    for (const [y, row] of rows) {
      const sorted = row.sort((a, b) => a.left - b.left);
      for (let i = 1; i < sorted.length; i++) {
        const gap = sorted[i].left - sorted[i - 1].right;
        assert.ok(gap >= 16, `"${sorted[i - 1].text}" and "${sorted[i].text}" at y=${y} are ${gap.toFixed(0)} units apart`);
      }
    }
  });
}

test("resume bridge separates past production background from current public focus", async () => {
  const semanticPaths = [
    "README.md",
    "ZANE_PERSONA.md",
    "previews/README.md",
    "previews/dusk/README.md",
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
    ".github/templates/dusk.svg.template",
    ".github/templates/dusk-phone.svg.template",
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
    "previews/dusk/README.md",
    "previews/console/README.md",
    "previews/constellation/README.md",
    "previews/field-notes/README.md",
    "previews/sunset/README.md",
    ".github/templates/dusk.svg.template",
    ".github/templates/dusk-phone.svg.template",
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

test("renderer renders every design to the gallery and the active one to the hero paths", async () => {
  const renderer = await read(".github/scripts/render-profile.mjs");

  // Every design renders into the gallery; ACTIVE_DESIGN is copied to the hero path,
  // which refresh-stats.yml publishes to the stats-output branch nightly, and its
  // phone layout (or its desktop render, when it has none) to the phone path.
  assert.match(renderer, /const ACTIVE_DESIGN = "(dusk|console|sunset)";/);
  assert.match(renderer, /copyFile\(resolve\(repoRoot, active\.outPath\), resolve\(repoRoot, "assets\/profile\.svg"\)\)/);
  assert.match(renderer, /copyFile\(resolve\(repoRoot, \(active\.phone \|\| active\)\.outPath\), resolve\(repoRoot, "assets\/profile-phone\.svg"\)\)/);

  for (const direction of ["dusk", "console", "sunset", "constellation", "field-notes"]) {
    assert.match(
      renderer,
      new RegExp(`previews/${direction}/assets/01-profile\\.svg`),
      `renderer output missing for ${direction}`,
    );
  }
  assert.match(renderer, /previews\/dusk\/assets\/01-profile-phone\.svg/);

  assert.doesNotMatch(renderer, /previews\/_drafts/);

  // Activity numbers, the Console chart and the city skylines come from the contribution calendar.
  assert.match(renderer, /contributionCalendar/);
  assert.match(renderer, /sparkline\(calendar\.weeks/);
  assert.match(renderer, /summarizeCalendar/);
  assert.match(renderer, /renderDusk\(calendar\.weeks, merged, DESKTOP\)/);
  assert.match(renderer, /renderDusk\(calendar\.weeks, merged, PHONE\)/);
});

test("the nightly workflow publishes every design and the phone hero", async () => {
  const workflow = await read(".github/workflows/refresh-stats.yml");
  for (const design of ["dusk", "dusk-phone", "console", "sunset", "constellation", "field-notes"]) {
    assert.ok(workflow.includes(design), `refresh-stats.yml does not publish ${design}`);
  }
  assert.match(workflow, /profile-phone\.svg/);
});

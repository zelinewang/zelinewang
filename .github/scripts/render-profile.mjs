// .github/scripts/render-profile.mjs
//
// Profile renderer — fetches live GitHub stats + the daily snake animation,
// fills templates, writes rendered mega-SVGs.
//
// Invoked by .github/workflows/refresh-stats.yml on a daily cron.
//
// Inputs (env):
//   GH_TOKEN  — required (any token with read access; Action's GITHUB_TOKEN works)
//
// Outputs:
//   previews/console/assets/01-profile.svg
//   previews/constellation/assets/01-profile.svg
//   previews/field-notes/assets/01-profile.svg
//
// Templates use {{TOKEN}} placeholders. Snake content is injected at the
// {{SNAKE_CONTENT}} marker (one per template, color-shifted per direction).
//
// SECURITY: uses execFileSync (no shell) with hardcoded argv arrays. No user
// input is ever passed as a shell-interpreted string.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const templatesDir = resolve(repoRoot, ".github/templates");

const USER = "zelinewang";
const SNAKE_URL = `https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake.svg`;

// ── Stats fetch ──────────────────────────────────────────────────────────────

function ghApi(path) {
  // execFileSync with explicit argv: no shell, no injection surface.
  // path is hardcoded by callers — never user input.
  const stdout = execFileSync("gh", ["api", path], { encoding: "utf8" });
  return JSON.parse(stdout);
}

async function fetchStats() {
  const user = ghApi(`users/${USER}`);
  const events = ghApi(`users/${USER}/events?per_page=100`);

  const byType = {};
  for (const e of events) {
    byType[e.type] = (byType[e.type] || 0) + 1;
  }

  const joined = new Date(user.created_at);
  const now = new Date();
  const years = ((now - joined) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
  const today = now.toISOString().slice(0, 10);
  const joinedMonth = user.created_at.slice(0, 7);

  const counts = {
    push:    byType.PushEvent || 0,
    pr:      byType.PullRequestEvent || 0,
    create:  byType.CreateEvent || 0,
    delete:  byType.DeleteEvent || 0,
    comment: byType.IssueCommentEvent || 0,
    watch:   byType.WatchEvent || 0,
  };
  const maxActivity = Math.max(...Object.values(counts), 1);
  const barW = (n) => Math.round((n / maxActivity) * 600);
  // Label sits 10px to the right of the bar end; bars start at x=180 in the
  // template. For zero-width bars we still want the label visible at minimum
  // x=190 so it doesn't disappear into the row label.
  const labelX = (n) => String(180 + Math.max(barW(n), 0) + 10);

  return {
    REPO_COUNT:           String(user.public_repos),
    YEARS:                String(years),
    JOINED_MONTH:         joinedMonth,
    PUSH_COUNT:           String(counts.push),
    PR_COUNT:             String(counts.pr),
    CREATE_COUNT:         String(counts.create),
    DELETE_COUNT:         String(counts.delete),
    COMMENT_COUNT:        String(counts.comment),
    WATCH_COUNT:          String(counts.watch),
    PUSH_BAR:             String(barW(counts.push)),
    PR_BAR:               String(barW(counts.pr)),
    CREATE_BAR:           String(barW(counts.create)),
    DELETE_BAR:           String(barW(counts.delete)),
    COMMENT_BAR:          String(barW(counts.comment)),
    WATCH_BAR:            String(barW(counts.watch)),
    PUSH_BAR_LABEL_X:     labelX(counts.push),
    PR_BAR_LABEL_X:       labelX(counts.pr),
    CREATE_BAR_LABEL_X:   labelX(counts.create),
    DELETE_BAR_LABEL_X:   labelX(counts.delete),
    COMMENT_BAR_LABEL_X:  labelX(counts.comment),
    WATCH_BAR_LABEL_X:    labelX(counts.watch),
    TODAY:                today,
  };
}

// ── Snake fetch ──────────────────────────────────────────────────────────────

async function fetchSnake() {
  const url = `${SNAKE_URL}?t=${Date.now()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Snake fetch failed: HTTP ${res.status}; using placeholder`);
      return "";
    }
    const svgText = await res.text();
    // Extract everything between <svg> opening tag and </svg> closing tag.
    const inner = svgText.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    return inner;
  } catch (err) {
    console.warn(`Snake fetch error: ${err.message}; using placeholder`);
    return "";
  }
}

// Color-shift snake per direction via CSS overrides.
// The Platane snake uses inline styles + class names; we re-fill via CSS rules
// inside a wrapping <g class="snake-zone">.
function snakeForDirection(snakeInner, direction) {
  const tints = {
    console:        { dot: "#5fb88a", bg: "#0a0e12", title: "phosphor" },
    constellation:  { dot: "#fdfaf2", bg: "#0a1018", title: "starlight" },
    "field-notes":  { dot: "#1f1c14", bg: "#fbf6e9", title: "ink" },
  };
  const t = tints[direction] || tints.console;

  if (!snakeInner.trim()) {
    return `<text x="600" y="20" fill="${t.dot}" text-anchor="middle" font-family="ui-monospace" font-size="11">snake.svg unavailable — refreshing nightly</text>`;
  }

  // The Platane snake has its own SMIL animations + colors. To re-tint, we wrap
  // and use CSS to override fills via opacity/blend trick. Simplest reliable
  // approach: just embed unmodified — the snake's own colors (greens) read as
  // "contribution heatmap" universally.
  return `<g transform="translate(0, 0)">${snakeInner}</g>`;
}

// ── Render ───────────────────────────────────────────────────────────────────

async function renderTemplate(templatePath, outPath, replacements, snakeInner, direction) {
  const template = await readFile(templatePath, "utf8");
  let rendered = template;

  for (const [key, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value);
  }
  rendered = rendered.replaceAll("{{SNAKE_CONTENT}}", snakeForDirection(snakeInner, direction));

  const unfilled = rendered.match(/\{\{[A-Z_]+\}\}/g);
  if (unfilled) {
    throw new Error(`Template ${templatePath} has unfilled tokens: ${[...new Set(unfilled)].join(", ")}`);
  }

  await writeFile(outPath, rendered);
  console.log(`Rendered ${outPath} (${rendered.length} chars)`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching live GitHub stats...");
  const stats = await fetchStats();
  console.log("Stats fetched:", Object.keys(stats).length, "tokens");

  console.log("Fetching daily snake...");
  const snake = await fetchSnake();
  console.log(`Snake content: ${snake.length} chars`);

  // Console is the active profile design — output goes to root assets/.
  // Constellation + Field Notes are kept under previews/_drafts/ as
  // alternate aesthetics (still regenerated nightly so they don't bit-rot,
  // but the root README does not promote them).
  const directions = [
    { name: "console",       templatePath: "console.svg.template",       outPath: "assets/profile.svg" },
    { name: "constellation", templatePath: "constellation.svg.template", outPath: "previews/_drafts/constellation/assets/01-profile.svg" },
    { name: "field-notes",   templatePath: "field-notes.svg.template",   outPath: "previews/_drafts/field-notes/assets/01-profile.svg" },
  ];

  for (const { name, templatePath, outPath } of directions) {
    const tplFull = resolve(templatesDir, templatePath);
    const outFull = resolve(repoRoot, outPath);
    await renderTemplate(tplFull, outFull, stats, snake, name);
  }

  console.log("All 3 mega-SVGs rendered.");
}

main().catch((err) => {
  console.error("Render failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});

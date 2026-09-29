// .github/scripts/render-profile.mjs
//
// Profile renderer — fetches live GitHub stats, the contribution calendar, and
// the daily snake animation, fills templates, writes rendered mega-SVGs.
//
// Invoked by .github/workflows/refresh-stats.yml on a daily cron.
//
// Inputs (env):
//   GH_TOKEN  — required (any token with read access; Action's GITHUB_TOKEN works)
//
// Outputs:
//   previews/{dusk,console,sunset,constellation,field-notes}/assets/01-profile.svg
//   previews/dusk/assets/01-profile-phone.svg  (Dusk re-set for a phone's README column)
//   assets/profile.svg        (a copy of ACTIVE_DESIGN; published to stats-output nightly)
//   assets/profile-phone.svg  (ACTIVE_DESIGN's phone layout, or its desktop render
//                              when it has none; the README <picture> serves it below 600 px)
//
// Templates use {{TOKEN}} placeholders. Snake content is injected at the
// {{SNAKE_CONTENT}} marker (one per template, color-shifted per direction).
//
// SECURITY: uses execFileSync (no shell) with hardcoded argv arrays. No user
// input is ever passed as a shell-interpreted string.

import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

import { summarizeCalendar } from "./calendar-summary.mjs";
import { renderScene } from "./sunset-scene.mjs";
import { renderScene as renderDusk, DESKTOP, PHONE } from "./dusk-scene.mjs";
import { CONSOLE_BOX, sparkline } from "./activity-sparkline.mjs";
import { UPSTREAM_PRS, mergedRange, monthLabel } from "./upstream-prs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const templatesDir = resolve(repoRoot, ".github/templates");

const USER = "zelinewang";

// The design shown as the profile hero: "dusk" (a pixel sunset over a city of the
// contribution calendar, with the upstream PRs below it), "console" (terminal) or
// "sunset" (the earlier terminal window with a sunset banner). The rest stay in the gallery.
const ACTIVE_DESIGN = "console";
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

// ── Contribution calendar (activity numbers, Console chart, Sunset skyline) ──
//
// The events feed above only sees public activity, so on a profile where most
// work is private it reports a handful of pushes next to a graph showing
// thousands of contributions. Both heroes read the same calendar GitHub
// draws on the profile page instead. The gallery studies still use the events
// tokens above.

const CALENDAR_QUERY = `query { user(login: "${USER}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;

function fetchCalendar() {
  const stdout = execFileSync("gh", ["api", "graphql", "-f", `query=${CALENDAR_QUERY}`], { encoding: "utf8" });
  const calendar = JSON.parse(stdout)?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar || !Number.isInteger(calendar.totalContributions) || !Array.isArray(calendar.weeks)) {
    // Fail the run rather than publish a card with made-up numbers; the last
    // good render stays on the stats-output branch.
    throw new Error("contribution calendar missing from the GraphQL response");
  }

  const days = calendar.weeks.flatMap((week) => week.contributionDays);
  const { activeDays, longestStreak } = summarizeCalendar(days);
  // Sunset draws the weeks as a skyline, Console as one bar per week, Dusk as a city
  // with a pennant over each week an upstream PR was merged.
  const { defs, scene } = renderScene(calendar.weeks);
  const merged = UPSTREAM_PRS.map((pr) => pr.merged);
  const dusk = renderDusk(calendar.weeks, merged, DESKTOP);
  const duskPhone = renderDusk(calendar.weeks, merged, PHONE);
  return {
    CONTRIB_TOTAL:  calendar.totalContributions.toLocaleString("en-US"),
    ACTIVE_DAYS:    String(activeDays),
    LONGEST_STREAK: String(longestStreak),
    RANGE_START:    (days[0]?.date || "").slice(0, 7),
    SCENE_DEFS:     defs,
    SCENE:          scene,
    SPARKLINE:      sparkline(calendar.weeks, CONSOLE_BOX).svg,
    RANGE_LABEL:    days[0] ? monthLabel(days[0].date) : "",
    MERGED_RANGE:   mergedRange(),
    DUSK_DEFS:      dusk.defs,
    DUSK_SCENE:     dusk.scene,
    DUSK_PHONE_DEFS:  duskPhone.defs,
    DUSK_PHONE_SCENE: duskPhone.scene,
  };
}

// The heroes embed their fonts: an SVG shown through <img> cannot load web fonts.
async function fontFaces() {
  const fonts = [["zw-pixel", "zw-pixel.woff2"], ["zw-body", "zw-body.woff2"], ["zw-body-medium", "zw-body-medium.woff2"]];
  const faces = [];
  for (const [family, file] of fonts) {
    const data = (await readFile(resolve(templatesDir, "fonts", file))).toString("base64");
    faces.push([family, `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${data}) format('woff2');}`]);
  }
  return faces;
}

// Only the families a template names: each embedded face costs its full size.
function facesFor(template, faces) {
  return faces
    .filter(([family]) => new RegExp(`${family}(?![\\w-])`).test(template))
    .map(([, rule]) => rule)
    .join("");
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

async function renderTemplate(templatePath, outPath, replacements, snakeInner, direction, faces) {
  const template = await readFile(templatePath, "utf8");
  let rendered = template.replaceAll("{{FONT_FACES}}", facesFor(template, faces));

  for (const [key, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value);
  }
  rendered = rendered.replaceAll("{{SNAKE_CONTENT}}", snakeForDirection(snakeInner, direction));

  const unfilled = rendered.match(/\{\{[A-Z_]+\}\}/g);
  if (unfilled) {
    throw new Error(`Template ${templatePath} has unfilled tokens: ${[...new Set(unfilled)].join(", ")}`);
  }

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, rendered);
  console.log(`Rendered ${outPath} (${rendered.length} chars)`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching live GitHub stats...");
  const stats = { ...(await fetchStats()), ...fetchCalendar() };
  const faces = await fontFaces();
  console.log("Stats fetched:", Object.keys(stats).length, "tokens");

  console.log("Fetching daily snake...");
  const snake = await fetchSnake();
  console.log(`Snake content: ${snake.length} chars`);

  // Every design renders nightly into the gallery; refresh-stats.yml publishes each
  // one to stats-output/studies/<name>.svg. ACTIVE_DESIGN is also copied to
  // assets/profile.svg, which becomes stats-output/profile.svg: the README hero.
  // Switching the live hero means changing ACTIVE_DESIGN and the README alt text that
  // describes the picture.
  const directions = [
    { name: "dusk",          templatePath: "dusk.svg.template",          outPath: "previews/dusk/assets/01-profile.svg",
      phone: { templatePath: "dusk-phone.svg.template", outPath: "previews/dusk/assets/01-profile-phone.svg" } },
    { name: "console",       templatePath: "console.svg.template",       outPath: "previews/console/assets/01-profile.svg" },
    { name: "sunset",        templatePath: "sunset.svg.template",        outPath: "previews/sunset/assets/01-profile.svg" },
    { name: "constellation", templatePath: "constellation.svg.template", outPath: "previews/constellation/assets/01-profile.svg" },
    { name: "field-notes",   templatePath: "field-notes.svg.template",   outPath: "previews/field-notes/assets/01-profile.svg" },
  ];

  for (const { name, templatePath, outPath, phone } of directions) {
    for (const { templatePath: tpl, outPath: out } of [{ templatePath, outPath }, ...(phone ? [phone] : [])]) {
      await renderTemplate(resolve(templatesDir, tpl), resolve(repoRoot, out), stats, snake, name, faces);
    }
  }

  const active = directions.find((d) => d.name === ACTIVE_DESIGN);
  if (!active) throw new Error(`ACTIVE_DESIGN "${ACTIVE_DESIGN}" is not a rendered design`);
  await mkdir(resolve(repoRoot, "assets"), { recursive: true });
  await copyFile(resolve(repoRoot, active.outPath), resolve(repoRoot, "assets/profile.svg"));
  // The README's <picture> always has a phone source to serve, whichever design is live.
  await copyFile(resolve(repoRoot, (active.phone || active).outPath), resolve(repoRoot, "assets/profile-phone.svg"));

  console.log(`All ${directions.length} mega-SVGs rendered; live hero: ${ACTIVE_DESIGN}.`);
}

main().catch((err) => {
  console.error("Render failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});

// .github/scripts/upstream-prs.mjs
//
// The pull requests merged into other people's projects that the profile
// counts ("12 PRs merged into 10 upstream projects"). The README links each one;
// the Dusk hero flies a pennant over the week each was merged.
//
// merged is the UTC date of the PR's mergedAt on GitHub, the same clock the
// contribution calendar uses. A merged pull request keeps its date, so these
// never need refreshing; add a row when another PR lands upstream.

export const UPSTREAM_PRS = Object.freeze([
  { project: "axum", repo: "tokio-rs/axum", number: 3836, merged: "2026-07-16" },
  { project: "SQLx", repo: "transact-rs/sqlx", number: 4340, merged: "2026-08-19" },
  { project: "AnyIO", repo: "agronholm/anyio", number: 1223, merged: "2026-08-23" },
  { project: "goose", repo: "aaif-goose/goose", number: 10438, merged: "2026-07-18" },
  { project: "Fastify", repo: "fastify/fastify", number: 6846, merged: "2026-08-08" },
  { project: "Zod", repo: "colinhacks/zod", number: 6192, merged: "2026-08-25" },
  { project: "TanStack Query", repo: "TanStack/query", number: 11065, merged: "2026-08-20" },
  { project: "Tenacity", repo: "jd/tenacity", number: 656, merged: "2026-07-15" },
  { project: "Feast", repo: "feast-dev/feast", number: 6604, merged: "2026-07-19" },
  { project: "Claude HUD", repo: "jarrodwatts/claude-hud", number: 354, merged: "2026-04-04" },
  { project: "Claude HUD", repo: "jarrodwatts/claude-hud", number: 471, merged: "2026-04-20" },
  { project: "Claude HUD", repo: "jarrodwatts/claude-hud", number: 491, merged: "2026-04-24" },
].map(Object.freeze));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYear = (iso) => [MONTHS[Number(iso.slice(5, 7)) - 1], iso.slice(0, 4)];

// "Sep 2025" for an ISO date.
export function monthLabel(iso) {
  return monthYear(iso).join(" ");
}

// The span the merges cover, e.g. "Apr – Aug 2026" or "Nov 2025 – Aug 2026".
export function mergedRange(prs = UPSTREAM_PRS) {
  const dates = prs.map((pr) => pr.merged).sort();
  if (dates.length === 0) return "";
  const [m0, y0] = monthYear(dates[0]);
  const [m1, y1] = monthYear(dates.at(-1));
  if (y0 === y1) return m0 === m1 ? `${m0} ${y0}` : `${m0} – ${m1} ${y1}`;
  return `${m0} ${y0} – ${m1} ${y1}`;
}

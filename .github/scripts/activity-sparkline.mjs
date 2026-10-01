// .github/scripts/activity-sparkline.mjs
//
// The Console hero's activity chart: one bar per week of the contribution
// calendar. Heights use the same square-root scale as the Sunset skyline, so
// both designs draw the same data the same way. Weeks without contributions
// keep a short dim stub so the baseline stays readable.

// Where the Console template draws the chart. Shared with
// .github/templates/console.svg.template; change them together.
export const CONSOLE_BOX = Object.freeze({ x: 46, y: 1834, width: 1108, height: 100 });

const MIN_BAR = 4;
const STUB = 2;

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const num = (v) => String(Math.round(v * 100) / 100);

// weeks: contributionCalendar.weeks, oldest first.
// box: { x, y, width, height } in viewBox units; bars stand on y + height.
export function sparkline(weeks, { x, y, width, height }) {
  const totals = weeks.map((w) => sum(w.contributionDays.map((d) => d.contributionCount)));
  const max = Math.max(1, ...totals);
  const pitch = width / Math.max(1, weeks.length);
  const barWidth = Math.max(2, Math.round(pitch * 0.62));
  const base = y + height;

  const bars = totals.map((total, i) => {
    const h = total > 0 ? Math.round(MIN_BAR + (height - MIN_BAR) * Math.sqrt(total / max)) : STUB;
    const bx = Math.round(x + i * pitch + (pitch - barWidth) / 2);
    const cls = ["bar", total > 0 ? "" : "zero", i === totals.length - 1 ? "now" : ""].filter(Boolean).join(" ");
    return `<rect class="${cls}" x="${bx}" y="${base - h}" width="${barWidth}" height="${h}" ` +
      `style="animation-delay:${num(0.2 + i * 0.012)}s"/>`;
  });

  return { svg: bars.join(""), totals };
}

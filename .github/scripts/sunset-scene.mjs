// .github/scripts/sunset-scene.mjs
//
// The Sunset hero's login banner: a pixel-art sunset over a skyline drawn from
// the contribution calendar. One building per week, one window per day (lit on
// days with contributions), height from that week's total. The palette comes
// from the pixel-art avatar that sits next to the README on the profile page.
//
// Output is deterministic: roof details, stars and window tints come from a
// seeded PRNG, so the picture only changes when the calendar does.

const BUTTER = "#f6db95";
const GOLD = "#f5c45c";
const AMBER = "#f1a349";
const ORANGE = "#ed8e4c";
const CORAL = "#e97648";
const CREAM = "#f8eed7";
const INK = "#1e1523";

const SKY = ["#1f1626", "#2a1b2e", "#3b2137", "#55273c", "#74303f", "#963a40",
             "#ba4341", "#d45a44", CORAL, ORANGE, AMBER, GOLD];
const SKY_H = [72, 56, 48, 40, 40, 32, 32, 24, 24, 24, 24, 16];
const WATER = ["#3b4259", "#353b52", "#2d3247", "#262a3e", "#221f34", INK];
const WATER_H = [8, 24, 32, 40, 32, 24];
const SUN = ["#fdf4dc", "#fbeac0", "#f8dc9e", "#f6cf82", "#f3bf6c"];

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

// Geometry shared with .github/templates/sunset.svg.template (window, title bar,
// horizon). Change them together.
export const LAYOUT = Object.freeze({
  WX: 16,
  WY: 16,
  WW: 1168,
  SCENE_Y: 64,
  HORIZON: 64 + sum(SKY_H),
  SCENE_B: 64 + sum(SKY_H) + sum(WATER_H),
  SUN_CX: 324,
});

// mulberry32
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const uniform = (next, lo, hi) => lo + (hi - lo) * next();
const snap = (v, step = 4) => step * Math.round(v / step);
const num = (v) => String(Math.round(v * 100) / 100);

function ditherPatterns(colors, prefix) {
  const out = [];
  for (let i = 0; i < colors.length - 1; i++) {
    out.push(
      `<pattern id="${prefix}${i}" width="8" height="8" patternUnits="userSpaceOnUse">` +
      `<rect width="8" height="8" fill="${colors[i]}"/><rect width="4" height="4" fill="${colors[i + 1]}"/>` +
      `<rect x="4" y="4" width="4" height="4" fill="${colors[i + 1]}"/></pattern>`,
    );
  }
  return out.join("");
}

// Horizontal bands with an 8-unit 50% dither strip where one color meets the next.
function bands(colors, heights, y0, prefix) {
  const { WX, WW } = LAYOUT;
  const out = [];
  let y = y0;
  colors.forEach((color, i) => {
    const h = heights[i];
    out.push(`<rect x="${WX}" y="${y}" width="${WW}" height="${h}" fill="${color}"/>`);
    if (i < colors.length - 1 && h >= 16) {
      out.push(`<rect x="${WX}" y="${y + h - 8}" width="${WW}" height="8" fill="url(#${prefix}${i})"/>`);
    }
    y += h;
  });
  return out.join("");
}

// A circle drawn as 4-unit pixel rows, cut off at the horizon. fills run top to bottom.
function pixelDisc(cx, cy, r, fills, clipBottom, attrs = "") {
  const step = 4;
  const top = cy - r;
  const rows = [];
  for (let y = top - (top % step); y < Math.min(cy + r, clipBottom); y += step) {
    const dy = y + step / 2 - cy;
    if (Math.abs(dy) >= r) continue;
    const half = snap(Math.sqrt(r * r - dy * dy), step);
    if (half <= 0) continue;
    const k = Math.min(fills.length - 1, Math.floor(((y - top) / (2 * r)) * fills.length * 1.25));
    rows.push(`<rect x="${cx - half}" y="${y}" width="${2 * half}" height="${step}" fill="${fills[k]}"/>`);
  }
  return `<g${attrs}>${rows.join("")}</g>`;
}

function stars() {
  const { WX, WW, SCENE_Y } = LAYOUT;
  const next = rng(42);
  const out = [];
  for (let k = 0; k < 46; k++) {
    const x = snap(uniform(next, WX + 24, WX + WW - 24));
    const y = snap(uniform(next, SCENE_Y + 12, SCENE_Y + 190));
    const size = next() < 0.25 ? 4 : 2;
    const opacity = num(uniform(next, 0.3, 0.85));
    const twinkle = next() < 0.35;
    const delay = uniform(next, 0, 3);
    // Keep the name, tagline and activity numbers on a clean sky.
    if ((x > 56 && x < 940 && y > 90 && y < 300) || (x > 880 && x < 1170 && y > 90 && y < 200)) continue;
    const cls = twinkle ? ` class="tw" style="animation-delay:${num(delay)}s"` : "";
    out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${CREAM}" opacity="${opacity}"${cls}/>`);
  }
  return out.join("");
}

function sunReflection(cx) {
  const { HORIZON, SCENE_B } = LAYOUT;
  const next = rng(7);
  const widths = [132, 116, 104, 88, 76, 64, 52, 44, 36, 28, 20, 16, 12];
  const colors = [BUTTER, GOLD, AMBER, ORANGE, CORAL];
  const out = [];
  widths.forEach((w, k) => {
    const y = HORIZON + 6 + k * 10;
    if (y > SCENE_B - 12) return;
    const offset = snap(uniform(next, -3, 3) * 4);
    const color = colors[Math.min(colors.length - 1, Math.floor(k / 3))];
    const opacity = Math.max(0.18, 0.9 - k * 0.06);
    out.push(
      `<rect x="${cx - Math.floor(w / 2) + offset}" y="${y}" width="${w}" height="4" fill="${color}" ` +
      `opacity="${num(opacity)}" class="sh" style="animation-delay:${num(uniform(next, 0, 2.5))}s"/>`,
    );
  });
  return out.join("");
}

// weeks: contributionCalendar.weeks, oldest first; each has contributionDays
// ({ date, contributionCount }), up to 7 of them, Sunday first.
export function skyline(weeks) {
  const { WX, WW, HORIZON } = LAYOUT;
  const totals = weeks.map((w) => sum(w.contributionDays.map((d) => d.contributionCount)));
  const max = Math.max(1, ...totals);
  const pitch = WW / Math.max(1, weeks.length);
  const width = Math.floor(pitch) - 3;
  const tallest = totals.indexOf(Math.max(...totals));

  const buildings = weeks.map((week, i) => {
    const next = rng(i * 7919 + 1);
    const x = Math.round(WX + i * pitch + (pitch - width) / 2);
    const h = snap(88 + (236 - 88) * Math.sqrt(totals[i] / max));
    const top = HORIZON - h;
    const facade = i % 2 ? "#1a1220" : "#211726";
    const mid = x + Math.floor(width / 2);
    const parts = [`<rect x="${x}" y="${top}" width="${width}" height="${h}" fill="${facade}"/>`];

    const roll = next();
    if (i === tallest) {
      parts.push(`<rect x="${mid - 1}" y="${top - 28}" width="2" height="28" fill="${facade}"/>`);
      parts.push(`<rect x="${mid - 2}" y="${top - 32}" width="4" height="4" fill="${CORAL}" class="beacon"/>`);
    } else if (roll < 0.22 && h > 110) {
      parts.push(`<rect x="${x + 3}" y="${top - 8}" width="${width - 6}" height="8" fill="${facade}"/>`);
    } else if (roll < 0.34 && h > 110) {
      parts.push(`<rect x="${mid - 1}" y="${top - 14}" width="2" height="14" fill="${facade}"/>`);
    }

    week.contributionDays.forEach((day, d) => {
      const y = top + 10 + d * 9;
      if (day.contributionCount > 0) {
        const color = next() < 0.3 ? GOLD : BUTTER;
        const delay = 1.1 + i * 0.03 + d * 0.015;
        parts.push(`<rect x="${mid - 3}" y="${y}" width="6" height="5" fill="${color}" class="w" style="animation-delay:${num(delay)}s"/>`);
      } else {
        parts.push(`<rect x="${mid - 3}" y="${y}" width="6" height="5" fill="#34252f"/>`);
      }
    });
    return `<g class="b" style="animation-delay:${num(i * 0.014)}s">${parts.join("")}</g>`;
  });

  return { svg: buildings.join(""), totals, tallest };
}

export function renderScene(weeks) {
  const { WX, WW, SCENE_Y, HORIZON, SUN_CX } = LAYOUT;
  const defs = ditherPatterns(SKY, "ds") + ditherPatterns(WATER, "dw");
  const scene = [
    bands(SKY, SKY_H, SCENE_Y, "ds"),
    stars(),
    pixelDisc(SUN_CX, HORIZON - 4, 188, [BUTTER], HORIZON, ' class="glow" opacity="0.12"'),
    pixelDisc(SUN_CX, HORIZON - 4, 170, [BUTTER], HORIZON, ' class="glow" opacity="0.24"'),
    pixelDisc(SUN_CX, HORIZON - 4, 152, SUN, HORIZON),
    `<rect x="${WX}" y="${HORIZON - 4}" width="${WW}" height="4" fill="${BUTTER}" opacity="0.55"/>`,
    `<g id="skyline">${skyline(weeks).svg}</g>`,
    bands(WATER, WATER_H, HORIZON, "dw"),
    `<g clip-path="url(#water)" opacity="0.17"><use href="#skyline" transform="translate(0,${HORIZON * 1.5}) scale(1,-0.5)"/></g>`,
    sunReflection(SUN_CX),
    `<rect x="${WX}" y="${HORIZON}" width="${WW}" height="2" fill="${INK}" opacity="0.35"/>`,
  ].join("");
  return { defs, scene };
}

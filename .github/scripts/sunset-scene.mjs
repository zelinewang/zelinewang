// .github/scripts/sunset-scene.mjs
//
// The Sunset hero's login banner: a pixel-art sunset over a skyline drawn from
// the contribution calendar. One building per week, one window per day (lit on
// days with contributions), height from that week's total. The palette comes
// from the pixel-art avatar that sits next to the README on the profile page.
//
// Output is deterministic: roof details, facades, stars and window tints come
// from a seeded PRNG, so the picture only changes when the calendar does.

const BUTTER = "#f6db95";
const GOLD = "#f5c45c";
const AMBER = "#f1a349";
const ORANGE = "#ed8e4c";
const CORAL = "#e97648";
const CREAM = "#f8eed7";
const INK = "#1e1523";

const SKY = ["#1f1626", "#2a1b2e", "#3b2137", "#55273c", "#74303f", "#963a40",
             "#ba4341", "#d45a44", CORAL, ORANGE, AMBER, GOLD];
// Band edges carry an 8-unit dither strip. These heights put two edges at 260
// and 296, in the gaps under the tagline and the sub-line (LAYOUT.BODY_ROWS),
// so no dither runs through body text; bands still thin toward the horizon.
const SKY_H = [72, 64, 60, 36, 32, 32, 24, 24, 24, 24, 24, 16];
const WATER = ["#3b4259", "#353b52", "#2d3247", "#262a3e", "#221f34", INK];
const WATER_H = [8, 16, 24, 32, 24, 16];
const SUN = ["#fdf4dc", "#fbeac0", "#f8dc9e", "#f6cf82", "#f3bf6c"];
// Neighbouring buildings never share a shade, so touching facades still separate.
const FACADES = ["#19111f", "#2a1d30", "#221828"];
const DARK_WINDOW = "#3d2c38";

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
  // Building heights for the quietest and the busiest week.
  MIN_H: 88,
  MAX_H: 200,
  // The name, tagline and sub-line sit left of TEXT_RIGHT and above TEXT_CLEAR
  // in the template. Nothing in the skyline may reach into that box, including
  // when a busy week drifts left under the text as the calendar moves on.
  TEXT_RIGHT: 980,
  TEXT_CLEAR: 292,
  // Ink extent of the tagline (26 units, baseline 246) and the sub-line (20,
  // baseline 278), measured from the embedded font. No dither may cross them.
  BODY_ROWS: Object.freeze([Object.freeze([226, 252]), Object.freeze([263, 283])]),
  // The open sky the text leaves over: the darkest band, above the name. Stars
  // go only here, one per equal slice of a field, so the sprinkle reads as
  // deliberate rather than as dust.
  STAR_FIELDS: Object.freeze([
    Object.freeze({ x0: 44, x1: 820, y0: 72, y1: 100, count: 8 }),
  ]),
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
      `<pattern id="${prefix}${i}" width="8" height="8" patternUnits="userSpaceOnUse" shape-rendering="crispEdges">` +
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
  const next = rng(42);
  const even = (v) => 2 * Math.floor(v / 2);
  const out = [];
  for (const { x0, x1, y0, y1, count } of LAYOUT.STAR_FIELDS) {
    const slice = (x1 - x0) / count;
    for (let k = 0; k < count; k++) {
      const size = next() < 0.25 ? 4 : 2;
      const x = Math.max(x0, even(uniform(next, x0 + k * slice, x0 + (k + 1) * slice - size)));
      const y = Math.max(y0, even(uniform(next, y0, y1 - size)));
      const opacity = num(uniform(next, 0.35, 0.85));
      const cls = next() < 0.35 ? ` class="tw" style="animation-delay:${num(uniform(next, 0, 3))}s"` : "";
      out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${CREAM}" opacity="${opacity}"${cls}/>`);
    }
  }
  return out.join("");
}

// A glitter path: seen from the shore, the sun's reflection is narrow at the
// horizon and widens toward the viewer, and its rows spread apart with distance
// covered. Each row is broken into a few glints.
function sunReflection(cx) {
  const { HORIZON, SCENE_B } = LAYOUT;
  const next = rng(7);
  const colors = [BUTTER, GOLD, AMBER, ORANGE, CORAL];
  const gap = 8;
  const out = [];
  for (let k = 0; ; k++) {
    const y = HORIZON + 6 + snap(8 * k + 1.2 * k * k);
    if (y > SCENE_B - 10) break;
    const span = snap(40 + 20 * k);
    const pieces = k < 2 ? 1 : k < 5 ? 2 : 3;
    const color = colors[Math.min(colors.length - 1, Math.floor(k / 2))];
    const opacity = num(Math.max(0.3, 0.92 - k * 0.09));
    let x = snap(cx - span / 2 + uniform(next, -1, 1) * 4);
    let left = span - gap * (pieces - 1);
    for (let p = 0; p < pieces; p++) {
      const rest = pieces - p - 1;
      const w = rest === 0 ? left : Math.min(left - 4 * rest, Math.max(4, snap((left / (rest + 1)) * uniform(next, 0.7, 1.3))));
      out.push(
        `<rect x="${x}" y="${y}" width="${w}" height="4" fill="${color}" opacity="${opacity}" ` +
        `class="sh" style="animation-delay:${num(uniform(next, 0, 2.5))}s"/>`,
      );
      x += w + gap;
      left -= w;
    }
  }
  return out.join("");
}

// weeks: contributionCalendar.weeks, oldest first; each has contributionDays
// ({ date, contributionCount }), up to 7 of them, Sunday first.
export function skyline(weeks) {
  const { WX, WW, HORIZON, SUN_CX, MIN_H, MAX_H, TEXT_RIGHT, TEXT_CLEAR } = LAYOUT;
  const totals = weeks.map((w) => sum(w.contributionDays.map((d) => d.contributionCount)));
  const max = Math.max(1, ...totals);
  // Centres run from edge to edge, so the window frame cuts the first and last
  // buildings the way a viewfinder crops a city. Buildings touch, overlapping by
  // a unit so no hairline of bright sky shows between them; seen from across the
  // water a skyline has no gaps, and gaps back-lit by the sunset read as a barcode.
  const pitch = WW / Math.max(1, weeks.length - 1);
  const width = Math.min(Math.ceil(pitch) + 1, 40);
  const tallest = totals.indexOf(Math.max(...totals));
  let previousShade = -1;

  const buildings = weeks.map((week, i) => {
    const next = rng(i * 7919 + 1);
    const cx = WX + i * pitch;
    const w = width;
    const x = Math.round(cx - w / 2);
    const h = snap(MIN_H + (MAX_H - MIN_H) * Math.sqrt(totals[i] / max));
    const top = HORIZON - h;
    let shade = Math.floor(next() * FACADES.length);
    if (shade === previousShade) shade = (shade + 1) % FACADES.length;
    previousShade = shade;
    const facade = FACADES[shade];
    const mid = x + Math.floor(w / 2);
    const ceiling = cx < TEXT_RIGHT ? TEXT_CLEAR : -Infinity;
    const parts = [];

    // Setback crowns stay inside the data height; antennas never enter the text box.
    const roll = next();
    const crown = i !== tallest && h > 150 && roll < 0.3 ? 12 : 0;
    parts.push(`<rect x="${x}" y="${top + crown}" width="${w}" height="${h - crown}" fill="${facade}"/>`);
    if (crown) parts.push(`<rect x="${x + 3}" y="${top}" width="${w - 6}" height="${crown}" fill="${facade}"/>`);

    // Rim light on the side facing the sun, stronger near it.
    const glow = 0.1 + 0.5 * Math.max(0, 1 - Math.abs(cx - SUN_CX) / 560);
    const rimX = cx < SUN_CX ? x + w - 2 : x;
    parts.push(`<rect x="${rimX}" y="${top + crown}" width="2" height="${h - crown}" fill="url(#rim)" opacity="${num(glow)}"/>`);

    const tip = (length) => {
      const y = Math.max(top - length, ceiling);
      return top - y >= 6 ? y : null;
    };
    if (i === tallest) {
      const y = tip(22);
      if (y !== null) {
        parts.push(`<rect x="${mid - 1}" y="${y + 4}" width="2" height="${top - y - 4}" fill="${facade}"/>`);
        parts.push(`<rect x="${mid - 2}" y="${y}" width="4" height="4" fill="${CORAL}" class="beacon"/>`);
      }
    } else if (roll >= 0.3 && roll < 0.42 && h > 110) {
      const y = tip(14);
      if (y !== null) parts.push(`<rect x="${mid - 1}" y="${y}" width="2" height="${top - y}" fill="${facade}"/>`);
    }

    // One window per day, spread down the facade so busy weeks look lived in.
    const step = 4 * Math.max(2, Math.floor((h - 26) / 24));
    week.contributionDays.forEach((day, d) => {
      const y = top + 10 + d * step;
      if (day.contributionCount > 0) {
        const color = next() < 0.3 ? GOLD : BUTTER;
        const delay = 1.1 + i * 0.03 + d * 0.015;
        parts.push(`<rect x="${mid - 3}" y="${y}" width="6" height="5" fill="${color}" class="w" style="animation-delay:${num(delay)}s"/>`);
      } else {
        parts.push(`<rect x="${mid - 3}" y="${y}" width="6" height="5" fill="${DARK_WINDOW}"/>`);
      }
    });
    return `<g class="b" data-h="${h}" style="animation-delay:${num(i * 0.014)}s">${parts.join("")}</g>`;
  });

  return { svg: buildings.join(""), totals, tallest };
}

export function renderScene(weeks) {
  const { WX, WW, SCENE_Y, HORIZON, SUN_CX } = LAYOUT;
  const defs = ditherPatterns(SKY, "ds") + ditherPatterns(WATER, "dw") +
    `<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD}"/>` +
    `<stop offset="1" stop-color="${CORAL}" stop-opacity="0"/></linearGradient>`;
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

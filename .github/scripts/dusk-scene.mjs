// .github/scripts/dusk-scene.mjs
//
// The Dusk hero's picture: a pixel-art sunset over a city built from the past
// year of the contribution calendar. One building per week (height from that
// week's total), one window per day (lit on days with contributions), and a
// gold pennant on the roof of each week in which one of Zane's pull requests
// was merged upstream. The palette comes from the pixel-art avatar beside the
// README on the profile page.
//
// Two layouts draw the same city: DESKTOP for GitHub's 846-px README column and
// PHONE for the narrow column on a phone. Each is authored at the width it is
// shown, so one art pixel lands on whole screen pixels and edges stay crisp.
//
// Output is deterministic: facades, roofs, stars and window tints come from a
// seeded PRNG, so the picture only changes when the calendar does.

const BUTTER = "#f6db95";
const GOLD = "#f5c45c";
const AMBER = "#f1a349";
const ORANGE = "#ed8e4c";
const CORAL = "#e97648";
const CREAM = "#f8eed7";
// Pennant poles, here and in the templates' legend icon, so a roof flag reads as the same mark.
export const POLE = "#c6ad84";
export const INK = "#1e1523";

// Band colors, top to bottom; exported so tests can check text against what is behind it.
export const SKY = Object.freeze(["#1f1626", "#2a1b2e", "#3b2137", "#55273c", "#74303f", "#963a40",
                                  "#ba4341", "#d45a44", CORAL, ORANGE, AMBER, GOLD]);
export const WATER = Object.freeze(["#3b4259", "#353b52", "#2d3247", "#262a3e", "#221f34", INK]);
const SUN = ["#fdf4dc", "#fbeac0", "#f8dc9e", "#f6cf82", "#f3bf6c"];
// Neighbouring buildings never share a shade, so touching facades still separate.
const FACADES = ["#19111f", "#2a1d30", "#221828"];
const DARK_WINDOW = "#3d2c38";
export const UNLIT = DARK_WINDOW;

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const freeze = (o) => Object.freeze(Array.isArray(o) ? o.map(freeze) : o && typeof o === "object"
  ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, freeze(v)])) : o);

// Heights below are in art pixels (sky, water, clouds) or viewBox units (the rest).
function layout(spec) {
  const { P, skyPx, waterPx } = spec;
  return freeze({ ...spec, HORIZON: P * sum(skyPx), WATER_B: P * (sum(skyPx) + sum(waterPx)) });
}

// Geometry shared with the templates; change them together. Sky band edges carry
// a two-pixel dither strip, except near the name (nameRow, its shadow included)
// and the tagline and sub-line (textRows): there a checkerboard behind or just
// under the letters reads as noise or an underline, so those edges are plain
// colour steps. Nothing in the skyline rises above textClear, where the text
// sits, and maxH leaves the tallest roof room for a pennant or beacon (7 pixels).
export const DESKTOP = layout({
  W: 846, P: 3,
  // One dark band behind the name, tagline and sub-line; the glow gathers above the city.
  skyPx: [12, 54, 9, 8, 7, 7, 6, 6, 5, 5, 4, 3],
  waterPx: [2, 3, 4, 6, 4, 3],
  sunCx: 231, sunR: 126,
  minH: 72, maxH: 162, buildingW: 18,
  // A pennant's flag, in art pixels.
  flag: [3, 2],
  textClear: 192,
  nameRow: [48, 120],
  textRows: [[136, 154], [163, 177]],
  // Open sky above and beside the name, one star per equal slice of a field.
  starFields: [{ x0: 21, x1: 540, y0: 9, y1: 36, count: 7 }, { x0: 600, x1: 828, y0: 9, y1: 114, count: 5 }],
  // Cloud strata across the sun, below its crown: left edge, top, length in pixels.
  clouds: [{ x: 132, y: 300, len: 60 }, { x: 300, y: 282, len: 62 }],
});

export const PHONE = layout({
  W: 320, P: 2,
  skyPx: [18, 60, 9, 8, 8, 7, 7, 7, 6, 6, 6, 5],
  waterPx: [1, 2, 3, 4, 3, 2],
  sunCx: 92, sunR: 68,
  minH: 40, maxH: 110, buildingW: 8,
  // Bigger than the desktop's in art pixels, so it still shows at phone size.
  flag: [4, 3],
  textClear: 154,
  nameRow: [44, 80],
  textRows: [[94, 107], [110, 123], [133, 143]],
  starFields: [{ x0: 10, x1: 310, y0: 6, y1: 30, count: 6 }],
  clouds: [{ x: 40, y: 254, len: 40 }, { x: 130, y: 242, len: 30 }],
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
const num = (v) => String(Math.round(v * 100) / 100);
const rect = (x, y, w, h, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;

function ditherPatterns(L, colors, prefix) {
  const { P } = L;
  const out = [];
  for (let i = 0; i < colors.length - 1; i++) {
    out.push(
      `<pattern id="${prefix}${i}" width="${2 * P}" height="${2 * P}" patternUnits="userSpaceOnUse" shape-rendering="crispEdges">` +
      rect(0, 0, 2 * P, 2 * P, colors[i]) + rect(0, 0, P, P, colors[i + 1]) + rect(P, P, P, P, colors[i + 1]) +
      `</pattern>`,
    );
  }
  return out.join("");
}

// Horizontal bands with a two-pixel 50% dither strip where one color meets the next,
// unless plain(top, bottom) says the strip would sit too close to text.
function bands(L, colors, heights, y0, prefix, plain = () => false) {
  const { P, W } = L;
  const out = [];
  let y = y0;
  colors.forEach((color, i) => {
    const h = P * heights[i];
    out.push(rect(0, y, W, h, color));
    if (i < colors.length - 1 && heights[i] >= 4 && !plain(y + h - 2 * P, y + h)) {
      out.push(rect(0, y + h - 2 * P, W, 2 * P, `url(#${prefix}${i})`));
    }
    y += h;
  });
  return out.join("");
}

// True when a strip from top to bottom comes within four art pixels of a text row.
export function nearText(L, top, bottom) {
  const gap = 4 * L.P;
  return [L.nameRow, ...L.textRows].some(([t, b]) => bottom > t - gap && top < b + gap);
}

// The index of the sky band that covers row y.
export function skyBandAt(L, y) {
  let edge = 0;
  for (let i = 0; i < L.skyPx.length; i++) {
    edge += L.P * L.skyPx[i];
    if (y < edge) return i;
  }
  return L.skyPx.length - 1;
}

// A disc drawn as one-pixel rows, cut off at the horizon; fills run top to bottom.
function pixelDisc(L, cx, cy, r, fills, clipBottom, attrs = "") {
  const { P } = L;
  const snap = (v) => P * Math.round(v / P);
  const top = snap(cy - r);
  const rows = [];
  for (let y = top; y < Math.min(cy + r, clipBottom); y += P) {
    const dy = y + P / 2 - cy;
    if (Math.abs(dy) >= r) continue;
    const half = snap(Math.sqrt(r * r - dy * dy));
    if (half <= 0) continue;
    const k = Math.min(fills.length - 1, Math.floor(((y - top) / (2 * r)) * fills.length * 1.25));
    rows.push(rect(cx - half, y, 2 * half, P, fills[k]));
  }
  return `<g${attrs}>${rows.join("")}</g>`;
}

function stars(L) {
  const { P } = L;
  const next = rng(42);
  const out = [];
  for (const { x0, x1, y0, y1, count } of L.starFields) {
    const slice = (x1 - x0) / count;
    for (let k = 0; k < count; k++) {
      // One art pixel: a two-pixel star reads as a grey square, not a point of light.
      const size = P;
      next();
      const x = Math.max(x0, P * Math.floor(uniform(next, x0 + k * slice, x0 + (k + 1) * slice - size) / P));
      const y = Math.max(y0, P * Math.floor(uniform(next, y0, y1 - size) / P));
      const opacity = num(uniform(next, 0.4, 0.85));
      const cls = next() < 0.4 ? ` class="tw" style="animation-delay:${num(uniform(next, 0, 3))}s"` : "";
      out.push(rect(x, y, size, size, CREAM, ` opacity="${opacity}"${cls}`));
    }
  }
  return out.join("");
}

// Flat cloud strata drifting across the sun: a tapered body one shade darker than
// the sky band behind it, lit along the underside by a lighter band further down.
function clouds(L) {
  const { P } = L;
  return L.clouds.map(({ x, y, len }) => {
    const behind = skyBandAt(L, y);
    const body = SKY[Math.max(0, behind - 1)];
    const lit = SKY[Math.min(SKY.length - 1, behind + 4)];
    const w = len * P;
    return `<g class="cloud">` +
      rect(x + 8 * P, y, w - 20 * P, P, body) +
      rect(x + 2 * P, y + P, w - 6 * P, P, body) +
      rect(x, y + 2 * P, w, P, body) +
      rect(x + 3 * P, y + 3 * P, w - 9 * P, P, lit, ' opacity="0.85"') +
      `</g>`;
  }).join("");
}

// A glitter path: narrow at the horizon, widening toward the viewer, rows
// spreading apart with the distance covered, each row broken into glints.
function sunReflection(L) {
  const { P, HORIZON, sunCx, W } = L;
  const snap = (v) => P * Math.round(v / P);
  const scale = W / 846;
  // The last two water bands are almost the ground's colour; glints there float.
  const glitterEnd = HORIZON + P * sum(L.waterPx.slice(0, -2));
  const next = rng(7);
  const colors = [BUTTER, GOLD, AMBER, ORANGE, CORAL];
  const gap = 2 * P;
  const out = [];
  for (let k = 0; ; k++) {
    const y = HORIZON + P + snap(scale * (5 * k + 0.9 * k * k));
    if (y > glitterEnd - P) break;
    const span = snap(scale * (30 + 15 * k));
    const pieces = k < 2 ? 1 : k < 4 ? 2 : 3;
    const color = colors[Math.min(colors.length - 1, Math.floor(k / 2))];
    const opacity = num(Math.max(0.35, 0.92 - k * 0.1));
    let x = snap(sunCx - span / 2 + uniform(next, -1, 1) * P);
    let left = span - gap * (pieces - 1);
    for (let p = 0; p < pieces; p++) {
      const rest = pieces - p - 1;
      const w = rest === 0 ? left : Math.min(left - P * rest, Math.max(P, snap((left / (rest + 1)) * uniform(next, 0.7, 1.3))));
      if (w > 0) out.push(rect(x, y, w, P, color, ` opacity="${opacity}" class="sh" style="animation-delay:${num(uniform(next, 0, 2.5))}s"`));
      x += w + gap;
      left -= w;
    }
  }
  return out.join("");
}

// weeks: contributionCalendar.weeks, oldest first; each has contributionDays
// ({ date, contributionCount }), up to 7 of them, Sunday first.
// merged: ISO dates (YYYY-MM-DD) on which an upstream pull request was merged.
export function skyline(weeks, merged = [], L = DESKTOP) {
  const { W, P, HORIZON, sunCx, minH, maxH, buildingW, textClear, flag } = L;
  const snap = (v) => P * Math.round(v / P);
  const totals = weeks.map((w) => sum(w.contributionDays.map((d) => d.contributionCount)));
  const max = Math.max(1, ...totals);
  const mergedDates = new Set(merged);
  const flagged = weeks.map((w) => w.contributionDays.some((d) => mergedDates.has(d.date)));
  // Centres run from edge to edge, so the frame crops the first and last
  // buildings the way a viewfinder crops a city. Buildings always overlap, so
  // no bright sky shows between them and the row reads as a city, not a barcode.
  const pitch = W / Math.max(1, weeks.length - 1);
  const tallest = totals.indexOf(Math.max(...totals));
  // Windows: one per day, one pixel wide; taller on the desktop grid.
  const winH = P === 3 ? 2 * P : P;
  let previousShade = -1;

  const buildings = weeks.map((week, i) => {
    const next = rng(i * 7919 + 1);
    const cx = i * pitch;
    // Widths vary so the row does not read as a bar chart.
    const w = buildingW + P * Math.floor(next() * 3);
    const x = snap(cx - w / 2);
    const h = Math.min(HORIZON - textClear, snap(minH + (maxH - minH) * Math.sqrt(totals[i] / max)));
    const top = HORIZON - h;
    let shade = Math.floor(next() * FACADES.length);
    if (shade === previousShade) shade = (shade + 1) % FACADES.length;
    previousShade = shade;
    const facade = FACADES[shade];
    // The window column, as close to the middle as the pixel grid allows.
    const col = x + P * Math.floor((w / P - 1) / 2);
    const parts = [];

    // A setback crown on some tall buildings, inside the data height.
    const roll = next();
    const crown = i !== tallest && !flagged[i] && h > 0.73 * maxH && roll < 0.3 ? 3 * P : 0;
    parts.push(rect(x, top + crown, w, h - crown, facade));
    if (crown) parts.push(rect(x + P, top, w - 2 * P, crown, facade));

    // Rim light on the side facing the sun, fading out with distance from it.
    const glow = 0.65 * Math.max(0, 1 - Math.abs(cx - sunCx) / (0.39 * W));
    if (glow > 0.05) {
      const rimX = cx < sunCx ? x + w - P : x;
      parts.push(rect(rimX, top + crown, P, h - crown, "url(#rim)", ` opacity="${num(glow)}"`));
    }

    // Roof furniture never reaches into the text band.
    const room = top - textClear;
    if (flagged[i] && room >= 6 * P) {
      // Pennant: a tan pole and a gold flag, for a week with a merged upstream PR.
      parts.push(rect(col, top - 6 * P, P, 6 * P, POLE, ' class="pole"'));
      parts.push(rect(col + P, top - 6 * P, flag[0] * P, flag[1] * P, GOLD, ' class="flag"'));
    } else if (i === tallest && room >= 7 * P) {
      parts.push(rect(col, top - 5 * P, P, 5 * P, facade));
      parts.push(rect(col, top - 7 * P, P, 2 * P, CORAL, ' class="beacon"'));
    } else if (roll >= 0.3 && roll < 0.42 && h > 0.6 * maxH && room >= 4 * P) {
      parts.push(rect(col, top - 4 * P, P, 4 * P, facade));
    }

    // One window per day, spread down the facade so busy weeks look lived in.
    const step = P * Math.max(winH / P + 1, Math.floor((h / P - 4) / 7));
    week.contributionDays.forEach((day, d) => {
      const y = top + 2 * P + d * step;
      if (day.contributionCount > 0) {
        // Gold is kept for the pennants, so a lit window never looks like a flag.
        next();
        const color = BUTTER;
        const delay = 1.1 + i * 0.03 + d * 0.015;
        parts.push(rect(col, y, P, winH, color, ` class="w" style="animation-delay:${num(delay)}s"`));
      } else {
        parts.push(rect(col, y, P, winH, DARK_WINDOW));
      }
    });
    return `<g class="b" data-h="${h}"${flagged[i] ? ' data-merged="1"' : ""} style="animation-delay:${num(i * 0.014)}s">${parts.join("")}</g>`;
  });

  return { svg: buildings.join(""), totals, tallest, flagged };
}

// The whole picture for one layout: sky, sun, clouds, city, water, reflections.
// The template supplies the "water" clip path (the band between HORIZON and WATER_B).
export function renderScene(weeks, merged = [], L = DESKTOP) {
  const { W, P, HORIZON, sunCx, sunR } = L;
  const defs = ditherPatterns(L, SKY, "ds") + ditherPatterns(L, WATER, "dw") +
    `<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD}"/>` +
    `<stop offset="1" stop-color="${CORAL}" stop-opacity="0"/></linearGradient>`;
  const glowStep = 4 * P;
  const scene = [
    bands(L, SKY, L.skyPx, 0, "ds", (top, bottom) => nearText(L, top, bottom)),
    stars(L),
    // The glow animation sets opacity, which would override the halo's own
    // opacity attribute, so it runs on a wrapper and the two multiply.
    `<g class="glow">${pixelDisc(L, sunCx, HORIZON - P, sunR + 2 * glowStep + P, [BUTTER], HORIZON, ' opacity="0.12"')}</g>`,
    `<g class="glow">${pixelDisc(L, sunCx, HORIZON - P, sunR + glowStep, [BUTTER], HORIZON, ' opacity="0.24"')}</g>`,
    pixelDisc(L, sunCx, HORIZON - P, sunR, SUN, HORIZON),
    clouds(L),
    rect(0, HORIZON - P, W, P, BUTTER, ' opacity="0.55"'),
    `<g id="skyline">${skyline(weeks, merged, L).svg}</g>`,
    bands(L, WATER, L.waterPx, HORIZON, "dw"),
    `<g clip-path="url(#water)" opacity="0.17"><use href="#skyline" transform="translate(0,${HORIZON * 1.5}) scale(1,-0.5)"/></g>`,
    sunReflection(L),
    rect(0, HORIZON, W, P, INK, ' opacity="0.35"'),
  ].join("");
  return { defs, scene };
}

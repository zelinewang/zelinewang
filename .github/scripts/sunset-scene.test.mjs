import assert from "node:assert/strict";
import test from "node:test";

import { LAYOUT, renderScene, skyline } from "./sunset-scene.mjs";

// weeks of { contributionDays: [{ date, contributionCount }] }, oldest first.
function weeks(counts) {
  return counts.map((days, w) => ({
    contributionDays: days.map((contributionCount, d) => ({
      date: `2026-01-${String(1 + w * 7 + d).padStart(2, "0")}`,
      contributionCount,
    })),
  }));
}

const sample = weeks([
  [0, 3, 1, 0, 2, 0, 0],
  [5, 5, 5, 5, 5, 5, 5],
  [0, 0, 0, 0, 0, 0, 0],
  [40, 12, 0, 9],          // the current week is usually partial
]);

const count = (svg, pattern) => (svg.match(pattern) || []).length;

test("one building per week", () => {
  const { svg } = skyline(sample);
  assert.equal(count(svg, /<g class="b"/g), 4);
});

test("one lit window per day with contributions, one dark window per day without", () => {
  const { svg } = skyline(sample);
  const days = sample.flatMap((w) => w.contributionDays);
  assert.equal(count(svg, /class="w"/g), days.filter((d) => d.contributionCount > 0).length);
  assert.equal(count(svg, /fill="#3d2c38"/g), days.filter((d) => d.contributionCount === 0).length);
});

test("the busiest week is the tallest building and carries the beacon", () => {
  const { svg, tallest, totals } = skyline(sample);
  assert.equal(tallest, 3);
  assert.deepEqual(totals, [6, 35, 0, 61]);
  assert.equal(count(svg, /class="beacon"/g), 1);

  const buildings = parseBuildings(svg);
  const heights = buildings.map((b) => b.height);
  assert.equal(Math.max(...heights), heights[3]);
  for (const b of buildings) {
    assert.ok(b.height >= LAYOUT.MIN_H && b.height <= LAYOUT.MAX_H, `height ${b.height} outside ${LAYOUT.MIN_H}..${LAYOUT.MAX_H}`);
    // The drawn mass reaches exactly the data height and stands on the horizon.
    assert.equal(b.massTop, LAYOUT.HORIZON - b.height);
    assert.equal(b.massBottom, LAYOUT.HORIZON);
  }
});

// Buildings carry their data height; the mass is every rect wider than an antenna.
function parseBuildings(svg) {
  return [...svg.matchAll(/<g class="b" data-h="(\d+)"[^>]*>(.*?)<\/g>/g)].map(([, h, body]) => {
    const rects = [...body.matchAll(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)"([^>]*)\/>/g)]
      .map(([, x, y, width, height, rest]) => ({ x: +x, y: +y, width: +width, height: +height, rest }));
    const mass = rects.filter((r) => r.width > 6 && !/class="w"|#3d2c38/.test(r.rest));
    return {
      height: Number(h),
      massTop: Math.min(...mass.map((r) => r.y)),
      massBottom: Math.max(...mass.map((r) => r.y + r.height)),
      top: Math.min(...rects.map((r) => r.y)),
      left: Math.min(...rects.map((r) => r.x)),
    };
  });
}

test("buildings touch and neighbours differ in shade, so the row reads as a city, not a barcode", () => {
  const year = weeks(Array.from({ length: 53 }, (_, i) => [i % 5, 1, 2]));
  const svg = skyline(year).svg;
  const masses = [...svg.matchAll(/<g class="b"[^>]*><rect x="([\d.-]+)" y="[\d.-]+" width="([\d.]+)" height="[\d.]+" fill="(#[0-9a-f]{6})"/g)]
    .map(([, x, width, fill]) => ({ left: +x, right: +x + +width, fill }));
  assert.equal(masses.length, 53);
  for (let i = 1; i < masses.length; i++) {
    assert.ok(masses[i].left <= masses[i - 1].right, `sky shows between buildings ${i - 1} and ${i}`);
    assert.notEqual(masses[i].fill, masses[i - 1].fill, `buildings ${i - 1} and ${i} share a shade`);
  }
});

test("a tall building's windows run down the facade, not only under the roof", () => {
  const svg = skyline(weeks([[9, 9, 9, 9, 9, 9, 9], [1]])).svg;
  const [tall] = parseBuildings(svg);
  const first = svg.split('<g class="b"')[1];
  const windows = [...first.matchAll(/<rect x="[\d.-]+" y="([\d.-]+)" width="6" height="5"/g)].map((m) => +m[1]);
  assert.equal(windows.length, 7);
  const lowest = Math.max(...windows) + 5 - (LAYOUT.HORIZON - tall.height);
  assert.ok(lowest > 0.75 * tall.height, `windows end ${lowest} units down a ${tall.height}-unit facade`);
});

test("nothing in the skyline reaches into the name and tagline", () => {
  // The busiest week sits at the far left, under the text, where it will drift
  // as the calendar moves; its roof and beacon must still stay below the text.
  const busyFirst = weeks([[40, 40, 40, 40, 40, 40, 40], [1], [2, 2], [3], [0, 1]]);
  const buildings = parseBuildings(skyline(busyFirst).svg);
  assert.equal(buildings.length, 5);
  for (const b of buildings) {
    if (b.left < LAYOUT.TEXT_RIGHT) {
      assert.ok(b.top >= LAYOUT.TEXT_CLEAR, `building at x=${b.left} reaches y=${b.top}, above ${LAYOUT.TEXT_CLEAR}`);
    }
  }
});

test("stars sprinkle the open sky evenly and stay clear of the name and the numbers", () => {
  const { scene } = renderScene(sample);
  const stars = [...scene.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="(\d)" height="\d" fill="#f8eed7"/g)]
    .map(([, x, y, size]) => ({ x: +x, y: +y, size: +size }));
  const inside = (s, f) => s.x >= f.x0 && s.x + s.size <= f.x1 && s.y >= f.y0 && s.y + s.size <= f.y1;
  for (const field of LAYOUT.STAR_FIELDS) {
    const here = stars.filter((s) => inside(s, field)).sort((a, b) => a.x - b.x);
    assert.equal(here.length, field.count, `expected ${field.count} stars in ${JSON.stringify(field)}`);
    // Even: no two neighbours closer than a third of a slice, no gap wider than two slices.
    const slice = (field.x1 - field.x0) / field.count;
    for (let i = 1; i < here.length; i++) {
      const gap = here[i].x - here[i - 1].x;
      assert.ok(gap <= 2 * slice, `stars ${gap} apart, more than two slices`);
    }
  }
  assert.equal(stars.length, LAYOUT.STAR_FIELDS.reduce((n, f) => n + f.count, 0), "a star fell outside the open sky");
});

test("no sky dither runs through the tagline or the sub-line", () => {
  const { scene } = renderScene(sample);
  const strips = [...scene.matchAll(/<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="(\d+)" fill="url\(#ds\d+\)"/g)]
    .map(([, y, h]) => [+y, +y + +h]);
  assert.ok(strips.length >= 10, `expected the sky's dither strips, found ${strips.length}`);
  for (const [top, bottom] of LAYOUT.BODY_ROWS) {
    for (const [y0, y1] of strips) {
      assert.ok(y1 <= top || y0 >= bottom, `dither ${y0}-${y1} crosses text row ${top}-${bottom}`);
    }
  }
});

test("the sun's reflection widens toward the viewer, as a glitter path does", () => {
  const { scene } = renderScene(sample);
  const rows = new Map();
  for (const [, x, y, width] of scene.matchAll(/<rect x="([\d.-]+)" y="([\d.]+)" width="([\d.]+)" height="4"[^>]*class="sh"/g)) {
    const row = rows.get(+y) || { min: Infinity, max: -Infinity };
    row.min = Math.min(row.min, +x);
    row.max = Math.max(row.max, +x + +width);
    rows.set(+y, row);
  }
  const spans = [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, r]) => r.max - r.min);
  assert.ok(spans.length >= 5, `expected several glint rows, got ${spans.length}`);
  for (let i = 1; i < spans.length; i++) {
    assert.ok(spans[i] >= spans[i - 1], `row ${i} (${spans[i]}) is narrower than the row above (${spans[i - 1]})`);
  }
});

test("the scene is deterministic and every dither pattern it uses is defined", () => {
  const a = renderScene(sample);
  const b = renderScene(sample);
  assert.equal(a.scene, b.scene);
  assert.equal(a.defs, b.defs);

  // Every paint server the scene uses is defined in its defs (the water clip lives in the template).
  const used = new Set([...a.scene.matchAll(/url\(#([\w-]+)\)/g)].map((m) => m[1]).filter((id) => id !== "water"));
  const defined = new Set([...a.defs.matchAll(/<(?:pattern|linearGradient) id="([\w-]+)"/g)].map((m) => m[1]));
  for (const id of used) {
    assert.ok(defined.has(id), `paint ${id} used but not defined`);
  }
  assert.match(a.scene, /<g id="skyline">/);
  assert.match(a.scene, /<use href="#skyline"/);
});

test("an empty calendar still renders a scene without buildings", () => {
  const { scene } = renderScene([]);
  assert.match(scene, /<g id="skyline"><\/g>/);
});

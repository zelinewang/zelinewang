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
  assert.equal(count(svg, /fill="#34252f"/g), days.filter((d) => d.contributionCount === 0).length);
});

test("the busiest week is the tallest building and carries the beacon", () => {
  const { svg, tallest, totals } = skyline(sample);
  assert.equal(tallest, 3);
  assert.deepEqual(totals, [6, 35, 0, 61]);
  assert.equal(count(svg, /class="beacon"/g), 1);

  const heights = [...svg.matchAll(/<g class="b"[^>]*><rect x="\d+" y="(\d+)" width="\d+" height="(\d+)"/g)].map((m) => Number(m[2]));
  assert.equal(Math.max(...heights), heights[3]);
  for (const h of heights) {
    assert.ok(h >= 88 && h <= 236, `height ${h} outside 88..236`);
  }
  // Every building stands on the horizon.
  for (const m of svg.matchAll(/<g class="b"[^>]*><rect x="\d+" y="(\d+)" width="\d+" height="(\d+)"/g)) {
    assert.equal(Number(m[1]) + Number(m[2]), LAYOUT.HORIZON);
  }
});

test("the scene is deterministic and every dither pattern it uses is defined", () => {
  const a = renderScene(sample);
  const b = renderScene(sample);
  assert.equal(a.scene, b.scene);
  assert.equal(a.defs, b.defs);

  const used = new Set([...a.scene.matchAll(/url\(#(d[sw]\d+)\)/g)].map((m) => m[1]));
  const defined = new Set([...a.defs.matchAll(/<pattern id="(d[sw]\d+)"/g)].map((m) => m[1]));
  for (const id of used) {
    assert.ok(defined.has(id), `pattern ${id} used but not defined`);
  }
  assert.match(a.scene, /<g id="skyline">/);
  assert.match(a.scene, /<use href="#skyline"/);
});

test("an empty calendar still renders a scene without buildings", () => {
  const { scene } = renderScene([]);
  assert.match(scene, /<g id="skyline"><\/g>/);
});

import assert from "node:assert/strict";
import test from "node:test";

import { DESKTOP, PHONE, POLE, SKY, UNLIT, renderScene, skyBandAt, skyline } from "./dusk-scene.mjs";

// weeks of { contributionDays: [{ date, contributionCount }] }, oldest first,
// Sunday first, starting on Sunday 2026-01-04.
function weeks(counts) {
  const start = Date.UTC(2026, 0, 4);
  return counts.map((days, w) => ({
    contributionDays: days.map((contributionCount, d) => ({
      date: new Date(start + (w * 7 + d) * 86400000).toISOString().slice(0, 10),
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
// A merge on the Tuesday of week 1 and two on week 3.
const merged = ["2026-01-13", "2026-01-25", "2026-01-26"];
const year = weeks(Array.from({ length: 53 }, (_, i) => [i % 5, 1, 2, i % 3, 0, 4, (i * 7) % 11]));

const count = (svg, pattern) => (svg.match(pattern) || []).length;
const layouts = [["desktop", DESKTOP], ["phone", PHONE]];

// Buildings carry their data height; the mass is every solid rect wider than a
// pole or a window that is not a pennant or a beacon.
function parseBuildings(svg, L) {
  return [...svg.matchAll(/<g class="b" data-h="(\d+)"([^>]*)>(.*?)<\/g>/g)].map(([, h, attrs, body]) => {
    const rects = [...body.matchAll(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)" fill="([^"]+)"([^>]*)\/>/g)]
      .map(([, x, y, width, height, fill, rest]) => ({ x: +x, y: +y, width: +width, height: +height, fill, rest }));
    const mass = rects.filter((r) => r.width > L.P && !r.fill.startsWith("url(") && !/class="(flag|beacon)"/.test(r.rest));
    return {
      height: Number(h),
      merged: /data-merged="1"/.test(attrs),
      flags: rects.filter((r) => /class="flag"/.test(r.rest)).length,
      rects,
      left: Math.min(...mass.map((r) => r.x)),
      right: Math.max(...mass.map((r) => r.x + r.width)),
      massTop: Math.min(...mass.map((r) => r.y)),
      massBottom: Math.max(...mass.map((r) => r.y + r.height)),
      top: Math.min(...rects.map((r) => r.y)),
      fill: mass[0]?.fill,
    };
  });
}

for (const [name, L] of layouts) {
  test(`${name}: one building per week and one window per day, lit on days with contributions`, () => {
    const { svg } = skyline(sample, [], L);
    assert.equal(count(svg, /<g class="b"/g), 4);
    const days = sample.flatMap((w) => w.contributionDays);
    assert.equal(count(svg, /class="w"/g), days.filter((d) => d.contributionCount > 0).length);
    assert.equal(count(svg, new RegExp(`fill="${UNLIT}"`, "g")), days.filter((d) => d.contributionCount === 0).length);
  });

  test(`${name}: the busiest week is the tallest building and heights stay in range`, () => {
    const { svg, tallest, totals } = skyline(sample, [], L);
    assert.equal(tallest, 3);
    assert.deepEqual(totals, [6, 35, 0, 61]);
    assert.equal(count(svg, /class="beacon"/g), 1);
    const buildings = parseBuildings(svg, L);
    assert.equal(Math.max(...buildings.map((b) => b.height)), buildings[3].height);
    for (const b of buildings) {
      assert.ok(b.height >= L.minH && b.height <= L.maxH, `height ${b.height} outside ${L.minH}..${L.maxH}`);
      // The drawn mass reaches exactly the data height and stands on the horizon.
      assert.equal(b.massTop, L.HORIZON - b.height);
      assert.equal(b.massBottom, L.HORIZON);
    }
  });

  test(`${name}: a pennant flies over each week with a merged upstream PR, and only there`, () => {
    const buildings = parseBuildings(skyline(sample, merged, L).svg, L);
    assert.deepEqual(buildings.map((b) => b.merged), [false, true, false, true]);
    assert.deepEqual(buildings.map((b) => b.flags), [0, 1, 0, 1]);
    const flags = [...skyline(sample, merged, L).svg.matchAll(/width="(\d+)" height="(\d+)" fill="#f5c45c" class="flag"/g)];
    for (const [, w, h] of flags) assert.deepEqual([+w, +h], [L.flag[0] * L.P, L.flag[1] * L.P]);
    // No merges, no pennants.
    assert.equal(count(skyline(sample, [], L).svg, /class="flag"/g), 0);
  });

  test(`${name}: buildings touch and neighbours differ in shade, so the row reads as a city`, () => {
    const buildings = parseBuildings(skyline(year, [], L).svg, L);
    assert.equal(buildings.length, 53);
    for (let i = 1; i < buildings.length; i++) {
      assert.ok(buildings[i].left <= buildings[i - 1].right, `sky shows between buildings ${i - 1} and ${i}`);
      assert.notEqual(buildings[i].fill, buildings[i - 1].fill, `buildings ${i - 1} and ${i} share a shade`);
    }
  });

  test(`${name}: the tallest building still has room for a pennant under the text`, () => {
    assert.ok(L.HORIZON - L.maxH - L.textClear >= 7 * L.P, "maxH leaves no room for roof furniture");
  });

  test(`${name}: nothing in the skyline rises into the text`, () => {
    // The busiest week first, under the name, with a merge that week: its roof,
    // pennant and beacon must all stay below the text.
    const busyFirst = weeks([[90, 90, 90, 90, 90, 90, 90], [1], [2, 2], [3], [0, 1]]);
    for (const b of parseBuildings(skyline(busyFirst, ["2026-01-05"], L).svg, L)) {
      assert.ok(b.top >= L.textClear, `building reaches y=${b.top}, above ${L.textClear}`);
    }
  });

  test(`${name}: every shape in the picture sits on the ${L.P}-unit pixel grid`, () => {
    const { scene, defs } = renderScene(year, merged, L);
    // The reflection is a squashed copy of the city (<use>), so only the drawn rects count.
    const rects = [...(scene + defs).matchAll(/<rect ([^>]*)\/>/g)].map((m) => m[1]);
    assert.ok(rects.length > 500, `expected the picture's rects, found ${rects.length}`);
    for (const attrs of rects) {
      for (const [, key, value] of attrs.matchAll(/\b(x|y|width|height)="([\d.-]+)"/g)) {
        assert.ok(Number(value) % L.P === 0, `${key}=${value} off the grid in <rect ${attrs}>`);
      }
    }
  });

  test(`${name}: no sky dither runs through or near the name, the tagline or the sub-line`, () => {
    const { scene } = renderScene(sample, [], L);
    const strips = [...scene.matchAll(/<rect x="0" y="([\d.]+)" width="\d+" height="(\d+)" fill="url\(#ds\d+\)"/g)]
      .map(([, y, h]) => [+y, +y + +h]);
    assert.ok(strips.length >= 8, `expected the sky's dither strips, found ${strips.length}`);
    // A strip within four art pixels of the letters (the name's shadow included)
    // reads as noise or an underline; those band edges are plain colour steps.
    const gap = 4 * L.P;
    for (const [top, bottom] of [L.nameRow, ...L.textRows]) {
      for (const [y0, y1] of strips) {
        assert.ok(y1 <= top - gap || y0 >= bottom + gap, `dither ${y0}-${y1} crowds text row ${top}-${bottom}`);
      }
    }
  });

  test(`${name}: stars sprinkle the open sky and stay out of the text`, () => {
    const { scene } = renderScene(sample, [], L);
    const stars = [...scene.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="(\d+)" height="\d+" fill="#f8eed7"/g)]
      .map(([, x, y, size]) => ({ x: +x, y: +y, size: +size }));
    const inside = (s, f) => s.x >= f.x0 && s.x + s.size <= f.x1 && s.y >= f.y0 && s.y + s.size <= f.y1;
    for (const field of L.starFields) {
      assert.equal(stars.filter((s) => inside(s, field)).length, field.count, `stars in ${JSON.stringify(field)}`);
    }
    assert.equal(stars.length, L.starFields.reduce((n, f) => n + f.count, 0), "a star fell outside the open sky");
    // A two-pixel star reads as a grey square, not a point of light.
    for (const s of stars) assert.equal(s.size, L.P, `star at ${s.x},${s.y} is ${s.size} units`);
  });

  test(`${name}: each cloud has a body darker than the sky band behind it`, () => {
    const { scene } = renderScene(sample, [], L);
    const clouds = [...scene.matchAll(/<g class="cloud">(.*?)<\/g>/g)].map((m) => m[1]);
    assert.equal(clouds.length, L.clouds.length);
    const luminance = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    clouds.forEach((body, i) => {
      const [, fill] = body.match(/fill="(#[0-9a-f]{6})"/);
      const behind = SKY[skyBandAt(L, L.clouds[i].y)];
      assert.ok(luminance(fill) < luminance(behind), `cloud ${i} body ${fill} does not show on ${behind}`);
    });
  });

  test(`${name}: the halo breathes on a wrapper, so it keeps its own faint opacity`, () => {
    // A CSS opacity animation overrides an element's opacity attribute; on the halo
    // discs themselves it turned a 12% glow into a 75-100% dome.
    const { scene } = renderScene(sample, [], L);
    assert.doesNotMatch(scene, /class="glow"[^>]*opacity=|opacity=[^>]*class="glow"/);
    assert.equal(count(scene, /<g class="glow"><g opacity="0\.(12|24)">/g), 2);
  });

  test(`${name}: the sun's glitter stays off the water's last two bands`, () => {
    const { scene } = renderScene(sample, [], L);
    const rows = [...scene.matchAll(/<rect x="[\d.-]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)" fill="#[0-9a-f]{6}" opacity="[\d.]+" class="sh"/g)]
      .map(([, y, h]) => +y + +h);
    assert.ok(rows.length > 5, `expected the glitter path, found ${rows.length}`);
    const end = L.HORIZON + L.P * L.waterPx.slice(0, -2).reduce((a, b) => a + b, 0);
    assert.ok(Math.max(...rows) <= end, `glitter reaches ${Math.max(...rows)}, below ${end}`);
  });

  test(`${name}: gold marks only the pennants, whose poles match the legend's tan`, () => {
    const { svg } = skyline(year, merged, L);
    const gold = "#f5c45c";
    for (const [, fill] of svg.matchAll(/fill="(#[0-9a-f]{6})" class="w"/g)) {
      assert.notEqual(fill, gold, "a lit window uses the pennant gold");
    }
    const flags = count(svg, /class="flag"/g);
    assert.ok(flags > 0, "expected pennants");
    assert.equal(count(svg, new RegExp(`fill="${POLE}" class="pole"`, "g")), flags);
  });

  test(`${name}: the scene is deterministic and every paint it uses is defined`, () => {
    const a = renderScene(year, merged, L);
    const b = renderScene(year, merged, L);
    assert.equal(a.scene, b.scene);
    assert.equal(a.defs, b.defs);
    const used = new Set([...a.scene.matchAll(/url\(#([\w-]+)\)/g)].map((m) => m[1]).filter((id) => id !== "water"));
    const defined = new Set([...a.defs.matchAll(/<(?:pattern|linearGradient) id="([\w-]+)"/g)].map((m) => m[1]));
    for (const id of used) assert.ok(defined.has(id), `paint ${id} used but not defined`);
    assert.match(a.scene, /<g id="skyline">/);
    assert.match(a.scene, /<use href="#skyline"/);
  });
}

test("an empty calendar still renders a scene without buildings", () => {
  for (const [, L] of layouts) {
    assert.match(renderScene([], [], L).scene, /<g id="skyline"><\/g>/);
  }
});

test("the two layouts draw the same city from the same data", () => {
  const desktop = parseBuildings(skyline(year, merged, DESKTOP).svg, DESKTOP);
  const phone = parseBuildings(skyline(year, merged, PHONE).svg, PHONE);
  assert.deepEqual(phone.map((b) => b.merged), desktop.map((b) => b.merged));
  const rank = (bs) => bs.map((b, i) => [b.height, i]).sort((x, y) => x[0] - y[0] || x[1] - y[1]).map(([, i]) => i);
  // Heights are snapped to each grid, so compare the order of the tallest few, not exact values.
  assert.deepEqual(rank(phone).slice(-3).sort(), rank(desktop).slice(-3).sort());
});

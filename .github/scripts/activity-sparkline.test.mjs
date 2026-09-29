import assert from "node:assert/strict";
import test from "node:test";

import { sparkline } from "./activity-sparkline.mjs";

const week = (...counts) => ({ contributionDays: counts.map((contributionCount) => ({ contributionCount })) });
const box = { x: 46, y: 100, width: 1108, height: 96 };

function bars(svg) {
  return [...svg.matchAll(/<rect class="([^"]+)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
    .map(([, cls, x, y, width, height]) => ({ cls, x: +x, y: +y, width: +width, height: +height }));
}

test("draws one bar per week, all inside the box and standing on its baseline", () => {
  const weeks = [week(1, 0, 3), week(0, 0, 0), week(9, 9, 9, 9), week(2)];
  const drawn = bars(sparkline(weeks, box).svg);
  assert.equal(drawn.length, weeks.length);
  for (const bar of drawn) {
    assert.ok(bar.x >= box.x && bar.x + bar.width <= box.x + box.width, `bar outside box: ${bar.x}`);
    assert.equal(bar.y + bar.height, box.y + box.height, "bar does not stand on the baseline");
  }
});

test("taller bars mean more contributions; the busiest week fills the box", () => {
  const weeks = [week(1), week(4), week(16), week(2)];
  const drawn = bars(sparkline(weeks, box).svg);
  const heights = drawn.map((bar) => bar.height);
  assert.deepEqual([...heights].sort((a, b) => a - b), [heights[0], heights[3], heights[1], heights[2]]);
  assert.equal(heights[2], box.height);
});

test("weeks without contributions keep a short dim stub so the baseline still reads", () => {
  const drawn = bars(sparkline([week(0, 0), week(5)], box).svg);
  assert.match(drawn[0].cls, /\bzero\b/);
  assert.ok(drawn[0].height > 0 && drawn[0].height < drawn[1].height);
});

test("marks the current week and is deterministic", () => {
  const weeks = [week(3), week(1), week(7)];
  const first = sparkline(weeks, box).svg;
  assert.equal(first, sparkline(weeks, box).svg);
  const drawn = bars(first);
  assert.match(drawn.at(-1).cls, /\bnow\b/);
  assert.doesNotMatch(drawn[0].cls, /\bnow\b/);
});

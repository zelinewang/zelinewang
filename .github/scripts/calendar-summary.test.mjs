import assert from "node:assert/strict";
import test from "node:test";

import { summarizeCalendar } from "./calendar-summary.mjs";

// Build consecutive calendar days ending on `lastDate`, oldest first, the order
// GitHub's contributionCalendar returns them in.
function days(lastDate, counts) {
  const end = new Date(`${lastDate}T00:00:00Z`);
  return counts.map((contributionCount, i) => {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - (counts.length - 1 - i));
    return { date: d.toISOString().slice(0, 10), contributionCount };
  });
}

test("counts active days and the longest run of active days", () => {
  const summary = summarizeCalendar(days("2026-09-29", [0, 3, 1, 0, 2, 2, 2, 0, 5]));
  assert.equal(summary.activeDays, 6);
  assert.equal(summary.longestStreak, 3);
});

test("a streak that runs through the last day counts in full", () => {
  const summary = summarizeCalendar(days("2026-09-29", [1, 0, 4, 4, 4, 4]));
  assert.equal(summary.longestStreak, 4);
});

test("only the last 365 days count, even when the calendar pads whole weeks", () => {
  // 370 entries: the 5 oldest are active and must be ignored.
  const counts = [1, 1, 1, 1, 1, ...Array(365).fill(0)];
  counts[counts.length - 1] = 2;
  const summary = summarizeCalendar(days("2026-09-29", counts));
  assert.equal(summary.activeDays, 1);
  assert.equal(summary.longestStreak, 1);
  assert.equal(summary.windowDays, 365);
});

test("an empty or all-zero calendar summarizes to zeros instead of throwing", () => {
  assert.deepEqual(summarizeCalendar([]), { activeDays: 0, longestStreak: 0, windowDays: 0 });
  const zero = summarizeCalendar(days("2026-09-29", [0, 0, 0]));
  assert.equal(zero.activeDays, 0);
  assert.equal(zero.longestStreak, 0);
});

test("input order does not matter", () => {
  const ordered = days("2026-09-29", [0, 1, 1, 0, 1]);
  const summary = summarizeCalendar([...ordered].reverse());
  assert.equal(summary.activeDays, 3);
  assert.equal(summary.longestStreak, 2);
});

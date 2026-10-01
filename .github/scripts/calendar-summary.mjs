// .github/scripts/calendar-summary.mjs
//
// Summarizes GitHub's contribution calendar, the data behind the green graph on
// the profile page, for the activity cards in the Console hero. Private
// contributions are included as counts when the profile shows them, which is
// why these numbers match the graph while the public events feed does not.

const WINDOW_DAYS = 365;

// days: [{ date: "YYYY-MM-DD", contributionCount: number }], one per calendar day.
// The calendar pads to whole weeks, so only the most recent 365 days count.
export function summarizeCalendar(days) {
  const window = [...days].sort((a, b) => a.date.localeCompare(b.date)).slice(-WINDOW_DAYS);

  let activeDays = 0;
  let longestStreak = 0;
  let run = 0;
  for (const day of window) {
    if (day.contributionCount > 0) {
      activeDays += 1;
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
  }

  return { activeDays, longestStreak, windowDays: window.length };
}

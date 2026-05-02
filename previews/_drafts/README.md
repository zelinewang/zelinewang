<!-- Draft README directions, not currently promoted on the profile. -->

# Drafts

Two earlier directions for this profile, parked here. Same content as the
active profile, different aesthetic. The cron in
[`.github/workflows/refresh-stats.yml`](../../.github/workflows/refresh-stats.yml)
keeps both fresh nightly, so they're ready to revive without a stale-data
problem.

- [**Constellation**](./constellation/) — dark-sky starmap, named stars for projects, SMIL twinkle.
- [**Field Notes**](./field-notes/) — naturalist's research journal, paper + ink stamp + marginalia.

The active design is the **Console** view, served from the
[root README](../../README.md).

If you want to switch which one is active, the simplest path is:

1. In [`render-profile.mjs`](../../.github/scripts/render-profile.mjs), swap which template name is "console" and which is the draft (the workflow renders all three and publishes them to the `stats-output` branch as `profile.svg` + `drafts/<name>.svg`).
2. Replace the root [`README.md`](../../README.md) content with the desired draft's preview README content.
3. Update the `<img src>` URL in the new root README to point at `https://raw.githubusercontent.com/zelinewang/zelinewang/stats-output/profile.svg`.

The templates and stats integration are direction-agnostic — only the
template-to-output mapping changes.

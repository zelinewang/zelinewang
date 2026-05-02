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

1. Move the active SVG output back to `previews/console/assets/01-profile.svg` and root README to point there
2. Move the desired draft's `*.svg.template` output to `assets/profile.svg`
3. Replace the root README content with that direction's preview README content
4. Update [`render-profile.mjs`](../../.github/scripts/render-profile.mjs) `directions` array to swap the `outPath` mappings

The templates and stats integration are direction-agnostic — only paths change.

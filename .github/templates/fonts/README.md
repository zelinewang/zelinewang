# Fonts embedded in the Sunset hero

The Sunset hero is served as an `<img>`, so it cannot load web fonts; `render-profile.mjs`
inlines these files as base64 `@font-face` rules instead. Each file is a subset (printable
ASCII plus `·→←↑↓↳§—–’“”…×├└─│█`) and a Modified Version under the SIL Open Font License 1.1:
the internal font names were changed, as the license requires for IBM Plex's Reserved Font
Name, and the copyright and license records were kept.

| File | Source | License |
|---|---|---|
| `zw-pixel.woff2` | Departure Mono 1.500 Regular, © Helena Zhang | [OFL-DepartureMono.txt](OFL-DepartureMono.txt) |
| `zw-body.woff2` | IBM Plex Mono Regular, © IBM Corp. | [OFL-IBMPlexMono.txt](OFL-IBMPlexMono.txt) |
| `zw-body-medium.woff2` | IBM Plex Mono Medium, © IBM Corp. | [OFL-IBMPlexMono.txt](OFL-IBMPlexMono.txt) |

To add characters, re-run fontTools' subsetter on the original font files with the new text,
save as woff2, and rename name IDs 1, 3, 4, 6, 16, 17, 21 and 22 away from the original family name.

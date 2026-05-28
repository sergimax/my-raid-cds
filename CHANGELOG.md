# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2026-05-28

### Added

- **Emblem icons** beside template raid names in the dungeon column (Triumph for legacy raids, Frost for Icecrown Citadel and Ruby Sanctum); stored on dungeon rows and restored from raid name when loading older saves.
- **Color-coded raid size chips** in the size column (distinct MUI chip color per group size).
- **Heroic mode styling** in the mode column (**N** / **H** chips with stronger Heroic styling).

### Changed

- **App header:** Toolbar actions are passed in as props for a cleaner header layout (`Stack`).
- **Raid tracker table:** Tighter pinned-column layout and dedicated cells for size and mode; character header moved into its own subcomponent.
- **Production build:** Split vendor bundles (React, MUI, MUI icons) with Rollup `manualChunks` for smaller app chunks and better caching.

### Fixed

- **Raid tracker table:** Pinned and character header cells no longer use cell-level overflow/ellipsis that clipped stacks (search field, action buttons); long character names truncate on the name label only.

### Removed

- **dungeon-mode-icons:** Unused SVG assets and module (mode column uses MUI chips instead).

## [1.3.0] - 2026-05-28

### Added

- **Raid tracker table (`RaidTrackerTable`):** MUI table with sticky header, horizontal scroll for character columns, and a pinned left block (delete, dungeon name, size, mode, item level, completion count).
- **Sorting:** Click column headers to sort by dungeon name, size, mode, item level (starting ilvl), or completion count; click a character header to sort rows by that character’s toggles (completed first / last).
- **Dungeon name search:** Filter field in the dungeon name header (substring match, case-insensitive).
- **GearScore-style colors:** Item level values and dungeon names use the same tier palette (grey → blue → violet → orange → red).
- **Completion counts in the table:** Per-character `done/total` under each header; per-dungeon `done/total` in the completion column (no separate summary panel).
- **Icon actions:** MUI icons with tooltips — delete dungeon (`Delete`), reset character toggles (`RestartAlt`), remove character (`Delete`); completions column header uses `SportsScore`.
- **Add from template** when the dungeon list is empty (toolbar).
- **Character name limit:** Max 12 characters in the add-character form (input cap + submit validation).
- **`@mui/icons-material`** for table and toolbar icon buttons.

### Changed

- **App wired to `useRaidTracker`:** Characters, dungeons, toggles, and forms use the shared hook; data persists to `localStorage` (debounced save).
- **Layout:** Main content is full width (not centered); footer stays centered.
- **Add forms:** Only one of character or dungeon form can be open at a time; successful submit closes the form.
- **Mode column:** Table header label is **Mode** (values remain Normal / Heroic); stored field is still `difficulty`.
- **Compact table:** Tighter cell padding, small switches, fixed character column width (fits 12-character names + class icon).
- **WoW class styling:** Character headers and class picker show icon + class-colored name (`characterNameDisplaySx`).

### Removed

- **Completion summary** block above the table (counts live in the table headers and completion column).

### Fixed

- **localStorage:** Load/save dungeons with `difficulty`; older saves that only had **`mode`** map to Normal or Heroic on import.
- **MUI buttons:** Global `button` styles in `index.css` no longer override Material UI button hover/background (fixes white-on-white hover on toolbar actions).

## [1.2.0] - 2026-05-12

### Changed

- Dungeon table: dedicated **Size** column (10 / 25 / …), sticky with the dungeon block when scrolling horizontally; raid-size sort and direction live in the size column header
- Dungeon table: dedicated **Mode** column showing **Normal** or **Heroic**, sticky with that block; mode sort and direction live in the mode column header (ascending: Normal then Heroic; descending: Heroic then Normal, with name and raid size as tie-breakers)
- Dungeon table: dedicated **Completions** column with the per-dungeon marked count (same count badge styling as before), sticky with that block; completions sort and direction live in that column header
- Dungeon table: dedicated **ilvl** column showing **starting** item level (`itemLevel` minimum per row), sticky with that block; tier coloring matches the raid’s item-level band; empty ilvl shows an em dash; item-level sort and direction live in that column header
- Dungeon table: sort by **item level** uses **starting** (lowest) ilvl per dungeon, not the previous max-ilvl comparison; name remains the tie-breaker
- Dungeon table: dungeon header uses a **Name** control (label + direction) instead of a sort `<select>`; name sort and direction apply only when that control is active (other sorts use their column headers)
- Dungeon table: dungeon name cell shows raid name and delete only; completion count is only in the completions column; row hover title still summarizes player size, mode, completions, and full item level list

## [1.1.4] - 2026-04-22

### Changed

- App layout: remove centered max-width wrapper; content is left-aligned and can grow horizontally
- Header: keep action buttons near the app title
- Forms: keep character/dungeon forms compact (max-width) instead of stretching full screen
- Styles: remove adaptive `@media` breakpoints (consistent compact UI at all widths); add missing zinc tokens (`--zinc-100`, `--zinc-300`) for badge/count text colors
- Dungeon table: heroic mode badge is more visually distinct; character columns use equal widths and long names are truncated; table no longer stretches full width

### Refactor

- Dungeon table: split `components/dungeon-table/index.tsx` into smaller components and utilities

## [1.1.3] - 2026-04-20

### Added

- Dungeon table: per-character badge showing how many dungeons are marked (count ignores deleted dungeons)

### Changed

- Dungeon table: character header layout/styles updated to fit the new count badge

## [1.1.2] - 2026-04-09

### Changed

- Main hook module path is kebab-case: `hooks/use-raid-tracker.ts` (exported `useRaidTracker` unchanged)
- Dungeon table: stable `useCallback` handlers for toggles and row actions; `data-*` attributes for IDs; item-level sort reuses a per-sort cache of max item level per dungeon
- Forms and table: event handler parameters use descriptive names (e.g. `event`) for readability

### Docs

- README project structure lists `use-raid-tracker.ts`
- Cursor project rules: naming section (kebab-case file paths, avoid oversimplified local names)

## [1.1.1] - 2026-04-06

### Changed

- Footer copy: single line `version <semver> by sergimax via cursor` (version from `package.json` via Vite); `sergimax` and `cursor` link to GitHub profile and Cursor site; GitHub mark icon removed

## [1.1.0] - 2026-04-05

### Added

- Dungeon name search in the table header (case-insensitive substring filter; empty search shows all rows)
- Monospace font stack for the whole app, including form controls

### Changed

- Dungeon table: per-row delete stays in the dungeon column; distinct cool-toned styling for that column vs character cells
- Table chrome simplified (bottom borders, lighter sticky separation); raid size badge without outline border
- Sorting defaults to item level descending; “Default” sort option removed
- Delete all dungeons control removed (remove dungeons with per-row delete only)
- Shared design tokens on `:root` (`--zinc-*`, borders, table surfaces); forms and dungeon table use them for colors
- `App.css`: one consolidated `1024px` media block; footer styles live with `AppFooter`
- `AppFooter` in `components/app-footer/` (`index.tsx`, `types.ts`, `styles.css`) and exported from the components barrel
- Dungeon table: single memo for filtered+sorted rows; tooltip/toggle helpers; ilvl tier from a threshold list instead of a long branch chain
- Dungeon form: `useMemo` for available presets and for the effective preset `<select>` value

### Fixed

- Toolbar button rules in `App.css` apply only to header actions so “Add character” / “Add dungeon” stay primary (indigo), not overridden by gray header styling

### Docs

- README usage steps and Cursor project rules updated for current flows (e.g. search, no delete-all)

## [1.0.3] - 2026-03-21

### Added

- Dungeon form preset selector: pick from WotLK template when adding manually (presets already in table are hidden)
- Raid names shown with Russian (in-game) and English (original) in parentheses
- `displayDungeonName` helper for locale-based dungeon name display

### Changed

- Dungeon form receives `existingDungeons` to filter preset options and avoid invalid select state

## [1.0.2] - 2026-03-13

### Changed

- Compact desktop layout at 1024px+ (smaller padding, buttons, table cells, toggles, icons)
- Consolidated and reorganized CSS across App, forms, and dungeon table

## [1.0.1] - 2026-03-11

### Added

- Zebra striping for odd table rows

## [1.0.0] - 2026-03-11

### Added

- Raid cooldown tracker: characters, dungeons, per-character–dungeon toggles
- Add characters with WoW class (Death Knight, Druid, Hunter, Mage, Paladin, Priest, Rogue, Shaman, Warlock, Warrior)
- Add dungeons manually (name, size 10/20/25/40, item level, mode Normal/Heroic)
- Add from template: load WoW WotLK raids (Russian names) when table is empty
- Toggle cooldown usage per character–dungeon pair
- Reset all cooldown toggles (Reset dungeons button)
- Reset toggles per character (🔄 button in character header)
- Delete all dungeons (Delete all button in table header)
- Delete individual characters or dungeons (🗑️ icon)
- Dungeon table sorting by name, size, or item level
- GearScore-style item level coloring
- localStorage persistence
- App version in footer (from package.json)

### Changed

- Dungeon list starts empty by default (no preloaded dungeons)

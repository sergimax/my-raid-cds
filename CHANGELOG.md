# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.12.1] - 2026-06-22

### Fixed

- **Import:** Character checkboxes stay in sync when characters are added or removed while the Import panel is open (new characters are selected by default).

### Changed

- **Internal:** Refactored tracker architecture — domain state in `useTrackerDomain` (context); forms and import panel in `TrackerLayout` (no form keystroke re-renders in toolbar/table); toggle logic in `utils/dungeon-toggles.ts`; character display in `utils/character-display.ts`; `ColorModeProvider` in `contexts/`; type renames (`PersistedTrackerState`, `RaidTrackerStore`). No user-visible behavior change.

## [1.12.0] - 2026-06-21

### Added

- **Import:** Toolbar **Import** action builds copy-ready text from dungeons currently shown in the table (respects name search). One line per matching raid lists characters still without CD (toggle off), e.g. `ICC25H - Char1, Char2` or `ЦЛК25хм - Char1, Char2`. Character checkboxes limit who is included; heroic suffix is `H` for Latin short names and `хм` for Cyrillic.

## [1.11.0] - 2026-06-20

### Added

- **Dungeon short names:** Each dungeon can have an optional short name (abbreviation). WotLK template raids include preset Russian and English abbreviations (e.g. Накс / Naxx, ЦЛК / ICC).
- **Add dungeon:** Optional **Short name** field; when left blank, a default abbreviation is applied for known raid names.
- **Compact table:** Shows the short name on narrow screens with a tooltip for the full dungeon name.
- **Dungeon search:** Matches both full name and short name.

### Changed

- **Local storage:** Saves optional `shortName` on dungeon records; existing saves backfill defaults when the name matches a known template raid.

## [1.10.2] - 2026-06-17

### Fixed

- **Add dungeon:** Removed duplicate-name validation so the same raid can be added multiple times with different difficulty or size.

## [1.10.1] - 2026-06-04

### Changed

- **Header:** GitHub icon links to the project repository ([sergimax/my-raid-cds](https://github.com/sergimax/my-raid-cds)) instead of the author profile.

## [1.10.0] - 2026-06-03

### Added

- **Raid tracker table:** Empty-body hints when there are no dungeons (“Add a dungeon or use Add from template…”) or when name search filters out all rows (“No dungeons match your search”).
- **Accessibility:** Add-character and add-dungeon validation errors use `role="alert"`; empty table rows and context-specific `aria-label` on the tracker grid; empty-state messages use live regions.

### Changed

- **Add forms:** Cancel and submit actions use shared `FormActionsRow`; new-dungeon defaults (size 10, item level `200`) live in `dungeon-form-defaults.ts`.
- **Raid tracker state:** Internal refactor only — add-character and add-dungeon forms behave the same. Form state lives in dedicated hooks; validation moved to `validate-character` / `validate-dungeon` utilities; `useRaidTracker` composes persistence, toggles, and forms.
- **App layout:** `RaidTrackerProvider` and `useRaidTrackerContext()` supply tracker state to the toolbar, main content, and table; `App` only mounts the provider and shell (no change to tracker UI or behavior).
- **Tracker toolbar:** Desktop buttons and narrow-screen menu share one action config (`buildTrackerActions`); labels and behavior stay the same.
- **Character column headers:** Per-character completion counts are precomputed in `useRaidTrackerTableState` (`completionsByCharacterId`); header chips show the same values without recounting on each render.
- **Delete confirmation:** Character and dungeon remove/delete dialog copy is centralized in `getRaidTrackerDeleteDialogProps` / `RaidTrackerDeleteDialog` (same titles, messages, and buttons as before).
- **Responsive layout:** Toolbar menu and compact table columns both use `useCompactLayout()` (below `md`); same breakpoint as before, defined in one place.
- **Local storage:** Load and save logic split into `storage/parse.ts` and `storage/persist.ts` (public API in `storage/index.ts`); new saves include `schemaVersion` (1). Emblems still load only from each dungeon’s saved `emblem` field (no raid-name backfill).
- **Item level tier colors:** Light/dark palettes live in `item-level-tier.ts` and apply via MUI `sx` (same GearScore-style colors as before; less duplicated CSS in the raid tracker table stylesheet).
- **WotLK template data:** `RaidNames` and `DungeonList` split into `raid-names.ts` and `dungeon-list.ts`; rows built with `createTemplateDungeon` (same template raids and emblems as before; `data/dungeons.ts` re-exports).

### Fixed

- **Add dungeon:** Duplicate names (case-insensitive) are rejected with an error, consistent with duplicate character name + class checks.
- **Add from template:** Loading the WotLK raid template is a one-shot fill when the dungeon list is empty; calling it again after dungeons exist no longer appends duplicate rows (toolbar still hides the action when the list is not empty).
- **Corrupted save:** Invalid or unreadable local data shows an error and resets the tracker instead of failing silently with an empty table.

### Removed

- Legacy **CompletionSummary** component (was not shown in the app; per-row and per-character completion counts remain in the raid tracker table).
- Unused `ruRaidNameToEn` / `formatRaidNameRuWithEn` helpers from raid template data (English names remain on `RaidNames` metadata only).

## [1.9.1] - 2026-06-02

### Changed

- **Raid tracker table:** Internal refactor only — table UI and behavior are unchanged. Logic moved into `useRaidTrackerTableState` (sort, search, layout, derived rows); pinned columns use a single render registry; body rows use `DungeonTableRow`; the header row uses `RaidTrackerTableHead`.
- **Delete confirmation:** Character and dungeon delete flows use shared `usePendingDelete`; dialog text and confirm/cancel behavior are the same as in 1.9.0.

## [1.9.0] - 2026-06-01

### Added

- **Delete confirmation:** Removing a character or deleting a dungeon opens an MUI dialog with the entity name, a warning that toggles are removed and the action cannot be undone, and **Cancel** / **Remove** (character) or **Delete** (dungeon) actions.

## [1.8.0] - 2026-05-30

### Changed

- **Responsive header:** Below `md`, tracker actions use a menu icon instead of a wrapped button stack; toolbar stays a single row on narrow screens.
- **Version label:** Moved to the header right (next to the GitHub link).
- **Add character / Add dungeon forms:** Cancel and submit sit in one action row on all viewports (right-aligned).
- **Raid tracker table (compact):** Below `md`, pinned size, difficulty, item level, and completion columns are hidden; dungeon name column and search/header controls use tighter spacing.

### Fixed

- **Add forms:** Cancel, toolbar dismiss, and opening the other form reset entered fields; Cancel uses dedicated close handlers instead of toggle.

## [1.7.0] - 2026-05-29

### Changed

- **Item level tier colors:** Progression grey → green → cyan → blue → violet → orange → red for item level values and matching dungeon names; separate light and dark palettes via CSS variables.
- **Template raid emblems:** Frost emblem on Icecrown Citadel and Ruby Sanctum template rows only (3.3.5a); Triumph removed from the default template list.
- **Emblem persistence:** Emblems load only from the `emblem` field on each dungeon row (no raid-name backfill on load).
- **Dark mode:** Primary palette (`#60a5fa`) and `Switch` styling for cooldown toggles (zinc off state, primary track when on).

## [1.6.0] - 2026-05-29

### Added

- **Completion count chips** in the dungeon completions column and character headers (`done/total` with ratio-based color gradation).

### Changed

- **Completion display:** Plain text replaced with filled MUI `Chip`; colors progress gray → red → yellow → blue → green with WCAG AA contrast for small labels.

## [1.5.0] - 2026-05-29

### Added

- **Light/dark theme:** Toolbar toggle; preference saved to `localStorage` (`my-raid-cds-color-mode`); falls back to system `prefers-color-scheme` when unset.
- **Pre-paint theme sync** in `index.html` (same storage key) to avoid a light flash on load; updates `theme-color` meta and `data-color-mode` on `<html>`.
- **Sticky MUI AppBar** header: app name, version label (`v.x.y.z`), tracker actions, theme toggle, and GitHub link (tooltip: author attribution).

### Changed

- **App header:** Rebuilt with MUI `AppBar` / `Toolbar` (responsive nav-style layout); tracker controls use compact toolbar buttons.
- **Author/version UI:** Moved from footer into the header (`AppVersionLabel`, `AppMetaInfo` with GitHub icon).
- **Theming:** MUI theme via `AppThemeProvider` and `createAppTheme`; global CSS variables in `index.css` switch with `data-color-mode`.
- **Emblem assets:** PNG emblems replaced with WebP.
- **Dev experience:** Split color mode provider/hook into separate modules to satisfy Fast Refresh rules.
- **Scrolling:** Add `scroll-padding-top` to account for the sticky header; share header min-height via `--app-toolbar-min-height`.

### Removed

- **`AppFooter`** and footer styles (metadata now in the header).

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

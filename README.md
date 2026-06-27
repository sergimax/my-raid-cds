# My Raid CDs

A web app to track raid cooldowns per character and dungeon.
Add characters, add dungeons, and toggle cooldown usage for each character–dungeon pair.
Data persists in `localStorage`.

## Purpose

Track which raid cooldowns (e.g. lockouts) are used per character across different dungeons.
The dungeon list starts empty; you can add dungeons manually or load a template with WoW WotLK raids (Russian names).
Supports custom characters and dungeons.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI) |
| `npm run build:wow-data` | Regenerate bundled item names, gear slots, and raid loot from `scripts/wowsims-db.json` (use `--skip-ru` to skip WoWRoad Russian name fetch) |

## Usage

1. **Add a character** — Click **Add character**, enter name (max 12 characters), class, and optional main/off spec with gear score (from GearScore addon), then **Add character** or **Cancel**. Only one add form is open at a time; closing or switching forms clears entered values.
2. **Add a dungeon** — Click **Add dungeon**, enter name, optional short name (max 12 characters; shown in compact table view), size (5/10/20/25/40), item level(s) (e.g. `200` or `200 / 213`), and difficulty (Normal/Heroic), then **Add dungeon** or **Cancel**. When short name is left blank, a default abbreviation is applied for known WotLK raid names. Same single-form and reset rules as the character form.
3. **Add from template** — When the dungeon list is empty, click **Add from template** to load WoW WotLK raids (one-shot; the action is hidden once any dungeon exists).
4. **Toggle cooldowns** — Use the switch in each character column for a dungeon row.
5. **Sort** — Click a column header (name, size, mode, item level, completions) or a character header to sort rows. On narrow screens (below `md`), the table shows only the actions column, dungeon name, and character toggles; size, mode, item level, and completion columns are hidden. In that compact layout, the name column shows the short name when set (tooltip with full name).
6. **Search** — Use the search field under **Dungeon name** to filter rows by substring (matches full name or short name). If nothing matches, the table shows a “No dungeons match your search” hint.
7. **Export** — Filter dungeons with search (e.g. `ICC` or `ЦЛК`), then click **Export** in the toolbar. The panel lists one line per visible raid with characters still without CD (toggle off), ready to copy — e.g. `ICC25H - Elst: Udk 6.6, Blood 6 / Beta: SP 5.8` (class-scoped short spec labels + gear score when set), or `ЦЛК25хм - …` for Russian short raid names. Heroic lines use suffix `H` (Latin) or `хм` (Cyrillic). Per character, choose which specs to include via icon checkboxes (main/off when set); characters without specs have a single include checkbox. New characters are selected by default while the panel is open. Raids where everyone has CD are omitted. Export gear scores are numeric only (no `k` suffix, rounded down); the table still shows compact scores with `k` in headers/tooltips.
8. **BiS lists** — **BiS lists** in the toolbar opens a panel to pick class and spec, browse built-in presets (read-only), and create or edit local presets with item IDs per gear slot. Item names in slot rows use the same colored link styling as stored gear. Confirm each slot with the check icon; **Save list** stores a local preset under a custom name (built-in lists can be copied this way). Delete local presets from the preset chips. The selected preset for a character’s class/spec drives upgrade-hint filtering in the table.
9. **Edit character** — **Edit** icon in a character column header opens a dialog to update main/off spec and gear score (name and class stay fixed). Paste WowSimsExporter JSON to import equipped gear; imported items show as colored, underlined item links (ilvl-tier color) beside muted slot and ilvl labels, with external tooltips on hover. Spec from the export can fill main spec when empty.
10. **Gear upgrade hints** — When a character has imported gear, toggle cells for a dungeon may show a subtle background tint if upgrades exist in that raid’s item-level tier. Hover the toggle for slot details. Hints use bundled raid loot when the dungeon has a template `raidKey`; with a BiS list selected for that character’s spec, only BiS-relevant drops count.
11. **UI locale** — **EN** / **RU** in the header switches the full interface (buttons, labels, messages, validation errors) and item tooltips (Cavern of Time / WoWRoad). Template raid names, class/spec labels, gear slots, and export lines follow the selected language; custom dungeon and character names you enter stay as typed.
12. **Edit dungeon** — **Edit** icon on each dungeon row opens a dialog to update name, short name, size, mode (Normal/Heroic), and emblem badge (item levels and toggles stay fixed).
13. **Emblem icons** — Template rows with an `emblem` in `DungeonList` show that icon beside the name (Frost on Icecrown Citadel and Ruby Sanctum in 3.3.5a). Custom dungeons can set or clear a badge via **Edit dungeon**.
14. **Reset per character** — Icon in the character header (tooltip: reset toggles) clears that character’s toggles.
15. **Reset all toggles** — **Reset all toggles** in the toolbar clears every toggle (dungeon list unchanged).
16. **Delete** — Delete icon on each dungeon row or remove icon in a character header opens a confirmation dialog (entity name, irreversible warning); confirm with **Delete** / **Remove** or dismiss with **Cancel**.
17. **Theme** — Sun/moon icon in the header toggles light/dark mode (saved in `localStorage`; uses system preference when unset).

The sticky header shows the app name, tracker actions (on narrow screens below `md`, a menu icon opens **Add from template**, **Add character**, **Add dungeon**, **BiS lists**, **Export**, and **Reset all toggles**), **EN** / **RU** locale toggle, theme toggle, a GitHub icon (tooltip: author attribution), and the version label (`v.x.y.z` from `package.json` at build time) on the right.

Data is saved automatically (debounced) to `localStorage` under the key `my-raid-cds`. If saved data is corrupted or unreadable, an error alert appears and the tracker resets to empty.

When there are no dungeons, the table body shows a hint to add a dungeon or use **Add from template**.

## Data Model

### Character

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | UUID |
| `name` | `string` | Character name (max 12 characters in the form) |
| `class` | `CharacterClass` | WoW class (name, color, icon) |
| `mainSpec` | optional `{ spec, gearScore? }` | Main talent spec and optional gear score |
| `offSpec` | optional `{ spec, gearScore? }` | Off spec and optional gear score (must differ from main when both set) |
| `gearItems` | optional `{ slot, id, enchant?, gems? }[]` | Equipped items from WowSimsExporter import (WowSims slot index 0–16) |

### Dungeon

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | UUID |
| `name` | `string` | Dungeon name |
| `shortName` | optional string | Abbreviation for compact table display; template rows and known raid names get defaults from `RaidNames` (`shortRu` / `shortEn`); user override via add form, edit dialog, or saved field |
| `size` | `5 \| 10 \| 20 \| 25 \| 40` | Raid size |
| `itemLevel` | `number[]` | Item level(s), e.g. `[200, 213]` |
| `difficulty` | `"Normal" \| "Heroic"` | Raid mode; **Mode** column shows **N** or **H** chips |
| `emblem` | optional string | WotLK emblem key for display (`triumph`, `frost`, …); set on template rows; custom dungeons can set or clear via **Edit dungeon**; loaded only from this field (no raid-name backfill) |
| `raidKey` | optional `RaidKey` | Template raid key for bundled loot lookup (set on template rows; used by gear upgrade hints) |

Older saves may use a legacy `mode` field; it is mapped to `difficulty` on load. Tracker saves include `schemaVersion` (currently `4`). Missing `shortName` on load is backfilled when the dungeon name matches a known template raid (Russian or English). Legacy character saves (`schemaVersion` 2) with flat `mainSpec`/`offSpec` strings or a single `gearScore` migrate to nested spec objects on load. Corrupted local data is reset and an error is shown on load.

BiS list selections and local presets are stored separately under `my-raid-cds-bis-lists` (`schemaVersion` 1). UI and item-tooltip locale (`en` or `ru`) is stored under `my-raid-cds-item-tooltip-locale`.

### Dungeon Toggles

`Record<characterId, Record<dungeonId, boolean>>` — Maps each character–dungeon pair to a boolean (used/available).

## Tech Stack

- React 19 + TypeScript + Vite
- [Material UI](https://mui.com/) (`@mui/material`, `@mui/icons-material`) with Emotion
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit and component tests

## Project Structure

```
src/
├── components/       # app-header, tracker-layout, raid-tracker-main, character-form, character-edit-dialog, character-spec-gear-fields, spec-option-label, dungeon-form, dungeon-edit-dialog, dungeon-customization-fields, export-panel, bis-lists-panel, wow-item-link (+ item-link-styles.ts), stored-gear-item-line, item-tooltip-locale-toggle, tracker-controls, …
│   raid-tracker-table/   # grid, character-toggle-cell, use-raid-tracker-table-state, head/row, character-header-cell, pinned-column-renderers, …
├── i18n/             # messages/en.ts, messages/ru.ts, translate.ts, localized-domain.ts, use-translation.ts
├── constants/        # character.ts, dungeon-form-defaults.ts, item-tooltips.ts
├── contexts/         # raid-tracker-provider, raid-tracker-context, color-mode-provider, bis-lists-provider, item-tooltip-locale-provider
├── hooks/            # use-tracker-domain.ts, use-tracker-forms.ts, use-bis-lists-domain.ts, use-character-form-state.ts, use-export-panel-state.ts, use-compact-layout.ts, color-mode.ts, item-tooltip-locale.ts, …
├── theme/            # create-app-theme.ts (MUI palette per mode)
├── types/            # characters, dungeons, character-gear, bis-lists
├── data/             # raid-names.ts, class-specs.ts, dungeon-list.ts, create-template-dungeon.ts, dungeons.ts, bis-presets/, gear-slot-names.ts, raid-loot.ts, wotlk-item-levels.ts, wotlk-item-names.ts, wotlk-item-gear-slots.ts (+ bundled JSON)
├── utils/            # validate-character/dungeon, dungeon-toggles, character-display, format-character-details, format-character-export, build-export-status, format-dungeon-label, dungeon-short-name, bis-lists.ts, gear-upgrade-hint.ts, parse-wowsims-exporter.ts, format-stored-gear.ts, hide-external-wow-tooltips.ts, sort/filter, …
├── assets/           # class-icons/ (+ specs/), emblems/
├── storage/          # index.ts (public API), parse, persist, types, constants; bis-lists/ (separate localStorage key)
├── test/             # setup.ts, fixtures.ts, render-with-theme.tsx, test-providers.tsx, i18n.ts (Vitest + Testing Library)
├── uuid.ts           # generateUUID
└── vite-env.d.ts     # __APP_VERSION__ declaration

scripts/              # build-wow-data.mjs, wow-item-gear-slots.mjs, wowsims-db.json (WowSims item DB for data build)
```

Tests live next to source as `*.test.ts` / `*.test.tsx` (e.g. `utils/dungeon-toggles.test.ts`, `storage/parse.test.ts`).

`App` mounts `RaidTrackerProvider`, `BisListsProvider`, and `ItemTooltipLocaleProvider`, then `TrackerLayout` (toolbar, forms, BiS panel, export panel orchestration). `RaidTrackerMain` renders add forms; `RaidTrackerTable` reads domain context only. Table UI state (sort, search, delete confirmation, compact layout) lives in `useRaidTrackerTableState` under `raid-tracker-table/`.

Production builds split vendor code into separate chunks (React, MUI, icons) via `vite.config.ts` `manualChunks`.

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

## Usage

1. **Add a character** — Click **Add character**, enter name (max 12 characters), class, and optional main/off spec with gear score (from GearScore addon), then **Add character** or **Cancel**. Only one add form is open at a time; closing or switching forms clears entered values.
2. **Add a dungeon** — Click **Add dungeon**, enter name, optional short name (max 12 characters; shown in compact table view), size (5/10/20/25/40), item level(s) (e.g. `200` or `200 / 213`), and difficulty (Normal/Heroic), then **Add dungeon** or **Cancel**. When short name is left blank, a default abbreviation is applied for known WotLK raid names. Same single-form and reset rules as the character form.
3. **Add from template** — When the dungeon list is empty, click **Add from template** to load WoW WotLK raids (one-shot; the action is hidden once any dungeon exists).
4. **Toggle cooldowns** — Use the switch in each character column for a dungeon row.
5. **Sort** — Click a column header (name, size, mode, item level, completions) or a character header to sort rows. On narrow screens (below `md`), the table shows only the actions column, dungeon name, and character toggles; size, mode, item level, and completion columns are hidden. In that compact layout, the name column shows the short name when set (tooltip with full name).
6. **Search** — Use the search field under **Dungeon name** to filter rows by substring (matches full name or short name). If nothing matches, the table shows a “No dungeons match your search” hint.
7. **Export** — Filter dungeons with search (e.g. `ICC` or `ЦЛК`), then click **Export** in the toolbar. The panel lists one line per visible raid with characters still without CD (toggle off), ready to copy — e.g. `ICC25H - Elst: Udk 6.6, Blood 6 / Beta: SP 5.8` (class-scoped short spec labels + gear score when set), or `ЦЛК25хм - …` for Russian short raid names. Heroic lines use suffix `H` (Latin) or `хм` (Cyrillic). Per character, choose which specs to include via icon checkboxes (main/off when set); characters without specs have a single include checkbox. New characters are selected by default while the panel is open. Raids where everyone has CD are omitted. Export gear scores are numeric only (no `k` suffix, rounded down); the table still shows compact scores with `k` in headers/tooltips.
8. **Edit character** — **Edit** icon in a character column header opens a dialog to update main/off spec and gear score (name and class stay fixed).
9. **Emblem icons** — Template rows with an `emblem` in `DungeonList` show that icon beside the name (Frost on Icecrown Citadel and Ruby Sanctum in 3.3.5a). Other template raids have no emblem unless you add one in data.
10. **Reset per character** — Icon in the character header (tooltip: reset toggles) clears that character’s toggles.
11. **Reset all toggles** — **Reset all toggles** in the toolbar clears every toggle (dungeon list unchanged).
12. **Delete** — Delete icon on each dungeon row or remove icon in a character header opens a confirmation dialog (entity name, irreversible warning); confirm with **Delete** / **Remove** or dismiss with **Cancel**.
13. **Theme** — Sun/moon icon in the header toggles light/dark mode (saved in `localStorage`; uses system preference when unset).

The sticky header shows the app name, tracker actions (on narrow screens below `md`, a menu icon opens **Add from template**, **Add character**, **Add dungeon**, **Export**, and **Reset all toggles**), theme toggle, a GitHub icon (tooltip: author attribution), and the version label (`v.x.y.z` from `package.json` at build time) on the right.

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

### Dungeon

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | UUID |
| `name` | `string` | Dungeon name |
| `shortName` | optional string | Abbreviation for compact table display; template rows and known raid names get defaults from `RaidNames` (`shortRu` / `shortEn`); user override via add form or saved field |
| `size` | `5 \| 10 \| 20 \| 25 \| 40` | Raid size |
| `itemLevel` | `number[]` | Item level(s), e.g. `[200, 213]` |
| `difficulty` | `"Normal" \| "Heroic"` | Raid mode; **Mode** column shows **N** or **H** chips |
| `emblem` | optional string | WotLK emblem key for display (`triumph`, `frost`, …); set on template rows, optional for custom dungeons; loaded only from this field (no raid-name backfill) |

Older saves may use a legacy `mode` field; it is mapped to `difficulty` on load. Saves include `schemaVersion` (currently `3`). Missing `shortName` on load is backfilled when the dungeon name matches a known template raid (Russian or English). Legacy character saves (`schemaVersion` 2) with flat `mainSpec`/`offSpec` strings or a single `gearScore` migrate to nested spec objects on load. Corrupted local data is reset and an error is shown on load.

### Dungeon Toggles

`Record<characterId, Record<dungeonId, boolean>>` — Maps each character–dungeon pair to a boolean (used/available).

## Tech Stack

- React 19 + TypeScript + Vite
- [Material UI](https://mui.com/) (`@mui/material`, `@mui/icons-material`) with Emotion
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit and component tests

## Project Structure

```
src/
├── components/       # app-header, tracker-layout, raid-tracker-main, character-form, character-edit-dialog, character-spec-gear-fields, spec-option-label, dungeon-form, export-panel, tracker-controls, …
│   raid-tracker-table/   # grid, use-raid-tracker-table-state, head/row, character-header-cell, pinned-column-renderers, …
├── constants/        # character.ts, dungeon-form-defaults.ts
├── contexts/         # raid-tracker-provider, raid-tracker-context, color-mode-provider
├── hooks/            # use-tracker-domain.ts, use-tracker-forms.ts, use-character-form-state.ts, use-export-panel-state.ts, use-compact-layout.ts, color-mode.ts, …
├── theme/            # create-app-theme.ts (MUI palette per mode)
├── types/            # characters, dungeons
├── data/             # raid-names.ts, class-specs.ts, dungeon-list.ts, create-template-dungeon.ts, dungeons.ts
├── utils/            # validate-character/dungeon, dungeon-toggles, character-display, format-character-details, format-character-export, build-export-status, format-dungeon-label, dungeon-short-name, sort/filter, …
├── assets/           # class-icons/ (+ specs/), emblems/
├── storage/          # index.ts (public API), parse, persist, types, constants
├── test/             # setup.ts, fixtures.ts, render-with-theme.tsx (Vitest + Testing Library)
├── uuid.ts           # generateUUID
└── vite-env.d.ts     # __APP_VERSION__ declaration
```

Tests live next to source as `*.test.ts` / `*.test.tsx` (e.g. `utils/dungeon-toggles.test.ts`, `storage/parse.test.ts`).

`App` mounts `RaidTrackerProvider` (domain state via `useTrackerDomain` + `useRaidTrackerContext()`) and `TrackerLayout` (toolbar, forms, export panel orchestration). `RaidTrackerMain` renders add forms; `RaidTrackerTable` reads domain context only. Table UI state (sort, search, delete confirmation, compact layout) lives in `useRaidTrackerTableState` under `raid-tracker-table/`.

Production builds split vendor code into separate chunks (React, MUI, icons) via `vite.config.ts` `manualChunks`.

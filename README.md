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

## Usage

1. **Add a character** — Click **Add character**, enter name (max 12 characters) and class, then **Add character** or **Cancel**. Only one add form is open at a time; closing or switching forms clears entered values.
2. **Add a dungeon** — Click **Add dungeon**, enter name, optional short name (max 12 characters; shown in compact table view), size (5/10/20/25/40), item level(s) (e.g. `200` or `200 / 213`), and difficulty (Normal/Heroic), then **Add dungeon** or **Cancel**. When short name is left blank, a default abbreviation is applied for known WotLK raid names. Same single-form and reset rules as the character form.
3. **Add from template** — When the dungeon list is empty, click **Add from template** to load WoW WotLK raids (one-shot; the action is hidden once any dungeon exists).
4. **Toggle cooldowns** — Use the switch in each character column for a dungeon row.
5. **Sort** — Click a column header (name, size, mode, item level, completions) or a character header to sort rows. On narrow screens (below `md`), the table shows only the actions column, dungeon name, and character toggles; size, mode, item level, and completion columns are hidden. In that compact layout, the name column shows the short name when set (tooltip with full name).
6. **Search** — Use the search field under **Dungeon name** to filter rows by substring (matches full name or short name). If nothing matches, the table shows a “No dungeons match your search” hint.
7. **Import** — Filter dungeons with search (e.g. `ICC` or `ЦЛК`), then click **Import** in the toolbar. The panel lists one line per visible raid with characters still without CD (toggle off), ready to copy — e.g. `ICC25H - Char1, Char2` and `ICC25 - Char1, Char3`, or `ЦЛК25хм - …` / `ЦЛК25 - …` for Russian short names. Heroic lines use suffix `H` (Latin) or `хм` (Cyrillic). Character checkboxes limit who is included; raids where everyone has CD are omitted.
8. **Emblem icons** — Template rows with an `emblem` in `DungeonList` show that icon beside the name (Frost on Icecrown Citadel and Ruby Sanctum in 3.3.5a). Other template raids have no emblem unless you add one in data.
9. **Reset per character** — Icon in the character header (tooltip: reset toggles) clears that character’s toggles.
10. **Reset all toggles** — **Reset all toggles** in the toolbar clears every toggle (dungeon list unchanged).
11. **Delete** — Delete icon on each dungeon row or remove icon in a character header opens a confirmation dialog (entity name, irreversible warning); confirm with **Delete** / **Remove** or dismiss with **Cancel**.
12. **Theme** — Sun/moon icon in the header toggles light/dark mode (saved in `localStorage`; uses system preference when unset).

The sticky header shows the app name, tracker actions (on narrow screens below `md`, a menu icon opens **Add from template**, **Add character**, **Add dungeon**, **Import**, and **Reset all toggles**), theme toggle, a GitHub icon (tooltip: author attribution), and the version label (`v.x.y.z` from `package.json` at build time) on the right.

Data is saved automatically (debounced) to `localStorage` under the key `my-raid-cds`. If saved data is corrupted or unreadable, an error alert appears and the tracker resets to empty.

When there are no dungeons, the table body shows a hint to add a dungeon or use **Add from template**.

## Data Model

### Character

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | UUID |
| `name` | `string` | Character name (max 12 characters in the form) |
| `class` | `CharacterClass` | WoW class (name, color, icon) |

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

Older saves may use a legacy `mode` field; it is mapped to `difficulty` on load. Saves include `schemaVersion` (currently `1`). Missing `shortName` on load is backfilled when the dungeon name matches a known template raid (Russian or English). Corrupted local data is reset and an error is shown on load.

### Dungeon Toggles

`Record<characterId, Record<dungeonId, boolean>>` — Maps each character–dungeon pair to a boolean (used/available).

## Tech Stack

- React 19 + TypeScript + Vite
- [Material UI](https://mui.com/) (`@mui/material`, `@mui/icons-material`) with Emotion

## Project Structure

```
src/
├── components/       # app-header, raid-tracker-main, character-form, dungeon-form, import-panel, tracker-controls, …
│   raid-tracker-table/   # grid, use-raid-tracker-table-state, head/row, pinned-column-renderers, …
├── constants/        # character.ts, dungeon-form-defaults.ts
├── contexts/         # raid-tracker-provider, raid-tracker-context
├── hooks/            # use-raid-tracker.ts, use-tracker-forms.ts, use-import-panel-state.ts, use-compact-layout.ts, …
├── theme/            # create-app-theme.ts (MUI palette per mode)
├── types/            # characters, dungeons
├── data/             # raid-names.ts, dungeon-list.ts, create-template-dungeon.ts, dungeons.ts
├── utils/            # validate-character/dungeon, build-import-status, format-dungeon-label, dungeon-short-name, sort/filter, …
├── assets/           # class-icons/, emblems/
├── storage/          # index.ts (public API), parse, persist, types, constants
├── uuid.ts           # generateUUID
└── vite-env.d.ts     # __APP_VERSION__ declaration
```

`RaidTrackerProvider` wraps the app; domain state (`characters`, `dungeons`, toggles, forms) comes from `useRaidTracker` via `useRaidTrackerContext()`. Table-only UI state (sort, search, delete confirmation, compact layout) lives in `useRaidTrackerTableState` under `raid-tracker-table/`.

Production builds split vendor code into separate chunks (React, MUI, icons) via `vite.config.ts` `manualChunks`.

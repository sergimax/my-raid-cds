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

1. **Add a character** — Click **Add character**, enter name (max 12 characters) and class, submit. Only one add form is open at a time.
2. **Add a dungeon** — Click **Add dungeon**, enter name, size (5/10/20/25/40), item level(s) (e.g. `200` or `200 / 213`), and difficulty (Normal/Heroic), submit.
3. **Add from template** — When the dungeon list is empty, click **Add from template** to load WoW WotLK raids.
4. **Toggle cooldowns** — Use the switch in each character column for a dungeon row.
5. **Sort** — Click a column header (name, size, mode, item level, completions) or a character header to sort rows.
6. **Search** — Use the search field under **Dungeon name** to filter rows by substring.
7. **Emblem icons** — Template rows with an `emblem` in `DungeonList` show that icon beside the name (Frost on Icecrown Citadel and Ruby Sanctum in 3.3.5a). Other template raids have no emblem unless you add one in data.
8. **Reset per character** — Icon in the character header (tooltip: reset toggles) clears that character’s toggles.
9. **Reset all toggles** — **Reset all toggles** in the toolbar clears every toggle (dungeon list unchanged).
10. **Delete** — Delete icon on each dungeon row removes that dungeon; remove icon in a character header removes that character.
11. **Theme** — Sun/moon icon in the header toggles light/dark mode (saved in `localStorage`; uses system preference when unset).

The sticky header shows the app name, version (`v.x.y.z` from `package.json` at build time), tracker actions, theme toggle, and a GitHub icon (tooltip: author attribution).

Data is saved automatically (debounced) to `localStorage` under the key `my-raid-cds`.

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
| `size` | `5 \| 10 \| 20 \| 25 \| 40` | Raid size |
| `itemLevel` | `number[]` | Item level(s), e.g. `[200, 213]` |
| `difficulty` | `"Normal" \| "Heroic"` | Raid mode; **Mode** column shows **N** or **H** chips |
| `emblem` | optional string | WotLK emblem key for display (`triumph`, `frost`, …); set on template rows, optional for custom dungeons |

Older saves may use a legacy `mode` field; it is mapped to `difficulty` on load.

### Dungeon Toggles

`Record<characterId, Record<dungeonId, boolean>>` — Maps each character–dungeon pair to a boolean (used/available).

## Tech Stack

- React 19 + TypeScript + Vite
- [Material UI](https://mui.com/) (`@mui/material`, `@mui/icons-material`) with Emotion

## Project Structure

```
src/
├── components/       # app-header, app-meta-info, app-theme-provider, app-intro, character-form,
│                     # theme-mode-toggle, dungeon-form, raid-tracker-table, tracker-controls, …
├── hooks/            # use-raid-tracker.ts, color-mode.ts, color-mode-provider.tsx, use-color-mode.ts
├── theme/            # create-app-theme.ts (MUI palette per mode)
├── types/            # characters, dungeons
├── data/             # dungeons.ts (RaidNames, DungeonList template)
├── utils/            # completion-counts, filter/sort dungeons, item-level tiers, parse-item-level-input, …
├── assets/           # class-icons/, emblems/
├── storage.ts        # localStorage load/save
├── uuid.ts           # generateUUID
└── vite-env.d.ts     # __APP_VERSION__ declaration
```

Production builds split vendor code into separate chunks (React, MUI, icons) via `vite.config.ts` `manualChunks`.

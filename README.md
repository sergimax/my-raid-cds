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
7. **Reset per character** — Icon in the character header (tooltip: reset toggles) clears that character’s toggles.
8. **Reset all toggles** — **Reset all toggles** in the toolbar clears every toggle (dungeon list unchanged).
9. **Delete** — Delete icon on each dungeon row removes that dungeon; remove icon in a character header removes that character.

The footer shows the app version (from `package.json`, injected at build time), a link to the author on GitHub, and a link to Cursor.

Data is saved automatically to `localStorage` under the key `my-raid-cds`.

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
| `difficulty` | `"Normal" \| "Heroic"` | Raid mode (shown as **Mode** in the table) |

Older saves may use a legacy `mode` field; it is mapped to `difficulty` on load.

### Dungeon Toggles

`Record<characterId, Record<dungeonId, boolean>>` — Maps each character–dungeon pair to a boolean (used/available).

## Tech Stack

- React 19 + TypeScript + Vite
- [Material UI](https://mui.com/) (`@mui/material`, `@mui/icons-material`) with Emotion

## Project Structure

```
src/
├── components/       # app-footer, app-header, app-intro, character-form, dungeon-form,
│                     # raid-tracker-table, tracker-controls, …
├── hooks/            # use-raid-tracker.ts (useRaidTracker)
├── types/            # characters, dungeons
├── data/             # dungeons.ts (DungeonList template)
├── utils/            # completion-counts, filter/sort dungeons, item-level tiers, …
├── assets/           # class icons
├── storage.ts        # localStorage load/save
├── uuid.ts           # generateUUID
└── vite-env.d.ts     # __APP_VERSION__ declaration
```

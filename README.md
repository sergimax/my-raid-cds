# My Raid CDs

A web app to track raid cooldowns per character and dungeon.
Add characters, add dungeons, and toggle cooldown usage for each character–dungeon pair.
Data persists in localStorage.

## Purpose

Track which raid cooldowns (e.g. lockouts) are used per character across different dungeons.
The dungeon table starts empty; you can add dungeons manually or load a template with WoW WotLK raids (Russian names).
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

1. **Add a character** — Click "Add new", enter name and class, submit.
2. **Add a dungeon** — Click "Add new", enter name, size (10/20/25/40), item level(s), and mode (Normal/Heroic).
3. **Add from template** — When the table is empty, click "Add from template" to load WoW WotLK raids.
4. **Toggle cooldowns** — Use the per-row toggle for each character to mark a dungeon as used or available.
5. **Reset per character** — Use the reset button (🔄) in a character header to clear all toggles for that character.
6. **Reset dungeons** — Clears all cooldown toggles (keeps the dungeon list).
7. **Search** — Filter the dungeon list by substring in the dungeon name (table header).
8. **Delete** — Remove a dungeon via the row trash icon in the dungeon column, or remove a character via the header trash icon.

Data is saved automatically to `localStorage` under the key `my-raid-cds`.

## Data Model

### Character

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | UUID |
| `name` | `string` | Character name |
| `class` | `CharacterClass` | WoW class (name, color, icon) |

### Dungeon

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | UUID |
| `name` | `string` | Dungeon name |
| `size` | `10 \| 20 \| 25 \| 40` | Raid size |
| `itemLevel` | `number[]` | Item level(s), e.g. `[200, 213]` |
| `mode` | `"Normal" \| "Heroic"` | Raid mode |

### Dungeon Toggles

`Record<characterId, Record<dungeonId, boolean>>` — Maps each character–dungeon pair to a boolean (used/available).

## Tech Stack

- React 19 + TypeScript + Vite
- CSS (no UI framework)

## Project Structure

```
src/
├── components/   # character-form, dungeon-form, dungeon-table
├── hooks/        # useRaidTracker
├── types/        # characters, dungeons
├── data/         # dungeons.ts (DungeonList template)
├── assets/       # class icons
├── storage.ts    # localStorage load/save
├── uuid.ts       # generateUUID
└── vite-env.d.ts # __APP_VERSION__ declaration
```

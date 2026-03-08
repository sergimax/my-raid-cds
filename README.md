# My Raid CDs

A web app to track raid cooldowns per character and dungeon.
Add characters, add dungeons, and toggle cooldown usage for each character–dungeon pair.
Data persists in localStorage.

## Purpose

Track which raid cooldowns (e.g. lockouts) are used per character across different dungeons. Default dungeon list includes WoW WotLK raids (Russian names). Supports custom characters and dungeons.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Build for production:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Usage

1. **Add a character** — Click "Add new", enter name and class, submit.
2. **Add a dungeon** — Click "Add new", enter name, size (10/20/25/40), item level(s), and mode (Normal/Heroic).
3. **Toggle cooldowns** — Use the per-row toggle for each character to mark a dungeon as used or available.
4. **Reset per character** — Use the reset button in a character header to clear all toggles for that character.
5. **Reset dungeons** — Restore the default dungeon list.
6. **Delete** — Remove characters or dungeons via the trash icon.

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

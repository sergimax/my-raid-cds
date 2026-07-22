# My Raid CDs

**English** | [Русский](README.ru.md)

Web app to track which raid cooldowns each character has used per dungeon (WotLK-focused).
Data persists locally in `localStorage`.
Live site: [sergimax.ru/my-raid-cds](https://sergimax.ru/my-raid-cds)

![App version](https://img.shields.io/badge/App_version-1.51.1-purple)
![Game version](https://img.shields.io/badge/WoW-3.3.5a-brown)

<img src="./public/logo.svg" width="148" height="148">

## Features

Toolbar panels are mutually exclusive (only one open at a time).

### Characters & dungeons

Add manually or load the WotLK raid template when the list is empty.
Edit specs, WowSims gear, and raid metadata later.

### Cooldown toggles

Mark which character has CD on which raid.
Reset one character from the table header, or everyone from the **Data** panel.

### Table

Sort and search raids (name, size, mode — EN/RU, e.g. `ICC25H` / `ЦЛК25хм`).
Compact layout on small screens.

### Data controls

Bulk reset CDs, or delete all characters / dungeons / local BiS lists (with confirm).
When there are no dungeons — **Add from template**.

### Character pick for a raid

Copyable signup line of characters still missing CD on filtered raids.
Filters: min GS, role, specs.

### Soft pick for a raid

Soft reserves for one character + spec on BiS upgrades from filtered raids.
Session-only; pasteable call lines.

### BiS builds

Built-in presets per spec; local copies are editable and used for gear-choice hints.
Slot layout matches the in-game paper doll.

### Gear hints

CD cells:
- <span style="color:#d97706">amber</span> — missing BiS
- <span style="color:#0284c7">blue</span> — ilvl upgrade

Tooltips group loot by boss.

### EN / RU

Full UI and item tooltips.
First visit defaults to Russian.

### Theme

Light/dark mode, saved locally.
Header links to GitHub and [sergimax.ru](https://sergimax.ru).

## Development

**Stack:**
React 19, TypeScript, Vite, MUI, Vitest + Testing Library.

**CI:**
On push/PR to `main`, GitHub Actions runs **Lint**, **Test**, and **Build** in parallel (`.github/workflows/ci.yml`); pushes to `main` also upload a `dist` artifact (`.github/workflows/build-artifacts.yml`).

**Layout:**
`src/components/` (UI), `src/hooks/` (domain + overlay panels), `src/utils/`, `src/data/` (WoW bundles + BiS presets), `src/storage/`. Tests are colocated as `*.test.ts(x)`.

Contributor/agent conventions: [`.cursor/rules/project-rules.mdc`](.cursor/rules/project-rules.mdc).

**Planned features:**
[docs/roadmap.md](docs/roadmap.md).

### Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` / `npm run test:run` | Vitest (watch / CI) |
| `npm run build:wow-data` | Regenerate bundled WoW JSON from `scripts/wowsims-db.json` (includes VoA tier loot derived from tier set metadata when WowSims omits zone 4603) |
| `npm run generate:bis-presets` | Regenerate built-in BiS presets from `scripts/bis-list-sources.md` |
| `npm run comment:bis-presets` | Add slot comments to BiS preset files |
| `npm run download:gear-slot-icons` | Regenerate WoW paper-doll slot placeholder PNGs in `src/assets/gear-slot-icons/` |

Built-in BiS lists are authored in `scripts/bis-list-sources.md` (`# Class - Spec` sections with `## Server - Author - List - URL` blocks; Titans guild lists use `## Titans - Guild - Titans` with Russian slot labels).
Regenerate TypeScript presets after editing the markdown.

### Persistence

| Key | Contents |
|-----|----------|
| `my-raid-cds` | Characters, dungeons, toggles (`schemaVersion` 5) |
| `my-raid-cds-bis-lists` | BiS preset selections and local lists (malformed entries skipped on load) |
| `my-raid-cds-item-tooltip-locale` | `en` or `ru` (defaults to `ru`) |
| `my-raid-cds-color-mode` | Light/dark preference |

Corrupted tracker data resets with an error alert.
Legacy saves migrate on load.

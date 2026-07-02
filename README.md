# My Raid CDs

Web app to track which raid cooldowns each character has used per dungeon (WotLK-focused). Data persists in `localStorage`.

## Quick start

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

Built-in BiS lists are authored in `scripts/bis-list-sources.md` (`# Class - Spec` sections with `## Server - Author - List - URL` blocks; Titans guild lists use `## Titans - Guild - Titans` with Russian slot labels). Regenerate TypeScript presets after editing the markdown.

## Features

- **Characters & dungeons** — Add manually or load a WotLK raid template when the list is empty. The new-dungeon form suggests known raid names and auto-fills short abbreviations. Edit name, specs, gear (WowSims import), dungeon metadata, and emblem badges.
- **Cooldown toggles** — Per character–dungeon switches; reset per character or all at once.
- **Table** — Sort by name, type (size + Heroic), ilvl, or completions; search dungeons; compact layout on narrow screens.
- **Export** — Copy a raid roster of characters still missing CD for visible (filtered) rows; optional minimum gear score omits lower-GS specs from lines.
- **BiS lists** — Built-in presets per spec (Titans + community sources); save editable local copies; drives gear upgrade hints.
- **Gear hints** — Amber = missing BiS targets from the selected list; blue = stat-filtered ilvl upgrades (darker tint = more slots). Dual-spec characters split the toggle cell left (main) / right (off). Dismissible legend above the table explains colors. Tooltips label boss-loot sections **BiS** / **Upgrades** and list tier tokens (including Vault of Archavon tier hands/legs). Tank ilvl hints require defense, dodge, or parry (BiS list overrides).
- **EN / RU** — Full UI + item tooltips (Cavern of Time / WoWRoad).
- **Theme** — Light/dark mode, saved locally.

Toolbar panels (add character, add dungeon, export, BiS) are mutually exclusive and share the same outlined panel shell.

## Persistence

| Key | Contents |
|-----|----------|
| `my-raid-cds` | Characters, dungeons, toggles (`schemaVersion` 5) |
| `my-raid-cds-bis-lists` | BiS preset selections and local lists |
| `my-raid-cds-item-tooltip-locale` | `en` or `ru` |
| `my-raid-cds-color-mode` | Light/dark preference |

Corrupted tracker data resets with an error alert. Legacy saves migrate on load.

## Development

**Stack:** React 19, TypeScript, Vite, MUI, Vitest + Testing Library.

**CI:** On push/PR to `main`, GitHub Actions runs **Lint**, **Test**, and **Build** in parallel (`.github/workflows/ci.yml`); pushes to `main` also upload a `dist` artifact (`.github/workflows/build-artifacts.yml`).

**Layout:** `src/components/` (UI), `src/hooks/` (domain + overlay panels), `src/utils/`, `src/data/` (WoW bundles + BiS presets), `src/storage/`. Tests are colocated as `*.test.ts(x)`.

Contributor/agent conventions: [`.cursor/rules/project-rules.mdc`](.cursor/rules/project-rules.mdc).

**Roadmap:** [docs/roadmap.md](docs/roadmap.md).

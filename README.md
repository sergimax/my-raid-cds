# My Raid CDs

Web app to track which raid cooldowns each character has used per dungeon (WotLK-focused). Data persists in `localStorage`.

![App version](https://img.shields.io/badge/App_version-1.46.0-purple)
![Game version](https://img.shields.io/badge/WoW-3.3.5a-brown)

## Features

Toolbar panels (character pick, soft pick, BiS builds, add character, add dungeon) are mutually exclusive and share the same outlined panel shell.

### Characters & dungeons

Add manually or load a WotLK raid template when the list is empty. The new-dungeon form suggests known raid names and auto-fills short abbreviations. Edit name, specs, gear (WowSims import), dungeon metadata, and emblem badges. The edit dialog nudges you to re-import gear or update gear score when those fields drift apart.

### Cooldown toggles

Per character–dungeon switches; reset per character or all at once.

### Table

Sort by name, type (size + Heroic), ilvl, or completions; mixed dungeon search by raid name, size, and mode (e.g. `ICC`, `Uld10`, `ICC25N` / `ЦЛК25об`, `ToC25H` / `ИК25хм`; EN/RU names work in either locale); compact layout on narrow screens.

### Character pick

Copy a raid roster of characters still missing CD for visible (filtered) rows. Open via toolbar **Character pick** (EN) / **Подбор персонажа** (RU). The panel uses a bordered filter grid: **min GS**, **role** (WoW LFG icons in an equal 2×2 grid), **character specs** (with **Select all** / **Clear all**), and **raids** (table search, chips with raid icons). **Reset all filters** in the panel header clears specs, roles, and min GS. Spec checkboxes sync with the table raid search: characters on CD for every visible raid are cleared and disabled; **Select all** skips them. Inactive rows show CD styling (italic, muted, grayscale) or per-spec strikethrough when role/GS filters block a spec; hover tooltips explain why. At viewport widths ≥1600px, signup result lines sit to the right of the filter grid (scroll inside the block). Per-raid lines include a **Copy** button.

### Soft pick

Plan soft reserves for one character + spec. Open via toolbar **Soft pick** (EN) / **Подбор софтов** (RU). Set raid soft-reserve rules (max softs 1–4; **re-roll** or **+100**), pick a single main/off spec, then assign your softs and competing calls (histogram by soft weight) on BiS / BiS-variant upgrades from table-filtered raids. Copy a soft-reserve call list for the raid. Session-only (not persisted).

### BiS builds

Built-in presets per spec (Titans + community sources); toolbar **BiS builds** (EN) / **BIS сборки** (RU). Save editable local copies; drives gear upgrade hints. Slot rows show WoW paper-doll placeholder icons beside localized labels (Back uses the Chest icon); read-only presets use a compact layout with truncated slot names.

### Gear hints

Amber = missing BiS targets from the selected list; blue = stat-filtered ilvl upgrades (darker tint = more slots). Dual-spec characters split the toggle cell left (main) / right (off). Rings and trinkets count as satisfied when equipped in either slot of the pair. Normal/heroic same-name variants count as the same item for BiS and ilvl. Same-ilvl faction twins (e.g. Alliance/Horde Solace) satisfy BiS, but the other faction id can still appear on the ilvl track so you can pick a variant. Ilvl hints filter proc trinkets by role (tank / healer / melee DPS) when bundled stats are misleading. Ruby Sanctum rows filter loot by size and difficulty (10N/10H/25N/25H). Dismissible legend above the table explains colors. Tooltips label boss-loot sections **BiS** / **Upgrades**, omit wrong-mode drops, and list tier tokens (including Vault of Archavon tier hands/legs); light theme uses a dark high-contrast tooltip panel with bright item-name colors. Tank ilvl hints require defense, dodge, or parry (BiS list overrides).

### EN / RU

Full UI + item tooltips (Cavern of Time / WoWRoad).

### Theme

Light/dark mode, saved locally.

## Development

**Stack:** React 19, TypeScript, Vite, MUI, Vitest + Testing Library.

**CI:** On push/PR to `main`, GitHub Actions runs **Lint**, **Test**, and **Build** in parallel (`.github/workflows/ci.yml`); pushes to `main` also upload a `dist` artifact (`.github/workflows/build-artifacts.yml`).

**Layout:** `src/components/` (UI), `src/hooks/` (domain + overlay panels), `src/utils/`, `src/data/` (WoW bundles + BiS presets), `src/storage/`. Tests are colocated as `*.test.ts(x)`.

Contributor/agent conventions: [`.cursor/rules/project-rules.mdc`](.cursor/rules/project-rules.mdc).

**Roadmap:** [docs/roadmap.md](docs/roadmap.md).

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

Built-in BiS lists are authored in `scripts/bis-list-sources.md` (`# Class - Spec` sections with `## Server - Author - List - URL` blocks; Titans guild lists use `## Titans - Guild - Titans` with Russian slot labels). Regenerate TypeScript presets after editing the markdown.

### Persistence

| Key | Contents |
|-----|----------|
| `my-raid-cds` | Characters, dungeons, toggles (`schemaVersion` 5) |
| `my-raid-cds-bis-lists` | BiS preset selections and local lists |
| `my-raid-cds-item-tooltip-locale` | `en` or `ru` |
| `my-raid-cds-color-mode` | Light/dark preference |

Corrupted tracker data resets with an error alert. Legacy saves migrate on load.

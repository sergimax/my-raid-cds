# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-05

### Added

- Dungeon name search in the table header (case-insensitive substring filter; empty search shows all rows)
- Monospace font stack for the whole app, including form controls

### Changed

- Dungeon table: per-row delete stays in the dungeon column; distinct cool-toned styling for that column vs character cells
- Table chrome simplified (bottom borders, lighter sticky separation); raid size badge without outline border
- Sorting defaults to item level descending; “Default” sort option removed
- Delete all dungeons control removed (remove dungeons with per-row delete only)

## [1.0.3] - 2026-03-21

### Added

- Dungeon form preset selector: pick from WotLK template when adding manually (presets already in table are hidden)
- Raid names shown with Russian (in-game) and English (original) in parentheses
- `displayDungeonName` helper for locale-based dungeon name display

### Changed

- Dungeon form receives `existingDungeons` to filter preset options and avoid invalid select state

## [1.0.2] - 2026-03-13

### Changed

- Compact desktop layout at 1024px+ (smaller padding, buttons, table cells, toggles, icons)
- Consolidated and reorganized CSS across App, forms, and dungeon table

## [1.0.1] - 2026-03-11

### Added

- Zebra striping for odd table rows

## [1.0.0] - 2026-03-11

### Added

- Raid cooldown tracker: characters, dungeons, per-character–dungeon toggles
- Add characters with WoW class (Death Knight, Druid, Hunter, Mage, Paladin, Priest, Rogue, Shaman, Warlock, Warrior)
- Add dungeons manually (name, size 10/20/25/40, item level, mode Normal/Heroic)
- Add from template: load WoW WotLK raids (Russian names) when table is empty
- Toggle cooldown usage per character–dungeon pair
- Reset all cooldown toggles (Reset dungeons button)
- Reset toggles per character (🔄 button in character header)
- Delete all dungeons (Delete all button in table header)
- Delete individual characters or dungeons (🗑️ icon)
- Dungeon table sorting by name, size, or item level
- GearScore-style item level coloring
- localStorage persistence
- App version in footer (from package.json)

### Changed

- Dungeon list starts empty by default (no preloaded dungeons)

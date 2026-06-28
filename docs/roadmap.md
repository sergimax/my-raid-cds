# Roadmap & feature ideas

Ideas for future releases. Not committed to a version or timeline.

## Gear upgrade hints

### Stat-aware class + spec recommendations

**Problem:** Ilvl-based hints only check whether an item is equippable and has a higher item level. Many drops match those rules but are poor upgrades for a spec (e.g. Spirit leather for Enhancement Shaman, caster off-hands for physical specs).

**Idea:** Layer spec-relevant stat filtering on top of today’s equip + ilvl checks:

- Use bundled item stat data (from WowSims DB or similar) to score loot against class/spec priorities (Agi/Str/Int, spell power, hit/expertise, etc.).
- Keep **BiS list** hints as explicit user-chosen targets (amber tint).
- Replace or narrow **ilvl** hints so listed items pass a minimum “useful for this spec” threshold, or show a separate “possible ilvl only” tier with weaker emphasis.

**Related today:** `evaluateGearUpgradeHint` → `bis` + `ilvl` tracks; `item-equip-restrictions.ts` filters by armor type, weapon type, and ranged slot only.

---

## Other ideas

_Add new sections here as ideas come up._

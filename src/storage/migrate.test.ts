import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { CURRENT_SCHEMA_VERSION } from "./constants.ts";
import { migrateStoredPayload } from "./migrate.ts";
import type { StoredPayload } from "./types.ts";

describe("migrateStoredPayload", () => {
  it("stamps current schema version from unversioned payload", () => {
    const payload: StoredPayload = {
      characters: [],
      dungeons: [],
      dungeonToggles: {},
    };

    expect(migrateStoredPayload(payload).schemaVersion).toBe(
      CURRENT_SCHEMA_VERSION,
    );
  });

  it("maps legacy dungeon mode to difficulty by v5", () => {
    const payload: StoredPayload = {
      schemaVersion: 1,
      characters: [],
      dungeons: [
        {
          id: "dungeon-1",
          name: "Raid",
          size: 25,
          itemLevel: [200],
          mode: DungeonDifficulty.HEROIC,
        },
      ],
      dungeonToggles: {},
    };

    const migrated = migrateStoredPayload(payload);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.dungeons[0]?.difficulty).toBe(DungeonDifficulty.HEROIC);
    expect(migrated.dungeons[0]?.mode).toBeUndefined();
  });

  it("nests flat gearScore and gearItems onto mainSpec", () => {
    const payload: StoredPayload = {
      schemaVersion: 2,
      characters: [
        {
          id: "char-1",
          name: "Alpha",
          className: "Death Knight",
          mainSpec: "Unholy",
          gearScore: 5800,
          gearItems: [{ slot: 0, id: 51127 }],
        },
      ],
      dungeons: [],
      dungeonToggles: {},
    };

    const migrated = migrateStoredPayload(payload);
    expect(migrated.characters[0]?.mainSpec).toEqual({
      spec: "Unholy",
      gearScore: 5800,
      gearItems: [{ slot: 0, id: 51127 }],
    });
    expect(migrated.characters[0]?.gearScore).toBeUndefined();
    expect(migrated.characters[0]?.gearItems).toBeUndefined();
  });
});

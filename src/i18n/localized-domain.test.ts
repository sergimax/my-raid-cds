import { describe, expect, it } from "vitest";
import { DungeonDifficulty } from "../types/dungeons.ts";
import { getLocalizedDungeonCompactLabel } from "./localized-domain.ts";

describe("getLocalizedDungeonCompactLabel", () => {
  it("combines ICC short name, size, and skull for heroic EN", () => {
    expect(
      getLocalizedDungeonCompactLabel(
        {
          name: "Icecrown Citadel",
          raidKey: "icecrownCitadel",
          size: 25,
          difficulty: DungeonDifficulty.HEROIC,
        },
        "en",
      ),
    ).toBe("ICC 25 ☠️");
  });

  it("combines ЦЛК short name and size for normal RU", () => {
    expect(
      getLocalizedDungeonCompactLabel(
        {
          name: "Цитадель Ледяной Короны",
          raidKey: "icecrownCitadel",
          size: 25,
          difficulty: DungeonDifficulty.NORMAL,
        },
        "ru",
      ),
    ).toBe("ЦЛК 25");
  });

  it("uses custom short name for non-template dungeons", () => {
    expect(
      getLocalizedDungeonCompactLabel(
        {
          name: "My Custom Raid",
          shortName: "MCR",
          size: 10,
          difficulty: DungeonDifficulty.HEROIC,
        },
        "en",
        "☠",
      ),
    ).toBe("MCR 10 ☠");
  });
});

import { describe, expect, it } from "vitest";
import { ClassName } from "../types/characters.ts";
import {
  DEFAULT_EXPORT_ROLE_FILTER,
  getExportRoleForSpec,
  specPassesExportRoleFilter,
} from "./export-spec-role.ts";

describe("getExportRoleForSpec", () => {
  it("maps tank, healer, melee, and ranged specs", () => {
    expect(getExportRoleForSpec(ClassName.Warrior, "Protection")).toBe("tank");
    expect(getExportRoleForSpec(ClassName.Priest, "Holy")).toBe("healer");
    expect(getExportRoleForSpec(ClassName.Rogue, "Combat")).toBe("meleeDps");
    expect(getExportRoleForSpec(ClassName.Hunter, "Marksmanship")).toBe(
      "rangedDps",
    );
    expect(getExportRoleForSpec(ClassName.Mage, "Fire")).toBe("rangedDps");
  });

  it("treats Blood Death Knight as tank", () => {
    expect(getExportRoleForSpec(ClassName.DeathKnight, "Blood")).toBe("tank");
  });
});

describe("specPassesExportRoleFilter", () => {
  it("includes all roles by default", () => {
    expect(
      specPassesExportRoleFilter(ClassName.Paladin, "Retribution"),
    ).toBe(true);
    expect(
      specPassesExportRoleFilter(ClassName.Paladin, "Holy"),
    ).toBe(true);
  });

  it("omits specs whose role is unchecked", () => {
    const tanksOnly: typeof DEFAULT_EXPORT_ROLE_FILTER = {
      ...DEFAULT_EXPORT_ROLE_FILTER,
      healer: false,
      meleeDps: false,
      rangedDps: false,
    };

    expect(
      specPassesExportRoleFilter(
        ClassName.Warrior,
        "Protection",
        tanksOnly,
      ),
    ).toBe(true);
    expect(
      specPassesExportRoleFilter(ClassName.Warrior, "Fury", tanksOnly),
    ).toBe(false);
  });
});

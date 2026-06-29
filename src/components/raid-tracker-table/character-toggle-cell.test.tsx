import { Table, TableBody, TableRow } from "@mui/material";
import userEvent from "@testing-library/user-event";
import { useMemo, useState } from "react";
import { describe, expect, it } from "vitest";
import type { AppLocale } from "../../i18n/types.ts";
import { loadLocalBisListsState } from "../../storage/bis-lists/index.ts";
import {
  createTestCharacter,
  createTestDungeon,
  createTestToggles,
} from "../../test/fixtures.ts";
import { renderWithTheme, screen } from "../../test/render-with-theme.tsx";
import { CharacterToggleCell } from "./character-toggle-cell.tsx";

const testCharacter = createTestCharacter({ id: "alpha", name: "Alpha" });
const testDungeon = createTestDungeon({
  id: "icc",
  name: "Icecrown Citadel",
});
const testToggles = createTestToggles([]);
const testBisListsLocalState = loadLocalBisListsState();

function LocaleHarness() {
  const [locale, setLocale] = useState<AppLocale>("en");
  const stableToggles = useMemo(() => testToggles, []);

  return (
    <>
      <button type="button" onClick={() => setLocale("ru")}>
        RU
      </button>
      <Table>
        <TableBody>
          <TableRow>
            <CharacterToggleCell
              character={testCharacter}
              dungeon={testDungeon}
              dungeonToggles={stableToggles}
              onDungeonToggle={() => {}}
              locale={locale}
              bisListsLocalState={testBisListsLocalState}
            />
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

describe("CharacterToggleCell", () => {
  it("updates the toggle aria-label when the locale prop changes", async () => {
    const user = userEvent.setup();
    renderWithTheme(<LocaleHarness />);

    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-label",
      "Alpha — Icecrown Citadel",
    );

    await user.click(screen.getByRole("button", { name: "RU" }));

    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-label",
      "Alpha — Цитадель Ледяной Короны",
    );
  });
});

import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_DUNGEON_DIFFICULTY,
  DEFAULT_DUNGEON_FORM_SIZE,
  DEFAULT_DUNGEON_ITEM_LEVEL_TEXT,
} from "../../constants/dungeon-form-defaults.ts";
import { renderWithTheme, screen } from "../../test/render-with-theme.tsx";
import { DungeonForm } from "./index.tsx";

describe("DungeonForm", () => {
  it("renders dungeon fields including optional short name", () => {
    renderWithTheme(
      <DungeonForm
        name=""
        shortName=""
        size={DEFAULT_DUNGEON_FORM_SIZE}
        itemLevelText={DEFAULT_DUNGEON_ITEM_LEVEL_TEXT}
        difficulty={DEFAULT_DUNGEON_DIFFICULTY}
        error=""
        onNameChange={vi.fn()}
        onShortNameChange={vi.fn()}
        onSizeChange={vi.fn()}
        onItemLevelTextChange={vi.fn()}
        onDifficultyChange={vi.fn()}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: /^Name/ })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^Short name/ })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^Item levels/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add dungeon" })).toBeInTheDocument();
  });

  it("displays validation error", () => {
    renderWithTheme(
      <DungeonForm
        name=""
        shortName=""
        size={DEFAULT_DUNGEON_FORM_SIZE}
        itemLevelText={DEFAULT_DUNGEON_ITEM_LEVEL_TEXT}
        difficulty={DEFAULT_DUNGEON_DIFFICULTY}
        error="Enter a dungeon name."
        onNameChange={vi.fn()}
        onShortNameChange={vi.fn()}
        onSizeChange={vi.fn()}
        onItemLevelTextChange={vi.fn()}
        onDifficultyChange={vi.fn()}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText("Enter a dungeon name.")).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => {
      event.preventDefault();
    });

    renderWithTheme(
      <DungeonForm
        name="My Raid"
        shortName=""
        size={DEFAULT_DUNGEON_FORM_SIZE}
        itemLevelText={DEFAULT_DUNGEON_ITEM_LEVEL_TEXT}
        difficulty={DEFAULT_DUNGEON_DIFFICULTY}
        error=""
        onNameChange={vi.fn()}
        onShortNameChange={vi.fn()}
        onSizeChange={vi.fn()}
        onItemLevelTextChange={vi.fn()}
        onDifficultyChange={vi.fn()}
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Add dungeon" }),
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CharacterForm } from "./index.tsx";
import { renderWithTheme, screen } from "../../test/render-with-theme.tsx";

describe("CharacterForm", () => {
  it("renders name and class fields", () => {
    renderWithTheme(
      <CharacterForm
        name=""
        characterClass=""
        error=""
        onNameChange={vi.fn()}
        onClassChange={vi.fn()}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: /^Name/ })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /^Class/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add character" })).toBeInTheDocument();
  });

  it("displays validation error", () => {
    renderWithTheme(
      <CharacterForm
        name=""
        characterClass=""
        error="Enter a name and choose a class."
        onNameChange={vi.fn()}
        onClassChange={vi.fn()}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Enter a name and choose a class."),
    ).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => {
      event.preventDefault();
    });

    renderWithTheme(
      <CharacterForm
        name="Alpha"
        characterClass=""
        error=""
        onNameChange={vi.fn()}
        onClassChange={vi.fn()}
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Add character" }),
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

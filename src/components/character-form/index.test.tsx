import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CharacterForm } from "./index.tsx";
import { renderWithTheme, screen } from "../../test/render-with-theme.tsx";

describe("CharacterForm", () => {
  const defaultProps = {
    name: "",
    characterClass: "" as const,
    mainSpec: "",
    mainGearScoreText: "",
    offSpec: "",
    offGearScoreText: "",
    error: "",
    onNameChange: vi.fn(),
    onClassChange: vi.fn(),
    onMainSpecChange: vi.fn(),
    onMainGearScoreTextChange: vi.fn(),
    onOffSpecChange: vi.fn(),
    onOffGearScoreTextChange: vi.fn(),
    onSubmit: vi.fn(),
  };

  it("renders name and class fields", () => {
    renderWithTheme(<CharacterForm {...defaultProps} />);

    expect(screen.getByRole("textbox", { name: /^Name/ })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /^Class/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add character" })).toBeInTheDocument();
  });

  it("displays validation error", () => {
    renderWithTheme(
      <CharacterForm
        {...defaultProps}
        error="Enter a name and choose a class."
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
        {...defaultProps}
        name="Alpha"
        onSubmit={onSubmit}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Add character" }),
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

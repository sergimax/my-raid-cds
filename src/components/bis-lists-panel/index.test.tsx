import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BisListsPanel } from "./index.tsx";
import { renderWithTheme, screen } from "../../test/render-with-theme.tsx";

describe("BisListsPanel", () => {
  it("shows slot items for the default Unholy DK preset on open", () => {
    renderWithTheme(<BisListsPanel />);

    expect(screen.getByText(/Udk-STR \(Warmane/i)).toBeInTheDocument();
    expect(screen.getByText(/Head/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sanctified Scourgelord Helmet/i })).toBeInTheDocument();
  });

  it("shows custom list UI for specs without a built-in preset", async () => {
    const user = userEvent.setup();
    renderWithTheme(<BisListsPanel />);

    await user.click(screen.getByRole("combobox", { name: /^Class/ }));
    await user.click(screen.getByRole("option", { name: /Warrior/ }));

    expect(
      screen.getByText(/No built-in BiS list for Warrior Arms/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save list/i })).toBeInTheDocument();
  });
});

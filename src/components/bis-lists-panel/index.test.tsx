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

  it("shows built-in preset items for Warrior Arms", async () => {
    const user = userEvent.setup();
    renderWithTheme(<BisListsPanel />);

    await user.click(screen.getByRole("combobox", { name: /^Class/ }));
    await user.click(screen.getByRole("option", { name: /Warrior/ }));
    await user.click(screen.getByRole("combobox", { name: /^Spec/ }));
    await user.click(screen.getByRole("option", { name: /Arms/ }));

    expect(screen.getByText(/Arms \(icy-veins/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shadowmourne/i })).toBeInTheDocument();
  });
});

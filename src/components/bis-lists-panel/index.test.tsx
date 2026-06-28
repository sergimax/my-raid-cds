import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BisListsPanel } from "./index.tsx";
import { renderWithTheme, screen } from "../../test/render-with-theme.tsx";

describe("BisListsPanel", () => {
  it("shows custom list UI for specs without a built-in preset", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<BisListsPanel onClose={vi.fn()} />);

    await user.click(screen.getByRole("combobox", { name: /^Class/ }));
    await user.click(screen.getByRole("option", { name: /Warrior/ }));

    expect(
      screen.getByText(/No built-in BiS list for Warrior Arms/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save list/i })).toBeInTheDocument();
  });
});

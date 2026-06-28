import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TestProviders } from "../../test/test-providers.tsx";
import { TrackerToolbarPanel } from "./index.tsx";

describe("TrackerToolbarPanel", () => {
  it("renders title, description, and close control", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    window.scrollTo = vi.fn();

    render(
      <TrackerToolbarPanel
        panelId="character"
        title="New character"
        description="Add a raid member."
        closeAriaLabel="Close add character panel"
        onClose={onClose}
      >
        <div>Form body</div>
      </TrackerToolbarPanel>,
      { wrapper: TestProviders },
    );

    expect(screen.getByText("New character")).toBeInTheDocument();
    expect(screen.getByText("Add a raid member.")).toBeInTheDocument();
    expect(screen.getByText("Form body")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Close add character panel" }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

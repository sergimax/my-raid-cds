import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import type { ReactElement } from "react";
import { TestProviders } from "./test-providers.tsx";

export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return testingLibraryRender(ui, {
    wrapper: TestProviders,
    ...options,
  });
}

export {
  screen,
  within,
  waitFor,
  fireEvent,
} from "@testing-library/react";

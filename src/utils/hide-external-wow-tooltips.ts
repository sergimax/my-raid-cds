/** Third-party tooltip globals injected by Cavern of Time / WoWRoad scripts. */
type ExternalWowTooltipWindow = Window & {
  $CoTTooltip?: { hideTooltip?: () => void };
  $CoT?: { Tooltip?: { hide?: () => void } };
  Tooltip?: { hide?: () => void };
};

/**
 * Hides active Cavern of Time and WoWRoad hover tooltips.
 * Required when React unmounts item links or switches tooltip locale without a mouseout.
 */
export function hideExternalWowTooltips(): void {
  const externalWindow = window as ExternalWowTooltipWindow;

  try {
    externalWindow.$CoTTooltip?.hideTooltip?.();
  } catch {
    // ignore third-party errors
  }

  try {
    externalWindow.$CoT?.Tooltip?.hide?.();
  } catch {
    // ignore third-party errors
  }

  try {
    externalWindow.Tooltip?.hide?.();
  } catch {
    // ignore third-party errors
  }

  hideExternalWowTooltipElementsFallback();
}

function hideExternalWowTooltipElementsFallback(): void {
  const tooltipLayer = document.getElementById("layers_0945757");
  if (tooltipLayer) {
    for (const child of tooltipLayer.children) {
      if (child instanceof HTMLElement) {
        child.style.display = "none";
        child.style.visibility = "hidden";
      }
    }
  }

  for (const element of document.querySelectorAll(".cavernoftime-tt")) {
    if (element instanceof HTMLElement) {
      element.style.display = "none";
      element.style.visibility = "hidden";
    }
  }
}

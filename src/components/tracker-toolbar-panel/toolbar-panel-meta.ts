import type { TranslateFn } from "../../i18n/translate.ts";
import { TRACKER_NARROW_PANEL_MAX_WIDTH } from "./constants.ts";
import type { MainToolbarPanelId, ToolbarPanelId } from "./resolve-toolbar-panel-id.ts";

export type ToolbarPanelMeta = {
  title: string;
  description?: string;
  descriptionTooltip?: string;
  closeAriaLabel: string;
  onClose: () => void;
  maxWidth?: number;
};

type MainToolbarPanelHandlers = {
  closeCharacterForm: () => void;
  closeDungeonForm: () => void;
  closeBisListsPanel: () => void;
};

type ToolbarPanelHandlers = MainToolbarPanelHandlers & {
  closeExportPanel: () => void;
};

export function getToolbarPanelMeta(
  panelId: ToolbarPanelId,
  t: TranslateFn,
  handlers: ToolbarPanelHandlers,
): ToolbarPanelMeta {
  if (panelId === "export") {
    return getExportToolbarPanelMeta(t, handlers.closeExportPanel);
  }
  return getMainToolbarPanelMeta(panelId, t, handlers);
}

function getMainToolbarPanelMeta(
  panelId: MainToolbarPanelId,
  t: TranslateFn,
  handlers: MainToolbarPanelHandlers,
): ToolbarPanelMeta {
  switch (panelId) {
    case "character":
      return {
        title: t("characterForm.title"),
        closeAriaLabel: t("characterForm.closeAria"),
        onClose: handlers.closeCharacterForm,
        maxWidth: TRACKER_NARROW_PANEL_MAX_WIDTH,
      };
    case "dungeon":
      return {
        title: t("dungeonForm.title"),
        closeAriaLabel: t("dungeonForm.closeAria"),
        onClose: handlers.closeDungeonForm,
        maxWidth: TRACKER_NARROW_PANEL_MAX_WIDTH,
      };
    case "bis":
      return {
        title: t("bisPanel.title"),
        description: t("bisPanel.layoutHint"),
        descriptionTooltip: t("bisPanel.helpTooltip"),
        closeAriaLabel: t("bisPanel.closeAria"),
        onClose: handlers.closeBisListsPanel,
      };
  }
}

function getExportToolbarPanelMeta(
  t: TranslateFn,
  onClose: () => void,
): ToolbarPanelMeta {
  return {
    title: t("exportPanel.title"),
    description: t("exportPanel.instructions"),
    closeAriaLabel: t("exportPanel.closeAria"),
    onClose,
  };
}

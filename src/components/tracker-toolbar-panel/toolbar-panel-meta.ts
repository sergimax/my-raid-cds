import type { TranslateFn } from "../../i18n/translate.ts";
import type { MainToolbarPanelId } from "./resolve-toolbar-panel-id.ts";

export type ToolbarPanelMeta = {
  title: string;
  description?: string;
  descriptionTooltip?: string;
  closeAriaLabel: string;
  onClose: () => void;
};

type MainToolbarPanelHandlers = {
  closeCharacterForm: () => void;
  closeDungeonForm: () => void;
  closeBisListsPanel: () => void;
};

export function getMainToolbarPanelMeta(
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
      };
    case "dungeon":
      return {
        title: t("dungeonForm.title"),
        closeAriaLabel: t("dungeonForm.closeAria"),
        onClose: handlers.closeDungeonForm,
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

export function getExportToolbarPanelMeta(
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

import DeselectIcon from "@mui/icons-material/Deselect";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";

type ExportCharacterSpecFilterActionsProps = {
  disabled?: boolean;
  onSelectAll: () => void;
  onClearAll: () => void;
};

export function ExportCharacterSpecFilterActions({
  disabled = false,
  onSelectAll,
  onClearAll,
}: ExportCharacterSpecFilterActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={t("exportPanel.selectAllSpecs")}>
        <span>
          <IconButton
            size="small"
            color="inherit"
            disabled={disabled}
            aria-label={t("exportPanel.selectAllSpecsAria")}
            onClick={onSelectAll}
          >
            <SelectAllIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t("exportPanel.clearAllSpecs")}>
        <span>
          <IconButton
            size="small"
            color="inherit"
            disabled={disabled}
            aria-label={t("exportPanel.clearAllSpecsAria")}
            onClick={onClearAll}
          >
            <DeselectIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}

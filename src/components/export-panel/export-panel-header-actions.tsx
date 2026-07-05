import { Button } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";

type ExportPanelHeaderActionsProps = {
  onResetAllFilters: () => void;
};

export function ExportPanelHeaderActions({
  onResetAllFilters,
}: ExportPanelHeaderActionsProps) {
  const { t } = useTranslation();

  return (
    <Button
      size="small"
      variant="text"
      onClick={onResetAllFilters}
      sx={{ whiteSpace: "nowrap", minWidth: 0, px: 1 }}
    >
      {t("exportPanel.resetAllFilters")}
    </Button>
  );
}

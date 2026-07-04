import { Chip, Stack, Typography } from "@mui/material";
import type { AppLocale } from "../../i18n/types.ts";
import type { TranslateFn } from "../../i18n/translate.ts";
import type { DungeonRecord } from "../../types/dungeons.ts";
import { formatDungeonExportLabel } from "../../utils/format-dungeon-label.ts";

type ExportDungeonFilterProps = {
  dungeonNameSearch: string;
  visibleDungeons: readonly DungeonRecord[];
  totalDungeonCount: number;
  locale: AppLocale;
  t: TranslateFn;
};

export function ExportDungeonFilter({
  dungeonNameSearch,
  visibleDungeons,
  totalDungeonCount,
  locale,
  t,
}: ExportDungeonFilterProps) {
  const trimmedSearch = dungeonNameSearch.trim();
  const hasSearch = trimmedSearch.length > 0;

  return (
    <Stack spacing={0.75}>
      <Typography variant="body2" color="text.secondary">
        {hasSearch
          ? t("exportPanel.dungeonFilterSearchActive", { query: trimmedSearch })
          : t("exportPanel.dungeonFilterSearchEmpty")}
      </Typography>
      <Typography variant="body2">
        {t("exportPanel.dungeonFilterMatchCount", {
          count: visibleDungeons.length,
          total: totalDungeonCount,
        })}
      </Typography>
      {visibleDungeons.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("exportPanel.dungeonFilterNoMatches")}
        </Typography>
      ) : (
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
          {visibleDungeons.map((dungeon) => (
            <Chip
              key={dungeon.id}
              size="small"
              variant="outlined"
              label={formatDungeonExportLabel(dungeon, locale)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

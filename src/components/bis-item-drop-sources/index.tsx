import { Box, Typography } from "@mui/material";
import type { AppLocale } from "../../i18n/types.ts";
import { getFormattedItemDropSources } from "../../utils/item-drop-sources.ts";

type BisItemDropSourcesProps = {
  itemIds: readonly number[];
  locale: AppLocale;
};

export function BisItemDropSources({ itemIds, locale }: BisItemDropSourcesProps) {
  const sourceLines = itemIds.flatMap((itemId) => {
    const sources = getFormattedItemDropSources(itemId, locale);
    if (sources.length === 0) {
      return [];
    }
    return [{ itemId, sources }];
  });

  if (sourceLines.length === 0) {
    return null;
  }

  return (
    <Box component="span" sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
      {sourceLines.map(({ itemId, sources }) => (
        <Typography
          key={itemId}
          variant="caption"
          component="span"
          sx={{ display: "block", color: "text.disabled", lineHeight: 1.35 }}
        >
          {sources.map((source) => `${source.raidLabel} · ${source.bossName}`).join(" · ")}
        </Typography>
      ))}
    </Box>
  );
}

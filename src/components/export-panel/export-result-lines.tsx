import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import {
  formatExportLineCopyText,
  type BuildExportStatusResult,
  type ExportStatusLine,
} from "../../utils/build-export-status.ts";
import { EXPORT_RESULT_MAX_HEIGHT } from "./constants.ts";
import { ExportFilterSection } from "./export-filter-section.tsx";

type ExportResultLinesProps = {
  result: BuildExportStatusResult;
};

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

type ExportResultLineRowProps = {
  line: ExportStatusLine;
  emphasizeCopy: boolean;
};

function ExportResultLineRow({ line, emphasizeCopy }: ExportResultLineRowProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const didCopy = await copyTextToClipboard(formatExportLineCopyText(line));
    if (!didCopy) {
      return;
    }
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, [line]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-start" },
        gap: 1,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 1.25,
        py: 1,
        minWidth: 0,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          component="p"
          sx={{ fontWeight: 600, lineHeight: 1.3 }}
        >
          {line.raidLabel}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          color="text.secondary"
          sx={{
            mt: 0.35,
            lineHeight: 1.4,
            wordBreak: "break-word",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {line.charactersLabel}
        </Typography>
      </Box>
      <Button
        size="small"
        variant={emphasizeCopy ? "contained" : "outlined"}
        startIcon={<ContentCopyIcon fontSize="small" />}
        onClick={() => {
          void handleCopy();
        }}
        aria-label={t("exportPanel.copyLineAria", { raid: line.raidLabel })}
        sx={{
          flexShrink: 0,
          alignSelf: { xs: "stretch", sm: "flex-start" },
          whiteSpace: "nowrap",
        }}
      >
        {copied ? t("exportPanel.copied") : t("exportPanel.copyLine")}
      </Button>
    </Box>
  );
}

export function ExportResultLines({ result }: ExportResultLinesProps) {
  const { t } = useTranslation();

  if (result.kind === "message") {
    return (
      <ExportFilterSection
        title={t("exportPanel.exportLinesTitle")}
        description={t("exportPanel.exportLinesHelper")}
      >
        <Typography variant="body2" color="text.secondary">
          {result.message}
        </Typography>
      </ExportFilterSection>
    );
  }

  const singleLine = result.lines.length === 1;

  return (
    <ExportFilterSection
      title={t("exportPanel.exportLinesTitle")}
      description={
        singleLine
          ? t("exportPanel.exportLinesHelperSingle")
          : t("exportPanel.exportLinesHelper")
      }
      contentSx={{ maxHeight: EXPORT_RESULT_MAX_HEIGHT }}
    >
      <Stack spacing={1}>
        {result.lines.map((line) => (
          <ExportResultLineRow
            key={line.dungeonId}
            line={line}
            emphasizeCopy={singleLine}
          />
        ))}
      </Stack>
    </ExportFilterSection>
  );
}

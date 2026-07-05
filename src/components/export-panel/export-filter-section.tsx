import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

type ExportFilterSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
};

export function ExportFilterSection({
  title,
  description,
  children,
  sx,
  contentSx,
}: ExportFilterSectionProps) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 1.25,
        minWidth: 0,
        minHeight: 0,
        maxWidth: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        ...sx,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, lineHeight: 1.3, flexShrink: 0 }}
      >
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.25,
            mb: 0.75,
            lineHeight: 1.35,
            flexShrink: 0,
          }}
        >
          {description}
        </Typography>
      ) : (
        <Box sx={{ mb: 0.75, flexShrink: 0 }} />
      )}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowX: "hidden",
          overflowY: "auto",
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

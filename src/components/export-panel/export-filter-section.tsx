import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type ExportFilterSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function ExportFilterSection({
  title,
  description,
  children,
}: ExportFilterSectionProps) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 1.25,
        minWidth: 0,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.25, mb: 0.75, lineHeight: 1.35 }}
        >
          {description}
        </Typography>
      ) : (
        <Box sx={{ mb: 0.75 }} />
      )}
      {children}
    </Box>
  );
}

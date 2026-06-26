import { Box } from "@mui/material";
import { Fragment, type ReactNode } from "react";
import { getWotlkItemName } from "../../data/wotlk-item-names.ts";
import { useItemTooltipLocale } from "../../hooks/use-item-tooltip-locale.ts";
import { buildWowItemUrl } from "../../utils/wow-item-url.ts";

const itemLinkSx = {
  color: "inherit",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
} as const;

type WowItemLinkProps = {
  itemId: number;
  children?: ReactNode;
};

export function WowItemLink({ itemId, children }: WowItemLinkProps) {
  const { locale } = useItemTooltipLocale();
  const label = children ?? getWotlkItemName(itemId, locale) ?? `#${itemId}`;

  return (
    <Box
      component="a"
      href={buildWowItemUrl(itemId, locale)}
      target="_blank"
      rel="noopener noreferrer"
      sx={itemLinkSx}
    >
      {label}
    </Box>
  );
}

type WowItemAlternativesProps = {
  itemIds: readonly number[];
  emptyLabel?: string;
};

export function WowItemAlternatives({
  itemIds,
  emptyLabel = "—",
}: WowItemAlternativesProps) {
  if (itemIds.length === 0) {
    return <>{emptyLabel}</>;
  }

  return (
    <>
      {itemIds.map((itemId, index) => (
        <Fragment key={`${itemId}-${index}`}>
          {index > 0 ? " / " : null}
          <WowItemLink itemId={itemId} />
        </Fragment>
      ))}
    </>
  );
}

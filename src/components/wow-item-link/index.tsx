import { Box } from "@mui/material";
import { Fragment, type ReactNode } from "react";
import { getWotlkItemName } from "../../data/wotlk-item-names.ts";
import { useItemTooltipLocale } from "../../hooks/use-item-tooltip-locale.ts";
import { buildWowItemUrl } from "../../utils/wow-item-url.ts";
import { wowItemLinkSx } from "./item-link-styles.ts";

type WowItemLinkProps = {
  itemId: number;
  children?: ReactNode;
  /** Override ilvl color palette (e.g. bright colors on dark tooltip surfaces). */
  linkColorMode?: "light" | "dark";
};

export function WowItemLink({ itemId, children, linkColorMode }: WowItemLinkProps) {
  const { locale } = useItemTooltipLocale();
  const label = children ?? getWotlkItemName(itemId, locale) ?? `#${itemId}`;

  return (
    <Box
      component="a"
      className="wow-item-link"
      href={buildWowItemUrl(itemId, locale)}
      target="_blank"
      rel="noopener noreferrer"
      sx={wowItemLinkSx(itemId, linkColorMode)}
    >
      {label}
    </Box>
  );
}

type WowItemAlternativesProps = {
  itemIds: readonly number[];
  emptyLabel?: string;
  linkColorMode?: "light" | "dark";
};

export function WowItemAlternatives({
  itemIds,
  emptyLabel = "—",
  linkColorMode,
}: WowItemAlternativesProps) {
  if (itemIds.length === 0) {
    return <>{emptyLabel}</>;
  }

  return (
    <>
      {itemIds.map((itemId, index) => (
        <Fragment key={`${itemId}-${index}`}>
          {index > 0 ? " / " : null}
          <WowItemLink itemId={itemId} linkColorMode={linkColorMode} />
        </Fragment>
      ))}
    </>
  );
}

import conquestIcon from "./conquest.png";
import frostIcon from "./frost.png";
import heroismIcon from "./heroism.png";
import triumphIcon from "./triumph.png";
import valorIcon from "./valor.png";

export const EmblemKey = {
  CONQUEST: "conquest",
  FROST: "frost",
  HEROISM: "heroism",
  TRIUMPH: "triumph",
  VALOR: "valor",
} as const;

export type EmblemKey = (typeof EmblemKey)[keyof typeof EmblemKey];

export const emblemIcons: Record<EmblemKey, string> = {
  [EmblemKey.CONQUEST]: conquestIcon,
  [EmblemKey.FROST]: frostIcon,
  [EmblemKey.HEROISM]: heroismIcon,
  [EmblemKey.TRIUMPH]: triumphIcon,
  [EmblemKey.VALOR]: valorIcon,
};


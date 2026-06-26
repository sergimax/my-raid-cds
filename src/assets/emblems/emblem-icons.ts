import conquestIcon from "./conquest.webp";
import frostIcon from "./frost.webp";
import heroismIcon from "./heroism.webp";
import triumphIcon from "./triumph.webp";
import valorIcon from "./valor.webp";

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

export const EMBLEM_OPTIONS = Object.values(EmblemKey);

export const emblemLabels: Record<EmblemKey, string> = {
  [EmblemKey.CONQUEST]: "Conquest",
  [EmblemKey.FROST]: "Frost",
  [EmblemKey.HEROISM]: "Heroism",
  [EmblemKey.TRIUMPH]: "Triumph",
  [EmblemKey.VALOR]: "Valor",
};

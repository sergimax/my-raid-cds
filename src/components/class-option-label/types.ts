import type { TypographyProps } from "@mui/material";
import type { CharacterClass } from "../../types/characters.ts";

export type ClassOptionLabelProps = {
  characterClass: CharacterClass;
  iconSize?: number;
  variant?: TypographyProps["variant"];
};

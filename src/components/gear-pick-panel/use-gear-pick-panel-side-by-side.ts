import { useMediaQuery } from "@mui/material";
import { GEAR_PICK_SIDE_BY_SIDE_MQ } from "./constants.ts";

export function useGearPickPanelSideBySide(): boolean {
  return useMediaQuery(GEAR_PICK_SIDE_BY_SIDE_MQ);
}

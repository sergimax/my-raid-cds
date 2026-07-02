import chestIcon from "./chest.png";
import feetIcon from "./feet.png";
import fingerIcon from "./finger.png";
import handsIcon from "./hands.png";
import headIcon from "./head.png";
import legsIcon from "./legs.png";
import mainHandIcon from "./main-hand.png";
import neckIcon from "./neck.png";
import offHandIcon from "./off-hand.png";
import rangedIcon from "./ranged.png";
import shoulderIcon from "./shoulder.png";
import trinketIcon from "./trinket.png";
import waistIcon from "./waist.png";
import wristIcon from "./wrist.png";

/** WoW paper doll empty-slot icons keyed by WowSims gear slot index (0–16). */
export const gearSlotIcons = {
  0: headIcon,
  1: neckIcon,
  2: shoulderIcon,
  3: chestIcon, // Back uses the same placeholder as Chest in WotLK UI
  4: chestIcon,
  5: wristIcon,
  6: handsIcon,
  7: waistIcon,
  8: legsIcon,
  9: feetIcon,
  10: fingerIcon,
  11: fingerIcon,
  12: trinketIcon,
  13: trinketIcon,
  14: mainHandIcon,
  15: offHandIcon,
  16: rangedIcon,
} as const;

export function getGearSlotIcon(slot: number): string | undefined {
  return gearSlotIcons[slot as keyof typeof gearSlotIcons];
}

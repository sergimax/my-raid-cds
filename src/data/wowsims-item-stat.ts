/** WowSims stats array indices (sim/core/stats/stats.go). */
export const WowSimsItemStat = {
  Strength: 0,
  Agility: 1,
  Stamina: 2,
  Intellect: 3,
  Spirit: 4,
  SpellPower: 5,
  MP5: 6,
  SpellHit: 7,
  SpellCrit: 8,
  SpellHaste: 9,
  SpellPenetration: 10,
  AttackPower: 11,
  MeleeHit: 12,
  MeleeCrit: 13,
  MeleeHaste: 14,
  ArmorPenetration: 15,
  Expertise: 16,
  RangedAttackPower: 21,
  Defense: 22,
  Block: 23,
  BlockValue: 24,
  Dodge: 25,
  Parry: 26,
  Resilience: 27,
} as const;

export type WowSimsItemStatIndex =
  (typeof WowSimsItemStat)[keyof typeof WowSimsItemStat];

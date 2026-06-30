import type { RaidKey } from "./raid-names.ts";
import { ClassName, type ClassName as ClassNameType } from "../types/characters.ts";
import type {
  TierSetTokenDefinition,
  TierSetTokenDropSource,
  TierSetTokenType,
  TierSetTier,
} from "../types/tier-sets.ts";
import { DungeonDifficulty } from "../types/dungeons.ts";

/** Classes that can turn in each token category (Ulduar Lost / ToC Regalia / ICC Mark). */
const T8_TOKEN_TYPE_CLASSES: Record<TierSetTokenType, readonly ClassNameType[]> = {
  vanquisher: [
    ClassName.DeathKnight,
    ClassName.Druid,
    ClassName.Mage,
    ClassName.Rogue,
  ],
  protector: [ClassName.Hunter, ClassName.Shaman, ClassName.Warrior],
  conqueror: [ClassName.Paladin, ClassName.Priest, ClassName.Warlock],
};

/** ToC Regalia / Triumph of the Grand * tokens. */
const T9_TOKEN_TYPE_CLASSES: Record<TierSetTokenType, readonly ClassNameType[]> = {
  vanquisher: [
    ClassName.DeathKnight,
    ClassName.Druid,
    ClassName.Mage,
    ClassName.Rogue,
  ],
  protector: [ClassName.Hunter, ClassName.Shaman, ClassName.Warrior],
  conqueror: [ClassName.Paladin, ClassName.Priest, ClassName.Warlock],
};

/** ICC Mark of Sanctification tokens. */
const T10_TOKEN_TYPE_CLASSES: Record<TierSetTokenType, readonly ClassNameType[]> = {
  vanquisher: [
    ClassName.DeathKnight,
    ClassName.Druid,
    ClassName.Mage,
    ClassName.Rogue,
  ],
  protector: [ClassName.Hunter, ClassName.Shaman, ClassName.Warrior],
  conqueror: [ClassName.Paladin, ClassName.Priest, ClassName.Warlock],
};

export const TIER_SET_TOKEN_TYPE_CLASSES_BY_TIER: Record<
  TierSetTier,
  Record<TierSetTokenType, readonly ClassNameType[]>
> = {
  t8: T8_TOKEN_TYPE_CLASSES,
  t9: T9_TOKEN_TYPE_CLASSES,
  t10: T10_TOKEN_TYPE_CLASSES,
};

export function canClassUseTierSetToken(
  className: ClassNameType,
  tokenItemId: number,
): boolean {
  const token = getTierSetToken(tokenItemId);
  if (!token) {
    return true;
  }

  return TIER_SET_TOKEN_TYPE_CLASSES_BY_TIER[token.tier][token.tokenType].includes(
    className,
  );
}

type TokenNameSeed = {
  itemId: number;
  tokenType: TierSetTokenType;
  tier: TierSetTier;
  heroic: boolean;
  names: { en: string; ru: string };
};

const iccNormalMarkDrops: TierSetTokenDropSource[] = [
  {
    raidKey: "icecrownCitadel",
    size: 10,
    difficulty: DungeonDifficulty.HEROIC,
  },
  {
    raidKey: "icecrownCitadel",
    size: 25,
    difficulty: DungeonDifficulty.NORMAL,
  },
  {
    raidKey: "icecrownCitadel",
    size: 25,
    difficulty: DungeonDifficulty.HEROIC,
  },
];

const iccHeroicMarkDrops: TierSetTokenDropSource[] = [
  {
    raidKey: "icecrownCitadel",
    size: 25,
    difficulty: DungeonDifficulty.HEROIC,
  },
];

const tocNormalTokenDrops: TierSetTokenDropSource[] = [
  {
    raidKey: "trialOfTheCrusader",
    size: 10,
    difficulty: DungeonDifficulty.HEROIC,
  },
  {
    raidKey: "trialOfTheCrusader",
    size: 25,
    difficulty: DungeonDifficulty.NORMAL,
  },
  {
    raidKey: "trialOfTheCrusader",
    size: 25,
    difficulty: DungeonDifficulty.HEROIC,
  },
];

const tocHeroicTokenDrops: TierSetTokenDropSource[] = [
  {
    raidKey: "trialOfTheCrusader",
    size: 25,
    difficulty: DungeonDifficulty.HEROIC,
  },
];

const tokenSeeds: TokenNameSeed[] = [
  {
    itemId: 52025,
    tokenType: "vanquisher",
    tier: "t10",
    heroic: false,
    names: {
      en: "Vanquisher's Mark of Sanctification",
      ru: "Знак освящения завоевателя",
    },
  },
  {
    itemId: 52026,
    tokenType: "protector",
    tier: "t10",
    heroic: false,
    names: {
      en: "Protector's Mark of Sanctification",
      ru: "Знак освящения защитника",
    },
  },
  {
    itemId: 52027,
    tokenType: "conqueror",
    tier: "t10",
    heroic: false,
    names: {
      en: "Conqueror's Mark of Sanctification",
      ru: "Знак освящения покорителя",
    },
  },
  {
    itemId: 52028,
    tokenType: "vanquisher",
    tier: "t10",
    heroic: true,
    names: {
      en: "Vanquisher's Mark of Sanctification (Heroic)",
      ru: "Знак освящения завоевателя (героич.)",
    },
  },
  {
    itemId: 52029,
    tokenType: "protector",
    tier: "t10",
    heroic: true,
    names: {
      en: "Protector's Mark of Sanctification (Heroic)",
      ru: "Знак освящения защитника (героич.)",
    },
  },
  {
    itemId: 52030,
    tokenType: "conqueror",
    tier: "t10",
    heroic: true,
    names: {
      en: "Conqueror's Mark of Sanctification (Heroic)",
      ru: "Знак освящения покорителя (героич.)",
    },
  },
  {
    itemId: 47559,
    tokenType: "vanquisher",
    tier: "t9",
    heroic: false,
    names: {
      en: "Regalia of the Grand Vanquisher",
      ru: "Регалии верховного завоевателя",
    },
  },
  {
    itemId: 47558,
    tokenType: "protector",
    tier: "t9",
    heroic: false,
    names: {
      en: "Regalia of the Grand Protector",
      ru: "Регалии верховного защитника",
    },
  },
  {
    itemId: 47557,
    tokenType: "conqueror",
    tier: "t9",
    heroic: false,
    names: {
      en: "Regalia of the Grand Conqueror",
      ru: "Регалии верховного покорителя",
    },
  },
  {
    itemId: 47554,
    tokenType: "vanquisher",
    tier: "t9",
    heroic: true,
    names: {
      en: "Triumph of the Grand Vanquisher",
      ru: "Триумф верховного завоевателя",
    },
  },
  {
    itemId: 47556,
    tokenType: "protector",
    tier: "t9",
    heroic: true,
    names: {
      en: "Triumph of the Grand Protector",
      ru: "Триумф верховного защитника",
    },
  },
  {
    itemId: 47555,
    tokenType: "conqueror",
    tier: "t9",
    heroic: true,
    names: {
      en: "Triumph of the Grand Conqueror",
      ru: "Триумф верховного покорителя",
    },
  },
];

function dropsForSeed(seed: TokenNameSeed): readonly TierSetTokenDropSource[] {
  if (seed.tier === "t10") {
    return seed.heroic ? iccHeroicMarkDrops : iccNormalMarkDrops;
  }
  if (seed.tier === "t9") {
    return seed.heroic ? tocHeroicTokenDrops : tocNormalTokenDrops;
  }
  return [];
}

export const tierSetTokens: readonly TierSetTokenDefinition[] = tokenSeeds.map(
  (seed) => ({
    ...seed,
    dropsFrom: dropsForSeed(seed),
  }),
);

const tokensByItemId = new Map(
  tierSetTokens.map((token) => [token.itemId, token]),
);

export function getTierSetToken(itemId: number): TierSetTokenDefinition | undefined {
  return tokensByItemId.get(itemId);
}

export function getTierSetTokenName(
  itemId: number,
  locale: "en" | "ru",
): string | undefined {
  const token = tokensByItemId.get(itemId);
  return token?.names[locale];
}

export function dungeonDropsTierSetToken(
  dungeon: Pick<
    { raidKey?: RaidKey; size: number; difficulty: string },
    "raidKey" | "size" | "difficulty"
  >,
  tokenItemId: number,
): boolean {
  const token = tokensByItemId.get(tokenItemId);
  if (!token || !dungeon.raidKey) {
    return false;
  }

  return token.dropsFrom.some(
    (source) =>
      source.raidKey === dungeon.raidKey &&
      source.size === dungeon.size &&
      source.difficulty === dungeon.difficulty,
  );
}

export const DungeonMode = {
  HEROIC: "Heroic",
  NORMAL: "Normal",
} as const;

export type DungeonMode = (typeof DungeonMode)[keyof typeof DungeonMode];

export type Dungeon = {
  name: string;
  size: 10 | 20 | 25 | 40;
  itemLevel: Array<number>;
  mode: DungeonMode;
};

export const DungeonList: Array<Dungeon> = [
  { name: "Наксраммас", size: 10, itemLevel: [200], mode: "Normal" },
  { name: "Наксраммас", size: 25, itemLevel: [213], mode: "Normal" },
  {
    name: "Обсидиановое святилище",
    size: 10,
    itemLevel: [200, 213],
    mode: "Normal",
  },
  {
    name: "Обсидиановое святилище",
    size: 25,
    itemLevel: [213, 226],
    mode: "Normal",
  },
  { name: "Логово Ониксии", size: 10, itemLevel: [232], mode: "Normal" },
  { name: "Логово Ониксии", size: 25, itemLevel: [245], mode: "Normal" },
  { name: "Склеп Аркавона", size: 10, itemLevel: [232, 251], mode: "Normal" },
  { name: "Склеп Аркавона", size: 25, itemLevel: [245, 264], mode: "Normal" },
  { name: "Испытание крестоносца", size: 10, itemLevel: [232], mode: "Normal" },
  { name: "Испытание крестоносца", size: 10, itemLevel: [245], mode: "Heroic" },
  { name: "Испытание крестоносца", size: 25, itemLevel: [245], mode: "Normal" },
  { name: "Испытание крестоносца", size: 25, itemLevel: [258], mode: "Heroic" },
  { name: "Ульдуар", size: 10, itemLevel: [219, 232], mode: "Normal" },
  { name: "Ульдуар", size: 25, itemLevel: [226, 239], mode: "Normal" },
  { name: "ЦЛК", size: 10, itemLevel: [251, 258], mode: "Normal" },
  { name: "ЦЛК", size: 10, itemLevel: [264, 271], mode: "Heroic" },
  { name: "ЦЛК", size: 25, itemLevel: [264, 271], mode: "Normal" },
  { name: "ЦЛК", size: 25, itemLevel: [277, 284], mode: "Heroic" },
  { name: "Рубиновое святилище", size: 10, itemLevel: [258], mode: "Normal" },
  { name: "Рубиновое святилище", size: 10, itemLevel: [271], mode: "Heroic" },
  { name: "Рубиновое святилище", size: 25, itemLevel: [271], mode: "Normal" },
  { name: "Рубиновое святилище", size: 25, itemLevel: [284], mode: "Heroic" },
];

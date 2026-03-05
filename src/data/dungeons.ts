import type { Dungeon } from "../types/dungeons.ts";
import { DungeonMode } from "../types/dungeons.ts";

export const DungeonList: Array<Dungeon> = [
  { name: "Наксрамас", size: 10, itemLevel: [200], mode: DungeonMode.NORMAL },
  { name: "Наксрамас", size: 25, itemLevel: [213], mode: DungeonMode.NORMAL },
  {
    name: "Обсидиановое святилище",
    size: 10,
    itemLevel: [200, 213],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Обсидиановое святилище",
    size: 25,
    itemLevel: [213, 226],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Логово Ониксии",
    size: 10,
    itemLevel: [232],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Логово Ониксии",
    size: 25,
    itemLevel: [245],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Склеп Аркавона",
    size: 10,
    itemLevel: [232, 251],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Склеп Аркавона",
    size: 25,
    itemLevel: [245, 264],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Испытание крестоносца",
    size: 10,
    itemLevel: [232],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Испытание крестоносца",
    size: 10,
    itemLevel: [245],
    mode: DungeonMode.HEROIC,
  },
  {
    name: "Испытание крестоносца",
    size: 25,
    itemLevel: [245],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Испытание крестоносца",
    size: 25,
    itemLevel: [258],
    mode: DungeonMode.HEROIC,
  },
  {
    name: "Ульдуар",
    size: 10,
    itemLevel: [219, 232],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Ульдуар",
    size: 25,
    itemLevel: [226, 239],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Цитадель Ледяной Короны",
    size: 10,
    itemLevel: [251, 258],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Цитадель Ледяной Короны",
    size: 10,
    itemLevel: [264, 271],
    mode: DungeonMode.HEROIC,
  },
  {
    name: "Цитадель Ледяной Короны",
    size: 25,
    itemLevel: [264, 271],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Цитадель Ледяной Короны",
    size: 25,
    itemLevel: [277, 284],
    mode: DungeonMode.HEROIC,
  },
  {
    name: "Рубиновое святилище",
    size: 10,
    itemLevel: [258],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Рубиновое святилище",
    size: 10,
    itemLevel: [271],
    mode: DungeonMode.HEROIC,
  },
  {
    name: "Рубиновое святилище",
    size: 25,
    itemLevel: [271],
    mode: DungeonMode.NORMAL,
  },
  {
    name: "Рубиновое святилище",
    size: 25,
    itemLevel: [284],
    mode: DungeonMode.HEROIC,
  },
];

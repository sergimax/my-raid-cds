import type { CharacterRecord } from "./characters.ts";

/** Row shape for the Ant Design table experiment (and similar grids). */
export type AntDesignExampleRow = {
  key: string;
  name: string;
  size: number;
  mode: string;
  completions: number;
  ilvl: number;
  characters?: CharacterRecord[];
};

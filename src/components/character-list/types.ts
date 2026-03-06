import type { CharacterRecord } from "../../types/characters.ts";

export type CharacterListProps = {
  characters: CharacterRecord[];
  onDelete: (id: string) => void;
};

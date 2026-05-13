import { ConfigProvider, Table, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import type { AntDesignExampleRow } from "../../types/ant-design-example-row.ts";
import type { CharacterRecord } from "../../types/characters.ts";
import type { DungeonRecord, DungeonToggles } from "../../types/dungeons.ts";
import type { AntdExampleTableProps } from "../../types/dungeon-table.ts";
import { getStartingItemLevel } from "../../utils/dungeon-table-utils.ts";
import "./styles.css";

const BASIC_COLUMNS: ColumnsType<AntDesignExampleRow> = [
  { title: "Size", dataIndex: "size", key: "size", width: 72 },
  { title: "Mode", dataIndex: "mode", key: "mode", width: 96 },
  {
    title: "Completions",
    dataIndex: "completions",
    key: "completions",
    width: 120,
  },
  { title: "ilvl", dataIndex: "ilvl", key: "ilvl", width: 72 },
  { title: "Dungeon", dataIndex: "name", key: "name" },
];

const EXAMPLE_DATA: AntDesignExampleRow[] = [
  {
    key: "1",
    name: "Цитадель Ледяной Короны",
    size: 25,
    mode: "Heroic",
    completions: 3,
    ilvl: 277,
    characters: [],
  },
  {
    key: "2",
    name: "Рубиновое святилище",
    size: 10,
    mode: "Normal",
    completions: 0,
    ilvl: 258,
    characters: [],
  },
  {
    key: "3",
    name: "Око Вечности",
    size: 10,
    mode: "Heroic",
    completions: 1,
    ilvl: 213,
    characters: [],
  },
];

function prepareHeaderRow(characters: CharacterRecord[]) {
  const characterColumns = characters.map((character) => ({
    title: character.name,
    dataIndex: character.id,
    key: character.id,
  }));
  return [...BASIC_COLUMNS, ...characterColumns];
}

function prepareData(
  dungeons: DungeonRecord[],
  characters: CharacterRecord[],
  dungeonToggles: DungeonToggles
): AntDesignExampleRow[] {
  const characterRows = characters.map((character) => {
    const completions = dungeons.filter(
      (dungeon) => dungeonToggles[character.id]?.[dungeon.id] ?? false
    ).length;
    return {
      key: character.id,
      name: character.name,
      size: dungeons.reduce((acc, dungeon) => acc + dungeon.size, 0),
      mode: dungeons.map((dungeon) => dungeon.mode).join(" · "),
      completions,
      ilvl: dungeons.reduce(
        (acc, dungeon) => acc + getStartingItemLevel(dungeon),
        0
      ),
      characters: characters.filter((c) => c.id === character.id),
    };
  });
  return [...EXAMPLE_DATA, ...characterRows];
}

export function AntdExampleTable(props: AntdExampleTableProps) {
  const { dungeons, characters, dungeonToggles } = props;
  const headerRow = useMemo(() => prepareHeaderRow(characters), [characters]);
  const data = useMemo(
    () => prepareData(dungeons, characters, dungeonToggles),
    [dungeons, characters, dungeonToggles]
  );

  return (
    <div className="antd-example-table">
      <div>
        {characters.map((character) => (
          <div key={character.id} className="antd-example-table-character">
            <span>{character.name}</span>
            <span>{character.class?.name}</span>
          </div>
        ))}
      </div>

      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Table<AntDesignExampleRow>
          size="small"
          pagination={false}
          columns={headerRow}
          dataSource={data}
          className="antd-example-table-table"
        />
      </ConfigProvider>
    </div>
  );
}

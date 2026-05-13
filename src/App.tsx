import { AppFooter } from "./components/index.ts";
import "./App.css";
import { Button, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { generateUUID } from "./uuid.ts";

type BasicDungeonRow = {
  key: string;
  name: string;
  completionsCount: number;
  itemLevel: number[];
  mode: string;
  size: number;
  completions: Record<string, boolean>;
};

/**
 * Основные столбцы таблицы без учета добавленных персонажей
 */
const BASIC_TABLE_COLUMNS: ColumnsType<BasicDungeonRow> = [
  {
    title: "Dungeon name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Completions",
    dataIndex: "completionsCount",
    key: "completionsCount",
  },
  {
    title: "Item level",
    dataIndex: "itemLevel",
    key: "itemLevel",
  },
  {
    title: "Mode",
    dataIndex: "mode",
    key: "mode",
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size",
  },
];

/**
 * Исходные данные для таблицы
 */
const DATA_SOURCE: BasicDungeonRow[] = [
  {
    key: "1",
    name: "ICC",
    completionsCount: 0,
    itemLevel: [277],
    mode: "Heroic",
    size: 25,
    completions: {
      "1": true,
      "2": false,
      "3": false,
      "4": false,
      "5": false,
      "6": false,
      "7": false,
    },
  },
];

/**
 * Подготавка столбцов таблицы с учетом добавленных персонажей
 */
function prepareTableColumns(newCharacterList: Character[]): ColumnsType<BasicDungeonRow> {
  const result = [...BASIC_TABLE_COLUMNS];

  newCharacterList.forEach((character) => {
    result.push({
      title: character.name,
      dataIndex: character.name,
      key: character.id,
    });
  });

  return result;
}

type Character = {
  id: string;
  name: string;
  class: string;
}

/**
 * Подготовка списка подземелий
 */
function prepareDungeonList(newDungeonList: BasicDungeonRow[]): BasicDungeonRow[] {
  const result = [...DATA_SOURCE];

  newDungeonList.forEach((dungeon) => {
    result.push({
      key: generateUUID(),
      name: dungeon.name,
      completionsCount: dungeon.completionsCount,
      itemLevel: dungeon.itemLevel,
      mode: dungeon.mode,
      size: dungeon.size,
      completions: dungeon.completions,
    });
  });

  return result;
}


function App() {
  const temporaryCharacter: Character = {
    id: "1111",
    name: "TheFirstOne",
    class: "Warrior",
  };
  const temporaryDungeon: BasicDungeonRow = {
    key: "123",
    name: "ICC",
    completionsCount: 0,
    itemLevel: [277],
    mode: "Heroic",
    size: 25,
    completions: {},
  };

  const [headerRow, setHeaderRow] = useState<ColumnsType<BasicDungeonRow>>(([]));
  const [characterList, setCharacterList] = useState<Character[]>([temporaryCharacter]);
  const [dungeonList, setDungeonList] = useState<BasicDungeonRow[]>([temporaryDungeon]);

  function addCharacter(character: Character) {
    setCharacterList([...characterList, character]);
  }

  function addDungeon(dungeon: BasicDungeonRow) {
    setDungeonList([...dungeonList, dungeon]);
  }

  // function removeCharacter(id: string) {
  //   setCharacterList(characterList.filter((character) => character.id !== id));
  // }

  useEffect(() => {
    setHeaderRow(prepareTableColumns(characterList));
  }, [characterList]);

  // useEffect(() => {
  //   setDungeonList(prepareDungeonList(dungeonList));
  // }, [dungeonList]);

  return (
    <>
      <header>
        <h1>My Raid CDs</h1>
      </header>
      <main>
        <div>
          Controls:
          <Button type="primary" onClick={() => {
            console.log("add dungeon");
            addDungeon({key: generateUUID(),
              name: "Some dungeon",
              completionsCount: 0,
              itemLevel: [200],
              mode: "Normal",
              size: 10,
              completions: {}});
          }}>Add dungeon</Button>
          <br />
          <Button type="primary" onClick={() => {
            console.log("add character");
            addCharacter({id: generateUUID(), name: `New-${characterList.length + 1}`, class: "Warrior"});
          }}>Add character</Button>
        </div>
        
        <Table<BasicDungeonRow>
          columns={headerRow}
          dataSource={dungeonList}
          pagination={false}
        />

        <div>
          dungeons {dungeonList.length}
          <div>
            {dungeonList.map((dungeon) => (
              <div key={dungeon.key}>{dungeon.name} {dungeon.completionsCount} {dungeon.itemLevel} {dungeon.mode} {dungeon.size}</div>
            ))}
          </div>
        </div>


        <div>
          <h2>Characters {characterList.length}</h2>
          <div>
            {characterList.map((character) => (
              <div key={character.id}>{character.id} {character.name} {character.class}</div>
            ))}
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  );
}

export default App;

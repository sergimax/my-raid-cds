import { ConfigProvider, Table, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AntDesignExampleRow } from "./types";
import "./styles.css";

const EXAMPLE_COLUMNS: ColumnsType<AntDesignExampleRow> = [
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
  },
  {
    key: "2",
    name: "Рубиновое святилище",
    size: 10,
    mode: "Normal",
    completions: 0,
    ilvl: 258,
  },
  {
    key: "3",
    name: "Око Вечности",
    size: 10,
    mode: "Heroic",
    completions: 1,
    ilvl: 213,
  },
];

export function AntdExampleTable() {
  return (
    <div className="antd-example-table">
      <p className="antd-example-table-caption">
        Ant Design <code>Table</code> (static example)
      </p>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Table<AntDesignExampleRow>
          size="small"
          pagination={false}
          columns={EXAMPLE_COLUMNS}
          dataSource={EXAMPLE_DATA}
        />
      </ConfigProvider>
    </div>
  );
}

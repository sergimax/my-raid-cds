import { AppFooter } from "./components/index.ts";
import "./App.css";
import {
  Container,
  Stack,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

type TCharacter = {
  id: string;
  name: string;
  class: string;
  position: number;
}

type TCharacterCompletion = {
  [dungeonId: string]: boolean;
}

type TDungeon = {
  id: string;
  name: string;
  size: number;
  itemLevel: number;
  mode: string;
  completion: TCharacterCompletion[];
  position: number;
}

type THeaderRowCell = {position: number, label: string, name: string}

const DEFAULT_HEADER_ROW: THeaderRowCell[] = [
  { position: 0, label: "Dungeon Name", name: "name" },
  { position: 1, label: "Size", name: "size" },
  { position: 2, label: "Mode", name: "mode" },
  { position: 3, label: "Item Level", name: "itemLevel" },
  { position: 4, label: "Completions", name: "completions" },
  { position: 5, label: "Actions", name: "actions" },
];

const TEMPLATE_CHARACTER: TCharacter = {
  id: "321",
  name: "JohnDoe",
  class: "Warrior",
  position: 0
}

const TEMPLATE_DUNGEON: TDungeon = {
  id: "123",
  name: "Naxxramas",
  size: 10,
  itemLevel: 200,
  mode: "Normal",
  completion: [],
  position: 0
}


function App() {
  const [characters, setCharacters] = useState<TCharacter[]>([TEMPLATE_CHARACTER]);
  const [dungeons, setDungeons] = useState<TDungeon[]>([TEMPLATE_DUNGEON]);
  const [headerRow, setHeaderRow] = useState<THeaderRowCell[]>(DEFAULT_HEADER_ROW);

  useEffect(() => {
    const newHeaderRow = [...DEFAULT_HEADER_ROW, ...characters.map(character => ({ position: DEFAULT_HEADER_ROW.length + character.position, label: character.name, name: character.name }))].sort((a, b) => a.position - b.position);

    setHeaderRow(newHeaderRow);
  }, [characters, dungeons])


  const handleAddCharacter = () => {
    setCharacters([...characters, TEMPLATE_CHARACTER]);
  }

  const handleAddDungeon = () => {
    setDungeons([...dungeons, TEMPLATE_DUNGEON]);
  }

  return (
    <div className="app-shell">
      <Container className="app-main" component="main" maxWidth="sm">
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">
            My Raid CDs
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Empty shell — rebuild the UI here. Storage, types, and data modules
            are unchanged for later wiring.
          </Typography>
        </Stack>
        <div>
          Controls:
          <Button variant="contained" color="primary" onClick={handleAddCharacter}>Add new character</Button>
          <Button variant="contained" color="primary" onClick={handleAddDungeon}>Add new dungeon</Button>
        </div>


        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headerRow.map((cell) => (
                  <TableCell key={cell.name}>{cell.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dungeons.map((dungeon) => (
                <TableRow key={dungeon.id}>
                  {headerRow.map((cell) => (
                    <TableCell key={cell.name}>{dungeon[cell.name as keyof TDungeon] as string}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <AppFooter />
    </div>
  );
}

export default App;

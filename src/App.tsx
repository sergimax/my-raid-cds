import { AppFooter } from "./components/index.ts";
import "./App.css";
import { Container, Stack, Typography } from "@mui/material";

function App() {
  return (
    <div className="app-shell">
      <Container className="app-main" component="main" maxWidth="sm">
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">
            My Raid CDs
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Empty shell — rebuild the UI here. Storage, types, and data modules are
            unchanged for later wiring.
          </Typography>
        </Stack>
      </Container>
      <AppFooter />
    </div>
  );
}

export default App;

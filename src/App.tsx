import { AppHeader, RaidTrackerMain, TrackerControls } from "./components/index.ts";
import "./App.css";
import { Container } from "@mui/material";
import { RaidTrackerProvider } from "./contexts/raid-tracker-provider.tsx";

function App() {
  return (
    <RaidTrackerProvider>
      <div className="app-shell">
        <AppHeader center={<TrackerControls />} />
        <Container
          className="app-main"
          component="main"
          maxWidth={false}
          disableGutters
        >
          <RaidTrackerMain />
        </Container>
      </div>
    </RaidTrackerProvider>
  );
}

export default App;

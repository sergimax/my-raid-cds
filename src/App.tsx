import { RaidTrackerProvider } from "./contexts/raid-tracker-provider.tsx";
import { TrackerLayout } from "./components/tracker-layout/index.tsx";
import "./App.css";

function App() {
  return (
    <RaidTrackerProvider>
      <TrackerLayout />
    </RaidTrackerProvider>
  );
}

export default App;

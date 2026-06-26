import { RaidTrackerProvider } from "./contexts/raid-tracker-provider.tsx";
import { BisListsProvider } from "./contexts/bis-lists-provider.tsx";
import { TrackerLayout } from "./components/tracker-layout/index.tsx";
import "./App.css";

function App() {
  return (
    <RaidTrackerProvider>
      <BisListsProvider>
        <TrackerLayout />
      </BisListsProvider>
    </RaidTrackerProvider>
  );
}

export default App;

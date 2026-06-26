import { RaidTrackerProvider } from "./contexts/raid-tracker-provider.tsx";
import { BisListsProvider } from "./contexts/bis-lists-provider.tsx";
import { ItemTooltipLocaleProvider } from "./contexts/item-tooltip-locale-provider.tsx";
import { TrackerLayout } from "./components/tracker-layout/index.tsx";
import { WowItemTooltipsLoader } from "./components/wow-item-tooltips-loader/index.tsx";
import "./App.css";

function App() {
  return (
    <ItemTooltipLocaleProvider>
      <WowItemTooltipsLoader />
      <RaidTrackerProvider>
        <BisListsProvider>
          <TrackerLayout />
        </BisListsProvider>
      </RaidTrackerProvider>
    </ItemTooltipLocaleProvider>
  );
}

export default App;

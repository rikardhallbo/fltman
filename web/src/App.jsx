import { useSimulation } from './state/useSimulation.js'
import Header from './components/Header.jsx'
import SolarCard from './components/cards/SolarCard.jsx'
import BatteryCard from './components/cards/BatteryCard.jsx'
import WashingCard from './components/cards/WashingCard.jsx'
import DishwasherCard from './components/cards/DishwasherCard.jsx'
import RobotCard from './components/cards/RobotCard.jsx'
import ClimateCard from './components/cards/ClimateCard.jsx'
import LightingCard from './components/cards/LightingCard.jsx'

export default function App() {
  const state = useSimulation(1000)

  return (
    <div className="min-h-full bg-ink-950 text-white selection:bg-white/20">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <Header
          simTime={state.simTime}
          solar={state.solar}
          battery={state.battery}
          consumption={state.grid.consumption}
        />

        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <SolarCard solar={state.solar} simTime={state.simTime} />
          <BatteryCard battery={state.battery} />
          <ClimateCard climate={state.climate} />
          <WashingCard washing={state.washing} />
          <DishwasherCard dishwasher={state.dishwasher} />
          <RobotCard robot={state.robot} />
          <LightingCard lighting={state.lighting} />
        </main>

        <footer className="mt-12 flex items-center justify-between text-[11px] text-white/30">
          <span>Alamena Smart · prototyp med simulerad realtidsdata</span>
          <span className="num-tabular">sim 60× realtid</span>
        </footer>
      </div>
    </div>
  )
}

import { Card, BigNumber, MiniStat, StatusDot } from '../ui.jsx'

export default function SolarCard({ solar, simTime }) {
  const hour = new Date(simTime).getHours()
  const active = solar.production > 50
  const peakWatts = solar.peakToday * 1000
  return (
    <Card
      title="Solceller"
      subtitle="Tak — 8.4 kWp"
      accent={
        <StatusDot tone={active ? 'active' : 'neutral'}>
          {active ? 'Producerar' : 'Vilar'}
        </StatusDot>
      }
    >
      <BigNumber
        value={(solar.production / 1000).toFixed(2)}
        unit="kW"
        color="text-amber-200"
      />
      <div className="mt-6 grid grid-cols-3 gap-6">
        <MiniStat label="Idag" value={`${solar.todayKwh.toFixed(1)} kWh`} />
        <MiniStat label="Topp idag" value={`${(peakWatts / 1000).toFixed(2)} kW`} />
        <MiniStat label="Solhöjd" value={hour >= 12 ? 'Eftermiddag' : 'Morgon'} />
      </div>
    </Card>
  )
}

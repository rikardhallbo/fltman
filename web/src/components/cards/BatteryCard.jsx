import { Card, BigNumber, MiniStat, StatusDot, Bar } from '../ui.jsx'

export default function BatteryCard({ battery }) {
  const charging = battery.flow > 50
  const discharging = battery.flow < -50
  const tone = charging ? 'active' : discharging ? 'warning' : 'neutral'
  const label = charging ? 'Laddar' : discharging ? 'Urladdar' : 'Standby'

  const storedKwh = (battery.charge / 100) * battery.capacity
  const hoursLeft =
    discharging && Math.abs(battery.flow) > 50
      ? (storedKwh / (Math.abs(battery.flow) / 1000)).toFixed(1)
      : null

  return (
    <Card
      title="Hembatteri"
      subtitle={`${battery.capacity.toFixed(1)} kWh kapacitet`}
      accent={<StatusDot tone={tone}>{label}</StatusDot>}
    >
      <BigNumber
        value={battery.charge.toFixed(0)}
        unit="%"
        color="text-emerald-200"
      />
      <div className="mt-4">
        <Bar value={battery.charge} color="bg-gradient-to-r from-emerald-400/70 to-emerald-300" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <MiniStat label="Lagrat" value={`${storedKwh.toFixed(1)} kWh`} />
        <MiniStat
          label="Effekt"
          value={`${battery.flow >= 0 ? '+' : '−'}${Math.abs(battery.flow / 1000).toFixed(2)} kW`}
        />
        <MiniStat
          label={discharging ? 'Räcker ca' : 'Cykler i mån.'}
          value={discharging && hoursLeft ? `${hoursLeft} h` : '42'}
        />
      </div>
    </Card>
  )
}

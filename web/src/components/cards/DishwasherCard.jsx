import { Card, MiniStat, StatusDot, Bar } from '../ui.jsx'

export default function DishwasherCard({ dishwasher }) {
  const tone =
    dishwasher.status === 'running'
      ? 'running'
      : dishwasher.status === 'done'
        ? 'active'
        : 'neutral'
  const label =
    dishwasher.status === 'running'
      ? 'Diskar'
      : dishwasher.status === 'done'
        ? 'Klar'
        : 'Ledig'
  const remain = Math.max(
    0,
    Math.round((1 - dishwasher.progress) * dishwasher.totalMinutes),
  )
  const remainStr =
    remain >= 60 ? `${Math.floor(remain / 60)}h ${remain % 60}m` : `${remain}m`

  return (
    <Card
      title="Diskmaskin"
      subtitle="Kök"
      accent={<StatusDot tone={tone}>{label}</StatusDot>}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-light text-white num-tabular">
          {dishwasher.status === 'idle' ? 'Standby' : remainStr}
        </span>
        <span className="text-sm text-white/45">{dishwasher.program}</span>
      </div>
      <div className="mt-4">
        <Bar
          value={dishwasher.progress * 100}
          color="bg-gradient-to-r from-violet-400/70 to-fuchsia-300"
        />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <MiniStat
          label="Förbrukning"
          value={dishwasher.status === 'running' ? '1.4 kWh' : '— kWh'}
        />
        <MiniStat
          label="Vatten"
          value={dishwasher.status === 'running' ? '9.8 L' : '— L'}
        />
        <MiniStat label="Salt" value="OK" />
      </div>
    </Card>
  )
}

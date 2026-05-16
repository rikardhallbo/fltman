import { Card, MiniStat, StatusDot, Bar } from '../ui.jsx'

function minutesLeft(w) {
  return Math.max(0, Math.round((1 - w.progress) * w.totalMinutes))
}

export default function WashingCard({ washing }) {
  const tone =
    washing.status === 'running'
      ? 'running'
      : washing.status === 'done'
        ? 'active'
        : 'neutral'
  const label =
    washing.status === 'running'
      ? 'Tvättar'
      : washing.status === 'done'
        ? 'Klar'
        : 'Ledig'
  const remain = minutesLeft(washing)
  const remainStr =
    remain >= 60 ? `${Math.floor(remain / 60)}h ${remain % 60}m` : `${remain}m`

  return (
    <Card
      title="Tvättmaskin"
      subtitle="Tvättstuga"
      accent={<StatusDot tone={tone}>{label}</StatusDot>}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-light text-white num-tabular">
          {washing.status === 'idle' ? '—' : remainStr}
        </span>
        <span className="text-sm text-white/45">{washing.program}</span>
      </div>
      <div className="mt-4">
        <Bar
          value={washing.progress * 100}
          color="bg-gradient-to-r from-sky-400/70 to-cyan-300"
        />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <MiniStat label="Temperatur" value={`${washing.tempC}°C`} />
        <MiniStat label="Total cykel" value={`${washing.totalMinutes} min`} />
        <MiniStat label="Klar kl." value={finishedAt(washing)} />
      </div>
    </Card>
  )
}

function finishedAt(w) {
  if (w.status !== 'running') return '—'
  const ms = minutesLeft(w) * 60_000
  return new Date(Date.now() + ms).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

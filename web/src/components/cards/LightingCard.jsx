import { Card, StatusDot, MiniStat } from '../ui.jsx'

export default function LightingCard({ lighting }) {
  const zonesOn = lighting.zones.filter((z) => z.on)
  const avgBrightness = zonesOn.length
    ? zonesOn.reduce((s, z) => s + z.brightness, 0) / zonesOn.length
    : 0
  const tone = zonesOn.length === 0 ? 'neutral' : 'active'

  return (
    <Card
      title="Belysning"
      subtitle={`${zonesOn.length} av ${lighting.zones.length} zoner aktiva`}
      accent={
        <StatusDot tone={tone}>
          {zonesOn.length === 0 ? 'Släckt' : 'Aktiv'}
        </StatusDot>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        {lighting.zones.map((z) => (
          <div
            key={z.name}
            className={
              'flex items-center justify-between rounded-lg px-3 py-2.5 ring-1 ring-inset transition-colors ' +
              (z.on
                ? 'bg-amber-300/[0.06] ring-amber-200/20'
                : 'bg-white/[0.02] ring-white/[0.05]')
            }
          >
            <span
              className={
                'text-xs font-medium ' + (z.on ? 'text-amber-100' : 'text-white/40')
              }
            >
              {z.name}
            </span>
            <span
              className={
                'text-xs num-tabular ' + (z.on ? 'text-amber-200/80' : 'text-white/30')
              }
            >
              {z.on ? `${z.brightness.toFixed(0)} %` : 'av'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-6">
        <MiniStat
          label="Snittljusstyrka"
          value={zonesOn.length ? `${avgBrightness.toFixed(0)} %` : '—'}
        />
        <MiniStat
          label="Effekt"
          value={`${(zonesOn.reduce((s, z) => s + (z.brightness / 100) * 9, 0)).toFixed(0)} W`}
        />
      </div>
    </Card>
  )
}

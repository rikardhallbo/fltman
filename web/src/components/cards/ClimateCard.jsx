import { Card, BigNumber, MiniStat, StatusDot } from '../ui.jsx'

export default function ClimateCard({ climate }) {
  const tone =
    climate.mode === 'heating'
      ? 'warning'
      : climate.mode === 'cooling'
        ? 'running'
        : 'neutral'
  const label =
    climate.mode === 'heating'
      ? 'Värmer'
      : climate.mode === 'cooling'
        ? 'Kyler'
        : 'Balanserat'

  return (
    <Card
      title="Klimat"
      subtitle="Inomhus"
      accent={<StatusDot tone={tone}>{label}</StatusDot>}
    >
      <BigNumber
        value={climate.indoorC.toFixed(1)}
        unit="°C"
        color="text-sky-200"
      />
      <div className="mt-6 grid grid-cols-3 gap-6">
        <MiniStat label="Mål" value={`${climate.targetC.toFixed(1)} °C`} />
        <MiniStat label="Luftfukt" value={`${climate.humidity.toFixed(0)} %`} />
        <MiniStat label="Utomhus" value={`${climate.outdoorC.toFixed(1)} °C`} />
      </div>
    </Card>
  )
}

import { Card, MiniStat, StatusDot, Bar } from '../ui.jsx'

export default function RobotCard({ robot }) {
  const tone =
    robot.status === 'cleaning'
      ? 'running'
      : robot.status === 'returning'
        ? 'warning'
        : robot.battery < 20
          ? 'danger'
          : 'neutral'
  const label =
    robot.status === 'cleaning'
      ? 'Städar'
      : robot.status === 'returning'
        ? 'Återvänder'
        : 'Dockad'

  return (
    <Card
      title="Robotdammsugare"
      subtitle="Hela hemmet"
      accent={<StatusDot tone={tone}>{label}</StatusDot>}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-light text-white num-tabular">
          {robot.room}
        </span>
      </div>
      <div className="mt-4">
        <Bar
          value={robot.coveragePct}
          color="bg-gradient-to-r from-teal-400/70 to-emerald-300"
        />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <MiniStat label="Täckning" value={`${robot.coveragePct.toFixed(0)} %`} />
        <MiniStat label="Batteri" value={`${robot.battery.toFixed(0)} %`} />
        <MiniStat
          label="Nästa pass"
          value={robot.status === 'charging' ? 'Imorgon 09:00' : 'Pågår'}
        />
      </div>
    </Card>
  )
}

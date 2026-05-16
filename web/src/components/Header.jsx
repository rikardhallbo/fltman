export default function Header({ simTime, solar, battery, consumption }) {
  const date = new Date(simTime)
  const time = date.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const day = date.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const net = solar.production - consumption
  const netLabel = net >= 0 ? 'Överskott' : 'Från elnät'
  const netColor = net >= 0 ? 'text-emerald-300' : 'text-rose-300'

  return (
    <header className="flex items-center justify-between mb-10">
      <div>
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-white/90 to-white/40 grid place-items-center text-ink-950 font-bold text-sm">
            A
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-white">
              Alamena Smart
            </div>
            <div className="text-[11px] text-white/45 capitalize">{day}</div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-10 text-right num-tabular">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            Produktion
          </div>
          <div className="text-xl font-light text-amber-200">
            {(solar.production / 1000).toFixed(2)}{' '}
            <span className="text-xs text-white/40">kW</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            Förbrukning
          </div>
          <div className="text-xl font-light text-white/90">
            {(consumption / 1000).toFixed(2)}{' '}
            <span className="text-xs text-white/40">kW</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            {netLabel}
          </div>
          <div className={`text-xl font-light ${netColor}`}>
            {Math.abs(net / 1000).toFixed(2)}{' '}
            <span className="text-xs text-white/40">kW</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            Batteri
          </div>
          <div className="text-xl font-light text-emerald-200">
            {battery.charge.toFixed(0)}
            <span className="text-xs text-white/40">%</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            Klocka
          </div>
          <div className="text-xl font-light text-white">{time}</div>
        </div>
      </div>
    </header>
  )
}

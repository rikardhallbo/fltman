export function Card({ title, subtitle, accent, children, footer, className = '' }) {
  return (
    <div
      className={
        'group relative flex flex-col rounded-2xl bg-ink-900 border border-white/[0.06] p-6 shadow-glow transition-colors hover:border-white/[0.12] ' +
        className
      }
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-medium">
            {title}
          </div>
          {subtitle && (
            <div className="text-sm text-white/55 mt-1">{subtitle}</div>
          )}
        </div>
        {accent}
      </div>
      <div className="flex-1">{children}</div>
      {footer && (
        <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-white/45">
          {footer}
        </div>
      )}
    </div>
  )
}

export function StatusDot({ tone = 'neutral', children }) {
  const tones = {
    active: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30',
    running: 'bg-sky-400/15 text-sky-300 ring-sky-400/30',
    warning: 'bg-amber-400/15 text-amber-300 ring-amber-400/30',
    danger: 'bg-rose-400/15 text-rose-300 ring-rose-400/30',
    neutral: 'bg-white/[0.06] text-white/55 ring-white/10',
  }
  return (
    <span
      className={
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full ring-1 ring-inset ' +
        tones[tone]
      }
    >
      <span
        className={
          'h-1.5 w-1.5 rounded-full ' +
          (tone === 'active'
            ? 'bg-emerald-300 animate-pulse'
            : tone === 'running'
              ? 'bg-sky-300 animate-pulse'
              : tone === 'warning'
                ? 'bg-amber-300'
                : tone === 'danger'
                  ? 'bg-rose-300'
                  : 'bg-white/40')
        }
      />
      {children}
    </span>
  )
}

export function BigNumber({ value, unit, hint, color = 'text-white' }) {
  return (
    <div className="flex items-baseline gap-2 num-tabular">
      <span className={`text-5xl font-light tracking-tight ${color}`}>{value}</span>
      {unit && <span className="text-lg text-white/45 font-light">{unit}</span>}
      {hint && <span className="ml-2 text-xs text-white/40">{hint}</span>}
    </div>
  )
}

export function Bar({ value, max = 100, color = 'bg-white/80' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className={`h-full ${color} transition-[width] duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function MiniStat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-sm text-white/85 num-tabular">{value}</span>
    </div>
  )
}

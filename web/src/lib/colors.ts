// Art direction: hue rotation accent system.
// hsl(index * 22.5, 72%, 62%)
export function agentAccent(index: number): string {
  const hue = (index * 22.5) % 360;
  return `hsl(${hue} 72% 62%)`;
}

export function agentAccentSoft(index: number, alpha = 0.4): string {
  const hue = (index * 22.5) % 360;
  return `hsla(${hue}, 72%, 62%, ${alpha})`;
}

export const STATE = {
  bgBase: 'hsl(225 12% 8%)',
  bgSurface: 'hsl(225 10% 12%)',
  bgOverlay: 'hsl(225 10% 16%)',
  idle: 'hsl(225 8% 38%)',
  edgeStatic: 'hsl(225 8% 22%)',
  error: 'hsl(0 85% 58%)',
  waiting: 'hsl(45 90% 55%)',
  queued: 'hsl(225 20% 45%)',
  success: 'hsl(140 60% 52%)'
};

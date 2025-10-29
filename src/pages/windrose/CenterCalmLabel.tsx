export function CenterCalmLabel({ viewBox, calmRate }: { viewBox?: any, calmRate: number; }) {
  if (!viewBox || calmRate === null) return null;
  const { cx, cy } = viewBox;
  return (
    <g>
      <circle cx={cx} cy={cy} r={28} className="fill-background stroke-muted" />
      <text x={cx} y={cy - 2} textAnchor="middle" className="text-[12px] fill-foreground">
        Calm
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="text-[12px] font-semibold fill-foreground">
        {calmRate.toFixed(2)}
      </text>
    </g>
  )
}
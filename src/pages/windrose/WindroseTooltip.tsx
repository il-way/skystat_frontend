export function WindroseTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  const p = payload.find((x: any) => x && x.value != null) ?? payload[0];
  const row = p?.payload ?? {};
  const dataKey: string = p?.dataKey ?? "";
  const binLabel =
    (row.__label_map && row.__label_map[dataKey]) || (p?.name ?? dataKey);
  const rate = p?.value ?? 0;
  const direction = row.direction ?? label;

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow">
      <div className="font-medium">{direction}</div>
      <div className="flex gap-2">
        <span className="text-muted-foreground">Speed:</span>
        <span>{binLabel}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground">Rate:</span>
        <span>{rate.toFixed(2)}%</span>
      </div>
    </div>
  );
}

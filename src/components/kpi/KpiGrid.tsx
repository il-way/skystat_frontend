import type { KpiValues } from "@/types/components/kpi/KpiValues";
import type { MetarRow } from "@/types/metar/MetarRow";
import KpiCard from "./KpiCard";

export function KpiCardGrid({ kpis, rows }: { kpis: KpiValues; rows: MetarRow[]}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={kpis.sampleSize.toString()} hint="rows" />
      <KpiCard title="Avg Visibility" value={kpis.avgVisibility.toString()} hint="m" />
      <KpiCard title="Avg Ceiling" value={kpis.avgCeiling.toString()} hint="ft" />
      <KpiCard title="Avg WindSpeed" value={kpis.avgWindSpeed.toString()} hint="kt" />
    </div>
  )
}
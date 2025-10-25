import type { DashboardKpiValues } from "@/types/components/kpi/DashboardKpiValues";
import KpiCard from "./KpiCard";

export function DashboardKpiCardGrid({ kpis }: { kpis: DashboardKpiValues }) {
  const { sampleSize, avgVisibilityM, avgCeilingFt, avgWindSpeedKt } = kpis;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint="METAR" />
      <KpiCard title="Avg Visibility" value={avgVisibilityM.toString()} hint="m" />
      <KpiCard title="Avg Ceiling" value={avgCeilingFt.toString()} hint="ft" />
      <KpiCard title="Avg WindSpeed" value={avgWindSpeedKt.toString()} hint="kt" />
    </div>
  )
}
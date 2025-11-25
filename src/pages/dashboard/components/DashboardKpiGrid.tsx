import type { DashboardKpiValues } from "@/pages/dashboard/types/DashboardKpiValues";
import KpiCard from "../../../components/kpi/KpiCard";
import { dataCoverageHint } from "@/lib/page";

export function DashboardKpiCardGrid({ kpis }: { kpis: DashboardKpiValues }) {
  const { coverageFrom, coverageTo, sampleSize, avgVisibilityM, avgCeilingFt, avgWindSpeedKt, isFetched, hasData } = kpis;
  const coverageHint = dataCoverageHint(coverageFrom, coverageTo, isFetched, hasData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint={`${coverageHint}`} />
      <KpiCard title="Avg Visibility" value={avgVisibilityM.toString()} hint="m" />
      <KpiCard title="Avg Ceiling" value={avgCeilingFt.toString()} hint="ft" />
      <KpiCard title="Avg WindSpeed" value={avgWindSpeedKt.toString()} hint="kt" />
    </div>
  )
}


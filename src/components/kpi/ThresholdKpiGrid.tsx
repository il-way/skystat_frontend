import KpiCard from "./KpiCard";
import type { ThresholdKpiValues } from "@/types/components/kpi/ThresholdKpiValues";

export function ThresholdKpiCardGrid({ kpis }: { kpis: ThresholdKpiValues }) {
  const { sampleSize, totalDaysCount, mostFrequentMonth, mostFrequentHour } = kpis;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint="METAR" />
      <KpiCard title="Total Observed" value={totalDaysCount.toString()} hint="days" />
      <KpiCard title="Most Frequent" value={mostFrequentMonth} hint="month" />
      <KpiCard title="Most Frequent" value={mostFrequentHour} hint={`UTC time at ${mostFrequentMonth.toLocaleLowerCase()}`} />
    </div>
  )
}
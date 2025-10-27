import type { ThresholdKpiValues } from "@/types/components/kpi/ThresholdKpiValues";
import KpiCard from "./KpiCard";
import { getYearsFrom } from "@/lib/date";

export function ThresholdKpiCardGrid({ kpis }: { kpis: ThresholdKpiValues }) {
  const { coverageFrom, coverageTo, sampleSize, totalDaysCount, mostFrequentMonth, mostFrequentHour } = kpis;
  const years = getYearsFrom(coverageFrom, coverageTo);
    const coverageHint = years.every(y => y !== "")
      ? `${years[0]} ~ ${years[years.length-1]}`
      : "Not Searched"
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint={`METAR (${coverageHint})`} />
      <KpiCard title="Total Observed" value={totalDaysCount.toString()} hint="days" />
      <KpiCard title="Most Frequent" value={mostFrequentMonth} hint="month" />
      <KpiCard title="Most Frequent" value={mostFrequentHour} hint={`UTC at ${mostFrequentMonth.toLocaleLowerCase()}`} />
    </div>
  )
}
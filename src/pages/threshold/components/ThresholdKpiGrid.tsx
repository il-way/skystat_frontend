import type { ThresholdKpiValues } from "@/pages/threshold/types/ThresholdKpiValues";
import KpiCard from "../../../components/kpi/KpiCard";
import { dataCoverageHint } from "@/lib/page";

export function ThresholdKpiCardGrid({ kpis }: { kpis: ThresholdKpiValues }) {
  const { coverageFrom, coverageTo, sampleSize, totalDaysCount, mostFrequentMonth, mostFrequentHour, isFetched, hasData } = kpis;
  const coverageHint = dataCoverageHint(coverageFrom, coverageTo, isFetched, hasData);
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint={`METAR (${coverageHint})`} />
      <KpiCard title="Total Observed" value={totalDaysCount.toString()} hint="days" />
      <KpiCard title="Most Frequent" value={mostFrequentMonth} hint="month" />
      <KpiCard title="Most Frequent" value={mostFrequentHour} hint={`UTC at ${mostFrequentMonth.toLocaleLowerCase()}`} />
    </div>
  )
}
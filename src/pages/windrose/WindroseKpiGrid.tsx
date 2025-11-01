import { dataCoverageHint } from "@/lib/page";
import type { WindroseKpiValues } from "./type/WindroseKpiValues";
import { round2 } from "@/lib/math";
import KpiCard from "@/components/kpi/KpiCard";

export function WindroseKpiGrid({ kpis }: { kpis: WindroseKpiValues }) {
  const { coverageFrom, coverageTo, totalCount, sampleSize, variableSize, speedBins, directionBins, isFetched, hasData } = kpis;
  const coverageHint = dataCoverageHint(coverageFrom, coverageTo, isFetched, hasData);
  const windVariablePercent = totalCount > 0 
    ? round2((variableSize / totalCount))! : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint={`METAR (${coverageHint})`} />
      <KpiCard title="Wind Variable" value={windVariablePercent.toString()} hint="%" />
      <KpiCard title="Speed Scale" value={speedBins.length.toString()} hint="levels" />
      <KpiCard title="Direction Scale" value={directionBins.length.toString()} hint="cardinal" />
    </div>
  )
}
import { round2 } from "@/lib/math";
import KpiCard from "../../../components/kpi/KpiCard";
import type { TemperaturedKpiValues } from "@/pages/temperature/types/TemperaturedKpiValues";
import { dataCoverageHint } from "@/lib/page";

export function TemperatureKpiGrid({ kpis }: { kpis: TemperaturedKpiValues }) {
  const { coverageFrom, coverageTo, sampleSize, annualMean, annualMax, annualMin, isFetched, hasData } = kpis;
  const coverageHint = dataCoverageHint(coverageFrom, coverageTo, isFetched, hasData);
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint={`METAR (${coverageHint})`} />
      <KpiCard title="Annual Mean" value={round2(annualMean)!.toString()} hint="temperature [℃]" />
      <KpiCard title="Observed Max" value={annualMax.toString()} hint="temperature [℃]" />
      <KpiCard title="Observed Min" value={annualMin.toString()} hint="temperature [℃]" />
    </div>
  )
}